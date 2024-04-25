import { createContext, useContext } from "react";
import { useConnectEngine } from "../Hooks/qlik-hooks";
import { useOpenDoc } from "../Hooks/qlik-hooks/Global";

export const QlikContext = createContext();

export function SessionProvider({ appName, children }) {
  const config = {
    host: "dash.condenast.com",
    isSecure: true,
    appname: appName,
  };
  const session = useConnectEngine(config);

  const app = useOpenDoc(session, {
    params: [config.appname],
  });

  return <QlikContext.Provider value={app}>{children}</QlikContext.Provider>;
}

export const useSession = () => useContext(QlikContext);
