import React, { useEffect, useState } from "react";
import { Card, Divider, List, Switch, Tooltip } from "antd";

import { HiCurrencyRupee } from "react-icons/hi";
import { MdOutlineAddLocationAlt } from "react-icons/md";
import { LineChartOutlined } from "@ant-design/icons";
import { BsFileArrowUpFill } from "react-icons/bs";

import SectionTitle from "../../../components/Title/SectionTitle";
import SearchComponent from "../../../components/Inputs/Search";
import CurrencyPrefix from "../../../components/Utils/CurrencyPrefix";
import { Link } from "react-router-dom";
const Tenants = () => {
  const [data, setData] = useState([
    {
      id: 1,
      Store: "Elegance Jewellers",
      Sales: "3.6 L",
      Growth: "2.4%",
      Address: "23A, Ballygunge Road, Kolkata 700019",
      active: true,
    },
    {
      id: 2,
      Store: "Raghav Jewellers",
      Sales: "5.6 L",
      Growth: "1.2%",
      Address: "8/1, Park Street Road, Kolkata 700016",
      active: false,
    },
    {
      id: 3,
      Store: "Verma Jewellers",
      Sales: "3.6 L",
      Growth: "2.4%",
      Address: "125, Rashbehari Avenue, Kolkata 700029",
      active: true,
    },
    {
      id: 4,
      Store: "Sri Sai Jewellers",
      Sales: "2 L",
      Growth: "1%",
      Address: "72, Gariahat Road, Kolkata 700029",
      active: true,
    },
    {
      id: 5,
      Store: "Naveen Chandra Jewellers",
      Sales: "5 L",
      Growth: "1.7%",
      Address: "33, Salt Lake City, Kolkata 700091",
      active: true,
    },
    {
      id: 6,
      Store: "Nemichand Bamalwa Jewellers",
      Sales: "3.6 L",
      Growth: "2.4%",
      Address: "19/1, Bidhan Sarani, Kolkata 700006",
      active: false,
    },
  ]);
  const [tempData, settempData] = useState(structuredClone(data));
  const handleSearch = (e) => {
    let val = e.target.value.toLowerCase();
    if (val !== "")
      settempData(
        data?.filter(
          (item) =>
            item?.Store?.toLowerCase().includes(val) ||
            item?.Sales?.toLowerCase().includes(val) ||
            item?.Growth?.toLowerCase().includes(val) ||
            item?.Address?.toLowerCase().includes(val)
        )
      );
    else settempData(data);
  };

  const handleActive = (id) => {
    let tempData = structuredClone(data);
    tempData[id - 1].active = !tempData[id - 1]?.active;
    settempData(tempData);
  };

  return (
    <section className="py-4 w-full">
      <SectionTitle title="Registered Tenants" />
      <Divider className="dark:bg-white/10" />
      <SearchComponent handleSearch={handleSearch} />
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 3,
          lg: 4,
          xl: 5,
        }}
        dataSource={tempData}
        renderItem={(item) => (
          <List.Item>
            <Card
              title={item.Store}
              type="inner"
              size="default"
              className={
                "dark:bg-slate-100 py-0 shadow-sm cursor-pointer hover:shadow-md hover:-translate-y-1 duration-200 dark:shadow-slate-300 dark:shadow-sm " +
                (item?.active
                  ? "opacity-100 dark:bg-slate-50"
                  : "opacity-60 dark:bg-slate-100")
              }
              actions={[
                <Tooltip title="Activate/Deactivate Tenant">
                  <div className="flex items-center justify-start gap-2 px-3">
                    <h3 className="font-bold flex items-center text-md">
                      <span className="uppercase">Active:</span>
                    </h3>
                    <Switch
                      defaultChecked={item?.active}
                      onChange={() => handleActive(item?.id)}
                      className="bg-gray-500"
                    />
                  </div>
                </Tooltip>,
                <Tooltip title="See Store Analytics">
                  <Link to="tenant-analytics">
                    <LineChartOutlined size={32} />
                  </Link>
                </Tooltip>,
              ]}
            >
              <Link
                to={"/dashboard/b2c/tenant-details/" + item?.id}
                className="hover:text-black "
              >
                <div className="flex flex-col mb-2">
                  <h3 className="font-bold flex items-center text-md">
                    {/* <MdOutlineAddLocationAlt /> */}
                    <span className="uppercase">Address:</span>
                  </h3>
                  <span className="font-semibold text-gray-600">
                    {item?.Address}
                  </span>
                </div>
                <div className="flex items-center justify-between w-full">
                  <div className="flex flex-col my-2">
                    <h3 className="font-bold flex items-center text-md">
                      {/* <MdOutlineAddLocationAlt /> */}
                      <span className="uppercase">Sales:</span>
                    </h3>
                    <span className="font-semibold text-gray-600">
                      <CurrencyPrefix /> {item?.Sales}
                    </span>
                  </div>
                  <div className="flex flex-col my-2">
                    <h3 className="font-bold flex items-center text-md">
                      <span className="uppercase">Growth:</span>
                    </h3>
                    <span className="font-semibold text-gray-600 flex items-center gap-x-1">
                      <BsFileArrowUpFill color="green" /> {item?.Growth}
                    </span>
                  </div>
                </div>
              </Link>
            </Card>
          </List.Item>
        )}
      />
    </section>
  );
};

export default Tenants;
