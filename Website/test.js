let url = window.location.search
const urlParams = new URLSearchParams(url);
const order = JSON.parse(decodeURI(urlParams.get('o')))
for (each of order){
    console.log("hey")
}
console.log(order)