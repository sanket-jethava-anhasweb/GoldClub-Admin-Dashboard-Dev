import React from "react";
import { Breadcrumb, Divider } from "antd";
import { Link, useParams } from "react-router-dom";
import SectionTitle from "../../../components/Title/SectionTitle";

const Details = (props) => {
  return (
    <div className="storeDetailsDiv my-3">
      <h3 className="text-lg font-bold text-slate-700 dark:text-slate-400">
        {props?.title}
      </h3>
      <span className="text-md font-semibold text-slate-700 dark:text-slate-50">
        {props?.description}
      </span>
      {props?.children}
    </div>
  );
};
const TenantDetails = (props) => {
  const params = useParams();

  const data = {
    "GST No.": "19AAG3243",
    "Annual Turnover": "10CR+",
    "Owner's Name": "Vicky Suryavanshi",
    "Contact Number": "988xxxxxx ; +918678xxxxxx",
  };
  return (
    <section className="py-4 ">
      <Breadcrumb
        className="text-black dark:text-white"
        separator={<span className="text-black dark:text-slate-300">/</span>}
        items={[
          {
            title: "Dashboard",
          },
          {
            title: (
              <Link
                to="/dashboard/b2c"
                className="text-black dark:text-slate-300 dark:hover:text-white"
              >
                B2C
              </Link>
            ),
          },
          {
            title: (
              <Link
                to={window.location.pathname}
                className="text-black dark:text-slate-300 dark:hover:text-white"
              >
                Tenant Details
              </Link>
            ),
          },
        ]}
      />
      <SectionTitle title="Tenant Store Details" />
      <Divider className="dark:bg-white/10" />
      <section className="storeDetailWrapper max-w-11/12">
        {data &&
          Object.entries(data)?.map((detail) => (
            <Details title={detail[0]} description={detail[1]} />
          ))}
      </section>
      <Divider className="dark:bg-white/10" />
      <div className="flex flex-col">
        <Details title="More Actions" />
        <Link
          to={"/dashboard/b2c/tenant-analytics/" + params?.id}
          className="my-2 hover:underline"
        >
          View Store Analytics &gt;&gt;
        </Link>
        <Link
          to={"/dashboard/b2c/tenant-customers/" + params?.id}
          className="my-2 hover:underline"
        >
          View Store Customers &gt;&gt;
        </Link>
        <Link
          to={"/dashboard/b2c/tenant-designs/" + params?.id}
          className="my-2 hover:underline"
        >
          View Store Designs &gt;&gt;
        </Link>
      </div>
    </section>
  );
};

export default TenantDetails;
