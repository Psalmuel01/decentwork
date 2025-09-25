'use client';

import { Avatar, Flex, Table, Text } from '@radix-ui/themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

const API_URL = 'https://decentwork.onrender.com/graphql';

const GET_JOB_DETAILS = `
  query GetJobDetails($jobid: ID!) {
    GetJobDetails(jobid: $jobid) {
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

interface ProposalWithJob extends ProposalData {
  jobName: string;
  jobId: string;
}

export function LatestProposals({ jobs }: { jobs: JobData[] }) {
  const [allProposals, setAllProposals] = useState<ProposalWithJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchJobsAndProposals = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        if (!jobs || !Array.isArray(jobs)) {
          setAllProposals([]);
          return;
        }

        // Now fetch details for each job to get proposals
        const jobDetailsPromises = jobs.map(
          async (job: { jobid: string; name: string }) => {
            try {
              const detailsResponse = await fetch(API_URL, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  query: GET_JOB_DETAILS,
                  variables: { jobid: job.jobid },
                }),
              });

              const detailsResult = await detailsResponse.json();
              console.log('details result', detailsResult);
              if (detailsResult.errors) {
                console.error(
                  `Error fetching job ${job.jobid}:`,
                  detailsResult.errors,
                );
                return null;
              }

              return detailsResult.data?.GetJobDetails?.jobdDetails;
            } catch (error) {
              console.error(
                `Error fetching job details for ${job.jobid}:`,
                error,
              );
              return null;
            }
          },
        );

        const jobDetailsResults = await Promise.all(jobDetailsPromises);
        const validJobDetails = jobDetailsResults.filter(
          (job): job is JobData => job !== null,
        );

        // Extract all proposals from jobs that have proposals
        const proposals: ProposalWithJob[] = validJobDetails
          .filter((job) => job.proposals && job.proposals.length > 0)
          .flatMap((job) =>
            job.proposals.map((proposal) => ({
              ...proposal,
              jobName: job.name,
              jobId: job.jobid,
            })),
          )
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          )
          .slice(0, 5); // Show only the latest 5 proposals

        setAllProposals(proposals);
      } catch (error) {
        console.error('Error fetching proposals:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobsAndProposals();
  }, [jobs]);

  const formatWalletAddress = (address: string) => {
    if (!address) return 'Unknown';
    if (address.length <= 12) return address;
    return `${address.substring(0, 6)}...${address.substring(address.length - 6)}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className={'flex items-center justify-between'}>
          Latest Proposals
          <Button size={'sm'} variant={'secondary'}>
            See all
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table.Root variant="surface" className="w-full border-0">
          <Table.Header>
            <Table.Row className="h-10 leading-10">
              <Table.ColumnHeaderCell>Freelancer</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell align="center">
                Job Title
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell align="right">
                Bid Amount
              </Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {isLoading ? (
              <Table.Row className="h-12 leading-[48px]">
                <Table.Cell colSpan={3} className="text-center">
                  Loading proposals...
                </Table.Cell>
              </Table.Row>
            ) : allProposals.length > 0 ? (
              allProposals.map((data, index) => (
                <Table.Row
                  key={`${data.proposalId}-${index}`}
                  className="h-12 leading-[48px]"
                >
                  <Table.RowHeaderCell className={''}>
                    <Flex align={'center'} gap={'2'} className={'h-full'}>
                      <Avatar
                        className={'rounded-full'}
                        fallback={data.freelancerWalletAddress
                          .substring(0, 2)
                          .toUpperCase()}
                        src={'/avatar/avatar5.svg'}
                      />
                      <Flex align={'start'} direction="column" gap={'1'}>
                        <Text size="2" weight="medium">
                          {formatWalletAddress(data.freelancerWalletAddress)}
                        </Text>
                        <Text color={'gray'} size={'1'}>
                          {new Date(data.createdAt).toLocaleDateString()}
                        </Text>
                      </Flex>
                    </Flex>
                  </Table.RowHeaderCell>
                  <Table.Cell align="center">
                    <Text className="truncate max-w-32" title={data.jobName}>
                      {data.jobName}
                    </Text>
                  </Table.Cell>
                  <Table.Cell align="right">
                    <Text weight="medium">${data.bidAmount}</Text>
                  </Table.Cell>
                </Table.Row>
              ))
            ) : (
              <Table.Row className="h-12 leading-[48px]">
                <Table.Cell colSpan={3} className="text-center text-gray-500">
                  No proposals found
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table.Root>
      </CardContent>
    </Card>
  );
}
