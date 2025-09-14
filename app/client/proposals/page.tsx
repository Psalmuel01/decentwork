'use client';

import { useClient } from '@/context/client-context';
import CopyIcon from '@/icons/client/copy-icon';
import { Loader2, LucideMoveLeft } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useXionWallet } from '@/context/xion-context';
import LocationIcon from '@/icons/freelance/location-icon';
import Link from 'next/link';
import { ApplicationRoutes } from '@/config/routes';
import {
  PageBody,
  PageContainer,
  PageHeader,
  PageHeaderDescription,
  PageHeaderTitle,
} from '@/components/PageContainer';
import { Flex } from '@radix-ui/themes';
import { Proposals } from '@/components/Proposals';
import Image from 'next/image';

const Page = () => {
  const hireModal = useRef<HTMLDivElement>(null);
  const rejectModal = useRef<HTMLDivElement>(null);
  const { isConnected } = useXionWallet();
  const { acceptProposal } = useClient();
  const [isHiring, setIsHiring] = useState(false);
  const [, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleHireFreelancer = async (
    jobId: string,
    freelancerAddress: string,
  ) => {
    if (!isConnected) {
      setError('Please connect to hire this freelancer');
      return;
    }

    setIsHiring(true);
    setError(null);

    try {
      const success = await acceptProposal(parseInt(jobId), freelancerAddress);

      if (success) {
        // Close the modal and show success message
        hireModal.current?.click();
        // You might want to show a success message or redirect
      } else {
        throw new Error('Failed to hire freelancer');
      }
    } catch (err) {
      console.error('Error hiring freelancer:', err);
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred',
      );
    } finally {
      setIsHiring(false);
    }
  };

  return (
    <>
      <PageContainer>
        <PageHeader>
          <PageHeaderTitle>Proposals</PageHeaderTitle>
          <PageHeaderDescription>
            You’ve received 14 new proposals across your posted jobs.
          </PageHeaderDescription>
        </PageHeader>

        <PageBody>
          <Flex direction={'column'} gap={'8'} py={'8'}>
            <Flex direction={'column'} gap={'4'}>
              <Proposals />
            </Flex>
          </Flex>
        </PageBody>
      </PageContainer>

      <main className="mt-32 px-5 mb-36">
        <div className="max-w-screen-lg mx-auto w-full">
          <div className="bg-white relative rounded-xl p-10 mt-9 pb-32 font-circular ">
            <Link href={ApplicationRoutes.CLIENT_DASHBOARD} className="">
              <LucideMoveLeft size={20} />
            </Link>

            <div className="flex mt-6 gap-x-9">
              <div className="w-3/5">
                <h2 className="font-poppins text-[24px] text-[#18181B] font-semibold">
                  Project Proposal Form
                </h2>
                <p className="text-[#7E8082] font-circular text-base">
                  Below are the contact details of the freelancer who has
                  submitted a proposal for your project role.
                </p>

                <div className="mt-12 font-circular">
                  <p className="text-[#545756] font-medium text-lg">
                    Message for you:
                  </p>

                  <p className="text-[#545756] text-base font-normal mt-4">
                    I’m Onesty, a UX/UI designer with 4 years of experience in
                    product design field. I came across your job opening for
                    UIUX role and would love to bring my skills in branding,
                    user interfaces, user experience and prototyping to you.
                    Here’s what I offer: Boosted engagement by 30% through a
                    redesigned website. I turn complex ideas into visually
                    stunning, user-friendly designs. I work closely with teams
                    to align designs with business goals. I’d love to discuss
                    how I can contribute to your team. You can view my work
                    here: https://behance.net/onlyhonesst. Let me know a good
                    time to connect! Looking forward to hearing from you.
                  </p>
                </div>

                <div className="flex flex-col gap-y-4 mt-10">
                  <div className="">
                    <p className="text-[#545756] pb-3 font-medium">
                      Freelancer’s Email
                    </p>
                    <div className="border-[#E4E4E7] flex items-center justify-between rounded-md py-3 text-[#545756] px-5 border">
                      <p className="">JohnDoe@gmail.com</p>
                      <div className="cursor-pointer">
                        <CopyIcon />
                      </div>
                    </div>
                  </div>

                  <div className="">
                    <p className="text-[#545756] pb-3 font-medium">
                      Freelancer’s Phone
                    </p>
                    <div className="border-[#E4E4E7] flex items-center justify-between rounded-md py-3 text-[#545756] px-5 border">
                      <p className="">+234 701 111 2222</p>
                      <div className="cursor-pointer">
                        <CopyIcon />
                      </div>
                    </div>
                  </div>

                  <div className="">
                    <p className="text-[#545756] pb-3 font-medium">
                      Freelancer’s Email
                    </p>
                    <div className="border-[#E4E4E7] flex items-center justify-between rounded-md py-3 text-[#545756] bg-[#F4F4F5] px-5 border">
                      <p className="">
                        0x22B202d30973456aD12c4358AF6758900B61bc5d
                      </p>
                      <div className="cursor-pointer">
                        <svg
                          width="21"
                          height="20"
                          viewBox="0 0 21 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M2.58398 6.82247C2.6707 5.0727 2.93013 3.98176 3.70618 3.2057C4.48225 2.42964 5.57319 2.17021 7.32296 2.0835M18.4173 6.82247C18.3306 5.0727 18.0712 3.98176 17.2952 3.2057C16.5191 2.42964 15.4281 2.17021 13.6783 2.0835M13.6783 17.9168C15.4281 17.8301 16.5191 17.5706 17.2952 16.7946C18.0712 16.0186 18.3306 14.9276 18.4173 13.1778M7.32295 17.9168C5.57319 17.8301 4.48225 17.5706 3.70618 16.7946C2.93013 16.0186 2.6707 14.9276 2.58398 13.1778"
                            stroke="#7E8082"
                            strokeWidth="1.25"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M8.41715 8.79548C8.41715 8.09406 8.30699 7.0112 8.7305 6.3798C9.6659 4.9852 11.6505 5.17046 12.3505 6.5317C12.6941 7.1998 12.5646 8.13385 12.5805 8.79548M8.41715 8.79548C7.33604 8.79548 7.11584 9.41439 6.9505 9.89981C6.79788 10.4459 6.6425 11.7498 6.8805 13.1786C7.05856 14.0887 7.75448 14.4891 8.35296 14.5398C8.92532 14.5883 11.3419 14.5698 12.0415 14.5698C13.1256 14.5698 13.8025 14.3315 14.1205 13.2392C14.2732 12.3897 14.3149 10.8706 14.0605 9.89981C13.7235 8.92889 13.0441 8.79548 12.5805 8.79548M8.41715 8.79548C9.56182 8.75006 11.9261 8.75906 12.5805 8.79548"
                            stroke="#7E8082"
                            strokeWidth="1.25"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-2/5 font-circular">
                <div className="bg-[#F4F4F5] border border-[#E4E4E7] rounded-md px-5 py-6">
                  <div className="flex items-center space-x-3">
                    <Image
                      width={100}
                      height={100}
                      className={'h-full w-full'}
                      src="/images/client/client.png"
                      alt="client"
                    />
                    <div className="">
                      <p className="text-[#18181B] text-base">Onest Man</p>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <svg
                            width="17"
                            height="16"
                            viewBox="0 0 17 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M8.4974 0.833008C9.19693 0.833008 9.74793 1.36136 10.0997 2.07428L11.2744 4.44311C11.31 4.51643 11.3945 4.61966 11.5214 4.7141C11.6482 4.80844 11.7724 4.86048 11.8541 4.87421L13.9805 5.23043C14.7486 5.35949 15.3924 5.736 15.6014 6.39161C15.8102 7.04667 15.5043 7.72741 14.9519 8.28074L14.9513 8.28134L13.2994 9.94694C13.2339 10.0129 13.1606 10.1373 13.1146 10.2993C13.0689 10.4602 13.0649 10.6068 13.0856 10.7015L13.0859 10.7028L13.5585 12.7633C13.7545 13.6208 13.6895 14.4712 13.0847 14.9158C12.4778 15.3619 11.6485 15.1641 10.895 14.7154L8.90173 13.5257C8.818 13.4757 8.67426 13.4351 8.50073 13.4351C8.32846 13.4351 8.18173 13.4751 8.09253 13.527L8.09126 13.5277L6.10192 14.7151C5.34936 15.1655 4.52102 15.3597 3.91407 14.9131C3.30966 14.4685 3.24142 13.6197 3.43807 12.7628L3.9106 10.7028L3.91088 10.7015C3.9316 10.6068 3.92755 10.4602 3.88187 10.2993C3.83587 10.1373 3.76252 10.0129 3.69705 9.94694L2.0439 8.28007C1.4951 7.72674 1.19014 7.04661 1.3973 6.39251C1.60506 5.73651 2.24762 5.35954 3.01622 5.23038L5.14088 4.87447L5.14155 4.87435C5.21944 4.86084 5.3418 4.80938 5.46832 4.71479C5.59507 4.62003 5.67973 4.51657 5.71541 4.44311L5.71721 4.43945L6.89041 2.07365L6.89088 2.07272C7.246 1.36039 7.79867 0.833008 8.4974 0.833008Z"
                              fill="#FED32E"
                            />
                          </svg>

                          <p className="text-sm font-medium">4.9</p>
                        </div>

                        <div className="flex items-center space-x-1">
                          <LocationIcon />
                          <p className="">Nigeria</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between mt-4">
                    <div className="flex flex-col items-center">
                      <p className="text-sm font-medium">3 AR/hr</p>
                      <p className="text-[#7E8082] text-xs font-normal">Rate</p>
                    </div>

                    <div className="flex flex-col items-center">
                      <p className="text-sm font-medium">55</p>
                      <p className="text-[#7E8082] text-xs font-normal">Jobs</p>
                    </div>
                  </div>

                  <div className="py-5">
                    <p className="text-[#545756] text-[15px]">
                      UIUX Designer, Illustrator, Motion & Brand Designer
                    </p>

                    <p className="text-[#7E8082] text-sm mt-2">
                      I am a highly creative designer with over three years of
                      experience in the design industry. I have a deep
                      understanding...
                    </p>
                  </div>
                </div>

                <div className="mt-7 flex flex-col gap-y-2">
                  <Button
                    onClick={() => {
                      hireModal.current?.click();
                    }}
                    className="text-white w-full"
                  >
                    Hire freelancer
                  </Button>
                  <Button
                    onClick={() => {
                      rejectModal.current?.click();
                    }}
                    className="text-[#FB822F] hover:bg-white focus:bg-white border border-[#FB822F] bg-white w-full"
                  >
                    Reject freelancer
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Hire  */}
      <Dialog>
        <DialogTrigger asChild>
          <div ref={hireModal} className="hidden">
            Edit Profile
          </div>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px] bg-white">
          <div className="flex flex-col items-center">
            <p className="text-[20px] mb-6 font-poppins font-semibold text-[#18181B] mt-5">
              Hire Onest Man
            </p>

            <Image
              width={100}
              height={100}
              className={'h-full w-full'}
              src="/images/client/client.png"
              alt="client"
            />
            <span className="text-sm text-[#7E8082]">Freelancer</span>

            <div className=" flex justify-center">
              <span className="text-[#7E8082] font-normal font-circular text-sm text-center mt-5">
                You’re about to hire Onest Man. Once confirmed, they’ll be
                notified and granted project access.
              </span>
            </div>
          </div>

          <div className="mb-3 flex space-x-3">
            <DialogClose className="w-full">
              <Button className="text-white w-full mt-6 border border-gray-300 bg-white text-primary hover:bg-white focus:bg-white">
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={() =>
                handleHireFreelancer('1', 'freelancer-address-here')
              }
              className="w-full mt-6 bg-primary text-white"
              disabled={isHiring}
            >
              {isHiring ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Confirm hire'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reject */}
      <Dialog>
        <DialogTrigger asChild>
          <div ref={rejectModal} className="hidden">
            Edit Profile
          </div>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px] bg-white">
          <div className="flex flex-col items-center">
            <p className="text-[20px] mb-6 font-poppins font-semibold text-[#18181B] mt-5">
              Reject Proposal
            </p>

            <Image
              width={100}
              height={100}
              className={'w-full h-full'}
              src="/images/client/client.png"
              alt="client"
            />
            <span className="text-sm text-[#7E8082]">Freelancer</span>

            <div className=" flex justify-center">
              <span className="text-[#7E8082] font-normal font-circular text-sm text-center mt-5">
                Are you sure you want to reject Onest Man’s proposal? This
                action cannot be undone.
              </span>
            </div>
          </div>

          <div className="mb-3 flex space-x-3">
            <DialogClose className="w-full">
              <Button className="text-white w-full mt-6 border border-gray-300 bg-white text-primary hover:bg-white focus:bg-white">
                Cancel
              </Button>
            </DialogClose>
            <Button className="w-full mt-6 bg-[#FB822F] text-white hover:bg-[#FB822F] focus:bg-[#FB822F]">
              Reject proposal
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Page;
