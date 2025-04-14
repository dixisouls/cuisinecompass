import React, { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Container,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Button,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DashboardIcon from "@mui/icons-material/Dashboard";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../../contexts/AuthContext";
import { motion } from "framer-motion";

// Logo component with animation
const Logo = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
  >
    <Typography
      variant="h6"
      noWrap
      component="div"
      sx={{
        display: "flex",
        alignItems: "center",
        fontWeight: 700,
        color: "primary.main",
        letterSpacing: ".1rem",
        textDecoration: "none",
      }}
    >
      <RestaurantMenuIcon sx={{ mr: 1, color: "primary.main" }} />
      CUISINE COMPASS
    </Typography>
  </motion.div>
);

// Navigation links
const navItems = [
  { title: "Dashboard", path: "/dashboard", icon: <DashboardIcon /> },
  { title: "Meal Plans", path: "/meal-plans", icon: <RestaurantMenuIcon /> },
];

const DRAWER_WIDTH = 240;

const MainLayout = () => {
  const theme = useTheme();
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // State for mobile drawer
  const [mobileOpen, setMobileOpen] = useState(false);

  // State for profile menu
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // Handle drawer toggle
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Handle profile menu open
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Handle profile menu close
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Handle navigation
  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    handleMenuClose();
    logout();
  };

  // Drawer content
  const drawer = (
    <Box sx={{ width: DRAWER_WIDTH }} role="presentation">
      <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
        <Logo />
      </Box>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.title} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => handleNavigation(item.path)}
              sx={{
                "&.Mui-selected": {
                  bgcolor: "primary.light",
                  "&:hover": {
                    bgcolor: "primary.light",
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: location.pathname === item.path ? "white" : "inherit",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.title}
                primaryTypographyProps={{
                  fontWeight: location.pathname === item.path ? 600 : 400,
                  color: location.pathname === item.path ? "white" : "inherit",
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.default",
        width: "100%",
        overflowX: "hidden",
      }}
    >
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          bgcolor: "background.paper",
          color: "text.primary",
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        elevation={0}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Logo on mobile */}
          {isMobile && (
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                Cuisine Compass
              </Typography>
            </Box>
          )}

          {/* Logo on desktop */}
          {!isMobile && (
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              <Logo />
            </Box>
          )}

          {/* Desktop Navigation */}
          <Box
            sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}
          >
            {navItems.map((item) => (
              <Button
                key={item.title}
                onClick={() => handleNavigation(item.path)}
                sx={{
                  mx: 1,
                  color:
                    location.pathname === item.path
                      ? "primary.main"
                      : "text.primary",
                  fontWeight: location.pathname === item.path ? 600 : 400,
                  "&:hover": {
                    bgcolor: "primary.light",
                    color: "primary.contrastText",
                  },
                }}
                startIcon={item.icon}
              >
                {item.title}
              </Button>
            ))}
          </Box>

          {/* User Avatar */}
          <Box sx={{ flexGrow: 0 }}>
            <IconButton
              onClick={handleMenuOpen}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={open ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
            >
              <Avatar sx={{ bgcolor: "primary.main" }}>
                {currentUser?.first_name ? currentUser.first_name[0] : "U"}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={open}
              onClose={handleMenuClose}
              onClick={handleMenuClose}
              PaperProps={{
                elevation: 4,
                sx: {
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.1))",
                  mt: 1.5,
                  width: 200,
                  "& .MuiAvatar-root": {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem onClick={() => handleNavigation("/profile")}>
                <ListItemIcon>
                  <AccountCircleIcon fontSize="small" />
                </ListItemIcon>
                Profile
              </MenuItem>
              <MenuItem onClick={() => handleNavigation("/change-password")}>
                <ListItemIcon>
                  <SettingsIcon fontSize="small" />
                </ListItemIcon>
                Change Password
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: DRAWER_WIDTH,
            boxShadow: 3,
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop Drawer - always visible on larger screens */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: DRAWER_WIDTH,
            borderRight: "none",
          },
        }}
        open
      >
        {drawer}
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: "100%",
          px: { xs: 1, sm: 2, md: 3 },
          ml: { md: `${DRAWER_WIDTH}px` },
          mt: "64px", // Height of the AppBar
          maxWidth: "100%",
          overflowX: "hidden",
        }}
      >
        <Container
          maxWidth="lg"
          disableGutters
          sx={{
            py: 4,
            px: { xs: 1, sm: 2 },
            width: "100%",
            overflow: "hidden",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ width: "100%", overflowX: "hidden" }}
          >
            <Outlet />
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
};

export default MainLayout;
