import React, { useEffect, useRef, useState } from "react";
import { useGetObject } from "../Hooks/qlik-hooks/Doc";
import {
  useGetLayout,
  useGetHyperCubeData,
} from "../Hooks/qlik-hooks/GenericObject";
import { useSession } from "../Context/QlikContext";
import { flatGroup, scaleOrdinal, schemeCategory10, select } from "d3";
import { scaleLinear, scaleBand } from "d3";
import { Axes } from "./ChartComponent/Axes";

function BarChart({ objectId, appIndex }) {
  const apps = useSession();
  const obj = useGetObject(apps[appIndex], { params: [objectId] });
  const objLayout = useGetLayout(obj, { params: [], invalidations: true });
  const hyperCubeData = useGetHyperCubeData(obj);

  const [data, setData] = useState([]);
  const [showChart, setShowChart] = useState(false);
  const [totalRows, setTotalRows] = useState(-1);
  const rowsPerPage = 3000;

  const width = 700,
    height = 500;
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
          {
            qTop: i,
            qLeft: 0,
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
          obj.country = hyperCubeData?.qResponse[2].qMatrix[index][0].qText;
          return obj;
        }) || [];

      // console.log({ tableData });

      setData((data) => [...data, ...tableData]);
      setShowChart(true);
    }
  }, [hyperCubeData]);

  const svgRef = useRef();
  useEffect(() => {
    const svg = select(svgRef.current);
    svg.selectAll("*").remove();
    const xValue = (d) => d.month,
      xAxisLabelText = "month",
      xAxisLabelOffset = 40,
      yValue = (d) => d.sales,
      yAxisLabelText = "Sales",
      yAxisLabelOffset = 20,
      marginTop = 50,
      marginBottom = 50,
      marginLeft = 80,
      marginRight = 50,
      innerRectFill = "#FFFFFF",
      padding = 12 / 100;

    const xScale = scaleBand(data.map(xValue), [
      marginLeft,
      width - marginRight,
    ]).padding(padding);
    const yScale = scaleLinear(
      [0, Math.max(...data.map(yValue))],
      [height - marginBottom, marginTop]
    );

    const innerWidth = width - marginLeft - marginRight;
    const innerHeight = height - marginTop - marginBottom;

    svg
      .selectAll("rect.inner-rectangle")
      .data([null])
      .join("rect")
      .attr("class", "inner-rectangle")
      .attr("x", marginLeft)
      .attr("y", marginTop)
      .attr("width", innerWidth)
      .attr("height", innerHeight)
      .attr("fill", innerRectFill);

    const countries = new Set(data.map((d) => d.country));
    const x = scaleBand()
      .domain(countries)
      .rangeRound([0, xScale.bandwidth()])
      .padding(0.05);

    const color = scaleOrdinal(schemeCategory10);

    // Bars
    svg
      .append("g")
      .selectAll("g")
      .data(flatGroup(data, (d) => d.month))
      .join("g")
      .attr("transform", function ([month]) {
        return `translate(${xScale(month)},0)`;
      })
      .selectAll("rect")
      .data((d) => d[1])
      .join("rect")
      .attr("x", (d) => x(d.country))
      .attr("y", (d) => yScale(d.sales))
      .attr("width", x.bandwidth())
      .attr("height", (d) => yScale(0) - yScale(yValue(d)))
      .attr("fill", (d) => color(d.country));

    Axes(svg, {
      width,
      height,
      xScale,
      xAxisLabelText,
      xAxisLabelOffset,
      yScale,
      yAxisLabelText,
      yAxisLabelOffset,
      marginLeft,
      marginBottom,
    });
  }, [data]);
  return (
    <div>
      {showChart ? (
        <svg ref={svgRef} width={width} height={height}></svg>
      ) : (
        <div>Bar chart data Loading..</div>
      )}
    </div>
  );
}

export default BarChart;
