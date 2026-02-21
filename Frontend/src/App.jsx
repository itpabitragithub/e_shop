import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { Button } from "./components/ui/button"
import Home from "./pages/Home"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Signup from "./pages/Signup"
import Login from "./pages/Login"
import Verify from "./pages/Verify"
import VerifyEmail from "./pages/VerifyEmail"
import Profile from "./pages/Profile"
import Products from "./pages/Products"
import Cart from "./pages/Cart"
import Dashboard from "./pages/Dashboard"
import AdminSales from "./pages/admin/AdminSales"
import AddProduct from "./pages/admin/AddProduct"
import AdminProduct from "./pages/admin/AdminProduct"
import ShowUsersOrders from "./pages/admin/ShowUsersOrders"
import AdminUsers from "./pages/admin/AdminUsers"
import UserInfo from "./pages/admin/UserInfo"
import ProtectedRoutes from "./components/ProtectedRoutes"
import SingleProduct from "./pages/admin/SingleProduct"
import AdminOrders from "./pages/admin/AdminOrders"
import AddressForm from "./pages/AddressForm"
import OrderSuccess from "./pages/OrderSuccess"
import MyOrder from "./pages/MyOrder"

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6">
      <h1 className="text-4xl font-bold text-gray-800">404</h1>
      <p className="text-gray-600">Page not found</p>
      <Button asChild variant="outline">
        <a href="/">Go to Home</a>
      </Button>
    </div>
  )
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <><Navbar /><Home/><Footer /></>
  },
  {
    path: "/signup",
    element: <><Signup /></>
  },
  {
    path: "/login",
    element: <><Login /></>
  },
  {
    path: "/admin/login",
    element: <><Login defaultUserType="admin" /></>
  },
  {
    path: "/verify",
    element: <><Verify /></>
  },
  {
    path: "/verify/:token",
    element: <><VerifyEmail /></>
  },
  {
    path: "/profile/:userId",
    element: <ProtectedRoutes userOnly><Navbar /><Profile /></ProtectedRoutes>
  },
  {
    path: "/products",
    element: <><Navbar /><Products /></>
  },
  {
    path: "/products/:Id",
    element: <><Navbar /><SingleProduct /></>
  },
  {
    path: "/cart",
    element: <ProtectedRoutes userOnly><Navbar /><Cart /></ProtectedRoutes>,
  },
  {
    path: "/address",
    element: <ProtectedRoutes userOnly><AddressForm /></ProtectedRoutes>,
  },
  {
    path: "/order-success",
    element: <ProtectedRoutes userOnly><OrderSuccess /></ProtectedRoutes>,
  },
  {
    path: "/orders",
    element: <ProtectedRoutes userOnly><Navbar /><MyOrder /><Footer /></ProtectedRoutes>,
  },
  {
    path: "/dashboard",
    element: <ProtectedRoutes adminOnly={true}><Navbar /><Dashboard /></ProtectedRoutes>,
    children: [
      {
        path: "sales",
        element: <AdminSales />,
      },
      {
        path: "add-product",
        element: <AddProduct />,
      },
      {
        path: "products",
        element: <AdminProduct />,
      },
      {
        path: "orders",
        element: <AdminOrders />,
      },
      {
        path: "users/orders/:userId",
        element: <ShowUsersOrders />,
      },
      {
        path: "users",
        element: <AdminUsers />,
      },
      {
        path: "users/:Id",
        element: <UserInfo />,
      },
    ]
  },
  {
    path: "*",
    element: <NotFound />,
  }
])

function App() {

  return (
    <>
    <RouterProvider router={router} />
    </>
  )
}

export default App
