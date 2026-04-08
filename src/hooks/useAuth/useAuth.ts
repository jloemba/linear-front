import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useSnackbar from "../useSnackbar/useSnackbar";

interface User {
  id: string;
  email: string;
  name?: string;
  picture?: string;
  provider?: string;
}

const useAuth = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  const loginWithEmailPassword = async (
    email: string,
    password: string,
    isRegister: boolean = false,
  ) => {
    setIsLoading(true);
    try {
      const endpoint = isRegister ? "/auth/register" : "/auth/login";
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Authentication failed");
      }

      const data = await response.json();
      const userData: User = {
        id: data.userId.toString(),
        email,
        provider: "LOCAL",
      };

      setUser(userData);
      localStorage.setItem("userId", data.userId.toString());
      localStorage.setItem("user", JSON.stringify(userData));

      showSnackbar({
        message: isRegister ? "Inscription réussie" : "Connexion réussie",
        type: "success",
      });
      navigate("/");
      showSnackbar({ message: "Connexion réussie", type: "success" });

      return true;
    } catch (error) {
      console.error("Email/password auth error:", error);
      showSnackbar({
        message:
          error instanceof Error ? error.message : "Erreur d'authentification",
        type: "error",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithSocial = async (
    provider: "GOOGLE" | "APPLE" | "TWITTER",
    providerId: string,
    email: string,
  ) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/oauth2`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ provider, providerId, email }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "OAuth2 authentication failed");
      }

      const data = await response.json();
      const userData: User = {
        id: data.userId.toString(),
        email,
        provider,
      };
      setUser(userData);
      localStorage.setItem("userId", data.userId.toString());
      localStorage.setItem("user", JSON.stringify(userData));

      showSnackbar({ message: "Connexion réussie", type: "success" });
      navigate("/");
      showSnackbar({ message: "Connexion réussie", type: "success" });

      return true;
    } catch (error) {
      console.error("Social auth error:", error);
      showSnackbar({
        message:
          error instanceof Error
            ? error.message
            : "Erreur d'authentification sociale",
        type: "error",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    loginWithEmailPassword,
    loginWithSocial,
    logout,
  };
};

export default useAuth;
