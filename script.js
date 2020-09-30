const parser = require('xml2json');
const fs = require('fs');
const path = require("path");
const json2xls = require('json2xls');
const config = require('./config');

doProcessing();


// check if path is directory or not
function isDirectory(path){
  try{
    return fs.lstatSync(path).isDirectory();
  }catch(e){
    return false;
  }
}

// do processing
function doProcessing(){
  try{
    // 1. get all the values folder in the resPath
    let defaultValuesFolder = false;
    let otherValuesFolder = [];
    const dirResData = fs.readdirSync(config.androidResPath);
    dirResData.forEach((res) => {
      if(isDirectory(config.androidResPath + "/" + res)){
        if(res === 'values'){
          // this is the default values folder
          defaultValuesFolder = true;
        }else if(res.startsWith('values')){
          // other values folder
          otherValuesFolder.push(res);
        }
      }
    });

    if(defaultValuesFolder){
      // 2. read this values folder
      readXML(otherValuesFolder);
    }else{
      // there is no default values folder
      console.log("No default values folder");
    }
  }catch(e){
    console.log(e);
  }
}

// read the xml files from the folders
function readXML(otherValuesFolder){
  try{
    const xmlFiles = fs.readdirSync(config.androidResPath + "/values");
    xmlFiles.forEach((file) => {
      if(file.endsWith(".xml")){
        // this is the XML file
        if(config.filesToIgnore.indexOf(file) === -1){
          // process this file
          const array = processXMLFile(file, "values");
          let result = [];
          for(const j in array){
            const xmlValue = array[j];
            let obj = {};
            obj['key'] = xmlValue['name'];
            obj['translatable'] = xmlValue['translatable'];
            obj['values'] = xmlValue['$t'];

            // put the empty value to other values folder. Because if the first object has not all the columns then the lib json2xls doesn't export that columns
            otherValuesFolder.forEach((folder) => {
              obj[folder] = '';
            });
          
            result.push(obj);
          }

          // process this file in another folders
          for(const k in otherValuesFolder){
            const folder = otherValuesFolder[k];
            const otherArray = processXMLFile(file, folder);
            for(const j in otherArray){
              const xmlValue = otherArray[j];
              // find the obj by key in results
              const index = result.findIndex(x => x.key === xmlValue['name']);
              if(index >= 0){
                // index found
                let obj = result[index];
                obj[folder] = xmlValue['$t'];

                result[index] = obj;
              }else{
                // insert the object
                let obj = {};
                obj['key'] = xmlValue['name'];
                obj['translatable'] = xmlValue['translatable'];
                obj[folder] = xmlValue['$t'];

                result.push(obj);
              }
            }
          }

          // export the result of this xml file
          exportCSV(file, result);

          // clear the result
          result = [];
        }
      }
    });
  }catch(e){
    console.log(e);
  }
}

// process the xml file
function processXMLFile(file, folder){
  try{
    // read the file in values default folder
    const data = fs.readFileSync(config.androidResPath + "/" + folder + "/" + file);
    if(data){
      // convert this data to json
      const parsedJson = parser.toJson(data);
      // return the string array
      return JSON.parse(parsedJson)['resources']['string'];
    }
  }catch(e){
    console.log(e.message);
  }

  return [];
}

// export csv file
function exportCSV(file, result){
  fs.writeFileSync(config.outputPath + file + '.xlsx', json2xls(result), 'binary');
  console.log("Data written to excel successfully");
}
