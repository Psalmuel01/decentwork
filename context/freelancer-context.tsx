'use client';

import { createContext, useContext } from 'react';
import { useXionWallet } from './xion-context';
import { useToast } from '@/hooks/use-toast';
import {
  buildCompleteJobMsg,
  getJobContractAddress,
} from '@/utils/contract-utils';

type FreelancerContextProps = {
  submitJob: (jobData: any) => Promise<boolean>;
  applyForJob: (jobId: string, proposal: any) => Promise<boolean>;
  fetchFreelancerJobs: () => Promise<any[]>;
  fetchAppliedJobs: () => Promise<any[]>;
  completeJob: (jobId: string) => Promise<boolean>;
};

type FreelancerProviderProps = {
  children?: React.ReactNode;
};

export const FreelancerContext = createContext<FreelancerContextProps | null>(
  null,
);

const FreelancerProvider = ({ children }: FreelancerProviderProps) => {
  const { executeContract, queryContract, address, isConnected } =
    useXionWallet();
  const { toast } = useToast();

  // Example contract address - should be replaced with actual contract in production
  const jobContractAddress = getJobContractAddress();

  const submitJob = async (jobData: any): Promise<boolean> => {
    if (!isConnected) {
      toast({
        title: 'Not connected',
        description: 'Please join to submit a job',
        variant: 'destructive',
      });
      return false;
    }

    try {
      const msg = {
        create_job: {
          ...jobData,
          owner: address,
        },
      };

      const result = await executeContract(jobContractAddress, msg);

      if (result) {
        toast({
          title: 'Success',
          description: 'Job posted successfully',
          variant: 'default',
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error submitting job:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit job. Please try again.',
        variant: 'destructive',
      });
      return false;
    }
  };

  const applyForJob = async (
    jobId: string,
    proposal: any,
  ): Promise<boolean> => {
    if (!isConnected) {
      toast({
        title: 'Not connected',
        description: 'Please connect to apply for this job',
        variant: 'destructive',
      });
      return false;
    }

    try {
      // Format according to contract expectations
      const msg = {
        SubmitProposal: {
          job_id: parseInt(jobId),
          bid_amount: proposal.bidAmount,
          cover_letter: proposal.message,
          contact_info: {
            email: proposal.email,
            phone: proposal.phone || '',
          },
          freelancer_address: address,
        },
      };

      const result = await executeContract(jobContractAddress, msg);

      if (result) {
        toast({
          title: 'Success',
          description: 'Application submitted successfully',
          variant: 'default',
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error applying for job:', error);
      toast({
        title: 'Error',
        description: 'Failed to apply for job. Please try again.',
        variant: 'destructive',
      });
      return false;
    }
  };

  const fetchFreelancerJobs = async (): Promise<any[]> => {
    if (!isConnected) return [];

    try {
      const query = {
        GetFreelancerJobs: {
          freelancer_address: address,
        },
      };

      const result = await queryContract(jobContractAddress, query);
      return result?.jobs || [];
    } catch (error) {
      console.error('Error fetching freelancer jobs:', error);
      return [];
    }
  };

  const fetchAppliedJobs = async (): Promise<any[]> => {
    if (!isConnected || !address) return [];

    try {
      // Query all jobs to find those with proposals by this freelancer
      const query = {
        GetAllJobs: {}, // Assuming this query exists or can be implemented
      };

      // Fallback to fetch some jobs by ID if above query doesn't exist
      let allJobs = [];
      try {
        const result = await queryContract(jobContractAddress, query);
        if (result && result.jobs) {
          allJobs = result.jobs;
        }
      } catch (error) {
        console.log('Falling back to individual job fetching');
        // Fetch first 30 jobs (adjust as needed)
        for (let i = 1; i <= 30; i++) {
          try {
            const jobQuery = { GetJobDetails: { job_id: i } };
            const job = await queryContract(jobContractAddress, jobQuery);
            if (job) {
              // For each job, check if it has proposals
              const proposalsQuery = { GetJobProposals: { job_id: i } };
              const proposals =
                (await queryContract(jobContractAddress, proposalsQuery)) || [];

              // Check if any proposal is from current freelancer
              const hasApplied =
                Array.isArray(proposals) &&
                proposals.some((p) => p.freelancer === address);

              if (hasApplied) {
                allJobs.push({ ...job, id: i });
              }
            }
          } catch (e) {
            // Skip errors for non-existent jobs
          }
        }
      }

      return allJobs;
    } catch (error) {
      console.error('Error fetching applied jobs:', error);
      return [];
    }
  };

  const completeJob = async (jobId: string): Promise<boolean> => {
    if (!isConnected || !address) {
      toast({
        title: 'Not connected',
        description: 'Please connect your wallet to complete this job',
        variant: 'destructive',
      });
      return false;
    }

    try {
      const msg = buildCompleteJobMsg(jobId);
      const result = await executeContract(jobContractAddress, msg);

      if (result) {
        toast({
          title: 'Success',
          description: 'Job marked as completed! Awaiting client review.',
          variant: 'default',
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error completing job:', error);
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      toast({
        title: 'Error',
        description: `Failed to complete job: ${errorMsg}`,
        variant: 'destructive',
      });
      return false;
    }
  };

  return (
    <FreelancerContext.Provider
      value={{
        submitJob,
        applyForJob,
        fetchFreelancerJobs,
        fetchAppliedJobs,
        completeJob,
      }}
    >
      {children}
    </FreelancerContext.Provider>
  );
};

export const useFreelancer = () => {
  const context = useContext(FreelancerContext);
  if (!context) {
    throw new Error('useFreelancer must be used within an FreelancerProvider');
  }

  return context;
};

export default FreelancerProvider;
