const extpay = ExtPay('oa2gsheets')
function ext_pay() {
    extpay.openPaymentPage()
}

function start_trial() {
    const extpay = ExtPay('oa2gsheets')
    extpay.openTrialPage("7")
}

document.getElementById('pay_oa').addEventListener("click", ext_pay)
document.getElementById('trial').addEventListener("click", start_trial)

async function is_paid() {
    const user = await extpay.getUser();
    return user.paid
}

let paid = is_paid()
if (paid) {
    document.getElementById('para').innerHTML = 'TRUE'
}
else {
    document.getElementById('para').innerHTML = 'FALSE'
}