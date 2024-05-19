import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

// an example of Dash
const DashView = () => {
  const [authenticated, setauthenticated] = useState("");
  useEffect(() => {
    // const loggedInUser = localStorage.getItem("authenticated");
    const token = sessionStorage.getItem("token");
    if (token) {
      setauthenticated(token);
    }
  }, []);

  if (!authenticated) {
    return <Navigate replace to="/" />;
  } else {
    return (
      <div>
        <p>Welcome to your Dashboard</p>
      </div>
    );
  }
};

export default DashView;