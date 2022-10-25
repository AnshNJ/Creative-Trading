import finnHub from "../apis/finnHub";
import { useState, useEffect, Fragment } from "react";

function StockData({ symbol }) {
  const [stockData, setStockData] = useState({symbol});

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const response = await finnHub.get("/stock/profile2", {
          params: {
            symbol
          }
        })
        console.log(response)
        if (isMounted) {
          setStockData(response.data)
        }
      } catch (err) {
        console.log(err)
      }
    }
    fetchData()
    return () => (isMounted = false);
  }, [symbol])
  return (
    <div>
      {stockData ? (
        <div className="stockdata row border bg-white rounded shadow-sm">
          <div className="col">
            <div>
              <span className="fw-bold">Name: </span>
              {stockData.name}
            </div>
            <div>
              <span className="fw-bold">Country: </span>
              {stockData.country}
            </div>
            <div>
              <span className="fw-bold">Ticker: </span>
              {stockData.ticker}
            </div>
          </div>
          <div className="col">
            <div>
              <span className="fw-bold">Exchange: </span>
              {stockData.exchange}
            </div>
            <div>
              <span className="fw-bold">Industry: </span>
              {stockData.finnhubIndustry}
            </div>
            <div>
              <span className="fw-bold">IPO: </span>
              {stockData.ipo}
            </div>
          </div>
          <div className="col">
            <div>
              <span className="fw-bold">MarketCap: </span>
              {stockData.marketCapitalization}
            </div>
            <div>
              <span className="fw-bold">Shared Outstanding: </span>
              {stockData.shareOutstanding}
            </div>
            <div>
              <span className="fw-bold">url: </span>
              <a href={stockData.weburl}>{stockData.weburl}</a>
            </div>
          </div>
        </div>
      ) : ''} 
    </div>
  );
}

export default StockData;
