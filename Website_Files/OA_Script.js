    // setup url parsing and create variable with ASIN
    let url = window.location.search 
    const urlParams = new URLSearchParams(url);
   	var asin = decodeURI(urlParams.get("asin"))
    console.log("asin is: " + asin)

    function getFileID() {
        let cooks = document.cookie
        console.log(cooks)
    };

    getFileID();
   
    // remove header & other elements 
    // TODO: Figure out how to remove remaining elements (comments, suggested articles, share, footer)
	// const e = document.querySelector("header")
	// e.parentElement.removeChild(e)
	// const f = document.querySelector(".post-title-container")
	// f.parentElement.removeChild(f)
    // const g = document.querySelector(".post-header-container.container")
	// g.parentElement.removeChild(g)
	
      
	// define nested functions. All main operations take place in top1. 
    async function top1(checker1){
    async function main(checker){
	
	// function accepts ASIN and returns statistics from Keepa API
	async function keepa(asin){
	let key = "2voidarbtfcnosoudp9hqh97aon07aie6sagl6mt2hp9ie61cplt8se83o321ep4";
	let response = await fetch('https://api.keepa.com/product?key=' + key + '&domain=1&asin=' + asin + '&stats=0')
	const data1 = response.json()
	return data1
	};

    // call keepa function and set up for easy data access
    var object = await keepa(asin);
	var product = object['products'][0];
	var title = product['title'];
	var currentStats = object['products'][0]['stats']['current'];  
    
	// Create variables for desired statistics from Keepa JSON
	var currentRank = currentStats[3];
	var fbaFees = product["fbaFees"];
	var pickPack = fbaFees['pickAndPackFee'] / 100;
	var cats2 = product["categoryTree"];
    var cate = cats2[1]['name']
	var today = new Date();
	var curDate = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
	var asinLink = '=HYPERLINK("amazon.com/dp/' + asin + '"' + "," + '"' + asin + '"' + ")" 
	var sellLink = "https://sellercentral.amazon.com/product-search/search?q=" + asin 
    
    // decodes & recieves variables sent from query attributes in url
    var price = decodeURI(urlParams.get("price"))
    console.log("price is: " + price)
	var cogs = decodeURI(urlParams.get("cogs"))
    console.log("cogs is: " + cogs)	
	var sourceURL = decodeURI(urlParams.get("sourceurl"))
    console.log("source url is: " + sourceURL)	
	var notes = decodeURI(urlParams.get("notes"))
    console.log("notes is: " + notes)
          

	// Sets dynamic statistic array to send to spreadsheet. requires row number. 
	function dynamStats(rowStr){
	    var refPer = decodeURI(urlParams.get("refPer"))
	    console.log("refPer is: " + refPer)
      var columnDict = {
          curDate: "A",
          asinLink: "B",
          title: "C",
          roi: "D",
          currentRank: "E",
          cat: "F",
          url: "G",
          cogs: "H",
          price: "I",
          profit: "J",
          refPer: "K",
          notes: "L",
          refFee: "M",
          pickPack: "N",
          totFees: "O",
          sellLink: "P"
          };
      var refFee1 = "=" + columnDict['price'] + rowStr + "*" + columnDict['refPer'] + rowStr;
      let profit1 = "=" + columnDict['price'] + rowStr + "-" + columnDict['totFees'] + rowStr + "-" + columnDict['cogs'] + rowStr;
      let totFees1 = "=" + columnDict['refFee'] + rowStr + "+" + columnDict['pickPack'] + rowStr;
      //var margin = "=" + columnDict['profit'] + rowStr + "/" + columnDict['price'] + rowStr;
      var roi1 = "=" + columnDict['profit'] + rowStr + "/" + columnDict['cogs'] + rowStr;
      //var proceeds = "=" + columnDict['price'] + "-" + columnDict['totFees'] + rowStr;
      const infoArray = [curDate, asinLink, title, roi1, currentRank, cate, sourceURL, cogs, price, profit1, refPer, notes, refFee1, pickPack, totFees1, sellLink];
      return infoArray
	}; // end of dynamic stats function
	var infoSend = dynamStats(checker)
    return infoSend
    }; // end of main

    // accesses Google Sheets API to check how many rows have content. Returns row number to send data to.
    async function getRowNum() {
        let response = await fetch("https://content-sheets.googleapis.com/v4/spreadsheets/1eWtPhT4EJZZZW9JMLgTvWMeVrDesRsx3gAIf_JTuDxs/values/A1%3AZ1000?valueRenderOption=FORMATTED_VALUE&key=AIzaSyDQSFdTwH861Bfxq1P6fA_paWiUs-lbP6Y")
        const data2 = await response.json()
        let rowNum = data2["values"].length + 1
        return rowNum;
    };

    // sends info to Google Sheets via Gsheets API
    function sendToSheets(send, range) {
        var params = {
            // The ID of the spreadsheet to update.
            spreadsheetId: '1eWtPhT4EJZZZW9JMLgTvWMeVrDesRsx3gAIf_JTuDxs',

            // The A1 notation of the values to update.
            range: range,  //

            // How the input data should be interpreted.
            valueInputOption: 'USER_ENTERED',
        }

        var valueRangeBody = {
            "majorDimension": "COLUMNS",
            "range": range,
            "values": [send]
        }

        var request = gapi.client.sheets.spreadsheets.values.update(params, valueRangeBody);
        console.log(request);
        request.then(function (response) {
            console.log(response.result);
        }, function (reason) {
            console.error('error: ' + reason.result.error.message);
        });
    }


    // checks if ASIN is included in URL. If yes, calls main functions in relevant order.
    if (asin != "") {
        let rowFin = await getRowNum(); // gets row number
        let data1 = await main(rowFin); // gets statistics 
        var range1 = "A" + rowFin + ":P" + rowFin // creates range from row number
        console.log("range1 is " + range1);
        console.log("data 1 is" + data1);
        sendToSheets(data1, range1); // sends data to gsheets
    } else {
        console.log("error: no parameters recieved") // logs error in console if no ASIN is recieved in URL
    }
    ;
}; // end of top1
