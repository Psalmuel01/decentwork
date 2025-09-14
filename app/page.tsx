import Image from 'next/image';
import Link from 'next/link';
import { ApplicationRoutes } from '@/config/routes';
import CanvasAnimation from '@/images/CanvasAnimation';
import SpiralAnimation from '@/images/SpiralAnimation';
import MouseAnimation from '@/images/MouseAnimation';
import RayAnimation from '@/images/RayAnimation';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <main className="">
      <div className="app-container w-full pt-[30px] lg:pt-26 lg:pb-40">
        <div className="flex lg:flex-row flex-col lg:items-start items-center gap-y-[70px] justify-center lg:justify-end">
          <div className="w-full lg:w-3/5 flex flex-col lg:items-start items-center text-center lg:text-left">
            <div className="font-poppins font-bold relative md:text-[46px] text-[32px] mini:text-[56px]">
              <p className="text-[#7E8082]">Where Talent</p>
              <p className="">Meet Opportunity</p>
              <Image
                alt={''}
                className="w-auto h-auto hidden lg:flex absolute -right-[150px] 2xl:-right-[300px] top-1/2 -translate-y-1/2"
                src="/images/home/UX.svg"
                width={400}
                height={400}
              />
            </div>

            <div className="lg:max-w-lg mt-12 relative">
              <p className="text-[#545756] w-[362px]lg:w-max font-circular font-medium ">
                Connecting top talent with groundbreaking projects across Web2
                and Web3.{' '}
                <span className="text-[#18181B] font-bold">
                  Hire smarter. Work better. Stay in control.
                </span>
              </p>
              <Image
                alt={''}
                width={'100'}
                height={'100'}
                className="w-auto absolute hidden lg:flex right-0"
                src="/images/home/dev.svg"
              />
            </div>

            <div className="mt-8 ">
              <Image
                alt={''}
                width={'100'}
                height={'100'}
                className="w-auto max-w-xs"
                src="/images/home/hero-users.svg"
              />
            </div>
          </div>

          <div className="lg:w-2/5 flex justify-end relative">
            <Image
              alt={''}
              width={'100'}
              height={'100'}
              className="absolute left-1/4 hidden lg:flex -top-14 w-auto h-auto"
              src="/images/home/BS.svg"
            />
            <div className="relative">
              <Image
                alt={''}
                width={'100'}
                height={'100'}
                className="absolute top-1/2 hidden lg:flex -left-20 w-auto h-auto"
                src="/images/home/ui.svg"
              />
              <Image
                alt={''}
                width={'100'}
                height={'100'}
                src="/images/home/hero.svg"
                className={'w-auto h-auto'}
              />
            </div>
          </div>
        </div>

        {/* About */}
        <div className="mt-20 lg:mt-44">
          <div className="bg-white flex lg:flex-row flex-col gap-[20px] rounded-2xl inset-1 border border-[#E4E4E7] p-8">
            <div className="lg:w-1/2 font-circular max-w-xl text-[14px] md:text-[16px] lg:text-[18px] font-normal">
              <h1 className="text-[#7E8082] font-poppins font-semibold text-center lg:text-left text-[20px] md:text-[24px] lg:text-[32px] mt-2">
                About <span className="text-[#18181B]">DecentWork</span>
              </h1>

              <p className="text-[#545756] my-5">
                Work streamlines the freelance hiring process, providing
                businesses with instant access to a network of skilled
                professionals. Our platform enables seamless collaborations,
                efficient project management, and exceptional results
              </p>

              <span className="text-[#545756]">
                <span className="text-[#18181B]">Our Mission</span> is to
                empower businesses to achieve their goals by providing a
                seamless and efficient platform for connecting with top
                freelance talent.
              </span>
              <div className="mt-1" />
              <span className="text-[#545756]">
                <span className="text-[#18181B]">Our Vision</span> To
                revolutionize the way businesses work with freelancers, making
                it easier, faster and more effective
              </span>
            </div>

            <div className=" w-full lg:w-1/2 flex justify-end">
              <Image
                alt={''}
                width={'100'}
                height={'100'}
                className="w-full h-auto"
                src="/images/home/about-work.png"
              />
            </div>
          </div>
        </div>

        {/* Popular services */}
        <div className="mt-20 lg:mt-44">
          <h1 className="font-poppins font-semibold text-[20px] md:text-[25px] lg:*:text-[40px]">
            Popular Service
          </h1>

          <p className="mt-2 text-[#7E8082] text-[14px] md:text-[16px] lg:text-[18px] font-circular mini:max-w-4xl">
            Freelancing offers a wide range of in-demand services from web
            development and design to content creation, marketing, and beyond.
            Whatever your project needs, we’ve got the talent to make it happen.
          </p>

          <div className="flex lg:flex-row flex-col gap-x-14 service-gradient rounded-3xl overflow-hidden mt-8 lg:mt-16">
            <Image
              alt={''}
              width={'100'}
              height={'100'}
              className="w-full lg:w-2/5"
              src="/images/home/p-service1.png"
            />
            <Image
              alt={''}
              width={'100'}
              height={'100'}
              className="w-full lg:w-3/5 rounded-tr-2xl"
              src="/images/home/p-service2.svg"
            />
          </div>
        </div>

        {/* How it works */}
        <div className="">
          <div className="flex items-center flex-col mt-20 lg:mt-44">
            <h1 className="font-poppins font-bold text-[20px] md:text-[32px] lg:text-[48px]">
              How it Works
            </h1>
            <p className="text-[#7E8082] text-[16px] md:text-[20px] font-medium font-circular">
              Easy to use. Easy to apply
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 place-items-center mt-8 lg:mt-16">
            <Image
              alt={''}
              width={'100'}
              height={'100'}
              className="w-auto h-auto"
              src="/images/home/work1.svg"
            />
            <Image
              alt={''}
              width={'100'}
              height={'100'}
              className="w-auto h-auto"
              src="/images/home/work2.svg"
            />
            <Image
              alt={''}
              width={'100'}
              height={'100'}
              className="w-auto h-auto"
              src="/images/home/work3.svg"
            />
          </div>
        </div>

        {/* Ready to get started */}
        <div className="mt-20 lg:mt-44">
          <div className="bg-primary px-[20px] pt-[120px] lg:pt-0 pb-[140px] lg:pb-[0] lg:p-10 rounded-2xl overflow-hidden relative">
            <CanvasAnimation className="absolute lg:static w-full h-full lg:h-max lg:w-max top-0 left-0" />
            <SpiralAnimation className="absolute lg:right-[18%] -right-[43px] bottom-0 lg:bottom-[15%] scale-[0.30] lg:scale-100" />
            <MouseAnimation className="absolute lg:left-[12%] scale-50 lg:scale-100 lg:-bottom-[5%] -left-[50px] -bottom-[40px]" />
            <RayAnimation className="absolute top-[30px] -left-[5px] lg:left-[17%] lg:top-[20%] scale-50 lg:scale-100" />

            <div className="lg:absolute left-[10px] lg:left-1/2 lg:-translate-x-1/2 top-[10px] lg:top-1/2 lg:-translate-y-1/2 ">
              <div className="relative flex flex-col items-center">
                <p className="font-poppins text-white font-semibold text-[25px] lg:text-[40px]">
                  Ready to Get started?
                </p>
                <p className="font-circular text-[18px] text-white  font-normal mt-2 text-center lg:text-left">
                  Join our community of top freelancers and clients today
                </p>

                <div className="font-medium font-circular mt-8 flex flex-col lg:flex-row gap-y-[10px] gap-x-7 lg:w-max max-w-[400px] lg:max-w-max w-full">
                  <Button className="bg-transparent border border-white rounded-md text-white px-8">
                    <Link href={ApplicationRoutes.JOIN}>Post a Project</Link>
                  </Button>
                  <Button className="bg-white hover:bg-white/80 rounded-md text-primary">
                    <Link href={ApplicationRoutes.JOIN}>
                      Become a Freelancer
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
