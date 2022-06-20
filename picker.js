let col_a = document.getElementsByClassName("a"), my_order
//console.log(col_a);

function saveTable() {
    let table1 = document.getElementById("tab");
    const table_json = REDIPS.drag.saveContent(table1, "json");
    const table_save = JSON.parse(table_json);
    const my_order = [];
    for (const each of table_save){
        my_order.push(each[0])
    }
    console.log(my_order)
    const num_order = []
    var id_num_dict = {
        "date" : "0",
        "asin": "1",
        "title": "2",
        "roi": "3",
        "sr": "4",
        "cat_name" : "5",
        "source_url": "6",
        "cogs":  "7",
        "price": "8",
        "profit": "9",
        "ref_per": "10",
        "notes": "11",
        "ref_fee": "12",
        "ship" : "13",
        "tot_fee": "14",
        "sell_link": "15",
        "margin": "16",
        "other_fees": "17",
        "sales_tax": "18",
        "proceeds": "19",
        "top_per": "20"
    }
    for(let each of my_order){
        num_order.push(id_num_dict[each])
    }
    var json_order = JSON.stringify(num_order)
    console.log(json_order)
    let json_encode = encodeURI(json_order);
    console.log(json_encode)
    document.cookie = "order=" + json_encode + "; expires=Wed, 26 April 2062 12:00:00 UTC; domain=oa2gsheets.com";
    if (document.getElementById("dynam").checked === true) {
        document.cookie = "is_dynam=true; expires Wed, 26 April 2062 12:00:00 UTC; domain=oa2gsheets.com";
    }
    else {
        document.cookie = "is_dynam=false; expires Wed, 26 April 2062 12:00:00 UTC; domain=oa2gsheets.com";
    }
};

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

function fill_headers(){
    let table1 = document.getElementById("tab");
    const table_json = REDIPS.drag.saveContent(table1, "json");
    let table_save = JSON.parse(table_json)
    let headers = []
    for (let each of table_save){
        headers.push(each[4])
    }
    var json_headers = encodeURIComponent(headers)
    var fileID = getCookie('fileID')
    console.log(fileID)
    let send_headers = "https://oa2gsheets.com/Website/send?headers=" + json_headers + "&h=true" + "&fileID=" + fileID
    let encoded = send_headers
    console.log(encoded)
    document.getElementById("send_headers").src = encoded
}

