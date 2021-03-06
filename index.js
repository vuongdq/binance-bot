const ccxt = require("ccxt");
const moment = require("moment");
const delay = require("delay");

const binance = new ccxt.binance({
    apiKey: 'TkDtH8KO4WhgbPtfnCSikFSC7OCl6rR4WmB7lbL3Ya1gXdJmDDHLZkZxNHs2Dqce',
    secret: 'ubi9o4yEa3L3F4zIfzxbZCJAnPrLkU4OHiTfobOUXFhWtAjj6XOcYvLMPRufzXNn'
});
 binance.setSandboxMode (true);


async function printBalance(btcPrice){
    const balance = await binance.fetchBalance();
    const total = balance.total
    console.log(`Balance: BTC ${total.BTC}, USDT ${total.USDT}`);
    console.log(`Total USD: ${(total.BTC-1)*btcPrice +total.USDT}. \n`);
}

async function tick() {

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

    // Tinh toan trade
    // if(lastPrice>avaragePrice){
    //     let direction = 'sell'
    // }else {
    //     let direction ='buy'
    // }
    // Dung Ternary cho chuyen nghiep
    const direction = lastPrice>avaragePrice ? 'sell': 'buy';
    const TRADE_SIZE = 1100;
    const quantity = 1100/lastPrice;

    // tao giao dich
    console.log("--Thong tin gia--")
    console.log('avarage price:'+ avaragePrice+ '------last price: '+ lastPrice); // in thong tin price
    const order = await binance.createMarketOrder('BTC/USDT',direction,quantity);
    console.log(`${moment().format()}:${direction}${quantity} BTC at ${lastPrice}`);
    printBalance(lastPrice);
    // console.log(order);
}

async function main(){
    while (true){
        await tick();
        await delay(60*1000)
    }
}

main();
// printbalance()