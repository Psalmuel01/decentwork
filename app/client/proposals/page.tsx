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
import { Flex } from '@radix-ui/themes';
import { ApplicationRoutes } from '@/config/routes';

import LocationIcon from '@/icons/freelance/location-icon';

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

const APPROVE_PROPOSAL = `
  mutation ApproveProposal($freelancerWalletAddress: String!, $jobid: ID!) {
    ApproveProposal(freelancerWalletAddress: $freelancerWalletAddress, jobid: $jobid) {
      Proposals {
        bidAmount
        clientWalletAddress
        coverLetter
        createdAt
        deliveryTime
        freelancerWalletAddress
        proposalId
        status
      }
      code
      message
      success
    }
  }`;

const REJECT_PROPOSAL = `
  mutation RejectProposal($jobId: Int!, $freelancerAddress: String!) {
    rejectProposal(jobId: $jobId, freelancerAddress: $freelancerAddress) {
      success
      message
    }
  }`;

// Interfaces
export interface ProposalData {
  bidAmount: number;
  clientWalletAddress: string;
  coverLetter: string;
  createdAt: string;
  deliveryTime: number;
  freelancerWalletAddress: string;
  proposalId: string;
  status: 'accepted' | 'declined' | 'pending';
}

export interface JobData {
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
  const approveModal = useRef<HTMLDivElement>(null);
  const rejectModal = useRef<HTMLDivElement>(null);

