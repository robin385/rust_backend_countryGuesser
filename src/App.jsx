import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import LoginPage from './loginPage'
import GuesserCardComponent from './guesserCardComponent'
import { BrowserRouter as Router, Route, Routes, BrowserRouter } from 'react-router-dom';
import SignUpPage from './signUp'


function App() {
  const [count, setCount] = useState(0)

  return (  
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUpPage/>} />
        <Route path="/" element={<LoginPage></LoginPage>} />
        <Route path="/guesser" element={<GuesserCardComponent></GuesserCardComponent>} />
      </Routes>
    </Router>

  )
}

export default App
