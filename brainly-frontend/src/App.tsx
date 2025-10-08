import './App.css'
import { Dashboard } from './pages/DashBoard'
import { SignIn } from './pages/SignIn'
import { SignUp } from './pages/SignUp'
import { BrowserRouter,Routes, Route } from 'react-router-dom'
import { SharePage } from "./pages/SharedDashboard";

function App() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/share/:hash" element={<SharePage />} />

        </Routes>
      </BrowserRouter>
    );
  }

  export default App
