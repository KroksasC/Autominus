import Home from "./Pages/Home"
import Posting from "./Pages/Posting";
import { Routes, Route } from "react-router-dom"

function App() {
    return (
        <main>
            <Routes>
                <Route path="/" element={<Home />}></Route>
                <Route path="/Posting" element={<Posting />}></Route>
            </Routes>
        </main>
    );
}

export default App;