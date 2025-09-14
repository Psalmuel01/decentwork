import {
  PageBody,
  PageContainer,
  PageHeader,
  PageHeaderDescription,
  PageHeaderTitle,
} from '@/components/PageContainer';
import { Flex, Grid, Heading, Separator, Text } from '@radix-ui/themes';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { LucideSearch } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const DummyStatus = [
  'open',
  'paused',
  'closed',
  'in_progress',
  'completed',
  'under_review',
  'waiting_for_payment',
];

export interface JobCardProps {
  logoSrc?: string;
  jobTitle: string;
  companyName: string;
  location: string;
  hourlyRate: string;
  estimatedTime: string;
  description: string;
  tags: string[];
  fundsVerified: boolean;
  fundingAmount: string;
  applicantsRange: string;
  postedTime: string;
}

function JobCard() {
  return (
    <Card className={'shadow-none'}>
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
            <CardTitle>Login to your account</CardTitle>
            <CardDescription className={'leading-normal'}>
              Enter your email below to login to your account
            </CardDescription>
          </Flex>
        </Flex>
        <CardAction>
          <Badge
            variant="outline"
            className="bg-emerald-100/50 text-emerald-700 border-0 px-3 py-1 rounded-full text-xs font-medium"
          >
            In progress
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent className={'space-y-4'}>
        <Flex align={'center'} justify={'between'}>
          <Text>
            <Text color={'gray'}>Funding:</Text>
            <Text>{'50.0'} ATOM</Text>
          </Text>

          <Text>
            <Text color={'gray'}>Due Date:</Text>
            <Text>{'June 10, 2025'}</Text>
          </Text>

          <Text>
            <Text color={'gray'}>Milestone:</Text>
            <Text>{'5 of 10'}</Text>
          </Text>
        </Flex>
        <Flex align={'center'} justify={'start'}>
          <Text>
            <Text color={'gray'}>Contract ID:</Text>
            <Text>{'0x123...678'}</Text>
          </Text>

          <Button variant="link">View on chain</Button>
        </Flex>
      </CardContent>
    </Card>
  );
}

