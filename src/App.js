import { useState } from "react";
import "./App.css";
import BarChart from "./Components/BarChart";
import Filter from "./Components/Filter";
import Kpi from "./Components/Kpi";
import { SessionProvider } from "./Context/QlikContext";
import DropDown from "./Components/DropDown";
import KpiRaw from "./Components/KpiRaw";

function App() {
  const salesKpiObjectID = "DhusPup";
  const salesTableObjectID = "wRXTg";
  const subscriptionKpiObjectID = "DhusPup";
  const subscriptiontableObjectID = "wRXTg";
  // items-center
  return (
    <div class="flex flex-col justify-between w-1/2 m-auto mt-3 text-dark-grey">
      <SessionProvider>
        <div class="flex flex-row justify-between mb-3 ">
          <DropDown />
          <Filter expression={"Country"} label={"Country"} />
        </div>
        <div class="flex flex-row justify-between">
          <div class="flex flex-col ">
            <Kpi
              title="Total Sales:"
              objectId={salesKpiObjectID}
              appIndex={0}
            />
            <Kpi
              title="Total Subscription:"
              objectId={subscriptionKpiObjectID}
              appIndex={1}
            />
            <KpiRaw title="Total Sales (Raw data):" appIndex={0} />
          </div>
          <div class="flex flex-col">
            <BarChart
              title="Sales vs Month Trend"
              objectId={salesTableObjectID}
              appIndex={0}
              yAxisLabelText="Sales"
              xAxisLabelText="Months"
            />
            <BarChart
              title="Subscriptions vs Month Trend"
              objectId={subscriptiontableObjectID}
              appIndex={1}
              yAxisLabelText="Subscriptions"
              xAxisLabelText="Months"
            />
          </div>
        </div>
      </SessionProvider>
    </div>
  );
}

export default App;
