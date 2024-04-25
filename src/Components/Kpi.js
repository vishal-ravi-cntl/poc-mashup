import React, { useEffect, useState } from "react";
import { useSession } from "../Context/QlikContext";
import { useGetObject } from "../Hooks/qlik-hooks/Doc";
import { useGetLayout } from "../Hooks/qlik-hooks/GenericObject";
function Kpi({ objectId }) {
  const app = useSession();
  const obj = useGetObject(app, { params: [objectId] });
  const objLayout = useGetLayout(obj, { params: [], invalidations: true });
  const [data, setData] = useState();
  const [showKPI, setShowKPI] = useState(false);

  useEffect(() => {
    if (objLayout.qResponse != null) {
      const kpiValue =
        objLayout.qResponse.qHyperCube?.qDataPages[0].qMatrix[0][0].qText;
      console.log(kpiValue);
      setData(kpiValue);
      setShowKPI(true);
    }
  }, [objLayout]);

  return (
    <div>
      {showKPI ? <div>{"KPI Value: " + data}</div> : <div>KPI Loading..</div>}
    </div>
  );
}

export default Kpi;
