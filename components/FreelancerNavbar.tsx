'use client';

import { Flex, Heading, Separator, Text } from '@radix-ui/themes';
import NotificationIcon from '@/icons/navbar/NotificationIcon';
import Link from 'next/link';
import { ApplicationRoutes } from '@/config/routes';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LucideChevronDown, SearchIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Image from 'next/image';
import CopyIcon from '@/icons/client/copy-icon';
import ProposalIcon from '@/icons/navbar/ProposalIcon';
import ProjectIcon from '@/icons/navbar/ProjectIcon';
import { BookmarkIcon } from '@/icons/BookmarkIcon';
import { MessageQuestionIcon } from '@/icons/MessageQuestionIcon';
import SettingsIcon from '@/icons/navbar/SettingsIcon';
import { LoginIcon } from '@/icons/LoginIcon';
import { shortenAddress } from '@/lib/utils';
import { FreelancerData } from '@/app/freelancer/page';

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

function ProfileDropdownMenu() {
  const router = useRouter();
  const [freelancerData, setFreelancerData] = useState<FreelancerData | null>(
    null,
  );

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

    const getData = async () => {
      const freelancerData = await fetchFreelancerDetails();
      setFreelancerData(freelancerData);
    };

    getData();
  }, []);

  const handleDisconnect = () => {
    console.log('Attempting to disconnect wallet...');
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
    }
    // route to home
    router.push(ApplicationRoutes.HOME);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Flex align={'center'} gap={'2'} className={''}>
          <Image
            src="/avatar/avatar1.svg"
            alt="Company Logo"
            width={40}
            height={40}
            className="rounded-full"
          />
          <Flex direction={'column'} className={''}>
            <Heading size={'2'}>
              {freelancerData?.name || 'Human Person'}
            </Heading>
            <Text color={'gray'} size={'2'} className={'leading-tight'}>
              {shortenAddress(freelancerData?.walletAddress || '')}
            </Text>
          </Flex>
          <LucideChevronDown size={20} />
        </Flex>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72" align="start">
        <DropdownMenuLabel>
          <Flex align={'center'} gap={'4'} className={''}>
            <Image
              src="/avatar/avatar1.svg"
              alt="Company Logo"
              width={64}
              height={64}
              className="rounded-full mr-2"
            />
            <Flex direction={'column'} className={''}>
              <Heading truncate size={'2'}>
                {freelancerData?.name || 'Human Person'}
              </Heading>
              <Text
                truncate
                color={'gray'}
                size={'2'}
                className={'leading-tight'}
              >
                {freelancerData?.title || 'Brand & UI/UX Designer'}
              </Text>
              <Flex align={'center'} gap={'4'}>
                <Text
                  truncate
                  color={'gray'}
                  size={'2'}
                  className={'leading-tight mr-4'}
                >
                  {shortenAddress(freelancerData?.walletAddress || '')}
                </Text>
                <Text>
                  <CopyIcon />
                </Text>
              </Flex>
            </Flex>
          </Flex>
        </DropdownMenuLabel>
        <Separator size={'4'} className={'my-2'} />
        <DropdownMenuGroup>
          <DropdownMenuItem className={'text-muted-foreground'}>
            <ProposalIcon /> My Proposals
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem className={'text-muted-foreground'}>
            <ProjectIcon /> Active Jobs
            <DropdownMenuShortcut>⌘J</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem className={'text-muted-foreground'}>
            <BookmarkIcon /> Bookmarked Jobs
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem className={'text-muted-foreground'}>
            <MessageQuestionIcon /> Job History
            <DropdownMenuShortcut>⌘H</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem
            className={'text-muted-foreground'}
            onClick={() => router.push(ApplicationRoutes.FREELANCER_SETUP)}
          >
            <SettingsIcon /> Settings
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className={'text-destructive'}
          onClick={handleDisconnect}
        >
          <LoginIcon /> Sign Out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem className={'w-full'}>
          <Flex align={'center'} justify={'between'} className={'w-full'}>
            <Text color={'gray'} size={'1'} className={'w-full'}>
              Privacy Policy
            </Text>
            <Text
              align={'right'}
              color={'gray'}
              size={'1'}
              className={'w-full'}
            >
              Terms & Conditions
            </Text>
          </Flex>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function FreelancerNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const isClientDashboardRoute = pathname.endsWith(
    ApplicationRoutes.CLIENT_DASHBOARD,
  );
  const isClientProjectsRoute = pathname.endsWith(
    ApplicationRoutes.CLIENT_PROJECTS,
  );
  const isClientProposalRoute = pathname.endsWith(
    ApplicationRoutes.CLIENT_PROPOSALS,
  );

  const [, setTabValue] = useState<string>('');

  useEffect(() => {
    // Prefetch the routes to ensure they are ready for navigation
    router.prefetch(ApplicationRoutes.CLIENT_DASHBOARD);
    router.prefetch(ApplicationRoutes.CLIENT_PROJECTS);
    router.prefetch(ApplicationRoutes.CLIENT_PROPOSALS);

    if (isClientDashboardRoute) {
      setTabValue('dashboard');
    } else if (isClientProjectsRoute) {
      setTabValue('project');
    } else if (isClientProposalRoute) {
      setTabValue('proposal');
    } else {
      setTabValue('');
    }
  }, [
    router,
    pathname,
    isClientDashboardRoute,
    isClientProjectsRoute,
    isClientProposalRoute,
  ]);

  return (
    <Flex
      position={'sticky'}
      top={'0'}
      left={'0'}
      right={'0'}
      className="py-4 z-50 bg-muted"
      align="center"
      justify="between"
    >
      <Link href={'/'} className="text-blue-400 font-bold text-2xl">
        DecentWork
      </Link>
      <div className="flex items-center gap-4"></div>

      <Flex align="center" gap="5">
        <Link href={ApplicationRoutes.SETTINGS}>
          <SearchIcon strokeWidth={1} className={'text-foreground'} />
        </Link>
        <NotificationIcon />
        <Text>{'100.50'} ATOM</Text>
        <ProfileDropdownMenu />
      </Flex>
    </Flex>
  );
}
