let cache={price:"2665.42",m5:[],m1:[],t:0};
exports.handler=async()=>{
  const now=Date.now();
  if(cache.t && (now-cache.t<15000) && cache.price){
    return {statusCode:200,headers:{"Access-Control-Allow-Origin":"*","Content-Type":"application/json"},body:JSON.stringify(cache)};
  }
  const k="00dbc426aade4a79991fa4a89f1806d2";
  try{
    const pRes=await fetch(`https://api.twelvedata.com/price?symbol=XAU/USD&apikey=${k}`);
    const p=await pRes.json();
    if(p.price) cache.price=p.price;
  }catch(e){}
  
  try{
    const m5Res=await fetch(`https://api.twelvedata.com/time_series?symbol=XAU/USD&interval=5min&outputsize=30&apikey=${k}`);
    const m5=await m5Res.json();
    if(m5.values) cache.m5=m5.values.reverse();
  }catch(e){}
  
  try{
    const m1Res=await fetch(`https://api.twelvedata.com/time_series?symbol=XAU/USD&interval=1min&outputsize=30&apikey=${k}`);
    const m1=await m1Res.json();
    if(m1.values) cache.m1=m1.values.reverse();
  }catch(e){}
  
  if(!cache.price){
    cache.price="2665.42";
  }
  cache.t=now;
  return {statusCode:200,headers:{"Access-Control-Allow-Origin":"*","Content-Type":"application/json"},body:JSON.stringify(cache)};
}
