 import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import InputComponent from "../Inputs/Input";
import AutoCompleteComponent from "../Inputs/AutoComplete";
import { useLazyQuery, useMutation } from "@apollo/client";

import Spinner from "../Spinner/Spinner";
import SelectComponent from "../Inputs/Select";

import Loader from "../Spinner/Loader";

const Modal = (props, ref) => {
  const [modalState, setModalState] = useState(false);
  const [orderVar, setOrderVar] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [transactionProof, setTransactionProof] = useState(null);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState("");
  // const []
  useImperativeHandle(ref, () => ({
    openModal: () => setModalState(true),
  }));
  useEffect(() => {
    setOrderVar(() => props?.order);
    setPaymentStatus(() => props?.order?.node?.paymentStatus);
    setStatus(() => props?.order?.node?.status);
    setTransactionProof(() => props?.order?.node?.transactionProof)
  }, [props]);

  if (!modalState) {
    return null;
  }

  return (
    <div className='modal absolute z-50 left-0 top-0 w-full  h-full bg-black/10 dark:bg-black/80 flex items-center justify-center'>
      <div className='flex flex-col items-center h-auto overflow-y-scroll  bg-white dark:bg-slate-700 w-3/4 px-5  py-8 rounded-md'>
        <div className='h-10/12 overflow-y-scroll w-11/12 mx-auto'>
          <div className='flex flex-wrap w-full justify-center gap-3'>
            {/* {JSON.stringify(orderVar?.node?.paymentStatus)} */}
            <div className='w-full md:w-2/5  '>
              <img src={transactionProof} height="100" width="100"/>
              <SelectComponent
                name='Payment Status'
                title='Select Payment *'
                placeholder='Select Payment '
                value={paymentStatus ?? props?.order?.node?.paymentStatus}
                required={true}
                options={[
                  { label: "NOT_CHARGED", value: "NOT_CHARGED" },
                  { label: "PENDING", value: "PENDING" },
                  { label: "FULLY_CHARGED", value: "FULLY_CHARGED" },
                  { label: "PARTIALLY_CHARGED", value: "PARTIALLY_CHARGED" },
                  { label: "PARTIALLY_REFUNDED", value: "PARTIALLY_REFUNDED" },
                  { label: "PARTIALLY_REFUNDED", value: "PARTIALLY_REFUNDED" },
                  { label: "REFUSED", value: "REFUSED" },
                  { label: "CANCELLED", value: "CANCELLED" },
                ]}
                handleChange={(e) => {
                  setPaymentStatus(e);
                }}
              />
            </div>
            <div className='w-full md:w-2/5  '>
              <SelectComponent
                name='Status'
                title='Select Status *'
                placeholder='Select Status '
                value={status ?? props?.order?.node?.status}
                required={true}
                options={[
                  { label: "DRAFT", value: "DRAFT" },
                  { label: "UNFULFILLED", value: "UNFULFILLED" },
                  {
                    label: "PARTIALLY_FULFILLED",
                    value: "PARTIALLY_FULFILLED",
                  },
                  { label: "FULFILLED", value: "FULFILLED" },
                  { label: "CANCELLED", value: "CANCELLED" },
                ]}
                handleChange={(e) => {
                  setStatus(e);
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
            onClick={() => {}}
          >
            {/* {<Loader />} */}
            Save
          </button>
        </div>
        <div className='errMsg font-bold text-lg text-red-600'>{error}</div>
      </div>
    </div>
  );
};

export default forwardRef(Modal);
