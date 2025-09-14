import { Flex, Separator, Table } from '@radix-ui/themes';
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

const TableDummyData = [
  {
    freelancerImage: 'icons/avatar/avatar1.svg',
    projectStatus: 'open',
    hire: 1,
    projectTitle: 'Product Designer',
    budget: 1000,
    postedDate: '2025-06-20',
    proposals: 20,
  },
  {
    freelancerImage: './icons/avatar/avatar2.svg',
    projectStatus: 'paused',
    hire: 1,
    projectTitle: 'UX Researcher',
    budget: 1000,
    postedDate: '2025-06-20',
    proposals: 20,
  },
  {
    freelancerImage: './icons/avatar/avatar3.svg',
    projectStatus: 'closed',
    hire: 1,
    projectTitle: 'UI/UX Designer',
    budget: 1000,
    postedDate: '2025-06-20',
    proposals: 20,
  },
  {
    freelancerImage: './icons/avatar/avatar4.svg',
    projectStatus: 'in_progress',
    hire: 1,
    projectTitle: 'Frontend Developer',
    budget: 1000,
    postedDate: '2025-06-20',
    proposals: 20,
  },
  {
    freelancerImage: './icons/avatar/avatar5.svg',
    projectStatus: 'completed',
    hire: 1,
    projectTitle: 'Backend Developer',
    budget: 1000,
    postedDate: '2025-06-20',
    proposals: 20,
  },
  {
    freelancerImage: './icons/avatar/avatar5.svg',
    projectStatus: 'under_review',
    hire: 1,
    projectTitle: 'Backend Developer',
    budget: 1000,
    postedDate: '2025-06-20',
    proposals: 20,
  },
  {
    freelancerImage: './icons/avatar/avatar5.svg',
    projectStatus: 'waiting_for_payment',
    hire: 1,
    projectTitle: 'Backend Developer',
    budget: 1000,
    postedDate: '2025-06-20',
    proposals: 20,
  },
];

const DummyStatus = [
  'open',
  'paused',
  'closed',
  'in_progress',
  'completed',
  'under_review',
  'waiting_for_payment',
];

export function Projects() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className={'flex items-center justify-between'}>
          Projects
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
                    <SelectItem key={eachStatus} value={eachStatus}>
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
                    <SelectItem key={eachStatus} value={eachStatus}>
                      {eachStatus.replace(/_/g, ' ')}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Flex>
        </Flex>
      </CardHeader>
      <CardContent>
        <Table.Root variant="surface" className="w-full !border-0">
          <Table.Header>
            <Table.Row className="h-10 leading-10">
              <Table.ColumnHeaderCell>Project Title</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell align="center">
                Proposals
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell align="center">
                Budget
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell align="center">
                Hire
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell align="center">
                Project Status
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell align="right">
                Posted Date
              </Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {TableDummyData.map((data, index) => (
              <Table.Row key={index} className="h-12 leading-[48px]">
                <Table.RowHeaderCell className={''}>
                  {data.projectTitle}
                </Table.RowHeaderCell>
                <Table.Cell align="center">{data.proposals}</Table.Cell>
                <Table.Cell align="center">{data.budget} AR</Table.Cell>
                <Table.Cell align="center">{data.hire}</Table.Cell>
                <Table.Cell align="center">{data.projectStatus}</Table.Cell>
                <Table.Cell align="right">{data.postedDate}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </CardContent>
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
    </Card>
  );
}
