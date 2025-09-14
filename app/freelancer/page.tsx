'use client';

import { PageBody, PageContainer } from '@/components/PageContainer';
import { Box, Flex, Grid, Heading, Separator, Text } from '@radix-ui/themes';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LucideBadgeCheck, SearchIcon } from 'lucide-react';
import { BookmarkIcon } from '@/icons/BookmarkIcon';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { ApplicationRoutes } from '@/config/routes';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';

const API_URL = 'https://decentwork.onrender.com/graphql';

const GET_FREELANCER_DETAILS = `
  query GetFreelancerDetails {
    getFreelancerDetails {
      code
      data {
        address
        bio
        category
        city
        country
        createdAt
        dateOfBirth
        email
        fluency
        freelancerid
        hourlyRate
        imageURL
        jobs
        language
        name
        phoneNumber
        postalCode
        rating
        skills
        speciality
        title
        walletAddress
      }
      message
      success
    }
  }
`;

const VIEW_PROJECTS = `
  query ViewProjects {
    viewProjects {
      _id
      companyName
      createdAt
      description
      location
      maxAmount
      maxDuration
      minAmount
      minDuration
      projectName
      tags
      walletAddress
    }
  }
`;

export interface FreelancerData {
  address: string;
  bio: string;
  category: string;
  city: string;
  country: string;
  createdAt: string;
  dateOfBirth: string;
  email: string;
  fluency: string;
  freelancerid: string;
  hourlyRate: number;
  imageURL: string;
  jobs: string[];
  language: string;
  name: string;
  phoneNumber: string;
  postalCode: string;
  rating: number;
  skills: string[];
  speciality: string;
  title: string;
  walletAddress: string;
}

export interface ProjectData {
  _id: string;
  companyName: string;
  createdAt: string;
  description: string;
  location: string;
  maxAmount: number;
  maxDuration: number;
  minAmount: number;
  minDuration: number;
  projectName: string;
  tags: string[];
  walletAddress: string;
}

