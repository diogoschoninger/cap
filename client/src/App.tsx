import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Edit from './pages/documents/Edit';
import New from './pages/documents/New';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/documents/new" element={<New />} />
        <Route path="/documents/edit/:id" element={<Edit />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
