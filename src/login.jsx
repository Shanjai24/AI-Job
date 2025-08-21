import {Box,Button,IconButton,TextField,Typography,InputAdornment} from "@mui/material";
import gog from "./assets/google.png";
import stu from "./assets/stu.png";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "./firebase";
import { signInWithGoogle } from "./firebase";
import CloseIcon from '@mui/icons-material/Close';


export default function Login() {
  const [open, setOpen] = useState(false);

  const[email,setEmail] = useState('');
  const[password,setPassword] = useState('');
  const[Eerr,setEerr] = useState('');
  const nav = useNavigate();

  const submit = async(e) => {
    e.preventDefault();
    try{
      await auth.signInWithEmailAndPassword(email,password);
      console.log(email + " " + password);
      nav("/dashboard",{state:{email}})
    }catch(err){
      if(err.code === "auth/invalid-credential"){
          setEerr("Invalid Email or Password");
      }
      console.error(err);
    }
  }
  const signgoogle = async(e) => {
    e.preventDefault();
    const result = await signInWithGoogle();
    const user = result.user;

    console.log("Google user:", user);
    nav("/dashboard", { state: { email: user.email } });
  }
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
          {Eerr && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid black',
                backgroundColor: '#f2f6e7ff',  
                p:'2px',     
                fontSize: '12px',
                mt:'10px',
              }}
            >
              <CloseIcon
                fontSize="small"
                sx={{ cursor: 'pointer',mr:'6px'}}
                onClick={() => setEerr("")}
              />
              <Typography sx={{ fontSize: '12px' }}>{Eerr}</Typography>
            </Box>
          )}
          <Box sx={{ width: "80%", display: "flex", flexDirection: "column", gap: 1,mt:'40px'}}>
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
              sx={{ mt: 1, backgroundColor: "#2f5ea8", textTransform: "none" }}
              onClick={submit}
            >
              <Typography sx={{ color: "white" }}>Login</Typography>
            </Button>
            <Typography
              sx={{ display: "flex", mt: "2px", justifyContent: "center" }}
            >
              ------or-----
            </Typography>
            <Button
            onClick={signgoogle}
              sx={{ mt: 1, border: "1px solid black", textTransform: "none" }}
            >
              <img src={gog} alt="google" height="20px" />
              <Typography sx={{ color: "black", ml: "15px" }}>
                Sign in with Google
              </Typography>
            </Button>
          </Box>

          <Typography sx={{fontSize:'12px',mt:'25px',}}>
            Don't have an account? Create a new one <Link to="/">Sign up</Link>
          </Typography>

        </Box>
    </Box>
  );
}
