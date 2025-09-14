import React, { useEffect, useState, useRef } from 'react';
import { useClient } from '@/context/client-context';
import { Button } from '../ui/button';
import { Loader2, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
} from '../ui/dialog';
import { formatTimePosted } from '@/utils/contract-utils';
import { useXionWallet } from '@/context/xion-context';

interface CompletedJob {
  id: string;
  title: string;
  description: string;
  budget: string;
  status: string;
  created_at?: number;
  assigned_freelancer?: string;
  payment_status?: string;
}

const CompletedJobs = () => {
  const { getClientJobs, reviewCompletedJob } = useClient();
  const { address } = useXionWallet();
  const [jobs, setJobs] = useState<CompletedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingPayment, setProcessingPayment] = useState<string | null>(
    null,
  );
  const [selectedJob, setSelectedJob] = useState<CompletedJob | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);
  const closeDialogRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    loadCompletedJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  const loadCompletedJobs = async () => {
    try {
      setLoading(true);
      setError(null);

      const allJobs = await getClientJobs();
      // Filter to only show completed jobs
      const completedJobs = allJobs.filter(
        (job) => job.status === 'completed' || job.status === 'Completed',
      );

      console.log('Found completed jobs:', completedJobs);
      setJobs(completedJobs);
    } catch (err) {
      console.error('Error fetching completed jobs:', err);
      setError('Failed to load completed jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePayFreelancer = async (job: CompletedJob) => {
    if (!job.assigned_freelancer || !job.id) {
      setError('Invalid job details. Missing freelancer or job ID.');
      return;
    }

    try {
      setProcessingPayment(job.id);
      setError(null);
      setPaymentSuccess(false);

      const success = await reviewCompletedJob(
        job.id,
        job.assigned_freelancer,
        job.budget || '0',
      );

      if (success) {
        setPaymentSuccess(true);
        // Refresh job list after processing payment
        await loadCompletedJobs();

        // Close the dialog after a short delay to show success message
        setTimeout(() => {
          if (closeDialogRef.current) {
            closeDialogRef.current.click();
          }
        }, 2000);
      }
    } catch (err) {
      console.error('Error processing payment:', err);
      setError('Failed to process payment. Please try again.');
    } finally {
      setProcessingPayment(null);
    }
  };

  // Helper to check if a job has been paid
  const isJobPaid = (job: CompletedJob): boolean => {
    return job.payment_status === 'paid';
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
        <p className="text-[#7E8082]">No completed jobs yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="font-medium text-lg mb-4">
        Completed Jobs ({jobs.length})
      </h3>

      {jobs.map((job) => (
        <div key={job.id} className="border rounded-md p-4 bg-white">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-[#18181B]">{job.title}</h4>
                <span className="bg-purple-100 text-purple-600 text-xs px-2 py-1 rounded-full">
                  Completed
                </span>
                {isJobPaid(job) && (
                  <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full">
                    Payment Processed
                  </span>
                )}
              </div>

              <p className="text-[#7E8082] text-sm mt-2 line-clamp-2">
                {job.description}
              </p>

              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center space-x-1">
                  <p className="text-sm font-normal text-[#7E8082]">Budget:</p>
                  <p className="text-[#545756]">{job.budget} XION</p>
                </div>

                <div className="flex items-center space-x-1">
                  <p className="text-sm font-normal text-[#7E8082]">
                    Freelancer:
                  </p>
                  <p className="text-[#545756]">
                    {job.assigned_freelancer
                      ? `${job.assigned_freelancer.slice(0, 8)}...`
                      : 'Unknown'}
                  </p>
                </div>

                {job.created_at && (
                  <div className="flex items-center space-x-1">
                    <p className="text-sm font-normal text-[#7E8082]">
                      Completed:
                    </p>
                    <p className="text-[#545756]">
                      {formatTimePosted(job.created_at)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant={isJobPaid(job) ? 'outline' : 'outline'}
                  className={
                    isJobPaid(job)
                      ? 'text-green-600 border-green-600'
                      : 'text-primary border-primary'
                  }
                  onClick={() => setSelectedJob(job)}
                  disabled={isJobPaid(job)}
                >
                  {isJobPaid(job) ? 'Payment Complete' : 'Review & Pay'}
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-[500px]">
                {selectedJob && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-lg">
                        {selectedJob.title}
                      </h3>
                      <span className="bg-purple-100 text-purple-600 text-xs px-2 py-1 rounded-full">
                        Completed
                      </span>
                    </div>

                    {paymentSuccess && (
                      <div className="bg-green-50 p-4 rounded-md flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                        <div>
                          <p className="text-green-800 font-medium">
                            Payment Successful!
                          </p>
                          <p className="text-green-700 text-sm mt-1">
                            The payment has been processed successfully.
                          </p>
                        </div>
                      </div>
                    )}

                    {!paymentSuccess && (
                      <>
                        <div>
                          <p className="text-sm text-[#7E8082]">Description</p>
                          <p className="text-[#545756] whitespace-pre-wrap">
                            {selectedJob.description}
                          </p>
                        </div>

                        <div className="bg-green-50 p-4 rounded-md">
                          <p className="text-green-800 font-medium">
                            Work Completed
                          </p>
                          <p className="text-green-700 text-sm mt-1">
                            The freelancer has marked this job as completed.
                            Please review the work and process the payment.
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-[#7E8082]">Budget</p>
                          <p className="text-[#545756] font-medium">
                            {selectedJob.budget} XION
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-[#7E8082]">Freelancer</p>
                          <p className="text-[#545756] text-sm break-all">
                            {selectedJob.assigned_freelancer}
                          </p>
                        </div>
                      </>
                    )}

                    <div className="flex space-x-3 pt-4">
                      <DialogClose asChild>
                        <Button
                          ref={closeDialogRef}
                          variant="outline"
                          className="w-1/2"
                        >
                          {paymentSuccess ? 'Close' : 'Cancel'}
                        </Button>
                      </DialogClose>

                      {!paymentSuccess && !isJobPaid(selectedJob) && (
                        <Button
                          className="w-1/2 bg-primary"
                          onClick={() => handlePayFreelancer(selectedJob)}
                          disabled={processingPayment === selectedJob.id}
                        >
                          {processingPayment === selectedJob.id ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            'Process Payment'
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

export default CompletedJobs;
