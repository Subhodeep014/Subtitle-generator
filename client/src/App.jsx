import { useState } from 'react'
import { Button } from './components/ui/button'
import { BrowserRouter , Routes, Route} from "react-router-dom"
import { ToastContainer } from "react-toastify"
import Home from './pages/Home'
import "react-toastify/dist/ReactToastify.css";
import { Toaster } from './components/ui/toaster'
function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Toaster/>
      <ToastContainer/>
      <Routes>
        <Route path='/' element={<Home/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
