    // setup url parsing and create variable with ASIN
    let data1;
    let url = window.location.search 
    const urlParams = new URLSearchParams(url);
   	var asin = decodeURI(urlParams.get("asin"))
    var has_headers = decodeURI(urlParams.get("h"))
    console.log("Has headers is: " + has_headers)
    console.log("asin is: " + asin)

	
      
	// define nested functions. All main operations take place in top1. 
    async function top1(){

	// Create variables for desired statistics from Keepa JSON
	var currentRank = decodeURI(urlParams.get('r'))
	var ship = parseFloat(decodeURI(urlParams.get('s')));
    var other = parseFloat(decodeURI(urlParams.get('other')));
    var cat_name = decodeURIComponent(urlParams.get('cat'));
    var title = decodeURIComponent(urlParams.get('title'));
    var drops = decodeURIComponent(urlParams.get('drops'));
    var today = new Date();
	var curDate = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
	var asinLink = '=HYPERLINK("amazon.com/dp/' + asin + '"' + "," + '"' + asin + '"' + ")"
	var sellLink = "https://sellercentral.amazon.com/product-search/search?q=" + asin

    var price = parseFloat(decodeURI(urlParams.get("price")));
    var top_per = decodeURI(urlParams.get("top")) + "%";
	var cogs = parseFloat(decodeURI(urlParams.get("cogs")));
    console.log("COGS: " + cogs)
	var sourceURL = decodeURI(urlParams.get("sourceurl"))
	var notes = decodeURIComponent(urlParams.get("notes"))
    console.log("notes is " + notes)
    var refPer = "=TO_PERCENT(" + decodeURI(urlParams.get("refPer")) + ")";
    var ref_num = decodeURI(urlParams.get('refPer'))
    var is_dynam = decodeURI(urlParams.get("dy"))


        // Sets dynamic statistic array to send to spreadsheet. requires row number.
    function dynamStats(rowStr, order) {
        const alpha_dict = {}
        const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
        let num = 0
        for (let each of order) {
            alpha_dict[each] = alphabet[num]
            num += 1
        }
        const a = alpha_dict
        console.log(JSON.stringify(a))
        console.log("AlPHA DICT:")
        console.log(a)

        // refer to picker id_num_dict to see order
        let refFee1 = "=ROUND(" + a['8'] + rowStr + "*" + a['10'] + rowStr + ", 2)";
        let totFees1 = "=" + a['12'] + rowStr + "+" + a['13'] + rowStr + '+' + a['17'] + rowStr;
        let profit1 = "=" + a['8'] + rowStr + "-" + a['14'] + rowStr;
        let margin = "=TO_PERCENT(" + a['9'] + rowStr + "/" + a['8'] + rowStr + ")";
        let sales_tax = 0;
        let roi1 = "=TO_PERCENT(" + a['7'] + rowStr + "/" + a['9'] + rowStr + ")";
        let proceeds = "=" + a['8'] + "-" + a['14'] + rowStr;
        const my_list = [curDate, asinLink, title, roi1, currentRank, cat_name, sourceURL, cogs, price, profit1, refPer, notes, refFee1, ship, totFees1, sellLink, margin, other, sales_tax, proceeds, top_per, drops];
        console.log(my_list)
        return my_list
    }; // end of dynamic stats function

    function staticStats(){
        let refFee1 = price * ref_num
        let ref_fee = "=ROUND(" + refFee1 +", 2)"
        let totFees1 = refFee1 + ship + other
        let tot_fees = "=ROUND(" + totFees1 + ", 2)"
        let profit1 = price - totFees1 - cogs
        let roi1 = profit1 / cogs
        let margin = profit1 / price
        let sales_tax = 0;
        let proceeds = price - totFees1;
        const my_list = [curDate, asinLink, title, roi1, currentRank, cat_name, sourceURL, cogs, price, profit1, refPer, notes, ref_fee, ship, tot_fees, sellLink, margin, other, sales_tax, proceeds, top_per, drops];
        return my_list
    }

    async function finish(rowFin, order_array) {
        console.log("row num:" + rowFin)
        console.log("ROWWWwwYYWY")
        if (is_dynam == "false") {
            data1 = staticStats()
        }
        else {
            data1 = dynamStats(rowFin, order_array); // gets statistics
        };
        let send_data = orderSend(data1, order_array)
        let range1 = getRange(order_array, rowFin) // creates range from row number
        sendToSheets(send_data, range1); // sends data to gsheets
    }

    async function get_row_num(fileID, o) {
        var params = {
            spreadsheetId: fileID,

            range: 'A1:Z1000',

            valueRenderOption: 'FORMATTED_VALUE',

            dateTimeRenderOption: 'SERIAL_NUMBER',
        };
        var order = o
        var request = gapi.client.sheets.spreadsheets.values.get(params);
        request.then(function(response) {
            const data = response.result
            console.log(data)
            let rowNum = (data.values).length + 1
            console.log("row num" + rowNum)
            finish(rowNum, order)
        }, function(reason) {
            console.error('error: ' + reason.result.error.message);
        });
    }

    function orderSend(data, order){
        console.log("ORDER IS:")
        console.log(order)
        const send = []
        for (let each of order){
            let num_each = parseInt(each)
            send.push([data[num_each]])
        }
        let final_send = Object.values(send)
        return final_send
    };

    function getRange(order, row_num){
        const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
        const range = "A" + row_num + ":" + alphabet[order.length - 1] + row_num
        console.log("range: " + range)
        return range
    };

    // sends info to Google Sheets via Gsheets API
    function sendToSheets(send, range) {
        console.log("Send:")
        console.log(send)
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
            "values": send
        }

        var request = gapi.client.sheets.spreadsheets.values.update(params, valueRangeBody);
        console.log(request);
        request.then(function(response) {
            console.log(response.result);
        }, function(reason) {
            console.error('error: ' + reason.result.error.message);
        });
    }

    if (has_headers === 'true'){
        var fileID = decodeURI(urlParams.get("fileID"))
        console.log("processing headers")
        const headers = urlParams.get('heads') //removed json.parse
        console.log("HEADERS:")
        console.log(headers)
        let json_h = headers.split(",")
        console.log(json_h)
        let new_h = []
        for (let each of json_h){
            new_h.push([each])
        }
        let h_range = getRange(json_h, "1")
        console.log("range: " + h_range)
        sendToSheets(new_h, h_range)
    }
    else {
        if (asin !== null) {
            var fileID = decodeURI(urlParams.get("fileID"))
            const o = JSON.parse(decodeURI(urlParams.get('o')))
            const order_array = Object.values(o)
            console.log(order_array)
            console.log("spreadsheet id: " + fileID);  // gets spreadsheet id num
            await get_row_num(fileID, order_array) // gets row number
        }
    }
    } // end of top1
    var fileID = decodeURI(urlParams.get("fileID"))
    setTimeout(() => {top1()}, 1000)