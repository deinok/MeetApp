import React from "react";
import { RequireAuth } from "react-auth-kit";
import { Route, Routes } from "react-router-dom";
import { ProfilePage } from "./pages/profile/ProfilePage";
import { LoginPage } from "./pages/login/LoginPage";
import { RegisterPage } from "./pages/login/RegisterPage";
import AppLayout from "./layout/MainLayout";
import './i18n'; 
import NoPermissionPage from "./pages/noPermissionPage/NoPermissionPage";
import MainPage from "./pages/main/MainPage";
import { OffersPage } from "./pages/offers/OffersPage";
import StatsPage from "./pages/stats/statsPage";
import { BrowserView, MobileView, isBrowser, isMobile } from 'react-device-detect';
import MobileMainLayout from "./layout/mobileLayout/MobileMainLayout";
import MobileLoginPage from "./pages/mobile/login/mobileLoginPage";
import MobileMainPage from "./pages/mobile/main/mobileMainPage";

function App() {
  return (
    <Routes>
      <Route path="/login" element={isMobile ? <MobileLoginPage /> : <LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      
      <Route
        path="/"
        element={
          // <RequireAuth loginPath="/login">
          isMobile ? <MobileMainLayout><MobileMainPage /></MobileMainLayout>:
            <AppLayout>
              <MainPage />
            </AppLayout>
          // </RequireAuth>
        }
      />
      
      <Route path="*" element={<NoPermissionPage />} />
      <Route
        path="/profile"
        element={
          <RequireAuth loginPath="/login">
            <AppLayout>
              <ProfilePage />
            </AppLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/offers"
        element={
          <RequireAuth loginPath="/login">
            <AppLayout>
              <OffersPage />
            </AppLayout>
          </RequireAuth>
        }
      />

      <Route
        path="/stats"
        element={
          <RequireAuth loginPath="/login">
            <AppLayout>
              <StatsPage />
            </AppLayout>
          </RequireAuth>
        }
      />
    </Routes>
  );
}

export default App;
