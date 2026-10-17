let c="2654.32",t=0;
exports.handler=async()=>{
  const n=Date.now();
  if(c&&(n-t<30000)) return {statusCode:200,headers:{"Access-Control-Allow-Origin":"*","Content-Type":"application/json"},body:JSON.stringify({price:c,cached:true})};
  try{
    const k="00dbc426aade4a79991fa4a89f1806d2";
    const r=await fetch(`https://api.twelvedata.com/price?symbol=XAU/USD&apikey=${k}`,{headers:{"User-Agent":"Mozilla/5.0"}});
    const d=await r.json();
    if(d.price && parseFloat(d.price)>100){c=d.price;t=n; return {statusCode:200,headers:{"Access-Control-Allow-Origin":"*","Content-Type":"application/json"},body:JSON.stringify({price:d.price,cached:false})}}
    throw new Error('no price');
  }catch(e){
    return {statusCode:200,headers:{"Access-Control-Allow-Origin":"*","Content-Type":"application/json"},body:JSON.stringify({price:c,cached:true,error:true})}
  }
}
