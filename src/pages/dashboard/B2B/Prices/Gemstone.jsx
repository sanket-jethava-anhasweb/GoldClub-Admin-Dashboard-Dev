import { useLazyQuery, useMutation } from "@apollo/client";
import React, { useEffect, useRef, useState } from "react";
import {
  GET_ALL_GEMSTONE_SHAPES,
  GET_ALL_GEMSTONE_TYPES,
  GET_DIAMOND_SHAPES,
  GET_DIAMOND_SEIVES,
  GET_DIAMOND_GRADES,
  GET_GEMSTONE_PRICING,
  GET_DIAMOND_PRICES,
} from "../../../../GraphQl/Query";
import { Divider, Table, Tabs, message } from "antd";
import { useNavigate } from "react-router-dom";
import {
  CREATE_DIAMOND_PRICE,
  CREATE_GEMSTONE_PRICE,
} from "../../../../GraphQl/Mutations";
import SectionTitle from "../../../../components/Title/SectionTitle";
import Loader from "../../../../components/Spinner/Loader";
import InputComponent from "../../../../components/Inputs/Input";
import { AiOutlineEdit } from "react-icons/ai";
import DiamondModal from "../../../../components/Modals/GemstonePricing";
import OtherGemstoneModal from "../../../../components/Modals/OtherGemstone";
const ShowChange = (props) => {
  const [edit, setEdit] = useState(false);
  return (
    <>
      {!edit ? (
        <button
          class='inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-sm'
          onClick={() => {
            setEdit(!edit);
            console.log("CHILDREN ARE", props?.children);
          }}
        >
          <AiOutlineEdit size={22} />
        </button>
      ) : (
        props?.children
      )}
    </>
  );
};

const Diamond = () => {
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
  const [modalOpen, setModalOpen] = useState(false);
  const [diamondRates, setDiamondRates] = useState(null);
  const [localRates, setLocalRates] = useState([]);
  const [getDiamondShapes, diamondShapes] = useLazyQuery(GET_DIAMOND_SHAPES, {
    onCompleted: (data) => {
      console.log(data);
    },
    onError: (err) => {
      setError();
    },
  });
  const [getDiamondSieves, diamondSieves] = useLazyQuery(GET_DIAMOND_SEIVES, {
    onCompleted: (data) => {
      console.log(data);
    },
    onError: (err) => {
      setError();
    },
  });
  const [getDiamondGrades, diamondGrades] = useLazyQuery(GET_DIAMOND_GRADES, {
    onCompleted: (data) => {
      console.log(data);
    },
    onError: (err) => {
      setError();
    },
  });
  const [getDiamondPrices, diamondPrices] = useLazyQuery(GET_DIAMOND_PRICES, {
    fetchPolicy: "no-cache",
    onCompleted: (data) => {
      setDiamondRates(JSON.parse(data.metalRates.diamondRate));
    },
    onError: (err) => {
      setError();
    },
  });
  const [createDiamondPrice, diamondcreatedPrice] = useMutation(
    CREATE_DIAMOND_PRICE,
    {
      variables: {
        diamondRate: JSON.stringify(diamondRates),
      },
      onCompleted: (data) => {
        window.location.reload();
      },
    }
  );
  useEffect(() => {
    getDiamondShapes({
      variables: {
        filter: {
          search: "dia-shape",
        },
        first: 100,
      },
    });
    getDiamondSieves({
      variables: {
        filter: {
          search: "sieve-size",
        },
        first: 100,
      },
    });
    getDiamondGrades({
      variables: {
        filter: {
          search: "diamond-grade",
        },
        first: 100,
      },
    });
    getDiamondPrices();
  }, []);

  useEffect(() => {
    setLocalRates([]);

    let temp = structuredClone(diamondRates);
    if (diamondRates) {
      // console.log("temp is", Object.keys(temp));
      let shape;
      let size;
      let grade;
      let price;
      let temp_rates = [];
      Object.keys(temp)?.forEach((key, idx) => {
        shape = key?.split(",")[0];
        size = key?.split(",")[1];
        grade = key?.split(",")[2];
        price = Object.values(temp)[idx];

        temp_rates?.push({ shape, size, grade, price });
      });

      setLocalRates(() => temp_rates);
    }
  }, [diamondRates]);

  useEffect(() => {
    console.log(localRates);
  }, [localRates]);
  const columns = [
    {
      title: "Shape",
      width: "15%",
      dataIndex: "shape",
      key: "Shape",
      filters: diamondShapes?.data?.attributes?.edges[0]?.node?.values.map(
        (val) => ({ text: val?.name, value: val?.name })
      ),
      onFilter: (value, record) => record.shape.indexOf(value) != -1,
    },
    {
      title: "Size",
      width: "15%",
      dataIndex: "size",
      key: "Size",
    },
    {
      title: "Grade",
      width: "15%",
      dataIndex: "grade",
      key: "Grade",
      filters: diamondGrades?.data?.attributes?.edges[0]?.node?.values.map(
        (val) => ({ text: val?.name, value: val?.name })
      ),
      onFilter: (value, record) => record.grade.indexOf(value) != -1,
    },
    {
      title: "Price",
      width: "20%",
      dataIndex: "price",
      key: "Price",
    },
    {
      title: "Action",
      width: "30%",
      dataIndex: "action",
      key: "Action",
      render: (text, record) => {
        return (
          <ShowChange
            children={
              <div className='w-full flex items-center justify-start gapx-3'>
                <InputComponent
                  placeholder={"Enter new price"}
                  defaultValue={text}
                  onChange={(e) => {
                    // console.log(e);
                    let temp = structuredClone(diamondRates);
                    let query = `${record?.shape},${record?.size},${record?.grade}`;
                    // console.log(Object.keys(temp));
                    Object.keys(temp).forEach((rec, idx) => {
                      if (rec === query) {
                        temp[rec] = parseFloat(e.target.value);
                        setDiamondRates(temp);
                        return;
                      }
                    });
                  }}
                />
                {/* <button
                  className='font-semibold text-md '
                  type='secondary'
                  onClick={() => {
                    let temp = structuredClone(diamondRates);
                    let query = `${record?.shape},${record?.size},${record?.grade}`;
                    temp.forEach((rec, idx) => {
                      if (Object.keys(rec)[0] === query) {
                        temp[idx][query] = 800;
                        setDiamondRates(temp);
                        return;
                      }
                    });
                  }}
                >
                  Save
                </button> */}
              </div>
            }
          />
        );
      },
    },
  ];
  const modalRef = useRef();
  return (
    <>
      <div className='flex gap-4 mx-2'>
        <button
          class='inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-md mb-4'
          onClick={() => modalRef.current.openModal()}
        >
          {diamondcreatedPrice?.loading && <Loader />} New
        </button>
        <button
          class='inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-md mb-4'
          onClick={createDiamondPrice}
        >
          {diamondcreatedPrice?.loading && <Loader />} Save
        </button>
      </div>

      <DiamondModal ref={modalRef} diamondRates={diamondRates} />

      <Table dataSource={localRates} columns={columns} />
    </>
  );
};

