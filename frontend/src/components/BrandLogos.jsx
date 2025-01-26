import React from 'react';
import { assets } from '../assets/assets';

const BrandLogos = () => {
  const brands = [
    {
      name: 'Kate Spade',
      logoUrl: assets.kate,
      color : '#FE7A9F',
      link: '/collection/kate-spade',
    },
    {
      name: 'Michael Kors',
      logoUrl: assets.kors,
      color : "black",
      link: '/collection/michael-kors',
    },
    {
      name: 'Coach',
      logoUrl: assets.coach,
      color : "black",
      link: '/collection/coach',
    },
  ];

  return (
    <div className='bg-gray-50'>
    <div className="flex flex-row justify-around space-x-8 pt-20 pb-20">
      {brands.map((brand) => (
        <div key={brand.name} className="text-center">
          <a href={brand.link} className={`w-28 h-28 rounded-full flex items-center justify-center overflow-hidden shadow-md hover:shadow-xl transition-shadow`} style={{backgroundColor: brand.color}}>
            <img
              src={brand.logoUrl}
              alt={`${brand.name} logo`}
              className="w-full h-full object-contain"
            />
          </a>
          <p className="mt-2 text-lg font-semibold">{brand.name}</p>
        </div>
      ))}
    </div>
    </div>
  );
};

export default BrandLogos;