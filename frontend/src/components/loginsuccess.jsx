import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const LoginSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const userId = params.get("userId");

    console.log("Token:", token); // For debugging
    console.log("UserId:", userId); // For debugging

    if (token && userId) {
      // Store authentication data
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);

      // Redirect to home page
      navigate("/", { replace: true });
    } else {
      console.error("Authentication failed: Missing token or userId");
      navigate("/signin", { replace: true });
    }
  }, [navigate, location]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl mb-4">Logging you in...</h2>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
      </div>
    </div>
  );
};

export default LoginSuccess;
