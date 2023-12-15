import { useLazyQuery, useMutation } from "@apollo/client";
import React, { useEffect, useRef, useState } from "react";
import { GET_ORDER_LIST, SEARCH_ORDER_DETAIL, GET_PAYMENT_PROOF } from "../../../../GraphQl/Query";
import { Button, Divider, Dropdown, message, Space, Table, Tag } from "antd";
import { ReloadOutlined, MoreOutlined } from "@ant-design/icons";
import SectionTitle from "../../../../components/Title/SectionTitle";
import DisplayPrice from "../../../../components/Utils/DisplayPrice";
import SearchComponent from "../../../../components/Inputs/Search";
// import Spinner from "../../../../components/Spinner/Spinner";
import OrderModal from "../../../../components/Modals/OrderModal";
// import CustomModal from "../../../../components/Inputs/CustomModal";
import {
  CANCEL_FULFILLED_ORDER,
  CANCE_REGULAR_ORDER,
  CREATE_EMPTY_ORDER,
  FULFILL_ORDER,
  MARK_ORDER_PAID,
  TRANSACTION_UPDATE
} from "../../../../GraphQl/Mutations";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../../../../components/Spinner/Loader";

const OrderList = () => {
  // const [isModalVisible, setIsModalVisible] = useState(false);
  // const [selectedImage, setSelectedImage] = useState(null);
  // const [selectedOption, setSelectedOption] = useState(null);
  // const [textInputValue, setTextInputValue] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const [localData, setLocalData] = useState([]);
  // const [currentOrder, setCurrentOrder] = useState(null);
  const modalRef = useRef();

  const [paymentProofData, setPaymentProofData] = useState(null);
  const [showPaymentProof, setShowPaymentProof] = useState({});
  const [getPaymentProof, paymentProof] = useLazyQuery(GET_PAYMENT_PROOF, {
    onCompleted: (data) => {
      console.log(data);
      setPaymentProofData(data);
    },
    onError: (err) => {
      console.log(err);
    },
  });
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
  const handleGetPaymentProof = (orderId) => {
    // Call the getPaymentProof query here using orderId
    getPaymentProof({
      variables: {
        id: orderId,
      },
    });
  };
  const handleExpandButtonClick = (id) => {
    // Your logic for handling the button click, for example, fetching additional details
    console.log(`Expand button clicked for order ID: ${id}`);
    handleGetPaymentProof(id);
    console.log(paymentProofData);
    setShowPaymentProof((prevVisibility) => ({
      ...prevVisibility,
      [id]: !prevVisibility[id],
    }));
  };
  useEffect(() => {
    // Update the paymentProofData object when the query is completed
    if (paymentProof.data?.orderTransactionHistoryById[0]?.order?.id) {
      setPaymentProofData((prevData) => ({
        ...prevData,
        [paymentProof.data.orderTransactionHistoryById[0].order.id]: paymentProof.data,
      }));
    }
  }, [paymentProof.data]);
  
  const [fetchOrders, orders] = useLazyQuery(GET_ORDER_LIST, {
    fetchPolicy: "cache-and-network",
    variables: {
      first: 20,
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
  const [fetchSingleOrders, singleOrder] = useLazyQuery(SEARCH_ORDER_DETAIL, {
    fetchPolicy: "cache-and-network",

    onCompleted: (data) => {
      setLocalData(data?.orders?.edges);
      console.log(data);
    },
    onError: (err) => {
      setError(err?.message);
    },
  });
  const navigate = useNavigate();
  const handleOpenModal = (e) => {
    modalRef.current.openModal();
  };

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
    fetchOrders();
  }, [fetchOrders]);

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
      title: "Actions",
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
            <Button>
              <MoreOutlined />
            </Button>
          </Dropdown>
        );
      },
    },
  ];
  return (
    <section className='py-4'>
      {contextHolder}
      <SectionTitle title='Order History' />
      <Divider className='dark:bg-white/10' />
      {/* <OrderModal order={currentOrder} ref={modalRef} /> */}
      {/* {orders?.loading && <Spinner />} */}
      <button
        class='inline-flex items-center text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-md my-4'
        onClick={createDraftOrder}
      >
        {draftOrder?.loading && <Loader />} Create order
      </button>
      <div className='flex flex-col md:flex-row flex-wrap w-full items-start md:items-center justify-start md:justify-around mb-3 '>
        <div className='w-full md:w-10/12'>
          <SearchComponent
            handleSearch={handleSearch}
            className='dark:text-slate-200 dark:bg-slate-500'
          />
        </div>
        <div className='w-full md:w-2/12 mb-4'>
          <Button
            type='Primary'
            className='inline-flex h-10 text-white bg-blue-500 border-0 py-4 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg items-center justify-center '
            onClick={() => fetchOrders()}
          >
            <ReloadOutlined />
          </Button>
        </div>
      </div>
      <Table
        dataSource={localData || orders?.data?.orders?.edges}
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
            <>
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
              <div className='flex flex-col'>
                <span className='font-bold'>Products: </span>
                {record?.node?.lines?.map((line) => (
                  <Link
                    to={"/dashboard/b2b/products/" + line?.variant?.product?.id}
                    className='flex gap-2 w-[70%]'
                  >
                    <img
                      src={line?.thumbnail?.url}
                      alt={line?.thumbnail?.alt}
                      className='h-auto w-1/12'
                    />
                    <div className='flex flex-col w-2/5'>
                      <span className='font-semibold'>{line?.productName}</span>
                      <span className='max-w-lg'>
                        size: {line?.variantName?.split("/")[0]}
                      </span>
                      <span className='max-w-lg'>
                        color:{" "}
                        {line?.variant?.product?.attributes[9]?.values[0]?.name}
                      </span>
                      <span className='max-w-lg'>
                        Purity:{" "}
                        {line?.variant?.product?.attributes[5]?.values[0]?.name}
                      </span>
                    </div>

                    <div className='flex flex-col w-1/5'>
                      <span className='font-semibold'>
                        Quantity: {line?.quantity}
                      </span>
                      <span className='font-semibold'>
                        Fulfilled:{line?.quantityFulfilled}
                      </span>
                    </div>
                    <div className='flex flex-col w-1/5'>
                      <span className='font-semibold'>Total Price:</span>
                      <span className='font-semibold'>
                        <DisplayPrice price={line?.totalPrice?.net?.amount} />
                      </span>
                    </div>
                  </Link>
                ))}
                <div class="w-full mt-5 flex flex-row justify-evenly align-center">
                {showPaymentProof[record.node.id] && (
                <>
                  <a
                    className="h-auto w-1/12"
                    href={paymentProofData?.orderTransactionHistoryById[0]?.transactionProof}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      
                      src={paymentProofData?.orderTransactionHistoryById[0]?.transactionProof}
                      alt="Transaction Proof"
                    />
                  </a>
                  <p className="flex flex-col justify-center text-center"><b>Transaction Mode:</b> <br/> <b className="text-xl">{paymentProofData?.orderTransactionHistoryById[0]?.transactionMode}</b></p>
                  <p className="flex flex-col justify-center text-center"><b>Customer Note:</b> <br/> <b className="text-xl">{paymentProofData?.orderTransactionHistoryById[0]?.customerNote}</b></p>
                  {/* Other elements related to payment proof */}
                </>
              )}
                <button
                className="bg-blue h-60px w-120px"
                type="primary"
                onClick={() => {
                  handleExpandButtonClick(record.node.id);
                  // setShowPaymentProof(true); // Set state to true on button click
                }}              >
                Get Payment Proof
              </button>
              </div>
              </div>
              
            </>
          ),
          rowExpandable: (record) => record?.node?.billingAddress !== null,
        }}
      />
    </section>
  );
};

export default OrderList;
