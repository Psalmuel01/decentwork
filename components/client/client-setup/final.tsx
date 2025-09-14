'use client';
import UserCheck from '@/icons/client/user-check-01.svg';
import Image from 'next/image';

const FinalDetails = () => {
  return (
    <div className="w-full mt-32 flex justify-center items-center">
      <main className="bg-white w-[542px] rounded-[14px] py-[40px] px-[16px] flex flex-col items-center text-center gap-y-8">
        <Image src={UserCheck} alt="user check" />
        <div className="">
          <h2 className="text-[20px] text-[#18181B] font-semibold">
            Profile Updated
          </h2>
          <div className="text-[#545756] text-[14px]">
            <p>Thanks for keeping your profile up to date!</p>
            <p>Let us know if you need anything else.</p>
          </div>
        </div>
        <div className="bg-[#E3FFEF] h-[48px] w-[184px] rounded-[7px] text-[#2ECC71] grid place-items-center font-semibold">
          Redirecting...
        </div>
      </main>
    </div>
  );
};

export default FinalDetails;
