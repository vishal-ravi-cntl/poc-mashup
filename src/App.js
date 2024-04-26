import "./App.css";
import BarChart from "./Components/BarChart";
import Filter from "./Components/Filter";
import Kpi from "./Components/Kpi";
import { SessionProvider } from "./Context/QlikContext";

function App() {
  const salesAppId = "799ab440-b740-4c54-b941-bb1413ce6696";
  const salesKpiObjectID = "DhusPup";
  const salesTableObjectID = "wRXTg";
  const subscriptionAppId = "63f2c786-ae10-447a-916c-bf9286e58876";
  const subscriptionKpiObjectID = "DhusPup";
  const subscriptiontableObjectID = "wRXTg";

  return (
    <div className="App">
      <SessionProvider appName={salesAppId}>
        <Filter expression={"Country"} label={"Country"} />
        <Kpi objectId={salesKpiObjectID} />
        <BarChart objectId={salesTableObjectID} />
      </SessionProvider>
      <SessionProvider appName={subscriptionAppId}>
        <Kpi objectId={subscriptionKpiObjectID} />
        <BarChart objectId={salesTableObjectID} />
      </SessionProvider>
    </div>
  );
}

export default App;
