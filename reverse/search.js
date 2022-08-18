async function main() {
// gets requested cookie by name
    function getCookie(cname, def="") {
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
        return def;
    }

    let key;
    var myModal = new bootstrap.Modal(document.getElementById('popup'), {
        keyboard: false
    })
    let v = getCookie('visited', null)
    if (v === null){
        id("welcome").classList.remove('d-none')
        id('token_d').classList.add("d-none")
        id('load-b-demo').addEventListener("click", display_modal)
        id('demo').classList.remove('d-none')
        add_cookie("visited", true)
        tippy('.google', {
            content: 'Search the product title on Google',
            delay: [200, 0]
        });
        tippy('.keepa_link', {
            content: 'Open the Keepa detail page for the product',
            delay: [200, 0]
        });
        tippy('.link', {
            content: 'Open the Amazon product page',
            delay: [200, 0]
        });
        tippy('.amazon', {
            content: 'List the item in Seller Central',
            delay: [200, 0]
        });
        tippy('.dimensions', {
            content: "See the product's weight & dimensions",
            delay: [200, 0]
        })
        tippy('.dimensions', {
            content: "Demo Dimensions <br> 2 x 3 x 4 in <br> Weight: 2.4 lbs",
            allowHTML: true,
            trigger: "click"
        });
    }
    function get_key() {
        key = getCookie('keepa_key', 0)
        if (key === 0 && v !== null){
            setTimeout(display_modal, 500)
            id("welcome").classList.remove('d-none')
            id('token_d').classList.add("d-none")
            id('load-b-demo').addEventListener("click", display_modal)
            id('demo').classList.remove('d-none')
            add_cookie("visited", true)
            tippy('.google', {
                content: 'Search the product title on Google',
                delay: [200, 0]
            });
            tippy('.keepa_link', {
                content: 'Open the Keepa detail page for the product',
                delay: [200, 0]
            });
            tippy('.link', {
                content: 'Open the Amazon product page',
                delay: [200, 0]
            });
            tippy('.amazon', {
                content: 'List the item in Seller Central',
                delay: [200, 0]
            });
            tippy('.dimensions', {
                content: "See the product's weight & dimensions",
                delay: [200, 0]
            })
            tippy('.dimensions', {
                content: "Demo Dimensions <br> 2 x 3 x 4 in <br> Weight: 2.4 lbs",
                allowHTML: true,
                trigger: "click"
            });
        }
        else {
            if (key !== 0) {
                id('demo').remove()
            }
        }
    }

    function add_cookie(name, value){
        document.cookie =  name + "=" + value + " ; expires=Sat, 18 Dec 2060 12:00:00 UTC";
    }

    function display_modal(){
       myModal.show()
    }
    get_key()


    let update_hours = 720
    let d_id = getCookie('domain_id', "1")
    let domain = getCookie('domain', ".com")
    let shipAMZRate = parseFloat(getCookie('ship_amz', 0.0))
    let perItem = parseFloat(getCookie('addtl', 0.0))
    let salesTaxPer = parseFloat(getCookie('sales_tax', 0.0))
    let minProfit = parseFloat(getCookie("min_profit", 0.0))
    let minRoi = parseFloat(getCookie("min_roi", 0.0))
    console.log(shipAMZRate, perItem, salesTaxPer, minProfit, minRoi)
    async function seller_search(id) {
        let response = await fetch('https://api.keepa.com/seller?key=' + key + '&domain=' + d_id + '&seller=' + id + "&days=30&storefront=1&update=" + update_hours)
        let ss = response.json()
        return ss
    }

    async function product_search(asin){
        let response
        if (id('saver').checked !== true) {
            response = await fetch('https://api.keepa.com/product?key=' + key + '&domain=' + d_id + '&asin=' + asin + '&stats=0&buyBox=1&update=2&rating=1')
        }
        else {
            response = await fetch(`https://api.keepa.com/product?key=${key}&domain=${d_id}&asin=${asin}&stats=0&buyBox=1&update=2`)
        }
        return response.json()
    }

    async function tokens_left(){
        let response = await fetch('https://api.keepa.com/token?key=' + key)
        return response.json()
    }
    function id(my_id){
        return document.getElementById(my_id)
    }

    function to_upper(str){
        return str.replace(/\w\S*/g, function(txt){
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }
    let asin_list;
    function update_tokens(num){
        document.getElementById('tokens').innerHTML = num
        if (num <= 50) {
            id('saver').checked = true
        }
    }
    if (key !== 0) {
        let t = await tokens_left()
        update_tokens(t["tokensLeft"])
    }

    function load_seller(ss){
        update_tokens(ss['tokensLeft'])
        document.getElementById('seller-details').classList.remove('d-none');
        let seller = ss['sellers'][s_id]
        id('name').innerHTML = seller['sellerName'];
        id('seller_id').innerHTML = seller['sellerId'];
        id('seller_rating').innerHTML = seller['currentRating'] + "%" + " (" + seller['currentRatingCount'] + ")";
        id('asin_count').innerHTML = seller['totalStorefrontAsins'][1];
        for (let each of seller['sellerBrandStatistics']){
            let new_row = id('brands').insertRow()
            let name_cell = new_row.insertCell()
            name_cell.innerHTML = to_upper(each.brand)
            let count_cell = new_row.insertCell()
            count_cell.innerHTML = each.productCount
        }
        for (let each of seller['sellerCategoryStatistics']){
            let cat = get_cat(each.catId, "cat_name")
            if (cat !== ""){
                let new_row = id('cat_table').insertRow()
                let cat_name_cell = new_row.insertCell()
                cat_name_cell.innerHTML = cat
                let count_cell = new_row.insertCell()
                count_cell.innerHTML = each.productCount
            }
        }
        asin_list = seller['asinList'];
        load_six(asin_list.slice(0, 7));
        id('load').classList.remove('d-none')
     }

    function CSVToArray(strData, strDelimiter=","){
        strDelimiter = (strDelimiter || ",");
        var objPattern = new RegExp(
            (
                // Delimiters.
                "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

                // Quoted fields.
                "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

                // Standard fields.
                "([^\"\\" + strDelimiter + "\\r\\n]*))"
            ),
            "gi"
        );
        var arrData = [[]];
        var arrMatches = null;
        while (arrMatches = objPattern.exec( strData )){
            var strMatchedDelimiter = arrMatches[ 1 ];
            if (
                strMatchedDelimiter.length &&
                strMatchedDelimiter !== strDelimiter
            ){
                arrData.push( [] );

            }
            var strMatchedValue;
            if (arrMatches[ 2 ]){
                strMatchedValue = arrMatches[ 2 ].replace(
                    new RegExp( "\"\"", "g" ),
                    "\""
                );

            } else {
                strMatchedValue = arrMatches[ 3 ];
            }
            arrData[ arrData.length - 1 ].push( strMatchedValue );
        }
        return( arrData );
    };

    function ru(el){
        el.classList.remove('unload')
    }

    function qs(query){
        return document.querySelector(query)
    }

    async function get_cats(id){
        let response1 = await fetch("https://api.keepa.com/category?key=" + key + "&domain=" + d_id + "&category=" + id)
        let my_data = await response1.json()
        console.log(my_data)
        let category = my_data['categories'][id]
        return category
    }

    function load_product(p){
        let template = document.getElementsByTagName("template")[0]
        let clone = template.content.cloneNode(true);
        id('products').appendChild(clone)
        clone.id = p['asin']
        let img_source = CSVToArray(p['imagesCSV'])[0]
        let img = qs(".product-image.unload")
        img.src = "https://m.media-amazon.com/images/I/" + img_source
        ru(img)
        let title = qs(".title.unload")
        title.innerHTML = p['title']
        ru(title)
        let rating;
        let star_el = qs('.stars.unload')
        if (p['csv'][16] !== null) {
            rating = p['csv'][16].at(-1) / 10
            console.log(rating)
            console.log(p['csv'])
            var stars = 0;
            for (let i = 1; i <= rating; i++){
                stars += 1
            }
            console.log(stars)
            let s_el = "<i class='fa-solid fa-star'></i>".repeat(stars).trimEnd();
            if (rating - stars >= 0.5){
                s_el += '<i class="fa-solid fa-star-half-stroke"></i>'
            }
            star_el.innerHTML = s_el
        }
        ru(star_el)
        let rc = qs('.review_count.unload')
        console.log(p)
        if ('reviews' in p) {
            rc.innerHTML = "(" + p['reviews']['ratingCount'].at(-1) + ")"
        }
        ru(rc)
        let asin_el = qs('.asin.unload')
        asin_el.innerHTML = p['asin']
        ru(asin_el)
        let cat_name = get_cat(p['rootCategory'], "cat_name")
        let highest = get_cat(p['rootCategory'], "highest_rank")
        console.log(highest)
        let cat_el = qs('.category.unload')
        cat_el.innerHTML = cat_name
        ru(cat_el)
        let s_r = qs('.sales-rank.unload')
        let sales_rank =  p['stats']['current'][3]
        s_r.innerHTML = Math.round(sales_rank/1000) + "k"
        if (sales_rank < 1000){
            s_r.innerHTML = sales_rank
        }
        if (sales_rank == -1){
            s_r.innerHTML = "Not Found"
            s_r.parentElement.classList.add('bg-light-red')
        }
        ru(s_r)
        let top_per = ((p['stats']['current'][3] / highest) * 100).toFixed(1)
        if (top_per === "0.0"){
            top_per = "0.1"
        }
        console.log(top_per)
        let top_el = qs('.bsr-percent.unload')
        if (sales_rank != -1) {
            top_el.innerHTML = "(" + top_per + "%)"
        }
        if (top_per < 1) {
            top_el.parentElement.classList.add('bg-mint-green')
        }
        else if (top_per > 4){
            top_el.parentElement.classList.add('bg-light-red')
        }
        else{
            top_el.parentElement.classList.add('bg-light-yellow')
        }
        ru(top_el)
        let price = p['stats']['buyBoxPrice'] / 100 + p['stats']['buyBoxShipping']/100;
        console.log(price)
        let bbl = qs('.bbl.unload')
        if (price < 0.01) {
            price = p['stats']['current'][1] / 100
            bbl.innerHTML = "Price"
        }
        let bb = qs('.buy-box.unload')
        bb.innerHTML = price
        ru(bb)
        ru(bbl)
        let goog = qs('.google.unload')
        goog.href = `https://www.google.com/search?q=${encodeURIComponent(p['title'])}`
        goog.target = "_blank"
        ru(goog)
        let list = qs('.amazon.unload')
        list.href = `https://sellercentral.amazon${domain}/abis/Display/ItemSelected?asin=${p['asin']}`
        list.target = "_blank"
        ru(list)
        let pp = qs('.link.unload')
        pp.href = `https://www.amazon${domain}/dp/${p['asin']}`
        pp.target = "_blank"
        ru(pp)
        let graph = qs('.keepa_link.unload')
        graph.href = `https://keepa.com/#!product/${d_id}-${p['asin']}`
        graph.target = "_blank"
        ru(graph)
        let keepa = qs('.graph.unload')
        if (id('saver').checked !== true) {
            keepa.src = `https://api.keepa.com/graphimage?amazon=1&bb=1&fba=1&fbm=1&salesrank=1&width=450&height=200&cBackground=f8f9fa&key=${key}&domain=${d_id}&asin=${p['asin']}`
        }
        ru(keepa)
        let weight = round_2(gramToLb(p['packageWeight']))
        let length = round_2(mmToIn(p['packageLength']))
        let height = round_2(mmToIn(p['packageHeight']))
        let width = round_2(mmToIn(p['packageWidth']))
        let dimensions = `${length} x ${width} x ${height}`
        let dimen_el = qs('.dimensions.unload')
        tippy(dimen_el, {
            content: `Dimensions (in): ${dimensions}` +  "<br>" + `Weight: ${weight} lbs`,
            trigger: "click",
            allowHTML: "true"
        });
        ru(dimen_el)
        let refPer
        if (p['categoryTree'] !== null) {
            refPer = detrmRefPer(price, p['categoryTree'])
        }
        else {
            refPer = 0.15
        }
        let pickPack;
        if (p['fbaFees'] !== null) {
            pickPack = round_2(p["fbaFees"]['pickAndPackFee'] / 100);
        }
        else {
            pickPack = 4.5
        }
        let maxCost = round_2(getMaxCost(price, parseFloat(pickPack), parseFloat(weight), refPer))
        let max_el = qs('.max-cost.unload')
        if (maxCost < 0){
            max_el.classList.remove('bg-light-blue')
            max_el.classList.add('bg-light-red')
        }
        max_el.innerHTML = maxCost
        ru(max_el)

        // keep at bottom
        let outer = qs(".outer.unload")
        outer.classList.remove('d-none')
        tippy('.google', {
            content: 'Search the product title on Google',
            delay: [200, 0]
        });
        tippy('.keepa_link', {
            content: 'Open the Keepa detail page for the product',
            delay: [200, 0]
        });
        tippy('.link', {
            content: 'Open the Amazon product page',
            delay: [200, 0]
        });
        tippy('.amazon', {
            content: 'List the item in Seller Central',
            delay: [200, 0]
        });
        tippy('.dimensions', {
            content: "See the product's weight & dimensions",
            delay: [200, 0]
        });
        ru(outer)
    }

    function mmToIn(val) {
        let num = parseFloat(val)
        return num/25.4
    }

    function round_2(num){
        return (Math.round(num * 100) / 100).toFixed(2);
    }

    async function load_six(asins){
        let a = await product_search(asins.toString())
        update_tokens(a['tokensLeft'])
        for (let i=0 ; i < asins.length + 1; i++){
            await load_product(a["products"][i])
            asin_list.shift()
        }
    }

    function gramToLb(val) {
        let num = parseFloat(val)
        return (num/28.35) / 16
    }

    function getMaxCost(price, fba_ship, lbs, ref_per){
        console.log(price, fba_ship, lbs, ref_per)
        let total_fees = fba_ship + (lbs * shipAMZRate) + (price * ref_per) + perItem
        console.log(`TOTAL FEES: ${total_fees}`)
        console.log(`PRICE: ${price}`)
        let maxCogs = (price - total_fees - minProfit) * (1-salesTaxPer/100)
        console.log(`MAX COST: ${maxCogs}`)
        if ((minProfit/maxCogs) < (minRoi/100)){
            maxCogs -= 0.01
            console.log(`COGS: ${maxCogs}`)
            console.log(`minProfit/maxCOGS: ${minProfit/maxCogs}`)
        }
        return maxCogs
    }

    function get_cat(id, action){
        let cats = {
            "5174": {
            "cat_name": "CDs & Vinyl",
            "highest_rank": 11929222
        },
            "172282": {
            "cat_name": "Electronics",
                "highest_rank": 31139496
        },
            "228013": {
            "cat_name": "Tools & Home Improvement",
                "highest_rank": 31225182
        },
            "229534": {
            "cat_name": "Software",
                "highest_rank": 28130092
        },
            "283155": {
            "cat_name": "Books",
                "highest_rank": 25597298
        },
            "468642": {
            "cat_name": "Video Games",
                "highest_rank": 28636784
        },
            "599858": {
            "cat_name": "Magazine Subscriptions",
                "highest_rank": 5987752
        },
            "1055398": {
            "cat_name": "Home & Kitchen",
                "highest_rank": 31517751
        },
            "1064954": {
            "cat_name": "Office Products",
                "highest_rank": 31431261
        },
            "3375251": {
            "cat_name": "Sports & Outdoors",
                "highest_rank": 31557181
        },
            "3760901": {
            "cat_name": "Health & Household",
                "highest_rank": 29441396
        },
            "3760911": {
            "cat_name": "Beauty & Personal Care",
                "highest_rank": 31249054
        },
            "10272111": {
            "cat_name": "Everything Else Store",
                "highest_rank": 31522348
        },
            "11091801": {
            "cat_name": "Musical Instruments",
                "highest_rank": 29193805
        },
            "15684181": {
            "cat_name": "Automotive",
                "highest_rank": 29293392
        },
            "16310091": {
            "cat_name": "Industrial & Scientific",
                "highest_rank": 30826982
        },
            "16310101": {
            "cat_name": "Grocery & Gourmet Food",
                "highest_rank": 17588410
        },
            "133140011": {
            "cat_name": "Kindle Store",
                "highest_rank": 6986751
        },
            "163856011": {
            "cat_name": "Digital Music",
                "highest_rank": 10044035
        },
            "165793011": {
            "cat_name": "Toys & Games",
                "highest_rank": 31692212
        },
            "165796011": {
            "cat_name": "Baby Products",
                "highest_rank": 30198574
        },
            "2238192011": {
            "cat_name": "Gift Cards",
                "highest_rank": 7273
        },
            "2335752011": {
            "cat_name": "Cell Phones & Accessories",
                "highest_rank": 19525045
        },
            "2350149011": {
            "cat_name": "Apps & Games",
                "highest_rank": 16593783
        },
            "2617941011": {
            "cat_name": "Arts, Crafts & Sewing",
            "highest_rank": 29409408
        },
            "2619525011": {
            "cat_name": "Appliances",
            "highest_rank": 16025795
        },
            "2619533011": {
            "cat_name": "Pet Supplies",
                "highest_rank": 29277084
        },
            "2625373011": {
            "cat_name": "Movies & TV",
                "highest_rank": 22495971
        },
            "2972638011": {
            "cat_name": "Patio, Lawn & Garden",
                "highest_rank": 31282589
        },
            "13727921011": {
            "cat_name": "Alexa Skills",
                "highest_rank": -1
        },
            "18145289011": {
            "cat_name": "Audible Books & Originals",
                "highest_rank": 9260397
        },
            "7141123011": {
            "cat_name": "Clothing, Shoes & Jewelry",
                "highest_rank": 32021168
        },
            "4991425011": {
            "cat_name": "Collectibles & Fine Art",
                "highest_rank": 5461558
        },
            "11260432011": {
            "cat_name": "Handmade Products",
                "highest_rank": 4895704
        },
            "9013971011": {
            "cat_name": "Video Shorts",
                "highest_rank": 164
        }
        }
        let val;
        if (id in cats){
            val = cats[id][action]
        }
        else {
            val = ""
        }
        return val
    }
    let s_id;

    function animateBtn(btn, time, name="Submit"){
        btn.innerHTML = "<i id='icon'></i>"
        id("icon").className = "fas fa-spinner fa-spin"
        setTimeout(() => {id("icon").className = ""; btn.innerHTML = name}, time)
    }

    async function load_products(){
        let sub = document.getElementById('submit')
        sub.innerHTML = "<i id='icon'></i>"
        document.getElementById("icon").className = "fas fa-spinner fa-spin"
        setTimeout(() => {document.getElementById("icon").className = ""; sub.innerHTML = 'Submit'}, 3000)
        s_id = document.getElementById('seller_search').value
        let re = await seller_search(s_id)
        load_seller(re)
    }

    let url = window.location.search
    const urlParams = new URLSearchParams(url);
    const seller_id = decodeURI(urlParams.get("s_id"))
    if (seller_id !== "null"){
        id('seller_search').value = seller_id
        await load_products()
    }

    function button_load(){
        animateBtn(id('load_b'), 4000, "Load More")
        if (asin_list.length >= 6) {
            load_six(asin_list.splice(0, 7))
        }
        else{
            load_six(asin_list)
        }
    }

    function detrmRefPer(price, cats2) {
        console.log("PRICE:")
        console.log(price)
        console.log(cats2)
        const eightPer = [
            'Camera & Photo', 'Full-Size Appliances', "Cell Phone Devices",
            "Consumer Electronics", "Personal Computers", "Video Game Consoles"
        ];
        const groceryFee = ["Grocery & Gourmet Food"];
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
        var refPer = 0.15
        var catName = cats2[0]["name"]
        console.log(catName)
        console.log(catName === "Grocery & Gourmet Food")
        if (catName === "Grocery & Gourmet Food") {
            if (price <= 15){
                refPer = 0.08
            }
            else {
                refPer = 0.15
            }
        }
        else {
            for (let each in cats2) {
                catName = cats2[each]["name"]
                console.log("CATEGORY NAME IS: " + catName)
                for (let each1 in twelvePer) {
                    if (catName === twelvePer[each1]) {
                        refPer = .12
                    }
                }

                for (let each1 in fifteenPer) {
                    if (catName === fifteenPer[each1]) {
                        refPer = .15
                    }

                }
                for (let each1 in eightPer) {
                    if (catName === eightPer[each1]) {
                        refPer = .12
                    }
                }
                for (let each1 in switch10) {
                    if (catName === eightPer[each1]) {
                        if (price < 10) {
                            refPer = 0.8
                        }
                        if (price >= 10) {
                            refPer = .15
                        }
                    }
                }
            }
        }
        return refPer
    } // end of determine refferal percentage function

    document.getElementById('submit').addEventListener("click", load_products)
    id("load").addEventListener('click', button_load)
}
main()