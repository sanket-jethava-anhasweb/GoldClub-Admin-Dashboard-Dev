import { useLazyQuery, useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { GET_DRAFT_ORDERS, GET_ORDER_LIST } from "../../../../GraphQl/Query";
import { Button, Divider, message, Space, Table, Tag } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import SectionTitle from "../../../../components/Title/SectionTitle";
import DisplayPrice from "../../../../components/Utils/DisplayPrice";
import SearchComponent from "../../../../components/Inputs/Search";
import Spinner from "../../../../components/Spinner/Spinner";
import Loader from "../../../../components/Spinner/Loader";
import { CREATE_EMPTY_ORDER } from "../../../../GraphQl/Mutations";
import { useNavigate } from "react-router-dom";

const Draftorders = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [localData, setLocalData] = useState([]);
  const navigate = useNavigate();
  const setTrial = (message) => {
    messageApi.open({
      type: "loading",
      content: message,
    });
  };
  const setSuccess = (message) => {
    messageApi.open({
      type: "success",
      content: message,
    });
  };
  const setError = (message) => {
    messageApi.open({
      type: "error",
      content: message,
    });
  };
  const [fetchDraft, orders] = useLazyQuery(GET_DRAFT_ORDERS, {
    fetchPolicy: "cache-and-network",
    variables: {
      first: 100,
      filter: { created: null },
      sort: { direction: "DESC", field: "NUMBER" },
    },
    onCompleted: (data) => {
      setLocalData(data?.orders?.edges);
      console.log(data);
    },
    onError: (err) => {
      setError(err?.message);
    },
  });

  const [createDraftOrder, draftOrder] = useMutation(CREATE_EMPTY_ORDER, {
    variables: { input: {} },
    onCompleted: (data) => {
      sessionStorage.setItem("draft-id", data.draftOrderCreate.order.id);
      navigate("/dashboard/b2b/new-order");
    },
    onError: (err) => {
      console.log(err);
    },
  });
  useEffect(() => {
    fetchDraft();
  }, []);

  const handleSearch = (e) => {
    let val = e.target.value?.toLowerCase()?.trim();
    console.log("searching");
    if (val !== "" || val !== undefined || val !== null) {
      setLocalData(
        orders?.data?.orders?.edges?.filter((record) =>
          Array.from([
            record?.node?.billingAddress?.firstName,
            record?.node?.billingAddress?.lastName,
            record?.node?.billingAddress?.companyName,
            record?.node?.billingAddress?.city,
            record?.node?.billingAddress?.cityArea,
            record?.node?.billingAddress?.postalCode,
            record?.node?.billingAddress?.phone,
            record?.node?.billingAddress?.countryArea,
            record?.node?.billingAddress?.country?.country,
            record?.node?.status,
            record?.node?.paymentStatus,
            record?.node?.number,
          ])
            ?.join(", ")
            ?.toLowerCase()
            ?.includes(val)
        )
      );
    } else setLocalData(orders?.data?.orders?.edges);
  };
  const columns = [
    {
      title: "#",
      dataIndex: ["node", "number"],
      key: "Number",
      width: 60,
      sorter: (a, b) => a?.node?.number - b?.node?.number,
      render: (text, record) => (
        // <>{record?.node?.created}</>;

        <h3 className='font-semibold text-md'>{text || "N/A"}</h3>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "Name",

      render: (text, record) => (
        // <>{record?.node?.created}</>;
        <div className='flex flex-col items-start'>
          <h3 className='font-semibold text-md'>
            {(record?.node?.billingAddress?.firstName || "N/A") +
              " " +
              (record?.node?.billingAddress?.lastName || "")}
          </h3>
          <span className='text-sm text-gray-500'>
            {record?.node?.billingAddress?.companyName || " "}
          </span>
        </div>
      ),
    },
    {
      title: "Phone",
      dataIndex: ["node", "phoneNumber"],
      key: "phone Number",

      render: (text, record) => (
        // <>{record?.node?.created}</>;

        <h3 className='font-semibold text-md'>{text || "N/A"}</h3>
      ),
    },
    Table.EXPAND_COLUMN,
    {
      title: "Address",
      dataIndex: "Address",
      key: "Address",

      render: (text, record) => (
        // <>{record?.node?.created}</>;

        <h3 className='font-semibold text-md'>
          {record?.node?.billingAddress?.city
            ? record?.node?.billingAddress?.city +
              ", " +
              record?.node?.billingAddress?.country?.country
            : "N/A"}
        </h3>
      ),
    },
    {
      title: "Payment",
      dataIndex: ["node", "paymentStatus"],
      key: "Payment",
      filters: [
        { value: "NOT_CHARGED", text: "NOT CHARGED" },
        { value: "FULLY_CHARGED", text: "FULLY CHARGED" },
      ],
      onFilter: (value, record) => record?.node?.paymentStatus?.includes(value),
      render: (text, record) => (
        // <>{record?.node?.created}</>;

        <Tag
          className='font-semibold text-md'
          color={text?.includes("NOT") ? "error" : "green-inverse"}
        >
          {text?.replace("_", " ") || "N/A"}
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: ["node", "status"],
      key: "Status",
      filters: [
        { value: "UNFULFILLED", text: "UNFULFILLED" },
        { value: "FULFILLED", text: "FULFILLED" },
        { value: "CANCELED", text: "CANCELED" },
      ],
      filterMode: "map",
      filterSearch: true,
      onFilter: (value, record) => record?.node?.status?.includes(value),
      render: (text, record) => (
        // <>{record?.node?.created}</>;

        <Tag
          className='font-semibold text-md'
          color={
            text == "UNFULFILLED"
              ? "yellow"
              : text == "CANCELED"
              ? "error"
              : "geekblue-inverse"
          }
        >
          {text?.replace("_", " ") || "N/A"}
        </Tag>
      ),
    },
    {
      title: "Created At",
      dataIndex: ["node", "created"],
      key: "Created At",
      sorter: (a, b) => new Date(a?.node?.created) - new Date(b?.node?.created),
      render: (text, record) => (
        <div className='flex flex-col items-start'>
          <h3 className='font-semibold text-md'>
            {text?.split("T")[0] || "N/A"}
          </h3>
          <span className='text-sm text-gray-500'>
            {text?.split("T")[1]?.split(".")[0]}
          </span>
        </div>
      ),
    },
    {
      title: "Total",
      dataIndex: ["node", "total", "gross", "amount"],
      key: "Total",
      fixed: window?.screen?.width > 640 && "right",

      render: (text, record) => (
        <h3 className='font-semibold text-md'>
          <DisplayPrice price={text} />{" "}
        </h3>
      ),
    },
    {
      title: "Edit",
      render: (text, record) => (
        <button
          class='inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-xs'
          onClick={() => {
            sessionStorage.setItem("draft-id", record.node.id);
            sessionStorage.setItem("draft-order", record.node);
            navigate("/dashboard/b2b/new-order");
          }}
        >
          Edit
        </button>
      ),
    },
  ];
  return (
    <section className='py-4'>
      <SectionTitle title='Order History' />
      <Divider className='dark:bg-white/10' />
      <button
        class='inline-flex items-center text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-md my-4'
        onClick={createDraftOrder}
      >
        {draftOrder?.loading && <Loader />} Create order
      </button>
      {/* {orders?.loading && <Spinner />} */}
      <div className='flex flex-col md:flex-row flex-wrap w-full items-start md:items-center justify-start md:justify-around mb-3 '>
        <div className='w-full md:w-10/12'>
          <SearchComponent handleSearch={handleSearch} />
        </div>
        <div className='w-full md:w-2/12 mb-4'>
          <Button
            type='Primary'
            className='inline-flex h-10 text-white bg-blue-500 border-0 py-4 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg items-center justify-center '
            onClick={() => fetchDraft()}
          >
            <ReloadOutlined />
          </Button>
        </div>
      </div>
      <Table
        dataSource={localData || orders?.data?.draftOrders?.edges}
        columns={columns}
        rowKey={(record) => record?.node?.id}
        exportable
        searchable
        scroll={{
          x: "auto",
        }}
        sticky
        loading={orders?.loading}
        expandable={{
          expandedRowRender: (record) => (
            <p>
              <span className='font-bold'>Full Address: </span>
              {record?.node?.billingAddress &&
                Array.from([
                  record?.node?.billingAddress?.streetAddress1,
                  record?.node?.billingAddress?.streetAddress2,
                  record?.node?.billingAddress?.city,
                  record?.node?.billingAddress?.cityArea,
                  record?.node?.billingAddress?.countryArea,
                  record?.node?.billingAddress?.postalCode,
                  record?.node?.billingAddress?.country?.country,
                ]).join(" ")}
            </p>
          ),
          rowExpandable: (record) => record?.node?.billingAddress !== null,
        }}
      />
    </section>
  );
};

export default Draftorders;
