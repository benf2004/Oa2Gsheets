function dynamStats(rowStr, order){
    const alpha_dict = { }
    const alphabet = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"]
    let num = 0
    for (let each of order){
        alpha_dict[each] = alphabet[num]
        num += 1
    }
    const a = alpha_dict
    console.log("Alpha Dict:")
    console.log(a)

    let refFee1 = "=" + a['8'] + rowStr + "*" + a['10'] + rowStr;
    let other_fees = 0;
    let profit1 = "=" + a['8'] + rowStr + "-" + a['14'] + rowStr + "-" + a['7'] + rowStr;
    let totFees1 = "=" + a['12'] + rowStr + "+" + a['13'] + rowStr;
    let margin = "=" + a['16'] + rowStr + "/" + a['8'] + rowStr;
    let sales_tax = 0;
    let roi1 = "=" + a['9'] + rowStr + "/" + a['7'] + rowStr;
    let proceeds = "=" + a['8'] + "-" + a['14'] + rowStr;
    let curDate; let asinLink; let title; let currentRank; let cate; let sourceURL; let cogs; let price; let notes; let refPer; let pickPack; let sellLink
    const my_list = [curDate, asinLink, title, roi1, currentRank, cate, sourceURL, cogs, price, profit1, refPer, notes, refFee1, pickPack, totFees1, sellLink, margin, other_fees, sales_tax, proceeds];
    console.log(my_list)
    return my_list
}; // end of dynamic stats function


const my_order = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]

let answer = dynamStats("25", my_order)