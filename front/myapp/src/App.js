import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import  Register  from  "./components/Pages/Register";
import  Login  from  "./components/Pages/Login";
import Home from './components/Pages/Home';
import Dashboard from './components/Pages/Dashboard';
import Admin from './components/Pages/Admin';
import Edetailing from './components/Pages/Edetailing';
import Cardio from './components/Detailing/Cardio';
import Adddoctor from './components/Pages/Admin/Adddoctor';
import Listdoctor from './components/Pages/Admin/Listdoctor';
import Doctor from './components/Pages/Doctor';
import Reports from './components/Pages/Reports';
import Reported from './components/Pages/Reported';

// Listdoctor





const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route  path="/admin-dashboard" element={<Admin />} />
        <Route  path="/e-detailing" element={<Edetailing />} />
        <Route  path="/e-detailing-cardio" element={<Cardio />} />
        <Route  path="/admin-dashboard-add-doctors" element={ <Adddoctor /> } />
        <Route  path="/admin-dashboard-all-doctors" element={<Listdoctor /> } />
        <Route  path="/reports" element={<Reports /> } />
        <Route  path="/doctor" element={<Doctor/> } />
        <Route  path="/reported-doctors" element={<Reported /> } />
      </Routes>
    </BrowserRouter>
  )
}

export default App;