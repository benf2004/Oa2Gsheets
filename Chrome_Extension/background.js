// background.js

importScripts('ExtPay.js') // or `import` / `require` if using a bundler

var extpay = ExtPay('oa2gsheets'); // Careful! See note below
extpay.startBackground();

chrome.tabs.onUpdated.addListener(
    function(tabId, changeInfo, tab) {
        // read changeInfo data and do something with it
        // like send the new url to contentscripts.js
        if (changeInfo.url) {
            chrome.tabs.sendMessage( tabId, {
                message: 'url_change',
                url: changeInfo.url
            })
        }
    }
);