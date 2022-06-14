fetch(chrome.runtime.getURL('/amz.html')).then(r => r.text()).then(html => {
    let title = document.getElementById('title_feature_div')
    title.insertAdjacentHTML('afterend', html);
    chrome.storage.sync.get(['fileID'], function (result) {
        chrome.storage.sync.get(['order'], function (order){
            let fileID = result
            let my_order = order
            let source = "https://www.oa2gsheets.com/Website/input?fileID" + fileID + "&o=" + my_order
            let frame1 = document.getElementById("send")
            frame1.setAttribute("src", source)
        });
    });
  });


