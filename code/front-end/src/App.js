import Login from "./page/Login";
import RegisterPage from "./page/RegisterPage";
import DashboardPage from "./page/Dashboard";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
         <Routes>
         <Route path="/" element={<Login/>}/>
          <Route path="/register" element={<RegisterPage/>}/>
          <Route path="/dashboard" element={<DashboardPage/>}/>
          

         </Routes>
      </BrowserRouter>
      
    </div>
  );
}

export default App;
