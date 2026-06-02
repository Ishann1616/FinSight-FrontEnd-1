import { BrowserRouter,Routes,Route } from "react-router-dom"
import Dashboard from "./components/Dashboard"
import Login from "./components/Login"

function App(){
  return(
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/dashboard' element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App