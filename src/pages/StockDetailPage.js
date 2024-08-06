import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { StockChart } from "../components/StockChart";
import StockData from "../components/StockData";

const API_KEY = 'ATQTFBCYYZ1P2KH2'; // Replace with your Alpha Vantage API key

function formatData(data) {
  return Object.entries(data).map(([date, values]) => ({
    x: new Date(date).getTime(),
    y: parseFloat(values['4. close'])
  })).reverse();
}

function StockDetailPage() {
  const [chartData, setChartData] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const { symbol } = useParams();

  useEffect(() => {
    async function fetchData() {
      try {
        const responses = await Promise.all([
          axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=30min&apikey=${API_KEY}`),
          axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEY}`),
          axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol=${symbol}&apikey=${API_KEY}`)
        ]);

        setChartData({
          day: formatData(responses[0].data['Time Series (30min)']),
          week: formatData(responses[1].data['Time Series (Daily)']),
          year: formatData(responses[2].data['Weekly Time Series'])
        });
      } catch (error) {
        setErrorMessage("An error occurred while fetching the stock data. Please try again later.");
      }
    }
    fetchData();
  }, [symbol]);

  return (
    <div>
      <div className="detail-page">
        {errorMessage && (
          <div
            className="error-message"
            style={{ color: "red", textAlign: "center", marginTop: "20px" }}
          >
            {errorMessage}
          </div>
        )}
        <StockChart chartData={chartData} symbol={symbol} />
        <StockData symbol={symbol} />
      </div>
    </div>
  );
}

export default StockDetailPage;