import React, { useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import Layout from "../pages/dashboard/Layout";
import Nav from "../components/NavBar/Nav";
import { useSelector } from "react-redux";
import { setLogged } from "../functions";
// import { ROLES } from "../constants/RoleConstants";
const Main = ({ role }) => {
  const navigate = useNavigate();
  const sideNav = useSelector((state) => state?.client?.sideNavOpen);
  useEffect(() => {
    setLogged();
  }, []);
  return (
    <section className='flex items-start justify-start max-h-screen overflow-y-scroll bg-[#f5f5f5] dark:bg-[#001529] duration-150 dark:text-white'>
      <Nav role={role} />
      <section
        className={
          "mainWrapper duration-200 px-4 w-full h-screen overflow-y-scroll"
        }
      >
        <>
          {<Outlet /> || (
            <div>
              {" "}
              <center>Welcome to admin dashboard</center>
              <div>
                <Link to='/login'>Login here</Link>
              </div>
            </div>
          )}
        </>
      </section>
    </section>
  );
};

export default Main;
