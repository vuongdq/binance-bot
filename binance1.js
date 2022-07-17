const ccxt = require("ccxt");
const moment = require("moment");
const delay = require("delay");

const binance = new ccxt.binance({
    apiKey: 'YiWWLLIyvt4ugJnuEo8UDHpiWrCReh6LQVMzrOKGeJgje4CUmV6CkO79HLeKZ6j3sa',
    secret: 'Ws3OaZtsFNYwKHmoLPIr7vSdlkfVZwdkqVuv4wltFqQgZXMykaKM5pwhGhAhRC25'
});

async function printBalance(btcPrice){
    const balance = await binance.fetchBalance();
    const total = balance.total
    console.log(`Balance: BTC ${total.BTC}, USDT ${total.USDT}`);
    console.log(`Total USD: ${(total.BTC)*btcPrice +total.USDT}. \n`);
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
    const avaragePrice = bPrice.reduce((acc,price)=>acc+price.close,0)/5;
    const lastPrice = bPrice[bPrice.length-1].close;

    console.log("--Thong tin gia--")
    console.log(bPrice.map(p=>p.close),avaragePrice,lastPrice);
    console.log("--ket thuc Thong tin gia--")

    const direction = 'buy';
    const TRADE_SIZE = 40;
    const quantity = 40/lastPrice;

    // tao giao dich
    console.log("--Thong tin gia--")
    console.log('avarage price:'+ avaragePrice+ '------last price: '+ lastPrice); // in thong tin price
     const order = await binance.createLimitBuyOrder("BTC/USDT",quantity,19000);
    console.log(`${moment().format()}:${direction}${quantity} BTC at ${lastPrice}`);
    printBalance(lastPrice);
}
main();