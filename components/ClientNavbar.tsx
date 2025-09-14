'use client';

import {
  Flex,
  SegmentedControl,
  Separator,
  Skeleton,
  Text,
} from '@radix-ui/themes';
import DashboardIcon from '@/icons/navbar/DashboardIcon';
import ProjectIcon from '@/icons/navbar/ProjectIcon';
import ProposalIcon from '@/icons/navbar/ProposalIcon';
import SettingsIcon from '@/icons/navbar/SettingsIcon';
import NotificationIcon from '@/icons/navbar/NotificationIcon';
import Link from 'next/link';
import { ApplicationRoutes } from '@/config/routes';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { shortenAddress } from '@/lib/utils';
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
import { LucideChevronDown } from 'lucide-react';
import CopyIcon from '@/icons/client/copy-icon';
import { LoginIcon } from '@/icons/LoginIcon';

const API_URL = 'https://decentwork.onrender.com/graphql';

const GET_CLIENT_DETAILS = `
  query GetClientDetails {
    getClientDetails {
      code
      data {
        address
        bio
        city
        clientid
        companyName
        contact
        contactName
        country
        createdAt
        email
        imageURL
        industry
        linkedinLink
        role
        size
        socialLink
        walletAddress
        webLink
      }
      message
      success
    }
  }
`;

interface ClientData {
  address: string;
  bio: string;
  city: string;
  clientid: string;
  companyName: string;
  contact: string;
  contactName: string;
  country: string;
  createdAt: string;
  email: string;
  imageURL: string;
  industry: string;
  linkedinLink: string;
  role: string;
  size: string;
  socialLink: string;
  walletAddress: string;
  webLink: string;
}

function ProfileDropdownMenu() {
  const router = useRouter();
  const [clientData, setClientData] = useState<ClientData | null>(null);

  useEffect(() => {
    const fetchClientDetails = async () => {
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
            query: GET_CLIENT_DETAILS,
          }),
        });

        const result = await response.json();

        if (result.errors) {
          console.error('GraphQL errors:', result.errors);
          return null;
        }

        const clientDetails = result.data?.getClientDetails;

        if (clientDetails?.success && clientDetails?.data) {
          console.log('Client details:', clientDetails.data);
          return clientDetails.data;
        } else {
          console.log(
            'No client profile found or request failed:',
            clientDetails?.message,
          );
          return null;
        }
      } catch (error) {
        console.error('Error fetching client details:', error);
        return null;
      }
    };

    const getData = async () => {
      const clientData = await fetchClientDetails();
      setClientData(clientData);
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
        <Flex
          align={'center'}
          className={'border border-border h-12 rounded-lg'}
          gap={'4'}
          px={'5'}
        >
          <Text size={'2'}>
            {shortenAddress(clientData?.walletAddress || '')}
          </Text>

          <LucideChevronDown size={20} />
        </Flex>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72" align="start">
        <DropdownMenuLabel>
          <Flex align={'center'} gap={'4'} className={''}>
            <Flex direction={'column'} className={''}>
              <Text
                truncate
                color={'gray'}
                size={'2'}
                className={'leading-tight'}
              >
                {clientData?.companyName || ''}
              </Text>
              <Flex align={'center'} gap={'4'}>
                <Text
                  truncate
                  color={'gray'}
                  size={'2'}
                  className={'leading-tight mr-4'}
                >
                  {shortenAddress(clientData?.walletAddress || '')}
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
            <ProposalIcon /> Job Proposals
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem className={'text-muted-foreground'}>
            <ProjectIcon /> Active Projects
            <DropdownMenuShortcut>⌘J</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem
            className={'text-muted-foreground'}
            onClick={() => router.push(ApplicationRoutes.CLIENT_SETUP)}
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

export default function ClientNavbar() {
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

  const [tabValue, setTabValue] = useState<string>('');

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
      </Link>{' '}
      <div className="flex items-center gap-4">
        <SegmentedControl.Root
          defaultValue={'dashboard'}
          value={tabValue}
          onValueChange={(value) => {
            if (value === 'dashboard') {
              router.push(ApplicationRoutes.CLIENT_DASHBOARD);
            } else if (value === 'project') {
              router.push(ApplicationRoutes.CLIENT_PROJECTS);
            } else if (value === 'proposal') {
              router.push(ApplicationRoutes.CLIENT_PROPOSALS);
            }
          }}
          radius="full"
          size={'3'}
          className={'cursor-pointer'}
        >
          <SegmentedControl.Item value="dashboard">
            <Flex align="center" gap="2">
              <DashboardIcon />
              <Text size={'2'}>Dashboard</Text>
            </Flex>
          </SegmentedControl.Item>
          <SegmentedControl.Item value="project">
            <Flex align="center" gap="2">
              <ProjectIcon />
              <Text size={'2'}>Project</Text>
            </Flex>
          </SegmentedControl.Item>
          <SegmentedControl.Item value="proposal">
            <Flex align="center" gap="2">
              <ProposalIcon />
              <Text size={'2'}>Proposal</Text>
            </Flex>
          </SegmentedControl.Item>
        </SegmentedControl.Root>
      </div>
      <Flex align="center" gap="5">
        <Link href={ApplicationRoutes.SETTINGS}>
          <SettingsIcon />
        </Link>
        <NotificationIcon />

        <ProfileDropdownMenu />
      </Flex>
    </Flex>
  );
}
