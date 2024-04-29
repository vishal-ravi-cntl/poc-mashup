import { createContext, useContext } from "react";
import { useConnectEngine } from "../Hooks/qlik-hooks";
import { useOpenDoc } from "../Hooks/qlik-hooks/Global";

export const QlikContext = createContext();

const salesAppId = "799ab440-b740-4c54-b941-bb1413ce6696";
const subscriptionAppId = "63f2c786-ae10-447a-916c-bf9286e58876";
const configs = [
  {
    host: "dash.condenast.com",
    isSecure: true,
    appname: salesAppId,
  },
  {
    host: "dash.condenast.com",
    isSecure: true,
    appname: subscriptionAppId,
  },
];

export function SessionProvider({ children }) {
  const sessions = [useConnectEngine(configs[0]), useConnectEngine(configs[1])];
  const apps = [
    useOpenDoc(sessions[0], {
      params: [configs[0].appname],
    }),
    useOpenDoc(sessions[1], {
      params: [configs[1].appname],
    }),
  ];

  return <QlikContext.Provider value={apps}>{children}</QlikContext.Provider>;
}

export const useSession = () => useContext(QlikContext);