  // State management
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalProposals, setTotalProposals] = useState(0);
  const [selectedProposal, setSelectedProposal] = useState<{
    job: JobData;
    proposal: ProposalData;
  } | null>(null);

  // Debug selected proposal changes
  useEffect(() => {
    console.log('Parent: selectedProposal state changed:', selectedProposal);
  }, [selectedProposal]);

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
        console.log('Parent: Loaded jobs data:', jobsData);
        console.log('Parent: First job structure:', jobsData[0]);
        if (jobsData[0]?.proposals) {
          console.log('Parent: First job proposals:', jobsData[0].proposals);
        }
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

  // Approve proposal
  const handleApproveProposal = async (
    jobId: string,
    freelancerAddress: string,
  ) => {
    if (!isAuthenticated) {
      setError('Please log in to approve this proposal');
      return;
    }

    setIsApproving(true);
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
          query: APPROVE_PROPOSAL,
          variables: {
            freelancerWalletAddress: freelancerAddress,
            jobid: jobId,
          },
        }),
      });

      const result = await response.json();
      if (result.errors) {
        throw new Error(
          result.errors[0]?.message || 'Failed to approve proposal',
        );
      }

      if (result.data?.ApproveProposal?.success) {
        // Close the modal and refresh data
        approveModal.current?.click();
        await fetchJobs();
      } else {
        throw new Error(
          result.data?.ApproveProposal?.message || 'Failed to approve proposal',
        );
      }
    } catch (err) {
      console.error('Error approving proposal:', err);
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred',
      );
    } finally {
      setIsApproving(false);
    }
  };

  // Reject proposal
  const handleRejectProposal = async (
    jobId: string,
    freelancerAddress: string,
  ) => {
    if (!isAuthenticated) {
      setError('Please log in to reject this proposal');
      return;
    }

    setIsRejecting(true);
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
          query: REJECT_PROPOSAL,
          variables: {
            jobId: parseInt(jobId),
            freelancerAddress: freelancerAddress,
          },
        }),
      });

      const result = await response.json();
      if (result.errors) {
        throw new Error(
          result.errors[0]?.message || 'Failed to reject proposal',
        );
      }

      if (result.data?.rejectProposal?.success) {
        // Close the modal and refresh data
        rejectModal.current?.click();
        await fetchJobs();
      } else {
        throw new Error(
          result.data?.rejectProposal?.message || 'Failed to reject proposal',
        );
      }
    } catch (err) {
      console.error('Error rejecting proposal:', err);
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred',
      );
    } finally {
      setIsRejecting(false);
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
              <AllProposals
                jobs={jobs || []}
                onProposalSelect={(job, proposal) => {
                  console.log(
                    'Parent: onProposalSelect called with:',
                    job,
                    proposal,
                  );
                  if (job && proposal) {
                    console.log('Parent: Setting selected proposal state');
                    setSelectedProposal({ job, proposal });
                  } else {
                    console.warn('Parent: Invalid job or proposal data');
                  }
                }}
              />
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
                  {selectedProposal && (
                    <span className="ml-2 text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                      ✓ Proposal Selected
                    </span>
                  )}
                </h2>
                <p className="text-[#7E8082] font-circular text-base">
                  Below are the contact details of the freelancer who has
                  submitted a proposal for your project role.
                </p>

                {selectedProposal ? (
                  <div className="mt-12 font-circular">
                    <p className="text-[#545756] font-medium text-lg">
                      Message for you:
                    </p>

                    <p className="text-[#545756] text-base font-normal mt-4">
                      {selectedProposal.proposal.coverLetter ||
                        'No cover letter provided.'}
                    </p>
                  </div>
                ) : (
                  <div className="mt-12 font-circular">
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <p className="text-[#7E8082] text-lg font-medium">
                        Select a proposal to view details
                      </p>
                      <p className="text-[#7E8082] text-sm mt-2">
                        Click on any proposal from the list above to see
                        freelancer details and take action.
                      </p>
                    </div>
                  </div>
                )}

                {selectedProposal && (
                  <div className="flex flex-col gap-y-4 mt-10">
                    <div className="">
                      <p className="text-[#545756] pb-3 font-medium">
                        Freelancer&apos;s Wallet Address
                      </p>
                      <div className="border-[#E4E4E7] flex items-center justify-between rounded-md py-3 text-[#545756] bg-[#F4F4F5] px-5 border">
                        <p className="">
                          {selectedProposal.proposal.freelancerWalletAddress}
                        </p>
                        <div
                          className="cursor-pointer"
                          onClick={() =>
                            copyToClipboard(
                              selectedProposal.proposal.freelancerWalletAddress,
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

                    <div className="">
                      <p className="text-[#545756] pb-3 font-medium">
                        Bid Amount
                      </p>
                      <div className="border-[#E4E4E7] flex items-center justify-between rounded-md py-3 text-[#545756] px-5 border">
                        <p className="text-lg font-semibold text-green-600">
                          ${selectedProposal.proposal.bidAmount}
                        </p>
                      </div>
                    </div>

                    <div className="">
                      <p className="text-[#545756] pb-3 font-medium">
                        Delivery Time
                      </p>
                      <div className="border-[#E4E4E7] flex items-center justify-between rounded-md py-3 text-[#545756] px-5 border">
                        <p className="">
                          {selectedProposal.proposal.deliveryTime} days
                        </p>
                      </div>
                    </div>

                    <div className="">
                      <p className="text-[#545756] pb-3 font-medium">
                        Proposal Status
                      </p>
                      <div className="border-[#E4E4E7] flex items-center justify-between rounded-md py-3 text-[#545756] px-5 border">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            selectedProposal.proposal.status === 'accepted'
                              ? 'bg-green-100 text-green-800'
                              : selectedProposal.proposal.status === 'declined'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {selectedProposal.proposal.status
                            .charAt(0)
                            .toUpperCase() +
                            selectedProposal.proposal.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="w-2/5 font-circular">
                {selectedProposal ? (
                  <>
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
                            {selectedProposal.proposal.freelancerWalletAddress.substring(
                              0,
                              6,
                            )}
                            ...
                            {selectedProposal.proposal.freelancerWalletAddress.substring(
                              20,
                            )}
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
                              <p className="text-xs text-[#7E8082]">Unknown</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between mt-4">
                        <div className="flex flex-col items-center">
                          <p className="text-sm font-medium">
                            ${selectedProposal.proposal.bidAmount}
                          </p>
                          <p className="text-[#7E8082] text-xs font-normal">
                            Bid Amount
                          </p>
                        </div>

                        <div className="flex flex-col items-center">
                          <p className="text-sm font-medium">
                            {selectedProposal.proposal.deliveryTime}
                          </p>
                          <p className="text-[#7E8082] text-xs font-normal">
                            Days
                          </p>
                        </div>
                      </div>

                      <div className="py-5">
                        <p className="text-[#545756] text-[15px] font-medium">
                          {selectedProposal.job.name}
                        </p>

                        <p className="text-[#7E8082] text-sm mt-2">
                          {selectedProposal.job.description.substring(0, 150)}
                          ...
                        </p>
                      </div>
                    </div>

                    <div className="mt-7 flex flex-col gap-y-2">
                      {selectedProposal.proposal.status === 'pending' && (
                        <>
                          <Button
                            onClick={() => {
                              approveModal.current?.click();
                            }}
                            className="text-white w-full"
                            disabled={isApproving}
                          >
                            {isApproving ? 'Processing...' : 'Approve Proposal'}
                          </Button>
                          <Button
                            onClick={() => {
                              rejectModal.current?.click();
                            }}
                            className="text-[#FB822F] hover:bg-white focus:bg-white border border-[#FB822F] bg-white w-full"
                          >
                            Reject proposal
                          </Button>
                        </>
                      )}
                      {selectedProposal.proposal.status !== 'pending' && (
                        <div className="text-center py-4">
                          <span
                            className={`px-4 py-2 rounded-full text-sm font-medium ${
                              selectedProposal.proposal.status === 'accepted'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            Proposal {selectedProposal.proposal.status}
                          </span>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="bg-[#F4F4F5] border border-[#E4E4E7] rounded-md px-5 py-6">
                    <div className="text-center py-8">
                      <p className="text-[#7E8082] text-lg font-medium">
                        No proposal selected
                      </p>
                      <p className="text-[#7E8082] text-sm mt-2">
                        Click on a proposal to see freelancer details here.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Approve Proposal Modal */}
      <Dialog>
        <DialogTrigger asChild>
          <div ref={approveModal} className="hidden">
            Approve Proposal
          </div>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px] bg-white">
          <div className="flex flex-col items-center">
            <p className="text-[20px] mb-6 font-poppins font-semibold text-[#18181B] mt-5">
              Approve Proposal from{' '}
              {selectedProposal
                ? `${selectedProposal.proposal.freelancerWalletAddress.substring(0, 6)}...${selectedProposal.proposal.freelancerWalletAddress.substring(20)}`
                : 'Freelancer'}
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
                You&apos;re about to approve this proposal. Once confirmed, the
                freelancer will be notified and granted project access.
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
              onClick={() => {
                if (selectedProposal) {
                  handleApproveProposal(
                    selectedProposal.job.jobid,
                    selectedProposal.proposal.freelancerWalletAddress,
                  );
                }
              }}
              className="w-1/2 mt-6 bg-primary text-white"
              disabled={isApproving || !selectedProposal}
            >
              {isApproving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Approve Proposal'
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
                Are you sure you want to reject this proposal? This action
                cannot be undone.
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
              onClick={() => {
                if (selectedProposal) {
                  handleRejectProposal(
                    selectedProposal.job.jobid,
                    selectedProposal.proposal.freelancerWalletAddress,
                  );
                }
              }}
              className="w-1/2 mt-6 bg-[#FB822F] text-white hover:bg-[#FB822F] focus:bg-[#FB822F]"
              disabled={isRejecting || !selectedProposal}
            >
              {isRejecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Reject proposal'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Page;
