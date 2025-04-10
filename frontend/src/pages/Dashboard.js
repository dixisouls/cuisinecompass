import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  Button,
  CircularProgress,
  LinearProgress,
  Divider,
  Chip,
  useMediaQuery,
  Alert,
  IconButton,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  Restaurant,
  CalendarToday,
  FastfoodOutlined,
  LocalDiningOutlined,
  DinnerDiningOutlined,
  MoreHoriz,
  Add,
  KeyboardArrowRight,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { mealPlanApi } from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const Dashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [loading, setLoading] = useState(true);
  const [mealPlans, setMealPlans] = useState([]);
  const [error, setError] = useState(null);
  const [generatingPlan, setGeneratingPlan] = useState(false);

  // Calculate today's date for highlighting current day
  const today = new Date().toISOString().split("T")[0];

  // Load meal plans on component mount
  useEffect(() => {
    fetchMealPlans();
  }, []);

  const fetchMealPlans = async () => {
    try {
      setLoading(true);
      const response = await mealPlanApi.getUserMealPlans();
      setMealPlans(response.data);
    } catch (error) {
      console.error("Error fetching meal plans:", error);
      setError("Failed to load your meal plans. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Generate a new meal plan
  const handleGenerateMealPlan = async () => {
    try {
      setGeneratingPlan(true);
      setError(null);

      // Default to 3 days if it's a new plan
      const days = 3;

      const response = await mealPlanApi.generateMealPlan(days);

      // Refresh meal plans
      await fetchMealPlans();
    } catch (error) {
      console.error("Error generating meal plan:", error);
      setError(
        error.response?.data?.detail ||
          "Failed to generate meal plan. Please try again."
      );
    } finally {
      setGeneratingPlan(false);
    }
  };

  // Mark a day's meal plan as complete
  const handleMarkComplete = async (date) => {
    try {
      setLoading(true);
      await mealPlanApi.markDayComplete(date);

      // Refresh meal plans
      await fetchMealPlans();
    } catch (error) {
      console.error("Error marking meal plan as complete:", error);
      setError("Failed to update meal plan status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Calculate the number of planned days
  const plannedDays = mealPlans.reduce((total, plan) => {
    // Count the number of dates in each meal plan
    const datesCount = Object.keys(plan.dates).length;
    return total + datesCount;
  }, 0);

  // Prepare macronutrient data for the pie chart
  const macroData = [
    {
      name: "Protein",
      value: currentUser?.profile?.target_macros_pct?.protein || 30,
    },
    {
      name: "Carbs",
      value: currentUser?.profile?.target_macros_pct?.carbs || 40,
    },
    { name: "Fat", value: currentUser?.profile?.target_macros_pct?.fat || 30 },
  ];

  const MACRO_COLORS = [
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.secondary.main,
  ];

  // Extract meal plan dates and organize them by date
  const mealPlansByDate = {};

  mealPlans.forEach((plan) => {
    // Convert the dates object to an array of [key, value] pairs
    Object.entries(plan.dates).forEach(([dayKey, dateString]) => {
      // Check if this day exists in the meal plan data
      if (plan.days && plan.days[dayKey]) {
        // If we don't already have this date in our organized structure, add it
        if (!mealPlansByDate[dateString]) {
          mealPlansByDate[dateString] = {
            date: dateString,
            breakfast: plan.days[dayKey].Breakfast,
            lunch: plan.days[dayKey].Lunch,
            dinner: plan.days[dayKey].Dinner,
          };
        }
      }
    });
  });

  // Convert to array and sort by date
  const sortedMealPlans = Object.values(mealPlansByDate).sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  });

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { weekday: "long", month: "short", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  // Check if today's date is in the meal plans
  const hasTodayMeal = sortedMealPlans.some((plan) => plan.date === today);

  // Get today's meal plan if it exists
  const todayMeal = sortedMealPlans.find((plan) => plan.date === today);

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 2 }}>
        Dashboard
      </Typography>

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3, borderRadius: 2 }}
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Summary Cards Row */}
        <Grid item xs={12}>
          <Grid container spacing={3}>
            {/* Calories Card */}
            <Grid item xs={12} sm={6} md={4}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  borderRadius: 4,
                  height: "100%",
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  color: theme.palette.primary.contrastText,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Restaurant fontSize="large" sx={{ mr: 1 }} />
                  <Typography variant="h6">Daily Target</Typography>
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                  {currentUser?.profile?.target_daily_calories || 2000}
                </Typography>
                <Typography variant="subtitle1">calories per day</Typography>
              </Paper>
            </Grid>

            {/* Meal Plans Card */}
            <Grid item xs={12} sm={6} md={4}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  borderRadius: 4,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <CalendarToday
                    sx={{ mr: 1, color: theme.palette.secondary.main }}
                  />
                  <Typography variant="h6">Meal Plans</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "baseline", mb: 1 }}>
                  <Typography variant="h3" sx={{ fontWeight: 700, mr: 1 }}>
                    {plannedDays}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    / 7 days planned
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(plannedDays / 7) * 100}
                  sx={{
                    mb: 2,
                    height: 8,
                    borderRadius: 4,
                    bgcolor: theme.palette.grey[200],
                    "& .MuiLinearProgress-bar": {
                      borderRadius: 4,
                      bgcolor: theme.palette.secondary.main,
                    },
                  }}
                />
                <Box sx={{ mt: "auto" }}>
                  <Button
                    variant="contained"
                    color="secondary"
                    fullWidth
                    startIcon={<Add />}
                    onClick={handleGenerateMealPlan}
                    disabled={plannedDays >= 7 || generatingPlan}
                    sx={{
                      mt: 1,
                      position: "relative",
                      overflow: "hidden",
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        background:
                          "linear-gradient(120deg, rgba(255,255,255,0) 30%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 70%)",
                        transform: "translateX(-100%)",
                        transition: "transform 0.6s",
                      },
                      "&:hover::after": {
                        transform: "translateX(100%)",
                      },
                    }}
                  >
                    {generatingPlan ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Generate Meal Plan"
                    )}
                  </Button>
                </Box>
              </Paper>
            </Grid>

            {/* Macros Card */}
            <Grid item xs={12} md={4}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  borderRadius: 4,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Target Macros
                </Typography>
                <Box sx={{ height: 180, width: "100%" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={macroData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={2}
                        dataKey="value"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {macroData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={MACRO_COLORS[index % MACRO_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [`${value}%`, "Target"]}
                        contentStyle={{
                          backgroundColor: theme.palette.background.paper,
                          borderRadius: 8,
                          border: "none",
                          boxShadow: theme.shadows[3],
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Grid>

        {/* Today's Meals Section */}
        <Grid item xs={12}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
              Today's Meals
            </Typography>

            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                <CircularProgress />
              </Box>
            ) : hasTodayMeal ? (
              <AnimatePresence>
                <Grid container spacing={3}>
                  {/* Breakfast Card */}
                  <Grid item xs={12} md={4}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0 }}
                    >
                      <Card
                        sx={{
                          height: "100%",
                          borderRadius: 4,
                        }}
                      >
                        <CardContent sx={{ p: 3 }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 2,
                            }}
                          >
                            <FastfoodOutlined
                              sx={{ mr: 1, color: theme.palette.warning.main }}
                            />
                            <Typography variant="h6">Breakfast</Typography>
                          </Box>
                          <Typography
                            variant="h6"
                            sx={{ fontWeight: 600, mb: 1 }}
                          >
                            {todayMeal.breakfast.name}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 2 }}
                          >
                            {todayMeal.breakfast.recipe.description}
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <Chip
                              label={`${
                                todayMeal.breakfast.recipe.prepTimeMins +
                                todayMeal.breakfast.recipe.cookTimeMins
                              } mins`}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                            <Button
                              endIcon={<KeyboardArrowRight />}
                              onClick={() =>
                                navigate(`/recipe/${todayMeal.date}/breakfast`)
                              }
                            >
                              View Recipe
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>

                  {/* Lunch Card */}
                  <Grid item xs={12} md={4}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    >
                      <Card
                        sx={{
                          height: "100%",
                          borderRadius: 4,
                        }}
                      >
                        <CardContent sx={{ p: 3 }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 2,
                            }}
                          >
                            <LocalDiningOutlined
                              sx={{ mr: 1, color: theme.palette.primary.main }}
                            />
                            <Typography variant="h6">Lunch</Typography>
                          </Box>
                          <Typography
                            variant="h6"
                            sx={{ fontWeight: 600, mb: 1 }}
                          >
                            {todayMeal.lunch.name}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 2 }}
                          >
                            {todayMeal.lunch.recipe.description}
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <Chip
                              label={`${
                                todayMeal.lunch.recipe.prepTimeMins +
                                todayMeal.lunch.recipe.cookTimeMins
                              } mins`}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                            <Button
                              endIcon={<KeyboardArrowRight />}
                              onClick={() =>
                                navigate(`/recipe/${todayMeal.date}/lunch`)
                              }
                            >
                              View Recipe
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>

                  {/* Dinner Card */}
                  <Grid item xs={12} md={4}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                    >
                      <Card
                        sx={{
                          height: "100%",
                          borderRadius: 4,
                        }}
                      >
                        <CardContent sx={{ p: 3 }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 2,
                            }}
                          >
                            <DinnerDiningOutlined
                              sx={{
                                mr: 1,
                                color: theme.palette.secondary.main,
                              }}
                            />
                            <Typography variant="h6">Dinner</Typography>
                          </Box>
                          <Typography
                            variant="h6"
                            sx={{ fontWeight: 600, mb: 1 }}
                          >
                            {todayMeal.dinner.name}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 2 }}
                          >
                            {todayMeal.dinner.recipe.description}
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <Chip
                              label={`${
                                todayMeal.dinner.recipe.prepTimeMins +
                                todayMeal.dinner.recipe.cookTimeMins
                              } mins`}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                            <Button
                              endIcon={<KeyboardArrowRight />}
                              onClick={() =>
                                navigate(`/recipe/${todayMeal.date}/dinner`)
                              }
                            >
                              View Recipe
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>

                  {/* Complete Today Button */}
                  <Grid item xs={12}>
                    <Box
                      sx={{ display: "flex", justifyContent: "center", mt: 2 }}
                    >
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => handleMarkComplete(today)}
                        disabled={loading}
                        startIcon={
                          loading ? <CircularProgress size={20} /> : null
                        }
                      >
                        Mark Today as Complete
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </AnimatePresence>
            ) : (
              <Paper
                elevation={2}
                sx={{
                  p: 4,
                  borderRadius: 4,
                  textAlign: "center",
                  bgcolor: "rgba(0,0,0,0.02)",
                }}
              >
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No meals planned for today
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleGenerateMealPlan}
                  disabled={plannedDays >= 7 || generatingPlan}
                  startIcon={
                    generatingPlan ? <CircularProgress size={20} /> : <Add />
                  }
                  sx={{ mt: 2 }}
                >
                  Generate Meal Plan
                </Button>
              </Paper>
            )}
          </Box>
        </Grid>

        {/* Upcoming Meals Section */}
        {sortedMealPlans.length > 0 && (
          <Grid item xs={12}>
            <Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Upcoming Meals
                </Typography>
                <Button
                  color="primary"
                  endIcon={<KeyboardArrowRight />}
                  onClick={() => navigate("/meal-plans")}
                >
                  View All
                </Button>
              </Box>

              <AnimatePresence>
                <Grid container spacing={2}>
                  {sortedMealPlans.slice(0, 3).map((plan, index) => (
                    <Grid item xs={12} key={plan.date}>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <Paper
                          elevation={2}
                          sx={{
                            p: 2,
                            borderRadius: 3,
                            borderLeft:
                              plan.date === today
                                ? `4px solid ${theme.palette.primary.main}`
                                : "none",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: isMobile ? "column" : "row",
                              alignItems: isMobile ? "flex-start" : "center",
                            }}
                          >
                            <Box
                              sx={{
                                minWidth: isMobile ? "100%" : "180px",
                                mb: isMobile ? 1 : 0,
                              }}
                            >
                              <Typography
                                variant="subtitle1"
                                fontWeight={600}
                                color={
                                  plan.date === today
                                    ? "primary.main"
                                    : "inherit"
                                }
                              >
                                {formatDate(plan.date)}
                              </Typography>
                              {plan.date === today && (
                                <Chip
                                  label="Today"
                                  size="small"
                                  color="primary"
                                  sx={{ mr: 1, mt: 0.5 }}
                                />
                              )}
                            </Box>

                            <Divider
                              orientation={isMobile ? "horizontal" : "vertical"}
                              flexItem
                              sx={{
                                mx: 2,
                                my: isMobile ? 1 : 0,
                                display: isMobile ? "block" : "flex",
                              }}
                            />

                            <Box
                              sx={{
                                flex: 1,
                                display: "flex",
                                flexDirection: isMobile ? "column" : "row",
                                gap: 2,
                              }}
                            >
                              <Box sx={{ minWidth: "33%" }}>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  Breakfast
                                </Typography>
                                <Typography variant="body1" noWrap>
                                  {plan.breakfast.name}
                                </Typography>
                              </Box>

                              <Box sx={{ minWidth: "33%" }}>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  Lunch
                                </Typography>
                                <Typography variant="body1" noWrap>
                                  {plan.lunch.name}
                                </Typography>
                              </Box>

                              <Box sx={{ minWidth: "33%" }}>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  Dinner
                                </Typography>
                                <Typography variant="body1" noWrap>
                                  {plan.dinner.name}
                                </Typography>
                              </Box>
                            </Box>

                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                ml: isMobile ? 0 : 2,
                                mt: isMobile ? 1 : 0,
                              }}
                            >
                              <IconButton
                                size="small"
                                onClick={() => navigate("/meal-plans")}
                              >
                                <MoreHoriz />
                              </IconButton>
                            </Box>
                          </Box>
                        </Paper>
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
              </AnimatePresence>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default Dashboard;
