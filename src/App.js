import "./App.css";
import Kpi from "./Components/Kpi";
import { SessionProvider } from "./Context/QlikContext";

function App() {
  const salesAppId = "799ab440-b740-4c54-b941-bb1413ce6696";
  const salesKpiObjectID = "DhusPup";
  const subscriptionAppId = "63f2c786-ae10-447a-916c-bf9286e58876";
  const subscriptionKpiObjectID = "DhusPup";

  return (
    <div className="App">
      <SessionProvider appName={salesAppId}>
        <Kpi objectId={salesKpiObjectID} />
      </SessionProvider>
      <SessionProvider appName={subscriptionAppId}>
        <Kpi objectId={subscriptionKpiObjectID} />
      </SessionProvider>
    </div>
  );
}

export default App;
