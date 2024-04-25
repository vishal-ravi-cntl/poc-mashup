import { createContext, useContext } from "react";
import { useConnectEngine } from "../Hooks/qlik-hooks";
import { useOpenDoc } from "../Hooks/qlik-hooks/Global";

export const QlikContext = createContext();

export function SessionProvider({ children }) {
  const config = {
    host: "dash.condenast.com",
    isSecure: true,
    appname: "799ab440-b740-4c54-b941-bb1413ce6696",
  };
  const session = useConnectEngine(config);

  const app = useOpenDoc(session, {
    params: [config.appname],
  });

  return <QlikContext.Provider value={app}>{children}</QlikContext.Provider>;
}

export const useSession = () => useContext(QlikContext);
