'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  PageBody,
  PageContainer,
  PageHeader,
  PageHeaderDescription,
  PageHeaderTitle,
} from '@/components/PageContainer';
import { Flex, Grid } from '@radix-ui/themes';
import DashboardCards from '@/components/DashboardCards';
import { ProposalEngagementChart } from '@/components/ProposalEngagementChart';
import { ActiveProjectsTable } from '@/components/ActiveProjectsTable';
import WalletIcon from '@/icons/wallet';
import ProjectIcon from '@/icons/navbar/ProjectIcon';
import ProposalIcon from '@/icons/navbar/ProposalIcon';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { ApplicationRoutes } from '@/config/routes';
// import ActiveHireJob from '@/components/client/active-project-card';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';
import ApplySuccess from '@/icons/freelance/apply-success';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// API Configuration
const API_URL = 'https://decentwork.onrender.com/graphql';

// GraphQL Queries
const GET_CLIENT_DETAILS = `
  query GetClientDetails {
    getClientDetails {
      code
      data {
        address
        bio
        city
        clientid
        companyName
        contact
        contactName
        country
        createdAt
        email
        imageURL
        industry
        linkedinLink
        role
        size
        socialLink
        walletAddress
        webLink
      }
      message
      success
    }
  }
`;

const CREATE_JOB = `
  mutation CreateJob($budget: Float!, $category: Category!, $description: String!, $duration: String!, $name: String!, $skills: [String!]!) {
    createJob(budget: $budget, category: $category, description: $description, duration: $duration, name: $name, skills: $skills) {
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
      skills
      status
      token
    }
  }
`;

const VIEW_FREELANCERS = `
  query ViewFreelancers {
    viewFreelancers {
      address
      bio
      category
      city
      country
      createdAt
      dateOfBirth
      email
      fluency
      freelancerid
      hourlyRate
      imageURL
      jobs
      language
      name
      phoneNumber
      postalCode
      rating
      skills
      speciality
      title
      walletAddress
    }
  }
`;

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

