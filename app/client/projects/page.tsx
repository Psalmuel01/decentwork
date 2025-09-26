'use client';

import { LucidePlus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createDataItemSigner, message } from '@permaweb/aoconnect';
import { Button } from '@/components/ui/button';
import {
  Dialog,
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
import NoPostIcon from '@/icons/client/no-post-icon';
import PostJobCard from '@/components/client/job-card';
import NotificationCard from '@/components/freelancer/notification-card';
import { useAuth } from '@/context/auth-context';
import {
  PageBody,
  PageContainer,
  PageHeader,
  PageHeaderDescription,
  PageHeaderTitle,
} from '@/components/PageContainer';
import { Flex } from '@radix-ui/themes';

// API Configuration
const API_URL = 'https://decentwork.onrender.com/graphql';

// Escrow Configuration
const ESCROW_PROCESS_ID = 'ktl0iPdM44_VfTAVF557vSqaF9AfUAFUKDDaQRWyjf0';
const TOKEN_PROCESS_ID = 'agYcCFJtrMG6cqMuZfskIkFTGvUPddICmtQSBIoPdiA';

// Wallet utilities
function detectWallet() {
  return window.arweaveWallet || null;
}

function createWalletSigner() {
  const walletApi = detectWallet();
  if (!walletApi) throw new Error('Connect wallet first');
  return createDataItemSigner(walletApi);
}

async function sendMessage(
  processId: string,
  tags: Array<{ name: string; value: string }>,
  data?: string,
) {
  const signer = createWalletSigner();
  try {
    const res = await message({ process: processId, signer, tags, data });
    console.log('Sent message id:', res);
    return res;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}

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

const Page = () => {
  const router = useRouter();
  const { hasJob } = useAuth();

  // State management
  const [clientData, setClientData] = useState<ClientData | null>(null);
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobData | null>(null);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCreateJobOpen, setIsCreateJobOpen] = useState(false);
  const [isCreatingJob, setIsCreatingJob] = useState(false);
  const [createJobError, setCreateJobError] = useState<string | null>(null);
  const [txError, setTxError] = useState<string | null>(null);
  const [isCreatingEscrow, setIsCreatingEscrow] = useState(false);

  // Create Job Modal State
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

  // Fetch jobs
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

  // Create escrow (approve + deposit)
  const createEscrow = async (jobId: string, amount: string) => {
    if (!ESCROW_PROCESS_ID || !TOKEN_PROCESS_ID) {
      throw new Error('Escrow or Token process IDs not configured');
    }

    setIsCreatingEscrow(true);

    try {
      // Step 1: Approve allowance
      console.log('Approving token allowance for escrow...');
      await sendMessage(TOKEN_PROCESS_ID, [
        { name: 'Action', value: 'Approve' },
        { name: 'Spender', value: ESCROW_PROCESS_ID },
        { name: 'Quantity', value: amount },
      ]);

      // Small delay to ensure approval is processed
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Step 2: Deposit to escrow
      console.log('Depositing to escrow...');
      const walletApi = detectWallet();
      if (!walletApi) {
        throw new Error('Wallet not connected');
      }

      const currentAddress = await (walletApi.getActiveAddress
        ? walletApi.getActiveAddress()
        : walletApi.getActivePublicKey?.());

      if (!currentAddress) {
        throw new Error('Could not get wallet address');
      }

      await sendMessage(ESCROW_PROCESS_ID, [
        { name: 'Action', value: 'Deposit' },
        { name: 'jobId', value: jobId },
        { name: 'client', value: currentAddress },
        { name: 'token', value: TOKEN_PROCESS_ID },
        { name: 'amount', value: amount },
      ]);

      console.log('Escrow created successfully for job:', jobId);
    } catch (error) {
      console.error('Error creating escrow:', error);
      throw error;
    } finally {
      setIsCreatingEscrow(false);
    }
  };

  // Create Job
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

    // Check if wallet is connected for escrow creation
    const walletApi = detectWallet();
    if (!walletApi) {
      setCreateJobError(
        'Please connect your wallet to create jobs with escrow',
      );
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
        const createdJob = result.data.createJob;

        try {
          // Create escrow immediately after job creation
          console.log('Creating escrow for job:', createdJob.jobid);

          // Convert budget to smallest token units (assuming 6 decimals)
          const budgetInSmallestUnits = (
            parseFloat(jobFormData.budget) * 1000000
          ).toString();

          await createEscrow(createdJob.jobid, budgetInSmallestUnits);

          console.log('Job and escrow created successfully!');
        } catch (escrowError) {
          console.error('Job created but escrow failed:', escrowError);
          setCreateJobError(
            'Job created successfully, but escrow creation failed. You may need to create it manually.',
          );
          // Don't return here - still want to refresh jobs and close modal
        }

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

        // Refresh jobs
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

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    setClientData(null);
    setJobs([]);
    router.push('/');
  };

  // Initialize data
  useEffect(() => {
    const handleInitialization = async () => {
      if (!isAuthenticated) return;

      const clientDetails = await fetchClientDetails();
      setClientData(clientDetails);

      if (clientDetails) {
        await fetchJobs();
      }
    };

    handleInitialization();
  }, [isAuthenticated]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const selectProjectForPayment = (job: JobData) => {
    setSelectedJob(job);
    // Add payment modal logic here if needed
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Please Log In</h2>
          <p className="text-gray-600 mb-6">
            You need to be logged in to access your projects.
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
          <PageHeaderTitle>Jobs</PageHeaderTitle>
          <PageHeaderDescription>
            Ready to find the right talent? You can post a new job, review
            proposals, or track ongoing hires.
          </PageHeaderDescription>
        </PageHeader>

        <PageBody>
          <Flex direction={'column'} gap={'8'} py={'8'}>
            <Flex direction={'column'} gap={'4'}>
              <main>
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

                      <Dialog
                        open={isCreateJobOpen}
                        onOpenChange={setIsCreateJobOpen}
                      >
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
                                  handleJobFormChange(
                                    'description',
                                    e.target.value,
                                  )
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
                                    handleJobFormChange(
                                      'budget',
                                      e.target.value,
                                    )
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
                                    handleJobFormChange(
                                      'duration',
                                      e.target.value,
                                    )
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
                                  <SelectItem value="BLOCKCHAIN">
                                    Blockchain
                                  </SelectItem>
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
                                    onChange={(e) =>
                                      setSkillInput(e.target.value)
                                    }
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
                                <p className="text-red-800 text-sm">
                                  {createJobError}
                                </p>
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
                                disabled={isCreatingJob || isCreatingEscrow}
                                className="flex-1 bg-primary text-white hover:bg-primary/90"
                              >
                                {isCreatingJob
                                  ? 'Creating Job...'
                                  : isCreatingEscrow
                                    ? 'Creating Escrow...'
                                    : 'Create Job & Escrow'}
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

                  <div className="container mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 gap-x-3">
                      <div className="bg-white shadow-md rounded-lg col-span-8 p-6 px-8">
                        <div className="border-b border-gray-200 p-4 text-[#7E8082] font-medium text-lg">
                          Job Overview
                        </div>

                        {isLoadingJobs ? (
                          <div className="flex items-center justify-center py-10">
                            <p className="text-gray-500">Loading jobs...</p>
                          </div>
                        ) : jobs && jobs.length > 0 ? (
                          <div className="divide-y divide-gray-300 flex flex-col gap-y-10 pt-8 custom-scrollbar pb-20">
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
                              <p className="font-medium text-base">
                                Create a Job
                              </p>
                            </Button>
                          </div>
                        )}
                      </div>

                      <div className="col-span-4 mt-10 pb-10 overflow-y-auto custom-scrollbar flex flex-col gap-y-6 font-circular">
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
                                    Make payment when the freelancer completes
                                    their work
                                  </li>
                                </ul>
                                <p className="text-xs text-blue-600 mt-3 italic">
                                  Note: The freelancer will mark the job as
                                  complete when finished. You'll be able to
                                  review the work and make payment.
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
                            Start your journey now and connect with freelancers
                            to bring their projects to life.
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
                  </div>
                </div>
              </main>
            </Flex>
          </Flex>
        </PageBody>
      </PageContainer>
    </>
  );
};

export default Page;
