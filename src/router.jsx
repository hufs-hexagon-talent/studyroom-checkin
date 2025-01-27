import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { useServiceRole } from "./api/user.api";

import useAuth from "./hooks/useAuth";

import Footer from "./components/footer/Footer";
import NavigationBar from "./components/Navbar/NavigationBar";
import CheckIn from "./pages/checkin/CheckIn";
import RoomPage from "./pages/rooms/Roompage";
import LoginPage from "./pages/login/LoginPage";

const RouterComponent = () => {
  const { loggedIn } = useAuth();
  const { data: serviceRole, isLoading } = useServiceRole();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col">
      <NavigationBar />
      <div className="flex-grow">
        <Routes>
          {/* 로그인 상태에 따른 라우팅 */}
          {loggedIn ? (
            <>
              <Route path="/" element={<RoomPage />} />
              {serviceRole === "RESIDENT" && (
                <Route path="/qrcheck" element={<CheckIn />} />
              )}
            </>
          ) : (
            <>
              <Route path="/login" element={<LoginPage />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </>
          )}
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default RouterComponent;
