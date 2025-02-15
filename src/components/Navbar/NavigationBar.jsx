import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Logo from "../../assets/logo.png";
import useAuth from "../../hooks/useAuth";
import { useServiceRole } from "../../api/user.api";

const drawerWidth = 240;

function NavigationBar(props) {
  const { window } = props;
  const navigate = useNavigate();
  const { loggedIn, logout } = useAuth();
  const { data: serviceRole } = useServiceRole();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        <img
          src={Logo}
          alt="cse logo"
          className="h-10 mx-auto cursor-pointer"
        />
      </Typography>
      <Divider />
      <List>
        {loggedIn ? (
          <>
            {serviceRole === "RESIDENT" && (
              <>
                <ListItem disablePadding>
                  <ListItemButton onClick={() => navigate("/")}>
                    <ListItemText primary="출석 체크" />
                  </ListItemButton>
                </ListItem>
              </>
            )}
            {serviceRole === "ADMIN" && (
              <>
                <ListItem disablePadding>
                  <ListItemButton onClick={() => navigate("/")}>
                    <ListItemText primary="출석 체크" />
                  </ListItemButton>
                </ListItem>
              </>
            )}
            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout}>
                <ListItemText primary="로그아웃" />
              </ListItemButton>
            </ListItem>
          </>
        ) : (
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate("/reservation")}>
              <ListItemText primary="예약 현황" />
            </ListItemButton>
            <ListItemButton onClick={() => navigate("/login")}>
              <ListItemText primary="로그인" />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      {/* 상단 네비게이션 바 */}
      <AppBar
        component="nav"
        position="fixed"
        sx={{
          backgroundColor: "white",
          color: "black",
          boxShadow: 0,
          borderBottom: 0.5,
          borderColor: "gray",
        }}
      >
        <Toolbar>
          {/* 모바일용 햄버거 버튼 */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          {/* 로고 */}
          <Typography
            variant="h6"
            component="div"
            onClick={() => navigate("/")}
            sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}
          >
            <img
              src={Logo}
              alt="cse logo"
              className="h-10 mr-2 cursor-pointer inline-block"
              onClick={() => navigate("/")}
            />
            <span
              onClick={() => navigate("/")}
              className="text-xl font-semibold cursor-pointer inline-block"
            >
              컴퓨터공학부 세미나실 예약 시스템
            </span>
          </Typography>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            {loggedIn ? (
              <>
                {/* 출석체크용 아이디일때 */}
                {serviceRole === "RESIDENT" && (
                  <>
                    <Button
                      sx={{ fontSize: "1.1rem" }}
                      color="inherit"
                      onClick={() => navigate("/")}
                    >
                      출석 체크
                    </Button>
                    <Button
                      sx={{ fontSize: "1.1rem" }}
                      color="inherit"
                      onClick={() => navigate("/reservation")}
                    >
                      예약 현황
                    </Button>
                  </>
                )}
                {/* 관리자 아이디일 때 */}
                {serviceRole === "ADMIN" && (
                  <>
                    <Button
                      sx={{ fontSize: "1.1rem" }}
                      color="inherit"
                      onClick={() => navigate("/")}
                    >
                      출석 체크
                    </Button>
                    <Button
                      sx={{ fontSize: "1.1rem" }}
                      color="inherit"
                      onClick={() => navigate("/reservation")}
                    >
                      예약 현황
                    </Button>
                  </>
                )}
                <Button
                  sx={{ fontSize: "1.1rem" }}
                  color="inherit"
                  onClick={handleLogout}
                >
                  로그아웃
                </Button>
              </>
            ) : (
              // 로그아웃 상태일 때
              <>
                <Button
                  sx={{ fontSize: "1.1rem" }}
                  color="inherit"
                  onClick={() => navigate("/reservation")}
                >
                  예약 현황
                </Button>
                <Button
                  sx={{ fontSize: "1.1rem" }}
                  color="inherit"
                  onClick={() => navigate("/login")}
                >
                  로그인
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      {/* 모바일 Drawer */}
      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
      {/* 메인 페이지 여백 추가 */}
      <Box component="main" sx={{ mt: 3 }}>
        <Toolbar />
      </Box>
    </Box>
  );
}

NavigationBar.propTypes = {
  window: PropTypes.func,
};

export default NavigationBar;
