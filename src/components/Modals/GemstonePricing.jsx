import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import InputComponent from "../Inputs/Input";
import AutoCompleteComponent from "../Inputs/AutoComplete";
import { useLazyQuery, useMutation } from "@apollo/client";
import {
  CREATE_DIAMOND_PRICE,
  UPDATE_MANUFACTURER,
} from "../../GraphQl/Mutations";
import Spinner from "../Spinner/Spinner";
import SelectComponent from "../Inputs/Select";
import {
  GET_ALL_ASSIGNMENT_CATEGORIES,
  GET_ASSIGMENT_COLOR,
  GET_ASSIGNMENT_CARAT,
  GET_ASSIGNMENT_SUBCATEGORY,
  GET_DIAMOND_GRADES,
  GET_DIAMOND_PRICES,
  GET_DIAMOND_SEIVES,
  GET_DIAMOND_SHAPES,
} from "../../GraphQl/Query";
import Loader from "../Spinner/Loader";

const Modal = (props, ref) => {
  const [modalState, setModalState] = useState(false);
  const [diamondVar, setDiamondVar] = useState(null);
  const [error, setError] = useState("");
  useImperativeHandle(ref, () => ({
    openModal: () => setModalState(true),
  }));
  const [diamondRates, setDiamondRates] = useState(props?.diamondRates);

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
      onCompleted: (data) => {
        console.log(data);
        window.location.reload();
      },
    }
  );

  const handleUpdate = () => {
    let temp = structuredClone(diamondRates);

    let key = `${diamondVar.shape},${diamondVar.size},${diamondVar.grade}`;
    let obj = {};
    obj[key] = parseFloat(diamondVar.price);
    if (temp) {
      temp[key] = parseFloat(diamondVar.price);
    } else temp = obj;

    createDiamondPrice({
      variables: {
        diamondRate: JSON.stringify(temp),
      },
    });
  };

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

  if (!modalState) {
    return null;
  }

  return (
    <div className='modal absolute z-50 left-0 top-0 w-full  h-full bg-black/10 flex items-center justify-center'>
      <div className='flex flex-col items-center h-3/4 overflow-y-scroll  bg-white w-3/4 px-5  py-8 rounded-md'>
        <div className='h-10/12 overflow-y-scroll w-11/12 mx-auto'>
          {diamondShapes?.loading && <Spinner />}
          <div className='flex flex-wrap w-full justify-center gap-3'>
            <div className='w-full md:w-2/5  '>
              <SelectComponent
                name='diamond-shape'
                title='Select Diamond Shape *'
                placeholder='Select Diamond Shape '
                value={null}
                required={true}
                options={
                  diamondShapes?.loading
                    ? [{ value: null, label: "loading..." }]
                    : diamondShapes?.data?.attributes?.edges[0]?.node?.values.map(
                        (val) => ({ label: val?.name, value: val?.name })
                      )
                }
                handleChange={(e) => {
                  setDiamondVar({ ...diamondVar, shape: e });
                }}
              />
            </div>
            <div className='w-full md:w-2/5  '>
              <SelectComponent
                name='Grade'
                title='Select Grade *'
                placeholder='Select Grade '
                required={true}
                value={null}
                options={
                  diamondGrades?.loading
                    ? [{ value: null, label: "loading..." }]
                    : diamondGrades?.data?.attributes?.edges[0]?.node?.values.map(
                        (val) => ({ label: val?.name, value: val?.name })
                      )
                }
                handleChange={(e) => {
                  console.log(e);
                  setDiamondVar({
                    ...diamondVar,
                    grade: e,
                  });
                }}
              />
            </div>
            <div className='w-full md:w-2/5  '>
              <AutoCompleteComponent
                name='seive-size'
                title='Select Seive Size *'
                placeholder='Select Seive Size '
                value={null}
                required={true}
                options={
                  diamondSieves?.loading
                    ? [{ value: null, label: "loading..." }]
                    : diamondSieves?.data?.attributes?.edges[0]?.node?.values.map(
                        (val) => ({ label: val?.name, value: val?.name })
                      )
                }
                handleChange={(e) => {
                  console.log(e);
                  setDiamondVar({ ...diamondVar, size: e });
                }}
              />
            </div>
            <div className='w-full md:w-2/5  '>
              <InputComponent
                name='Price'
                title='Enter Price *'
                placeholder='Enter Price '
                required={true}
                defaultValue={null}
                handleChange={(e) => {
                  setDiamondVar({
                    ...diamondVar,
                    price: e.target.value,
                  });
                }}
              />
            </div>
          </div>
        </div>
        <div className='buttonDiv flex items-center justify-center w-full gap-3'>
          <button
            className='bg-red-500 text-white rounded-sm p-2 w-1/5 my-2'
            onClick={() => setModalState(false)}
          >
            Close
          </button>
          <button
            className='bg-indigo-500 text-white rounded-sm p-2 w-1/5 my-2 disabled:opacity-70'
            onClick={() => handleUpdate()}
            disabled={
              !diamondVar?.shape ||
              !diamondVar.size ||
              !diamondVar.grade ||
              !diamondVar.price
            }
          >
            {diamondcreatedPrice?.loading && <Loader />}
            Save
          </button>
        </div>
        <div className='errMsg font-bold text-lg text-red-600'>{error}</div>
      </div>
    </div>
  );
};

export default forwardRef(Modal);
