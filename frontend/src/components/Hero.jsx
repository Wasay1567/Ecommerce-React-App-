import React from 'react'

const Hero = () => {
  return (
    <div>
      <div className='flex flex-col sm:flex-row border border-gray-400 '>
        {/* Hero Left Side */}
        <div className='w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0'>
            <div className='text-[#414141]'>
                <div className='flex items-center gap-2'>
                    <p></p>
                    <p></p>
                </div>
            </div>
        </div>

      </div>
    </div>
  )
}

export default Hero
