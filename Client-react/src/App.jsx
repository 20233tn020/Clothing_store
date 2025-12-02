// Cambio forzado para que Git lo detecte

import { Routes, Route } from 'react-router-dom'
import Home from './components/pages/home/home.jsx'
import LoginForm from './components/Auth/LoginForm/LoginForm.jsx'
import RegisterForm from './components/Auth/Register/RegisterForm.jsx'
import Shop from './components/pages/Private/Shop.jsx'
import Perfil from './components/pages/Private/Perfil.jsx'
import Favorito from './components/pages/Private/favorito.jsx'
import Carrito from './components/pages/Private/Carrito.jsx'
import Pagar from './components/Auth/payments/Pagar.jsx'
import Admin from './components/pages/Private/Admin/Admin.jsx'
import SalesChart from './components/Common/Dashboard/SalesChart.jsx'
import ProductChart from './components/Common/Dashboard/ProductChart.jsx'
import UsersManagement from './components/Layout/UsersManagement/UsersManagement.jsx'
import OrdersManagement from './components/Layout/OrdersManagement/OrdersManagement.jsx'
import ProductManagement from './components/Layout/ProductManagement/ProductManagement.jsx'
import ReportAnalyze from './components/Common/Dashboard/RportAnalyze.jsx'
import Notifications from './components/Layout/notifications/notifications.jsx'
import { Update_Password } from './components/pages/Private/Admin/Update_Password/Update_Password.jsx'
import LogoutLink from './components/Auth/logout/LogoutLink.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';
import ArtHombre from './components/pages/ArtHombre.jsx'
import Hombre from './components/pages/Private/Hombre.jsx'
import Mujer from './components/pages/Private/Mujer.jsx'
import Accesorios from './components/pages/Private/Accesorios.jsx'
import Ofertas from './components/pages/Private/Ofertas.jsx'
export default function App() {
  return (
      <GoogleOAuthProvider clientId="915284224791-053n49a9auhgm7h1q90k3kfso8g52ktb.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>,
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path='/Registro' element={<RegisterForm/>} />
      <Route path='/Shop' element={  <Shop/>} />
      <Route path='/Perfil' element={<Perfil/>} />  
      <Route path='/Favorito' element={<Favorito/>} />
      <Route path='/Carrito' element={<Carrito/>}/>
      <Route path='/Pagar' element={<Pagar/>}/>
      <Route path='/Admin' element={<Admin/>}/>
      <Route path='/SalesChart' element={<SalesChart/>}/>
      <Route path='/ProductChart' element={<ProductChart/>}/>
      <Route path='/UsersManagement' element={<UsersManagement/>}/>
      <Route path='/OrdersManagement' element={<OrdersManagement/>}/>
      <Route path='/ProductManagement' element={<ProductManagement/>}/>
    <Route path='/ReportAnalyze' element={<ReportAnalyze/>}/>
    <Route path='/Notifications' element={<Notifications/>}/>
    <Route path='/Update_Password' element={<Update_Password/>}/>
    <Route path='/LogoutLink' element={<LogoutLink/>}/>
    <Route path='/ArtHombre' element={<ArtHombre/>}/>
    <Route path='/Hombre' element={<Hombre/>}/>
     <Route path='/Mujer' element={<Mujer/>}/>
     <Route path='/Accesorios' element={<Accesorios/>}/>
      <Route path='/Ofertas' element={<Ofertas/>}/>
       <Route path="*" element={<div>Página no encontrada</div>} />
    </Routes>
  )
}
