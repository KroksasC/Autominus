import Home from "./Pages/Home"
import Posting from "./Pages/Posting";
import Listing from "./Pages/Listing";
import { Routes, Route } from "react-router-dom"

function App() {
    return (
        <main>
            <Routes>
                <Route path="/" element={<Home />}></Route>
                <Route path="/Posting" element={<Posting />}></Route>
                <Route path="/:id" element={<Listing />} />
            </Routes>
        </main>
    );
}

export default App;