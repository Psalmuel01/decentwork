"use client";

import React, { useEffect, useState } from 'react';
import { useClient } from '@/context/client-context';
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from '../ui/dialog';
import { useXionWallet } from '@/context/xion-context';
import { Input } from '@/components/ui/input';

interface ProposalListProps {
  jobId?: number; // Now optional since we can show all proposals
  onProposalAccepted?: () => void;
}

interface Proposal {
  freelancer: string;
  bid_amount: string;
  cover_letter: string;
  job_id?: number; // Added for All Proposals view
  job_title?: string; // Added for All Proposals view
  contact_info?: {
    email?: string;
    phone?: string;
  };
}

const ProposalsList = ({ jobId, onProposalAccepted }: ProposalListProps) => {
  const { getJobProposals, acceptProposal, getClientJobs } = useClient();
  const { isConnected } = useXionWallet();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingProposal, setProcessingProposal] = useState<string | null>(
    null,
  );
  const [searchTerm, setSearchTerm] = useState('');

  // Load all proposals for client's jobs or for a specific job
  useEffect(() => {
    fetchProposals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId, isConnected]);

  const fetchProposals = async () => {
    if (!isConnected) {
      setError('Please connect your wallet to view proposals');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (jobId) {
        // Fetch proposals for a specific job
        const fetchedProposals = await getJobProposals(jobId);
        setProposals(Array.isArray(fetchedProposals) ? fetchedProposals : []);
      } else {
        // Fetch all client jobs and then get proposals for each
        const jobs = await getClientJobs();
        const allProposals: Proposal[] = [];

        // For each job, fetch its proposals
        for (const job of jobs) {
          try {
            const jobProposals = await getJobProposals(parseInt(job.id));
            if (Array.isArray(jobProposals) && jobProposals.length > 0) {
              // Add job information to each proposal for display
              const jobProposalsWithContext = jobProposals.map((proposal) => ({
                ...proposal,
                job_id: parseInt(job.id),
                job_title: job.title || `Job #${job.id}`,
              }));
              allProposals.push(...jobProposalsWithContext);
            }
          } catch (err) {
            console.error(`Error fetching proposals for job ${job.id}:`, err);
          }
        }

        setProposals(allProposals);
      }
    } catch (err) {
      console.error('Error fetching proposals:', err);
      setError('Failed to load proposals. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptProposal = async (
    freelancerAddress: string,
    proposalJobId: number,
  ) => {
    try {
      setProcessingProposal(freelancerAddress);
      setError(null);

      // Use the job ID from the proposal or the parent component
      const targetJobId = proposalJobId || jobId;

      if (!targetJobId) {
        throw new Error('No job ID specified for accepting proposal');
      }

      const success = await acceptProposal(targetJobId, freelancerAddress);
      if (success) {
        // Refresh proposals after accepting
        await fetchProposals();

        // Notify parent component
        if (onProposalAccepted) {
          onProposalAccepted();
        }
      }
    } catch (err) {
      console.error('Error accepting proposal:', err);
      setError('Failed to accept proposal. Please try again.');
    } finally {
      setProcessingProposal(null);
    }
  };

  // Filter proposals based on search term
  const filteredProposals = proposals.filter((proposal) => {
    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();
    return (
      proposal.freelancer.toLowerCase().includes(searchLower) ||
      proposal.cover_letter.toLowerCase().includes(searchLower) ||
      proposal.job_title?.toLowerCase().includes(searchLower)
    );
  });

  if (!isConnected) {
    return (
      <Alert variant="default" className="mb-4">
        <AlertDescription>
          Please connect your wallet to view job proposals
        </AlertDescription>
      </Alert>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6 py-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-lg">
          {jobId
            ? `Proposals for Job #${jobId} (${proposals.length})`
            : `All Job Proposals (${proposals.length})`}
        </h3>

        <div className="max-w-xs relative">
          <Input
            placeholder="Search proposals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10"
          />
          {searchTerm && (
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => setSearchTerm('')}
            >
              ×
            </button>
          )}
        </div>
      </div>

      {filteredProposals.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-[#7E8082]">
            {searchTerm
              ? 'No proposals match your search criteria.'
              : 'No proposals received yet.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProposals.map((proposal, index) => (
            <Dialog key={`${proposal.freelancer}-${index}`}>
              <div className="border rounded-md p-4 bg-white hover:shadow-md transition-shadow">
                <div className="flex justify-between">
                  <div>
                    <p className="text-[#545756] font-medium">
                      Freelancer: {proposal.freelancer.slice(0, 12)}...
                    </p>
                    <p className="text-[#7E8082] text-sm mt-1">
                      Bid: {proposal.bid_amount} XION
                    </p>
                    {proposal.job_title && !jobId && (
                      <p className="text-sm text-blue-600 mt-1">
                        For: {proposal.job_title}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="text-primary border-primary"
                      >
                        View Details
                      </Button>
                    </DialogTrigger>
                  </div>
                </div>
              </div>

              <DialogContent className="sm:max-w-[500px]">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Proposal Details</h3>

                  {proposal.job_title && !jobId && (
                    <div>
                      <p className="text-sm text-[#7E8082]">Job</p>
                      <p className="text-[#545756] font-medium">
                        {proposal.job_title}
                      </p>
                    </div>
                  )}

                  <div>
                    <p className="text-sm text-[#7E8082]">Freelancer Address</p>
                    <p className="text-[#545756] text-sm break-all">
                      {proposal.freelancer}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-[#7E8082]">Bid Amount</p>
                    <p className="text-[#545756] font-medium">
                      {proposal.bid_amount} XION
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-[#7E8082]">Cover Letter</p>
                    <p className="text-[#545756] whitespace-pre-wrap">
                      {proposal.cover_letter}
                    </p>
                  </div>

                  {proposal.contact_info && (
                    <>
                      {proposal.contact_info.email && (
                        <div>
                          <p className="text-sm text-[#7E8082]">Email</p>
                          <p className="text-[#545756]">
                            {proposal.contact_info.email}
                          </p>
                        </div>
                      )}

                      {proposal.contact_info.phone && (
                        <div>
                          <p className="text-sm text-[#7E8082]">Phone</p>
                          <p className="text-[#545756]">
                            {proposal.contact_info.phone}
                          </p>
                        </div>
                      )}
                    </>
                  )}

                  <div className="flex space-x-3 pt-4">
                    <DialogClose asChild>
                      <Button variant="outline" className="w-1/2">
                        Cancel
                      </Button>
                    </DialogClose>

                    <Button
                      className="w-1/2 bg-primary"
                      onClick={() =>
                        handleAcceptProposal(
                          proposal.freelancer,
                          // @ts-expect-error "Negligible Error"
                          proposal.job_id || jobId,
                        )
                      }
                      disabled={!!processingProposal}
                    >
                      {processingProposal === proposal.freelancer ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        'Accept Proposal'
                      )}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      )}

      <div className="flex justify-center py-4">
        <Button onClick={fetchProposals} variant="outline">
          Refresh Proposals
        </Button>
      </div>
    </div>
  );
};

export default ProposalsList;
