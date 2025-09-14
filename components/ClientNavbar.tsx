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
import { useXionWallet } from '@/context/xion-context';
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

function ProfileDropdownMenu() {
  const { isConnected, address, disconnect } = useXionWallet();
  const router = useRouter();

  const handleDisconnect = () => {
    console.log('Attempting to disconnect wallet...');
    disconnect();
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
          <Text size={'2'}>{0} ATOM</Text>
          <Skeleton loading={!isConnected && !address}>
            <Separator orientation={'vertical'} size={'2'} className={''} />
            <Text color={'gray'} size={'2'}>
              {address && shortenAddress(address)}
            </Text>
          </Skeleton>
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
                0 ATOM
              </Text>
              <Flex align={'center'} gap={'4'}>
                <Text
                  truncate
                  color={'gray'}
                  size={'2'}
                  className={'leading-tight mr-4'}
                >
                  {shortenAddress(address!)}
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
            onClick={() => router.push(ApplicationRoutes.SETTINGS)}
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
