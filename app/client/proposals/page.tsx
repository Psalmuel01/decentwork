'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, LucideMoveLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  PageBody,
  PageContainer,
  PageHeader,
  PageHeaderDescription,
  PageHeaderTitle,
} from '@/components/PageContainer';
import { Flex, Table, Text } from '@radix-ui/themes';
import { ApplicationRoutes } from '@/config/routes';
import CopyIcon from '@/icons/client/copy-icon';
import LocationIcon from '@/icons/freelance/location-icon';
import { LatestProposals } from '@/components/LatestProposals';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { AllProposals } from '@/components/AllProposals';

// API Configuration
const API_URL = 'https://decentwork.onrender.com/graphql';

// GraphQL Queries
const GET_JOBS = `
  query GetJobs {
    GetJobs {
      code
      jobdDetails {
        _id
        amount
        budget
        category
        clientWalletAddress
        clientid
        createdAt
        description
        duration
        jobid
        name
        proposals {
          bidAmount
          clientWalletAddress
          coverLetter
          createdAt
          deliveryTime
          freelancerWalletAddress
          proposalId
          status
        }
        proposalscount
        skills
        status
        token
      }
      message
      success
    }
  }`;

const ACCEPT_PROPOSAL = `
  mutation AcceptProposal($jobId: Int!, $freelancerAddress: String!) {
    acceptProposal(jobId: $jobId, freelancerAddress: $freelancerAddress) {
      success
      message
    }
  }`;

// Interfaces
interface ProposalData {
  bidAmount: number;
  clientWalletAddress: string;
  coverLetter: string;
  createdAt: string;
  deliveryTime: number;
  freelancerWalletAddress: string;
  proposalId: string;
  status: 'accepted' | 'declined' | 'pending';
}

interface JobData {
  amount: string;
  budget: number;
  category: string;
  clientWalletAddress: string;
  clientid: string;
  createdAt: string;
  description: string;
  duration: string;
  jobid: string;
  name: string;
  proposals: ProposalData[];
  proposalscount: number;
  skills: string[];
  status: string;
  token: string;
}

