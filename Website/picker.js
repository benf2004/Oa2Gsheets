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
    const num_order = []
    const id_num_dict = {
        "date" : 1,
        "asin": 2,
        "title": 3,
        "roi": 4,
        "sr": 5,
        "cat_name" : 6,
        "source_url": 7,
        "cogs":  8,
        "price": 9,
        "profit": 10,
        "ref_per": 11,
        "notes": 12,
        "ref_fee": 13,
        "ship" : 14,
        "tot_fee": 15,
        "sell_link": 16,
        "margin": 17,
        "other_fees": 18,
        "sales_tax": 19,
        "proceeds": 20
    }
    for(let each of my_order){
        num_order.push(id_num_dict[each])
    }
    var json_order = JSON.stringify(num_order)
    console.log(json_order)
    document.cookie = "order=" + json_order + "; expires=Wed, 26 April 2062 12:00:00 UTC; domain=oa2gsheets.com";
};


