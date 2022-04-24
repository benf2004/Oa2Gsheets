    // setup url parsing and create variable with ASIN
    let url = window.location.search 
    const urlParams = new URLSearchParams(url);
   	var asin = decodeURI(urlParams.get("asin"))
    console.log("asin is: " + asin)
   
    // remove header & other elements 
    // TODO: Figure out how to remove remaining elements (comments, suggested articles, share, footer)
	const e = document.querySelector("header")
	e.parentElement.removeChild(e)
	const f = document.querySelector(".post-title-container")
	f.parentElement.removeChild(f)
    const g = document.querySelector(".post-header-container.container")
	g.parentElement.removeChild(g)
	
      
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
      
	// Determines Refferal Percentage (refPer) by cycling through categories and checking name
	function detrmRefPer(price,cats2){
      const eightPer = [
          'Camera & Photo', 'Full-Size Appliances', "Cell Phone Devices",
          "Consumer Electronics", "Personal Computers", "Video Game Consoles"
      ];
      const groceryFee = ["Grocery & Gourmet Foods"];
      const twelvePer = ["3D Printed Products", "Automotive & Powersports", "Industrial & Scientific", "Food Service", "Janitorial & Scientific"];
      const specialFee = [
          "Electronics Accessories", "Furniture", "Compact Appliances",
          "Collectible Coins"
      ];
      const switch10 = ["Baby", "Beauty", "Health & Personal Care"];
      const fifteenPer = [
          "Books",
          "Industrial & Scientific",
          "Home & Garden",
          "Kitchen & Dining",
          "Mattresses",
          "Music",
          "Musical Instruments",
          "Office Prodcuts",
          "Outdoors",
          "Pet Supplies",
          "Software & Computer",
          "Video Games",
          "Sports",
          "Tools & Home Improvement",
          "Toys & Games",
          "Video & DVD",
          "Cell Phones & Accessories",
          "Everything Else",
          "Luggage & Travel Accessories",
          "Shoes, Handbags & Sunglasses",
      ]; 
      var refPer = 0
      for (let each in cats2){
      var catName = cats2[each]["name"]
      console.log(catName)
      for (let each1 in twelvePer){
          if (catName == twelvePer[each1]){
          refPer = .12
          }
      }
      for (let each1 in fifteenPer){
          if (catName == fifteenPer[each1]){
          refPer = .15
      };
      }
      for (let each1 in eightPer){
          if (catName == eightPer[each1]){
          refPer = .12
          }
      }
      for (let each1 in switch10){
          if (catName == eightPer[each1]){
          if (price < 10){
              refPer = 0.8
          }
          if (price >= 10){
              refPer = .15
          }
          }
      }
      }
      return refPer
	}; // end of determine refferal percentage function
          

	// Sets dynamic statistic array to send to spreadsheet. requires row number. 
	function dynamStats(rowStr){
      refPer = detrmRefPer(price,cats2)
      roi = ""
      profit = ""
      refFee = ""
      totFees = "" 
      columnDict = {
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
      var refFee = "=" + columnDict['price'] + rowStr + "*" + columnDict['refPer'] + rowStr;
      var profit = "=" + columnDict['price'] + rowStr + "-" + columnDict['totFees'] + rowStr + "-" + columnDict['cogs'] + rowStr;
      var totFees = "=" + columnDict['refFee'] + rowStr + "+" + columnDict['pickPack'] + rowStr;
      //var margin = "=" + columnDict['profit'] + rowStr + "/" + columnDict['price'] + rowStr;
      var roi = "=" + columnDict['profit'] + rowStr + "/" + columnDict['cogs'] + rowStr;
      //var proceeds = "=" + columnDict['price'] + "-" + columnDict['totFees'] + rowStr;
      const infoArray = [curDate, asinLink, title, roi, currentRank, cate, sourceURL, cogs, price, profit, refPer, notes, refFee, pickPack, totFees, sellLink];
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
            "values": [[send[0]], [send[1]], [send[2]], [send[3]], [send[4]], [send[5]], [send[6]], [send[7]], [send[8]], [send[9]], [send[10]], [send[11]], [send[12]], [send[13]], [send[14]], [send[15]]]
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


// Sign in and access APIs
function initClient() {
    var API_KEY = 'AIzaSyDQSFdTwH861Bfxq1P6fA_paWiUs-lbP6Y';

    var CLIENT_ID = '654389885336-d2pk15omntsnv2tittukrke8vbf7dsoa.apps.googleusercontent.com';

    var SCOPE = 'https://www.googleapis.com/auth/spreadsheets';

    gapi.client.init({
        'apiKey': API_KEY,
        'clientId': CLIENT_ID,
        'scope': SCOPE,
        'discoveryDocs': ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
    }).then(function () {
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSignInStatus);
        updateSignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    });
};

function handleClientLoad() {
    gapi.load('client:auth2', initClient);
};

function updateSignInStatus(isSignedIn) {
    if (isSignedIn) {
        top1(0);
    }
};

function handleSignInClick(event) {
    gapi.auth2.getAuthInstance().signIn();
};

function handleSignOutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
};