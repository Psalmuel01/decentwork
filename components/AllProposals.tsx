'use client';

import { Avatar, Flex, Table, Text } from '@radix-ui/themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  jobBudget: number;
}

export function AllProposals({ jobs }: { jobs: JobData[] }) {
  const [allProposals, setAllProposals] = useState<ProposalWithJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'accepted' | 'declined'>('all');

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

        // Fetch details for each job to get proposals
        const jobDetailsPromises = jobs.map(
          async (job: { jobid: string; name: string; budget: number }) => {
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
              jobBudget: job.budget,
            })),
          )
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          );

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

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'default';
      case 'declined':
        return 'destructive';
      case 'pending':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const filteredProposals = allProposals.filter(proposal =>
    statusFilter === 'all' || proposal.status === statusFilter
  );

  const getProposalStats = () => {
    const total = allProposals.length;
    const pending = allProposals.filter(p => p.status === 'pending').length;
    const accepted = allProposals.filter(p => p.status === 'accepted').length;
    const declined = allProposals.filter(p => p.status === 'declined').length;

    return { total, pending, accepted, declined };
  };

  const stats = getProposalStats();

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Total Proposals</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{stats.accepted}</div>
            <p className="text-xs text-muted-foreground">Accepted</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{stats.declined}</div>
            <p className="text-xs text-muted-foreground">Declined</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Proposals Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Proposals ({filteredProposals.length})</CardTitle>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('all')}
              >
                All
              </Button>
              <Button
                size="sm"
                variant={statusFilter === 'pending' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('pending')}
              >
                Pending
              </Button>
              <Button
                size="sm"
                variant={statusFilter === 'accepted' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('accepted')}
              >
                Accepted
              </Button>
              <Button
                size="sm"
                variant={statusFilter === 'declined' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('declined')}
              >
                Declined
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="max-h-[70vh] overflow-y-auto">
            <Table.Root variant="surface" className="w-full border-0">
              <Table.Header>
                <Table.Row className="h-12 leading-[48px]">
                  <Table.ColumnHeaderCell>Freelancer</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell align="center">
                    Job Title
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell align="center">
                    Status
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell align="center">
                    Delivery Time
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell align="right">
                    Bid Amount
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell align="right">
                    Budget
                  </Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {isLoading ? (
                  <Table.Row className="h-16 leading-[64px]">
                    <Table.Cell colSpan={6} className="text-center">
                      Loading proposals...
                    </Table.Cell>
                  </Table.Row>
                ) : filteredProposals.length > 0 ? (
                  filteredProposals.map((proposal, index) => (
                    <Table.Row
                      key={`${proposal.proposalId}-${index}`}
                      className="h-16 leading-[64px]"
                    >
                      <Table.RowHeaderCell>
                        <Flex align="center" gap="3" className="h-full">
                          <Avatar
                            className="rounded-full"
                            fallback={proposal.freelancerWalletAddress
                              .substring(0, 2)
                              .toUpperCase()}
                            src="/avatar/avatar5.svg"
                          />
                          <Flex align="start" direction="column" gap="1">
                            <Text size="2" weight="medium">
                              {formatWalletAddress(proposal.freelancerWalletAddress)}
                            </Text>
                            <Text color="gray" size="1">
                              {new Date(proposal.createdAt).toLocaleDateString()}
                            </Text>
                          </Flex>
                        </Flex>
                      </Table.RowHeaderCell>
                      <Table.Cell align="center">
                        <Text className="truncate max-w-32" title={proposal.jobName}>
                          {proposal.jobName}
                        </Text>
                      </Table.Cell>
                      <Table.Cell align="center">
                        <Badge
                          variant={getStatusBadgeVariant(proposal.status)}
                          className="capitalize"
                        >
                          {proposal.status}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell align="center">
                        <Text size="2">
                          {proposal.deliveryTime} days
                        </Text>
                      </Table.Cell>
                      <Table.Cell align="right">
                        <Text weight="medium" size="2">
                          ${proposal.bidAmount}
                        </Text>
                      </Table.Cell>
                      <Table.Cell align="right">
                        <Text color="gray" size="2">
                          ${proposal.jobBudget}
                        </Text>
                      </Table.Cell>
                    </Table.Row>
                  ))
                ) : (
                  <Table.Row className="h-16 leading-[64px]">
                    <Table.Cell colSpan={6} className="text-center text-gray-500">
                      {statusFilter === 'all'
                        ? 'No proposals found'
                        : `No ${statusFilter} proposals found`
                      }
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table.Root>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
