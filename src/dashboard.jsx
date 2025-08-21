import { Box,Typography } from "@mui/material";
import logo from './assets/logo.png';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import './App.css';
import { useEffect, useState } from "react";
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded';
import ContrastRoundedIcon from '@mui/icons-material/ContrastRounded';
import NightlightRoundedIcon from '@mui/icons-material/NightlightRounded';
import { db,auth } from "./firebase";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const[click,setClick] = useState("Dashboard");
  const[theme,setTheme] = useState(false);
  const dark = () => {
    setTheme((prev) => !prev);
  };
  const nav = useNavigate();
  const logout = async () => {
    await auth.signOut();
    nav("/login");
  }
  const email = auth.currentUser?.email || "";
  const name = email.split("@")[0];
  const[role,setRole] = useState("");
  useEffect(() => {
    const roleshow = auth.onAuthStateChanged(async (user) => {
      const doc = await db.collection("users").doc(user.uid).get();
      if (doc.exists) {
        setRole(doc.data().role);
      }
    })
    return () => roleshow();
  })
  return (
    <Box sx={{display:'flex',flexDirection:'row'}}>
      <Box sx={{ width: "10%", backgroundColor: theme == true ? "#394256ff" : "#cfe0f1ff",display:'flex',flexDirection:'column',height:'100vh'}}>
        <Box sx={{display:'flex',justifyContent:'center'}}>
          <img src={logo} alt="Logo" height='70px' width='70px' style={{marginTop:'50px'}}/>
        </Box>
        <Box sx={{display:'flex',flexDirection:'column',mt:'40px',gap:'2px'}}>
          {[
            { icon: <DashboardIcon sx={{ fontSize: 25 }} /> , label: "Dashboard"},
            { icon: <AssessmentIcon sx={{ fontSize: 25 }} />, label: "Report"},
            { icon: <AssignmentIcon sx={{ fontSize: 25 }} />, label: "Template"},
          ].map((item) => (
          <Box key={item.label} onClick={() => setClick(item.label)} sx={{display:'flex',alignItems:'center',flexDirection:'column',p:'15px',
            cursor: "pointer",
            backgroundColor: click === item.label ? "#2bb673" : "transparent",
            color: click === item.label ? "white" : "black",
            "&:hover": { backgroundColor: "#249c5f", color: "white" }
          }}>
            {item.icon}
            <Box sx={{textTransform:'none'}}>{item.label}</Box>
          </Box>
          ))}
        </Box>
        <Box sx={{display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',mt:'auto',mb:'10px',gap:'20px'}}>
          <LogoutIcon sx={{cursor:'pointer',color:'red'}} onClick={logout}/>
          <p>-------------------</p>
          <AccountCircleIcon sx={{cursor:'pointer',fontSize:40}}/>
        </Box>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
        <Box
          sx={{
            height: "60px",
            backgroundColor: theme ? '#0F172A' : '#FFFFFF',
            color: theme ? '#E2E8F0' : '#000000',
            borderBottom: `1px solid ${theme ? '#334155' : '#E2E8F0'}`,
            display: "flex",
            alignItems: "center",
            pl: 2,
          }}
        >
          <Typography sx={{ fontWeight:'bold',fontSize:20 }}>{click}</Typography>
          <Typography sx={{display:'flex',fontWeight:'bold',alignItems:'center',justifyContent:'center',textAlign:'center',height:'100vh',width:'100%'}}>
            <span style={{textTransform:'capitalize',marginRight:'10px'}}>{role}</span>
            portal 
          </Typography>
          <Box sx={{display:'flex',ml: "auto", cursor: "pointer",pr:'100px',gap:'20px'}}>
            <NotificationsNoneRoundedIcon/>
            {theme ? (
              <NightlightRoundedIcon onClick={dark}/>
            ) : (
              <ContrastRoundedIcon onClick={dark}/>
            )}
          </Box>
        </Box>
        <Box sx={{ flexGrow: 1, backgroundColor: theme == true ? "black" : "#f0f0f0", p: 2 }}>
          <Typography sx={{fontWeight:'bold', color: theme == true ? "white" : "black"}}>Welcome {name},</Typography>
        </Box>
      </Box>
    </Box>
  );
}
