function monthly() {
    chrome.storage.sync.get(['oa_plan']), function (result) {
        let plan = result.oa_plan
        if (result.oa_plan === "oa2gsheets-lifetime") {
            chrome.storage.local.remove(['extensionpay_api_key', 'extensionpay_installed_at', "extensionpay_user", 'oa_plan'])
            chrome.storage.sync.remove(['extensionpay_api_key', 'extensionpay_installed_at', "extensionpay_user", 'oa_plan'], function () {
                chrome.runtime.sendMessage('monthly_activated')
                chrome.storage.sync.set({oa_plan: 'oa2gsheets'})
                const extpay = ExtPay('oa2gsheets')
                extpay.openPaymentPage()
            })
        }
        else {
            chrome.runtime.sendMessage('monthly_activated')
            chrome.storage.sync.set({oa_plan: 'oa2gsheets'})
            const extpay = ExtPay('oa2gsheets')
            extpay.openPaymentPage()
        }
    }
}

function lifetime(){
    chrome.storage.local.remove(['extensionpay_api_key','extensionpay_installed_at', "extensionpay_user", 'oa_plan'])
    chrome.storage.sync.remove(['extensionpay_api_key','extensionpay_installed_at', "extensionpay_user", 'oa_plan'], function() {
        chrome.runtime.sendMessage('lifetime_activated')
        chrome.storage.sync.set({oa_plan: 'oa2gsheets-lifetime'})
        const extpay = ExtPay('oa2gsheets-lifetime')
        extpay.openPaymentPage()
    })
}

function open_dashboard(){
    const extpay = ExtPay('oa2gsheets')
    extpay.openPaymentPage()
}

function start_trial() {
    chrome.storage.local.remove(['extensionpay_api_key','extensionpay_installed_at', "extensionpay_user", 'oa_plan'])
    chrome.storage.sync.remove(['extensionpay_api_key','extensionpay_installed_at', "extensionpay_user", 'oa_plan'], function() {
        chrome.storage.sync.set({oa_plan: 'oa2gsheets'})
        chrome.runtime.sendMessage('monthly_activated')
        const extpay = ExtPay('oa2gsheets')
        extpay.openTrialPage("7-day")
    })
}

document.getElementById('dashboard').addEventListener('click', open_dashboard)
document.getElementById('oa2gsheets').addEventListener("click", monthly)
document.getElementById('oa2gsheets_lifetime').addEventListener("click", lifetime)
document.getElementById('trial').addEventListener("click", start_trial)

function check_trial(user) {
    const now = new Date();
    const days_21 = 1000*60*60*24*21 // in milliseconds
    if (user.trialStartedAt && (now - user.trialStartedAt) < days_21) {
        return true
    }
    else {
        return false
    }
}

async function is_paid() {
    chrome.storage.sync.get(['oa_plan'], async function (result) {
        let plan = result.oa_plan
        console.log(plan)
        const extpay = ExtPay(plan)
        const user = await extpay.getUser();
        if (check_trial(user) === true){
            handle_paid(true)
        }
        else {
            handle_paid(user.paid)
        }
    });
}

function handle_paid(p) {
    let paid = p
    if (paid === true) {
        document.getElementById("picker").className = 'nav-link'
        chrome.storage.sync.get(['oa_plan'], function (result){
            if (result.oa_plan === 'oa2gsheets') {
                document.getElementById('oa2gsheets').innerHTML = "Manage Subscription"
                document.getElementById('button_div').remove()
                document.getElementById('dash_div').style.display = 'inline'
                document.getElementById('trial_div').remove()
                document.getElementById('oa2gsheets_lifetime').style.marginLeft = "70px";
                document.getElementById('oa2gsheets_lifetime').innerHTML = "Upgrade Now"
                document.getElementById('oa2gsheets-lifetime').disabled = true
            }
            else {
                document.getElementById('monthly_div').remove()
                document.getElementById('trial_div').remove()
                document.getElementById('para').innerHTML = 'hey'
            }
        })
    }
    else {
        document.getElementById("para").innerHTML = "false"
        document.getElementById("picker").className = 'nav-link disabled'
    }
}
is_paid()