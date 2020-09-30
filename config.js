
// path of android project up to res folder
// by default it is to the test folder
exports.androidResPath = "./test";

// list of xml files to ignore
// there are some xml files in the values folder such as colors.xml and styles.xml which must be ignored
exports.filesToIgnore = [
  "array.xml", "attrs.xml", "colors.xml", "dimens.xml", "font_certs.xml", "ic_launcher_background.xml", "preloaded_fonts.xml", "styles.xml",
];

// path where to export the CSV file
// by default it will export the files in results folder
exports.outputPath = "./results/";
