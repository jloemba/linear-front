import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import GraphView from './pages/GraphView';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/graph/:id" element={<GraphView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;