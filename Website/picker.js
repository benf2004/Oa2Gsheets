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
        "date" : 0,
        "asin": 1,
        "title": 2,
        "roi": 3,
        "sr": 4,
        "cat_name" : 5,
        "source_url": 6,
        "cogs":  7,
        "price": 8,
        "profit": 9,
        "ref_per": 10,
        "notes": 11,
        "ref_fee": 12,
        "ship" : 13,
        "tot_fee": 14,
        "sell_link": 15,
        "margin": 16,
        "other_fees": 17,
        "sales_tax": 18,
        "proceeds": 19
    }
    for(let each of my_order){
        num_order.push(id_num_dict[each])
    }
    var json_order = JSON.stringify(num_order)
    console.log(json_order)
    document.cookie = "order=" + json_order + "; expires=Wed, 26 April 2062 12:00:00 UTC; domain=oa2gsheets.com";
};


