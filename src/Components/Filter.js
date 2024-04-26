import React, { useEffect, useState } from "react";
import { useSession } from "../Context/QlikContext";
import {
  useGetLayout,
  useSelectListObjectValues,
} from "../Hooks/qlik-hooks/GenericObject";
import { useCreateSessionObject } from "../Hooks/qlik-hooks/Doc";

function Filter({ expression, label }) {
  const placeHolder = "Filter By";
  const defaultSelect = null;
  const noObjectLoader = false;

  const app = useSession();
  const [data, setData] = useState([]);
  const [openDropDown, setOpenDropDown] = useState(false);
  const [selected, setSelected] = useState(null);
  const [title, setTitle] = useState(null);

  const listObject = useCreateSessionObject(app, {
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
  });

  const listObjectLayout = useGetLayout(listObject, {
    params: [],
    invalidations: true,
  });
  const listSelect = useSelectListObjectValues(listObject);

  useEffect(() => {
    if (listObjectLayout?.qResponse?.qListObject?.qDataPages?.[0]?.qMatrix) {
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
    console.log({ data });
    let checkSelected = data.find((item, idx) => item.qState === "S");
    if (checkSelected) {
      setSelected(data.find((item, idx) => item.qState === "S"));
      //   if (!noObjectLoader) objLoader.setLoadObjects(true);
    }
  }, [data]);

  return (
    <div className="relative">
      <button
        className="border bg-white font-small text-sm px-2.5 py-2.5 inline-flex items-center w-64 justify-between"
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
                        listSelect.call(
                          "/qListObjectDef",
                          [list.qElement],
                          false
                        );
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

export default Filter;
