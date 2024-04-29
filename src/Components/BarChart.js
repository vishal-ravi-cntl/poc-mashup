import React, { useEffect, useState } from "react";
import { useGetObject } from "../Hooks/qlik-hooks/Doc";
import {
  useGetLayout,
  useGetHyperCubeData,
} from "../Hooks/qlik-hooks/GenericObject";
import { useSession } from "../Context/QlikContext";

function BarChart({ objectId, appIndex }) {
  const apps = useSession();
  const obj = useGetObject(apps[appIndex], { params: [objectId] });
  const objLayout = useGetLayout(obj, { params: [], invalidations: true });
  const hyperCubeData = useGetHyperCubeData(obj);

  const [data, setData] = useState([]);
  const [showChart, setShowChart] = useState(false);
  const [totalRows, setTotalRows] = useState(-1);
  const rowsPerPage = 3000;

  //   console.log("object Layout:", objLayout);

  useEffect(() => {
    if (objLayout.qResponse != null) {
      const temptotalRows = objLayout.qResponse.qHyperCube.qSize.qcy;
      setTotalRows(temptotalRows);
      setData([]);
      for (let i = 0; i < totalRows; i += rowsPerPage) {
        hyperCubeData.call("/qHyperCubeDef", [
          {
            qTop: i,
            qLeft: 1,
            qWidth: 1,
            qHeight: Math.min(rowsPerPage, totalRows - i),
          },
          {
            qTop: i,
            qLeft: 2,
            qWidth: 1,
            qHeight: Math.min(rowsPerPage, totalRows - i),
          },
        ]);
      }
    }
  }, [objLayout, totalRows]);

  useEffect(() => {
    if (hyperCubeData.qResponse != null) {
      // console.log("hypercube", hyperCubeData);

      let tableData =
        hyperCubeData?.qResponse[0].qMatrix?.map((item, index) => {
          let obj = {};
          obj.month = hyperCubeData?.qResponse[0].qMatrix[index][0].qText;
          obj.sales = hyperCubeData?.qResponse[1].qMatrix[index][0].qText;
          return obj;
        }) || [];

      console.log({ tableData });

      setData((data) => [...data, ...tableData]);
      setShowChart(true);
    }
  }, [hyperCubeData]);
  return (
    <div>
      {showChart ? (
        <div>{"Data Value: " + data[0]}</div>
      ) : (
        <div>Bar chart data Loading..</div>
      )}
    </div>
  );
}

export default BarChart;
