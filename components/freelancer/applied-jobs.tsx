"use client";

import React, { useEffect, useState } from 'react';
import { useFreelancer } from '@/context/freelancer-context';
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
} from '../ui/dialog';
import { formatTimePosted } from '@/utils/contract-utils';
import { useXionWallet } from '@/context/xion-context';
import FreelancCalendar from '@/icons/freelance/freelance-calendar';

interface JobApplication {
  id: string;
  title: string;
  description: string;
  budget: string;
  status: string;
  created_at?: number;
  poster?: string;
}

const AppliedJobs = () => {
  const { fetchAppliedJobs, completeJob } = useFreelancer();
  const { address } = useXionWallet();
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completingJob, setCompletingJob] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<JobApplication | null>(null);

  useEffect(() => {
    loadAppliedJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  const loadAppliedJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const appliedJobs = await fetchAppliedJobs();
      setJobs(Array.isArray(appliedJobs) ? appliedJobs : []);
    } catch (err) {
      console.error('Error fetching applied jobs:', err);
      setError('Failed to load your job applications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteJob = async (jobId: string) => {
    try {
      setCompletingJob(jobId);
      setError(null);

      const success = await completeJob(jobId);
      if (success) {
        // Refresh job list after marking as complete
        await loadAppliedJobs();
      }
    } catch (err) {
      console.error('Error marking job as complete:', err);
      setError('Failed to complete job. Please try again.');
    } finally {
      setCompletingJob(null);
    }
  };

  const getJobStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'open':
        return (
          <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
            Applied
          </span>
        );
      case 'in_progress':
        return (
          <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full">
            In Progress
          </span>
        );
      case 'completed':
        return (
          <span className="bg-purple-100 text-purple-600 text-xs px-2 py-1 rounded-full">
            Completed
          </span>
        );
      default:
        return (
          <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
            {status || 'Unknown'}
          </span>
        );
    }
  };

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

  if (jobs.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-[#7E8082]">You haven&apos;t applied to any jobs yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="font-medium text-lg mb-4">
        Jobs You&apos;ve Applied To ({jobs.length})
      </h3>

      {jobs.map((job) => (
        <div key={job.id} className="border rounded-md p-4 bg-white">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-[#18181B]">{job.title}</h4>
                {getJobStatusBadge(job.status)}
              </div>

              <p className="text-[#7E8082] text-sm mt-2 line-clamp-2">
                {job.description}
              </p>

              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center space-x-1">
                  <p className="text-sm font-normal text-[#7E8082]">Budget:</p>
                  <p className="text-[#545756]">{job.budget} XION</p>
                </div>

                <div className="flex items-center space-x-2">
                  <FreelancCalendar />
                  <p className="text-sm font-normal text-[#7E8082]">
                    {formatTimePosted(job.created_at)}
                  </p>
                </div>
              </div>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="text-primary border-primary"
                  onClick={() => setSelectedJob(job)}
                >
                  View Details
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-[500px]">
                {selectedJob && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-lg">
                        {selectedJob.title}
                      </h3>
                      {getJobStatusBadge(selectedJob.status)}
                    </div>

                    <div>
                      <p className="text-sm text-[#7E8082]">Description</p>
                      <p className="text-[#545756] whitespace-pre-wrap">
                        {selectedJob.description}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-[#7E8082]">Budget</p>
                      <p className="text-[#545756] font-medium">
                        {selectedJob.budget} XION
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-[#7E8082]">Client</p>
                      <p className="text-[#545756] text-sm break-all">
                        {selectedJob.poster}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-[#7E8082]">Posted</p>
                      <p className="text-[#545756]">
                        {formatTimePosted(selectedJob.created_at)}
                      </p>
                    </div>

                    <div className="flex space-x-3 pt-4">
                      <DialogClose asChild>
                        <Button variant="outline" className="w-1/2">
                          Close
                        </Button>
                      </DialogClose>

                      {selectedJob.status === 'in_progress' && (
                        <Button
                          className="w-1/2 bg-primary"
                          onClick={() => handleCompleteJob(selectedJob.id)}
                          disabled={completingJob === selectedJob.id}
                        >
                          {completingJob === selectedJob.id ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            'Mark as Complete'
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AppliedJobs;
