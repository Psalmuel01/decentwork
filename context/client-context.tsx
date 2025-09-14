'use client';

import React, { createContext, useContext } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useXionWallet } from './xion-context';
import { getJobContractAddress } from '@/utils/contract-utils';

interface JobData {
  title: string;
  description: string;
  budget: string;
}

interface ClientContextType {
  postJob: (jobData: JobData) => Promise<boolean>;
  acceptProposal: (
    jobId: number,
    freelancerAddress: string,
  ) => Promise<boolean>;
  getJobDetails: (jobId: number) => Promise<any>;
  getJobProposals: (jobId: number) => Promise<any[]>;
  getClientJobs: () => Promise<any[]>;
  reviewCompletedJob: (
    jobId: string,
    freelancerAddress: string,
    paymentAmount: string,
  ) => Promise<boolean>;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const ClientProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { toast } = useToast();
  const { isConnected, address, executeContract, queryContract } =
    useXionWallet();
  const jobContractAddress = getJobContractAddress();

  const postJob = async (jobData: JobData): Promise<boolean> => {
    if (!isConnected) {
      toast({
        title: 'Not connected',
        description: 'Please connect to post a job',
        variant: 'destructive',
      });
      return false;
    }

    try {
      // Use PascalCase for contract message key as per the contract
      const msg = {
        PostJob: {
          title: jobData.title,
          description: jobData.description,
          budget: jobData.budget,
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
      console.error('Error posting job:', error);
      toast({
        title: 'Error',
        description: 'Failed to post job. Please try again.',
        variant: 'destructive',
      });
      return false;
    }
  };

  const acceptProposal = async (
    jobId: number,
    freelancerAddress: string,
  ): Promise<boolean> => {
    if (!isConnected) {
      toast({
        title: 'Not connected',
        description: 'Please connect to accept this proposal',
        variant: 'destructive',
      });
      return false;
    }

    try {
      // Use PascalCase for contract message key as per the contract
      const msg = {
        AcceptProposal: {
          job_id: jobId,
          freelancer: freelancerAddress,
        },
      };

      console.log('Accepting proposal with message:', JSON.stringify(msg));
      const result = await executeContract(jobContractAddress, msg);

      if (result) {
        toast({
          title: 'Success',
          description: 'Proposal accepted successfully',
          variant: 'default',
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error accepting proposal:', error);
      toast({
        title: 'Error',
        description: 'Failed to accept proposal. Please try again.',
        variant: 'destructive',
      });
      return false;
    }
  };

  const getJobDetails = async (jobId: number): Promise<any> => {
    try {
      // Use PascalCase for contract query key as per the contract
      const query = {
        GetJobDetails: {
          job_id: jobId,
        },
      };

      const result = await queryContract(jobContractAddress, query);
      return result || null;
    } catch (error) {
      console.error('Error fetching job details:', error);
      return null;
    }
  };

  const getJobProposals = async (jobId: number): Promise<any[]> => {
    try {
      console.log(`Fetching proposals for job ${jobId}`);

      // Use the correct query format from the contract (GetJobProposals with capital G)
      // The contract expects PascalCase for query names (based on contract code)
      const query = {
        GetJobProposals: {
          job_id: jobId,
        },
      };

      console.log('Sending query:', JSON.stringify(query));
      const result = await queryContract(jobContractAddress, query);
      console.log('Received proposals result:', result);

      // Return empty array if nothing is returned
      if (!result) {
        console.log('No proposals found or query failed');
        return [];
      }

      return Array.isArray(result) ? result : [];
    } catch (error) {
      console.error('Error fetching job proposals:', error);
      return [];
    }
  };

  const getClientJobs = async (): Promise<any[]> => {
    if (!isConnected || !address) return [];

    try {
      const query = {
        GetClientJobs: {
          client_address: address,
        },
      };

      const result = await queryContract(jobContractAddress, query);
      if (result && result.jobs) {
        return result.jobs;
      }
    } catch (error) {
      console.log(
        'Dedicated client jobs query not available, falling back to individual job fetching',
      );
    }

    const jobs = [];
    for (let i = 1; i <= 30; i++) {
      try {
        const query = {
          GetJobDetails: {
            job_id: i,
          },
        };
        const job = await queryContract(jobContractAddress, query);

        if (job && job.poster === address) {
          jobs.push({ ...job, id: i });
        }
      } catch (e) {}
    }

    return jobs;
  };

  const reviewCompletedJob = async (
    jobId: string,
    freelancerAddress: string,
    paymentAmount: string,
  ): Promise<boolean> => {
    if (!isConnected) {
      toast({
        title: 'Not connected',
        description: 'Please connect your wallet to process payment',
        variant: 'destructive',
      });
      return false;
    }

    try {
      // Convert payment amount to integer (microunits) as required by the contract
      const paymentAmountNum = parseFloat(paymentAmount);
      const paymentAmountInteger = Math.round(
        paymentAmountNum * 1000000,
      ).toString(); // Convert to XION microunits

      console.log(
        `Processing payment for completed job ${jobId}: ${paymentAmount} XION (${paymentAmountInteger} microunits)`,
      );

      // Use the SendPayment message from contract-utils
      const msg = {
        SendPayment: {
          job_id: typeof jobId === 'string' ? parseInt(jobId) : jobId,
          freelancer_address: freelancerAddress,
          amount: paymentAmountInteger,
        },
      };

      const result = await executeContract(jobContractAddress, msg);

      if (result) {
        toast({
          title: 'Success',
          description: 'Payment processed for completed work',
          variant: 'default',
        });
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error processing payment:', error);
      toast({
        title: 'Error',
        description:
          error instanceof Error
            ? error.message
            : 'Failed to process payment. Please try again.',
        variant: 'destructive',
      });
      return false;
    }
  };

  return (
    <ClientContext.Provider
      value={{
        postJob,
        acceptProposal,
        getJobDetails,
        getJobProposals,
        getClientJobs,
        reviewCompletedJob,
      }}
    >
      {children}
    </ClientContext.Provider>
  );
};

export const useClient = () => {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error('useClient must be used within a ClientProvider');
  }

  return context;
};
