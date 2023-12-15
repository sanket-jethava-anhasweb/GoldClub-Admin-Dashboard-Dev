import React from "react";
import { Breadcrumb, Divider, Space, Table, Tag } from "antd";
import { Link } from "react-router-dom";
import SectionTitle from "../../../components/Title/SectionTitle";
const TenantCustomers = () => {
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Tags",
      key: "tags",
      dataIndex: "tags",
      render: (_, { tags }) => (
        <>
          {tags.map((tag) => {
            let color = tag.length > 5 ? "geekblue" : "green";
            if (tag === "loser") {
              color = "volcano";
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a>Invite {record.name}</a>
          <a>Delete</a>
        </Space>
      ),
    },
  ];
  const data = [
    {
      key: "1",
      name: "John Brown",
      age: 32,
      address: "New York No. 1 Lake Park",
      tags: ["nice", "developer"],
    },
    {
      key: "2",
      name: "Jim Green",
      age: 42,
      address: "London No. 1 Lake Park",
      tags: ["loser"],
    },
    {
      key: "3",
      name: "Joe Black",
      age: 32,
      address: "Sydney No. 1 Lake Park",
      tags: ["cool", "teacher"],
    },
  ];
  return (
    <section className="py-4">
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
                Tenant Customers
              </Link>
            ),
          },
        ]}
      />
      <SectionTitle title="Store Details" />
      <Divider className="dark:bg-white/10" />
      <div className="storeDetailsDiv my-3">
        <h3 className="text-lg font-bold text-slate-700 dark:text-slate-400">
          Retailer Name
        </h3>
        <span className="text-2xl font-semibold text-slate-700 dark:text-slate-50 uppercase">
          ELEGANT JEWELLERS
        </span>
      </div>
      <h3 className="text-lg font-bold text-slate-700 dark:text-slate-400 my-3">
        Customer Details
      </h3>
      <Table columns={columns} dataSource={data} />
    </section>
  );
};

export default TenantCustomers;
