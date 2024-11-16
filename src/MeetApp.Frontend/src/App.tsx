import React from "react";
import { RequireAuth } from "react-auth-kit";
import { Route, Routes } from "react-router-dom";
import { ProfilePage } from "./pages/web/profile/ProfilePage";
import { LoginPage } from "./pages/web/login/LoginPage";
import { RegisterPage } from "./pages/web/register/RegisterPage";
import AppLayout from "./pages/web/layout/MainLayout";
import './i18n'; 
import NoPermissionPage from "./pages/web/noPermissionPage/NoPermissionPage";
import MainPage from "./pages/web/main/MainPage";
import { OffersPage } from "./pages/web/offers/OffersPage";
import StatsPage from "./pages/web/stats/statsPage";
import { BrowserView, MobileView, isBrowser, isMobile } from 'react-device-detect';
import MobileMainLayout from "./pages/mobile/layout/MobileMainLayout";
import MobileLoginPage from "./pages/mobile/login/mobileLoginPage";
import MobileRegisterPage from "./pages/mobile/register/mobileRegisterPage";
import MobileMainPage from "./pages/mobile/main/mobileMainPage";
import MobileActivitiesPage from "./pages/mobile/activities/mobileActivitiesPage";
import ChatPageMobile from "./pages/mobile/chatPage/chatPageMobile";

function App() {
  return (
    <Routes>
      <Route path="/login" element={isMobile ? <MobileLoginPage /> : <LoginPage />} />
      <Route path="/register" element={isMobile ? <MobileRegisterPage /> : <RegisterPage />} />

      <Route path="/activities" element={isMobile ? <MobileMainLayout><MobileActivitiesPage /> </MobileMainLayout>: <NoPermissionPage /> } />
      <Route path="/chat" element={isMobile ? <MobileMainLayout><ChatPageMobile /> </MobileMainLayout>: <NoPermissionPage /> } />
      
      <Route
        path="/"
        element={
          <RequireAuth loginPath="/login">
            {isMobile ? 
            <MobileMainLayout> 
              <MobileMainPage /> 
            </MobileMainLayout>
            :
            <AppLayout>
              <MainPage />
            </AppLayout>
            }
          </RequireAuth>
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
