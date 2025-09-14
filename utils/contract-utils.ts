// Get the contract address from environment variables
export const getJobContractAddress = (): string => {
  const address = process.env.NEXT_PUBLIC_XION_JOB_CONTRACT_ADDRESS;
  if (!address) {
    throw new Error(
      'Job contract address not configured in environment variables',
    );
  }
  return address;
};

// Simplified proposal message builder
export const buildSubmitProposalMsg = (
  jobId: string | number,
  bidAmount: string | number,
  coverLetter: string,
  freelancerAddress: string,
) => {
  return {
    SubmitProposal: {
      job_id: typeof jobId === 'string' ? parseInt(jobId) : jobId,
      bid_amount: bidAmount.toString(),
      cover_letter: coverLetter,
      freelancer_address: freelancerAddress,
    },
  };
};

// Standard method to accept payment for a job
export const buildAcceptPaymentMsg = (
  jobId: string | number,
  freelancerAddress: string,
) => {
  return {
    AcceptPayment: {
      job_id: typeof jobId === 'string' ? parseInt(jobId) : jobId,
      freelancer_address: freelancerAddress,
    },
  };
};

// Payment message for client to pay freelancer
export const buildSendPaymentMsg = (
  jobId: string | number,
  freelancerAddress: string,
  amount: string | number,
) => {
  return {
    SendPayment: {
      job_id: typeof jobId === 'string' ? parseInt(jobId) : jobId,
      freelancer_address: freelancerAddress,
      amount: amount.toString(),
    },
  };
};

// Function to mark a job as complete (for freelancers)
export const buildCompleteJobMsg = (jobId: string | number) => {
  return {
    CompleteJob: {
      job_id: typeof jobId === 'string' ? parseInt(jobId) : jobId,
    },
  };
};

// Release payment from escrow
export const buildReleaseEscrowPaymentMsg = (
  jobId: string | number,
  freelancerAddress: string,
) => {
  return {
    ReleaseEscrow: {
      job_id: typeof jobId === 'string' ? parseInt(jobId) : jobId,
      freelancer_address: freelancerAddress,
    },
  };
};

// Check payment status
export const buildGetPaymentStatusQuery = (jobId: string | number) => {
  return {
    PaymentStatus: {
      job_id: typeof jobId === 'string' ? parseInt(jobId) : jobId,
    },
  };
};

// Standard method to terminate a contract
export const buildTerminateContractMsg = (
  jobId: string | number,
  freelancerAddress: string,
) => {
  return {
    TerminateContract: {
      job_id: typeof jobId === 'string' ? parseInt(jobId) : jobId,
      freelancer_address: freelancerAddress,
    },
  };
};

// Get a specific job by ID - correct query based on error message
export const buildGetJobDetailsQuery = (jobId: string | number) => {
  return {
    GetJobDetails: {
      job_id: typeof jobId === 'string' ? parseInt(jobId) : jobId,
    },
  };
};

// Get proposals for a job - correct query based on error message
export const buildGetJobProposalsQuery = (jobId: string | number) => {
  return {
    GetJobProposals: {
      job_id: typeof jobId === 'string' ? parseInt(jobId) : jobId,
    },
  };
};

// Helper to format job data for UI display
// @typescript-eslint/no-explicit-any
export const formatJobForDisplay = (job: any) => {
  if (!job) return null;

  const budgetStr = job.budget || '0';
  const hourlyRate = calculateHourlyRate(budgetStr);

  return {
    id: job.id || '0',
    title: job.title || 'Untitled Job',
    detail: job.description || 'No description provided',
    role: job.title || 'Untitled Job',
    skills: job.skills || ['General'],
    duration: job.duration || '1-3 weeks',
    location: job.location || 'Remote',
    timePosted: formatTimePosted(job.created_at),
    funding: `${budgetStr} XION`,
    hourlyPay: `${hourlyRate} XION/hr`,
    applicants: '0 to 5',
    verified: true,
    status: job.status,
    freelancer_address: job.freelancer_address,
    client_address: job.owner,
    payment_status: job.payment_status,
  };
};

// Helper to calculate hourly rate from budget
const calculateHourlyRate = (budget: string): string => {
  const budgetNum = parseFloat(budget) || 0;
  return (budgetNum / 40).toFixed(1); // Simple estimate - 40 hours per job
};

// Helper to format timestamps for display
export const formatTimePosted = (timestamp?: number): string => {
  if (!timestamp) return 'Recently';

  const now = new Date();
  const postDate = new Date(timestamp * 1000);
  const diffHours = Math.floor(
    (now.getTime() - postDate.getTime()) / (1000 * 60 * 60),
  );

  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours} hours ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} days ago`;
  return `${Math.floor(diffDays / 7)} weeks ago`;
};
