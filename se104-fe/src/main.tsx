import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "@/layout";
import BookPage from "pages/client/book";
import LoginPage from "pages/client/auth/login";
import RegisterPage from "pages/client/auth/register";
import { App } from "antd";
import "styles/global.css";
import { AppProvider } from "./components/context/app.context";
import HomePage from "./pages/client/home";
import UserPage from "./pages/client/user";
import AddUser from "./pages/client/addUser";
const router = createBrowserRouter([
  {
    path: "/",
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
