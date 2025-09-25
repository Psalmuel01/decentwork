'use client';

import { LucidePlus } from 'lucide-react';
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
import { LatestProposals } from '@/components/LatestProposals';
import { AllProposals } from '@/components/AllProposals';
import { ExpertCardType } from '@/types';
import WalletIcon from '@/icons/wallet';
import ProjectIcon from '@/icons/navbar/ProjectIcon';
import ProposalIcon from '@/icons/navbar/ProposalIcon';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { ApplicationRoutes } from '@/config/routes';
import NoPostIcon from '@/icons/client/no-post-icon';
import PostJobCard from '@/components/client/job-card';
import NotificationCard from '@/components/freelancer/notification-card';
// import ActiveHireJob from '@/components/client/active-project-card';
import ExpertCard from '@/components/client/expert-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import CompletedJobs from '@/components/client/completed-jobs';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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

const dummyClient: ExpertCardType[] = [
  {
    details:
      'I am a highly creative designer with over three years of experience in the design industry. I have a deep understanding...',
    jobs: 55,
    name: 'Onest Man',
    rate: '3 AR/hr',
    rating: 4.9,
    title: 'UIUX Designer, Illustrator, Motion & Brand Designer',
    location: 'Nigeria',
  },
  {
    details:
      'I am a highly creative designer with over three years of experience in the design industry. I have a deep understanding...',
    jobs: 55,
    name: 'Onest Man',
    rate: '3 AR/hr',
    rating: 4.9,
    title: 'UIUX Designer, Illustrator, Motion & Brand Designer',
    location: 'Nigeria',
  },
  {
    details:
      'I am a highly creative designer with over three years of experience in the design industry. I have a deep understanding...',
    jobs: 55,
    name: 'Onest Man',
    rate: '3 AR/hr',
    rating: 4.9,
    title: 'UIUX Designer, Illustrator, Motion & Brand Designer',
    location: 'Nigeria',
  },
  {
    details:
      'I am a highly creative designer with over three years of experience in the design industry. I have a deep understanding...',
    jobs: 55,
    name: 'Onest Man',
    rate: '3 AR/hr',
    rating: 4.9,
    title: 'UIUX Designer, Illustrator, Motion & Brand Designer',
    location: 'Nigeria',
  },
];

