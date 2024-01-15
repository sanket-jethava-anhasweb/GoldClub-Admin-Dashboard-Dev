import React from "react";
import { InputNumber } from "antd";
const NumberInputComponent = (props) => {
  return (
    <section className='flex flex-col items-start'>
      <label
        htmlFor={props?.title}
        className='font-semibold dark:text-slate-300 text-sm'
      >
        {props?.title}
      </label>
      <InputNumber
        defaultValue={props?.value || "0"}
        placeholder={props?.placeholder}
        className={
          "antdNumber rounded-sm w-full md:w-4/5 dark:bg-slate-700 border-white/50 dark:placeholder:text-white dark:text-white m-2 " +
          " " +
          props?.className
        }
        value={props?.defaultValue || 0}
        addonBefore={props?.addonBefore || <>₹</>}
        controls={false}
        onChange={props?.handleChange}
        required={props?.required}
      />
    </section>
  );
};

export default NumberInputComponent;
