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

    function get_key() {
        key = getCookie('keepa_key')
    }
    get_key()

    let update_hours = 169
    let d_id = getCookie('domain_id', "1")
    async function seller_search(id) {
        let response = await fetch('https://api.keepa.com/seller?key=' + key + '&domain=' + d_id + '&seller=' + id + "&days=30&storefront=1&update=" + update_hours)
        let ss = response.json()
        return ss
    }

    async function product_search(asin){
        let response = await fetch('https://api.keepa.com/product?key=' + key + '&domain=' + d_id + '&asin=' + asin + '&stats=0&buyBox=1&update=2&rating=1')
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
    }
     function load_seller(ss){
        update_tokens(ss['tokensLeft'])
        document.getElementById('seller-details').classList.remove('d-none');
        id('load').classList.remove('d-none')
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
            let cat = get_cat(each.catId)
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
        for (let i = 0; i < 7; i++){
            asin_list.shift()
        }
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

    async function load_product(data){
        update_tokens(data['tokensLeft'])
        let template = document.getElementsByTagName("template")[0]
        let clone = template.content.cloneNode(true);
        console.log(data)
        document.body.appendChild(clone)
        let p = data["products"][0]
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
        let cats = await get_cats(p['rootCategory'])
        let cat_name = await cats['name'];
        let highest = await cats['highestRank']
        console.log(highest)
        let cat_el = qs('.category.unload')
        cat_el.innerHTML = await cat_name
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
        let top_el = await qs('.bsr-percent.unload')
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
        goog.href = "https://www.google.com/search?q=" + p['title']
        goog.target = "_blank"
        ru(goog)
        let list = qs('.amazon.unload')
        list.href = "https://sellercentral.amazon.com/abis/Display/ItemSelected?asin=" + p['asin']
        list.target = "_blank"
        ru(list)
        let pp = qs('.link.unload')
        pp.href = "https://www.amazon.com/dp/" + p['asin']
        pp.target = "_blank"
        ru(pp)
        let graph = qs('.keepa_link.unload')
        graph.href = "https://keepa.com/#!product/1-" + p['asin']
        graph.target = "_blank"
        ru(graph)
        let keepa = qs('.graph.unload')
        keepa.src="https://api.keepa.com/graphimage?amazon=1&bb=1&fba=1&fbm=1&salesrank=1&width=400&height=178&cBackground=f8f9fa&key=" + key + "&domain=" + d_id + "&asin=" + p['asin']
        ru(keepa)

        // keep at bottom
        let outer = qs(".outer.unload")
        outer.classList.remove('d-none')
        ru(outer)
        document.body.appendChild(document.createElement("br"))
        document.body.appendChild(document.createElement("br"))
    }

    async function load_six(asins){
        for (let i=0 ; i < 7; i++){
            load_product(await product_search(asins[i]))
        }
    }

    function get_cat(id){
        let cat = ""
        let cat_name = [
            {
                "catID": 13727921011,
                "catName": "Alexa Skills"
            },
            {
                "catID": 2619525011,
                "catName": "Appliances"
            },
            {
                "catID": 2350149011,
                "catName": "Apps & Games"
            },
            {
                "catID": 2617941011,
                "catName": "Arts, Crafts & Sewing"
            },
            {
                "catID": 18145289011,
                "catName": "Audible Books & Originals"
            },
            {
                "catID": 15684181,
                "catName": "Automotive"
            },
            {
                "catID": 165796011,
                "catName": "Baby Products"
            },
            {
                "catID": 3760911,
                "catName": "Beauty & Personal Care"
            },
            {
                "catID": 283155,
                "catName": "Books"
            },
            {
                "catID": 5174,
                "catName": "CDs & Vinyl"
            },
            {
                "catID": 2335752011,
                "catName": "Cell Phones & Accessories"
            },
            {
                "catID": 7141123011,
                "catName": "Clothing, Shoes & Jewelry"
            },
            {
                "catID": 4991425011,
                "catName": "Collectibles & Fine Art"
            },
            {
                "catID": 163856011,
                "catName": "Digital Music"
            },
            {
                "catID": 172282,
                "catName": "Electronics"
            },
            {
                "catID": 10272111,
                "catName": "Everything Else Store"
            },
            {
                "catID": 2238192011,
                "catName": "Gift Cards"
            },
            {
                "catID": 16310101,
                "catName": "Grocery & Gourmet Food"
            },
            {
                "catID": 11260432011,
                "catName": "Handmade Products"
            },
            {
                "catID": 3760901,
                "catName": "Health & Household"
            },
            {
                "catID": 1055398,
                "catName": "Home & Kitchen"
            },
            {
                "catID": 16310091,
                "catName": "Industrial & Scientific"
            },
            {
                "catID": 133140011,
                "catName": "Kindle Store"
            },
            {
                "catID": 599858,
                "catName": "Magazine Subscriptions"
            },
            {
                "catID": 2625373011,
                "catName": "Movies & TV"
            },
            {
                "catID": 11091801,
                "catName": "Musical Instruments"
            },
            {
                "catID": 1064954,
                "catName": "Office Products"
            },
            {
                "catID": 2972638011,
                "catName": "Patio, Lawn & Garden"
            },
            {
                "catID": 2619533011,
                "catName": "Pet Supplies"
            },
            {
                "catID": 229534,
                "catName": "Software"
            },
            {
                "catID": 3375251,
                "catName": "Sports & Outdoors"
            },
            {
                "catID": 228013,
                "catName": "Tools & Home Improvement"
            },
            {
                "catID": 165793011,
                "catName": "Toys & Games"
            },
            {
                "catID": 468642,
                "catName": "Video Games"
            },
            {
                "catID": 9013971011,
                "catName": "Video Shorts"
            }
        ]
        for (let each of cat_name){
            if (each.catID === id)
                cat = each.catName
        }
        return cat
    }
    let s_id;

    async function load_products(){
        let sub = document.getElementById('submit')
        sub.innerHTML = "<i id='icon'></i>"
        document.getElementById("icon").className = "fas fa-spinner fa-spin"
        setTimeout(() => {document.getElementById("icon").className = ""; sub.innerHTML = 'Submit'}, 3000)
        s_id = document.getElementById('seller_search').value
        let re = await seller_search(s_id)
        load_seller(re)
    }

    document.getElementById('submit').addEventListener("click", load_products)

}
main()