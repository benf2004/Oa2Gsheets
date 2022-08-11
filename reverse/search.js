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

    let update_hours = 168
    let d_id = getCookie('domain_id', "1")
    async function seller_search(id) {
        let response = await fetch('https://api.keepa.com/seller?key=' + key + '&domain=' + d_id + '&seller=' + id + "&storefront=1&&update=" + update_hours)
        let ss = response.json()
        return ss
    }

    function id(my_id){
        return document.getElementById(my_id)
    }

    function to_upper(words){
        return words
    }

     function load_seller(ss){
        console.log(ss['tokensLeft'])
        document.getElementById('tokens').innerHTML = ss['tokensLeft'];
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