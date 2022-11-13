var rd = REDIPS.drag;
rd.only.divClass.ne = 'extras';
rd.only.other = 'allow';

var dynam = document.querySelector("input[name=dynam]")
dynam.addEventListener("change", (e) => {
    let essential = document.getElementsByClassName('e')
    if (e.target.checked) {
        console.log("Checkbox is checked..");
        for (let i = 0; i < essential.length; i++) {
            essential[i].classList.remove('ne')
        }
        rd.only.divClass.ne = 'extras';
    }
    else {
        console.log("Checkbox is not checked..");
        for (let i = 0; i < essential.length; i++) {
            console.log(essential[i].id)
            essential[i].classList.add('ne')
        }
        rd.only.divClass.ne = 'extras';
    }
});
function load_table(){
    let load_list = [["date",1,0,"ne","Date"],["asin",1,1,"ne","ASIN"],["title",1,2,"ne","Product Name"],["roi",1,3,"ne","ROI"],["sr",1,4,"ne","Sales Rank"],["cat_name",1,5,"ne","Category name"],["source_url",1,6,"ne","Source URL"],["cogs",1,7,"e","COGS"],["price",1,8,"e","Price"],["profit",1,9,"e","Profit"],["ref_per",1,10,"e","Referral %"],["notes",1,11,"ne","Notes"],["ref_fee",1,12,"e","Referral Fee ($)"],["ship",1,13,"e","Shipping Fee"],["tot_fee",1,14,"e","Total Fees"],["sell_link",1,15,"ne","Seller link"],["margin",1,16,"ne","Gross Margin"],["other_fees",1,17,"e","Other Fees"],["sales_tax"],["proceeds",1,19,"ne","Seller Proceeds"],["top_per",1,20,"ne","Top %"],["drops",1,21,"ne","Drops"]]
    let table_load = []
    let not_used = []
    let i = 0
    for (let each of o_l){
        let num = parseInt(each)
        let this_list = load_list[num]
        this_list.splice(2,1)
        this_list.splice(2,0,i)
        table_load.push(this_list)
        i += 1
    }
    for (let i = 0; i < 22; i++) {
        let item = load_list[i][0]
        if (item !== "sales_tax"){
            if (checkList(table_load, item) === false) {
                load_list[i].splice(1, 1)
                load_list[i].splice(1, 0, 0)
                load_list[i].splice(2, 1)
                load_list[i].splice(2, 0, 0)
                not_used.push(load_list[i])
            }
        }
    }
    console.log(not_used)
    rd.clearTable("tab");
    rd.clearTable("other_columns");
    rd.loadContent("tab", table_load);
    rd.loadContent("other_columns", load_list);
}

let url = window.location.search
const urlParams = new URLSearchParams(url);
let ndx = decodeURI(urlParams.get('index_num'))
let fileID = decodeURI(urlParams.get('f_id'))
if (fileID != "null"){
    document.cookie = `fileID=${fileID}; expires=Wed, 26 April 2062 12:00:00 UTC; domain=www.oa2gsheets.com`;
    document.getElementById("authorize_button").innerHTML = "Switch Gsheet"
}
let o = decodeURI(urlParams.get("order"))
let o1 = o.replace("[","")
let o2 = o1.replace("]","")
let o3 = o2.replace(/"/g, "")
let o_l = o3.split(",")
if (o === "none"){
    o = getCookie('order')
    let o1 = o.replace("[","")
    let o2 = o1.replace("]","")
    let o3 = o2.replace(/"/g, "")
    o_l = o3.split(",")
    if (o !== ""){
        load_table()
    }
}
else {
    load_table()
}

function checkList(tl, item1){
    let contains = false
    for (let each of tl){
        if (each.includes(item1)){
            contains = true
        }
    }
    return contains
}

function saveTable() {
    let fileID = document.getElementById("file_id").value
    document.getElementById("table_spinner").classList.remove('d-none')
    setTimeout(() => {document.getElementById("table_spinner").classList.add('d-none')}, 2000)
    let table1 = document.getElementById("tab");
    const table_json = REDIPS.drag.saveContent(table1, "json");
    const table_save = JSON.parse(table_json);
    console.log(table_json)
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
        "top_per": "20",
        "drops": "21"
    }
    for(let each of my_order){
        num_order.push(id_num_dict[each])
    }
    var json_order = JSON.stringify(num_order)
    console.log(json_order)
    let json_encode = encodeURI(json_order);
    console.log(json_encode)
    var extension_id = "nmfejpchamgnejkgfkadokkhpjkmgmam";
    var test_extension = "aapifccbfojjnaalilgfhjgfndkbpgmf"
    let is_dynam = document.getElementById("dynam").checked
    chrome.runtime.sendMessage(extension_id, {message:'update_order', fileID: fileID, order: json_encode, is_dynam:is_dynam});
};

// gets requested cookie by name
function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i <ca.length; i++) {
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
    document.getElementById("headers_spinner").classList.remove('d-none')
    setTimeout(() => {document.getElementById("headers_spinner").classList.add('d-none')}, 2000)
    let table1 = document.getElementById("tab");
    const table_json = REDIPS.drag.saveContent(table1, "json");
    let table_save = JSON.parse(table_json)
    let headers = []
    for (let each of table_save){
        headers.push(each[4])
    }
    var json_headers = encodeURIComponent(headers)
    var fileID = getCookie('fileID')
    if (fileID === "") {
        fileID = document.getElementById('file_id').value
    }
    console.log(fileID)
    let send_headers = "https://www.oa2gsheets.com/send?heads=" + json_headers + "&h=true" + "&fileID=" + fileID
    let encoded = send_headers
    console.log(encoded)
    document.getElementById("send_headers").src = encoded
}
