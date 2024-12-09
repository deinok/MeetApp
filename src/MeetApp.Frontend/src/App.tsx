import React from "react";
import { RequireAuth } from "react-auth-kit";
import { Route, Routes } from "react-router-dom";
import { ProfilePage } from "./pages/web/profile/ProfilePage";
import { LoginPage } from "./pages/web/login/LoginPage";
import { RegisterPage } from "./pages/web/register/RegisterPage";
import AppLayout from "./pages/web/layout/MainLayout";
import "./i18n";
import NoPermissionPage from "./pages/web/noPermissionPage/NoPermissionPage";
import MainPage from "./pages/web/main/MainPage";
import { OffersPage } from "./pages/web/offers/OffersPage";
import StatsPage from "./pages/web/stats/statsPage";
import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile,
} from "react-device-detect";
import MobileMainLayout from "./pages/mobile/layout/MobileMainLayout";
import MobileLoginPage from "./pages/mobile/login/mobileLoginPage";
import MobileRegisterPage from "./pages/mobile/register/mobileRegisterPage";
import MobileMainPage from "./pages/mobile/main/mobileMainPage";
import MobileActivitiesPage from "./pages/mobile/activities/mobileActivitiesPage";
import ChatPageMobile from "./pages/mobile/chatPage/chatPageMobile";
import MobileProfilePage from "./pages/mobile/profile/mobileProfilePage";
import MobileMapPage from "./pages/mobile/map/mobileMapPage";
isMobile && import("./MobileApp.css");

function App() {
  if (isMobile) {
    return (
      <Routes>
        <Route path="*" element={<NoPermissionPage />} />
        <Route path="/login" element={<MobileLoginPage />} />
        <Route path="/register" element={<MobileRegisterPage />} />

        <Route
          path="/"
          element={
            <RequireAuth loginPath="/login">
              <MobileMainLayout>
                <MobileMainPage />
              </MobileMainLayout>
            </RequireAuth>
          }
        />

        <Route
          path="/activities"
          element={
            <MobileMainLayout>
              <MobileActivitiesPage />
            </MobileMainLayout>
          }
        />

        <Route
          path="/profile"
          element={
            <RequireAuth loginPath="/login">
              <MobileMainLayout>
                <MobileProfilePage />
              </MobileMainLayout>
            </RequireAuth>
          }
        />

        <Route
          path="/map"
          element={
            <RequireAuth loginPath="/login">
              <MobileMainLayout>
                <MobileMapPage />
              </MobileMainLayout>
            </RequireAuth>
          }
        />

        <Route
          path="/chat/:activityId"
          element={
            <MobileMainLayout>
              <ChatPageMobile />
            </MobileMainLayout>
          }
        />
      </Routes>
    );
  } else {
    return (
      <Routes>
        <Route path="*" element={<NoPermissionPage />} />
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
}

export default App;
