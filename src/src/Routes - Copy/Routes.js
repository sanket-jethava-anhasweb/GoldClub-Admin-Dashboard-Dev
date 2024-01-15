import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import RequireAuth from "../components/RequireAuth";
import { roles } from "../constants/Roles";
import Main from "../pages/Main";
import B2B from "../pages/dashboard/B2B/B2B";
import Prices from "../pages/dashboard/B2B/Prices";
import AddProduct from "../pages/dashboard/B2B/AddProduct";
import AppBanners from "../pages/dashboard/B2B/AppBanners";
import Tenants from "../pages/dashboard/B2C/Tenants";
import TenantDetails from "../pages/dashboard/B2C/TenantDetails";
import TenantAnalytics from "../pages/dashboard/B2C/TenantAnalytics";
import TenantCustomers from "../pages/dashboard/B2C/TenantCustomers";
import TenantDesigns from "../pages/dashboard/B2C/TenantDesigns";
import Dashboard from "../pages/dashboard";
import Login from "../pages/Login";
import Profile from "../pages/Profile";
import AllProducts from "../pages/dashboard/B2B/AllProducts";
import ProductDetails from "../pages/dashboard/B2B/ProductDetails";
import VariantCreator from "../pages/dashboard/B2B/VariantCreator";
import EditProduct from "../pages/dashboard/B2B/EditProduct";
import ProductImages from "../pages/dashboard/B2B/ProductImages";
import OrderList from "../pages/dashboard/B2B/Orders/OrderList";
import DraftOrderList from "../pages/dashboard/B2B/Orders/Draftorder";
import Collections from "../pages/dashboard/B2B/Collections";
import AllManufacturers from "../pages/dashboard/B2B/Manufacturers/AllManufacturers";
import CreateManufacturer from "../pages/dashboard/B2B/Manufacturers/CreateManufacturer";
import AllCategories from "../pages/dashboard/B2B/Category/AllCategories";
import SingleCategory from "../pages/dashboard/B2B/Category/SingleCategory";
import SingleManufacturer from "../pages/dashboard/B2B/Manufacturers/SingleManufacturer";
import SingleSubCategory from "../pages/dashboard/B2B/Category/SingleSubCategory";
import AssignSubCategory from "../pages/dashboard/B2B/Manufacturers/AssignSub";
import Manufactuers from "../pages/dashboard/B2B/Prices/Manufactuers";
import Gemstone from "../pages/dashboard/B2B/Prices/Gemstone";
import SubCategory from "../pages/dashboard/B2B/Prices/SubCategory";
import NewOrder from "../pages/dashboard/B2B/Orders/NewOrder";
import VariantEditor from "../pages/dashboard/B2B/VariantEditor";
import AssignCategory from "../pages/dashboard/B2B/Category/AssignCat";
import SubcategoryPricing from "../pages/dashboard/B2B/Prices/SubCategory";

function RoutesPath() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Navigate to="/dashboard" />
          // <>
          //   <Link to="/dashboard">dashboard</Link>
          //   <Link to="/calender">calender</Link>
          //   <Link to="/customer">customer</Link>
          // </>
        }
        exact
      />
      <Route path="/unauthorized" element={<>unauthorized</>} />
      <Route path="/login" element={<Login />} />
      <Route element={<RequireAuth allowedRoles={[roles.ADMIN]} />}>
        <Route path="dashboard" element={<Main />}>
          <Route path="" element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="b2b" >
            <Route path="" element={<Navigate to="add-product" />} />
            <Route path="add-product" element={<AddProduct />} />
            <Route path="products" element={<AllProducts />} />
            <Route path="products/:id" element={<ProductDetails />} />
            <Route path="products/:id/upload" element={<ProductImages />} />
            <Route path="products/:id/edit" element={<EditProduct />} />
            <Route path="products/:id/variant-creator" element={<VariantCreator />} />
            <Route path="products/:id/variant-edit" element={<VariantEditor />} />
            <Route path="categories" element={<AllCategories />} />
            <Route path="categories/:id" element={<SingleCategory />} />
            <Route path="sub-categories/:id" element={<SingleSubCategory />} />

            <Route path="manufacturers" element={<AllManufacturers />} />
            <Route path="manufacturers/:id" element={<SingleManufacturer />} />
            <Route path="manufacturers/assign/:id" element={<AssignSubCategory />} />
            <Route path="create-manufacturers" element={<CreateManufacturer />} />


            <Route path="collections" element={<Collections />} />
            <Route path="price" element={<Prices />} />
            <Route path="manufacturer_price" element={<Manufactuers />} />
            <Route path="gemstone_price" element={<Gemstone />} />
            <Route path="subcategory_price" element={<SubCategory />} />
            <Route path="subcategory_assign" element={<AssignCategory />} />
            <Route path="subcategory_prices" element={<SubcategoryPricing />} />





            <Route path="orders" element={<OrderList />} />
            <Route path="draft-orders" element={<DraftOrderList />} />
            <Route path="new-order" element={<NewOrder />} />
            <Route path="app-banners" element={<AppBanners />} />
          </Route>
          <Route path="b2c">
            <Route path="" element={<Navigate to="tenants" />} />
            <Route path="tenants" element={<Tenants />} />
            <Route path="tenant-details" element={<TenantDetails />} />
            <Route path="tenant-details/:id" element={<TenantDetails />} />
            <Route path="tenant-analytics/:id" element={<TenantAnalytics />} />
            <Route path="tenant-customers/:id" element={<TenantCustomers />} />
            <Route path="tenant-designs/:id" element={<TenantDesigns />} />
          </Route>

          <Route path="access" element={<>access</>} />
          <Route path="admin" element={<>admin</>} />
        </Route>
      </Route>
      <Route path="*" element={<>404 not found</>} />
    </Routes>
  );
}

export default RoutesPath;
