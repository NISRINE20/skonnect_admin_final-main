import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Lock, ShieldCheck, TrendingUp, Eye, EyeOff } from "lucide-react";
import {
  LoginContainer,
  BrandPanel,
  FormSection,
  LoginCard,
} from "../styles/LoginStyles";
import sk from "../sklogo.png";

export default function LoginPage() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [status, setStatus] = useState({ message: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password } = formData;

    if (!username || !password) {
      setStatus({
        message: "Please enter both username/email and password.",
        type: "error",
      });
      return;
    }

    setLoading(true);
    setStatus({ message: "", type: "" });

    try {
      // Simulate delay (you can replace with API call later)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (username === "admin" && password === "password123") {
        setStatus({
          message: "Login successful! Redirecting...",
          type: "success",
        });

        // ✅ Redirect to Dashboard page after successful login
        setTimeout(() => navigate("/dashboard"), 1200);
      } else {
        throw new Error(
          "Invalid credentials. Please check your username and password."
        );
      }
    } catch (err) {
      setStatus({ message: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer>
      {/* Left Brand Panel */}
      <BrandPanel>
        <img
          src={ sk }
          alt="SKonnect Logo"
          onError={(e) =>
            (e.target.src =
              "https://placehold.co/112x112/ffffff/000000?text=SK+Logo")
          }
        />
        <h1>SKonnect Admin</h1>
        <p>Efficiently manage announcements, events, and youth records.</p>
        <div className="icon-group">
          <ShieldCheck />
          <Lock />
          <TrendingUp />
        </div>
      </BrandPanel>

      {/* Right Login Form */}
      <FormSection>
        <LoginCard>
          <img
            src= { sk }
            alt="SKonnect Logo"
            onError={(e) =>
              (e.target.src =
                "https://placehold.co/64x64/ffffff/000000?text=SK")}
          />
          <h2>Admin Sign In</h2>
          <p>Enter your credentials to access the dashboard.</p>

          <form onSubmit={handleSubmit}>
            {/* Username Input */}
            <div style={{ position: "relative" }}>
              <User
                style={{
                  position: "absolute",
                  left: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#9ca3af",
                }}
              />
              <input
                name="username"
                type="text"
                placeholder="Username or Email"
                value={formData.username}
                onChange={handleChange}
              />
            </div>

            {/* Password Input */}
            <div style={{ position: "relative" }}>
              <Lock
                style={{
                  position: "absolute",
                  left: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#9ca3af",
                }}
              />
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "transparent",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  color: "#6b7280"
                }}
              >
                {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
            </div>

            {/* Submit Button */}
            <button type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </button>

            {/* Status Message */}
            {status.message && (
              <div className={`status ${status.type}`}>{status.message}</div>
            )}
          </form>
        </LoginCard>
      </FormSection>
    </LoginContainer>
  );
}
