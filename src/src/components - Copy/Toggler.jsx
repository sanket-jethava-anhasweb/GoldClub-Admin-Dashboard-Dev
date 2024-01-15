import { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setDarkTheme, setLightTheme } from "../redux/actions/client";
import { BulbOutlined, BulbFilled } from "@ant-design/icons";
const Toggler = () => {
  const theme = useSelector((state) => state?.client?.themeLight);
  const dispatch = useDispatch();
  const toggleTheme = () => {
    if (theme) dispatch(setDarkTheme());
    else dispatch(setLightTheme());
  };
  return (
    <div className="p-3">
      <input
        type="checkbox"
        className="checkbox "
        id="checkbox"
        onChange={toggleTheme}
      />
      <label for="checkbox" className="checkbox-label dark:bg-slate-500">
        <BulbOutlined className="text-white" />
        <BulbFilled className="text-white dark:text-slate-900" />
        <span className="ball dark:bg-slate-900"></span>
      </label>
    </div>
  );
};

export default memo(Toggler);
