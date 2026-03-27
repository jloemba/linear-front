import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/HomePage/HomePage';
import ClothView from './pages/ClothView/ClothView';
import NavigationLayout from './layout/NavigationLayout/NavigationLayout';
import ClothEditor from './pages/ClothEditor/ClothEditor';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [lang, setLang] = useState<'fr' | 'en'>('fr');

  return (
    <BrowserRouter>
      <Routes>
        <Route
          element={
            <NavigationLayout
              sidebarOpen={sidebarOpen}
              onToggleSidebar={() => setSidebarOpen(o => !o)}
              lang={lang}
              onToggleLang={() => setLang(l => l === 'fr' ? 'en' : 'fr')}
            />
          }
        >
          <Route path="/" element={<Home lang={lang} />} />
          <Route path="/cloth/:id" element={<ClothView lang={lang} />} />
          <Route path="/cloth/:id/edit" element={<ClothEditor lang={lang} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
