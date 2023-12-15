import React, { useEffect, useState } from "react";

import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { message } from "antd";
import { useMutation } from "@apollo/client";

import { CREATE_TOKEN } from "../GraphQl/Mutations";
import { logOut, setUserDetails } from "../functions";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [visiblePassword, setVisiblePassword] = useState(false);

  const [authDetails, setAuthDetails] = useState({
    phoneNumber: "+919510321680",
    password: null,
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
  const handleSubmit = (e) => {
    e.preventDefault();
    setTrial("Logging in...");
    if (
      authDetails?.password == "" ||
      authDetails?.phoneNumber == "" ||
      authDetails?.password == null ||
      authDetails?.phoneNumber == null
    )
      setError("Please enter credentials");
    else handleLogin();
  };

  const [handleLogin, { loading }] = useMutation(CREATE_TOKEN, {
    variables: {
      phoneNumber: authDetails?.phoneNumber,
      password: authDetails?.password,
    },
    onCompleted: (data) => {
      if (data?.tokenCreate?.errors?.length > 0)
        setError(data?.tokenCreate?.errors[0]?.message);
      else if (data?.tokenCreate?.user) {
        setSuccess("Logged in!");
        let tempUser = data?.tokenCreate;
        if (tempUser?.user?.firstName == "") tempUser.user.firstName = "John";
        if (tempUser?.user?.lastName == "") tempUser.user.lastName = "Doe";
        setUserDetails(JSON.stringify(tempUser));
        setTimeout(() => {
          navigate("/dashboard");
        }, 100);
      }
    },
    onError: (err) => {
      console.log(err);
      setError(err?.message);
    },
  });

  useEffect(() => {
    logOut();
  }, []);
  return (
    <section className="flex flex-col items-center justify-center w-screen h-screen bg-gray-200 text-gray-700">
      {contextHolder}
      <form
        className="flex flex-col bg-white rounded shadow-lg p-12 mt-12"
        onSubmit={handleSubmit}
      >
        <label className="font-semibold text-xs" for="usernameField">
          Phone Number
        </label>
        <input
          className="flex items-center h-12 px-4 w-64 bg-gray-200 ::place text-slate-800 mt-2 rounded focus:outline-none focus:ring-2 "
          placeholder="Enter your phone number"
          defaultValue="+919510321680"
          style={{ backgroundColor: "#eee", color: "#000" }}
          type="text"
          onChange={(e) =>
            setAuthDetails({ ...authDetails, phoneNumber: e.target.value })
          }
        />
        <label className="font-semibold text-xs mt-3" for="passwordField">
          Password
        </label>
        <div className="relative flex items-center">
          <input
            className="flex items-center h-12 px-4 w-64 bg-gray-200 text-slate-800 mt-2 rounded focus:outline-none focus:ring-2"
            style={{ backgroundColor: "#eee", color: "#000" }}
            placeholder="Enter your password"
            type={visiblePassword ? "text" : "password"}
            onChange={(e) =>
              setAuthDetails({ ...authDetails, password: e.target.value })
            }
          />
          <span
            className="absolute right-3 cursor-pointer"
            onClick={() => setVisiblePassword((prev) => !prev)}
          >
            {visiblePassword ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
          </span>
        </div>
        <button className="flex items-center justify-center h-12 px-6 w-64 bg-blue-600 mt-8 rounded font-semibold text-sm text-blue-100 hover:bg-blue-700">
          Login
        </button>
        <div className="flex mt-6 justify-center text-xs">
          <a className="text-blue-400 hover:text-blue-500" href="#">
            Forgot Password
          </a>
        </div>
      </form>
    </section>
  );
};

export default Login;
