# Export strings.xml to CSV file
This script is to export the strings in the Android project to CSV file

## How to use the Script
1. clone this repo
2. make sure you have the node JS installed on your system.
3. go inside the cloned repo such as `cd xml_strings_to_csv`
4. run `npm install`

## test the script
by default there are some strings in the xml files under test folder.
`config.xml` file has that path by default.
so run the command `node script.js`
and check if there are exported files in the results folder.

## Run the script for actual project
1. update `config.js` file according to your requirements such as Android Project path mainly
2. run `node script.js`

-----------
Any issues, let me know and I will be more than happy to help.