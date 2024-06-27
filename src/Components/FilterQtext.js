import React, { useEffect, useState } from "react";
import { useSession } from "../Context/QlikContext";
import {
  useGetLayout,
  useSelectListObjectValues,
} from "../Hooks/qlik-hooks/GenericObject";
import { useCreateSessionObject, useGetField } from "../Hooks/qlik-hooks/Doc";
import { useSelect, useSelectValues } from "../Hooks/qlik-hooks/Field";

function FilterQtext({ expression, label }) {
  const placeHolder = "Filter By";
  const defaultSelect = null;
  const noObjectLoader = false;

  const apps = useSession();
  const [data, setData] = useState([]);
  const [openDropDown, setOpenDropDown] = useState(false);
  const [selected, setSelected] = useState(null);
  const [title, setTitle] = useState(null);

  const listObjects = [
    useCreateSessionObject(apps[0], {
      params: [
        {
          qInfo: { qType: "listbox" },
          qListObjectDef: {
            qDef: { qFieldDefs: [expression] },
            qInitialDataFetch: [{ qWidth: 1, qHeight: 1000 }],
          },
          qSelectionObjectDef: {},
        },
      ],
    }),
    useCreateSessionObject(apps[1], {
      params: [
        {
          qInfo: { qType: "listbox" },
          qListObjectDef: {
            qDef: { qFieldDefs: [expression] },
            qInitialDataFetch: [{ qWidth: 1, qHeight: 1000 }],
          },
          qSelectionObjectDef: {},
        },
      ],
    }),
  ];

  const listObjectLayout = useGetLayout(listObjects[0], {
    params: [],
    invalidations: true,
  });
  // const listSelect0 = useSelectListObjectValues(listObjects[0]);
  // const listSelect1 = useSelectListObjectValues(listObjects[1]);
  const field0 = useGetField(apps[0], { params: [expression] });
  // console.log({ field0 });
  const selectSingle0 = useSelectValues(field0);
  const field1 = useGetField(apps[1], { params: [expression] });
  const selectSingle1 = useSelectValues(field1);
  // selectSingle0.call(["China"]);
  useEffect(() => {
    if (listObjectLayout?.qResponse?.qListObject?.qDataPages?.[0]?.qMatrix) {
      console.log(
        "filterData:",
        listObjectLayout?.qResponse?.qListObject?.qDataPages?.[0]?.qMatrix
      );
      let siteOptions =
        listObjectLayout?.qResponse?.qListObject?.qDataPages?.[0]?.qMatrix?.map(
          (item) => ({
            qText: item[0].qText,
            qElement: item[0].qElemNumber,
            qState: item[0].qState,
          })
        ) || [];

      setData(siteOptions);
    }
  }, [listObjectLayout]);

  useEffect(() => {
    // console.log({ data });
    let checkSelected = data.find((item, idx) => item.qState === "S");
    if (checkSelected) {
      setSelected(data.find((item, idx) => item.qState === "S"));
      //   if (!noObjectLoader) objLoader.setLoadObjects(true);
    }
  }, [data]);

  return (
    <div className="relative">
      <button
        className="font-sans border rounded-md text-sm px-2.5 py-2.5 inline-flex items-center w-64 justify-between"
        type="button"
        onClick={() => setOpenDropDown(!openDropDown)}
      >
        {placeHolder ? `${placeHolder} :  ` : ""}{" "}
        {(selected && selected.qText) || label}
        {/* <span className="px-2">
      <ChevronDownIcon size="small" />
    </span> */}
      </button>
      {(openDropDown && (
        <div className="absolute z-10 h-[250px] overflow-auto bg-white divide-y divide-gray-100 rounded-sm mt-1 shadow w-64 dark:bg-gray-700">
          {data.length ? (
            <ul
              className="py-2 text-sm text-gray-700 dark:text-gray-200"
              aria-labelledby="dropdownDefaultButton"
            >
              {data.map((list, l) => {
                return (
                  <li key={l}>
                    <div
                      className="flex justify-between px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      onClick={() => {
                        if (list.qState === "S") {
                          selectSingle0.call(
                            // "/qListObjectDef",
                            [{ qText: list.qText }],
                            true
                          );
                          selectSingle1.call(
                            // "/qListObjectDef",
                            [{ qText: list.qText }],
                            true
                          );
                          setSelected(false);
                        } else {
                          selectSingle0.call([{ qText: list.qText }], false);
                          selectSingle1.call(
                            // "/qListObjectDef",
                            [{ qText: list.qText }],
                            false
                          );
                        }
                        setOpenDropDown(!openDropDown);
                        // if (!noObjectLoader) objLoader.setLoadObjects(false);
                      }}
                    >
                      {list.qText}
                      <span>
                        {list.qState === "S" ? (
                          //   <CheckIcon size="small" />
                          <div>XXX</div>
                        ) : (
                          <></>
                        )}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="flex justify-center items-center h-[250px]">
              {/* <Spinner /> */}
            </div>
          )}
        </div>
      )) || <></>}
    </div>
  );
}

export default FilterQtext;
