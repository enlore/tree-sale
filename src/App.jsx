import "./index.css"
import {Routes, Outlet, Route } from "react-router-dom"
import { NavBar } from "./components/Nav/NavBar"
import { AllOrders } from "./components/Orders/AllOrders"
import { OrderDetails } from "./components/Orders/orderDetails"
import { Sales } from "./components/Orders/Sales"
import { Authorized } from "./components/Auth/Authorized"
import { Login } from "./components/Auth/Login"

export const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <Authorized>
            <NavBar/>
            <Outlet/>
          </Authorized>
        }
      >
        <Route index element={<AllOrders pageTitle="All Orders" />} />
        <Route path="pending" element={<AllOrders statusFilter="PENDING" pageTitle="Pending Orders" />} />
        <Route path="fulfilled" element={<AllOrders statusFilter="FULFILLED" pageTitle="Fulfilled Orders" />} />
        <Route path="order/:orderId" element={<OrderDetails />} />
        <Route path="sales" element={<Sales />} />
      </Route>
    </Routes>
    )
  }
