const ccxt = require("ccxt");
const moment = require("moment");

const binance = new ccxt.binance({
    apiKey: 'WkKTN6g7NmDOHXAlt61tGkylBdHBraJHq12FcWY7tA4cRe76s2e3sM20qWxV7Akf',
    secret: 'ylJ91Fs3CwhJ4fzn1e0SeSUk1q5UPA7BtpUWzXBSy1Ht9gPr9RXDCYMs3681fW8O'
});
binance.setSandboxMode (true);


async function printBinance(){
    const balance = await binance.fetchBalance();
    console.log(balance);
}
async function main(){

    const price = await binance.fetchOHLCV('BTC/USDT','1m',undefined,5);
    //console.log(price);
    const bPrice = price.map(price=>{
        return{
            timestamp: moment(price[0]).format(),
            open: price[1],
            high: price[2],
            low: price[3],
            close: price[4],
            volume: price[5]
        }
    })
    console.log(bPrice);

}
printBinance()