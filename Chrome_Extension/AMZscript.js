console.log("working")
function getASIN(url) {
    var urlArray = url.split('/')

    function getURLSlice(url2) {
        for (let each in url2) {
            if (urlArray[each] === "dp") {
                var nextSlice = Number(each) + 1
            }
        }
        return nextSlice
    }

    let nextSlice = getURLSlice(urlArray)
    let asinChunk = urlArray[nextSlice]
    let asin = asinChunk.slice(0, 10)
    console.log(asin)
    return asin
}

function is_product_page(url) {
    var urlArray = url.split('/')
    let return_val = false
    for (let each in urlArray) {
        if (urlArray[each] === "dp"){
            return_val = true
        }
    }
    return return_val
}

function main () {
    fetch(chrome.runtime.getURL('/amz.html')).then(r => r.text()).then(html => {
        var url1 = document.location.href
        let title = document.getElementById('title_feature_div')
        title.insertAdjacentHTML('afterend', html);
        chrome.storage.sync.get(['fileID'], function (result) {
            const fileID = result.fileID
            console.log(fileID)
            chrome.storage.sync.get(['order'], function (result) {
                let asin = getASIN(url1)
                console.log(result)
                const my_order = result.order
                console.log(my_order)
                let source = "https://www.oa2gsheets.com/Website/input?fileID=" + fileID + "&o=" + my_order + "&asin=" + asin
                console.log("source is" + source)
                let frame1 = document.getElementById("input_oa2gsheets")
                frame1.setAttribute("src", source)
            });
        });
    });
}

main()
window.addEventListener('popstate', function (event) {
    comsole.log("URL CHANGED")
    main()
});