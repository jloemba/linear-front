import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/Language/LanguageProvider';
import { SnackbarProvider } from './context/Snackbar/SnackbarProvider';
import { ThemeProvider } from './context/Theme/ThemeProvider';
import Home from './pages/HomePage/HomePage';
import ClothView from './pages/ClothView/ClothView';
import NavigationLayout from './layout/NavigationLayout/NavigationLayout';
import ClothEditor from './pages/ClothEditor/ClothEditor';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <LanguageProvider>
          <SnackbarProvider>
            <Routes>
              <Route element={<NavigationLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/cloth/new" element={<ClothEditor />} />
                <Route path="/cloth/:id" element={<ClothView />} />
                <Route path="/cloth/:id/edit" element={<ClothEditor />} />
              </Route>
            </Routes>
          </SnackbarProvider>
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
