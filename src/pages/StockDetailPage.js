import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import finnHub from "../apis/finnHub";
import { StockChart } from "../components/StockChart";
import StockData from "../components/StockData";

// transform data for chart
function formatData(data) {
  return data.t.map((el, index) => {
    return {
      x: el * 1000,
      y: Math.floor(data.c[index]),
    };
  });
}

function StockDetailPage() {
  const [chartData, setChartData] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const { symbol } = useParams();

  useEffect(() => {
    async function fetchData() {
      try {
        const date = new Date();
        const currentTime = Math.floor(date.getTime() / 1000);
        let oneDay;
        // For issues where markets are closed on weekends
        if (date.getDay() === 6) {
          oneDay = currentTime - 2 * 24 * 60 * 60;
        } else if (date.getDay() === 0) {
          oneDay = currentTime - 3 * 24 * 60 * 60;
        } else {
          oneDay = currentTime - 24 * 60 * 60;
        }

        const oneWeek = currentTime - 7 * 24 * 60 * 60;
        const oneYear = currentTime - 365 * 24 * 60 * 60;
        //   fetch request

        const responses = await Promise.all([
          finnHub.get("/stock/candle", {
            params: {
              symbol,
              from: oneDay,
              to: currentTime,
              resolution: 30,
            },
          }),
          finnHub.get("/stock/candle", {
            params: {
              symbol,
              from: oneWeek,
              to: currentTime,
              resolution: 60,
            },
          }),
          finnHub.get("/stock/candle", {
            params: {
              symbol,
              from: oneYear,
              to: currentTime,
              resolution: "W",
            },
          }),
        ]);
        console.log(responses);
        setChartData({
          day: formatData(responses[0].data),
          week: formatData(responses[1].data),
          year: formatData(responses[2].data),
        });
      } catch (error) {
        setErrorMessage(
          "Due to recent Finnhub pricing changes, candle data is now only available in the premium tier, making it unaffordable for some. Consequently, the graph functionality is limited. Please visit the project's official repository to see the expected graph behavior."
        );
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
