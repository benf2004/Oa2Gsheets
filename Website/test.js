let url = window.location.search
const urlParams = new URLSearchParams(url);
const order = JSON.parse(decodeURI(urlParams.get('o')))
const order_array = Object.values(order)
for (let each of order_array){
    console.log(each)
}
console.log(order_array)