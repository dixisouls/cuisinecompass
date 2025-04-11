import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
  Button,
  CircularProgress,
  Card,
  CardContent,
  IconButton,
  useMediaQuery,
  Alert,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Container,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  AccessTime,
  RestaurantMenu,
  ArrowBack,
  CheckCircle,
  FiberManualRecord,
  Kitchen,
  Timer,
  LocalDining,
  Check,
  Print,
  Share,
} from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import { mealPlanApi } from "../services/api";
import { motion, AnimatePresence } from "framer-motion";

const RecipeDetails = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const { date, mealType } = useParams();

  const [loading, setLoading] = useState(true);
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState(null);
  const [activeStep, setActiveStep] = useState(-1);

  // Load recipe data on component mount
  useEffect(() => {
    fetchRecipe();
  }, [date, mealType]);

  const fetchRecipe = async () => {
    try {
      setLoading(true);
      const response = await mealPlanApi.getUserMealPlans();

      // Find the recipe in the meal plans
      let foundRecipe = null;

      for (const plan of response.data) {
        // Find the day key that matches the date
        const dayKey = Object.entries(plan.dates).find(
          ([key, value]) => value === date
        )?.[0];

        if (dayKey && plan.days && plan.days[dayKey]) {
          // Convert meal type to proper case for object access
          const mealTypeProper =
            mealType.charAt(0).toUpperCase() + mealType.slice(1).toLowerCase();

          if (plan.days[dayKey][mealTypeProper]) {
            foundRecipe = plan.days[dayKey][mealTypeProper];
            break;
          }
        }
      }

      if (foundRecipe) {
        setRecipe(foundRecipe);
      } else {
        setError(
          "Recipe not found. It may have been removed or marked as complete."
        );
      }
    } catch (error) {
      console.error("Error fetching recipe:", error);
      setError("Failed to load recipe details. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Format meal type for display
  const formatMealType = (type) => {
    return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
  };

  // Format date for display
  const formatDate = (dateString) => {
    // Force the date to be parsed in local timezone by appending T00:00:00
    const date = new Date(`${dateString}T00:00:00`);
    const options = { weekday: "long", month: "short", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  // Print recipe
  const handlePrint = () => {
    window.print();
  };

  // Share recipe
  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: recipe.name,
          text: `Check out this recipe: ${recipe.name}`,
          url: window.location.href,
        })
        .catch((error) => console.error("Error sharing", error));
    }
  };

  // Handle step change for mobile instruction view
  const handleStepChange = (step) => {
    setActiveStep(activeStep === step ? -1 : step);
  };

  // Calculate total time
  const getTotalTime = (prepTime, cookTime) => {
    return prepTime + cookTime;
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{ mb: 3 }}
        >
          Back
        </Button>
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  if (!recipe) {
    return null;
  }

  return (
    <Box
      className="recipe-details-container"
      sx={{ pb: 4, overflowX: "hidden" }}
    >
      {/* Back button and actions */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          variant="outlined"
        >
          Back
        </Button>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            startIcon={<Print />}
            variant="outlined"
            onClick={handlePrint}
            sx={{ display: { xs: "none", sm: "flex" } }}
          >
            Print
          </Button>
          {navigator.share && (
            <Button
              startIcon={<Share />}
              variant="outlined"
              onClick={handleShare}
              sx={{ display: { xs: "none", sm: "flex" } }}
            >
              Share
            </Button>
          )}
          {/* Mobile action buttons */}
          <Box sx={{ display: { xs: "flex", sm: "none" } }}>
            <IconButton onClick={handlePrint} color="primary" size="small">
              <Print />
            </IconButton>
            {navigator.share && (
              <IconButton onClick={handleShare} color="primary" size="small">
                <Share />
              </IconButton>
            )}
          </Box>
        </Box>
      </Box>

      {/* Recipe Header */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 3,
              mb: 4,
              borderRadius: 4,
              background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
              color: "white",
              width: "100%",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                width: "100%",
              }}
            >
              <Chip
                label={formatMealType(mealType)}
                color="secondary"
                sx={{
                  mb: 2,
                  fontWeight: 600,
                  bgcolor: "white",
                  color: "primary.main",
                }}
              />
              <Typography
                variant="h4"
                component="h1"
                sx={{ mb: 1, fontWeight: 700 }}
              >
                {recipe.name}
              </Typography>
              <Typography variant="subtitle1" sx={{ mb: 3, opacity: 0.9 }}>
                {formatDate(date)}
              </Typography>

              {/* MODIFIED SECTION START - Time Cards */}
              <Container sx={{ width: "100%", maxWidth: "100%" }}>
                <Grid
                  container
                  spacing={isMobile ? 2 : 4}
                  justifyContent="center"
                  sx={{
                    width: "100%",
                    m: 0,
                    px: isMobile ? 0 : 2,
                  }}
                >
                  <Grid
                    item
                    xs={12}
                    sm={4}
                    sx={{
                      p: { xs: 1, sm: 2 },
                      width: "100%",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        bgcolor: "rgba(255,255,255,0.1)",
                        p: 2,
                        borderRadius: 2,
                        height: "100%",
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <Kitchen sx={{ mr: 1 }} />
                        <Typography variant="body1">Prep Time</Typography>
                      </Box>
                      <Typography variant="h6" fontWeight={600}>
                        {recipe.recipe.prepTimeMins} mins
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    sm={4}
                    sx={{
                      p: { xs: 1, sm: 2 },
                      width: "100%",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        bgcolor: "rgba(255,255,255,0.1)",
                        p: 2,
                        borderRadius: 2,
                        height: "100%",
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <Timer sx={{ mr: 1 }} />
                        <Typography variant="body1">Cook Time</Typography>
                      </Box>
                      <Typography variant="h6" fontWeight={600}>
                        {recipe.recipe.cookTimeMins} mins
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    sm={4}
                    sx={{
                      p: { xs: 1, sm: 2 },
                      width: "100%",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        bgcolor: "rgba(255,255,255,0.1)",
                        p: 2,
                        borderRadius: 2,
                        height: "100%",
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <AccessTime sx={{ mr: 1 }} />
                        <Typography variant="body1">Total Time</Typography>
                      </Box>
                      <Typography variant="h6" fontWeight={600}>
                        {getTotalTime(
                          recipe.recipe.prepTimeMins,
                          recipe.recipe.cookTimeMins
                        )}{" "}
                        mins
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Container>
              {/* MODIFIED SECTION END */}
            </Box>
          </Paper>
        </motion.div>
      </AnimatePresence>

      {/* Recipe Description */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            About This Recipe
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {recipe.recipe.description}
          </Typography>
        </Paper>
      </motion.div>

      {/* Recipe Content */}
      <Grid container spacing={4}>
        {/* Ingredients */}
        <Grid item xs={12} md={4}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Paper
              elevation={2}
              sx={{
                borderRadius: 4,
                height: "100%",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  p: 2,
                  bgcolor: "primary.light",
                  borderBottom: "1px solid",
                  borderColor: "divider",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <RestaurantMenu sx={{ mr: 1, color: "primary.main" }} />
                <Typography variant="h6">Ingredients</Typography>
              </Box>
              <Box sx={{ p: 2 }}>
                <List dense sx={{ py: 0 }}>
                  {recipe.recipe.ingredients.map((ingredient, index) => (
                    <React.Fragment key={index}>
                      <ListItem sx={{ py: 1.5 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <FiberManualRecord
                            sx={{ fontSize: 10, color: "primary.main" }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box component="span" sx={{ fontWeight: 500 }}>
                              {`${ingredient.quantity} ${ingredient.unit} ${ingredient.item}`}
                            </Box>
                          }
                          secondary={ingredient.notes}
                        />
                      </ListItem>
                      {index < recipe.recipe.ingredients.length - 1 && (
                        <Divider variant="inset" component="li" />
                      )}
                    </React.Fragment>
                  ))}
                </List>
              </Box>
            </Paper>
          </motion.div>
        </Grid>

        {/* Instructions */}
        <Grid item xs={12} md={8}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Paper
              elevation={2}
              sx={{
                borderRadius: 4,
                height: "100%",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  p: 2,
                  bgcolor: "secondary.light",
                  borderBottom: "1px solid",
                  borderColor: "divider",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <LocalDining sx={{ mr: 1, color: "secondary.main" }} />
                <Typography variant="h6">Instructions</Typography>
              </Box>

              {/* Desktop Instructions */}
              <Box sx={{ p: 3, display: { xs: "none", md: "block" } }}>
                <List>
                  {recipe.recipe.instructions.map((instruction, index) => (
                    <ListItem
                      key={index}
                      alignItems="flex-start"
                      sx={{
                        py: 2,
                        px: 0,
                        borderBottom:
                          index < recipe.recipe.instructions.length - 1
                            ? "1px solid"
                            : "none",
                        borderColor: "divider",
                      }}
                    >
                      <ListItemIcon>
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            bgcolor: "secondary.light",
                            color: "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 600,
                          }}
                        >
                          {index + 1}
                        </Box>
                      </ListItemIcon>
                      <ListItemText primary={instruction} sx={{ m: 0 }} />
                    </ListItem>
                  ))}
                </List>
              </Box>

              {/* Mobile Instructions Stepper */}
              <Box sx={{ p: 2, display: { xs: "block", md: "none" } }}>
                <Stepper
                  nonLinear
                  activeStep={activeStep}
                  orientation="vertical"
                >
                  {recipe.recipe.instructions.map((instruction, index) => (
                    <Step key={index} completed={false}>
                      <StepLabel
                        optional={
                          <Typography variant="caption">
                            Step {index + 1}
                          </Typography>
                        }
                        onClick={() => handleStepChange(index)}
                        sx={{ cursor: "pointer" }}
                      >
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: activeStep === index ? 600 : 400,
                            color:
                              activeStep === index
                                ? "secondary.main"
                                : "inherit",
                          }}
                        >
                          {instruction.length > 30
                            ? `${instruction.substring(0, 30)}...`
                            : instruction}
                        </Typography>
                      </StepLabel>
                      <StepContent>
                        <Typography>{instruction}</Typography>
                        <Box sx={{ mt: 2 }}>
                          <Button
                            variant="contained"
                            onClick={() => handleStepChange(-1)}
                            sx={{ mt: 1, mr: 1 }}
                            size="small"
                          >
                            Done
                          </Button>
                          {index < recipe.recipe.instructions.length - 1 && (
                            <Button
                              onClick={() => handleStepChange(index + 1)}
                              sx={{ mt: 1, mr: 1 }}
                              size="small"
                            >
                              Next
                            </Button>
                          )}
                        </Box>
                      </StepContent>
                    </Step>
                  ))}
                </Stepper>
              </Box>
            </Paper>
          </motion.div>
        </Grid>
      </Grid>

      {/* Cook Confirmation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            startIcon={<Check />}
            onClick={() => navigate("/meal-plans")}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 8,
              boxShadow: 4,
            }}
          >
            I Cooked This!
          </Button>
        </Box>
      </motion.div>

      {/* Print Styles (hidden in normal view) */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .recipe-details-container,
          .recipe-details-container * {
            visibility: visible;
          }
          .recipe-details-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          button,
          .MuiIconButton-root {
            display: none !important;
          }
        }
      `}</style>
    </Box>
  );
};

export default RecipeDetails;
