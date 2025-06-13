import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@ant-design/v5-patch-for-react-19";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "@/layout";
import { App as AntdApp } from "antd";
import "styles/global.css";
import { AppProvider } from "./components/context/app.context";
import HomePage from "./pages/admin/home";
import UserPage from "./pages/admin/list";
import AddUser from "./pages/admin/addUser";
import BorrowBook from "./pages/admin/borrow";
import ReceiveBook from "./pages/admin/receive";
import Report from "./pages/admin/report";
import Chat from "./pages/admin/chat";
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
import UserProfile from "./pages/admin/userprofile";
import BookList from "./components/admin/listPage/BookList";
import AuthorInfo from "./pages/client/authorInfo";
import List from "./pages/admin/list";
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
    path: "/admin",
    element: <ProtectedRoute />,
    children: [
      {
        path: "/admin",
        element: <Layout />,
        children: [
          { index: true, element: <HomePage /> },
          { path: "list", element: <UserPage /> },
          { path: "add", element: <AddUser /> },
          { path: "borrow", element: <BorrowBook /> },
          { path: "receive", element: <ReceiveBook /> },
          { path: "report", element: <Report /> },
          { path: "chat", element: <Chat /> },
          { path: "profile", element: <Profile /> },
        ],
      },
    ],
  },
  { path: "/signin", element: <SignIn /> },
  { path: "/signup", element: <SignUp /> },
  { path: "/forgot", element: <ForgotPasswordPage /> },
  { path: "/verification", element: <VerificationCodePage /> },
  { path: "/new-pass", element: <NewPasswordPage /> },
  {
    path: "/test-admin",
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "userprofile", element: <UserProfile /> },
      { path: "booklist", element: <BookList /> },
      { path: "list", element: <List /> },
      { path: "authorInfo/:id", element: <AuthorInfo /> },
    ],
  },
  {
    path: "/test-user",
    element: <UserLayout />,
    children: [
      { index: true, element: <UserHomepage /> },
      { path: "profile", element: <Profile /> },
    ],
  },
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
