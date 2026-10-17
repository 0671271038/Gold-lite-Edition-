let cache = { price: null, m5: [], m1: [], t: 0 };

exports.handler = async () => {
const headers = {
"Access-Control-Allow-Origin": "*",
"Content-Type": "application/json",
"Cache-Control": "no-store"
};

try {
const now = Date.now();

// Reuse cached market data for 15 seconds
if (cache.t && now - cache.t < 15000 && cache.price) {
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ ...cache, cached: true })
  };
}

const API_KEY = process.env.TWELVE_DATA_API_KEY;

if (!API_KEY) {
  return {
    statusCode: 500,
    headers,
    body: JSON.stringify({
      error: "Missing TWELVE_DATA_API_KEY environment variable"
    })
  };
}

const base = "https://api.twelvedata.com/time_series";

async function getCandles(interval) {
  const url = `${base}?symbol=XAU/USD&interval=${interval}&outputsize=250&timezone=Africa/Johannesburg&apikey=${API_KEY}`;

  const response = await fetch(url);
  const data = await response.json();

  if (!response.ok || data.status === "error" || !data.values) {
    throw new Error(data.message || `Twelve Data ${interval} request failed`);
  }

  return data.values.map(c => ({
    time: c.datetime,
    open: Number(c.open),
    high: Number(c.high),
    low: Number(c.low),
    close: Number(c.close)
  })).reverse();
}

const [m1, m5] = await Promise.all([
  getCandles("1min"),
  getCandles("5min")
]);

cache = {
  price: m1.length ? m1[m1.length - 1].close : null,
  m1,
  m5,
  t: Date.now()
};

return {
  statusCode: 200,
  headers,
  body: JSON.stringify({ ...cache, cached: false })
};

} catch (error) {
return {
statusCode: 502,
headers,
body: JSON.stringify({
error: "Unable to fetch gold market data",
details: error.message
})
};
}
};
