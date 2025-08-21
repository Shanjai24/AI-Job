import {BrowserRouter as Router,Routes,Route } from 'react-router-dom';
import Dashboard from "./dashboard";
import Login from "./login";
import Register from './register';

function App() {
  return(
      <Router>
          <Routes>
              <Route path="/dashboard" element={<Dashboard/>}></Route>
              <Route path="/login" element={<Login/>}></Route>
              <Route path="/" element={<Register/>}></Route>
          </Routes>
      </Router>
  );
}

export default App;