const Page = () => {
  const router = useRouter();
  const hireModal = useRef<HTMLDivElement>(null);
  const rejectModal = useRef<HTMLDivElement>(null);

  // State management
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isHiring, setIsHiring] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalProposals, setTotalProposals] = useState(0);

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsAuthenticated(!!token);
  }, []);

  // Fetch jobs with proposals
  const fetchJobs = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.log('No auth token found');
      return;
    }
    setIsLoadingJobs(true);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: GET_JOBS,
        }),
      });

      const result = await response.json();
      if (result.errors) {
        console.error('GraphQL errors:', result.errors);
        return;
      }

      const jobsData = result.data?.GetJobs?.jobdDetails;
      console.log({ jobsData });

      if (jobsData && Array.isArray(jobsData)) {
        setJobs(jobsData);
        // Calculate total proposals
        const total = jobsData.reduce(
          (sum, job) => sum + (job.proposalscount || 0),
          0,
        );
        setTotalProposals(total);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError('Failed to load proposals');
    } finally {
      setIsLoadingJobs(false);
    }
  };

  // Accept proposal
  const handleHireFreelancer = async (
    jobId: string,
    freelancerAddress: string,
  ) => {
    if (!isAuthenticated) {
      setError('Please log in to hire this freelancer');
      return;
    }

    setIsHiring(true);
    setError(null);

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: ACCEPT_PROPOSAL,
          variables: {
            jobId: parseInt(jobId),
            freelancerAddress: freelancerAddress,
          },
        }),
      });

      const result = await response.json();
      if (result.errors) {
        throw new Error(
          result.errors[0]?.message || 'Failed to hire freelancer',
        );
      }

      if (result.data?.acceptProposal?.success) {
        // Close the modal and refresh data
        hireModal.current?.click();
        await fetchJobs();
      } else {
        throw new Error(
          result.data?.acceptProposal?.message || 'Failed to hire freelancer',
        );
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

  // Copy to clipboard function
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).catch((err) => {
      console.error('Failed to copy: ', err);
    });
  };

  // Initialize data
  useEffect(() => {
    if (isAuthenticated) {
      fetchJobs();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Please Log In</h2>
          <p className="text-gray-600 mb-6">
            You need to be logged in to access proposals.
          </p>
          <Button onClick={() => router.push('/')}>Go to Login</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageContainer>
        <PageHeader>
          <PageHeaderTitle>Proposals</PageHeaderTitle>
          <PageHeaderDescription>
            {isLoadingJobs
              ? 'Loading proposals...'
              : `You've received ${totalProposals} proposals across your posted jobs.`}
          </PageHeaderDescription>
        </PageHeader>

        <PageBody>
          <Flex direction={'column'} gap={'8'} py={'8'}>
            <Flex direction={'column'} gap={'4'}>
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-800">{error}</p>
                </div>
              )}
              <AllProposals jobs={jobs} />
            </Flex>
          </Flex>
        </PageBody>
      </PageContainer>

      <main className="px-5 mb-36">
        <div className="max-w-screen-lg mx-auto w-full">
          <div className="bg-white relative rounded-xl p-10 mt-9 pb-32 font-circular">
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
                    I`m Onesty, a UX/UI designer with 4 years of experience in
                    product design field. I came across your job opening for
                    UIUX role and would love to bring my skills in branding,
                    user interfaces, user experience and prototyping to you.
                    Here`s what I offer: Boosted engagement by 30% through a
                    redesigned website. I turn complex ideas into visually
                    stunning, user-friendly designs. I work closely with teams
                    to align designs with business goals. I`d love to discuss
                    how I can contribute to your team. You can view my work
                    here: https://behance.net/onlyhonesst. Let me know a good
                    time to connect! Looking forward to hearing from you.
                  </p>
                </div>

                <div className="flex flex-col gap-y-4 mt-10">
                  <div className="">
                    <p className="text-[#545756] pb-3 font-medium">
                      Freelancer`s Email
                    </p>
                    <div className="border-[#E4E4E7] flex items-center justify-between rounded-md py-3 text-[#545756] px-5 border">
                      <p className="">JohnDoe@gmail.com</p>
                      <div
                        className="cursor-pointer"
                        onClick={() => copyToClipboard('JohnDoe@gmail.com')}
                      >
                        <CopyIcon />
                      </div>
                    </div>
                  </div>

                  <div className="">
                    <p className="text-[#545756] pb-3 font-medium">
                      Freelancer`s Phone
                    </p>
                    <div className="border-[#E4E4E7] flex items-center justify-between rounded-md py-3 text-[#545756] px-5 border">
                      <p className="">+234 701 111 2222</p>
                      <div
                        className="cursor-pointer"
                        onClick={() => copyToClipboard('+234 701 111 2222')}
                      >
                        <CopyIcon />
                      </div>
                    </div>
                  </div>

                  <div className="">
                    <p className="text-[#545756] pb-3 font-medium">
                      Freelancer`s Wallet Address
                    </p>
                    <div className="border-[#E4E4E7] flex items-center justify-between rounded-md py-3 text-[#545756] bg-[#F4F4F5] px-5 border">
                      <p className="">
                        0x22B202d30973456aD12c4358AF6758900B61bc5d
                      </p>
                      <div
                        className="cursor-pointer"
                        onClick={() =>
                          copyToClipboard(
                            '0x22B202d30973456aD12c4358AF6758900B61bc5d',
                          )
                        }
                      >
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
                      width={60}
                      height={60}
                      className={'rounded-full object-cover'}
                      src="/images/client/client.png"
                      alt="freelancer"
                    />
                    <div className="">
                      <p className="text-[#18181B] text-base font-medium">
                        Onest Man
                      </p>
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
                          <p className="text-xs text-[#7E8082]">Nigeria</p>
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
                    <p className="text-[#545756] text-[15px] font-medium">
                      UIUX Designer, Illustrator, Motion & Brand Designer
                    </p>

                    <p className="text-[#7E8082] text-sm mt-2">
                      I am a highly creative designer with over three years of
                      experience in the design industry. I have a deep
                      understanding of user-centered design...
                    </p>
                  </div>
                </div>

                <div className="mt-7 flex flex-col gap-y-2">
                  <Button
                    onClick={() => {
                      hireModal.current?.click();
                    }}
                    className="text-white w-full"
                    disabled={isHiring}
                  >
                    {isHiring ? 'Processing...' : 'Hire freelancer'}
                  </Button>
                  <Button
                    onClick={() => {
                      rejectModal.current?.click();
                    }}
                    className="text-[#FB822F] hover:bg-white focus:bg-white border border-[#FB822F] bg-white w-full"
                  >
                    Reject proposal
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Hire Modal */}
      <Dialog>
        <DialogTrigger asChild>
          <div ref={hireModal} className="hidden">
            Hire Freelancer
          </div>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px] bg-white">
          <div className="flex flex-col items-center">
            <p className="text-[20px] mb-6 font-poppins font-semibold text-[#18181B] mt-5">
              Hire Onest Man
            </p>

            <Image
              width={80}
              height={80}
              className={'rounded-full object-cover'}
              src="/images/client/client.png"
              alt="freelancer"
            />
            <span className="text-sm text-[#7E8082] mt-2">Freelancer</span>

            <div className="flex justify-center">
              <span className="text-[#7E8082] font-normal font-circular text-sm text-center mt-5">
                You're about to hire Onest Man. Once confirmed, they'll be
                notified and granted project access.
              </span>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md w-full">
                <p className="text-red-800 text-sm text-center">{error}</p>
              </div>
            )}
          </div>

          <div className="mb-3 flex space-x-3">
            <DialogClose className="w-full">
              <Button className="text-primary w-1/2 mt-6 border border-gray-300 bg-white hover:bg-gray-50 focus:bg-gray-50">
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={() =>
                handleHireFreelancer(
                  '1',
                  '0x22B202d30973456aD12c4358AF6758900B61bc5d',
                )
              }
              className="w-1/2 mt-6 bg-primary text-white"
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

      {/* Reject Modal */}
      <Dialog>
        <DialogTrigger asChild>
          <div ref={rejectModal} className="hidden">
            Reject Proposal
          </div>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px] bg-white">
          <div className="flex flex-col items-center">
            <p className="text-[20px] mb-6 font-poppins font-semibold text-[#18181B] mt-5">
              Reject Proposal
            </p>

            <Image
              width={80}
              height={80}
              className={'rounded-full object-cover'}
              src="/images/client/client.png"
              alt="freelancer"
            />
            <span className="text-sm text-[#7E8082] mt-2">Freelancer</span>

            <div className="flex justify-center">
              <span className="text-[#7E8082] font-normal font-circular text-sm text-center mt-5">
                Are you sure you want to reject Onest Man's proposal? This
                action cannot be undone.
              </span>
            </div>
          </div>

          <div className="mb-3 flex space-x-3">
            <DialogClose className="w-full">
              <Button className="text-primary w-1/2 mt-6 border border-gray-300 bg-white hover:bg-gray-50 focus:bg-gray-50">
                Cancel
              </Button>
            </DialogClose>
            <Button className="w-1/2 mt-6 bg-[#FB822F] text-white hover:bg-[#FB822F] focus:bg-[#FB822F]">
              Reject proposal
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Page;

