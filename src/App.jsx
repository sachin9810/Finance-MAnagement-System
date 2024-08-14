import { Toaster } from 'react-hot-toast';
import './App.css'
import AddFinanceData from './Components/AddFinanceData';
import HomePage from './Components/HomePage';
import Navbar from './Components/Navbar'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ViewDetails from './Components/ViewDtails';
function App() {

  return (
    <>
      <Router>
      <Toaster />
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/addfinance" element={<AddFinanceData />} />
          <Route path="/view-details/:id" element={<ViewDetails />} />

          {/* <Route path="/viewprofile" element={<ViewProfile />} /> */}
        </Routes>
      </Router>
    </>
  )
}

export default App
