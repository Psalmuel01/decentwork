import FreelancCalendar from '@/icons/freelance/freelance-calendar';
import { Button } from '../ui/button';
import Image from 'next/image';

type ActiveHireJobProps = {
  acceptPayModal: React.MutableRefObject<HTMLDivElement>;
  terminateContract: React.MutableRefObject<HTMLDivElement>;
};

const ActiveHireJob = ({
  acceptPayModal,
  terminateContract,
}: ActiveHireJobProps) => {
  return (
    <>
      <div className="">
        <div className="flex space-x-3">
          <div className="h-8 rounded-full w-8 min-w-16 flex items-center justify-center">
            <Image
              width={100}
              height={100}
              className={'w-auto h-auto'}
              src="/images/client/client.png"
              alt="client"
            />
          </div>

          <div className="w-full">
            <div className="flex justify-between items-center font-circular space-x-5 w-full">
              <p className=" text-sm text-[#545756]">Onest Man</p>
              <span className="text-[#7E8082] text-sm ">
                <span className="text-[#18181B]">50.5</span> AR
              </span>
            </div>

            <div className="flex items-center justify-between space-x-3 flex-wrap mt-1 font-circular">
              <div className="flex items-center space-x-2">
                <p className=" text-xs text-[#545756]">UI/UX Designer</p>

                <div className="flex items-center space-x-1">
                  <svg
                    className="scale-90"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7.9974 0.833008C8.69693 0.833008 9.24793 1.36136 9.59966 2.07428L10.7744 4.44311C10.81 4.51643 10.8945 4.61966 11.0214 4.7141C11.1482 4.80844 11.2724 4.86048 11.3541 4.87421L13.4805 5.23043C14.2486 5.35949 14.8924 5.736 15.1014 6.39161C15.3102 7.04667 15.0043 7.72741 14.4519 8.28074L14.4513 8.28134L12.7994 9.94694C12.7339 10.0129 12.6606 10.1373 12.6146 10.2993C12.5689 10.4602 12.5649 10.6068 12.5856 10.7015L12.5859 10.7028L13.0585 12.7633C13.2545 13.6208 13.1895 14.4712 12.5847 14.9158C11.9778 15.3619 11.1485 15.1641 10.395 14.7154L8.40173 13.5257C8.318 13.4757 8.17426 13.4351 8.00073 13.4351C7.82846 13.4351 7.68173 13.4751 7.59253 13.527L7.59126 13.5277L5.60192 14.7151C4.84936 15.1655 4.02102 15.3597 3.41407 14.9131C2.80966 14.4685 2.74142 13.6197 2.93807 12.7628L3.4106 10.7028L3.41088 10.7015C3.4316 10.6068 3.42755 10.4602 3.38187 10.2993C3.33587 10.1373 3.26252 10.0129 3.19705 9.94694L1.5439 8.28007C0.995098 7.72674 0.690138 7.04661 0.897298 6.39251C1.10506 5.73651 1.74762 5.35954 2.51622 5.23038L4.64088 4.87447L4.64155 4.87435C4.71944 4.86084 4.8418 4.80938 4.96832 4.71479C5.09507 4.62003 5.17973 4.51657 5.21541 4.44311L5.21721 4.43945L6.39041 2.07365L6.39088 2.07272C6.746 1.36039 7.29867 0.833008 7.9974 0.833008Z"
                      fill="#FED32E"
                    />
                  </svg>
                  <p className="text-xs">4.9</p>
                </div>
              </div>

              <div className="flex items-center space-x-1">
                <FreelancCalendar />
                <p className="font-circular text-[#7E8082] text-sm">
                  1 - 2 weeks
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-5 font-circular text-sm mt-4">
          <Button
            onClick={() => {
              terminateContract.current.click();
            }}
            className="w-1/2 bg-white hover:bg-white rounded-full focus:bg-white border-[#FB822F] text-[#FB822F] border"
          >
            Terminate
          </Button>
          <Button
            onClick={() => {
              acceptPayModal.current.click();
            }}
            className="w-1/2 bg-[#D4FFE7] hover:bg-[#D4FFE7] rounded-full focus:bg-[#F4F4F5] text-[#7E8082] border-[#8EFFBE] border"
          >
            Pay now
          </Button>
        </div>
      </div>
    </>
  );
};

export default ActiveHireJob;
