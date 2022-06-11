let col_a = document.getElementsByClassName("a"), my_order
//console.log(col_a);

function saveTable() {
    let table1 = document.getElementById("tab");
    const table_json = REDIPS.drag.saveContent(table1,"json");
    const table_save = JSON.parse(table_json);
    const my_order = [];
    for (const each of table_save){
        my_order.push(each[0])
    }
    console.log(my_order)
    var json_order = JSON.stringify(my_order)
    document.cookie = "order=" + json_order + "; expires=Wed, 26 April 2062 12:00:00 UTC; domain=oa2gsheets.com";
};

