    // setup url parsing and create variable with ASIN
    let url = window.location.search 
    const urlParams = new URLSearchParams(url);
   	var asin = decodeURI(urlParams.get("asin"))
    console.log("asin is: " + asin)

	
      
	// define nested functions. All main operations take place in top1. 
    async function top1(checker1){
    async function main(checker, o1){
	
	// function accepts ASIN and returns statistics from Keepa API
	async function keepa(asin){
	let gibberish = "bcttbfvkurmk8mqm5hdo5fvdvarqiibhpehs2pshpe535fpkov2u8b107me6q79m";
	let response = await fetch('https://api.keepa.com/product?key=' + gibberish + '&domain=1&asin=' + asin + '&stats=0')
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
    // console.log("price is: " + price)
	var cogs = decodeURI(urlParams.get("cogs"))
    // console.log("cogs is: " + cogs)
	var sourceURL = decodeURI(urlParams.get("sourceurl"))
    // console.log("source url is: " + sourceURL)
	var notes = decodeURI(urlParams.get("notes"))
    // console.log("notes is: " + notes)
          

	// Sets dynamic statistic array to send to spreadsheet. requires row number.
        function dynamStats(rowStr, order) {
            var refPer = decodeURI(urlParams.get("refPer"))
            const alpha_dict = {}
            const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
            let num = 0
            for (let each of order) {
                alpha_dict[each] = alphabet[num]
                num += 1
            }
            const a = alpha_dict
            console.log("AlPHA DICT:" + a)

            let refFee1 = "=" + a['8'] + rowStr + "*" + a['10'] + rowStr;
            let other_fees = 0;
            let profit1 = "=" + a['8'] + rowStr + "-" + a['14'] + rowStr + "-" + a['7'] + rowStr;
            let totFees1 = "=" + a['12'] + rowStr + "+" + a['13'] + rowStr;
            let margin = "=" + a['16'] + rowStr + "/" + a['8'] + rowStr;
            let sales_tax = 0;
            let roi1 = "=" + a['9'] + rowStr + "/" + a['7'] + rowStr;
            let proceeds = "=" + a['8'] + "-" + a['14'] + rowStr;
            const my_list = [curDate, asinLink, title, roi1, currentRank, cate, sourceURL, cogs, price, profit1, refPer, notes, refFee1, pickPack, totFees1, sellLink, margin, other_fees, sales_tax, proceeds];
            console.log(my_list)
            return my_list
        }; // end of dynamic stats function

	var infoSend = dynamStats(checker, o1)
    return infoSend
    }; // end of main


    async function get_row_num(fileID) {
        var params = {
            spreadsheetId: fileID,

            range: 'A1:Z1000',

            valueRenderOption: 'FORMATTED_VALUE',

            dateTimeRenderOption: 'SERIAL_NUMBER',
        };

        var request = gapi.client.sheets.spreadsheets.values.get(params);
        request.then(function(response) {
            // TODO: Change code below to process the `response` object:
            const data = response.result
            console.log(data)
            let rowNum = (data.values).length + 1
            console.log(rowNum)
            document.cookie = "row=" + rowNum;
            return rowNum
        }, function(reason) {
            console.error('error: ' + reason.result.error.message);
        });
    }
    // accesses Google Sheets API to check how many rows have content. Returns row number to send data to.
    async function getRowNum() {
        let response = await fetch("https://sheets.googleapis.com/v4/spreadsheets/"+ fileID + "/values/A1%3AZ1000?valueRenderOption=FORMATTED_VALUE&key=AIzaSyAPnD47lfv1T5oHMAC770fUmSmSiKe9J3w")
        const data2 = await response.json()
        let rowNum = data2["values"].length + 1
        return rowNum;
    };

    function orderSend(data, order){
        const send = []
        for (let each of order){
            let num_each = parseInt(each)
            send.push(data[num_each])
        }
        return send
    };

    function getRange(order, row_num){
        const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
        const range = "A" + row_num + ":" + alphabet[order.length - 1]
        return range
    };

    // sends info to Google Sheets via Gsheets API
    function sendToSheets(send, range) {
        var params = {
            // The ID of the spreadsheet to update.
            spreadsheetId: fileID,  

            // The A1 notation of the values to update.
            range: range,  // 

            // How the input data should be interpreted.
            valueInputOption: 'USER_ENTERED', 
        }

        var valueRangeBody = {
            "majorDimension": "COLUMNS",
            "range": range,
            "values": [[send[0]], [send[1]], [send[2]], [send[3]], [send[4]], [send[5]], [send[6]], [send[7]], [send[8]], [send[9]], [send[10]], [send[11]], [send[12]], [send[13]], [send[14]], [send[15]], send[16]]
        }

        var request = gapi.client.sheets.spreadsheets.values.update(params, valueRangeBody);
        console.log(request);
        request.then(function(response) {
            console.log(response.result);
        }, function(reason) {
            console.error('error: ' + reason.result.error.message);
        });
    }

    // gets requested cookie by name
    function getCookie(cname) {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for(let i = 0; i <ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    // checks if ASIN is included in URL. If yes, calls main functions in relevant order.
    if (asin !== "") {
        var fileID = decodeURI(urlParams.get("fileID"))
        const o = JSON.parse(decodeURI(urlParams.get('o')))
        const order_array = Object.values(o)
        console.log(order_array)
        console.log(typeof order_array)
        console.log("spreadsheet id:" + fileID);  // gets spreadsheet id num
        let hey = await get_row_num(fileID) // gets row number
        setTimeout(() => {console.log("delay")}, 1000);
        let rowFin = getCookie("row")
        let data1 = await main(rowFin, order_array); // gets statistics
        let send_data  = orderSend(data1, order_array)
        let range1 = getRange(order_array, rowFin) // creates range from row number
        sendToSheets(send_data, range1); // sends data to gsheets
    } 
    else {
        console.log("error: no parameters recieved") // logs error in console if no ASIN is recieved in URL
    };
    }
    var fileID = decodeURI(urlParams.get("fileID"))
    setTimeout(() => {top1()}, 1000)