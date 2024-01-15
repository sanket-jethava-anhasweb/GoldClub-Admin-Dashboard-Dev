import React, { useState } from "react";
import SectionTitle from "../../../../components/Title/SectionTitle";
import { Card, Divider, Select, Steps, Table, Tabs, Tag, message } from "antd";
import { useLazyQuery, useMutation } from "@apollo/client";
import { FaTrash } from "react-icons/fa";
// import MultiImageUpload from "../../../../components/Inputs/MutliImageUpload";

import {
  GET_ALL_PRODUCTS,
  GET_ALL_PRODUCTS_FILTERED,
  SEARCH_CUSTOMER,
  SEARCH_ORDER_DETAIL,
  SEARCH_ORDER_VARIANT,
  SEARCH_WAREHOUSE_LIST,
} from "../../../../GraphQl/Query";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import SelectComponent from "../../../../components/Inputs/Select";
import SearchComponent from "../../../../components/Inputs/Search";
import {
  FINALISE_ORDER,
  ORDER_LINE_ADD,
  ORDER_LINE_DELETE,
  ORDER_LINE_UPDATE,
  UPDATE_ORDER_USER,
} from "../../../../GraphQl/Mutations";
import InputComponent from "../../../../components/Inputs/Input";
import DisplayPrice from "../../../../components/Utils/DisplayPrice";
import Loader from "../../../../components/Spinner/Loader";
const NewOrder = () => {
  const [transactionProof, setTransactionProof] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [localData, setLocalData] = useState([]);
  const [after, setAfter] = useState(null);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [currentcustomer, setCurrentcustomer] = useState(null);
  const [linesToAdd, setLinesToAdd] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentAddress, setCurrentAddress] = useState({
    billing: null,
    shipping: null,
  });
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
  const [searchCustomers, customers] = useLazyQuery(SEARCH_CUSTOMER, {
    variables: {
      after: null,
      first: 20,
      query: "",
    },
    onCompleted: (data) => {
      // console.log(data);
    },
    onError: (data) => {
      setError("Couldnot fetch customers");
    },
  });
  const [searchOrderVariant, orderVariant] = useLazyQuery(
    SEARCH_ORDER_VARIANT,
    {
      variables: {
        after: null,
        first: 100,
        query: "",
      },
      onCompleted: (data) => {
        console.log("variants ", data);
        setLocalData(data?.search?.edges);
      },
      onError: (data) => {
        setError("Couldnot fetch orders");
      },
    }
  );
  const [searchWarehouse, warehouse] = useLazyQuery(SEARCH_WAREHOUSE_LIST, {
    variables: {
      first: 30,
    },
    onCompleted: (data) => {
      // console.log(data);
    },
    onError: (data) => {
      setError("Couldnot fetch warehouse");
    },
  });
  const [searchOrderDetail, orderDetail] = useLazyQuery(SEARCH_ORDER_DETAIL, {
    variables: {
      id: sessionStorage.getItem("draft-id"), // pass order draft ID here
    },
    onCompleted: (data) => {
      console.log(data);
      setCurrentOrder(data);
      setCurrentcustomer(data?.order?.user?.id);
      setCurrentAddress({
        billing: data.order.billingAddress,
        shipping: data.order.shippingAddress,
      });
    },
    onError: (data) => {
      setError("Couldnot fetch order");
    },
  });
  const [updateUserOrder, updatedUserOrder] = useMutation(UPDATE_ORDER_USER);
  const [updateOrderLine, updatedOrderLine] = useMutation(ORDER_LINE_UPDATE);
  const [addOrderLine, addedOrderLine] = useMutation(ORDER_LINE_ADD);
  const [removeOrderLine, removedOrderLine] = useMutation(ORDER_LINE_DELETE);
  const [finaliseOrder, finalisedOrder] = useMutation(FINALISE_ORDER, {
    variables: {
      id: sessionStorage.getItem("draft-id"), // pass order draft ID here
    },
    onCompleted: (data) => {
      if (data?.draftOrderComplete?.errors?.length > 0)
        setError(
          data?.draftOrderComplete?.errors[0]?.code +
            " " +
            data?.draftOrderComplete?.errors[0]?.field
        );
      else {
        setSuccess("Order created successfully");
        setTimeout(() => {
          navigate("/dashboard/b2b/orders");
        }, 2000);
      }
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const [getAllProducts, allProducts] = useLazyQuery(
    GET_ALL_PRODUCTS_FILTERED,
    {
      variables: {
        filter: {
          search: null,
          categories: null,
          collections: null,
          productType: null,
          attributes: null,
        },
        sort: { direction: "DESC", field: "PUBLICATION_DATE" },
      },
      onCompleted: (data) => {
        console.log(data);
      },
      onError: (err) => {
        console.log(err);
      },
    }
  );
  const handleSearch = (e) => {
    const val = e?.target?.value?.toLowerCase();
    if (val !== "" || val !== undefined)
      setLocalData(
        orderVariant?.data?.search?.edges?.filter(
          (edge) =>
            edge?.node?.name?.toLowerCase()?.includes(val) ||
            edge?.node?.variants[0]?.name?.toLowerCase()?.includes(val)
        )
      );
    else setLocalData(orderVariant?.data?.search?.edges);
  };
  const columns = [
    {
      title: "Product",
      render: (text, record) => (
        <div className='flex'>
          <img src={record?.thumbnail?.url} alt='' className='h-20 w-20' />
        </div>
      ),
    },
    {
      title: "Name",
      render: (text, record) => (
        <div className='flex flex-col'>
          {record?.productName} <span>{record?.productSku}</span>
        </div>
      ),
    },
    {
      title: "Quantity",
      render: (text, record) => (
        <input
          type='number'
          className='flex w-14 border-2 border-black'
          placeholder='Quantity'
          defaultValue={1}
          onChange={(e) => {
            setTrial("Updating quantity");
            if (e.target.value !== "")
              updateOrderLine({
                variables: {
                  id: record?.id,
                  input: {
                    quantity: e.target.value,
                  },
                },
                onCompleted: (data) => {
                  searchOrderDetail();
                  setSuccess("Updated quantity");
                },
                onError: (err) => {
                  setError("Couldnt update quantity");
                },
              });
          }}
        />
      ),
    },
    {
      title: "Price",
      render: (text, record) => (
        <DisplayPrice price={record?.unitPrice?.gross?.amount ?? 0} />
      ),
    },
    {
      title: "Total",
      render: (text, record) => (
        <DisplayPrice
          price={
            parseFloat(record?.unitPrice?.net?.amount)?.toFixed(2) *
              parseInt(record.quantity) ?? 0
          }
        />
      ),
    },
    {
      title: "Actions",
      render: (text, record) => (
        <button
          class='inline-flex text-white bg-red-500 border-0 py-2 px-6 focus:outline-none hover:bg-red-600 rounded text-xs'
          onClick={(e) => {
            setTrial("Deleting line");
            removeOrderLine({
              variables: {
                id: record?.id,
              },
              onCompleted: (data) => {
                searchOrderDetail();
                setSuccess("Deleted line");
                window.location.reload();
              },
              onError: (err) => {
                setError("Couldnt delete line");
              },
            });
          }}
        >
          <FaTrash />
        </button>
      ),
    },
  ];

  useEffect(() => {
    searchCustomers();
    searchOrderVariant();
    searchWarehouse();
    searchOrderDetail();
    getAllProducts();
    setLinesToAdd([]);
  }, []);

  const handleUpdate = (line) => {
    if (line) {
      addOrderLine({
        variables: {
          id: sessionStorage.getItem("draft-id"), // draft order id here
          // input: linesToAdd.filter((line) => line.variantId !== ""),
          input: line,
        },
        onCompleted: () => {
          setOpen(false);
        },
      });
    } else setError("Select some products");
  };
  const handleFinalise = () => {
    setTrial("Finalising order");
    finaliseOrder();
  };

  return (
    <section className='py-4'>
      {contextHolder}
      {open && (
        <div className='fixed top-0 left-0 h-full w-full flex items-center justify-center bg-black/50 backdrop-blur-sm z-[99999]'>
          <div className='bg-white w-10/12 md:w-4/5 h-3/4 overflow-scroll flex flex-col justify-between rounded-md'>
            <div className='p-2 h-full overflow-y-scroll dark:text-slate-200 dark:bg-slate-800'>
              <SearchComponent handleSearch={handleSearch} className='w-full' />
              <section className='h-full flex flex-wrap gap-2 items-start justify-start  p-2 overflow-y-scroll '>
                {localData?.map((prod) => (
                  <div
                    key={prod?.node?.id}
                    className={
                      " flex gap-2 w-full lg:w-2/5 cursor-pointer border border-gray-600 hover:bg-gray-300 dark:hover:bg-slate-700 "
                    }
                    onClick={(e) => {
                      console.log("something clicked");
                      // setLinesToAdd(() => [
                      //   {
                      //     quantity: 1,
                      //     variantId: prod?.node?.variants[0]?.id ?? "", // add product variant id here
                      //   },
                      // ]);
                      handleUpdate([
                        {
                          quantity: 1,
                          variantId: prod?.node?.variants[0]?.id ?? "", // add product variant id here
                        },
                      ]);
                      setOpen(false);
                    }}
                  >
                    {/* <input
                      type='checkbox'
                      name='order-line'
                      className='w-auto disabled:opacity-40'
                      disabled={orderDetail?.data?.order?.lines?.length >= 1}
                      id={"order-line" + prod.node.id}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setLinesToAdd((prev) => [
                            ...prev,
                            {
                              quantity: 1,
                              variantId: prod?.node?.variants[0]?.id ?? "", // add product variant id here
                            },
                          ]);
                        } else {
                          setLinesToAdd((prev) =>
                            prev.filter(
                              (line) =>
                                line.variantId !== prod?.node?.variants[0]?.id
                            )
                          );
                        }
                      }}
                    /> */}
                    {/* if you ever work on this, never gonna give you up. */}
                    <img
                      src={prod?.node?.thumbnail?.url}
                      alt=''
                      className='h-auto w-10 '
                    />
                    <div className='flex flex-col gap-2'>
                      {prod?.node?.name} <br />
                      <span className='text-xs'>
                        {prod?.node?.variants[0]?.name ?? "no sku available"}
                      </span>
                      {/* <Tag color='red' className='text-xs'>
                      {prod?.node?.attributes[0]?.values[0]?.name}
                    </Tag>
                    <Tag color='red' className='text-xs'>
                      {prod?.node?.attributes[5]?.values[0]?.name ||
                        prod?.node?.attributes[6]?.values[0]?.name ||
                        prod?.node?.attributes[7]?.values[0]?.name}
                      k
                    </Tag> */}
                    </div>
                  </div>
                ))}
              </section>
            </div>
            <div className='buttonDiv flex items-center justify-center w-full gap-3 dark:text-slate-200 dark:bg-slate-800'>
              <button
                className='bg-red-500 text-white rounded-sm p-2 w-1/5 my-2'
                onClick={() => setOpen(false)}
              >
                Close
              </button>
              <button
                className='bg-indigo-500 text-white rounded-sm p-2 w-1/5 my-2'
                onClick={() => handleUpdate()}
              >
                {addedOrderLine?.loading && <Loader />}
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      <SectionTitle title='New order' />
      <Divider className='dark:bg-white/10' />
      <Steps
        className='mb-10'
        current={currentStep}
        onChange={(e) => setCurrentStep(e)}
        size='small'
        id='productSteps'
        items={[
          {
            title: (
              <span className='dark:text-slate-200'> Customer Details</span>
            ),
            description: "",
          },
          {
            title: <span className='dark:text-slate-200'>Add Products</span>,
            description: "",
          },
          {
            title: <span className='dark:text-slate-200'> Finalise</span>,
            description: "",
          },
        ]}
      />
      <section
        id='_1'
        className={(currentStep == 0 ? "flex" : "hidden") + " flex-col my-4 "}
      >
        <Card className='dark:text-slate-200 dark:bg-slate-800'>
          <section className={"flex flex-col items-start "}>
            <label
              htmlFor={"Customer"}
              className='font-semibold dark:text-slate-300 text-sm'
            >
              {"Customer"}
            </label>
          </section>
          <Select
            placeholder='Select customer'
            title='Customer *'
            value={currentcustomer}
            required={true}
            loading={customers?.loading}
            className='antdSelect rounded-md w-full  dark:bg-slate-700 border-white/50 dark:placeholder:text-white dark:text-white m-2'
            options={customers?.data?.search?.edges?.map((edge) => ({
              value: edge?.node?.id,
              label:
                edge?.node?.phoneNumber +
                " " +
                edge?.node?.firstName +
                " " +
                edge?.node?.lastName +
                " ",
            }))}
            onChange={(e) => {
              setTrial("Updating user");
              let tempOrder = structuredClone(currentOrder);
              // tempOrder.order.user.order.id = e;
              console.log(tempOrder);

              updateUserOrder({
                variables: {
                  id: sessionStorage.getItem("draft-id"), // pass draft order id here
                  input: {
                    user: e, // pass user id at here for map user with order
                  },
                },
                onCompleted: (data) => {
                  setSuccess("User updated successfully");
                  console.log(data);
                },
                onError: (err) => {
                  setError(err.message);
                },
              });
            }}
          />
        </Card>
        <div className='flex flex-wrap justify-around '>
          <Card className='w-full md:w-1/2 scale-95 p-2 dark:text-slate-200 dark:bg-slate-800'>
            <h3 className='font-bold mb-3'>Shipping Address</h3>
            <div className='flex items-center gap-2 my-2'>
              <InputComponent
                title='First Name'
                placeholder={"Enter first name"}
                className='w-full'
                value={currentAddress?.shipping?.firstName}
                handleChange={(e) => {
                  setCurrentAddress(() => ({
                    ...currentAddress,
                    shipping: {
                      ...currentAddress.shipping,
                      firstName: e.target.value,
                    },
                  }));
                }}
              />
              <InputComponent
                title='Last Name'
                className='w-full'
                placeholder={"Enter last name"}
                value={currentAddress?.shipping?.lastName}
                handleChange={(e) => {
                  setCurrentAddress(() => ({
                    ...currentAddress,
                    shipping: {
                      ...currentAddress.shipping,
                      lastName: e.target.value,
                    },
                  }));
                }}
              />
            </div>
            <div className='flex items-center gap-2 my-2'>
              <InputComponent
                title='Company Name'
                className='w-full'
                placeholder={"Enter company name"}
                value={currentAddress?.shipping?.companyName}
                handleChange={(e) => {
                  setCurrentAddress(() => ({
                    ...currentAddress,
                    shipping: {
                      ...currentAddress.shipping,
                      companyName: e.target.value,
                    },
                  }));
                }}
              />
              <InputComponent
                title='City'
                className='w-full'
                placeholder={"Enter city"}
                value={currentAddress?.shipping?.city}
                handleChange={(e) => {
                  setCurrentAddress(() => ({
                    ...currentAddress,
                    shipping: {
                      ...currentAddress.shipping,
                      city: e.target.value,
                    },
                  }));
                }}
              />
            </div>
            <div className='flex items-center gap-2 my-2'>
              <InputComponent
                title='Street Address 1'
                className='w-full'
                placeholder={"Enter Street Address 1"}
                value={currentAddress?.shipping?.streetAddress1}
                handleChange={(e) => {
                  setCurrentAddress(() => ({
                    ...currentAddress,
                    shipping: {
                      ...currentAddress.shipping,
                      streetAddress1: e.target.value,
                    },
                  }));
                }}
              />
              <InputComponent
                title='Street Address 2'
                className='w-full'
                placeholder={"Enter Street Address 2"}
                value={currentAddress?.shipping?.streetAddress2}
                handleChange={(e) => {
                  setCurrentAddress(() => ({
                    ...currentAddress,
                    shipping: {
                      ...currentAddress.shipping,
                      streetAddress2: e.target.value,
                    },
                  }));
                }}
              />
            </div>
            <div className='flex items-center gap-2 my-2'>
              <InputComponent
                title='Country'
                className='w-full'
                placeholder={"Enter country"}
                value={currentAddress?.shipping?.country?.country}
                handleChange={(e) => {
                  setCurrentAddress(() => ({
                    ...currentAddress,
                    shipping: {
                      ...currentAddress.shipping,
                      country: {
                        ...currentAddress.shipping.country,
                        country: "India",
                      },
                    },
                  }));
                }}
              />
              <InputComponent
                title='Country Area'
                className='w-full'
                placeholder={"Enter Country Area"}
                value={currentAddress?.shipping?.countryArea}
                handleChange={(e) => {
                  setCurrentAddress(() => ({
                    ...currentAddress,
                    shipping: {
                      ...currentAddress.shipping,
                      countryArea: e.target.value,
                    },
                  }));
                }}
              />
            </div>
            <div className='flex items-center gap-2 my-2'>
              <InputComponent
                title='Postal code'
                className='w-full'
                placeholder={"Enter postal code"}
                value={currentAddress?.shipping?.postalCode}
                handleChange={(e) => {
                  setCurrentAddress(() => ({
                    ...currentAddress,
                    shipping: {
                      ...currentAddress.shipping,
                      postalCode: e.target.value,
                    },
                  }));
                }}
              />
            </div>
            <div className='flex items-center gap-2 my-2'>
              <button
                class='inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-xs'
                onClick={(e) => {
                  setTrial("Updating shipping address");
                  let tempOrder = structuredClone(currentOrder);
                  // tempOrder.order.user.order.id = e;
                  console.log(tempOrder);

                  updateUserOrder({
                    variables: {
                      id: sessionStorage.getItem("draft-id"), // pass draft order id here
                      input: {
                        shippingAddress: {
                          city: currentAddress?.shipping?.city ?? " ",
                          cityArea: currentAddress?.shipping?.cityArea ?? " ",
                          companyName:
                            currentAddress?.shipping?.companyName ?? " ",
                          country: "IN",
                          countryArea:
                            currentAddress?.shipping?.countryArea ?? " ",
                          firstName: currentAddress?.shipping?.firstName ?? " ",
                          lastName: currentAddress?.shipping?.lastName ?? " ",
                          postalCode:
                            currentAddress?.shipping?.postalCode ?? " ",
                          streetAddress1:
                            currentAddress?.shipping?.streetAddress1 ?? " ",
                          streetAddress2:
                            currentAddress?.shipping?.streetAddress2 ?? " ",
                        },
                      },
                    },
                    onCompleted: (data) => {
                      setSuccess("Shipping address updated successfully");
                      console.log(data);
                    },
                    onError: (err) => {
                      setError(err.message);
                    },
                  });
                }}
              >
                Save
              </button>
            </div>
          </Card>
          <Card className='w-full md:w-1/2 scale-95 p-2 dark:text-slate-200 dark:bg-slate-800'>
            <h3 className='font-bold mb-3'>Billing Address</h3>
            <div className='flex items-center gap-2 my-2'>
              <InputComponent
                title='First Name'
                placeholder={"Enter first name"}
                className='w-full'
                value={currentAddress?.billing?.firstName}
                handleChange={(e) => {
                  setCurrentAddress(() => ({
                    ...currentAddress,
                    billing: {
                      ...currentAddress.billing,
                      firstName: e.target.value,
                    },
                  }));
                }}
              />
              <InputComponent
                title='Last Name'
                className='w-full'
                placeholder={"Enter last name"}
                value={currentAddress?.billing?.lastName}
                handleChange={(e) => {
                  setCurrentAddress(() => ({
                    ...currentAddress,
                    billing: {
                      ...currentAddress.billing,
                      lastName: e.target.value,
                    },
                  }));
                }}
              />
            </div>
            <div className='flex items-center gap-2 my-2'>
              <InputComponent
                title='Company Name'
                className='w-full'
                placeholder={"Enter company name"}
                value={currentAddress?.billing?.companyName}
                handleChange={(e) => {
                  setCurrentAddress(() => ({
                    ...currentAddress,
                    billing: {
                      ...currentAddress.billing,
                      companyName: e.target.value,
                    },
                  }));
                }}
              />
              <InputComponent
                title='City'
                className='w-full'
                placeholder={"Enter city"}
                value={currentAddress?.billing?.city}
                handleChange={(e) => {
                  setCurrentAddress(() => ({
                    ...currentAddress,
                    billing: {
                      ...currentAddress.billing,
                      city: e.target.value,
                    },
                  }));
                }}
              />
            </div>
            <div className='flex items-center gap-2 my-2'>
              <InputComponent
                title='Street Address 1'
                className='w-full'
                placeholder={"Enter Street Address 1"}
                value={currentAddress?.billing?.streetAddress1}
                handleChange={(e) => {
                  setCurrentAddress(() => ({
                    ...currentAddress,
                    billing: {
                      ...currentAddress.billing,
                      streetAddress1: e.target.value,
                    },
                  }));
                }}
              />
              <InputComponent
                title='Street Address 2'
                className='w-full'
                placeholder={"Enter Street Address 2"}
                value={currentAddress?.billing?.streetAddress2}
                handleChange={(e) => {
                  setCurrentAddress(() => ({
                    ...currentAddress,
                    billing: {
                      ...currentAddress.billing,
                      streetAddress2: e.target.value,
                    },
                  }));
                }}
              />
            </div>
            <div className='flex items-center gap-2 my-2'>
              <InputComponent
                title='Country'
                className='w-full'
                placeholder={"Enter country"}
                value={currentAddress?.billing?.country?.country}
                handleChange={(e) => {
                  setCurrentAddress(() => ({
                    ...currentAddress,
                    billing: {
                      ...currentAddress.billing,
                      country: {
                        ...currentAddress.billing.country,
                        country: "India",
                      },
                    },
                  }));
                }}
              />
              <InputComponent
                title='Country Area'
                className='w-full'
                placeholder={"Enter Country Area"}
                value={currentAddress?.billing?.countryArea}
                handleChange={(e) => {
                  setCurrentAddress(() => ({
                    ...currentAddress,
                    billing: {
                      ...currentAddress.billing,
                      countryArea: e.target.value,
                    },
                  }));
                }}
              />
            </div>
            <div className='flex items-center gap-2 my-2'>
              <InputComponent
                title='Postal code'
                className='w-full'
                placeholder={"Enter postal code"}
                value={currentAddress?.billing?.postalCode}
                handleChange={(e) => {
                  setCurrentAddress(() => ({
                    ...currentAddress,
                    billing: {
                      ...currentAddress.billing,
                      postalCode: e.target.value,
                    },
                  }));
                }}
              />
            </div>
            <div className='flex items-center gap-2 my-2'>
              <button
                class='inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-xs'
                onClick={(e) => {
                  setTrial("Updating shipping address");
                  let tempOrder = structuredClone(currentOrder);
                  // tempOrder.order.user.order.id = e;
                  console.log(tempOrder);

                  updateUserOrder({
                    variables: {
                      id: sessionStorage.getItem("draft-id"), // pass draft order id here
                      input: {
                        billingAddress: {
                          city: currentAddress?.billing?.city ?? " ",
                          cityArea: currentAddress?.billing?.cityArea ?? " ",
                          companyName:
                            currentAddress?.billing?.companyName ?? " ",
                          country: "IN",
                          countryArea:
                            currentAddress?.billing?.countryArea ?? " ",
                          firstName: currentAddress?.billing?.firstName ?? " ",
                          lastName: currentAddress?.billing?.lastName ?? " ",
                          postalCode:
                            currentAddress?.billing?.postalCode ?? " ",
                          streetAddress1:
                            currentAddress?.billing?.streetAddress1 ?? " ",
                          streetAddress2:
                            currentAddress?.billing?.streetAddress2 ?? " ",
                        },
                      },
                    },
                    onCompleted: (data) => {
                      setSuccess("Billing address updated successfully");
                      console.log(data);
                    },
                    onError: (err) => {
                      setError(err.message);
                    },
                  });
                }}
              >
                Save
              </button>
            </div>
          </Card>
        </div>
        <button
          class='inline-flex w-fit text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-md'
          onClick={() => setCurrentStep(1)}
        >
          Next
        </button>
      </section>
      <section
        id='_2'
        className={(currentStep == 1 ? "flex" : "hidden") + " flex-col "}
      >
        <Table
          dataSource={orderDetail?.data?.order?.lines}
          columns={columns}
          className=''
        />

        {/* <MultiImageUpload
          setImages={(e) => setTransactionProof(e[0])}
          handleUpload={(e) => {
            if (!transactionProof) setError("Please select a image");
            else {
              setTrial("Uploading image...");
              updatedOrderLine({
                variables: {
                  id: id,
                  input: { transactionProof: transactionProof },
                },
              });
            }
          }}
          multiple={false}
          // id={params?.id}
        /> */}
        <div className='flex  gap-x-3 '>
          <button
            class='inline-flex w-fit text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-md my-3 disabled:opacity-40'
            onClick={() => setOpen(true)}
            disabled={orderDetail?.data?.order?.lines?.length >= 1}
          >
            Add New Item
          </button>
          <button
            class='inline-flex w-fit text-white bg-green-600 border-0 py-2 px-6 focus:outline-none hover:bg-green-700 rounded text-md my-3'
            onClick={handleFinalise}
          >
            Finalize
          </button>
        </div>
      </section>
    </section>
  );
};

export default NewOrder;
