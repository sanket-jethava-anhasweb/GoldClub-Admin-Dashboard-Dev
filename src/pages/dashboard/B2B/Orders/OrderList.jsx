import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLazyQuery, useMutation } from "@apollo/client";


import {
   GET_ORDER_LIST, 
   GET_PAYMENT_PROOF,
   SEARCH_ORDER_DETAIL
} from "../../../../GraphQl/Query";
import {
  FULFILL_ORDER,
  CANCEL_FULFILLED_ORDER,
  CANCE_REGULAR_ORDER,
  CANCEL_EMPTY_ORDER,
  MARK_ORDER_PAID,
} from "../../../../GraphQl/Mutations";

import {
  Button,
  Divider,
  Input,
  Dropdown,
  Message,
  Table,
  Tag,
  Badge,
  Space,
  message,
  ConfigProvider,
  theme,
} from "antd";
import {
  ReloadOutlined,
  MoreOutlined,
  UploadOutlined
} from "@ant-design/icons";
import {
  AiOutlinedArrowLeft,
  AiOutlinedArrowRight
} from "react-icons";

import SectionTitle from "../../../../components/Title/SectionTitle";
import Search from "../../../../components/Inputs/Search";
import DisplayPrice from "../../../../components/Utils/DisplayPrice";
import Loader from "../../../../components/Spinner/Loader";

