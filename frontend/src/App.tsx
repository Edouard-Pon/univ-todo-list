import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Enterprise_and_teams from "./pages/Enterprise_and_teams";
import Navigation from "./components/Navigation.tsx";

function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/enterprise_and_teams" element={<Enterprise_and_teams />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App
