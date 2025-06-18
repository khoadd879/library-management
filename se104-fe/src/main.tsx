import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@ant-design/v5-patch-for-react-19";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "@/layout";
import { App as AntdApp } from "antd";
import "styles/global.css";
import { AppProvider } from "./components/context/app.context";
import HomePage from "./pages/manager/home";
import UserPage from "./pages/manager/list";
import AddUser from "./pages/manager/addUser";
import BorrowBook from "./pages/manager/borrow";
import ReceiveBook from "./pages/manager/receive";

import Chat from "./pages/manager/chat";
import UserLayout from "./userLayout";
import Favorite from "./pages/client/favorite";
import History from "./pages/client/history";
import ChatUser from "./pages/client/chatUser";
import AuthorPage from "./pages/client/author";
import UserHomepage from "./pages/client/homepage";
import FeaturedBooks from "./pages/client/featured";
import NewBooks from "./pages/client/newBook";
import BookDetailPage from "./pages/client/detail";
import SignIn from "@/pages/client/auth/signin";
import SignUp from "@/pages/client/auth/signup";
import ForgotPasswordPage from "./pages/client/auth/forgot";
import VerificationCodePage from "./pages/client/auth/verification";
import NewPasswordPage from "./pages/client/auth/newPass";
import ProtectedRoute from "@/components/auth/protected";
import Profile from "./pages/client/profile";
import AuthorInfo from "./pages/client/authorInfo";
import AdminLayout from "./adminLayout";
import RolePermissionUI from "./pages/admin/userprofile";
import UserList from "./pages/admin/userList";
import Report from "./pages/manager/report";
import Parameter from "./pages/manager/parameter";
const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <UserLayout />,
        children: [
          { index: true, element: <UserHomepage /> },
          { path: "user", element: <UserHomepage /> },
          { path: "favorites", element: <Favorite /> },
          { path: "history", element: <History /> },
          { path: "payment", element: <div>Thanh toán tiền phạt</div> },
          { path: "chat", element: <ChatUser /> },
          { path: "author", element: <AuthorPage /> },
          { path: "featured", element: <FeaturedBooks /> },
          { path: "new-books", element: <NewBooks /> },
          { path: "detail/:id", element: <BookDetailPage /> },
          { path: "profile", element: <Profile /> },
          { path: "authorInfo/:id", element: <AuthorInfo /> },
        ],
      },
    ],
  },
  {
    path: "/manager",
    element: <ProtectedRoute />,
    children: [
      {
        path: "/manager",
        element: <Layout />,
        children: [
          { index: true, element: <HomePage /> },
          { path: "list", element: <UserPage /> },
          { path: "add", element: <AddUser /> },
          { path: "borrow", element: <BorrowBook /> },
          { path: "receive", element: <ReceiveBook /> },
          { path: "chat", element: <Chat /> },
          { path: "profile", element: <Profile /> },
          { path: "report", element: <Report /> },
          { path: "parameter", element: <Parameter /> },
        ],
      },
    ],
  },
  {
    path: "/admin",
    element: <ProtectedRoute />,
    children: [
      {
        path: "/admin",
        element: <AdminLayout />,
        children: [
          { index: true, element: <RolePermissionUI /> },
          { path: "roles", element: <RolePermissionUI /> },
          { path: "users", element: <UserList /> },
          { path: "roles", element: <RolePermissionUI /> },
        ],
      },
    ],
  },
  { path: "/signin", element: <SignIn /> },
  { path: "/signup", element: <SignUp /> },
  { path: "/forgot", element: <ForgotPasswordPage /> },
  { path: "/verification", element: <VerificationCodePage /> },
  { path: "/new-pass", element: <NewPasswordPage /> },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AntdApp>
      <AppProvider>
        <RouterProvider router={router} />
      </AppProvider>
    </AntdApp>
  </StrictMode>
);
