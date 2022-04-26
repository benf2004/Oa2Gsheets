function onOpen() {
  SpreadsheetApp.getUi().createMenu('Google Picker')
      .addItem('Insert Drive Folder ...', 'showPicker')
      .addToUi();
}

/**
 * Displays an HTML-service dialog in Google Sheets that contains client-side
 * JavaScript code for the Google Picker API.
 */
function showPicker() {
  var html = HtmlService.createHtmlOutputFromFile('Picker.html')
      .setWidth(600)
      .setHeight(425)
      .setSandboxMode(HtmlService.SandboxMode.IFRAME);
  SpreadsheetApp.getUi().showModalDialog(html, 'Select Folder');
}

function getOAuthToken() {
  DriveApp.getRootFolder();
  return ScriptApp.getOAuthToken();
}


/*
Function that takes item Id from Picker.html once user has made selection.
Creates clickable Url in spreadsheet.
Pastes in item Id to spreadsheet.
*/

function insertFolderURL(id){
  
  // get Google Drive folder by Id from Picker
  var folder = DriveApp.getFolderById(id);
  
  // get Googel Drive folder name
  var folderName = folder.getName();
  
  // get Google Drive folder Url
  var folderUrl = folder.getUrl();
  
  // get current spreadsheet
  var sheet = SpreadsheetApp.getActiveSheet();
  
  // get relevant cells for pasting in values
  var urlCell = sheet.getRange(4, 3);
  var idCell = sheet.getRange(6, 3);
  
  // create and set Url link to Google Drive folder
  var formula = '=HYPERLINK("' + folderUrl +  '", "' + folderName + '")';
  urlCell.setFormula(formula);
  
  // set folder Id into spreadsheet cell
  idCell.setValue(id);
  
}