// Interfaces
interface ClientData {
  address: string;
  bio: string;
  city: string;
  clientid: string;
  companyName: string;
  contact: string;
  contactName: string;
  country: string;
  createdAt: string;
  email: string;
  imageURL: string;
  industry: string;
  linkedinLink: string;
  role: string;
  size: string;
  socialLink: string;
  walletAddress: string;
  webLink: string;
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

interface FreelancerData {
  address: string;
  bio: string;
  category: string;
  city: string;
  country: string;
  createdAt: string;
  dateOfBirth: string;
  email: string;
  fluency: string;
  freelancerid: string;
  hourlyRate: string;
  imageURL: string;
  jobs: number;
  language: string;
  name: string;
  phoneNumber: string;
  postalCode: string;
  rating: number;
  skills: string[];
  speciality: string;
  title: string;
  walletAddress: string;
}

// const dummyClient: ExpertCardType[] = [
//   {
//     details:
//       'I am a highly creative designer with over three years of experience in the design industry. I have a deep understanding...',
//     jobs: 55,
//     name: 'Onest Man',
//     rate: '3 AR/hr',
//     rating: 4.9,
//     title: 'UIUX Designer, Illustrator, Motion & Brand Designer',
//     location: 'Nigeria',
//   },
//   {
//     details:
//       'I am a highly creative designer with over three years of experience in the design industry. I have a deep understanding...',
//     jobs: 55,
//     name: 'Onest Man',
//     rate: '3 AR/hr',
//     rating: 4.9,
//     title: 'UIUX Designer, Illustrator, Motion & Brand Designer',
//     location: 'Nigeria',
//   },
//   {
//     details:
//       'I am a highly creative designer with over three years of experience in the design industry. I have a deep understanding...',
//     jobs: 55,
//     name: 'Onest Man',
//     rate: '3 AR/hr',
//     rating: 4.9,
//     title: 'UIUX Designer, Illustrator, Motion & Brand Designer',
//     location: 'Nigeria',
//   },
//   {
//     details:
//       'I am a highly creative designer with over three years of experience in the design industry. I have a deep understanding...',
//     jobs: 55,
//     name: 'Onest Man',
//     rate: '3 AR/hr',
//     rating: 4.9,
//     title: 'UIUX Designer, Illustrator, Motion & Brand Designer',
//     location: 'Nigeria',
//   },
// ];

const Page = () => {
  const router = useRouter();
  // const editJob = useRef<HTMLDivElement>(null);
  const { isNewClientUser } = useAuth();

  // State management
  const [clientData, setClientData] = useState<ClientData | null>(null);
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [, setFreelancers] = useState<FreelancerData[]>([]);
  const [, setIsLoadingJobs] = useState(false);
  const [, setIsLoadingFreelancers] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsAuthenticated(!!token);
  }, []);

  // Fetch client details
  const fetchClientDetails = async (): Promise<ClientData | null> => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.log('No auth token found');
      return null;
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: GET_CLIENT_DETAILS,
        }),
      });

      const result = await response.json();
      if (result.errors) {
        console.error('GraphQL errors:', result.errors);
        return null;
      }

      const clientDetails = result.data?.getClientDetails;
      if (clientDetails?.success && clientDetails?.data) {
        console.log('Client details:', clientDetails.data);
        return clientDetails.data;
      } else {
        console.log(
          'No client profile found or request failed:',
          clientDetails?.message,
        );
        return null;
      }
    } catch (error) {
      console.error('Error fetching client details:', error);
      return null;
    }
  };

  // Fetch freelancers
  const fetchFreelancers = async () => {
    setIsLoadingFreelancers(true);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: VIEW_FREELANCERS,
        }),
      });

      const result = await response.json();
      if (result.errors) {
        console.error('GraphQL errors:', result.errors);
        return;
      }

      const freelancersData = result.data?.viewFreelancers;
      if (freelancersData && Array.isArray(freelancersData)) {
        setFreelancers(freelancersData);
      }
    } catch (error) {
      console.error('Error fetching freelancers:', error);
    } finally {
      setIsLoadingFreelancers(false);
    }
  };

  const fetchJobs = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.log('No auth token found');
      return null;
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
      if (jobsData && Array.isArray(jobsData)) {
        setJobs(jobsData);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setIsLoadingJobs(false);
    }
  };

  // Initialize data and handle routing
  useEffect(() => {
    const handleInitialization = async () => {
      if (!isAuthenticated) return;

      const clientDetails = await fetchClientDetails();
      setClientData(clientDetails);

      if (clientDetails) {
        // Client profile exists, stay on dashboard
        // await fetchProjects();
        await fetchJobs();
        await fetchFreelancers();
      } else if (isNewClientUser) {
        // No profile exists but user is marked as new client, route to setup
        router.push(ApplicationRoutes.CLIENT_SETUP);
      }
    };

    handleInitialization();
  }, [isAuthenticated, isNewClientUser, router]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Get proposal count for a job
  // const getProposalCount = (jobId: string): number => {
  //   const job = jobs.find((j) => j.jobid === jobId);
  //   return job?.proposals?.length || 0;
  // };

  // Generate dashboard cards data
  const getDashboardCardsData = () => {
    const totalProposals = jobs.reduce(
      (sum, job) => sum + (job.proposalscount || 0),
      0,
    );
    const activeJobs = jobs.filter((j) => j.status === 'active').length;
    const completedProjects = jobs.filter(
      (j) => j.status === 'completed',
    ).length;

    return [
      {
        title: clientData?.walletAddress ? '0' : '0',
        subtitle: 'AR',
        description: 'Account Balance',
        icon: <WalletIcon />,
        showSelect: false,
      },
      {
        title: activeJobs.toString(),
        description: 'Active Jobs',
        icon: <ProjectIcon />,
        showSelect: true,
      },
      {
        title: jobs.length.toString(),
        description: 'Jobs Posted',
        icon: <WalletIcon />,
        showSelect: true,
      },
      {
        title: totalProposals.toString(),
        description: 'Total Proposals',
        icon: <ProposalIcon />,
        showSelect: true,
      },
      {
        title: completedProjects.toString(),
        description: 'Projects Completed',
        icon: <ProjectIcon />,
        showSelect: true,
      },
    ];
  };

  // const selectProjectForPayment = (job: JobData) => {
  //   setSelectedJob(job);
  //   if (job.budget) {
  //     setPaymentAmount(job.budget.toString());
  //   }
  //   if (confirmPayment.current) {
  //     confirmPayment.current.click();
  //   }
  // };

  // const handleSendPayment = async () => {
  //   if (!selectedJob || !isAuthenticated) {
  //     setTxError('Please log in and select a job first');
  //     return;
  //   }

  //   setIsProcessingPayment(true);
  //   setTxError(null);

  //   try {
  //     // Here you would implement the actual payment logic
  //     // For now, we'll simulate a successful payment
  //     await new Promise((resolve) => setTimeout(resolve, 2000));

  //     if (closeConfirmPayment.current) {
  //       closeConfirmPayment.current.click();
  //     }

  //     if (paymentSuccessModal.current) {
  //       paymentSuccessModal.current.click();
  //     }

  //     // Refresh projects data
  //     await fetchJobs();
  //   } catch (err) {
  //     console.error('Error sending payment:', err);
  //     setTxError(
  //       err instanceof Error ? err.message : 'Failed to process payment',
  //     );
  //   } finally {
  //     setIsProcessingPayment(false);
  //   }
  // };

  // const handleTerminateContract = async () => {
  //   if (!selectedJob || !isAuthenticated) {
  //     setTxError('Please log in and select a job first');
  //     return;
  //   }

  //   setIsProcessingPayment(true);
  //   setTxError(null);

  //   try {
  //     // Here you would implement the actual contract termination logic
  //     await new Promise((resolve) => setTimeout(resolve, 1500));

  //     // Refresh projects data
  //     // await fetchProjects();
  //     await fetchJobs();
  //   } catch (err) {
  //     console.error('Error terminating contract:', err);
  //     setTxError(
  //       err instanceof Error ? err.message : 'Failed to terminate contract',
  //     );
  //   } finally {
  //     setIsProcessingPayment(false);
  //   }
  // };

  if (!isAuthenticated) {
    return (
      <PageContainer>
        <PageHeader>
          <PageHeaderTitle>Please Log In</PageHeaderTitle>
          <PageHeaderDescription>
            You need to be logged in to access your client dashboard.
          </PageHeaderDescription>
        </PageHeader>
        <PageBody>
          <div className="flex justify-center mt-8">
            <Link href={ApplicationRoutes.HOME}>
              <Button>Go to Login</Button>
            </Link>
          </div>
        </PageBody>
      </PageContainer>
    );
  }

  return (
    <>
      <PageContainer>
        <PageHeader>
          <PageHeaderTitle>Dashboard</PageHeaderTitle>
          <PageHeaderDescription>
            Ready to find the right talent? You can post a new job, review
            proposals, or track ongoing hires.
          </PageHeaderDescription>
        </PageHeader>

        <PageBody>
          <Flex direction={'column'} gap={'8'} py={'8'}>
            <Grid columns={'5'} gap={'4'}>
              {getDashboardCardsData().map((card, index) => (
                <DashboardCards
                  key={index}
                  title={card.title}
                  subtitle={card.subtitle}
                  description={card.description}
                  icon={card.icon}
                  showSelect={card.showSelect}
                />
              ))}
            </Grid>

            <Grid columns={'5'} gap={'4'}>
              <div className="col-span-3">
                <ProposalEngagementChart />
              </div>
              <div className="col-span-2">
                <ActiveProjectsTable />
              </div>
            </Grid>

            <Flex direction={'column'} gap={'4'}>
              <ActiveProjectsTable />
            </Flex>
          </Flex>
        </PageBody>
      </PageContainer>

      {/* Payment Modal */}
      {/*<Dialog>
        <DialogTrigger asChild>
          <div ref={confirmPayment} className="hidden">
            Confirm Payment
          </div>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px] bg-white font-circular">
          <div className="flex flex-col items-center">
            <p className="text-[20px] font-poppins font-semibold text-[#18181B] mt-5">
              Make Payment
            </p>
            <div className="max-w-80 flex justify-center mb-5">
              <span className="text-[#7E8082] font-normal font-circular text-sm text-center mt-5">
                You`re about to pay{' '}
                <span className="text-[#18181B] font-medium">
                  ${paymentAmount}
                </span>{' '}
                for {selectedJob?.name || 'this project'}. Once confirmed, the
                payment will be processed.
              </span>
            </div>

            <Image
              src="/images/client/client.png"
              alt="payment"
              width={100}
              height={100}
            />
            <span className="text-base text-[#7E8082]">
              Sending{' '}
              <span className="text-lg text-black">${paymentAmount}</span>
            </span>

            {txError && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>{txError}</AlertDescription>
              </Alert>
            )}

            <div>
              <Button
                onClick={handleSendPayment}
                disabled={isProcessingPayment}
                className="text-white w-full mt-6 px-28"
              >
                {isProcessingPayment ? 'Processing...' : 'Confirm payment'}
              </Button>
            </div>
            <span className="text-[#7E8082] text-sm font-normal mt-4 mb-2">
              Need help? <span className="text-primary">Contact support.</span>
            </span>
          </div>
        </DialogContent>

        <DialogClose className="hidden">
          <div
            ref={closeConfirmPayment}
            className="w-full text-white px-9 mt-6 py-5 pb-6"
          >
            Close
          </div>
        </DialogClose>
      </Dialog>*/}

      {/* Terminate Contract Modal */}
      {/*<Dialog>
        <DialogTrigger asChild>
          <div ref={terminateContractModal} className="hidden">
            Terminate Contract
          </div>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px] bg-white">
          <div className="flex flex-col items-center">
            <p className="text-[20px] mb-6 font-poppins font-semibold text-[#18181B] mt-5">
              Terminate Contract
            </p>

            <Image
              width={100}
              height={100}
              src="/images/client/client.png"
              alt="terminate"
            />
            <span className="text-sm text-[#7E8082]">Project Contract</span>

            <div className="flex justify-center">
              <span className="text-[#7E8082] font-normal font-circular text-sm text-center mt-5">
                Terminating this contract will end the current project
                agreement. This action cannot be undone. Are you sure you want
                to proceed?
              </span>
            </div>
          </div>

          <div className="mb-3 flex space-x-3">
            <DialogClose className="w-full">
              <Button className="w-full mt-6 border border-gray-300 bg-white text-primary hover:bg-white focus:bg-white">
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={handleTerminateContract}
              disabled={isProcessingPayment}
              className="w-full mt-6 bg-[#FB822F] text-white hover:bg-[#FB822F] focus:bg-[#FB822F]"
            >
              {isProcessingPayment ? 'Processing...' : 'End Contract'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>*/}

      {/* Payment Success Modal */}
      {/*<Dialog>
        <DialogTrigger asChild>
          <div ref={paymentSuccessModal} className="hidden">
            Payment Success
          </div>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px] bg-white">
          <div className="flex flex-col items-center">
            <ApplySuccess className="scale-75" />

            <p className="text-[20px] font-poppins font-semibold text-[#18181B] mt-5">
              Payment Successful
            </p>

            <div className="max-w-80">
              <p className="font-circular text-[#545756] text-base text-center mt-5">
                Your payment of ${paymentAmount} has been successfully processed
                for {selectedJob?.name || 'the project'}. The freelancer will be
                notified of the payment.
              </p>
            </div>

            <DialogClose>
              <Button className="w-full text-white px-9 mt-6 py-5 pb-6">
                Okay
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>*/}
    </>
  );
};

export default Page;
