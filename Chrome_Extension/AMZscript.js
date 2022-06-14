fetch(chrome.runtime.getURL('/amz.html')).then(r => r.text()).then(html => {
    let title = document.getElementById('title_feature_div')
    title.insertAdjacentHTML('afterend', html);
    chrome.storage.sync.get(['fileID'], function (result) {
        const fileID = result
        chrome.storage.sync.get(['order'], function (result){
            console.log(result)
            const my_order = result
            console.log(order)
            let source = "https://www.oa2gsheets.com/Website/input?fileID" + fileID + "&o=" + my_order
            console.log(source)
            let frame1 = document.getElementById("send_oa2gsheets")
            frame1.setAttribute("src", source)
        });
    });
  });


