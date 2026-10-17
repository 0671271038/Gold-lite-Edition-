// netlify/functions/gold.js - WISETRADER
let cachedPrice = null;
let cachedTime = 0;

exports.handler = async function(event, context) {
  const now = Date.now();
  
  if(cachedPrice && (now - cachedTime < 60000)){
    return {
      statusCode: 200,
      headers: {"Access-Control-Allow-Origin":"*"},
      body: JSON.stringify({price: cachedPrice, cached: true})
    };
  }

  try {
    const API_KEY = "00dbc426aade4a79991fa4a89f1806d2";
    const url = `https://api.twelvedata.com/price?symbol=XAU/USD&apikey=${API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    
    if(data.price){
      cachedPrice = data.price;
      cachedTime = now;
      return {
        statusCode: 200,
        headers: {"Access-Control-Allow-Origin":"*"},
        body: JSON.stringify({price: data.price, cached: false})
      };
    } else {
      return {
        statusCode: 200,
        headers: {"Access-Control-Allow-Origin":"*"},
        body: JSON.stringify({price: cachedPrice || "2650.00", cached: true})
      };
    }
  } catch(e){
    return {
      statusCode: 200,
      headers: {"Access-Control-Allow-Origin":"*"},
      body: JSON.stringify({price: cachedPrice || "2650.00", cached: true})
    };
  }
};
