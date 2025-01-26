import React from 'react'
import Hero from '../components/Hero'
import LatestCollection from '../components/LatestCollection'
import BrandLogos from '../components/BrandLogos'
import Carousel from '../components/Carousel'

const Home = () => {
  return (
    <div>
      {/* <Hero /> */}
      <Carousel />
      <BrandLogos />
      <LatestCollection />
      
    </div>
  )
}

export default Home