const OtherGemstone = () => {
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
  const [modalOpen, setModalOpen] = useState(false);
  const [diamondRates, setDiamondRates] = useState(null);
  const [localRates, setLocalRates] = useState([]);
  const [getDiamondShapes, diamondShapes] = useLazyQuery(
    GET_ALL_GEMSTONE_SHAPES,
    {
      onCompleted: (data) => {
        console.log(data);
      },
      onError: (err) => {
        setError();
      },
    }
  );

  const [getDiamondGrades, diamondGrades] = useLazyQuery(
    GET_ALL_GEMSTONE_SHAPES,
    {
      onCompleted: (data) => {
        console.log(data);
      },
      onError: (err) => {
        setError();
      },
    }
  );
  const [getDiamondPrices, diamondPrices] = useLazyQuery(GET_GEMSTONE_PRICING, {
    fetchPolicy: "no-cache",
    onCompleted: (data) => {
      setDiamondRates(JSON.parse(data.metalRates.otherGemstoneRate));
    },
    onError: (err) => {
      setError();
    },
  });
  const [createDiamondPrice, diamondcreatedPrice] = useMutation(
    CREATE_GEMSTONE_PRICE,
    {
      variables: {
        otherGemstoneRate: JSON.stringify(diamondRates),
      },
      onCompleted: (data) => {
        window.location.reload();
      },
    }
  );
  useEffect(() => {
    getDiamondShapes({
      variables: {
        filter: {
          search: "dia-shape",
        },
        first: 100,
      },
    });

    getDiamondGrades({
      variables: {
        filter: {
          search: "gemstone-type",
        },
        first: 100,
      },
    });
    getDiamondPrices();
  }, []);

  useEffect(() => {
    setLocalRates([]);

    let temp = structuredClone(diamondRates);
    if (diamondRates) {
      let type;
      let shape;
      let size;
      let price;
      let temp_rates = [];
      Object.keys(temp)?.forEach((key, idx) => {
        type = Object.keys(temp[key])[0]?.split(",")[0];
        shape = Object.keys(temp[key])[0]?.split(",")[1];
        size = Object.keys(temp[key])[0]?.split(",")[2];
        price = Object.values(Object.values(temp)[idx])[0];
        temp_rates?.push({ type, shape, size, price });
      });

      setLocalRates(temp_rates);
    }
  }, [diamondRates]);

  const columns = [
    {
      title: "Type",
      width: "15%",
      dataIndex: "type",
      key: "tyoe",
      filters: diamondGrades?.data?.attributes?.edges[0]?.node?.values.map(
        (val) => ({ text: val?.name, value: val?.name })
      ),
      onFilter: (value, record) => record.grade.indexOf(value) != -1,
    },
    {
      title: "Shape",
      width: "15%",
      dataIndex: "shape",
      key: "Shape",
      filters: diamondShapes?.data?.attributes?.edges[0]?.node?.values.map(
        (val) => ({ text: val?.name, value: val?.name })
      ),
      onFilter: (value, record) => record.shape.indexOf(value) != -1,
    },
    {
      title: "Size",
      width: "15%",
      dataIndex: "size",
      key: "Size",
    },

    {
      title: "Price",
      width: "20%",
      dataIndex: "price",
      key: "Price",
    },
    {
      title: "Action",
      width: "30%",
      dataIndex: "action",
      key: "Action",
      render: (text, record) => {
        return (
          <ShowChange
            children={
              <div className='w-full flex items-center justify-start gapx-3'>
                <InputComponent
                  placeholder={"Enter new price"}
                  defaultValue={text}
                  onChange={(e) => {
                    console.log(e);
                    let temp = structuredClone(diamondRates);
                    let query = `${record?.shape},${record?.size},${record?.grade}`;
                    temp.forEach((rec, idx) => {
                      if (Object.keys(rec)[0] === query) {
                        temp[idx][query] = e.target.value;
                        setDiamondRates(temp);
                        return;
                      }
                    });
                  }}
                />
                {/* <button
                  className='font-semibold text-md '
                  type='secondary'
                  onClick={() => {
                    let temp = structuredClone(diamondRates);
                    let query = `${record?.shape},${record?.size},${record?.grade}`;
                    temp.forEach((rec, idx) => {
                      if (Object.keys(rec)[0] === query) {
                        temp[idx][query] = 800;
                        setDiamondRates(temp);
                        return;
                      }
                    });
                  }}
                >
                  Save
                </button> */}
              </div>
            }
          />
        );
      },
    },
  ];
  const modalRef = useRef();
  return (
    <>
      <div className='flex gap-4 mx-2'>
        <button
          class='inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-md mb-4'
          onClick={() => modalRef.current.openModal()}
        >
          {diamondcreatedPrice?.loading && <Loader />} New
        </button>
        <button
          class='inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-md mb-4'
          onClick={() => {
            console.log(diamondRates);
            // createDiamondPrice()
          }}
        >
          {diamondcreatedPrice?.loading && <Loader />} Save
        </button>
      </div>

      <OtherGemstoneModal ref={modalRef} diamondRates={diamondRates} />

      <Table dataSource={localRates} columns={columns} />
    </>
  );
};

const Gemstone = () => {
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
  const navigate = useNavigate();

  const items = [
    {
      key: "1",
      label: "Diamond",
      children: (
        <div className='h-full'>
          <Diamond />
        </div>
      ),
    },
    // {
    //   key: "2",
    //   label: "Other Gemstones",
    //   children: (
    //     <div className='h-full min-h-[30vh]'>
    //       <OtherGemstone />
    //     </div>
    //   ),
    // },
  ];

  return (
    <section className='w-full flex flex-col  justify-center '>
      {contextHolder}
      <div className='flex flex-wrap items-center justify-between'>
        <SectionTitle title='Gemstones' />
        {/* <Link
          to={"/dashboard/b2b/create-manufacturers"}
          className='inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-md'
        >
          + Create New
        </Link> */}
      </div>
      <Divider className='dark:bg-white/10' />
      <section className='w-full px-[10px] my-4 flex justify-around h-full '>
        <Tabs defaultActiveKey='1' items={items} className='w-full' />
      </section>
    </section>
  );
};

export default Gemstone;
