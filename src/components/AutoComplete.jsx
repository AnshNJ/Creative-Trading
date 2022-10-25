import { useState, useEffect, useContext } from "react";
import finnHub from "../apis/finnHub";
import { WatchListContext } from "../context/watchListContext";

function StockAuto() {
  const [search, setSearch] = useState("");
  const [result, setResult] = useState([]);

  const {addStock} = useContext(WatchListContext)
  

  function renderDropDown() {
    const dropDownClass = search ? "show" : null;
    return (
        <ul style={{
            height: '500px',
            overflowY: 'scroll',
            overflowX: 'auto',
            cursor: 'pointer'
        }} className={`dropdown-menu ${dropDownClass}`}>
            {result.map((stock) => 
                <li className="dropdown-item" key={stock.symbol} onClick={() => {
                  addStock(stock.symbol);
                  setSearch("");
                }}>{stock.description} ({stock.symbol})</li>)}
        </ul>
    )
  }

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const response = await finnHub.get("/search", {
          params: {
            q: search,
          },
        });

        console.log(response);
        if (isMounted) {
          setResult(response.data.result);
        }
      } catch (err) {}
    };
    if (search.length > 0) {
      fetchData();
    } else {
      setResult([]);
    }

    return () => (isMounted = false);
  }, [search]);

  return (
    <div className="w-50 p-2 rounded mx-auto">
      <div className="form-floating dropdown">
        <input
          style={{ backgroundColor: "rgba(145,158,171, 0,04)" }}
          className="form-control"
          id="search"
          type="text"
          autoComplete="off"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <label htmlFor="search">Search</label>
        {renderDropDown()}
        {console.log(result)}
      </div>
    </div>
  );
}

export default StockAuto;
