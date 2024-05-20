import React, { useEffect, useRef, useState } from "react";
import { useGetObject } from "../Hooks/qlik-hooks/Doc";
import {
  useGetLayout,
  useGetHyperCubeData,
} from "../Hooks/qlik-hooks/GenericObject";
import { useSession } from "../Context/QlikContext";
import {
  axisBottom,
  axisLeft,
  flatGroup,
  interpolateGreens,
  scaleOrdinal,
  scaleSequential,
  schemeCategory10,
  schemeGreens,
  schemeGreys,
  select,
} from "d3";
import { scaleLinear, scaleBand } from "d3";
import { Axes } from "./ChartComponent/Axes";

function BarChart({
  title,
  objectId,
  appIndex,
  xAxisLabelText,
  yAxisLabelText,
}) {
  const apps = useSession();
  const obj = useGetObject(apps[appIndex], { params: [objectId] });
  const objLayout = useGetLayout(obj, { params: [], invalidations: true });
  const hyperCubeData = useGetHyperCubeData(obj);

  const [data, setData] = useState([]);
  const [showChart, setShowChart] = useState(false);
  const [totalRows, setTotalRows] = useState(-1);
  const rowsPerPage = 3000;

  const width = 550,
    height = 350;
  const legendWidth = 100,
    legendHeight = 200;
  useEffect(() => {
    if (objLayout.qResponse != null) {
      const temptotalRows = objLayout.qResponse.qHyperCube.qSize.qcy;
      setTotalRows(temptotalRows);
      setData([]);
      // console.log("herree");
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
      let tableData =
        hyperCubeData?.qResponse[0].qMatrix?.map((item, index) => {
          let obj = {};
          obj.month = hyperCubeData?.qResponse[0].qMatrix[index][0].qText;
          obj.sales = hyperCubeData?.qResponse[1].qMatrix[index][0].qText;
          obj.country = hyperCubeData?.qResponse[2].qMatrix[index][0].qText;
          return obj;
        }) || [];

      // console.log({ tableData });
      // Sort the data by month
      const sortedData = tableData.sort((a, b) => {
        return new Date(a.month) - new Date(b.month);
      });

      setData((data) => [...data, ...sortedData]);
      setShowChart(true);
    }
  }, [hyperCubeData]);

  const svgRef = useRef();
  const legendSvgRef = useRef();
  useEffect(() => {
    // console.log(title + " data:", data);
    const svg = select(svgRef.current);
    svg.selectAll("*").remove();
    const xValue = (d) => d.month,
      xAxisLabelOffset = 40,
      yValue = (d) => d.sales,
      yAxisLabelOffset = 20,
      marginTop = 20,
      marginBottom = 50,
      marginLeft = 80,
      marginRight = 40,
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

    // set vertical grid line

    // const color = scaleOrdinal(schemeCategory10);
    // const color = scaleOrdinal()
    //   .domain(countries)
    //   .range(schemeGreens[9].reverse());

    // schemeGreys[9].reverse();
    // const customColors = ["#BED754", "#6EC26D", "#1CA681", "#008786"]; // Your custom colors array
    const color = scaleOrdinal(schemeGreys[9].slice(2));
    // const color = scaleOrdinal().domain(countries).range(customColors);

    // Bars
    svg
      .append("g")
      .selectAll("g")
      .data(flatGroup(data, (d) => d.month))
      .join("g")
      .attr("transform", function ([month]) {
        return `translate(${xScale(month)},0)`;
      })
      .selectAll("rect bar")
      .data((d) => d[1])
      .join("rect")
      .attr("class", "bar")
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

    //legend
    const legendSvg = select(legendSvgRef.current);
    legendSvg.selectAll("*").remove();

    //box
    legendSvg
      .selectAll("rect.legend-box")
      .data([null])
      .join("rect")
      .attr("width", legendWidth)
      .attr("height", legendHeight)
      .attr("class", "legend-box")
      .attr("fill", "#FFF");

    ///legends
    const legendCountrySvg = legendSvg
      .append("g")
      .selectAll("g")
      .data(countries);

    legendCountrySvg
      .join("rect")
      .attr("x", 0)
      .attr("y", (d, i) => i * 20)
      .attr("width", 10)
      .attr("height", 10)
      .attr("fill", (d) => color(d));

    legendCountrySvg
      .join("text")
      .text((d) => d)
      .attr("x", 20)
      .attr("y", (d, i) => 8 + i * 20)
      .attr("stroke", "#1E1E1E")
      .attr("font-weight", 20)
      .attr("font-size", 10);
  }, [data]);

  return (
    <div>
      {showChart ? (
        <div class="font-sans border rounded-md mb-3">
          <div class="text-xl font-light ml-3 mr-10 mt-3">{title}</div>
          <div class="p-4 flex flex-row justify-between">
            <svg
              class="font-sans text-base font-light"
              ref={svgRef}
              width={width}
              height={height}
            ></svg>
            <svg
              class="font-sans text-base font-light"
              ref={legendSvgRef}
              width={legendWidth}
              height={legendHeight}
            ></svg>
          </div>
        </div>
      ) : (
        <div>Bar chart data Loading..</div>
      )}
    </div>
  );
}

export default BarChart;