// export function AllProposals({ jobs }: { jobs: JobData[] }) {
//   const [allProposals, setAllProposals] = useState<[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [statusFilter, setStatusFilter] = useState<
//     'all' | 'pending' | 'accepted' | 'declined'
//   >('all');

//   useEffect(() => {
//     const fetchJobsAndProposals = async () => {
//       const token = localStorage.getItem('authToken');
//       if (!token) {
//         setIsLoading(false);
//         return;
//       }

//       try {
//         if (!jobs || !Array.isArray(jobs)) {
//           setAllProposals([]);
//           return;
//         }

//         // Fetch details for each job to get proposals
//         const jobDetailsPromises = jobs.map(
//           async (job: { jobid: string; name: string; budget: number }) => {
//             try {
//               const detailsResponse = await fetch(API_URL, {
//                 method: 'POST',
//                 headers: {
//                   'Content-Type': 'application/json',
//                   Authorization: `Bearer ${token}`,
//                 },
//                 body: JSON.stringify({
//                   query: GET_JOB_DETAILS,
//                   variables: { jobid: job.jobid },
//                 }),
//               });

//               const detailsResult = await detailsResponse.json();
//               if (detailsResult.errors) {
//                 console.error(
//                   `Error fetching job ${job.jobid}:`,
//                   detailsResult.errors,
//                 );
//                 return null;
//               }

