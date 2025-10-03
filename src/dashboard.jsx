import { Box, Typography,Stack,Container} from "@mui/material";
import logo from './assets/logo.png';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import './App.css';
import { useState, useEffect } from "react";
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded';
import ContrastRoundedIcon from '@mui/icons-material/ContrastRounded';
import NightlightRoundedIcon from '@mui/icons-material/NightlightRounded';

export default function Dashboard() {
  const [click, setClick] = useState("Dashboard");
  const [theme, setTheme] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const dark = () => {
    setTheme((prev) => !prev);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          window.location.href = '/login';
          return;
        }
        const res = await fetch('http://localhost:3000/api/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          return;
        }
        const data = await res.json();
        setProfile(data);
      } catch (e) {
        console.error('Profile fetch error:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };
  
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
          <LogoutIcon onClick={logout} sx={{cursor:'pointer',color:'red'}}/>
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
          <Box sx={{display:'flex',ml: "auto", cursor: "pointer",pr:'100px',gap:'20px'}}>
            <NotificationsNoneRoundedIcon/>
            {theme ? (
              <NightlightRoundedIcon onClick={dark}/>
            ) : (
              <ContrastRoundedIcon onClick={dark}/>
            )}
          </Box>
        </Box>
        <Box sx={{ flexGrow: 1, backgroundColor: theme ? '#0B1220' : '#f7f9fc', py: { xs: 2, md: 3 } }}>
          <Container maxWidth="lg">
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2} sx={{ mb: 2 }}>
              <Typography sx={{ fontWeight: 700, color: theme ? "#E2E8F0" : "#0F172A", fontSize: 22 }}>
                {loading ? 'Loading...' : `Welcome, ${profile?.name || profile?.email || ''}`}
              </Typography>
            </Stack>
          </Container>
        </Box>
      </Box>
    </Box>
  );
}
