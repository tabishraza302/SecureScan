import { Route, Routes } from "react-router";
import { ToastContainer, Bounce } from "react-toastify";

import Home from "./Pages/Home/Home";
import FullReport from "./Pages/FullReport/FullReport";


function App() {
    return (
        <>
            <Routes>
                <Route path="/"  element={<Home />}/>
                <Route path="/full-report/:domain"  element={<FullReport />} />
            </Routes>

            <ToastContainer position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Bounce} />
        </>
    )
}


export default App;