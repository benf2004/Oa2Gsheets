async function main() {
    async function keepa(asin) {
        let response = await fetch('https://api.keepa.com/product?key=' + jumbo + '&domain=1&asin=' + asin + '&stats=0')
        return response.json()
    }

    async function get_cats(id){
        let response1 = await fetch("https://api.keepa.com/category?key=" + jumbo + "&domain=1&category=" + id)
        let my_data = response1.json()
        console.log(my_data)
        let category = my_data['categories'][id]
        return category
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

// updates neccesary stats
    async function updateStats() {
        //TODO: Determine what other stats to show (sales rank etc)

        // vars from docuent
        let price = Number(document.getElementById("price").value)
        let cogs = Number(document.getElementById("cogsInput").value)
        let ship = Number(document.getElementById("ship").value)
        let other = Number(document.getElementById("other").value)
        let sourceURL = document.getElementById("source").value
        let notes = document.getElementById("notes").value

        // vars from keepa
        const currentStats = object1['products'][0]['stats']['current'];
        let currentRank = currentStats[3];
        let refFee = Number((price * refPer).toPrecision(2))
        let totFees = refFee + ship + other
        let profit = Number((price - totFees - cogs).toPrecision(2))
        if (price !== 0) {
            let margin = (profit / price).toPrecision(2)
        }
        if (cogs !== 0) {
            let roi1 = Number((profit / cogs).toPrecision(2))
        }
        let roiPer = roi1 * 100
        let top_per = Number(currentRank / highest * 100).toPrecision(2)
        document.getElementById("asin").innerHTML = asin
        document.getElementById("profit").innerHTML = profit;
        document.getElementById("ref_fee").innerHTML = refFee;
        document.getElementById("total").innerHTML = totFees;
        document.getElementById("roi").innerHTML = roiPer + "%";
        document.getElementById("margin").innerHTML = margin + "%";
        document.getElementById("sr").innerHTML = currentRank;
        document.getElementById("category").innerHTML = cat_name;
        document.getElementById("top").innerHTML = top_per + "%";
        document.getElementById("fbaFee").innerHTML = pickPack
    } // end update stats

// sets asin and fileID vars from URL
    let jumbo = "bcttbfvkurmk8mqm5hdo5fvdvarqiibhpehs2pshpe535fpkov2u8b107me6q79m";
    let url = window.location.search
    const urlParams = new URLSearchParams(url);
    const asin = decodeURI(urlParams.get("asin"))
    const fileID = decodeURI(urlParams.get("fileID"))
    let order = urlParams.get("o")

    const object1 = await keepa(asin);
    setTimeout(() => {console.log("delay")}, 100);
    const product = object1['products'][0];
    let pickPack = product["fbaFees"]['pickAndPackFee'] / 100;
    let root_cat_id = product['rootCategory']
    const cats = await get_cats(root_cat_id);
    setTimeout(() => {console.log("delay")}, 100);
    let cat_name = cats['name'];
    let highest = cats['highestRank']
    const currentStats = object1['products'][0]['stats']['current'];
    let price = currentStats[1] / 100;
    const refPer = detrmRefPer(price, cats2)
    document.getElementById("price").value = price;
    document.getElementById("ship").value = pickPack;

    async function sendInfo() {
        document.getElementById("icon").className = "fas fa-spinner fa-spin"
        setTimeout(() => {document.getElementById("icon").className = "fa-brands fa-google-drive"}, 2000)
        console.log('File ID: ' + fileID);
        let price = Number(document.getElementById("price").value)
        let cogs = Number(document.getElementById("cogsInput").value)
        let sourceURL = document.getElementById("SourceUrl").value
        let notes = document.getElementById("notes").value
        console.log("ref per is(extension) : " + refPer)
        let refURL = "https://oa2gsheets.com/Website/send.html?asin=" + asin + "&fileID=" + fileID + "&o=" + order + "&cogs=" + cogs + "&sourceurl=" + sourceURL + "&refPer=" + refPer + "&notes=" + notes + "&price=" + price;
        let codeURL = encodeURI(refURL)
        console.log("code URL: " + codeURL)
        document.getElementById("frame").src = codeURL
    }

    document.getElementById("price").addEventListener("input", updateStats);
    document.getElementById("cogsInput").addEventListener("input", updateStats);
    document.getElementById("notes").addEventListener("input", updateStats);
    document.getElementById("export").addEventListener("click", sendInfo);
}
main()

