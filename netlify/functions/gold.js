let c=null,t=0;
exports.handler=async()=>{
  const n=Date.now();
  if(c&&(n-t<60000))return{statusCode:200,headers:{"Access-Control-Allow-Origin":"*"},body:JSON.stringify({price:c,cached:true})};
  try{
    const k="00dbc426aade4a79991fa4a89f1806d2";
    const r=await fetch(`https://api.twelvedata.com/price?symbol=XAU/USD&apikey=${k}`);
    const d=await r.json();
    if(d.price){c=d.price;t=n;return{statusCode:200,headers:{"Access-Control-Allow-Origin":"*"},body:JSON.stringify({price:d.price,cached:false})}}
    return{statusCode:200,headers:{"Access-Control-Allow-Origin":"*"},body:JSON.stringify({price:c||"2650",cached:true})}
  }catch(e){return{statusCode:200,headers:{"Access-Control-Allow-Origin":"*"},body:JSON.stringify({price:c||"2650",cached:true})}}
}
