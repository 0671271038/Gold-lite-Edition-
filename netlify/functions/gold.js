let cache={price:"2654.32",m5:[],m1:[],t:0};
exports.handler=async()=>{
  const now=Date.now();
  if(cache.t && (now-cache.t<15000)){
    return {statusCode:200,headers:{"Access-Control-Allow-Origin":"*","Content-Type":"application/json"},body:JSON.stringify(cache)};
  }
  const k="00dbc426aade4a79991fa4a89f1806d2";
  try{
    const [p,m5,m1]=await Promise.all([
      fetch(`https://api.twelvedata.com/price?symbol=XAU/USD&apikey=${k}`).then(r=>r.json()),
      fetch(`https://api.twelvedata.com/time_series?symbol=XAU/USD&interval=5min&outputsize=50&apikey=${k}`).then(r=>r.json()),
      fetch(`https://api.twelvedata.com/time_series?symbol=XAU/USD&interval=1min&outputsize=50&apikey=${k}`).then(r=>r.json())
    ]);
    if(p.price) cache.price=p.price;
    if(m5.values) cache.m5=m5.values.reverse();
    if(m1.values) cache.m1.values.reverse();
    cache.t=now;
    return {statusCode:200,headers:{"Access-Control-Allow-Origin":"*","Content-Type":"application/json"},body:JSON.stringify({...cache,cached:false})};
  }catch(e){
    return {statusCode:200,headers:{"Access-Control-Allow-Origin":"*","Content-Type":"application/json"},body:JSON.stringify({...cache,cached:true})};
  }
}
