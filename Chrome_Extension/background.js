// background.js

importScripts('ExtPay.js') // or `import` / `require` if using a bundler

var extpay = ExtPay('oa2gsheets'); // Careful! See note below
extpay.startBackground();

chrome.tabs.onUpdated.addListener(
    function(tabId, changeInfo, tab) {
        if (changeInfo.url) {
            chrome.tabs.sendMessage( tabId, {
                message: 'url_change',
                url: changeInfo.url
            })
        }
    }
);

function getCookies(domain, name, callback) {
    chrome.cookies.get({"url": domain, "name": name}, function (cookie) {
        if (callback) {
            callback(cookie.value);
        }
    });
}

const website = 'http://oa2gsheets.com/Website'
const filter = {
    url: [
        {
            urlMatches: 'https://oa2gsheets.com/Website/picker',
        },
    ],
};

chrome.webNavigation.onCommitted.addListener(() => {
    console.log("TRIGGERED")
    getCookies(website, "fileID", function (id) {
        console.log(id);
        chrome.storage.sync.set({fileID: id}, function () {
            console.log('Value is set to ' + id);
        });
    });

    getCookies(website,"order", function (id){
        console.log(id);
        chrome.storage.sync.set({order: id}, function(){
            console.log("Success adding order to sync!")
            console.log(id)
        })
    })

    getCookies(website, 'is_dynam', function(id){
        console.log(id)
        chrome.storage.sync.set({is_dynam: id}, function(){
            console.log("Success adding is_dynam to sync!")
        })
    })
}, filter);