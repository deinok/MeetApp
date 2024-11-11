import React from "react";
import { RequireAuth } from "react-auth-kit";
import { Route, Routes } from "react-router-dom";
import { BrowserView, MobileView, isBrowser, isMobile } from 'react-device-detect';
import { LoginPage } from "./pages/login/LoginPage";
import { RegisterPage } from "./pages/login/RegisterPage";
import AppLayout from "./layout/MainLayout";
import './i18n'; 
import NoPermissionPage from "./pages/noPermissionPage/NoPermissionPage";
import MainPage from "./pages/main/MainPage";
import { OffersPage } from "./pages/offers/OffersPage";
import StatsPage from "./pages/stats/statsPage";
import MobileMainLayout from "./layout/mobileLayout/MobileMainLayout";
import MobileMainPage from "./pages/mobile/mobileMainPage";
import ActivitiesMobilePage from "./pages/mobile/activitiesMobilePage/ActivitiesMobilePage";

const MobileLoginPage = () => <h1>Bienvenido a la versión móvil</h1>;

function App() {
  return (
    <Routes>
      <Route path="/login" element={isMobile ? <MobileMainLayout><MobileLoginPage /></MobileMainLayout> : <LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="/activities" element={isMobile ? <MobileMainLayout><ActivitiesMobilePage /> </MobileMainLayout>: <NoPermissionPage /> } />
      
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
