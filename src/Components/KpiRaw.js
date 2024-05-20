import React, { useEffect, useState } from "react";
import { useSession } from "../Context/QlikContext";
import {
  useCreateObject,
  useCreateSessionObject,
  useGetObject,
} from "../Hooks/qlik-hooks/Doc";
import { useGetLayout } from "../Hooks/qlik-hooks/GenericObject";
function KpiRaw({ title, appIndex }) {
  const apps = useSession();
  const [data, setData] = useState();
  const [showKPI, setShowKPI] = useState(false);

  const objectProperties = {
    qInfo: {
      qType: "my-generic-object",
    },
    qHyperCubeDef: {
      qDimensions: [
        // {
        //   qDef: {
        //     qFieldDefs: ["Country"],
        //   },
        // },
        // {
        //   qDef: {
        //     qFieldDefs: ["Month"],
        //   },
        // },
      ],
      qMeasures: [
        {
          qDef: {
            qDef: "Sum(Sales)",
          },
        },
      ],
      qInitialDataFetch: [
        {
          qTop: 0,
          qLeft: 0,
          qHeight: 10, // Adjust based on your needs
          qWidth: 3,
        },
      ],
    },
  };

  const pseudoObj = useCreateSessionObject(apps[appIndex], {
    params: [objectProperties],
  });

  const pseudoObjLayout = useGetLayout(pseudoObj, {
    params: [],
    invalidations: true,
  });

  useEffect(() => {
    // console.log({ pseudoObjLayout });
    if (pseudoObjLayout.qResponse != null) {
      const kpiValue =
        pseudoObjLayout.qResponse.qHyperCube?.qDataPages[0].qMatrix[0][0].qText;
      setData(formatNumberAbbreviated(kpiValue));
      setShowKPI(true);
    }
  }, [pseudoObjLayout]);

  // useEffect(() => {
  //   // console.log({ data });
  // }, [data]);

  function formatNumberAbbreviated(number) {
    if (number < 1000) {
      return number.toString();
    } else if (number < 1000000) {
      return (number / 1000).toFixed(1) + "K";
    } else if (number < 1000000000) {
      return (number / 1000000).toFixed(1) + "M";
    } else if (number < 1000000000000) {
      return (number / 1000000000).toFixed(1) + "B";
    } else {
      return (number / 1000000000000).toFixed(1) + "T";
    }
  }
  return (
    <div>
      {showKPI ? (
        <div class="font-sans border rounded-md mb-3 mr-3 w-52">
          <div class="text-base font-light ml-2 mt-2 mr-2 ">{title}</div>
          <div class="text-5xl text-[#BED754] font-bold mt-3 ml-2 mb-3 mr-2">
            {data}
          </div>
        </div>
      ) : (
        <div>KPI Loading..</div>
      )}
    </div>
  );
}

export default KpiRaw;
