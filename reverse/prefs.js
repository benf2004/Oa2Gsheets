let keepa_submit = document.getElementById('api_submit')
keepa_submit.addEventListener('click', save_api_key)
let my_key;
function save_api_key(){
    my_key = document.getElementById("keep_api").value
    document.cookie = "keepa_key=" + my_key + " ; expires=Sat, 18 Dec 2640 12:00:00 UTC";
    document.getElementById("keep_api").value = my_key
}
function load_saved_key(){
    my_key = getCookie('keepa_key')
    document.getElementById("keep_api").value = my_key
}

document.getElementById('marketplace').addEventListener('change', update_mkpt)
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

function update_mkpt(){
    let domain_id = document.getElementById('marketplace').value
    document.cookie = "domain_id=" + domain_id + " ; expires=Sat, 18 Dec 2060 12:00:00 UTC";
}

function get_saved_mkpt(){
    let mkpt = getCookie("domain_id", 1)
    document.getElementById('marketplace').value = mkpt
}

function get_saved_prefs() {
    get_saved_mkpt()
    load_saved_key()
}

get_saved_prefs()