async function keepa(asin) {
    let key = "2voidarbtfcnosoudp9hqh97aon07aie6sagl6mt2hp9ie61cplt8se83o321ep4";
    let response = await fetch('https://api.keepa.com/product?key=' + key + '&domain=1&asin=' + asin + '&stats=0')
    const data1 = response.json()
    return data1
}

// Determines Refferal Percentage (refPer) by cycling through categories and checking name
function detrmRefPer(price, cats2) {
    const eightPer = [
        'Camera & Photo', 'Full-Size Appliances', "Cell Phone Devices",
        "Consumer Electronics", "Personal Computers", "Video Game Consoles"
    ];
    const groceryFee = ["Grocery & Gourmet Foods"];
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
    for (let each in cats2) {
        var catName = cats2[each]["name"]
        console.log("CATEGORY NAME IS: " + catName)
        for (let each1 in twelvePer) {
            if (catName == twelvePer[each1]) {
                refPer = .12
            }
        }
        for (let each1 in fifteenPer) {
            if (catName == fifteenPer[each1]) {
                refPer = .15
            }

        }
        for (let each1 in eightPer) {
            if (catName == eightPer[each1]) {
                refPer = .12
            }
        }
        for (let each1 in switch10) {
            if (catName == eightPer[each1]) {
                if (price < 10) {
                    refPer = 0.8
                }
                if (price >= 10) {
                    refPer = .15
                }
            }
        }
    }
    return refPer
} // end of determine refferal percentage function

const object1 = await keepa(asin);
const product = object1['products'][0];
var cats2 = product["categoryTree"];
const currentStats = object1['products'][0]['stats']['current'];
var price = currentStats[1] / 100;
var refPer = detrmRefPer(price, cats2)
document.getElementById("price").value = price;

async function updateStats() {
    // vars from docuent
    var price = Number(document.getElementById("price").value)
    const cogs = Number(document.getElementById("cogsInput").value)
    var sourceURL = document.getElementById("SourceUrl").value
    var notes = document.getElementById("notes").value
    var refPer = Number(document.getElementById("refPer").value)

    // vars from keepa
    const currentStats = object1['products'][0]['stats']['current'];
    var title = product['title'];
    var currentRank = currentStats[3];
    var fbaFees = product["fbaFees"];
    var pickPack = fbaFees['pickAndPackFee'] / 100;
    var cate = cats2[0]['name']
    var today = new Date();
    var curDate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var asinLink = '=HYPERLINK("amazon.com/dp/' + asin + '"' + "," + '"' + asin + '"' + ")"
    var sellLink = "https://sellercentral.amazon.com/product-search/search?q=" + asin
    let refFee = Number((price * refPer).toPrecision(2))
    let totFees = refFee + pickPack
    let profit1 = Number((price - totFees - cogs).toPrecision(2))
    if (price != 0) {
        let margin = (profit / price).toPrecision(2)
    }
    if (cogs != 0) {
        var roi1 = Number((profit1 / cogs).toPrecision(2))
    }
    let proceeds = (price - totFees).toPrecision(2)
    let roiPer = roi1 * 100 + "%"
    document.getElementById("roi").innerHTML = "ROI: " + roiPer;
    document.getElementById("profit").innerHTML = "PROFIT: " + profit1
    document.getElementById("fbaFee").innerHTML = "FBA FEE: " + pickPack
    document.getElementById("refFee").innerHTML = "REFFERAL FEE: " + refFee
    let infoArray = [curDate, asinLink, title, roi1, currentRank, cate, url1, cogs, price, profit, refPer, notes, refFee, pickPack, totFees]
    return infoArray
}