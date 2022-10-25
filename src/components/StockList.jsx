import { useState, useEffect, useContext } from "react";
import { BsFillCaretDownFill } from "react-icons/bs";
import { BsFillCaretUpFill } from "react-icons/bs";
import finnHub from "../apis/finnHub";
import { WatchListContext } from "../context/watchListContext";
import { useNavigate } from "react-router-dom";

function StockList() {
  const [stock, setStock] = useState([]);
  const value = useContext(WatchListContext).watchList;
  const { deleteStock } = useContext(WatchListContext);
  const navigate = useNavigate();

  function changeColor(change) {
    return change > 0 ? "success" : "danger";
  }

  function renderIcon(change) {
    return change > 0 ? <BsFillCaretUpFill /> : <BsFillCaretDownFill />;
  }

  function handleStockSelect(symbol) {
    navigate(`detail/${symbol}`);
  }

  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      const responses = [];
      try {
        //   For multiple requests, they return one by one which is very slow and cumbersome. so we use ''Promise.all()'

        const responses = await Promise.all(
          value.map((stock) => {
            return finnHub.get("/quote", {
              params: {
                symbol: stock,
              },
            });
          })
        );

        console.log(responses);
        const data = responses.map((response) => {
          return {
            data: response.data,
            symbol: response.config.params.symbol,
          };
        });
        console.log(data);

        if (isMounted) {
          setStock(data);
        }
      } catch (err) {}
    }
    fetchData();

    return () => (isMounted = false);
  }, [value]);

  return (
    <div className="stock-table">
      <table className="table hover mt-5 ">
        <thead className="table-dark">
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Last</th>
            <th scope="col">Chg</th>
            <th scope="col">Chg%</th>
            <th scope="col">High</th>
            <th scope="col">Low</th>
            <th scope="col">Open</th>
            <th scope="col">Pclose</th>
          </tr>
        </thead>

        <tbody>
          {stock.map((stockData) => {
            return (
              <tr
                onClick={() => handleStockSelect(stockData.symbol)}
                className="table-row"
                key={stockData.symbol}
                style={{ cursor: "pointer" }}
              >
                <th scope="row">{stockData.symbol}</th>
                <td>{stockData.data.c}</td>
                <td className={`text-${changeColor(stockData.data.d)}`}>
                  {stockData.data.d} {renderIcon(stockData.data.d)}
                </td>
                <td className={`text-${changeColor(stockData.data.dp)}`}>
                  {stockData.data.dp} {renderIcon(stockData.data.dp)}
                </td>
                <td>{stockData.data.h}</td>
                <td>{stockData.data.l}</td>
                <td>{stockData.data.o}</td>
                <td>{stockData.data.pc} </td>
                <button
                  className="btn btn-danger btn-sm ml-3  delete-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteStock(stockData.symbol);
                  }}
                >
                  Remove
                </button>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default StockList;