//               return detailsResult.data?.GetJobDetails?.jobdDetails;
//             } catch (error) {
//               console.error(
//                 `Error fetching job details for ${job.jobid}:`,
//                 error,
//               );
//               return null;
//             }
//           },
//         );

//         const jobDetailsResults = await Promise.all(jobDetailsPromises);
//         const validJobDetails = jobDetailsResults.filter(
//           (job): job is JobData => job !== null,
//         );

//         // Extract all proposals from jobs that have proposals
//         const proposals: ProposalWithJob[] = validJobDetails
//           .filter((job) => job.proposals && job.proposals.length > 0)
//           .flatMap((job) =>
//             job.proposals.map((proposal) => ({
//               ...proposal,
//               jobName: job.name,
//               jobId: job.jobid,
//               jobBudget: job.budget,
//             })),
//           )
//           .sort(
//             (a, b) =>
//               new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
//           );

//         setAllProposals(proposals);
//       } catch (error) {
//         console.error('Error fetching proposals:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchJobsAndProposals();
//   }, [jobs]);

//   const formatWalletAddress = (address: string) => {
//     if (!address) return 'Unknown';
//     if (address.length <= 12) return address;
//     return `${address.substring(0, 6)}...${address.substring(address.length - 6)}`;
//   };

//   const getStatusBadgeVariant = (status: string) => {
//     switch (status) {
//       case 'accepted':
//         return 'default';
//       case 'declined':
//         return 'destructive';
//       case 'pending':
//         return 'secondary';
//       default:
//         return 'outline';
//     }
//   };

//   const filteredProposals = allProposals.filter(
//     (proposal) => statusFilter === 'all' || proposal.status === statusFilter,
//   );

//   const getProposalStats = () => {
//     const total = allProposals.length;
//     const pending = allProposals.filter((p) => p.status === 'pending').length;
//     const accepted = allProposals.filter((p) => p.status === 'accepted').length;
//     const declined = allProposals.filter((p) => p.status === 'declined').length;

//     return { total, pending, accepted, declined };
//   };

//   const stats = getProposalStats();

//   return (
//     <div className="space-y-6">
//       {/* Statistics Cards */}
//       <div className="grid grid-cols-4 gap-4">
//         <Card>
//           <CardContent className="p-4">
//             <div className="text-2xl font-bold">{stats.total}</div>
//             <p className="text-xs text-muted-foreground">Total Proposals</p>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="p-4">
//             <div className="text-2xl font-bold text-yellow-600">
//               {stats.pending}
//             </div>
//             <p className="text-xs text-muted-foreground">Pending</p>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="p-4">
//             <div className="text-2xl font-bold text-green-600">
//               {stats.accepted}
//             </div>
//             <p className="text-xs text-muted-foreground">Accepted</p>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="p-4">
//             <div className="text-2xl font-bold text-red-600">
//               {stats.declined}
//             </div>
//             <p className="text-xs text-muted-foreground">Declined</p>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Main Proposals Card */}
//       <Card>
//         <CardHeader>
//           <div className="flex items-center justify-between">
//             <CardTitle>All Proposals ({filteredProposals.length})</CardTitle>
//             <div className="flex gap-2">
//               <Button
//                 size="sm"
//                 variant={statusFilter === 'all' ? 'default' : 'outline'}
//                 onClick={() => setStatusFilter('all')}
//               >
//                 All
//               </Button>
//               <Button
//                 size="sm"
//                 variant={statusFilter === 'pending' ? 'default' : 'outline'}
//                 onClick={() => setStatusFilter('pending')}
//               >
//                 Pending
//               </Button>
//               <Button
//                 size="sm"
//                 variant={statusFilter === 'accepted' ? 'default' : 'outline'}
//                 onClick={() => setStatusFilter('accepted')}
//               >
//                 Accepted
//               </Button>
//               <Button
//                 size="sm"
//                 variant={statusFilter === 'declined' ? 'default' : 'outline'}
//                 onClick={() => setStatusFilter('declined')}
//               >
//                 Declined
//               </Button>
//             </div>
//           </div>
//         </CardHeader>
//         <CardContent>
//           <div className="max-h-[70vh] overflow-y-auto">
//             <Table.Root variant="surface" className="w-full border-0">
//               <Table.Header>
//                 <Table.Row className="h-12 leading-[48px]">
//                   <Table.ColumnHeaderCell>Freelancer</Table.ColumnHeaderCell>
//                   <Table.ColumnHeaderCell align="center">
//                     Job Title
//                   </Table.ColumnHeaderCell>
//                   <Table.ColumnHeaderCell align="center">
//                     Status
//                   </Table.ColumnHeaderCell>
//                   <Table.ColumnHeaderCell align="center">
//                     Delivery Time
//                   </Table.ColumnHeaderCell>
//                   <Table.ColumnHeaderCell align="right">
//                     Bid Amount
//                   </Table.ColumnHeaderCell>
//                   <Table.ColumnHeaderCell align="right">
//                     Budget
//                   </Table.ColumnHeaderCell>
//                 </Table.Row>
//               </Table.Header>

