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
          {loggedIn ? (
            <>
              <Route path="/" element={<CheckIn />} />
              {serviceRole === "RESIDENT" && (
                <>
                  <Route path="/reservation" element={<RoomPage />} />
                  <Route path="/" element={<CheckIn />} />
                </>
              )}
              {serviceRole === "ADMIN" && (
                <>
                  <Route path="/reservation" element={<RoomPage />} />
                  <Route path="/" element={<CheckIn />} />
                  <Route path="/login" element={<LoginPage />} />
                </>
              )}
            </>
          ) : (
            <>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/reservation" element={<RoomPage />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </>
          )}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default RouterComponent;
