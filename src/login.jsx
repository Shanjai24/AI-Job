import {Box,Button,IconButton,TextField,Typography,InputAdornment,RadioGroup, FormControlLabel, Radio } from "@mui/material";
import gog from "./assets/google.png";
import stu from "./assets/stu.png";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";


export default function Login() {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState("Student");

  const[email,setEmail] = useState('');
  const[password,setPassword] = useState('');
  const[loading,setLoading] = useState(false);
  const[message,setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!email || !password) {
      setMessage("Please enter email and password");
      return;
    }
    try {
      setLoading(true);
      // derive a display name from email (before '@') if none provided
      const derivedName = email.includes('@') ? email.split('@')[0] : email;
      const res = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name: derivedName, role }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        setMessage(data?.message || "Login failed");
        return;
      }
      
      // Save token and user data to localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Redirect to a single dashboard route
      window.location.href = '/dashboard';
      
    } catch (err) {
      console.error('Login error:', err);
      setMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <Box
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
      }}
    >
      <img
        src={stu}
        style={{
          width: "70%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
          position:'absolute',
          zIndex:1,
        }}
        />
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "550px",
            width: "400px",
            //border: "1px solid #ccc",
            borderRadius: "10px",
            position:'absolute',
            zIndex:2,
            transform: "translate(225%, 10%)",
          }}
        >
          <Typography sx={{ fontWeight: "bold", fontSize: "20px" }}>
            Login to SkillConnect
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ width: "80%", display: "flex", flexDirection: "column", gap: 1,mt:'40px'}}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1,mt:'30px'}}>
              <Typography sx={{fontWeight:'bold'}}>UserType</Typography>
                <RadioGroup 
                  row 
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  sx={{display:'flex', gap:10}}
                >
                  <FormControlLabel value="Student" control={<Radio size="small" />} label="Student" />
                  <FormControlLabel value="Hr" control={<Radio size="small" />} label="HR" />
                </RadioGroup>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Typography>Username</Typography>
              <TextField placeholder="Username" size="small" fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}/>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Typography>Password</Typography>
              <TextField
                placeholder="Password"
                type={open ? "text" : "password"}
                size="small"
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setOpen(!open)} edge="end">
                        {open ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Typography
                  sx={{
                    cursor: "pointer",
                    textTransform: "none",
                    color: "blue",
                    fontSize: "12px",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  Change Password
                </Typography>
              </Box>
            </Box>
            <Button
              type="submit"
              sx={{ mt: 1, backgroundColor: "#2f5ea8", textTransform: "none" }}
              disabled={loading}
            >
              <Typography sx={{ color: "white" }}>{loading ? "Logging in..." : "Login"}</Typography>
            </Button>
            {message && (
              <Typography sx={{ mt: 1, color: message.startsWith("User saved") ? "green" : "crimson" }}>
                {message}
              </Typography>
            )}
            <Typography
              sx={{ display: "flex", mt: "2px", justifyContent: "center" }}
            >
              ------or-----
            </Typography>
            <Button
              sx={{ mt: 1, border: "1px solid black", textTransform: "none" }}
            >
              <img src={gog} alt="google" height="20px" />
              <Typography sx={{ color: "black", ml: "15px" }}>
                Sign in with Google
              </Typography>
            </Button>
          </Box>
        </Box>
    </Box>
  );
}