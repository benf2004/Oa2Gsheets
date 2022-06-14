// background.js

importScripts('ExtPay.js') // or `import` / `require` if using a bundler

var extpay = ExtPay('oa2gsheets'); // Careful! See note below
extpay.startBackground();

