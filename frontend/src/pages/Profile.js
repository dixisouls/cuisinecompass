import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Chip,
  Autocomplete,
  Slider,
  InputAdornment,
  CircularProgress,
  Divider,
  IconButton,
  Alert,
  Card,
  CardContent,
  Avatar,
  Tab,
  Tabs,
} from "@mui/material";
import {
  Person,
  FoodBank,
  NoFood,
  LocalDining,
  Restaurant,
  Savings,
  Add,
  Edit,
  Save,
  Cancel,
} from "@mui/icons-material";
import { userApi } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

// Common dietary restrictions
const DIETARY_RESTRICTIONS = [
  "Vegetarian",
  "Vegan",
  "Pescatarian",
  "Gluten-Free",
  "Dairy-Free",
  "Nut-Free",
  "Keto",
  "Paleo",
  "Low-Carb",
  "Low-Fat",
  "Low-Sodium",
  "Halal",
  "Kosher",
];

// Common allergens
const COMMON_ALLERGENS = [
  "Peanuts",
  "Tree Nuts",
  "Milk",
  "Eggs",
  "Fish",
  "Shellfish",
  "Soy",
  "Wheat",
  "Gluten",
  "Sesame",
  "Mustard",
  "Celery",
  "Sulphites",
];

// Popular cuisines
const CUISINES = [
  "Italian",
  "Mexican",
  "Chinese",
  "Japanese",
  "Thai",
  "Indian",
  "French",
  "Mediterranean",
  "American",
  "Greek",
  "Spanish",
  "Lebanese",
  "Turkish",
  "Korean",
  "Vietnamese",
];

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
};

