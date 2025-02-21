import React from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import "@aws-amplify/ui-react/styles.css";

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      <div
        style={{
          padding: "2rem",
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h1 style={{ marginBottom: "2rem", textAlign: "center" }}>
          Disc Golf Collection Manager
        </h1>
        <Authenticator>
          {() => <div>Redirecting to dashboard...</div>}
        </Authenticator>
      </div>
    </div>
  );
};
