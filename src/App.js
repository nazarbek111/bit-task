import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import "./styles.css";

function App() {
  return (
    <BrowserRouter>
      <nav style={{ padding: "20px", display: "flex", gap: "15px" }}>
        <Link to="/">Home</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;