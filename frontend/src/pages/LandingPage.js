import React from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Divider,
  Link,
  useMediaQuery,
  Stack,
  Paper,
  Avatar,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Link as RouterLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
  RestaurantMenu,
  QueryStats,
  LocalDining,
  MenuBook,
  FoodBank,
  GitHub,
  Language,
  Speed,
  FitnessCenter,
  AutoFixHigh,
} from "@mui/icons-material";

const LandingPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <Box
      sx={{
        bgcolor: "background.default",
        minHeight: "100vh",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Abstract background shapes */}
      <Box
        sx={{
          position: "absolute",
          top: "5%",
          right: "5%",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${theme.palette.primary.light} 0%, transparent 70%)`,
          opacity: 0.3,
          zIndex: 0,
          display: { xs: "none", md: "block" },
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "10%",
          left: "5%",
          width: "250px",
          height: "250px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${theme.palette.secondary.light} 0%, transparent 70%)`,
          opacity: 0.2,
          zIndex: 0,
          display: { xs: "none", md: "block" },
        }}
      />

      {/* Hero Section */}
      <Box
        sx={{
          pt: { xs: 10, md: 15 },
          pb: { xs: 10, md: 15 },
          position: "relative",
          zIndex: 1,
          background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
          clipPath: "polygon(0 0, 100% 0, 100% 85%, 0 100%)",
          color: "white",
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6} order={{ xs: 2, md: 1 }}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Box sx={{ mb: 4 }}>
                  <Typography
                    variant="overline"
                    sx={{
                      color: theme.palette.secondary.light,
                      fontWeight: 600,
                      letterSpacing: 1.5,
                      mb: 1,
                      display: "block",
                    }}
                  >
                    AI-POWERED MEAL PLANNING
                  </Typography>
                  <Typography
                    variant="h2"
                    component="h1"
                    sx={{
                      fontWeight: 800,
                      mb: 2,
                      fontSize: { xs: "2.5rem", md: "3.5rem" },
                      background: `linear-gradient(90deg, #FFFFFF 0%, ${theme.palette.secondary.light} 100%)`,
                      backgroundClip: "text",
                      textFillColor: "transparent",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    Cuisine Compass
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      mb: 3,
                      fontWeight: 400,
                      opacity: 0.9,
                      maxWidth: "90%",
                    }}
                  >
                    Navigate your nutrition journey with AI-powered personalized
                    meal plans
                  </Typography>
                  <Box sx={{ mb: 5 }}>
                    <Stack
                      direction="row"
                      spacing={2}
                      alignItems="center"
                      sx={{ mb: 2 }}
                    >
                      <Avatar
                        sx={{
                          bgcolor: "rgba(255,255,255,0.1)",
                          color: theme.palette.secondary.light,
                        }}
                      >
                        <AutoFixHigh />
                      </Avatar>
                      <Typography>
                        Personalized recipes tailored to your tastes
                      </Typography>
                    </Stack>
                    <Stack
                      direction="row"
                      spacing={2}
                      alignItems="center"
                      sx={{ mb: 2 }}
                    >
                      <Avatar
                        sx={{
                          bgcolor: "rgba(255,255,255,0.1)",
                          color: theme.palette.secondary.light,
                        }}
                      >
                        <FitnessCenter />
                      </Avatar>
                      <Typography>
                        Customized nutrition goals to meet your needs
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar
                        sx={{
                          bgcolor: "rgba(255,255,255,0.1)",
                          color: theme.palette.secondary.light,
                        }}
                      >
                        <Speed />
                      </Avatar>
                      <Typography>Easy meal planning with one click</Typography>
                    </Stack>
                  </Box>
                  <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                    <Button
                      component={RouterLink}
                      to="/register"
                      variant="contained"
                      color="secondary"
                      size="large"
                      sx={{
                        px: 4,
                        py: 1.5,
                        borderRadius: 2,
                        fontWeight: 600,
                        letterSpacing: 0.5,
                        textTransform: "none",
                        fontSize: "1rem",
                        boxShadow: `0 8px 20px rgba(255, 167, 38, 0.3)`,
                      }}
                    >
                      Get Started Free
                    </Button>
                    <Button
                      component={RouterLink}
                      to="/login"
                      variant="outlined"
                      size="large"
                      sx={{
                        px: 4,
                        py: 1.5,
                        borderRadius: 2,
                        fontWeight: 600,
                        textTransform: "none",
                        fontSize: "1rem",
                        borderColor: "rgba(255,255,255,0.5)",
                        color: "white",
                        "&:hover": {
                          borderColor: "white",
                          bgcolor: "rgba(255,255,255,0.1)",
                        },
                      }}
                    >
                      Log In
                    </Button>
                  </Box>
                </Box>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6} order={{ xs: 1, md: 2 }}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Box
                  sx={{
                    position: "relative",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: "10%",
                      left: "10%",
                      width: "100%",
                      height: "100%",
                      bgcolor: theme.palette.secondary.main,
                      borderRadius: 4,
                      opacity: 0.3,
                      zIndex: -1,
                    },
                  }}
                >
                  <Paper
                    elevation={6}
                    sx={{
                      borderRadius: 4,
                      overflow: "hidden",
                      transform: "rotate(2deg)",
                      border: `4px solid ${theme.palette.common.white}`,
                    }}
                  >
                    <Box
                      component="img"
                      src="/food-healthy.jpg"
                      alt="Healthy Food"
                      sx={{
                        width: "100%",
                        height: "auto",
                        display: "block",
                      }}
                    />
                  </Paper>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container
        maxWidth="xl"
        sx={{ py: { xs: 10, md: 15 }, position: "relative", zIndex: 1 }}
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <Box sx={{ mb: 10, textAlign: "center" }}>
            <Typography
              variant="overline"
              component="div"
              sx={{
                color: theme.palette.primary.main,
                fontWeight: 600,
                letterSpacing: 1.5,
                mb: 1,
                display: "block",
              }}
            >
              POWERFUL FEATURES
            </Typography>
            <Typography
              variant="h3"
              component="h2"
              sx={{
                mb: 2,
                fontWeight: 700,
              }}
            >
              Everything you need for meal planning
            </Typography>
            <Typography
              variant="body1"
              sx={{
                maxWidth: 700,
                mx: "auto",
                color: "text.secondary",
                fontSize: "1.1rem",
              }}
            >
              Our AI-powered platform takes the guesswork out of healthy eating
              with personalized recommendations tailored to your unique goals
              and preferences.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <motion.div variants={itemVariants}>
                <Card
                  elevation={0}
                  sx={{
                    height: "100%",
                    p: 2,
                    borderRadius: 4,
                    transition: "all 0.3s ease",
                    border: `1px solid ${theme.palette.divider}`,
                    "&:hover": {
                      borderColor: theme.palette.primary.main,
                      transform: "translateY(-8px)",
                      boxShadow: 6,
                      "& .MuiAvatar-root": {
                        bgcolor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText,
                      },
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Avatar
                      sx={{
                        bgcolor: theme.palette.primary.light,
                        color: theme.palette.primary.dark,
                        width: 60,
                        height: 60,
                        mb: 3,
                        transition: "all 0.3s ease",
                      }}
                    >
                      <QueryStats sx={{ fontSize: 30 }} />
                    </Avatar>
                    <Typography
                      variant="h5"
                      component="h3"
                      sx={{ mb: 2, fontWeight: 700 }}
                    >
                      Personalized Nutrition
                    </Typography>
                    <Typography
                      sx={{ color: "text.secondary", lineHeight: 1.7 }}
                    >
                      Set your dietary goals, restrictions, and preferences. Our
                      AI creates customized meal plans that adjust to your
                      specific calorie and macronutrient targets.
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            <Grid item xs={12} md={4}>
              <motion.div variants={itemVariants}>
                <Card
                  elevation={0}
                  sx={{
                    height: "100%",
                    p: 2,
                    borderRadius: 4,
                    transition: "all 0.3s ease",
                    border: `1px solid ${theme.palette.divider}`,
                    "&:hover": {
                      borderColor: theme.palette.secondary.main,
                      transform: "translateY(-8px)",
                      boxShadow: 6,
                      "& .MuiAvatar-root": {
                        bgcolor: theme.palette.secondary.main,
                        color: theme.palette.secondary.contrastText,
                      },
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Avatar
                      sx={{
                        bgcolor: theme.palette.secondary.light,
                        color: theme.palette.secondary.dark,
                        width: 60,
                        height: 60,
                        mb: 3,
                        transition: "all 0.3s ease",
                      }}
                    >
                      <MenuBook sx={{ fontSize: 30 }} />
                    </Avatar>
                    <Typography
                      variant="h5"
                      component="h3"
                      sx={{ mb: 2, fontWeight: 700 }}
                    >
                      AI-Powered Recipes
                    </Typography>
                    <Typography
                      sx={{ color: "text.secondary", lineHeight: 1.7 }}
                    >
                      Discover delicious recipes generated by AI that match your
                      taste preferences and dietary needs. Each recipe includes
                      detailed instructions and nutritional information.
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            <Grid item xs={12} md={4}>
              <motion.div variants={itemVariants}>
                <Card
                  elevation={0}
                  sx={{
                    height: "100%",
                    p: 2,
                    borderRadius: 4,
                    transition: "all 0.3s ease",
                    border: `1px solid ${theme.palette.divider}`,
                    "&:hover": {
                      borderColor: theme.palette.primary.main,
                      transform: "translateY(-8px)",
                      boxShadow: 6,
                      "& .MuiAvatar-root": {
                        bgcolor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText,
                      },
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Avatar
                      sx={{
                        bgcolor: theme.palette.primary.light,
                        color: theme.palette.primary.dark,
                        width: 60,
                        height: 60,
                        mb: 3,
                        transition: "all 0.3s ease",
                      }}
                    >
                      <LocalDining sx={{ fontSize: 30 }} />
                    </Avatar>
                    <Typography
                      variant="h5"
                      component="h3"
                      sx={{ mb: 2, fontWeight: 700 }}
                    >
                      Weekly Meal Planning
                    </Typography>
                    <Typography
                      sx={{ color: "text.secondary", lineHeight: 1.7 }}
                    >
                      Plan your meals up to 7 days in advance. Simplify grocery
                      shopping, reduce food waste, and always know what's on the
                      menu for the week ahead.
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        </motion.div>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          position: "relative",
          py: { xs: 10, md: 15 },
          background: `linear-gradient(135deg, ${theme.palette.secondary.dark} 0%, ${theme.palette.secondary.main} 100%)`,
          clipPath: "polygon(0 15%, 100% 0, 100% 100%, 0 100%)",
          color: "white",
          zIndex: 1,
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.2 }}
          >
            <Grid
              container
              spacing={4}
              alignItems="center"
              justifyContent="space-between"
            >
              <Grid item xs={12} md={7}>
                <Typography
                  variant="h3"
                  component="h2"
                  sx={{ fontWeight: 700, mb: 2 }}
                >
                  Ready to transform your meal planning?
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ mb: 4, fontWeight: 400, opacity: 0.9 }}
                >
                  Join thousands of users who have simplified their nutrition
                  journey with Cuisine Compass.
                </Typography>
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  <Button
                    component={RouterLink}
                    to="/register"
                    variant="contained"
                    color="primary"
                    size="large"
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      fontWeight: 600,
                      textTransform: "none",
                      fontSize: "1rem",
                      boxShadow: `0 8px 20px rgba(76, 175, 80, 0.3)`,
                    }}
                  >
                    Start Your Free Account
                  </Button>
                </Box>
              </Grid>
              <Grid
                item
                xs={12}
                md={5}
                sx={{ display: { xs: "none", md: "block" } }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                  }}
                >
                  <FoodBank
                    sx={{ fontSize: 240, opacity: 0.2, color: "white" }}
                  />
                </Box>
              </Grid>
            </Grid>
          </motion.div>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 6,
          bgcolor: "background.paper",
          borderTop: "1px solid",
          borderColor: "divider",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Container>
          <Grid container spacing={4} justifyContent="space-between">
            <Grid item xs={12} md={4}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <RestaurantMenu
                  sx={{ fontSize: 24, mr: 1, color: "primary.main" }}
                />
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, color: "primary.main" }}
                >
                  Cuisine Compass
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Your AI-powered meal planner and calorie tracker application.
                Simplify your nutrition journey with personalized
                recommendations.
              </Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Quick Links
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                }}
              >
                <Link
                  component={RouterLink}
                  to="/login"
                  color="text.secondary"
                  underline="hover"
                >
                  Login
                </Link>
                <Link
                  component={RouterLink}
                  to="/register"
                  color="text.secondary"
                  underline="hover"
                >
                  Create Account
                </Link>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Connect
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Language sx={{ mr: 1, fontSize: 20 }} />
                  <Link
                    href="https://divyapanchal.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    color="text.secondary"
                    underline="hover"
                  >
                    Portfolio
                  </Link>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <GitHub sx={{ mr: 1, fontSize: 20 }} />
                  <Link
                    href="https://github.com/dixisouls/cuisinecompass"
                    target="_blank"
                    rel="noopener noreferrer"
                    color="text.secondary"
                    underline="hover"
                  >
                    Github
                  </Link>
                </Box>
              </Box>
            </Grid>
          </Grid>
          <Divider sx={{ my: 4 }} />
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} Cuisine Compass. Created by Divya
              Panchal. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
