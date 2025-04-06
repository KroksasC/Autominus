import Home from "./Pages/Home"
import Posting from "./Pages/Posting";
import Edit from "./Pages/Edit";
import Listing from "./Pages/Listing";
import { Routes, Route } from "react-router-dom"
//import { BrowserRouter } from "../node_modules/react-router-dom/index";
import Login from "./Pages/Login";
import Register from "./Pages/Register";

function App() {
    return (
         <main>
            <Routes>
                <Route path="/" element={<Home />}></Route>
                <Route path="/Posting" element={<Posting />}></Route>
                <Route path="/Edit" element={<Edit />}></Route>
                <Route path="/:id" element={<Listing />} />
                <Route path="/l" element={<Login />}></Route>
                <Route path="/r" element={<Register />}></Route>
            </Routes>
        </main>
    );
}

export default App;