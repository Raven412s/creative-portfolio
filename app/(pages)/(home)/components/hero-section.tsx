import Appear from "@/components/text-animations/appear";

export function HeroSection() {
    return (
        <section className="relative w-full h-dvh flex flex-col items-center justify-center bg-white dark:bg-black px-2 sm:px-4">
            <Appear> <span className="uppercase font-rmNeue font-light text-xs sm:text-sm md:text-base lg:text-[0.95vw] xl:text-[1vw] 2xl:text-[1.25vw] py-2 sm:py-2 md:py-2.5 lg:py-[0.7vw] xl:py-[0.8vw] px-2.5 sm:px-4 md:px-5 lg:px-[1.6vw] xl:px-[1.7vw] 2xl:px-[1.8vw] line-clamp-1">Ashutosh Sharan</span></Appear>
            <Appear><h1 className="font-rmNeue font-medium leading-[1.1] sm:leading-[0.9] md:leading-[0.85] lg:leading-[85%] text-center uppercase text-[9vw] sm:text-[12vw] md:text-[12vw] lg:text-[10vw] xl:text-[9vw] 2xl:text-[8vw] ">
                r<span className="font-gridular">e</span>s
                <span className="font-gridular">tor</span>ing
            </h1></Appear>
            <Appear>
                <h1 className="font-rmNeue font-medium leading-[1.1] sm:leading-[0.9] md:leading-[0.85] lg:leading-[85%] text-center uppercase text-[9vw] sm:text-[12vw] md:text-[12vw] lg:text-[10vw] xl:text-[9vw] 2xl:text-[8vw] ">
                    <span className="font-gridular">me</span>a
                    <span className="font-gridular">n</span>in
                    <span className="font-gridular">g</span>
                </h1>
            </Appear>
            <Appear>
                <h1 className="font-rmNeue font-medium leading-[1.1] sm:leading-[0.9] md:leading-[0.85] lg:leading-[85%] text-center uppercase text-[9vw] sm:text-[12vw] md:text-[12vw] lg:text-[10vw] xl:text-[9vw] 2xl:text-[8vw] ">
                    <span className="font-gridular">to</span> t
                    <span className="font-gridular">hin</span>g
                    <span className="font-gridular">s</span>
                </h1>
            </Appear>
            <Appear>
                <h1 className="font-rmNeue font-medium leading-[1.1] sm:leading-[0.9] md:leading-[0.85] lg:leading-[85%] text-center uppercase text-[9vw] sm:text-[12vw] md:text-[12vw] lg:text-[10vw] xl:text-[9vw] 2xl:text-[8vw] ">
                    <span className="font-gridular">i</span>
                    <span className="font-gridular"> bu</span>il
                    <span className="font-gridular">d</span>
                </h1>
            </Appear>
            <Appear><span className="uppercase font-rmNeue font-light text-xs sm:text-sm md:text-base lg:text-[0.95vw] xl:text-[1vw] 2xl:text-[1.25vw] py-2 sm:py-2 md:py-2.5 lg:py-[0.7vw] xl:py-[0.8vw] px-2.5 sm:px-4 md:px-5 lg:px-[1.6vw] xl:px-[1.7vw] 2xl:px-[1.8vw] line-clamp-1">Ashutosh Sharan</span></Appear>
        </section>
    );
}