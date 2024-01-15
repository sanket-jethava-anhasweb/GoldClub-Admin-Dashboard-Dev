import React from "react";
import { Input, Tooltip } from "antd";
const { TextArea } = Input;
const TextAreaComponent = (props) => {
  return (
    <>
      <label
        htmlFor={props?.title}
        className="font-semibold dark:text-slate-300 text-sm"
      >
        {props?.title}
      </label>
      <TextArea
        autoSize
        // showCount={props?.showCount || false}
        maxLength={props?.maxLength}
        onChange={props?.handleChange}
        id={props?.title}
        placeholder={props?.placeholder}
        className={
          "m-2 dark:bg-slate-700 border-white/50 dark:text-white dark:placeholder:text-white rounded-md" +
          " " +
          props?.className
        }
        required={props?.required}
      />
    </>
  );
};

export default TextAreaComponent;
