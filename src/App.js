import "./App.css";
import { SessionProvider } from "./Context/QlikContext";

function App() {
  const salesAppId = "799ab440-b740-4c54-b941-bb1413ce6696";
  const subscriptionAppId = "63f2c786-ae10-447a-916c-bf9286e58876";

  return (
    <div className="App">
      <SessionProvider>Yo!</SessionProvider>
    </div>
  );
}

export default App;
