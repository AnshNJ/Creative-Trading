import { createContext, useEffect, useState } from "react";

export const WatchListContext = createContext();

export const WatchListContextProvider = (props) => {
  const [watchList, setWatchList] = useState(
    localStorage.getItem("watchList")?.split(',') ||
    ["GOOGL", "MSFT", "AMZN"]);

  useEffect(() => {
    localStorage.setItem("watchList", watchList)
  },[watchList])

  function addStock(stock) {
    if(watchList.indexOf((stock) === -1)) {
        setWatchList([...watchList,stock])
    }
  }

  function deleteStock(stock) {
    setWatchList(watchList.filter((el) => {
        return el !== stock
    }))
  }

  return (
    <WatchListContext.Provider value={{watchList, addStock, deleteStock}}>
        {props.children}
    </WatchListContext.Provider>
  );
};
