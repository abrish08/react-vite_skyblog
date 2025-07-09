import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";

export default function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [type, setType] = useState("info"); // success, error, warning
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Basic email format validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMessage("Please enter a valid email address.");
      setType("error");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_PUBLIC_API_URL}/api/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("If this email is registered, a reset link has been sent.");
        setType("success");
      } else {
        setMessage(data?.message || "Something went wrong. Please try again.");
        setType("error");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Server error. Please try again later.");
      setType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 8,
          p: 4,
          border: "1px solid #ccc",
          borderRadius: 2,
          boxShadow: 2,
          backgroundColor: "#fff",
        }}
      >
        <Typography variant="h5" fontWeight={600} mb={2}>
          Forgot Password
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Enter your registered email address. We'll send you a link to reset your password.
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            type="email"
            label="Email Address"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{ mb: 2 }}
          />

          {message && (
            <Alert severity={type} sx={{ mb: 2 }}>
              {message}
            </Alert>
          )}

          <Button
            fullWidth
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{ backgroundColor: "#1976d2", textTransform: "none" }}
          >
            {loading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Send Reset Link"}
          </Button>
        </form>
      </Box>
    </Container>
  );
}
