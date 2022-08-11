let keepa_submit = document.getElementById('api_submit')
keepa_submit.addEventListener('click', save_api_key)
let my_key;
function save_api_key(){
    my_key = document.getElementById("keep_api").value
    document.cookie = "keepa_key=" + my_key + " ; expires=Thu, 18 Dec 2013 12:00:00 UTC";
}
function load_saved_key(){
    my_key = getCookie('keepa_key')
    document.getElementById("keep_api").value = my_key
}

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

load_saved_key()