import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
  CardActions,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Alert,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  ExpandMore,
  CalendarToday,
  FastfoodOutlined,
  LocalDiningOutlined,
  DinnerDiningOutlined,
  Add,
  Check,
  KeyboardArrowRight,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { mealPlanApi } from "../services/api";
import { motion, AnimatePresence } from "framer-motion";

const MealPlans = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [loading, setLoading] = useState(true);
  const [mealPlans, setMealPlans] = useState([]);
  const [error, setError] = useState(null);
  const [generatingPlan, setGeneratingPlan] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [daysToGenerate, setDaysToGenerate] = useState(3);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [dateToComplete, setDateToComplete] = useState(null);
  const [success, setSuccess] = useState(null);

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
  const handleOpenGenerateDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseGenerateDialog = () => {
    setDialogOpen(false);
  };

  const handleGenerateMealPlan = async () => {
    try {
      setDialogOpen(false);
      setGeneratingPlan(true);
      setError(null);

      const response = await mealPlanApi.generateMealPlan(daysToGenerate);

      // Refresh meal plans
      await fetchMealPlans();
      setSuccess(
        `Successfully generated meal plan for ${daysToGenerate} day${
          daysToGenerate > 1 ? "s" : ""
        }.`
      );
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

  // Generate for remaining days (up to 7)
  const handleGenerateAhead = async () => {
    try {
      setGeneratingPlan(true);
      setError(null);

      await mealPlanApi.generateAhead();

      // Refresh meal plans
      await fetchMealPlans();
      setSuccess("Successfully generated meal plans for remaining days.");
    } catch (error) {
      console.error("Error generating meal plans:", error);
      setError(
        error.response?.data?.detail ||
          "Failed to generate additional meal plans. Please try again."
      );
    } finally {
      setGeneratingPlan(false);
    }
  };

  // Open confirm dialog to mark a day as complete
  const handleOpenConfirmDialog = (date) => {
    setDateToComplete(date);
    setConfirmDialogOpen(true);
  };

  const handleCloseConfirmDialog = () => {
    setConfirmDialogOpen(false);
    setDateToComplete(null);
  };

  // Mark a day's meal plan as complete
  const handleMarkComplete = async () => {
    if (!dateToComplete) return;

    try {
      setConfirmDialogOpen(false);
      setLoading(true);

      await mealPlanApi.markDayComplete(dateToComplete);

      // Refresh meal plans
      await fetchMealPlans();
      setSuccess(
        `Meal plan for ${formatDate(dateToComplete)} marked as complete.`
      );
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
  // Format date for display
  const formatDate = (dateString) => {
    // Force the date to be parsed in local timezone by appending T00:00:00
    const date = new Date(`${dateString}T00:00:00`);
    const options = { weekday: "long", month: "short", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  const today = new Date();
  const todayISO = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  // Create a group of dates by week for better organization
  const groupMealPlansByWeek = (mealPlans) => {
    const weeks = {};

    mealPlans.forEach((plan) => {
      const date = new Date(plan.date);
      const weekStart = new Date(date);

      // Set to the first day of the week (Sunday)
      const day = date.getDay();
      weekStart.setDate(date.getDate() - day);

      const weekKey = weekStart.toISOString().split("T")[0];

      if (!weeks[weekKey]) {
        weeks[weekKey] = [];
      }

      weeks[weekKey].push(plan);
    });

    // Convert to array and sort by week start date
    return Object.entries(weeks)
      .map(([weekStart, plans]) => ({
        weekStart,
        plans: plans.sort((a, b) => new Date(a.date) - new Date(b.date)),
      }))
      .sort((a, b) => new Date(a.weekStart) - new Date(b.weekStart));
  };

  const mealPlansByWeek = groupMealPlansByWeek(sortedMealPlans);

  // Format week for display
  const formatWeek = (weekStart) => {
    const start = new Date(weekStart);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    const startMonth = start.toLocaleString("default", { month: "short" });
    const endMonth = end.toLocaleString("default", { month: "short" });

    if (startMonth === endMonth) {
      return `${startMonth} ${start.getDate()} - ${end.getDate()}, ${start.getFullYear()}`;
    } else {
      return `${startMonth} ${start.getDate()} - ${endMonth} ${end.getDate()}, ${start.getFullYear()}`;
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Meal Plans
        </Typography>

        <Box>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleGenerateAhead}
            disabled={plannedDays >= 7 || generatingPlan}
            sx={{ mr: 2, display: { xs: "none", sm: "inline-flex" } }}
          >
            Fill Week
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={handleOpenGenerateDialog}
            disabled={plannedDays >= 7 || generatingPlan}
          >
            {generatingPlan ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "New Plan"
            )}
          </Button>
        </Box>
      </Box>

      {/* Success or error alerts */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Alert
              severity="error"
              sx={{ mb: 3, borderRadius: 2 }}
              onClose={() => setError(null)}
            >
              {error}
            </Alert>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Alert
              severity="success"
              sx={{ mb: 3, borderRadius: 2 }}
              onClose={() => setSuccess(null)}
            >
              {success}
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status summary */}
      <Paper
        elevation={2}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 4,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "flex-start", md: "center" },
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Meal Plan Status
          </Typography>
          <Typography color="text.secondary">
            You have {plannedDays} out of 7 possible days planned.
            {plannedDays < 7
              ? ` You can generate up to ${7 - plannedDays} more day${
                  7 - plannedDays > 1 ? "s" : ""
                }.`
              : " Your meal plan is full."}
          </Typography>
        </Box>

        {plannedDays < 7 && (
          <Box sx={{ display: { xs: "block", sm: "none" }, width: "100%" }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleGenerateAhead}
              disabled={plannedDays >= 7 || generatingPlan}
              fullWidth
            >
              Fill Remaining Days
            </Button>
          </Box>
        )}
      </Paper>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : sortedMealPlans.length === 0 ? (
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
            No meal plans yet
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Generate your first meal plan to get started.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenGenerateDialog}
            startIcon={<Add />}
          >
            Generate Meal Plan
          </Button>
        </Paper>
      ) : (
        <Box>
          {mealPlansByWeek.map((week, weekIndex) => (
            <Accordion
              key={week.weekStart}
              defaultExpanded={weekIndex === 0}
              sx={{
                mb: 2,
                boxShadow: "none",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: "16px !important",
                overflow: "hidden",
                "&:before": {
                  display: "none",
                },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMore />}
                sx={{
                  bgcolor: "background.paper",
                  borderBottom: weekIndex === 0 ? "1px solid" : "none",
                  borderColor: "divider",
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Week of {formatWeek(week.weekStart)}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 2 }}>
                <Grid container spacing={3}>
                  {week.plans.map((plan, index) => (
                    <Grid item xs={12} key={plan.date}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <Paper
                          elevation={2}
                          sx={{
                            borderRadius: 3,
                            borderLeft:
                              plan.date === todayISO
                                ? `4px solid ${theme.palette.primary.main}`
                                : "none",
                            overflow: "hidden",
                          }}
                        >
                          <Box
                            sx={{
                              p: 2,
                              bgcolor:
                                plan.date === todayISO
                                  ? "primary.light"
                                  : "background.paper",
                              borderBottom: "1px solid",
                              borderColor: "divider",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <CalendarToday
                                sx={{
                                  mr: 1,
                                  color:
                                    plan.date === todayISO
                                      ? "primary.main"
                                      : "text.secondary",
                                }}
                              />
                              <Typography
                                variant="subtitle1"
                                fontWeight={600}
                                color={
                                  plan.date === todayISO
                                    ? "primary.main"
                                    : "inherit"
                                }
                              >
                                {formatDate(plan.date)}
                              </Typography>
                              {plan.date === todayISO && (
                                <Chip
                                  label="Today"
                                  size="small"
                                  color="primary"
                                  sx={{ ml: 1 }}
                                />
                              )}
                            </Box>
                            <Button
                              variant="outlined"
                              color="primary"
                              size="small"
                              startIcon={<Check />}
                              onClick={() => handleOpenConfirmDialog(plan.date)}
                            >
                              Mark Complete
                            </Button>
                          </Box>

                          <Box sx={{ p: { xs: 2, md: 3 } }}>
                            <Grid container spacing={3}>
                              {/* Breakfast Card */}
                              <Grid item xs={12} md={4}>
                                <Card
                                  sx={{
                                    height: "100%",
                                    borderRadius: 2,
                                    boxShadow: "none",
                                    border: "1px solid",
                                    borderColor: "divider",
                                  }}
                                >
                                  <CardContent sx={{ p: 2 }}>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        mb: 1,
                                      }}
                                    >
                                      <FastfoodOutlined
                                        sx={{
                                          mr: 1,
                                          color: theme.palette.warning.main,
                                          fontSize: 20,
                                        }}
                                      />
                                      <Typography
                                        variant="subtitle1"
                                        fontWeight={500}
                                      >
                                        Breakfast
                                      </Typography>
                                    </Box>
                                    <Typography
                                      variant="body1"
                                      sx={{ fontWeight: 600, mb: 1 }}
                                    >
                                      {plan.breakfast.name}
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                      sx={{
                                        mb: 2,
                                        display: "-webkit-box",
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: "vertical",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                      }}
                                    >
                                      {plan.breakfast.recipe.description}
                                    </Typography>
                                  </CardContent>
                                  <CardActions
                                    sx={{
                                      p: 2,
                                      pt: 0,
                                      justifyContent: "flex-end",
                                    }}
                                  >
                                    <Button
                                      size="small"
                                      endIcon={<KeyboardArrowRight />}
                                      onClick={() =>
                                        navigate(
                                          `/recipe/${plan.date}/breakfast`
                                        )
                                      }
                                    >
                                      View Recipe
                                    </Button>
                                  </CardActions>
                                </Card>
                              </Grid>

                              {/* Lunch Card */}
                              <Grid item xs={12} md={4}>
                                <Card
                                  sx={{
                                    height: "100%",
                                    borderRadius: 2,
                                    boxShadow: "none",
                                    border: "1px solid",
                                    borderColor: "divider",
                                  }}
                                >
                                  <CardContent sx={{ p: 2 }}>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        mb: 1,
                                      }}
                                    >
                                      <LocalDiningOutlined
                                        sx={{
                                          mr: 1,
                                          color: theme.palette.primary.main,
                                          fontSize: 20,
                                        }}
                                      />
                                      <Typography
                                        variant="subtitle1"
                                        fontWeight={500}
                                      >
                                        Lunch
                                      </Typography>
                                    </Box>
                                    <Typography
                                      variant="body1"
                                      sx={{ fontWeight: 600, mb: 1 }}
                                    >
                                      {plan.lunch.name}
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                      sx={{
                                        mb: 2,
                                        display: "-webkit-box",
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: "vertical",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                      }}
                                    >
                                      {plan.lunch.recipe.description}
                                    </Typography>
                                  </CardContent>
                                  <CardActions
                                    sx={{
                                      p: 2,
                                      pt: 0,
                                      justifyContent: "flex-end",
                                    }}
                                  >
                                    <Button
                                      size="small"
                                      endIcon={<KeyboardArrowRight />}
                                      onClick={() =>
                                        navigate(`/recipe/${plan.date}/lunch`)
                                      }
                                    >
                                      View Recipe
                                    </Button>
                                  </CardActions>
                                </Card>
                              </Grid>

                              {/* Dinner Card */}
                              <Grid item xs={12} md={4}>
                                <Card
                                  sx={{
                                    height: "100%",
                                    borderRadius: 2,
                                    boxShadow: "none",
                                    border: "1px solid",
                                    borderColor: "divider",
                                  }}
                                >
                                  <CardContent sx={{ p: 2 }}>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        mb: 1,
                                      }}
                                    >
                                      <DinnerDiningOutlined
                                        sx={{
                                          mr: 1,
                                          color: theme.palette.secondary.main,
                                          fontSize: 20,
                                        }}
                                      />
                                      <Typography
                                        variant="subtitle1"
                                        fontWeight={500}
                                      >
                                        Dinner
                                      </Typography>
                                    </Box>
                                    <Typography
                                      variant="body1"
                                      sx={{ fontWeight: 600, mb: 1 }}
                                    >
                                      {plan.dinner.name}
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                      sx={{
                                        mb: 2,
                                        display: "-webkit-box",
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: "vertical",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                      }}
                                    >
                                      {plan.dinner.recipe.description}
                                    </Typography>
                                  </CardContent>
                                  <CardActions
                                    sx={{
                                      p: 2,
                                      pt: 0,
                                      justifyContent: "flex-end",
                                    }}
                                  >
                                    <Button
                                      size="small"
                                      endIcon={<KeyboardArrowRight />}
                                      onClick={() =>
                                        navigate(`/recipe/${plan.date}/dinner`)
                                      }
                                    >
                                      View Recipe
                                    </Button>
                                  </CardActions>
                                </Card>
                              </Grid>
                            </Grid>
                          </Box>
                        </Paper>
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      )}

      {/* Generate Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseGenerateDialog}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Generate Meal Plan</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            How many days would you like to generate meal plans for?
            {plannedDays > 0 && ` (${7 - plannedDays} days available)`}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="days"
            label="Number of Days"
            type="number"
            fullWidth
            variant="outlined"
            value={daysToGenerate}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              if (value > 0 && value <= 7 - plannedDays) {
                setDaysToGenerate(value);
              }
            }}
            InputProps={{
              inputProps: {
                min: 1,
                max: 7 - plannedDays,
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseGenerateDialog}>Cancel</Button>
          <Button
            onClick={handleGenerateMealPlan}
            variant="contained"
            color="primary"
          >
            Generate
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Dialog */}
      <Dialog open={confirmDialogOpen} onClose={handleCloseConfirmDialog}>
        <DialogTitle>Mark as Complete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to mark the meal plan for{" "}
            {dateToComplete ? formatDate(dateToComplete) : ""} as complete? This
            will remove it from your plan.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog}>Cancel</Button>
          <Button
            onClick={handleMarkComplete}
            variant="contained"
            color="primary"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MealPlans;
