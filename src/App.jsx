import "./index.css"
import {Routes, Outlet, Route } from "react-router-dom"
import { NavBar } from "./components/Nav/NavBar"

export const App = () => {
  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <>
            <NavBar/>
            <Outlet/>
          </>
        }
      >
        <Route index element={<AllOrders />}/>
          <Route index element={<OrderList/>}/>
          <Route path=":orderId" element={<OrderDetails/>} />
      </Route>
    </Routes>
    )
  }