const Page = () => {
  const router = useRouter();
  // const editJob = useRef<HTMLDivElement>(null);
  const { hasJob, isNewClientUser } = useAuth();
  const confirmPayment = useRef<HTMLDivElement>(null);
  const closeConfirmPayment = useRef<HTMLDivElement>(null);
  const terminateContractModal = useRef<HTMLDivElement>(null);
  const paymentSuccessModal = useRef<HTMLDivElement>(null);

  // State management
  const [clientData, setClientData] = useState<ClientData | null>(null);
  // const [projects, setProjects] = useState<ProjectData[]>([]);
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [freelancers, setFreelancers] = useState<FreelancerData[]>([]);
  // const [selectedProject, setSelectedProject] = useState<ProjectData | null>(
  //   null,
  // );
  const [selectedJob, setSelectedJob] = useState<JobData | null>(null);
  // const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);
  const [isLoadingFreelancers, setIsLoadingFreelancers] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [txError, setTxError] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<string>('0');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Create Job Modal State
  const [isCreateJobOpen, setIsCreateJobOpen] = useState(false);
  const [isCreatingJob, setIsCreatingJob] = useState(false);
  const [createJobError, setCreateJobError] = useState<string | null>(null);
  const [jobFormData, setJobFormData] = useState({
    name: '',
    description: '',
    budget: '',
    duration: '',
    category: '',
    skills: [] as string[],
  });
  const [skillInput, setSkillInput] = useState('');

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
      console.log(jobsData);
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
      (sum, job) => sum + (job.proposals?.length || 0),
      0,
    );
    const activeJobs = jobs.filter((j) => j.status === 'active').length;
    const completedProjects = jobs.filter(
      (j) => j.status === 'completed',
    ).length;

    return [
      {
        title: clientData?.walletAddress ? '0' : '0',
        subtitle: 'USD',
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

  const selectProjectForPayment = (job: JobData) => {
    setSelectedJob(job);
    if (job.budget) {
      setPaymentAmount(job.budget.toString());
    }
    if (confirmPayment.current) {
      confirmPayment.current.click();
    }
  };

  const handleSendPayment = async () => {
    if (!selectedJob || !isAuthenticated) {
      setTxError('Please log in and select a job first');
      return;
    }

    setIsProcessingPayment(true);
    setTxError(null);

    try {
      // Here you would implement the actual payment logic
      // For now, we'll simulate a successful payment
      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (closeConfirmPayment.current) {
        closeConfirmPayment.current.click();
      }

      if (paymentSuccessModal.current) {
        paymentSuccessModal.current.click();
      }

      // Refresh projects data
      await fetchJobs();
    } catch (err) {
      console.error('Error sending payment:', err);
      setTxError(
        err instanceof Error ? err.message : 'Failed to process payment',
      );
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleTerminateContract = async () => {
    if (!selectedJob || !isAuthenticated) {
      setTxError('Please log in and select a job first');
      return;
    }

    setIsProcessingPayment(true);
    setTxError(null);

    try {
      // Here you would implement the actual contract termination logic
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Refresh projects data
      // await fetchProjects();
      await fetchJobs();
    } catch (err) {
      console.error('Error terminating contract:', err);
      setTxError(
        err instanceof Error ? err.message : 'Failed to terminate contract',
      );
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    setClientData(null);
    setJobs([]);
    setFreelancers([]);
    router.push(ApplicationRoutes.HOME);
  };

  const handleCreateJob = async () => {
    if (!isAuthenticated) {
      setCreateJobError('Please log in to create a job');
      return;
    }

    if (
      !jobFormData.name ||
      !jobFormData.description ||
      !jobFormData.budget ||
      !jobFormData.duration ||
      !jobFormData.category ||
      jobFormData.skills.length === 0
    ) {
      setCreateJobError('Please fill in all required fields');
      return;
    }

    setIsCreatingJob(true);
    setCreateJobError(null);

    try {
      const token = localStorage.getItem('authToken');
      const skillsArray = jobFormData.skills;

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: CREATE_JOB,
          variables: {
            name: jobFormData.name,
            description: jobFormData.description,
            budget: parseFloat(jobFormData.budget),
            duration: jobFormData.duration,
            category: jobFormData.category,
            skills: skillsArray,
          },
        }),
      });

      console.log(jobFormData);
      const result = await response.json();
      console.log(result);

      if (result.errors) {
        console.error('GraphQL errors:', result.errors);
        setCreateJobError(result.errors[0]?.message || 'Failed to create job');
        return;
      }

      if (result.data?.createJob) {
        // Reset form
        setJobFormData({
          name: '',
          description: '',
          budget: '',
          duration: '',
          category: '',
          skills: [],
        });
        setSkillInput('');

        // Close modal
        setIsCreateJobOpen(false);

        // Refresh projects
        // await fetchProjects();
        await fetchJobs();
      } else {
        setCreateJobError('Failed to create job');
      }
    } catch (error) {
      console.error('Error creating job:', error);
      setCreateJobError(
        error instanceof Error ? error.message : 'Failed to create job',
      );
    } finally {
      setIsCreatingJob(false);
    }
  };

  const handleJobFormChange = (field: string, value: string | string[]) => {
    setJobFormData((prev) => ({ ...prev, [field]: value }));
    if (createJobError) setCreateJobError(null);
  };

  const addSkill = () => {
    const skill = skillInput.trim();
    if (skill && !jobFormData.skills.includes(skill)) {
      handleJobFormChange('skills', [...jobFormData.skills, skill]);
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    handleJobFormChange(
      'skills',
      jobFormData.skills.filter((skill) => skill !== skillToRemove),
    );
  };

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
              <LatestProposals jobs={jobs} />
            </Flex>
          </Flex>
        </PageBody>
      </PageContainer>

      <main className="mt-32 mb-20">
        <div className="app-container">
          <div className="flex justify-end items-center mb-5">
            <div className="flex items-center gap-4">
              {clientData && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center px-3 py-1 bg-green-50 rounded-lg">
                    <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                    <span className="text-sm text-green-800">
                      Logged in as{' '}
                      {clientData.contactName || clientData.companyName}
                    </span>
                  </div>
                </div>
              )}

              <Dialog open={isCreateJobOpen} onOpenChange={setIsCreateJobOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center text-white space-x-2">
                    <LucidePlus size={20} />
                    <p className="font-circular font-medium text-sm">
                      Create a job
                    </p>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px] bg-white font-circular max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-[#18181B]">
                      Create New Job
                    </DialogTitle>
                  </DialogHeader>

                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="job-name"
                        className="text-sm font-medium text-gray-700"
                      >
                        Job Title *
                      </Label>
                      <Input
                        id="job-name"
                        value={jobFormData.name}
                        onChange={(e) =>
                          handleJobFormChange('name', e.target.value)
                        }
                        placeholder="Enter job title"
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="job-description"
                        className="text-sm font-medium text-gray-700"
                      >
                        Description *
                      </Label>
                      <Textarea
                        id="job-description"
                        value={jobFormData.description}
                        onChange={(e) =>
                          handleJobFormChange('description', e.target.value)
                        }
                        placeholder="Describe your project requirements..."
                        rows={4}
                        className="w-full"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="job-budget"
                          className="text-sm font-medium text-gray-700"
                        >
                          Budget (USD) *
                        </Label>
                        <Input
                          id="job-budget"
                          type="number"
                          min="0"
                          step="0.01"
                          value={jobFormData.budget}
                          onChange={(e) =>
                            handleJobFormChange('budget', e.target.value)
                          }
                          placeholder="0.00"
                          className="w-full"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="job-duration"
                          className="text-sm font-medium text-gray-700"
                        >
                          Duration *
                        </Label>
                        <Input
                          id="job-duration"
                          value={jobFormData.duration}
                          onChange={(e) =>
                            handleJobFormChange('duration', e.target.value)
                          }
                          placeholder="e.g., 2 weeks, 1 month"
                          className="w-full"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="job-category"
                        className="text-sm font-medium text-gray-700"
                      >
                        Category *
                      </Label>
                      <Select
                        value={jobFormData.category}
                        onValueChange={(value) =>
                          handleJobFormChange('category', value)
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="BLOCKCHAIN">Blockchain</SelectItem>
                          <SelectItem value="CONTENT_WRITING">
                            Content Writing
                          </SelectItem>
                          <SelectItem value="DATA_SCIENCE">
                            Data Science
                          </SelectItem>
                          <SelectItem value="DIGITAL_MARKETING">
                            Digital Marketing
                          </SelectItem>
                          <SelectItem value="GRAPHIC_DESIGN">
                            Graphic Design
                          </SelectItem>
                          <SelectItem value="MOBILE_DEVELOPMENT">
                            Mobile Development
                          </SelectItem>
                          <SelectItem value="VIRTUAL_ASSISTANCE">
                            Virtual Assistance
                          </SelectItem>
                          <SelectItem value="WEB_DEVELOPMENT">
                            Web Development
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="job-skills"
                        className="text-sm font-medium text-gray-700"
                      >
                        Required Skills *
                      </Label>
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <Input
                            id="job-skills"
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                addSkill();
                              }
                            }}
                            placeholder="Add a skill (e.g., React, Node.js)"
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            onClick={addSkill}
                            variant="outline"
                            className="px-6"
                          >
                            Add
                          </Button>
                        </div>
                        {jobFormData.skills.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {jobFormData.skills.map((skill, index) => (
                              <div
                                key={index}
                                className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-2"
                              >
                                {skill}
                                <button
                                  type="button"
                                  onClick={() => removeSkill(skill)}
                                  className="text-primary hover:text-primary/80"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">
                        Press Enter or click Add to add skills
                      </p>
                    </div>

                    {createJobError && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-red-800 text-sm">{createJobError}</p>
                      </div>
                    )}

                    <div className="flex space-x-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsCreateJobOpen(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleCreateJob}
                        disabled={isCreatingJob}
                        className="flex-1 bg-primary text-white hover:bg-primary/90"
                      >
                        {isCreatingJob ? 'Creating...' : 'Create Job'}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Button
                variant="destructive"
                size="default"
                onClick={handleLogout}
              >
                <span className="mr-2">⏻</span> Logout
              </Button>
            </div>
          </div>

          {txError && (
            <div className="mt-4 p-4 bg-red-100 rounded-md mb-4">
              <p className="text-red-800 font-medium">Error occurred</p>
              <p className="text-sm">{txError}</p>
            </div>
          )}

          <div className="flex flex-row justify-between gap-x-4">
            <Tabs defaultValue="overview">
              <TabsList>
                <TabsTrigger value="overview">Jobs</TabsTrigger>
                <TabsTrigger value="bounties">Bounties</TabsTrigger>
                <TabsTrigger value="proposals">Proposals</TabsTrigger>
                <TabsTrigger value="completed">Completed Jobs</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <div className="grid grid-cols-12 gap-x-3">
                  <div className="bg-white shadow-md h-[90vh] overflow-hidden rounded-lg col-span-8 p-6 px-8">
                    <div className="border-b border-gray-200 p-4 text-[#7E8082] font-medium text-lg">
                      Job Overview
                    </div>

                    {isLoadingJobs ? (
                      <div className="flex items-center justify-center py-10">
                        <p className="text-gray-500">Loading jobs...</p>
                      </div>
                    ) : jobs && jobs.length > 0 ? (
                      <div className="divide-y divide-gray-300 flex flex-col gap-y-10 pt-8 h-[70vh] overflow-y-auto custom-scrollbar pb-20">
                        {jobs.map((job, index) => (
                          <PostJobCard
                            key={`job-${index}-${job.jobid}`}
                            data={{
                              id: job.jobid,
                              title: job.name,
                              description: job.description,
                              budget: job.budget,
                              status: job.status,
                              category: job.category,
                              skills: job.skills,
                              timeline: job.duration,
                              createdAt: job.createdAt,
                              token: job.token,
                              proposalCount: job.proposalscount,
                            }}
                            // editJob={editJob}
                            onSelectForPayment={() =>
                              selectProjectForPayment(job)
                            }
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="pt-20 flex flex-col items-center font-circular">
                        <NoPostIcon className="scale-90" />
                        <p className="text-[#545756] my-9">
                          No active jobs found. Try creating a new job!
                        </p>
                        <Button
                          onClick={() => setIsCreateJobOpen(true)}
                          className="flex items-center text-primary bg-white space-x-3 border border-primary rounded-md hover:bg-white focus:bg-white"
                        >
                          <LucidePlus size={20} />
                          <p className="font-medium text-base">Create a Job</p>
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="col-span-4 pb-10 overflow-y-auto custom-scrollbar flex flex-col gap-y-6 font-circular">
                    <div className="bg-white rounded-lg shadow-md min-h-52">
                      <div className="border-b border-gray-200 p-4 text-[#7E8082] font-medium text-lg">
                        Notifications
                      </div>
                      <div className="p-4">
                        <NotificationCard />
                      </div>
                    </div>

                    {hasJob && (
                      <div className="bg-white rounded-lg font-circular shadow-md min-h-52">
                        <div className="border-b border-gray-200 p-4 text-[#7E8082] font-medium text-lg">
                          Active Jobs
                        </div>
                        <div className="p-4">
                          <div>
                            {/*<ActiveHireJob
                              acceptPayModal={confirmPayment}
                              terminateContract={terminateContractModal}
                            />*/}
                          </div>

                          <div className="mt-4 bg-blue-50 border border-blue-100 rounded-md p-4">
                            <h4 className="text-blue-800 font-medium mb-2">
                              Next Steps After Accepting a Proposal
                            </h4>
                            <ul className="text-sm text-blue-700 space-y-2 list-disc pl-4">
                              <li>
                                Communicate with the freelancer about your
                                project details and expectations
                              </li>
                              <li>
                                Monitor project progress in this `Active
                                Projects` section
                              </li>
                              <li>
                                Make payment when the freelancer completes their
                                work
                              </li>
                            </ul>
                            <p className="text-xs text-blue-600 mt-3 italic">
                              Note: The freelancer will mark the job as complete
                              when finished. You`ll be able to review the work
                              and make payment.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="bg-[#18181B] rounded-lg font-circular shadow-md min-h-52 mb-20 p-8 relative">
                      <p className="font-poppins text-white font-bold text-sm">
                        Get started
                      </p>
                      <p className="font-circular text-base text-[#F4F4F5] mt-3">
                        Start your journey now and connect with freelancers to
                        bring their projects to life.
                      </p>
                      <Button className="flex items-center space-x-2 text-white bg-[#545756] mt-6">
                        <p>Learn more</p>
                        <svg
                          className="scale-90"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M16.5 7.5L6 18"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                          <path
                            d="M8 6.18791C8 6.18791 16.0479 5.50949 17.2692 6.73079C18.4906 7.95209 17.812 16 17.812 16"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </Button>

                      <div className="absolute bottom-0 right-0">
                        <svg
                          width="72"
                          height="72"
                          viewBox="0 0 72 72"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M23.0405 26.1139C23.1074 25.3881 23.3539 24.639 23.9965 23.9964C24.6391 23.3538 25.3881 23.1073 26.114 23.0404C26.6855 22.9876 27.4435 23.0512 28.0271 23.1003C31.812 23.4154 35.5891 24.688 38.5745 27.6733L40.8744 29.9732C41.9077 31.0065 42.293 31.3646 42.609 31.5342L42.6131 31.5365C42.7251 31.5965 43.03 31.6508 43.7526 31.54C45.0767 31.2453 47.4999 30.706 49.3813 32.5874C50.2268 33.4329 50.9546 34.5104 51.0002 35.8316C51.0469 37.191 50.3581 38.2934 49.5156 39.1359L39.1359 49.5156C38.2934 50.3581 37.191 51.0469 35.8318 51.0001C34.5105 50.9544 33.433 50.2267 32.5875 49.3812C30.7061 47.4998 31.2454 45.0766 31.54 43.7525C31.6509 43.0299 31.5967 42.7249 31.5366 42.6131L31.5343 42.6089C31.3646 42.2929 31.0065 41.9077 29.9733 40.8744L27.6734 38.5745C24.688 35.5891 23.4155 31.812 23.1004 28.0271C23.0513 27.4434 22.9877 26.6854 23.0405 26.1139Z"
                            fill="url(#paint0_linear_230_660)"
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M35.3833 64.3965C33.3949 61.1257 33.658 56.7622 36.5726 53.8476C37.5267 52.8935 39.052 52.8718 39.9795 53.7994C40.9071 54.7269 40.8855 56.2522 39.9313 57.2063C38.6035 58.5342 38.4894 60.9471 40.1389 62.5966L41.8182 64.276L40.0906 66.0036C38.7628 67.3315 38.6487 69.7444 40.2983 71.3941C41.9478 73.0436 44.3608 72.9294 45.6886 71.6016C46.6428 70.6475 48.1681 70.6258 49.0956 71.5534C50.0231 72.4809 50.0015 74.0062 49.0474 74.9604C45.6046 78.4031 40.1402 78.1463 36.8432 74.8493C34.0628 72.0689 33.4443 67.7472 35.3833 64.3965ZM53.8003 39.9786C52.8727 39.0511 52.8943 37.5259 53.8485 36.5716C56.7631 33.6571 61.1266 33.3941 64.3973 35.3824C67.7481 33.4434 72.0698 34.0619 74.8501 36.8423C78.1472 40.1393 78.4041 45.6037 74.9612 49.0466C74.0071 50.0006 72.4819 50.0222 71.5543 49.0947C70.6268 48.1671 70.6483 46.6419 71.6024 45.6878C72.9303 44.3599 73.0445 41.9469 71.395 40.2974C69.7454 38.6477 67.3324 38.7619 66.0044 40.0898C65.0503 41.0439 63.5251 41.0655 62.5976 40.1379C60.9481 38.4884 58.5351 38.6026 57.2073 39.9304C56.2531 40.8846 54.7278 40.9062 53.8003 39.9786ZM43.4348 50.3441C44.3889 49.3901 45.9141 49.3685 46.8416 50.296L55.2385 58.6929C56.1661 59.6205 56.1445 61.1457 55.1905 62.0998C54.2362 63.054 52.7109 63.0756 51.7834 62.1481L43.3865 53.7512C42.459 52.8236 42.4806 51.2983 43.4348 50.3441ZM50.345 43.4339C51.2992 42.4797 52.8245 42.4581 53.752 43.3857L57.1108 46.7444C58.0383 47.672 58.0168 49.1972 57.0625 50.1514C56.1085 51.1055 54.5832 51.1271 53.6557 50.1995L50.2969 46.8408C49.3694 45.9132 49.3909 44.388 50.345 43.4339Z"
                            fill="url(#paint1_linear_230_660)"
                          />
                          <defs>
                            <linearGradient
                              id="paint0_linear_230_660"
                              x1="23.9965"
                              y1="23.9964"
                              x2="44.3258"
                              y2="44.3257"
                              gradientUnits="userSpaceOnUse"
                            >
                              <stop stopColor="#8C57E8" />
                              <stop offset="1" stopColor="#F146C0" />
                            </linearGradient>
                            <linearGradient
                              id="paint1_linear_230_660"
                              x1="33.8084"
                              y1="33.8075"
                              x2="62.0043"
                              y2="62.0034"
                              gradientUnits="userSpaceOnUse"
                            >
                              <stop stopColor="#8C57E8" />
                              <stop offset="0.250784" stopColor="#F146C0" />
                              <stop offset="1" stopColor="#FFC755" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="bounties">
                <div className="grid grid-cols-12 gap-x-3">
                  <div className="bg-white shadow-md h-[90vh] overflow-hidden rounded-lg col-span-8 p-6 px-8">
                    <div className="border-b border-gray-200 p-4 text-[#7E8082] font-medium text-lg">
                      Available Bounties
                    </div>

                    {/*{isLoadingProjects ? (
                      <div className="flex items-center justify-center py-10">
                        <p className="text-gray-500">Loading bounties...</p>
                      </div>
                    ) : projects && projects.length > 0 ? (
                      <div className="divide-y divide-gray-300 flex flex-col gap-y-10 pt-8 h-[70vh] overflow-y-auto custom-scrollbar pb-20">
                        {projects
                          .filter((p) => p.category === 'bounty')
                          .map((project, index) => (
                            <PostJobCard
                              key={`bounty-${index}-${project.projectid}`}
                              data={{
                                id: project.projectid,
                                title: project.projectName,
                                description: project.description,
                                budget: project.budget,
                                status: project.status,
                                category: project.category,
                                skills: project.skills,
                                timeline: project.timeline,
                                createdAt: project.createdAt,
                              }}
                              // editJob={editJob}
                              onSelectForPayment={() =>
                                selectProjectForPayment(project)
                              }
                              getProposalCount={getProposalCount}
                            />
                          ))}
                      </div>
                    ) : (
                      <div className="pt-20 flex flex-col items-center font-circular">
                        <NoPostIcon className="scale-90" />
                        <p className="text-[#545756] my-9">
                          No active bounties found. Try posting a new bounty!
                        </p>
                        <Button
                          onClick={() => setIsCreateJobOpen(true)}
                          className="flex items-center text-primary bg-white space-x-3 border border-primary rounded-md hover:bg-white focus:bg-white"
                        >
                          <LucidePlus size={19} />
                          <p className="font-medium text-base">Post a Bounty</p>
                        </Button>
                      </div>
                    )}*/}
                  </div>

                  <div className="col-span-4 pb-10 overflow-y-auto custom-scrollbar flex flex-col gap-y-6 font-circular">
                    <div className="bg-white rounded-lg shadow-md min-h-52">
                      <div className="border-b border-gray-200 p-4 text-[#7E8082] font-medium text-lg">
                        Bounty Guidelines
                      </div>
                      <div className="p-4">
                        <div className="space-y-3 text-sm text-gray-600">
                          <p>
                            • Set clear deliverables and acceptance criteria
                          </p>
                          <p>• Define payment terms upfront</p>
                          <p>• Provide detailed technical requirements</p>
                          <p>• Set realistic deadlines</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="proposals">
                <div className="p-6">
                  <AllProposals jobs={jobs} />
                </div>
              </TabsContent>

              <TabsContent value="completed">
                <div className="bg-white shadow-md rounded-lg p-6 px-8">
                  <CompletedJobs />
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="hidden mt-14">
            <h3 className="font-poppins font-semibold text-[24px]">
              Browse available freelancers for your projects.
            </h3>

            <div className="grid grid-cols-4 gap-6 mt-7">
              {isLoadingFreelancers ? (
                <div className="col-span-4 text-center py-10">
                  <p className="text-gray-500">Loading freelancers...</p>
                </div>
              ) : freelancers.length > 0 ? (
                freelancers
                  .slice(0, 8)
                  .map((freelancer, index) => (
                    <ExpertCard
                      key={index}
                      details={
                        freelancer.bio ||
                        'Experienced freelancer ready to help with your projects.'
                      }
                      jobs={freelancer.jobs || 0}
                      name={freelancer.name}
                      rate={`${freelancer.hourlyRate || '0'} USD/hr`}
                      rating={freelancer.rating || 0}
                      title={freelancer.title}
                      location={`${freelancer.city}, ${freelancer.country}`}
                    />
                  ))
              ) : (
                dummyClient.map((client, index) => (
                  <ExpertCard
                    key={index}
                    details={client.details}
                    jobs={client.jobs}
                    name={client.name}
                    rate={client.rate}
                    rating={client.rating}
                    title={client.title}
                    location={client.location}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Payment Modal */}
      <Dialog>
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
      </Dialog>

      {/* Terminate Contract Modal */}
      <Dialog>
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
      </Dialog>

      {/* Payment Success Modal */}
      <Dialog>
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
      </Dialog>
    </>
  );
};

export default Page;
