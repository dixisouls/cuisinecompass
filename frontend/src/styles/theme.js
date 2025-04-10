import { createTheme } from "@mui/material/styles";

// Custom color palette
const theme = createTheme({
  palette: {
    primary: {
      main: "#4CAF50", // Green - health and freshness
      light: "#81C784",
      dark: "#388E3C",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#FFA726", // Orange - food and energy
      light: "#FFB74D",
      dark: "#F57C00",
      contrastText: "#FFFFFF",
    },
    accent: {
      main: "#FF5722", // Deep Orange - for accent elements
      light: "#FF8A65",
      dark: "#E64A19",
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#F5F5F5",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#333333",
      secondary: "#666666",
    },
    success: {
      main: "#43A047",
      light: "#66BB6A",
      dark: "#2E7D32",
      contrastText: "#FFFFFF",
    },
    warning: {
      main: "#FDD835",
      light: "#FFEE58",
      dark: "#FBC02D",
      contrastText: "#333333",
    },
    error: {
      main: "#E53935",
      light: "#EF5350",
      dark: "#C62828",
      contrastText: "#FFFFFF",
    },
  },
  typography: {
    fontFamily: [
      "Poppins",
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
    h1: {
      fontWeight: 700,
      fontSize: "2.5rem",
      "@media (max-width:600px)": {
        fontSize: "2rem",
      },
    },
    h2: {
      fontWeight: 600,
      fontSize: "2rem",
      "@media (max-width:600px)": {
        fontSize: "1.8rem",
      },
    },
    h3: {
      fontWeight: 600,
      fontSize: "1.8rem",
      "@media (max-width:600px)": {
        fontSize: "1.5rem",
      },
    },
    h4: {
      fontWeight: 600,
      fontSize: "1.5rem",
      "@media (max-width:600px)": {
        fontSize: "1.3rem",
      },
    },
    h5: {
      fontWeight: 500,
      fontSize: "1.3rem",
      "@media (max-width:600px)": {
        fontSize: "1.1rem",
      },
    },
    h6: {
      fontWeight: 500,
      fontSize: "1.1rem",
      "@media (max-width:600px)": {
        fontSize: "1rem",
      },
    },
    subtitle1: {
      fontSize: "1rem",
      fontWeight: 500,
    },
    subtitle2: {
      fontSize: "0.9rem",
      fontWeight: 500,
    },
    body1: {
      fontSize: "1rem",
    },
    body2: {
      fontSize: "0.9rem",
    },
    button: {
      fontWeight: 600,
      textTransform: "none",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "10px 24px",
          boxShadow: "none",
          textTransform: "none",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            transform: "translateY(-2px)",
          },
        },
        containedPrimary: {
          background: "linear-gradient(to right, #4CAF50, #66BB6A)",
          "&:hover": {
            background: "linear-gradient(to right, #388E3C, #4CAF50)",
          },
        },
        containedSecondary: {
          background: "linear-gradient(to right, #FFA726, #FFB74D)",
          "&:hover": {
            background: "linear-gradient(to right, #F57C00, #FFA726)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
            transform: "translateY(-4px)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
            "&.Mui-focused fieldset": {
              borderWidth: 2,
            },
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        },
      },
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    "none",
    "0px 2px 4px rgba(0,0,0,0.05)",
    "0px 4px 8px rgba(0,0,0,0.05)",
    "0px 6px 12px rgba(0,0,0,0.05)",
    "0px 8px 16px rgba(0,0,0,0.05)",
    "0px 10px 20px rgba(0,0,0,0.05)",
    "0px 12px 24px rgba(0,0,0,0.05)",
    "0px 14px 28px rgba(0,0,0,0.05)",
    "0px 16px 32px rgba(0,0,0,0.05)",
    "0px 18px 36px rgba(0,0,0,0.05)",
    "0px 20px 40px rgba(0,0,0,0.05)",
    "0px 22px 44px rgba(0,0,0,0.05)",
    "0px 24px 48px rgba(0,0,0,0.05)",
    "0px 26px 52px rgba(0,0,0,0.05)",
    "0px 28px 56px rgba(0,0,0,0.05)",
    "0px 30px 60px rgba(0,0,0,0.05)",
    "0px 32px 64px rgba(0,0,0,0.05)",
    "0px 34px 68px rgba(0,0,0,0.05)",
    "0px 36px 72px rgba(0,0,0,0.05)",
    "0px 38px 76px rgba(0,0,0,0.05)",
    "0px 40px 80px rgba(0,0,0,0.05)",
    "0px 42px 84px rgba(0,0,0,0.05)",
    "0px 44px 88px rgba(0,0,0,0.05)",
    "0px 46px 92px rgba(0,0,0,0.05)",
    "0px 48px 96px rgba(0,0,0,0.05)",
  ],
});

export default theme;
