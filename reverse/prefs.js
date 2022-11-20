let keepa_submit = document.getElementById('api_submit')
keepa_submit.addEventListener('click', save_api_key)
let my_key;

function save_api_key(){
    animateBtn(id('api_submit'), 1000, "Submit")
    my_key = document.getElementById("keep_api").value
    document.cookie = "keepa_key=" + my_key + " ; expires=Sat, 18 Dec 2640 12:00:00 UTC";
    document.getElementById("keep_api").value = my_key
}
function load_saved_key(){
    my_key = getCookie('keepa_key')
    document.getElementById("keep_api").value = my_key
}

function id(my_id){
    return document.getElementById(my_id)
}

function add_cookie(name, value){
    document.cookie =  name + "=" + value + " ; expires=Sat, 18 Dec 2060 12:00:00 UTC";
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
    add_cookie("domain_id", domain_id)
    let domain = id('marketplace').options[id('marketplace').selectedIndex].innerHTML
    add_cookie("domain", domain)
}

function get_saved_mkpt(){
    let mkpt = getCookie("domain_id", 1)
    document.getElementById('marketplace').value = mkpt
}

function get_saved_inputs(){
    id('roi').value = getCookie('roi')
    id('profit').value = getCookie('min_profit')
    id('ship_amz').value = getCookie('ship_amz')
    id('sales_tax').value = getCookie('sales_tax')
    id('addtl').value = getCookie('addtl')
}

function get_saved_prefs() {
    get_saved_mkpt()
    load_saved_key()
    get_saved_inputs()
}

function animateBtn(btn, time, name="Submit"){
    btn.innerHTML = "<i id='icon'></i>"
    id("icon").className = "fas fa-spinner fa-spin"
    setTimeout(() => {id("icon").className = ""; btn.innerHTML = name}, time)
}


get_saved_prefs()

let inputs = document.getElementsByClassName("in");

function negOrNone(el){
    let val = el.value
    if (el.value < 0 || el.value == ""){
        val = 0
    }
    return val
}

function update_inputs() {
    let roi = negOrNone(id('roi'))
    add_cookie("roi", roi)
    let min_profit = negOrNone(id('profit'))
    add_cookie('min_profit', min_profit)
    let ship_amz = negOrNone(id("ship_amz"))
    add_cookie('ship_amz', ship_amz)
    let sales_tax = negOrNone(id('sales_tax'))
    add_cookie('sales_tax', sales_tax)
    let addtl = negOrNone(id('addtl'))
    add_cookie('addtl', addtl)
}

for (let i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener('change', update_inputs);
}