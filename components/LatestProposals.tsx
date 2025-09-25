import { useState, useEffect } from 'react';
import { Flex, Grid, Separator, Text } from '@radix-ui/themes';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
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
import { LucideSearch } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import PaperIcon from '@/icons/Paper';
import CalendarIcon from '@/icons/Calendar';
import { DotSpacerSmall } from '@/components/client/DotSpacer';

type HiredStatusType = 'hired' | 'submitted' | 'not_hired' | 'pending';

enum E_HiredStatus {
  Hired = 'hired',
  Submitted = 'submitted',
  NotHired = 'not_hired',
  Pending = 'pending',
}

interface ProposalWithJob {
  proposalId: string;
  freelancerWalletAddress: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
  bidAmount: number;
  deliveryTime: number;
  jobName: string;
  jobId: string;
  jobBudget: number;
}

interface JobData {
  jobid: string;
  name: string;
  budget: number;
}

interface JobApplicationCardProps {
  jobTitle: string;
  avatarSrc: string;
  applicantName: string;
  applicantRole: string;
  applicantLocation: string;
  applicantAddress: string;
  description: string;
  amount: string;
  date: string;
  skills: string[];
  hiredStatus?: HiredStatusType;
  deliveryTime?: number;
  jobBudget?: number;
}

export function ProposalCard({
  jobTitle,
  avatarSrc,
  applicantName,
  applicantRole,
  applicantLocation,
  applicantAddress,
  description,
  amount,
  date,
  skills,
  hiredStatus,
  deliveryTime,
  jobBudget,
}: JobApplicationCardProps) {
  return (
    <Card className="w-full shadow-none rounded-xl">
      <CardHeader className="">
        <CardTitle className="text-xl font-semibold">{jobTitle}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-16 h-16">
              <AvatarImage
                src={avatarSrc || '/placeholder.svg'}
                alt={applicantName}
              />
              <AvatarFallback>{applicantName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="grid gap-0">
              <div className="font-medium text-lg leading-normal">
                {applicantName}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Text as={'span'}>{applicantRole}</Text>
                <DotSpacerSmall />
                <Text as={'span'}>{applicantLocation}</Text>
              </div>
              <div className="text-sm text-muted-foreground">
                {applicantAddress}
              </div>
            </div>
          </div>
          {hiredStatus === E_HiredStatus.Hired && (
            <Badge
              variant="outline"
              className="bg-emerald-100/50 text-emerald-700 border-0 px-3 py-1 rounded-full text-xs font-medium"
            >
              Hired
            </Badge>
          )}
          {hiredStatus === E_HiredStatus.Pending && (
            <Badge
              variant="outline"
              className="bg-amber-100/50 text-amber-700 border-0 px-3 py-1 rounded-full text-xs font-medium"
            >
              Pending
            </Badge>
          )}
          {hiredStatus === E_HiredStatus.Submitted && (
            <Badge
              variant="outline"
              className="bg-blue-100/50 text-blue-700 border-0 px-3 py-1 rounded-full text-xs font-medium"
            >
              Submitted
            </Badge>
          )}
          {hiredStatus === E_HiredStatus.NotHired && (
            <Badge
              variant="outline"
              className="bg-red-100/50 text-red-700 border-0 px-3 py-1 rounded-full text-xs font-medium"
            >
              Declined
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
          {description}
        </p>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <PaperIcon />
            <span>{amount}</span>
          </div>
          <div className="flex items-center gap-1">
            <CalendarIcon />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>Delivery: {deliveryTime} days</span>
          </div>
          <div className="flex items-center gap-1">
            <span>Budget: ${jobBudget}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 pt-2">
          {skills.map((skill, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="px-3 py-1.5 rounded-full text-xs text-muted-foreground border-border"
            >
              {skill}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function LatestProposals({ jobs }: { jobs: JobData[] }) {
  const [allProposals, setAllProposals] = useState<ProposalWithJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'pending' | 'accepted' | 'declined'
  >('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [projectFilter, setProjectFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

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

  const getProposalStats = () => {
    const total = allProposals.length;
    const pending = allProposals.filter((p) => p.status === 'pending').length;
    const accepted = allProposals.filter((p) => p.status === 'accepted').length;
    const declined = allProposals.filter((p) => p.status === 'declined').length;

    return { total, pending, accepted, declined };
  };

  const stats = getProposalStats();

  const uniqueProjects = [
    'all',
    ...new Set(allProposals.map((p) => p.jobName)),
  ];

  const filteredProposals = allProposals.filter(
    (proposal) =>
      (statusFilter === 'all' || proposal.status === statusFilter) &&
      (projectFilter === 'all' || proposal.jobName === projectFilter) &&
      (formatWalletAddress(proposal.freelancerWalletAddress)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
        proposal.jobName.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  const sortedProposals = [...filteredProposals].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
  });

  const totalPages = Math.ceil(sortedProposals.length / itemsPerPage);
  const paginatedProposals = sortedProposals.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handlePageChange = (page: number) => (e: React.MouseEvent) => {
    e.preventDefault();
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

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
            <div className="text-2xl font-bold text-yellow-600">
              {stats.pending}
            </div>
            <p className="text-xs text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {stats.accepted}
            </div>
            <p className="text-xs text-muted-foreground">Accepted</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">
              {stats.declined}
            </div>
            <p className="text-xs text-muted-foreground">Declined</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Proposals Card */}
      <Card>
        <CardHeader>
          <CardTitle className={'flex items-center justify-between'}>
            All Proposals ({filteredProposals.length})
          </CardTitle>
          <Flex
            align={'center'}
            justify={'between'}
            position={'relative'}
            mt={'3'}
          >
            <Flex align={'center'} gap={'2'}>
              <LucideSearch
                color={'gray'}
                size={14}
                className={'absolute left-3'}
              />
              <Input
                className={'pl-8 bg-transparent shadow-0 rounded-lg'}
                type="search"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Flex>
            <Flex align={'center'} gap={'3'}>
              <Select onValueChange={setStatusFilter} defaultValue="all">
                <SelectTrigger className="min-w-[120px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Status</SelectLabel>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="accepted">Accepted</SelectItem>
                    <SelectItem value="declined">Declined</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Select onValueChange={setSortBy} defaultValue="newest">
                <SelectTrigger className="min-w-[120px]">
                  <SelectValue placeholder="Sort by date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Sort by date</SelectLabel>
                    <SelectItem value="newest">Newest first</SelectItem>
                    <SelectItem value="oldest">Oldest first</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Select onValueChange={setProjectFilter} defaultValue="all">
                <SelectTrigger className="min-w-[120px]">
                  <SelectValue placeholder="Project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Project</SelectLabel>
                    {uniqueProjects.map((proj) => (
                      <SelectItem key={proj} value={proj}>
                        {proj === 'all' ? 'All' : proj}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Flex>
          </Flex>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Text className="text-center">Loading proposals...</Text>
          ) : paginatedProposals.length > 0 ? (
            <Grid columns={'2'} gap={'4'}>
              {paginatedProposals.map((proposal, index) => (
                <ProposalCard
                  key={`${proposal.proposalId}-${index}`}
                  jobTitle={proposal.jobName}
                  avatarSrc="/avatar/avatar5.svg"
                  applicantName={formatWalletAddress(
                    proposal.freelancerWalletAddress,
                  )}
                  applicantRole="Freelancer"
                  applicantLocation="N/A"
                  applicantAddress={formatWalletAddress(
                    proposal.freelancerWalletAddress,
                  )}
                  description={`Bid for $${proposal.bidAmount} with delivery in ${proposal.deliveryTime} days.`}
                  amount={`$${proposal.bidAmount}`}
                  date={new Date(proposal.createdAt).toLocaleDateString()}
                  skills={[]}
                  hiredStatus={
                    proposal.status === 'accepted'
                      ? 'hired'
                      : proposal.status === 'declined'
                        ? 'not_hired'
                        : proposal.status === 'pending'
                          ? 'pending'
                          : undefined
                  }
                  deliveryTime={proposal.deliveryTime}
                  jobBudget={proposal.jobBudget}
                />
              ))}
            </Grid>
          ) : (
            <Text className="text-center text-gray-500">
              {statusFilter === 'all'
                ? 'No proposals found'
                : `No ${statusFilter} proposals found`}
            </Text>
          )}
        </CardContent>
        <Separator size={'4'} />
        <CardFooter>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={handlePageChange(currentPage - 1)}
                />
              </PaginationItem>
              {totalPages <= 5 ? (
                Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        isActive={currentPage === page}
                        onClick={handlePageChange(page)}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ),
                )
              ) : (
                <>
                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      isActive={currentPage === 1}
                      onClick={handlePageChange(1)}
                    >
                      1
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      isActive={currentPage === 2}
                      onClick={handlePageChange(2)}
                    >
                      2
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      isActive={currentPage === totalPages - 1}
                      onClick={handlePageChange(totalPages - 1)}
                    >
                      {totalPages - 1}
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      isActive={currentPage === totalPages}
                      onClick={handlePageChange(totalPages)}
                    >
                      {totalPages}
                    </PaginationLink>
                  </PaginationItem>
                </>
              )}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={handlePageChange(currentPage + 1)}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardFooter>
      </Card>
    </div>
  );
}
