import React from "react";
import { RequireAuth } from "react-auth-kit";
import { Route, Routes } from "react-router-dom";
import { LoginPage } from "./pages/login/LoginPage";
import { MainPage } from "./pages/main/MainPage";
import { RegisterPage } from "./pages/login/ResgisterPage";
import AppLayout from "./layout/MainLayout";
import './i18n'; 

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/"
        element={
          <RequireAuth loginPath="/login">
            <AppLayout>
              <MainPage />
            </AppLayout>
          </RequireAuth>
        }
      />
    </Routes>
  );
}

export default App;
