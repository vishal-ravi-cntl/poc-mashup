import "./App.css";
import QlikContext from "./Hooks/qlik-hooks/connect/QlikProvider";

function App() {
  const salesAppId = "799ab440-b740-4c54-b941-bb1413ce6696";
  const subscriptionAppId = "63f2c786-ae10-447a-916c-bf9286e58876";
  const salesConfig = {
    host: "dash.condenast.com",
    isSecure: true,
    appname: salesAppId,
  };

  return (
    <div className="App">
      <QlikContext config={salesConfig}>Yo!</QlikContext>
    </div>
  );
}

export default App;
