import React from "react";
import { Outlet, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import { motion } from "framer-motion";

// Food-related SVGs for the background pattern
const foodIcons = [
  { icon: "🥗", transform: "rotate(10deg)", top: "10%", left: "5%" },
  { icon: "🍲", transform: "rotate(-5deg)", top: "20%", left: "85%" },
  { icon: "🥑", transform: "rotate(15deg)", top: "65%", left: "10%" },
  { icon: "🍅", transform: "rotate(-10deg)", top: "80%", left: "80%" },
  { icon: "🥕", transform: "rotate(20deg)", top: "30%", left: "25%" },
  { icon: "🍗", transform: "rotate(-15deg)", top: "50%", left: "90%" },
  { icon: "🥐", transform: "rotate(5deg)", top: "85%", left: "30%" },
  { icon: "🍎", transform: "rotate(-5deg)", top: "15%", left: "70%" },
];

const AuthLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "background.default",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Pattern */}
      {!isMobile && (
        <Box
          sx={{
            position: "absolute",
            width: "100%",
            height: "100%",
            opacity: 0.1,
          }}
        >
          {foodIcons.map((item, index) => (
            <Box
              key={index}
              component={motion.div}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              sx={{
                position: "absolute",
                top: item.top,
                left: item.left,
                fontSize: "4rem",
                transform: item.transform,
              }}
            >
              {item.icon}
            </Box>
          ))}
        </Box>
      )}

      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="center" alignItems="center">
          {/* Left side - Branding */}
          {!isMobile && (
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Box sx={{ textAlign: "center" }}>
                  <RestaurantMenuIcon
                    sx={{ fontSize: 100, color: "primary.main", mb: 2 }}
                  />
                  <Typography
                    variant="h2"
                    component="h1"
                    sx={{
                      fontWeight: 700,
                      color: "primary.main",
                      mb: 2,
                    }}
                  >
                    Cuisine Compass
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 400,
                      color: "text.secondary",
                      mb: 4,
                    }}
                  >
                    Your AI-powered meal planner and calorie tracker
                  </Typography>
                  <Box
                    component="img"
                    src="/food-collage.jpeg"
                    alt="Food Illustration"
                    sx={{
                      width: "50%",
                      maxWidth: 500,
                      borderRadius: 4,
                      boxShadow: 6,
                      display: { xs: "none", md: "block" },
                      mx: "auto",
                    }}
                  />
                </Box>
              </motion.div>
            </Grid>
          )}

          {/* Right side - Auth Form */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Paper
                elevation={6}
                sx={{
                  p: 4,
                  borderRadius: 4,
                  backdropFilter: "blur(10px)",
                  backgroundColor: "rgba(255,255,255,0.9)",
                }}
              >
                {/* Mobile Logo */}
                {isMobile && (
                  <Box sx={{ textAlign: "center", mb: 4 }}>
                    <RestaurantMenuIcon
                      sx={{ fontSize: 60, color: "primary.main", mb: 1 }}
                    />
                    <Typography
                      variant="h4"
                      component="h1"
                      sx={{
                        fontWeight: 700,
                        color: "primary.main",
                      }}
                    >
                      Cuisine Compass
                    </Typography>
                  </Box>
                )}

                {/* Auth Form Content */}
                <Outlet />
              </Paper>

              {/* Additional Information */}
              <Box
                sx={{
                  textAlign: "center",
                  mt: 2,
                  color: "text.secondary",
                }}
              >
                <Typography variant="body2">
                  © {new Date().getFullYear()} Cuisine Compass. All rights
                  reserved.
                </Typography>
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AuthLayout;
