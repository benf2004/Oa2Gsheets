async function main() {
// gets requested cookie by name
    function getCookie(cname) {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
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

    let key;

    function get_key() {
        key = getCookie('keepa_key')
    }
    get_key()

    let update_hours = 168
    let d_id = getCookie('domain_id')
    async function seller_search(id) {
        let response = await fetch('https://api.keepa.com/seller?key=' + key + '&domain=' + d_id + '&seller=' + id + "&storefront=1&&update=" + update_hours)
        return response.json()
    }

    async function update_tokens(){
        let response = await fetch('https://api.keepa.com/token?key=' + key)
        log(response)
        return response.json()
    }
    function log(l){
        console.log(l)
    }
    document.getElementById('tokens').innerHTML = await update_tokens()
}
main()