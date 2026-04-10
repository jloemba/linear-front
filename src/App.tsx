import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { LanguageProvider } from "./context/Language/LanguageProvider";
import { SnackbarProvider } from "./context/Snackbar/SnackbarProvider";
import { ThemeProvider } from "./context/Theme/ThemeProvider";
import NotFound from "./pages/NotFound/NotFound";
import Home from "./pages/HomePage/HomePage";
import ClothView from "./pages/ClothView/ClothView";
import ClothInsights from "./pages/ClothInsights/ClothInsights";
import NavigationLayout from "./layout/NavigationLayout/NavigationLayout";
import ClothEditor from "./pages/ClothEditor/ClothEditor";
import Login from "./pages/Login/Login";
import ProtectedRoute from "./components/ProtectedRoute";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function App() {
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <BrowserRouter>
        <ThemeProvider>
          <LanguageProvider>
            <SnackbarProvider>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route element={<NavigationLayout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/cloth/:id" element={<ClothView />} />
                  <Route element={<ProtectedRoute />}>
                    <Route path="/cloth/new" element={<ClothEditor />} />
                    <Route path="/cloth/:id/edit" element={<ClothEditor />} />
                    <Route path="/cloth/:id/insights" element={<ClothInsights />} />
                  </Route>
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>

            </SnackbarProvider>
          </LanguageProvider>
        </ThemeProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
