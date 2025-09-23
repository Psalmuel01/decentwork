'use client';

import { Table } from '@radix-ui/themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';

// API Configuration
const API_URL = 'https://decentwork.onrender.com/graphql';

const GET_JOBS = `
  query GetJobs {
    GetJobs {
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
  }`;

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
  proposals: object[];
  proposalscount: number;
  skills: string[];
  status: string;
  token: string;
}

export function ActiveProjectsTable() {
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.log('No auth token found');
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
            query: GET_JOBS,
          }),
        });

        const result = await response.json();

        if (result.errors) {
          console.error('GraphQL errors:', result.errors);
          return;
        }

        const jobsData = result.data?.GetJobs?.jobdDetails;
        if (jobsData && Array.isArray(jobsData)) {
          // Filter to show only active jobs
          const activeJobs = jobsData.filter(
            (job: JobData) => job.status === 'inactive',
          );
          setJobs(activeJobs);
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return 'Invalid date';
    }
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Jobs</CardTitle>
      </CardHeader>
      <CardContent>
        <Table.Root variant="surface" className="w-full border-0">
          <Table.Header>
            <Table.Row className="h-10 leading-10">
              <Table.ColumnHeaderCell>Job Title</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Proposals</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Posted Date</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {isLoading ? (
              <Table.Row className="h-12 leading-[48px]">
                <Table.Cell colSpan={3} className="text-center">
                  Loading jobs...
                </Table.Cell>
              </Table.Row>
            ) : jobs.length === 0 ? (
              <Table.Row className="h-12 leading-[48px]">
                <Table.Cell colSpan={3} className="text-center text-gray-500">
                  No active jobs found
                </Table.Cell>
              </Table.Row>
            ) : (
              jobs.slice(0, 4).map((job) => (
                <Table.Row key={job.jobid} className="h-12 leading-[48px]">
                  <Table.RowHeaderCell className="truncate max-w-48">
                    {job.name}
                  </Table.RowHeaderCell>
                  <Table.Cell>{job.proposalscount || 0}</Table.Cell>
                  <Table.Cell>{formatDate(job.createdAt)}</Table.Cell>
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table.Root>
      </CardContent>
    </Card>
  );
}
