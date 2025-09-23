'use client';

import {
  PageBody,
  PageContainer,
  PageHeader,
} from '@/components/PageContainer';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Container,
  Flex,
  Grid,
  Heading,
  Separator,
  Text,
} from '@radix-ui/themes';
import { LucideArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { FundingIcon } from '@/icons/FundingIcon';
import { ApplicantsIcon } from '@/icons/ApplicantsIcon';
import CalendarIcon from '@/icons/Calendar';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { ApplicationRoutes } from '@/config/routes';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';

// API Configuration
const API_URL = 'https://decentwork.onrender.com/graphql';

// GraphQL Queries
const GET_FEATURED_JOBS = `
  query GetFeaturedJobs {
    getFeaturedJobs {
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
  }
`;

// GraphQL Mutations
const SUBMIT_PROPOSAL = `
  mutation SubmitProposal($bidAmount: Float!, $coverLetter: String!, $deliveryTime: Int!, $jobid: ID!) {
    SubmitProposal(bidAmount: $bidAmount, coverLetter: $coverLetter, deliveryTime: $deliveryTime, jobid: $jobid) {
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
  }
`;

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

interface JobData {
  _id: string;
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

function SubmitProposalContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const jobId = searchParams.get('jobId');

  // State management
  const [jobData, setJobData] = useState<JobData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [bidAmount, setBidAmount] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [deliveryUnit, setDeliveryUnit] = useState('days');
  const [coverLetter, setCoverLetter] = useState('');
  const [timeAgreement, setTimeAgreement] = useState(false);
  const [paymentAgreement, setPaymentAgreement] = useState(false);

  // Fetch job details
  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!jobId) {
        setError('No job ID provided');
        setIsLoading(false);
        return;
      }

      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Please log in to submit a proposal');
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            query: GET_FEATURED_JOBS,
          }),
        });

        const result = await response.json();
        console.log(result);

        if (result.errors) {
          console.error('GraphQL errors:', result.errors);
          setError('Failed to fetch job details');
          return;
        }

        const jobsData = result.data?.getFeaturedJobs?.jobdDetails;
        if (jobsData && Array.isArray(jobsData)) {
          const foundJob = jobsData.find((job: JobData) => job.jobid === jobId);
          if (foundJob) {
            setJobData(foundJob);
          } else {
            setError('Job not found');
          }
        } else {
          setError('Job not found');
        }
      } catch (err) {
        console.error('Error fetching job details:', err);
        setError('Failed to fetch job details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId]);

  const handleSubmitProposal = async () => {
    if (
      !jobId ||
      !bidAmount ||
      !deliveryTime ||
      !coverLetter ||
      !timeAgreement ||
      !paymentAgreement
    ) {
      setError('Please fill in all required fields and accept the agreements');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem('authToken');
      const deliveryTimeInDays =
        deliveryUnit === 'days'
          ? parseInt(deliveryTime)
          : parseInt(deliveryTime) * 7;

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: SUBMIT_PROPOSAL,
          variables: {
            bidAmount: parseFloat(bidAmount),
            coverLetter,
            deliveryTime: deliveryTimeInDays,
            jobid: jobId,
          },
        }),
      });

      const result = await response.json();

      if (result.errors) {
        console.error('GraphQL errors:', result.errors);
        setError(result.errors[0]?.message || 'Failed to submit proposal');
        return;
      }

      if (result.data?.SubmitProposal?.success) {
        // Success - redirect back to freelancer dashboard
        router.push(ApplicationRoutes.FREELANCER_DASHBOARD);
      } else {
        setError(
          result.data?.SubmitProposal?.message || 'Failed to submit proposal',
        );
      }
    } catch (err) {
      console.error('Error submitting proposal:', err);
      setError('Failed to submit proposal');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPostedTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) return 'Posted 1 day ago';
      if (diffDays < 7) return `Posted ${diffDays} days ago`;
      if (diffDays < 30) return `Posted ${Math.ceil(diffDays / 7)} weeks ago`;
      return `Posted ${Math.ceil(diffDays / 30)} months ago`;
    } catch {
      return 'Recently posted';
    }
  };

  if (isLoading) {
    return (
      <Container>
        <PageContainer>
          <PageBody>
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </PageBody>
        </PageContainer>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <PageContainer>
          <PageBody>
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <div className="mt-4">
              <Link href={ApplicationRoutes.FREELANCER_DASHBOARD}>
                <Button variant="outline">
                  <LucideArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </PageBody>
        </PageContainer>
      </Container>
    );
  }

  return (
    <Container>
      <PageContainer>
        <PageBody>
          <Flex
            direction={'column'}
            gap={'6'}
            className={'bg-background p-6 rounded-lg'}
          >
            <Link href={ApplicationRoutes.FREELANCER_DASHBOARD}>
              <LucideArrowLeft size={24} />
            </Link>

            <Grid columns={'3'} gap={'8'} align={'start'}>
              <Flex direction={'column'} gap={'6'} className={'col-span-2'}>
                <PageHeader>
                  <Heading>Submit a Proposal</Heading>
                  <Text size={'2'} color={'gray'}>
                    Please share your proposal details and let the client know
                    why you&apos;re the best fit for this job.
                  </Text>
                </PageHeader>

                <Flex direction={'column'} gap={'6'}>
                  <Flex direction={'column'} gap={'2'}>
                    <Text size={'2'} weight={'bold'}>
                      Your Bid Amount
                    </Text>
                    <Flex
                      align={'center'}
                      className={'border border-border rounded-lg'}
                    >
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="Enter your bid amount"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        className="border-0 px-4 h-12 w-full shadow-none focus:ring-0 focus:border-0 focus-visible:outline-none focus-visible:ring-0"
                      />
                      <Separator orientation={'vertical'} size={'4'} />
                      <Text color={'gray'} className={'px-4'}>
                        USD
                      </Text>
                    </Flex>
                  </Flex>
                  <Flex direction={'column'} gap={'2'}>
                    <Text size={'2'} weight={'bold'}>
                      Estimated Delivery Time
                    </Text>
                    <Flex
                      align={'center'}
                      className={'border border-border rounded-lg'}
                    >
                      <Input
                        type="number"
                        min="1"
                        placeholder="Delivery time"
                        value={deliveryTime}
                        onChange={(e) => setDeliveryTime(e.target.value)}
                        className="border-0 px-4 h-12 w-full shadow-none focus:ring-0 focus:border-0 focus-visible:outline-none focus-visible:ring-0"
                      />
                      <Separator orientation={'vertical'} size={'4'} />
                      <Select
                        value={deliveryUnit}
                        onValueChange={setDeliveryUnit}
                      >
                        <SelectTrigger className="w-[100px] ring-0 focus:ring-0 focus-visible:ring-0 border-0">
                          <SelectValue placeholder="Unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Time Unit</SelectLabel>
                            <SelectItem value="days">Days</SelectItem>
                            <SelectItem value="weeks">Weeks</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </Flex>
                  </Flex>
                  <Flex direction={'column'} gap={'2'}>
                    <Text size={'2'} weight={'bold'}>
                      Cover Letter
                    </Text>
                    <Textarea
                      placeholder="Write your pitch... explain why you're the best fit, your approach, and past experience."
                      className="resize-none min-h-32"
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      maxLength={750}
                    />
                    <Text align={'right'} color={'gray'} size={'2'}>
                      Characters Left: {750 - coverLetter.length}
                    </Text>
                  </Flex>

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Flex direction={'column'} gap={'3'}>
                    <Flex align={'center'} gap={'3'}>
                      <Checkbox
                        id="time_agreement"
                        checked={timeAgreement}
                        onCheckedChange={(checked) =>
                          setTimeAgreement(!!checked)
                        }
                      />
                      <Label htmlFor="time_agreement" className={'font-normal'}>
                        I agree to deliver this work within the time and budget.
                      </Label>
                    </Flex>
                    <Flex align={'center'} gap={'3'}>
                      <Checkbox
                        id="payment_agreement"
                        checked={paymentAgreement}
                        onCheckedChange={(checked) =>
                          setPaymentAgreement(!!checked)
                        }
                      />
                      <Label
                        htmlFor="payment_agreement"
                        className={'font-normal'}
                      >
                        I understand payment is secured via crypto escrow.
                      </Label>
                    </Flex>
                  </Flex>

                  <Flex direction={'column'} gap={'3'}>
                    <Button
                      className={'h-12'}
                      onClick={handleSubmitProposal}
                      disabled={
                        isSubmitting || !timeAgreement || !paymentAgreement
                      }
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Proposal'}
                    </Button>
                  </Flex>
                </Flex>
              </Flex>

              {jobData && (
                <Flex
                  direction={'column'}
                  gap={'3'}
                  p={'4'}
                  className={'col-span-1 bg-muted rounded-xl'}
                >
                  <Card className={'border-0 shadow-none'}>
                    <CardHeader>
                      <Text color={'gray'} size={'2'}>
                        {formatPostedTime(jobData.createdAt)}
                      </Text>
                      <Flex align={'center'} gap={'2'} className={''}>
                        <Image
                          src="/avatar/avatar1.svg"
                          alt="Company Logo"
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                        <Flex direction={'column'} className={''}>
                          <CardTitle className="line-clamp-2">
                            {jobData.name}
                          </CardTitle>
                          <CardDescription className={'leading-normal'}>
                            {jobData.category}
                          </CardDescription>
                        </Flex>
                      </Flex>
                    </CardHeader>
                  </Card>

                  <Flex direction={'column'} gap={'4'}>
                    <Flex align={'center'} gap={'2'}>
                      <Text>
                        <FundingIcon />
                      </Text>
                      <Text color={'gray'} size={'2'}>
                        Budget
                      </Text>
                      <Text size={'2'}>${jobData.budget}</Text>
                    </Flex>
                    <Flex align={'center'} gap={'2'}>
                      <Text>
                        <ApplicantsIcon />
                      </Text>
                      <Text color={'gray'} size={'2'}>
                        Proposals
                      </Text>
                      <Text size={'2'}>{jobData.proposalscount}</Text>
                    </Flex>
                    <Flex align={'center'} gap={'2'}>
                      <Text>
                        <CalendarIcon />
                      </Text>
                      <Text color={'gray'} size={'2'}>
                        Duration
                      </Text>
                      <Text size={'2'}>{jobData.duration}</Text>
                    </Flex>
                  </Flex>

                  {jobData.skills && jobData.skills.length > 0 && (
                    <Flex direction={'column'} gap={'2'} mt={'2'}>
                      <Text size={'2'} weight={'bold'}>
                        Required Skills
                      </Text>
                      <div className="flex flex-wrap gap-1">
                        {jobData.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </Flex>
                  )}

                  {jobData.description && (
                    <Flex direction={'column'} gap={'2'} mt={'2'}>
                      <Text size={'2'} weight={'bold'}>
                        Description
                      </Text>
                      <Text size={'2'} color={'gray'} className="line-clamp-4">
                        {jobData.description}
                      </Text>
                    </Flex>
                  )}
                </Flex>
              )}
            </Grid>
          </Flex>
        </PageBody>
      </PageContainer>
    </Container>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <Container>
          <PageContainer>
            <PageBody>
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            </PageBody>
          </PageContainer>
        </Container>
      }
    >
      <SubmitProposalContent />
    </Suspense>
  );
}
