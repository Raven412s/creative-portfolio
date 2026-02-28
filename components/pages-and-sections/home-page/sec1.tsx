import Image from 'next/image'
import React from 'react'

const HeroSection = () => {
    return (
        <>
            <section className="hero relative w-full h-[175svh] text-rose-400 overflow-hidden ">
                <div className="hero-img absolute w-full h-full  ">
                    <Image src={"/assets/images/background-hero.png"} alt="Raven Unleashed" fill className='object-cover w-full h-full object-center' preload />
                </div>
                <div className="hero-header absolute w-full h-svh flex flex-col justify-center items-center gap-2 text-center  ">
                    <h1 className='uppercase font-playfair font-medium leading-[90%] text-[clamp(4rem,7.5vw,10rem)]'>Raven Unleashed</h1>
                    <p className='font-sans text-[1.125rem] font-normal w-3/4 '>
                        Observing patterns. Moving with intent. Engineering digital systems that outmaneuver complexity.
                    </p>
                </div>
                <canvas className="hero-canvas absolute bottom-0 w-full h-full pointer-events-none "></canvas>
                <div className="hero-content absolute bottom-0 w-full h-[125svh] flex items-center justify-center text-center ">
                    <h2 className='uppercase font-playfair font-medium leading-[90%] text-[clamp(2.5rem,4.5vw,5rem)] lg:w-3/4  text-zinc-800 w-[calc(100%-4rem)] '>
                        I build expressive interfaces powered by resilient architectures —
                        blending motion, performance, and precision to create experiences
                        that feel alive and engineered to endure.
                    </h2>
                </div>
            </section>
            <section className="about relative w-full h-svh flex justify-center items-center bg-zinc-800 text-zinc-200  ">
                <p className='font-sans text-[1.125rem] font-normal lg:w-2/5 text-center w-[calc(100%-4rem)] '>
                    Creative by instinct. Strategic by design. I build powerful, intelligent digital systems that feel fluid, perform flawlessly, and evolve with purpose.
                </p>
            </section>
        </>
    )
}

export default HeroSection