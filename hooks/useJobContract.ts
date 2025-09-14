import { useState, useEffect, useCallback, useRef } from 'react';
import { useXionWallet } from '../context/xion-context';

export interface Job {
  id: string;
  title: string;
  description: string;
  budget: string;
  duration: string;
  category?: string;
  location?: string;
  client_address: string;
  skills: string[];
  created_at?: number;
  status?: string; // Adding status property from the contract
  assigned_freelancer?: string; // Adding assigned_freelancer property from the contract
}

export interface FormattedJob {
  id: string; // Adding id property to fix the TypeScript error
  applicants: string;
  detail: string;
  duration: string;
  funding: string;
  hourlyPay: string;
  location: string;
  role: string;
  skills: string[];
  timePosted: string;
  verified: boolean;
  status?: string;
  freelancer_address?: string;
  payment_status?: string;
}

export const useJobContract = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { queryContract, isConnected } = useXionWallet();

  // Track if we've already fetched jobs to prevent refetching on every render
  const hasInitiallyFetched = useRef(false);
  // Track if a fetch is in progress to prevent duplicate fetches
  const isFetchingRef = useRef(false);
  // Simple debounce for refetch
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const fetchJobs = useCallback(
    async (force = false) => {
      // Skip if wallet not connected, already fetching, or has fetched and not forced
      if (!isConnected) {
        setError('Wallet not connected');
        return;
      }

      if (isFetchingRef.current) {
        console.log('Fetch already in progress, skipping...');
        return;
      }

      if (!force && hasInitiallyFetched.current) {
        console.log('Jobs already fetched, skipping redundant fetch');
        return;
      }

      // Clear any pending debounce timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }

      // Set debounce timer to prevent rapid refetches
      debounceTimerRef.current = setTimeout(async () => {
        try {
          isFetchingRef.current = true;
          setIsLoading(true);
          setError(null);

          const jobContractAddress =
            process.env.NEXT_PUBLIC_XION_JOB_CONTRACT_ADDRESS || '';

          if (!jobContractAddress) {
            throw new Error('Job contract address not configured');
          }

          console.log('Fetching jobs from contract:', jobContractAddress);

          // Try the GetJobs query first (if it exists)
          try {
            const result = await queryContract(jobContractAddress, {
              GetJobs: {},
            });

            if (result && Array.isArray(result.jobs)) {
              console.log('Found jobs using GetJobs query:', result.jobs);
              setJobs(
                result.jobs.map((job: any, index: number) => ({
                  ...job,
                  id: job.id || index.toString(),
                })),
              );
              hasInitiallyFetched.current = true;
              return;
            }
          } catch (e) {
            console.log(
              'GetJobs query not supported, falling back to individual queries',
            );
          }

          // Since there's no GetAllJobs query, we'll fetch individual jobs by ID
          const fetchedJobs: Job[] = [];

          // Try to fetch jobs with IDs 0-9 (adjust as needed)
          for (let i = 0; i < 10; i++) {
            try {
              // Use GetJobDetails which is one of the supported queries
              const result = await queryContract(jobContractAddress, {
                GetJobDetails: { job_id: i },
              });

              if (result) {
                // Add ID to the job object
                fetchedJobs.push({
                  ...result,
                  id: i.toString(),
                });
                console.log(`Fetched job ${i}:`, result);
              }
            } catch (err) {
              // If we get an error for a specific ID, it likely doesn't exist
              console.log(`No job found with ID ${i}`);
            }
          }

          if (fetchedJobs.length > 0) {
            setJobs(fetchedJobs);
          } else {
            console.log('No jobs found, using mock data for testing');
            setJobs([
              {
                id: '1',
                title: 'Web Developer',
                description: 'Build responsive web applications',
                budget: '100',
                duration: '2 weeks',
                client_address: 'cosmos1...',
                skills: ['React', 'TypeScript'],
                created_at: Math.floor(Date.now() / 1000) - 86400,
              },
              {
                id: '2',
                title: 'UI Designer',
                description: 'Create beautiful user interfaces',
                budget: '80',
                duration: '1 week',
                client_address: 'cosmos2...',
                skills: ['Figma', 'Adobe XD'],
                created_at: Math.floor(Date.now() / 1000) - 172800,
              },
            ]);
          }

          // Mark that we've fetched data
          hasInitiallyFetched.current = true;
        } catch (err) {
          console.error('Error fetching jobs:', err);
          setError(err instanceof Error ? err.message : 'Failed to fetch jobs');
        } finally {
          setIsLoading(false);
          isFetchingRef.current = false;
        }
      }, 300); // Small debounce to prevent rapid refetches
    },
    [isConnected, queryContract],
  );

  // Format raw contract jobs to match the UI component format
  const formatJobs = useCallback((): FormattedJob[] => {
    if (!jobs || jobs.length === 0) return [];

    return jobs.map((job) => ({
      id: job.id, // Include the id property
      applicants: '0 to 5', // Default placeholder as this may not be in contract
      detail: job.description || 'No description provided',
      duration: job.duration || '1 - 3 weeks',
      funding: `${job.budget || '0'} AR`,
      hourlyPay: `${calculateHourlyRate(
        job.budget || '0',
        job.duration || '',
      )} AR`,
      location: job.location || 'Remote',
      role: job.title || 'Untitled Job',
      skills: job.skills || ['General'],
      timePosted: formatTimePosted(job.created_at),
      verified: true, // All contract jobs are verified
      status: job.status || 'open',
      freelancer_address: job.assigned_freelancer || undefined,
    }));
  }, [jobs]);

  // Calculate an approximate hourly rate based on budget and duration
  const calculateHourlyRate = (budget: string, duration: string): string => {
    // Basic calculation - can be improved later
    const budgetNum = parseFloat(budget) || 0;
    return (budgetNum / 40).toFixed(1); // Assume 40 hours of work
  };

  // Format time posted from timestamp
  const formatTimePosted = (timestamp?: number): string => {
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

  // Fetch jobs on mount and when connection state changes
  useEffect(() => {
    if (isConnected) {
      console.log('Wallet connected, fetching jobs');
      fetchJobs();
    } else {
      console.log('Wallet not connected, skipping job fetch');
    }

    // Cleanup function to clear any pending timers
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
    };
  }, [isConnected, fetchJobs]);

  const formattedJobs = formatJobs();

  // Force refetch manual function that bypasses the hasInitiallyFetched check
  const manualRefetch = useCallback(() => {
    console.log('Manually triggering job refetch');
    fetchJobs(true); // Pass true to force refetch
  }, [fetchJobs]);

  return {
    rawJobs: jobs,
    jobs: formattedJobs,
    isLoading,
    error,
    refetch: manualRefetch,
  };
};
