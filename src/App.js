import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import Register from "./components/Register";
import Transactions from "./components/Transactions";
import Budget from "./components/Budget";
import Forecast from "./components/Forecast";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />}/>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/transactions" element={<Layout><Transactions /></Layout>} />
        <Route path="/budget" element={<Layout><Budget /></Layout>} />
        <Route path="/forecast" element={<Layout><Forecast /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;