//               <Table.Body>
//                 {isLoading ? (
//                   <Table.Row className="h-16 leading-[64px]">
//                     <Table.Cell colSpan={6} className="text-center">
//                       Loading proposals...
//                     </Table.Cell>
//                   </Table.Row>
//                 ) : filteredProposals.length > 0 ? (
//                   filteredProposals.map((proposal, index) => (
//                     <Table.Row
//                       key={`${proposal.proposalId}-${index}`}
//                       className="h-16 leading-[64px]"
//                     >
//                       <Table.RowHeaderCell>
//                         <Flex align="center" gap="3" className="h-full">
//                           <Avatar
//                             className="rounded-full"
//                             fallback={proposal.freelancerWalletAddress
//                               .substring(0, 2)
//                               .toUpperCase()}
//                             src="/avatar/avatar5.svg"
//                           />
//                           <Flex align="start" direction="column" gap="1">
//                             <Text size="2" weight="medium">
//                               {formatWalletAddress(
//                                 proposal.freelancerWalletAddress,
//                               )}
//                             </Text>
//                             <Text color="gray" size="1">
//                               {new Date(
//                                 proposal.createdAt,
//                               ).toLocaleDateString()}
//                             </Text>
//                           </Flex>
//                         </Flex>
//                       </Table.RowHeaderCell>
//                       <Table.Cell align="center">
//                         <Text
//                           className="truncate max-w-32"
//                           title={proposal.jobName}
//                         >
//                           {proposal.jobName}
//                         </Text>
//                       </Table.Cell>
//                       <Table.Cell align="center">
//                         <Badge
//                           variant={getStatusBadgeVariant(proposal.status)}
//                           className="capitalize"
//                         >
//                           {proposal.status}
//                         </Badge>
//                       </Table.Cell>
//                       <Table.Cell align="center">
//                         <Text size="2">{proposal.deliveryTime} days</Text>
//                       </Table.Cell>
//                       <Table.Cell align="right">
//                         <Text weight="medium" size="2">
//                           ${proposal.bidAmount}
//                         </Text>
//                       </Table.Cell>
//                       <Table.Cell align="right">
//                         <Text color="gray" size="2">
//                           ${proposal.jobBudget}
//                         </Text>
//                       </Table.Cell>
//                     </Table.Row>
//                   ))
//                 ) : (
//                   <Table.Row className="h-16 leading-[64px]">
//                     <Table.Cell
//                       colSpan={6}
//                       className="text-center text-gray-500"
//                     >
//                       {statusFilter === 'all'
//                         ? 'No proposals found'
//                         : `No ${statusFilter} proposals found`}
//                     </Table.Cell>
//                   </Table.Row>
//                 )}
//               </Table.Body>
//             </Table.Root>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
