import {Box,Button,IconButton,TextField,Typography,InputAdornment,RadioGroup, Paper, FormControlLabel, Radio} from "@mui/material";
import gog from "./assets/google.png";
import res from "./assets/res.png";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import { db,auth } from "./firebase";
import { signInWithGoogle } from "./firebase";
import { Link,useNavigate } from "react-router-dom";

export default function Register() {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState("Student");

  const[email,setEmail] = useState('');
  const[password,setPassword] = useState('');
  const[cpassword,setCpassword] = useState('');
  const[perr,setPerr] = useState('');
  const[emerr,setEerr] = useState('');

  const nav = useNavigate();

  const submit = async(e) => {
    e.preventDefault();
    if(password !== cpassword){
        setPerr("Password is not matched")
    }
    else if(password.length < 6){
        setPerr("*Password should contain atleast 6 characters")
    }
    try{
        const credit = await auth.createUserWithEmailAndPassword(email,password);
        const user = credit.user;
        await db.collection("users").doc(user.uid).set({
          email: email,
          role: role,
          createdAt: new Date(),
        });
        console.log(email + " " + role);
        nav("/login")
    }catch(err){
        if(err.code === "auth/email-already-in-use"){
            setEerr("Email is already in use");
        }
        else{
            console.error(err);
        }
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
      sx={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      }}
      >
      <img
      src={res}
      style={{
        width: "71%",
        height: "90%",
        objectFit: "cover",
        objectPosition: "center",
        position:'absolute',
        marginTop:'50px',
        zIndex:1,
      }}
      />
      {/* form  */}
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "500px",
            width: "400px",
            borderRadius: "10px",
            position:'absolute',
            zIndex:2,
            transform: "translate(227%, 20%)",
          }}
        >
          <Typography sx={{ fontWeight: "bold", fontSize: "30px" }}>
            SkillConnect
          </Typography>

          <Box sx={{ width: "80%", display: "flex", flexDirection: "column", gap: 1 }}>
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
              <Typography sx={{fontWeight:'bold'}}>Email</Typography>
              <TextField placeholder="Username" size="small" fullWidth 
              value={email}
              onChange={(e) => setEmail(e.target.value)}/>
            </Box>
            {emerr && (
              <Typography sx={{fontSize:'15px',color:'red'}}>{emerr}</Typography>
            )}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Typography sx={{fontWeight:'bold'}}>Password</Typography>
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
            </Box>
              {perr && (
                  <Typography sx={{fontSize:'15px',color:'red'}}>{perr}</Typography>
              )}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Typography sx={{fontWeight:'bold'}}>Confirm Password</Typography>
              <TextField placeholder="Confirm Password" type="password" size="small" fullWidth 
                  value={cpassword}
                  onChange={(e) => setCpassword(e.target.value)} />
            </Box>
            <Button
              sx={{ mt: 1, backgroundColor: "#2f5ea8", textTransform: "none" }}
              onClick={submit}
            >
              <Typography sx={{ color: "white" }} >Register</Typography>
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
          <Typography sx={{ fontSize: '12px', mt: '15px' }}>
            Already have an account? <Link to="/login">Login here</Link>
          </Typography>
        </Box>
    </Box>
  );
}