const OrderList = () => {
  const { defaultAlgorithm, darkAlgorithm } = theme;
  const [isDarkMode, setIsDarkMode] = useState(true);

  const [messageApi, contextHolder] = message.useMessage();
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

  const [currentOrderList, setCurrentOrderList] = useState([]);
  const [fetchOrders, orders] = useLazyQuery(GET_ORDER_LIST, {
    fetchPolicy: "cache-and-network",
    variables: {
      first: 20,
      filter: { created: null },
      sort: { direction: "DESC", field: "NUMBER" },
    },
    onCompleted: (data) => {
      setCurrentOrderList(data?.orders?.edges);
      console.log(data);
    },
    onError: (err) => {
      setError(err?.message);
    },
  });
  const [fetchSingleOrders, singleOrder] = useLazyQuery(SEARCH_ORDER_DETAIL, {
    fetchPolicy: "cache-and-network",

    onCompleted: (data) => {
      setCurrentOrderList(data?.orders?.edges);
      console.log(data);
    },
    onError: (err) => {
      setError(err?.message);
    },
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const [markAsPaid, marked] = useMutation(MARK_ORDER_PAID, {
    onCompleted: (data) => {
      console.log(data);
      if (data.orderMarkAsPaid.errors?.length > 0) {
        setError(JSON.stringify(data.orderMarkAsPaid.errors[0]));
      } else setSuccess("Marked as paid");
    },
    onError: (err) => {
      setError(err.message);
    },
  });
  const [fullfillOrder, fullfilledOrder] = useMutation(FULFILL_ORDER, {
    onCompleted: (data) => {
      if (data?.orderFulfill?.errors?.length > 0) {
        setError(JSON.stringify(data.orderFulfill?.errors[0]));
      } else {
        fetchSingleOrders({
          variables: {
            id: "T3JkZXI6MjI=",
          },
        });
        setSuccess("Processed successfully");
      }
    },
    onError: (err) => {
      setError(err.message);
    },
  });
  const [cancelFulfilledorder, cancelledFulfilledorder] = useMutation(
    CANCEL_FULFILLED_ORDER,
    {
      onCompleted: (data) => {
        console.log(data);
        if (data?.orderFulfillmentCancel?.errors?.length > 0) {
          setError(
            data.orderFulfillmentCancel?.errors[0]?.code +
              " " +
              data.orderFulfillmentCancel?.errors[0]?.field
          );
        } else setSuccess("Cancelled order");
      },
      onError: (err) => {
        setError(err.message);
      },
    }
  );
  const [cancelRegularorder, cancelledRegularorder] = useMutation(
    CANCE_REGULAR_ORDER,
    {
      onCompleted: (data) => {
        console.log(data);
        if (data?.orderCancel?.errors?.length > 0) {
          setError(
            data.orderCancel?.errors[0]?.code +
              " " +
              data.orderCancel?.errors[0]?.field
          );
        } else setSuccess("Cancelled order");
      },
      onError: (err) => {
        setError(err.message);
      },
    }
  );

  const columns = [
    Table.EXPAND_COLUMN,
    {
      title: "Sl. No",
      dataIndex: ["node", "number"],
      key: "Number",
     width: 10,
      sorter: (a, b) => a?.node?.number - b?.node?.number,
      render: (text, record) => (
        <h3>{text || "N/A"}</h3>
      )
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "Name",
      width: 200,
      // sorter: (a, b) => a?.node?.number - b?.node?.number,
      render: (text, record) => (
        <div className='flex flex-col items-start '>
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
      width: 20,
      render: (text, record) => (
        <h3 className='font-semibold text-md'>{text || "N/A"}</h3>
      ),
    },
    {
      title: "Address",
      dataIndex: "Address",
      key: "Address",
     width: 150,
      render: (text, record) => (
        <h3 className='font-semibold text-md'>
          {record?.node?.billingAddress?.city
            ? record?.node?.billingAddress?.city : "N/A"}
        </h3>
      ),
    },
    {
      title: "Order Status",
      dataIndex: ["node", "status"],
      key: "Order Status",
      width: 200,
      filters: [
        { value: "UNFULFILLED", text: "UNFULFILLED" },
        { value: "FULFILLED", text: "FULFILLED" },
        { value: "CANCELED", text: "CANCELED" },
      ],
      filterMode: "map",
      filterSearch: true,
      onFilter: (value, record) => record?.node?.status?.includes(value),
      render: (text, record) => (
        <Badge className='font-semibold text-md'
        color={  
          text === "UNFULFILLED"
          ? "yellow"
          : text === "CANCELED"
          ? "red"
          : "green"
        } text={text?.replace("_", " ") || "N/A"} />
      ),
    },
    {
      title: "Payment",
      dataIndex: ["node", "paymentStatus"],
      key: "Payment",
    //  width: 40,
      filters: [
        { value: "NOT_CHARGED", text: "NOT CHARGED" },
        { value: "FULLY_CHARGED", text: "FULLY CHARGED" },
      ],
      onFilter: (value, record) => record?.node?.paymentStatus?.includes(value),
      render: (text, record) => (
        <Tag
          className='font-semibold text-md'
          color={text?.includes("NOT") ? "error" : "green-inverse"}
        >
          {text?.replace("_", " ") || "N/A"}
        </Tag>
      )
    },
    {
      title: "Created At",
      dataIndex: ["node", "created"],
      key: "Created At",
      width: 150,
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
      width: 250,
      render: (text, record) => (
        <h3 className='font-bold text-sky-500 text-xl'>
          <DisplayPrice price={Math.ceil(text)} />{" "}
        </h3>
      ),
    },
    {
      title: "Payment Proof",
      width: 150,
      render: (text, record) => {
        return record?.isUploadedPaymentProof ? (
          <Button
            type='Primary'
            className='inline-flex h-10 text-white bg-blue-500 border-0 py-4 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg items-center justify-center '
            onClick={() => fetchOrders()}
          >
            Show Payment
          </Button>
        ) : (
          <Button
            type='default'
            icon={<UploadOutlined />}
            className='inline-flex h-10 bg-transparent border py-4 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg items-center justify-center text-white'
            onClick={() => fetchOrders()}
          >
            Upload Payment
          </Button>
        );
      },
    },
    {
      title: "Actions",
      fixed: window?.screen?.width > 640 && "right",
      render: (text, record) => {
        const items = [
          {
            label: (
              <button
                className='inline-flex text-white w-full bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded  disabled:opacity-40 disabled:cursor-not-allowed'
                disabled={record?.node?.paymentStatus == "FULLY_CHARGED"}
                onClick={() => {
                  
                  if (record?.node?.paymentStatus != "FULLY_CHARGED") {
                    setTrial("Processing");
                    markAsPaid({
                      variables: {
                        id: record?.node?.id,
                      },
                    });
                  } else setTrial("Already paid");
                }}
              >
                {marked?.loading && <Loader />} Mark as paid
              </button>
            ),
            key: "0",
          },
          {
            label: (
              <button
                className='inline-flex text-white w-full bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded disabled:opacity-40 disabled:cursor-not-allowed'
                disabled={
                  record?.node?.status == "FULFILLED" ||
                  record?.node?.status == "CANCELED"
                }
                onClick={() => {
                  if (
                    record?.node?.status != "FULFILLED" ||
                    record?.node?.status != "CANCELED"
                  ) {
                    setTrial("Processing");

                    fullfillOrder({
                      variables: {
                        input: {
                          lines: record?.node?.lines?.map((line) => ({
                            orderLineId: line?.id,
                            stocks: [
                              {
                                quantity: line?.quantity,
                                warehouse:
                                  "V2FyZWhvdXNlOmE3ZGM0YzRhLTZhYjAtNDQ4ZS1iZDRiLTJiOTcyNTI3NTkxNw==",
                              },
                            ],
                          })),
                          notifyCustomer: true,
                        },
                        orderId: record?.node?.id,
                      },
                    });
                  } else setTrial("Already paid");
                }}
              >
                {fullfilledOrder?.loading && <Loader />}
                Mark as fulfilled
              </button>
            ),
            key: "1",
          },
          {
            type: "divider",
          },
          {
            label: (
              <button
                className='inline-flex text-white w-full bg-red-500 border-0 py-2 px-6 focus:outline-none hover:bg-red-600 rounded disabled:opacity-40 disabled:cursor-not-allowed'
                disabled={record?.node?.status == "CANCELED"}
                onClick={() => {
                  if (
                    record?.node?.status == "FULFILLED" ||
                    record?.node?.status == "CANCELED"
                  ) {
                    cancelFulfilledorder({
                      variables: {
                        id: record?.node?.fulfillments[0]?.id,
                        input: {
                          warehouseId:
                            "V2FyZWhvdXNlOmE3ZGM0YzRhLTZhYjAtNDQ4ZS1iZDRiLTJiOTcyNTI3NTkxNw==",
                        },
                      },
                    });
                  } else {
                    cancelRegularorder({
                      variables: {
                        id: record?.node?.id,
                      },
                    });
                  }
                }}
              >
                {cancelledFulfilledorder?.loading ||
                  (cancelledRegularorder?.loading && <Loader />)}
                Cancel Order
              </button>
            ),
            key: "3",
          },
        ];
        return (
          <Dropdown
            menu={{ items }}
            placement='bottom'
            arrow
            trigger={["click"]}
          >
            <Button className="flex flex-col justify-center hover:bg-blue-600">
              <MoreOutlined />
            </Button>
          </Dropdown>
        );
      },
    },
  ];
  const expandedRowRender = (record) => {
    console.log("Record:", record); // Log the entire record to inspect its structure
    const lines = record?.node?.lines || [];
    const data = lines.map((line, index) => ({
      id: line.variant.product.id,
      key: index,
      image: line.thumbnail?.url,
      productName: line.productName,
      availability: line?.variant?.product?.attributes[1]?.values[0]?.name,
      category: line?.variant?.category?.name,
      variantName: line?.variant?.product?.attributes[0]?.values[0]?.name + " " +line?.variant?.product?.attributes[5]?.values[0]?.name + "k",
      quantity: line?.quantity,
      quantityFulfilled: line.quantityFulfilled,
      weight: line?.variantName?.split("/")[7] + "gm",
      size: line?.variantName?.split("/")[0],
      total: line?.totalPrice?.gross?.amount
    }));
    const columns = [
      {
        title: "Product Link",
        dataIndex: "image",
        key: "image",
        width: 150,
        render: (text, record) => (
          <a href={window.location.origin + "/dashboard/b2b/products/" + record.id}>
          <img
            src={record.image}
            // alt={line?.thumbnail?.alt}
            className='h-[100px] w-auto shadow transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300'
          /></a>
        ),
      },
      {
        title: "Product Name",
        dataIndex: "productName",
        key: "productName",
        width: 200,
        render: (text, record) => (
          <h3 className='font-semibold text-md'>{text || "N/A"}</h3>
        ),
      },
      {
        title: "Metal",
        dataIndex: "variantName",
        key: "variantName",
        width: 100,
        render: (text, record) => (
          <Tag
          className='font-semibold text-md'
          color={text?.includes("Gold") ? "yellow" : text?.includes("Silver") ? "silver" : "gray"}
        >
          <h3 className='font-semibold text-md'>{text || "N/A"}</h3>
        </Tag>
          
        ),
      },
      {
        title: "Size",
        dataIndex: "size",
        key: "size",
        width: 80,
      },
      {
        title: "Weight",
        dataIndex: "weight",
        key: "weight",
        width: 80,
      },
      {
        title: "Availability",
        dataIndex: "availability",
        key: "availability",
        width: 120,
      },
      {
        title: "Total",
        dataIndex: "total",
        key: "total",
        width: 100,
        render: (text, record) => (
          <DisplayPrice price={Math.ceil(text)}/>
        )
      },
      {
        title: "Quantity",
        dataIndex: "quantity",
        key: "quantity",
        width: 30,
      },
      {
        title: "Fulfilled",
        dataIndex: "quantityFulfilled",
        key: "quantityFulfilled",
        width: 20,
        render: (text, record) => (
          <Badge
          className='font-semibold text-md'
          color={text > 0 ? "yellow" : text < 0 ? "silver" : "gray"}
        >
          <h3 className='font-semibold text-md'>{text}</h3>
        </Badge>
          
        ),
      },
    ];
  
    
  
    console.log("Data:", data); // Log the transformed data
  
    return <Table columns={columns}  dataSource={data} pagination={false} size="small"/>;
  };
  return (
    <>
      <section className="py-1">
        <SectionTitle title="All Orders" />
        <Divider className="dark:bg-slate-600"/>
      </section>

      <section className="w-full">
        <div>
        <Search />
        </div>
        {/* <div>
        <Dropdown
        trigger={["click"]}
        >
          <Button />
        </Dropdown>
        </div> */}
      </section>
      <section>
      <ConfigProvider theme={{
      algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,
    }}>
        <Table
          columns={columns}
          rowKey={(record) => record?.node?.id}
          expandable={{ expandedRowRender, defaultExpandedRowKeys: ['0'] }}
          dataSource={currentOrderList}
          pagination={false}
          size="medium"
        />
      </ConfigProvider>
      </section>
    </>
  )
};
export default OrderList;