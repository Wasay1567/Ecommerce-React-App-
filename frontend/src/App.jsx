import React from 'react'
import { Routes, Route} from 'react-router-dom'
import Home from './pages/home'
import Collection from './pages/Collection'
import About from './pages/about'
import Contact from './pages/Contact'
import Product from './pages/Product'
import Cart from './pages/cart'
import Login from './pages/Login'
import PlaceOrder from './pages/PlaceOrder'
import Orders from './pages/Orders'
import Navbar from './components/Navbar'
import Shop from './pages/Shop'
import SearchBar from './components/SearchBar'

const App = () => {
  return (
    <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
      <Navbar />
      <SearchBar />
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/collection' element={<Collection/>} />
        <Route path='/shop/:category' element={<Shop/>} />
        <Route path='/about' element={<About/>} />
        <Route path='/contact' element={<Contact/>} />
        <Route path='/products/:productName/:productId' element={<Product/>} />
        <Route path='/cart' element={<Cart/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/place-order' element={<PlaceOrder/>} />
        <Route path='/orders' element={<Orders/>} />
      </Routes>
    </div>
  )
}

export default App
