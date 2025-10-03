import {BrowserRouter as Router,Routes,Route, Navigate } from 'react-router-dom';
import Dashboard from "./dashboard";
import Login from "./login";
function App() {
  return(
      <Router>
          <Routes>
              <Route path="/dashboard" element={<Dashboard/>}></Route>
              <Route path="/login" element={<Login/>}></Route>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
      </Router>
  );
}

export default App;
