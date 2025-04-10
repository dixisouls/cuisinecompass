import React from "react";
import { Box, Typography, Button, Container, Paper } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { Home, ArrowBack } from "@mui/icons-material";
import { motion } from "framer-motion";

const NotFound = () => {
  return (
    <Container maxWidth="md">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 5,
            mt: 8,
            borderRadius: 4,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h1"
            component="h1"
            color="primary"
            sx={{
              fontSize: { xs: "4rem", md: "6rem" },
              fontWeight: 700,
              mb: 2,
            }}
          >
            404
          </Typography>

          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            sx={{
              mb: 2,
              fontWeight: 600,
            }}
          >
            Page Not Found
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 4, maxWidth: 600 }}
          >
            Oops! We couldn't find the page you're looking for. It might have
            been moved, deleted, or perhaps you typed in the wrong URL.
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <Button
              component={RouterLink}
              to="/"
              variant="contained"
              color="primary"
              startIcon={<Home />}
              size="large"
              sx={{
                px: 3,
                py: 1.2,
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
              Go to Homepage
            </Button>
            <Button
              onClick={() => window.history.back()}
              variant="outlined"
              color="primary"
              startIcon={<ArrowBack />}
              size="large"
              sx={{ px: 3, py: 1.2 }}
            >
              Go Back
            </Button>
          </Box>

          {/* Fun food illustration */}
          <Box
            sx={{
              mt: 6,
              mb: 3,
              fontSize: { xs: "5rem", md: "8rem" },
              display: "flex",
              justifyContent: "center",
              opacity: 0.8,
            }}
          >
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              🍽️
            </motion.div>
          </Box>

          <Typography variant="body2" color="text.secondary">
            Let's get you back to something delicious!
          </Typography>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default NotFound;
