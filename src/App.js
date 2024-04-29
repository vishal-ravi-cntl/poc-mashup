import { useState } from "react";
import "./App.css";
import BarChart from "./Components/BarChart";
import Filter from "./Components/Filter";
import Kpi from "./Components/Kpi";
import { SessionProvider } from "./Context/QlikContext";

function App() {
  const salesKpiObjectID = "DhusPup";
  const salesTableObjectID = "wRXTg";
  const subscriptionKpiObjectID = "DhusPup";
  const subscriptiontableObjectID = "wRXTg";

  return (
    <div className="App">
      <SessionProvider>
        <Filter expression={"Country"} label={"Country"} />
        <Kpi objectId={salesKpiObjectID} appIndex={0} />
        <BarChart objectId={salesTableObjectID} appIndex={0} />
        <Kpi objectId={subscriptionKpiObjectID} appIndex={1} />
        <BarChart objectId={subscriptiontableObjectID} appIndex={1} />
      </SessionProvider>
    </div>
  );
}

export default App;
