import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";
export default function Demo() {
  console.log("DEMO MOUNTED");
  const navigate = useNavigate();
  const [error, setError] = useState("");
  useEffect(() => {
    console.log("DEMO EFFECT RUNNING");
    const login = async () => {
      try {
        console.log("CALLING DEMO LOGIN API");
        const res = await axios.post(`${API_URL}/auth/demo-login`);
        console.log("DEMO LOGIN SUCCESS", res.data);
        localStorage.setItem("token", res.data.access_token);
        navigate("/dashboard");
      } catch (e) {
        console.log("DEMO LOGIN FAILED", e);
        setError("Couldn't load the demo right now. Please try again in a moment.");
      }
    };
    login();
  }, [navigate]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <h1
          className="text-2xl mb-4"
          style={{ fontFamily: "'Cormorant Garamond', serif", color: "#006039" }}
        >
          FinSight
        </h1>
        {error ? (
          <p className="text-red-500 text-sm">{error}</p>
        ) : (
          <p className="text-gray-400 text-sm">Loading demo...</p>
        )}
      </div>
    </div>
  );
}