function JobCard({
  project,
  onClick,
  isSelected,
}: {
  project: ProjectData;
  onClick: () => void;
  isSelected: boolean;
}) {
  const formatDuration = (minDuration: number, maxDuration: number) => {
    if (minDuration === maxDuration) {
      return `${minDuration} week${minDuration > 1 ? 's' : ''}`;
    }
    return `${minDuration} to ${maxDuration} weeks`;
  };

  const formatBudget = (minAmount: number, maxAmount: number) => {
    if (minAmount === maxAmount) {
      return `$${minAmount}`;
    }
    return `$${minAmount} - $${maxAmount}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Posted 1 day ago';
    if (diffDays < 7) return `Posted ${diffDays} days ago`;
    if (diffDays < 30) return `Posted ${Math.ceil(diffDays / 7)} weeks ago`;
    return `Posted ${Math.ceil(diffDays / 30)} months ago`;
  };

  return (
    <Card
      className={`shadow-none border-0 cursor-pointer transition-colors ${
        isSelected
          ? 'bg-primary/5 border-primary border-2'
          : 'hover:bg-muted/50'
      }`}
      onClick={onClick}
    >
      <CardHeader>
        <Flex align={'center'} gap={'2'} className={''}>
          <Image
            src="/avatar/avatar1.svg"
            alt="Company Logo"
            width={40}
            height={40}
            className="rounded-full"
          />
          <Flex direction={'column'} className={''}>
            <CardTitle className="line-clamp-1">
              {project.projectName}
            </CardTitle>
            <CardDescription className={'leading-normal'}>
              {project.companyName} • {project.location}
            </CardDescription>
          </Flex>
        </Flex>
      </CardHeader>
      <CardContent className={'space-y-4'}>
        <Flex align={'center'} justify={'start'} gap={'2'}>
          <Text size={'2'}>
            <Text color={'gray'}>Budget: </Text>
            <Text>{formatBudget(project.minAmount, project.maxAmount)}</Text>
          </Text>

          <Text>-</Text>

          <Text size={'2'}>
            <Text color={'gray'}>Duration: </Text>
            <Text>
              {formatDuration(project.minDuration, project.maxDuration)}
            </Text>
          </Text>
        </Flex>
        <Flex align={'center'} justify={'start'}>
          <Text>
            <Text size={'2'} className="line-clamp-3">
              {project.description}
            </Text>
          </Text>
        </Flex>
        <div className="flex flex-wrap gap-2 pt-2">
          {project.tags.slice(0, 3).map((tag, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="px-3 py-1.5 rounded-full text-xs text-muted-foreground border-border"
            >
              {tag}
            </Badge>
          ))}
          {project.tags.length > 3 && (
            <Badge
              variant="secondary"
              className="px-3 py-1.5 rounded-full text-xs text-muted-foreground border-border"
            >
              +{project.tags.length - 3} more
            </Badge>
          )}
        </div>
        <Flex align={'center'} justify={'between'}>
          <Flex align={'center'} gap={'1'}>
            <Text>
              <LucideBadgeCheck color={'white'} fill={'dodgerblue'} />
            </Text>
            <Text color={'gray'} size={'2'}>
              Funds verified
            </Text>
          </Flex>

          <Text size={'2'}>
            <Text color={'gray'}>Budget: </Text>
            <Text>{formatBudget(project.minAmount, project.maxAmount)}</Text>
          </Text>
        </Flex>
        <Separator size={'4'} />
      </CardContent>
      <CardFooter className={'w-full justify-end'}>
        <Text align={'right'} size={'2'} color={'gray'}>
          {formatDate(project.createdAt)}
        </Text>
      </CardFooter>
    </Card>
  );
}

export default function Page() {
  const router = useRouter();
  const { isNewFreelanceUser } = useAuth();
  const [freelancerData, setFreelancerData] = useState<FreelancerData | null>(
    null,
  );
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(
    null,
  );
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);

  const fetchProjects = async () => {
    setIsLoadingProjects(true);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: VIEW_PROJECTS,
        }),
      });

      const result = await response.json();

      if (result.errors) {
        console.error('GraphQL errors:', result.errors);
        return;
      }

      const projectsData = result.data?.viewProjects;
      if (projectsData && Array.isArray(projectsData)) {
        setProjects(projectsData);
        if (projectsData.length > 0) {
          setSelectedProject(projectsData[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setIsLoadingProjects(false);
    }
  };

  useEffect(() => {
    const fetchFreelancerDetails = async () => {
      const token = localStorage.getItem('authToken');

      if (!token) {
        console.log('No auth token found');
        return null;
      }

      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            query: GET_FREELANCER_DETAILS,
          }),
        });

        const result = await response.json();

        if (result.errors) {
          console.error('GraphQL errors:', result.errors);
          return null;
        }

        const freelancerDetails = result.data?.getFreelancerDetails;

        if (freelancerDetails?.success && freelancerDetails?.data) {
          console.log('Freelancer details:', freelancerDetails.data);
          return freelancerDetails.data;
        } else {
          console.log(
            'No freelancer profile found or request failed:',
            freelancerDetails?.message,
          );
          return null;
        }
      } catch (error) {
        console.error('Error fetching freelancer details:', error);
        return null;
      }
    };

    const handleRouting = async () => {
      const freelancerData = await fetchFreelancerDetails();
      setFreelancerData(freelancerData);

      if (freelancerData) {
        // Freelancer profile exists, route to dashboard
        router.push(ApplicationRoutes.FREELANCER_DASHBOARD);
      } else if (isNewFreelanceUser) {
        // No profile exists but user is marked as new freelancer, route to setup
        router.push(ApplicationRoutes.FREELANCER_SETUP);
      }
      // If neither condition is met, stay on current page
    };

    handleRouting();
    fetchProjects();
  }, [isNewFreelanceUser, router]);

  return (
    <PageContainer>
      <PageBody>
        <Flex
          direction={'column'}
          gap={'1'}
          className={
            'bg-gradient-to-tr from-black via-black to-purple-950 px-8 py-12 rounded-xl mb-6'
          }
        >
          <Heading className={'text-white leading-relaxed'} size={'8'}>
            Welcome Back, {freelancerData?.name || 'Onesty'}! Ready to Land Your
            Next Gig?
          </Heading>
          <Text className={'text-white leading-relaxed'}>
            New jobs are waiting. Find something cool and submit your winning
            proposal today.
          </Text>

          <Flex
            className={
              'border-2 border-muted-foreground rounded-lg focus-within:border-primary'
            }
            align={'center'}
            gap={'3'}
            mt={'4'}
            p={'1'}
          >
            <SearchIcon className={'ml-2'} color={'gray'} />
            <Input
              className={
                'bg-transparent ring-0 border-0 focus-visible:ring-0 focus-visible:border-0 focus-visible:outline p-0'
              }
              type="search"
              placeholder="Search skills here"
            />
            <Button className={'bg-primary'}>Search</Button>
          </Flex>
        </Flex>

        <Grid columns={'5'} gap={'4'}>
          <Flex className={'col-span-2'} direction={'column'} gap={'4'}>
            {isLoadingProjects ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : projects.length === 0 ? (
              <Card className={'shadow-none border-0'}>
                <CardContent className="py-8">
                  <Text color="gray" align="center">
                    No projects available at the moment.
                  </Text>
                </CardContent>
              </Card>
            ) : (
              projects.map((project) => (
                <JobCard
                  key={project._id}
                  project={project}
                  onClick={() => setSelectedProject(project)}
                  isSelected={selectedProject?._id === project._id}
                />
              ))
            )}
          </Flex>

          <Box className={'col-span-3'}>
            {selectedProject ? (
              <Card className={'border-0 shadow-none'}>
                <CardHeader>
                  <Flex align={'center'} gap={'2'} className={''}>
                    <Image
                      src="/avatar/avatar1.svg"
                      alt="Company Logo"
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <Flex direction={'column'} className={''}>
                      <CardTitle>{selectedProject.projectName}</CardTitle>
                      <CardDescription className={'leading-normal'}>
                        {selectedProject.companyName} •{' '}
                        {selectedProject.location}
                      </CardDescription>
                    </Flex>
                  </Flex>
                  <Flex
                    align={'center'}
                    justify={'start'}
                    gap={'2'}
                    className="flex-wrap"
                  >
                    <Text size={'2'}>
                      <Text color={'gray'}>Budget: </Text>
                      <Text>
                        ${selectedProject.minAmount}
                        {selectedProject.minAmount !==
                          selectedProject.maxAmount &&
                          ` - $${selectedProject.maxAmount}`}
                      </Text>
                    </Text>

                    <Text>-</Text>

                    <Text size={'2'}>
                      <Text color={'gray'}>Duration: </Text>
                      <Text>
                        {selectedProject.minDuration}
                        {selectedProject.minDuration !==
                          selectedProject.maxDuration &&
                          ` - ${selectedProject.maxDuration}`}{' '}
                        week{selectedProject.maxDuration > 1 ? 's' : ''}
                      </Text>
                    </Text>

                    <Text>-</Text>

                    <Text size={'2'}>
                      <Text color={'gray'}>Posted: </Text>
                      <Text>
                        {new Date(
                          selectedProject.createdAt,
                        ).toLocaleDateString()}
                      </Text>
                    </Text>
                  </Flex>

                  {selectedProject.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {selectedProject.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="px-3 py-1.5 rounded-full text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <Flex direction={'row'} align={'center'} gap={'2'}>
                    <Button asChild className={'flex-1'} size={'lg'}>
                      <Link href={ApplicationRoutes.FREELANCER_SUBMIT_PROPOSAL}>
                        Submit Proposal
                      </Link>
                    </Button>
                    <Button variant={'outline'} size={'icon'}>
                      <BookmarkIcon />
                    </Button>
                  </Flex>
                  <Separator className={'my-8'} size={'4'} />

                  <Flex direction={'column'} gap={'4'}>
                    <Heading>Project Description</Heading>
                    <div className="whitespace-pre-wrap">
                      <Text>{selectedProject.description}</Text>
                    </div>
                  </Flex>
                </CardContent>
              </Card>
            ) : (
              <Card className={'border-0 shadow-none'}>
                <CardContent className="py-8">
                  <Text color="gray" align="center">
                    Select a project to view details
                  </Text>
                </CardContent>
              </Card>
            )}
          </Box>
        </Grid>
      </PageBody>
    </PageContainer>
  );
}