export default function Page() {
  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderTitle>My Workroom</PageHeaderTitle>
        <PageHeaderDescription>
          Your freelance journey, organized. See what’s active, what’s pending,
          and what’s next.
        </PageHeaderDescription>
      </PageHeader>

      <PageBody>
        <Card className={"shadow-none border-0 my-8"}>
          <CardContent>
            <Flex direction={'column'} gap={'8'}>
              <Flex direction={'column'} gap={'4'}>
                <Tabs defaultValue="active">
                  <TabsList
                    className={
                      'rounded-full h-12 px-1 bg-muted *:rounded-full *:!shadow-none *:px-4'
                    }
                  >
                    <TabsTrigger value="active">Active Jobs</TabsTrigger>
                    <TabsTrigger value="mine">My Proposals</TabsTrigger>
                    <TabsTrigger value="bookmarked">
                      Bookmarked Jobs
                    </TabsTrigger>
                    <TabsTrigger value="history">Job History</TabsTrigger>
                  </TabsList>
                  <TabsContent value="active" className={'py-4 space-y-4'}>
                    <Flex
                      direction={'column'}
                      justify={'center'}
                      className={'w-full'}
                    >
                      <Heading className={'w-full'} size={"4"}>Active Jobs</Heading>
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
                            className={
                              'pl-8 bg-transparent shadow-0 rounded-lg'
                            }
                            type="search"
                            placeholder="Search..."
                          />
                        </Flex>
                        <Flex align={'center'} gap={'3'}>
                          <Select>
                            <SelectTrigger className="min-w-[120px]">
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Status</SelectLabel>
                                {DummyStatus.map((eachStatus) => (
                                  <SelectItem
                                    key={eachStatus}
                                    value={eachStatus}
                                  >
                                    {eachStatus.replace(/_/g, ' ')}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>

                          <Select>
                            <SelectTrigger className="min-w-[120px]">
                              <SelectValue placeholder="Date" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Status</SelectLabel>
                                {DummyStatus.map((eachStatus) => (
                                  <SelectItem
                                    key={eachStatus}
                                    value={eachStatus}
                                  >
                                    {eachStatus.replace(/_/g, ' ')}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </Flex>
                      </Flex>
                    </Flex>
                    <Grid columns={{ initial: '1', lg: '2' }} gap={'3'}>
                      <JobCard />
                      <JobCard />
                      <JobCard />
                      <JobCard />
                      <JobCard />
                      <JobCard />
                    </Grid>
                    <Separator size={'4'} />
                    <CardFooter>
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious href="#" />
                          </PaginationItem>
                          <PaginationItem>
                            <PaginationLink href="#">1</PaginationLink>
                          </PaginationItem>
                          <PaginationItem>
                            <PaginationLink href="#" isActive>
                              2
                            </PaginationLink>
                          </PaginationItem>
                          <PaginationItem>
                            <PaginationLink href="#">3</PaginationLink>
                          </PaginationItem>
                          <PaginationItem>
                            <PaginationEllipsis />
                          </PaginationItem>
                          <PaginationItem>
                            <PaginationLink href="#">8</PaginationLink>
                          </PaginationItem>
                          <PaginationItem>
                            <PaginationLink href="#">9</PaginationLink>
                          </PaginationItem>
                          <PaginationItem>
                            <PaginationLink href="#">10</PaginationLink>
                          </PaginationItem>
                          <PaginationItem className={'flex-1'}>
                            <PaginationNext href="#" />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </CardFooter>
                  </TabsContent>
                  <TabsContent value="mine">
                    <Flex direction={"column"} gap={"4"} py={"4"}>
                      <Flex
                        direction={'column'}
                        justify={'center'}
                        className={'w-full'}
                      >
                        <Heading className={'w-full'} size={"4"}>My Proposals</Heading>
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
                              className={
                                'pl-8 bg-transparent shadow-0 rounded-lg'
                              }
                              type="search"
                              placeholder="Search..."
                            />
                          </Flex>
                          <Flex align={'center'} gap={'3'}>
                            <Select>
                              <SelectTrigger className="min-w-[120px]">
                                <SelectValue placeholder="Status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>Status</SelectLabel>
                                  {DummyStatus.map((eachStatus) => (
                                    <SelectItem
                                      key={eachStatus}
                                      value={eachStatus}
                                    >
                                      {eachStatus.replace(/_/g, ' ')}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>

                            <Select>
                              <SelectTrigger className="min-w-[120px]">
                                <SelectValue placeholder="Date" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>Status</SelectLabel>
                                  {DummyStatus.map((eachStatus) => (
                                    <SelectItem
                                      key={eachStatus}
                                      value={eachStatus}
                                    >
                                      {eachStatus.replace(/_/g, ' ')}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </Flex>
                        </Flex>
                      </Flex>
                      <Grid columns={{ initial: '1', lg: '2' }} gap={'3'}>
                        <JobCard />
                        <JobCard />
                        <JobCard />
                        <JobCard />
                        <JobCard />
                        <JobCard />
                      </Grid>
                      <Separator size={'4'} />
                      <CardFooter>
                        <Pagination>
                          <PaginationContent>
                            <PaginationItem>
                              <PaginationPrevious href="#" />
                            </PaginationItem>
                            <PaginationItem>
                              <PaginationLink href="#">1</PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                              <PaginationLink href="#" isActive>
                                2
                              </PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                              <PaginationLink href="#">3</PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                              <PaginationEllipsis />
                            </PaginationItem>
                            <PaginationItem>
                              <PaginationLink href="#">8</PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                              <PaginationLink href="#">9</PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                              <PaginationLink href="#">10</PaginationLink>
                            </PaginationItem>
                            <PaginationItem className={'flex-1'}>
                              <PaginationNext href="#" />
                            </PaginationItem>
                          </PaginationContent>
                        </Pagination>
                      </CardFooter>
                    </Flex>
                  </TabsContent>
                  <TabsContent value="bookmarked">
                    <Flex direction={"column"} gap={"4"} py={"4"}>
                      <Flex
                        direction={'column'}
                        justify={'center'}
                        className={'w-full'}
                      >
                        <Heading className={'w-full'} size={"4"}>Bookmarked Jobs</Heading>
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
                              className={
                                'pl-8 bg-transparent shadow-0 rounded-lg'
                              }
                              type="search"
                              placeholder="Search..."
                            />
                          </Flex>
                          <Flex align={'center'} gap={'3'}>
                            <Select>
                              <SelectTrigger className="min-w-[120px]">
                                <SelectValue placeholder="Status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>Status</SelectLabel>
                                  {DummyStatus.map((eachStatus) => (
                                    <SelectItem
                                      key={eachStatus}
                                      value={eachStatus}
                                    >
                                      {eachStatus.replace(/_/g, ' ')}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>

                            <Select>
                              <SelectTrigger className="min-w-[120px]">
                                <SelectValue placeholder="Date" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>Status</SelectLabel>
                                  {DummyStatus.map((eachStatus) => (
                                    <SelectItem
                                      key={eachStatus}
                                      value={eachStatus}
                                    >
                                      {eachStatus.replace(/_/g, ' ')}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </Flex>
                        </Flex>
                      </Flex>
                      <Grid columns={{ initial: '1', lg: '2' }} gap={'3'}>
                        <JobCard />
                        <JobCard />
                        <JobCard />
                        <JobCard />
                        <JobCard />
                        <JobCard />
                      </Grid>
                      <Separator size={'4'} />
                      <CardFooter>
                        <Pagination>
                          <PaginationContent>
                            <PaginationItem>
                              <PaginationPrevious href="#" />
                            </PaginationItem>
                            <PaginationItem>
                              <PaginationLink href="#">1</PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                              <PaginationLink href="#" isActive>
                                2
                              </PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                              <PaginationLink href="#">3</PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                              <PaginationEllipsis />
                            </PaginationItem>
                            <PaginationItem>
                              <PaginationLink href="#">8</PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                              <PaginationLink href="#">9</PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                              <PaginationLink href="#">10</PaginationLink>
                            </PaginationItem>
                            <PaginationItem className={'flex-1'}>
                              <PaginationNext href="#" />
                            </PaginationItem>
                          </PaginationContent>
                        </Pagination>
                      </CardFooter>
                    </Flex>
                  </TabsContent>
                  <TabsContent value="history">
                    <Flex direction={"column"} gap={"4"} py={"4"}>
                      <Flex
                        direction={'column'}
                        justify={'center'}
                        className={'w-full'}
                      >
                        <Heading className={'w-full'} size={"4"}>Job History</Heading>
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
                              className={
                                'pl-8 bg-transparent shadow-0 rounded-lg'
                              }
                              type="search"
                              placeholder="Search..."
                            />
                          </Flex>
                          <Flex align={'center'} gap={'3'}>
                            <Select>
                              <SelectTrigger className="min-w-[120px]">
                                <SelectValue placeholder="Status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>Status</SelectLabel>
                                  {DummyStatus.map((eachStatus) => (
                                    <SelectItem
                                      key={eachStatus}
                                      value={eachStatus}
                                    >
                                      {eachStatus.replace(/_/g, ' ')}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>

                            <Select>
                              <SelectTrigger className="min-w-[120px]">
                                <SelectValue placeholder="Date" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>Status</SelectLabel>
                                  {DummyStatus.map((eachStatus) => (
                                    <SelectItem
                                      key={eachStatus}
                                      value={eachStatus}
                                    >
                                      {eachStatus.replace(/_/g, ' ')}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </Flex>
                        </Flex>
                      </Flex>
                      <Grid columns={{ initial: '1', lg: '2' }} gap={'3'}>
                        <JobCard />
                        <JobCard />
                        <JobCard />
                        <JobCard />
                        <JobCard />
                        <JobCard />
                      </Grid>
                      <Separator size={'4'} />
                      <CardFooter>
                        <Pagination>
                          <PaginationContent>
                            <PaginationItem>
                              <PaginationPrevious href="#" />
                            </PaginationItem>
                            <PaginationItem>
                              <PaginationLink href="#">1</PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                              <PaginationLink href="#" isActive>
                                2
                              </PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                              <PaginationLink href="#">3</PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                              <PaginationEllipsis />
                            </PaginationItem>
                            <PaginationItem>
                              <PaginationLink href="#">8</PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                              <PaginationLink href="#">9</PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                              <PaginationLink href="#">10</PaginationLink>
                            </PaginationItem>
                            <PaginationItem className={'flex-1'}>
                              <PaginationNext href="#" />
                            </PaginationItem>
                          </PaginationContent>
                        </Pagination>
                      </CardFooter>
                    </Flex>
                  </TabsContent>
                </Tabs>
              </Flex>
            </Flex>
          </CardContent>
        </Card>
      </PageBody>
    </PageContainer>
  );
}
