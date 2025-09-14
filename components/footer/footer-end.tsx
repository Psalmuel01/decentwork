import Image from 'next/image';

const FooterEnd = () => {
  return (
    <>
      <div className="flex lg:justify-center mt-[40px] lg:mt-0">
        <div className="flex flex-col gap-y-3 text-[#545756]">
          <p className="font-circular text-[15px] font-normal">
            Join our community
          </p>

          <div className="flex items-center space-x-4">
            <Image
              alt={''}
              width={100}
              height={100}
              className="w-full h-full"
              src="/images/footer/x.svg"
            />
            <Image
              alt={''}
              width={100}
              height={100}
              className="w-full h-full"
              src="/images/footer/instagram.svg"
            />
            <Image
              alt={''}
              width={100}
              height={100}
              className="w-full h-full"
              src="/images/footer/linkedin.svg"
            />
            <Image
              alt={''}
              width={100}
              height={100}
              className="w-full h-full"
              src="/images/footer/discord.svg"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default FooterEnd;