const Profile = () => {
  const { currentUser, fetchUserProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  // Profile state
  const [profile, setProfile] = useState({
    dietary_restrictions: [],
    allergies: [],
    disliked_ingredients: [],
    preferred_cuisines: [],
    target_daily_calories: 2000,
    target_macros_pct: {
      protein: 30,
      carbs: 40,
      fat: 30,
    },
  });

  // State for adding new items
  const [newDislikedIngredient, setNewDislikedIngredient] = useState("");

  // Editing states
  const [editingMacros, setEditingMacros] = useState(false);
  const [tempMacros, setTempMacros] = useState({
    protein: 30,
    carbs: 40,
    fat: 30,
  });

  // New state for editing calories
  const [editingCalories, setEditingCalories] = useState(false);
  const [tempCalories, setTempCalories] = useState(2000);

  // Load user profile data
  useEffect(() => {
    if (currentUser?.profile) {
      setProfile(currentUser.profile);
      setTempMacros(currentUser.profile.target_macros_pct);
      setTempCalories(currentUser.profile.target_daily_calories);
    }
  }, [currentUser]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Handle dietary restrictions change
  const handleDietaryRestrictionsChange = async (event, newValue) => {
    try {
      setLoading(true);
      setSaveSuccess(false);

      await userApi.updateDietaryRestrictions(newValue);
      await fetchUserProfile();

      setSaveSuccess(true);
    } catch (error) {
      console.error("Error updating dietary restrictions:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle allergies change
  const handleAllergiesChange = async (event, newValue) => {
    try {
      setLoading(true);
      setSaveSuccess(false);

      await userApi.updateAllergies(newValue);
      await fetchUserProfile();

      setSaveSuccess(true);
    } catch (error) {
      console.error("Error updating allergies:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle disliked ingredients change
  const handleAddDislikedIngredient = async () => {
    if (!newDislikedIngredient.trim()) return;

    try {
      setLoading(true);
      setSaveSuccess(false);

      const updatedIngredients = [
        ...profile.disliked_ingredients,
        newDislikedIngredient.trim(),
      ];
      await userApi.updateDislikedIngredients(updatedIngredients);
      await fetchUserProfile();

      setNewDislikedIngredient("");
      setSaveSuccess(true);
    } catch (error) {
      console.error("Error updating disliked ingredients:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle remove disliked ingredient
  const handleRemoveDislikedIngredient = async (ingredient) => {
    try {
      setLoading(true);
      setSaveSuccess(false);

      const updatedIngredients = profile.disliked_ingredients.filter(
        (item) => item !== ingredient
      );
      await userApi.updateDislikedIngredients(updatedIngredients);
      await fetchUserProfile();

      setSaveSuccess(true);
    } catch (error) {
      console.error("Error updating disliked ingredients:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle preferred cuisines change
  const handlePreferredCuisinesChange = async (event, newValue) => {
    try {
      setLoading(true);
      setSaveSuccess(false);

      await userApi.updatePreferredCuisines(newValue);
      await fetchUserProfile();

      setSaveSuccess(true);
    } catch (error) {
      console.error("Error updating preferred cuisines:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle calories edit
  const handleStartEditingCalories = () => {
    setTempCalories(profile.target_daily_calories);
    setEditingCalories(true);
  };

  const handleCancelEditingCalories = () => {
    setEditingCalories(false);
  };

  const handleTempCaloriesChange = (event, newValue) => {
    setTempCalories(newValue);
  };

  const handleSaveCalories = async () => {
    try {
      setLoading(true);
      setSaveSuccess(false);

      await userApi.updateGoals(tempCalories, profile.target_macros_pct);
      await fetchUserProfile();

      setEditingCalories(false);
      setSaveSuccess(true);
    } catch (error) {
      console.error("Error updating calories:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle macros edit
  const handleStartEditingMacros = () => {
    setTempMacros({ ...profile.target_macros_pct });
    setEditingMacros(true);
  };

  const handleCancelEditingMacros = () => {
    setEditingMacros(false);
  };

  const handleMacroChange = (macro, value) => {
    // Ensure value is a number
    const numValue = parseInt(value) || 0;

    // Update the specific macro
    setTempMacros({
      ...tempMacros,
      [macro]: numValue,
    });
  };

  const handleSaveMacros = async () => {
    // Validate that macros sum to 100%
    const sum = tempMacros.protein + tempMacros.carbs + tempMacros.fat;
    if (sum !== 100) {
      // Normalize to 100% if not exactly 100
      tempMacros.protein = Math.round((tempMacros.protein / sum) * 100);
      tempMacros.carbs = Math.round((tempMacros.carbs / sum) * 100);
      tempMacros.fat = 100 - tempMacros.protein - tempMacros.carbs;
    }

    try {
      setLoading(true);
      setSaveSuccess(false);

      await userApi.updateGoals(profile.target_daily_calories, tempMacros);
      await fetchUserProfile();

      setEditingMacros(false);
      setSaveSuccess(true);
    } catch (error) {
      console.error("Error updating macros:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
        Your Profile
      </Typography>

      <AnimatePresence>
        {saveSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Alert
              severity="success"
              sx={{ mb: 3, borderRadius: 2 }}
              onClose={() => setSaveSuccess(false)}
            >
              Your profile has been updated successfully!
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      <Grid container spacing={4}>
        {/* User Info Card */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 4,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <Avatar
              sx={{
                bgcolor: "primary.main",
                width: 100,
                height: 100,
                fontSize: 40,
                mb: 2,
              }}
            >
              {currentUser?.first_name ? currentUser.first_name[0] : "U"}
            </Avatar>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
              {`${currentUser?.first_name || ""} ${
                currentUser?.last_name || ""
              }`}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {currentUser?.email || "User"}
            </Typography>
            <Divider flexItem sx={{ mb: 3 }} />
            <Button
              variant="outlined"
              color="primary"
              startIcon={<Edit />}
              component="a"
              href="/change-password"
              sx={{ mb: 2 }}
            >
              Change Password
            </Button>
          </Paper>
        </Grid>

        {/* Profile Settings */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ borderRadius: 4, p: 3 }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="profile settings tabs"
              >
                <Tab
                  icon={<FoodBank />}
                  label="Dietary Preferences"
                  id="profile-tab-0"
                  aria-controls="profile-tabpanel-0"
                />
                <Tab
                  icon={<NoFood />}
                  label="Restrictions & Allergies"
                  id="profile-tab-1"
                  aria-controls="profile-tabpanel-1"
                />
                <Tab
                  icon={<Savings />}
                  label="Nutrition Goals"
                  id="profile-tab-2"
                  aria-controls="profile-tabpanel-2"
                />
              </Tabs>
            </Box>

            {/* Dietary Preferences */}
            <TabPanel value={activeTab} index={0}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Preferred Cuisines
                  </Typography>
                  <Autocomplete
                    multiple
                    id="preferred-cuisines"
                    options={CUISINES}
                    value={profile.preferred_cuisines}
                    onChange={handlePreferredCuisinesChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="Select preferred cuisines"
                        placeholder="Add cuisines"
                      />
                    )}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          label={option}
                          {...getTagProps({ index })}
                          key={option}
                          color="primary"
                          variant="outlined"
                          sx={{ m: 0.5 }}
                        />
                      ))
                    }
                    loading={loading}
                    disabled={loading}
                    sx={{ mb: 4 }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Disliked Ingredients
                  </Typography>
                  <Box sx={{ display: "flex", mb: 2 }}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      label="Add ingredient you dislike"
                      value={newDislikedIngredient}
                      onChange={(e) => setNewDislikedIngredient(e.target.value)}
                      disabled={loading}
                      sx={{ mr: 1 }}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleAddDislikedIngredient}
                      disabled={loading || !newDislikedIngredient.trim()}
                      sx={{ minWidth: "120px" }}
                    >
                      {loading ? <CircularProgress size={24} /> : "Add"}
                    </Button>
                  </Box>
                  <Box
                    sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}
                  >
                    {profile.disliked_ingredients.map((ingredient) => (
                      <Chip
                        key={ingredient}
                        label={ingredient}
                        onDelete={() =>
                          handleRemoveDislikedIngredient(ingredient)
                        }
                        color="secondary"
                        sx={{ m: 0.5 }}
                      />
                    ))}
                    {profile.disliked_ingredients.length === 0 && (
                      <Typography variant="body2" color="text.secondary">
                        You haven't added any disliked ingredients yet.
                      </Typography>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </TabPanel>

            {/* Restrictions & Allergies */}
            <TabPanel value={activeTab} index={1}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Dietary Restrictions
                  </Typography>
                  <Autocomplete
                    multiple
                    id="dietary-restrictions"
                    options={DIETARY_RESTRICTIONS}
                    value={profile.dietary_restrictions}
                    onChange={handleDietaryRestrictionsChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="Select dietary restrictions"
                        placeholder="Add restrictions"
                      />
                    )}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          label={option}
                          {...getTagProps({ index })}
                          key={option}
                          color="primary"
                          variant="outlined"
                          sx={{ m: 0.5 }}
                        />
                      ))
                    }
                    loading={loading}
                    disabled={loading}
                    sx={{ mb: 4 }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Allergies
                  </Typography>
                  <Autocomplete
                    multiple
                    id="allergies"
                    options={COMMON_ALLERGENS}
                    value={profile.allergies}
                    onChange={handleAllergiesChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="Select allergies"
                        placeholder="Add allergies"
                      />
                    )}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          label={option}
                          {...getTagProps({ index })}
                          key={option}
                          color="error"
                          variant="outlined"
                          sx={{ m: 0.5 }}
                        />
                      ))
                    }
                    loading={loading}
                    disabled={loading}
                  />
                </Grid>
              </Grid>
            </TabPanel>

            {/* Nutrition Goals */}
            <TabPanel value={activeTab} index={2}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Typography variant="h6">Daily Calorie Target</Typography>
                    {!editingCalories ? (
                      <Button
                        startIcon={<Edit />}
                        onClick={handleStartEditingCalories}
                        disabled={loading}
                      >
                        Edit
                      </Button>
                    ) : (
                      <Box>
                        <IconButton
                          color="primary"
                          onClick={handleSaveCalories}
                          disabled={loading}
                        >
                          <Save />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={handleCancelEditingCalories}
                          disabled={loading}
                        >
                          <Cancel />
                        </IconButton>
                      </Box>
                    )}
                  </Box>
                  <Box sx={{ px: 2, py: 1 }}>
                    <Slider
                      value={
                        editingCalories
                          ? tempCalories
                          : profile.target_daily_calories
                      }
                      min={1000}
                      max={4000}
                      step={50}
                      onChange={handleTempCaloriesChange}
                      valueLabelDisplay="auto"
                      marks={[
                        { value: 1000, label: "1000" },
                        { value: 2000, label: "2000" },
                        { value: 3000, label: "3000" },
                        { value: 4000, label: "4000" },
                      ]}
                      disabled={loading || !editingCalories}
                    />
                    <Typography
                      variant="body1"
                      align="center"
                      sx={{ mt: 2, fontWeight: 500 }}
                    >
                      {editingCalories
                        ? tempCalories
                        : profile.target_daily_calories}{" "}
                      calories per day
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Typography variant="h6">Macronutrient Targets</Typography>
                    {!editingMacros ? (
                      <Button
                        startIcon={<Edit />}
                        onClick={handleStartEditingMacros}
                        disabled={loading}
                      >
                        Edit
                      </Button>
                    ) : (
                      <Box>
                        <IconButton
                          color="primary"
                          onClick={handleSaveMacros}
                          disabled={loading}
                        >
                          <Save />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={handleCancelEditingMacros}
                          disabled={loading}
                        >
                          <Cancel />
                        </IconButton>
                      </Box>
                    )}
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <Card
                        sx={{
                          height: "100%",
                          bgcolor: "success.light",
                          color: "success.contrastText",
                        }}
                      >
                        <CardContent>
                          <Typography variant="h6" sx={{ mb: 1 }}>
                            Protein
                          </Typography>
                          {editingMacros ? (
                            <TextField
                              fullWidth
                              variant="outlined"
                              value={tempMacros.protein}
                              onChange={(e) =>
                                handleMacroChange("protein", e.target.value)
                              }
                              type="number"
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    %
                                  </InputAdornment>
                                ),
                              }}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  bgcolor: "white",
                                },
                              }}
                            />
                          ) : (
                            <Typography variant="h4" sx={{ fontWeight: 700 }}>
                              {profile.target_macros_pct.protein}%
                            </Typography>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Card
                        sx={{
                          height: "100%",
                          bgcolor: "warning.light",
                          color: "warning.contrastText",
                        }}
                      >
                        <CardContent>
                          <Typography variant="h6" sx={{ mb: 1 }}>
                            Carbs
                          </Typography>
                          {editingMacros ? (
                            <TextField
                              fullWidth
                              variant="outlined"
                              value={tempMacros.carbs}
                              onChange={(e) =>
                                handleMacroChange("carbs", e.target.value)
                              }
                              type="number"
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    %
                                  </InputAdornment>
                                ),
                              }}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  bgcolor: "white",
                                },
                              }}
                            />
                          ) : (
                            <Typography variant="h4" sx={{ fontWeight: 700 }}>
                              {profile.target_macros_pct.carbs}%
                            </Typography>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Card
                        sx={{
                          height: "100%",
                          bgcolor: "secondary.light",
                          color: "secondary.contrastText",
                        }}
                      >
                        <CardContent>
                          <Typography variant="h6" sx={{ mb: 1 }}>
                            Fat
                          </Typography>
                          {editingMacros ? (
                            <TextField
                              fullWidth
                              variant="outlined"
                              value={tempMacros.fat}
                              onChange={(e) =>
                                handleMacroChange("fat", e.target.value)
                              }
                              type="number"
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    %
                                  </InputAdornment>
                                ),
                              }}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  bgcolor: "white",
                                },
                              }}
                            />
                          ) : (
                            <Typography variant="h4" sx={{ fontWeight: 700 }}>
                              {profile.target_macros_pct.fat}%
                            </Typography>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                  {editingMacros && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 2 }}
                    >
                      Note: Values should add up to 100%. They will be
                      automatically adjusted if needed.
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;
