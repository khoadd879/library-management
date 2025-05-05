import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "@/layout";
import BookPage from "@/pages/admin/book";
import LoginPage from "pages/client/auth/login";
import RegisterPage from "pages/client/auth/register";
import { App } from "antd";
import "styles/global.css";
import { AppProvider } from "./components/context/app.context";
import HomePage from "./pages/admin/home";
import UserPage from "./pages/admin/user";
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
const router = createBrowserRouter([
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
      { path: "detail", element: <BookDetailPage /> },
    ],
  },
  {
    path: "/admin",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "book",
        element: <BookPage />,
      },
      {
        path: "list",
        element: <UserPage />,
      },
      {
        path: "add",
        element: <AddUser />,
      },
      {
        path: "borrow",
        element: <BorrowBook />,
      },
      {
        path: "receive",
        element: <ReceiveBook />,
      },
      {
        path: "report",
        element: <Report />,
      },
      {
        path: "chat",
        element: <Chat />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App>
      <AppProvider>
        <RouterProvider router={router} />
      </AppProvider>
    </App>
  </StrictMode>
);
