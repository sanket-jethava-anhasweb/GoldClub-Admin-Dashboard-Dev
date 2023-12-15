import React, { useEffect } from "react";
import {
  LaptopOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  KeyOutlined,
  UnlockOutlined,
  ProfileOutlined,
  LogoutOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Layout, Menu, theme } from "antd";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  closeSideNav,
  openSideNav,
  setDarkTheme,
  setLightTheme,
  validateUser,
} from "../../redux/actions/client";
import Toggler from "../Toggler";
import { checkLogged, setLogged } from "../../functions";
const Nav = ({ role }) => {
  function getItem(label, key, icon, children, type) {
    return {
      key,
      icon,
      children,
      label,
      type,
    };
  }
  const navItems = [
    getItem(<NavLink to='/dashboard'>Home</NavLink>, "Home", <HomeOutlined />),
    getItem(
      <NavLink to='/dashboard/b2b'>B2B</NavLink>,
      "1",
      <LaptopOutlined />,
      [
        getItem(
          "Products",
          "g1",
          null,
          [
            getItem(
              <NavLink to='/dashboard/b2b/add-product'>Add Product</NavLink>,
              "add-product"
            ),
            getItem(
              <NavLink to='/dashboard/b2b/products'>View Product</NavLink>,
              "view-product"
            ),
          ],
          "group"
        ),
        getItem(
          "Manufacturers",
          "m1",
          null,
          [
            getItem(
              <NavLink to='/dashboard/b2b/manufacturers'>
                All Manufacturers
              </NavLink>,
              "manufacturers"
            ),
            getItem(
              <NavLink to='/dashboard/b2b/create-manufacturers'>
                Create Manufacturer
              </NavLink>,
              "create-manufacturers"
            ),
          ],
          "group"
        ),
        getItem(
          "Categories",
          "g-categories",
          null,
          [
            getItem(
              <NavLink to='/dashboard/b2b/categories'>Categories</NavLink>,
              "categories-1"
            ),
            // getItem(
            //   <NavLink to="/dashboard/b2b/metal-prices">Metal Prices</NavLink>,
            //   "3"
            // ),
          ],
          "group"
        ),
        getItem(
          "Prices",
          "g2",
          null,
          [
            getItem(
              <NavLink to='/dashboard/b2b/price'>MCX Rates</NavLink>,
              "price_1"
            ),
            getItem(
              <NavLink to='/dashboard/b2b/manufacturer_price'>
                Manufacturers
              </NavLink>,
              "price_2"
            ),
            getItem(
              <NavLink to='/dashboard/b2b/gemstone_price'>Gemstone</NavLink>,
              "price_3"
            ),
            getItem(
              <NavLink to='/dashboard/b2b/subcategory_price'>
                Subcategory
              </NavLink>,
              "price_4"
            ),
            // getItem(
            //   <NavLink to="/dashboard/b2b/metal-prices">Metal Prices</NavLink>,
            //   "3"
            // ),
          ],
          "group"
        ),
        getItem(
          "Orders",
          "orders-g3",
          null,
          [
            getItem(
              <NavLink to='/dashboard/b2b/orders'>Orders</NavLink>,
              "order-1"
            ),
            getItem(
              <NavLink to='/dashboard/b2b/draft-orders'>Draft Orders</NavLink>,
              "order-2"
            ),
          ],
          "group"
        ),
        getItem(
          "Content",
          "g3",
          null,
          [
            getItem(
              <NavLink to='/dashboard/b2b/app-banners'>App Banners</NavLink>,
              "banners"
            ),
            getItem(
              <NavLink to='/dashboard/b2b/collections'>Collections</NavLink>,
              "collection"
            ),
          ],
          "group"
        ),
      ]
    ),

    {
      key: `B2C`,
      icon: React.createElement(UserOutlined),
      label: <NavLink to='/dashboard/b2c'>B2C</NavLink>,
    },
    // {
    //   key: `Access`,
    //   icon: React.createElement(KeyOutlined),
    //   label: <NavLink to='/dashboard/access'>Access</NavLink>,
    // },
    // {
    //   key: `Admin`,
    //   icon: React.createElement(UnlockOutlined),
    //   label: <NavLink to='/dashboard/admin'>Admin</NavLink>,
    // },
    // {
    //   key: `Profile`,
    //   icon: React.createElement(ProfileOutlined),
    //   label: <NavLink to='/dashboard/profile'>Profile</NavLink>,
    // },
    {
      key: `Auth`,
      icon: React.createElement(LogoutOutlined),
      label: <NavLink to='/login'>Logout</NavLink>,
    },
  ];
  const sideNav = useSelector((state) => state?.client?.sideNavOpen);
  const theme = useSelector((state) => state?.client?.themeLight);
  const dispatch = useDispatch();
  const toggleNav = () => {
    if (sideNav) dispatch(closeSideNav());
    else dispatch(openSideNav());
  };

  useEffect(() => {
    if (checkLogged());
    validateUser(); // validates user
  }, []);
  return (
    <>
      <section
        className={
          "h-screen bg-slate-50  flex flex-col items-center transition duration-150 dark:bg-slate-800  " +
          (sideNav ? "sideNav" : " ")
        }
      >
        {" "}
        <div
          className={
            `navButton  p-4 rounded-full cursor-pointer flex items-center justify-center z-[9999] duration-150 
             `
            // +            (!sideNav ? "translate-x-[150px]" : "translate-x-0")
          }
          onClick={toggleNav}
        >
          {sideNav ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
        </div>
        <Menu
          mode='inline'
          defaultSelectedKeys={["1"]}
          defaultOpenKeys={["sub1"]}
          className={
            (sideNav ? "px-4" : "") +
            " " +
            "bg-[#eee] h-full w-full duration-150 dark:bg-slate-800 h-[100dvh] overflow-y-scroll"
          }
          theme={theme ? "light" : "dark"}
          inlineCollapsed={!sideNav}
          items={navItems}
        />
        <Toggler />
      </section>
    </>
  );
};

export default Nav;
