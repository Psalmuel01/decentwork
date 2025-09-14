import { Avatar, Flex, Table, Text } from '@radix-ui/themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const TableDummyData = [
  {
    freelancerImage: '/avatar/avatar1.svg',
    freelancer: 'John Doe',
    freelancerAddress: '0x1234567890',
    projectTitle: 'Product Designer',
    bidAmount: 1000,
  },
  {
    freelancerImage: '/avatar/avatar2.svg',
    freelancer: 'Jane Smith',
    freelancerAddress: '0x1234567890',
    projectTitle: 'UX Researcher',
    bidAmount: 1000,
  },
  {
    freelancerImage: '/avatar/avatar3.svg',
    freelancer: 'Alice Johnson',
    freelancerAddress: '0x1234567890',
    projectTitle: 'UI/UX Designer',
    bidAmount: 1000,
  },
  {
    freelancerImage: '/avatar/avatar4.svg',
    freelancer: 'Bob Brown',
    freelancerAddress: '0x1234567890',
    projectTitle: 'Frontend Developer',
    bidAmount: 1000,
  },
  {
    freelancerImage: '/avatar/avatar5.svg',
    freelancer: 'Charlie Davis',
    freelancerAddress: '0x1234567890',
    projectTitle: 'Backend Developer',
    bidAmount: 1000,
  },
];

export function LatestProposals() {
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
                Project Title
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell align="right">
                Bid Amount
              </Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {TableDummyData.map((data, index) => (
              <Table.Row key={index} className="h-12 leading-[48px]">
                <Table.RowHeaderCell className={''}>
                  <Flex align={'center'} gap={'2'} className={'h-full'}>
                    <Avatar
                      className={'rounded-full'}
                      fallback=""
                      src={data.freelancerImage}
                    />
                    <Flex align={'start'} direction="column" gap={'1'}>
                      <Text>{data.freelancer}</Text>
                      <Text color={'gray'} size={'1'}>
                        {data.freelancerAddress}
                      </Text>
                    </Flex>
                  </Flex>
                </Table.RowHeaderCell>
                <Table.Cell align="center">{data.projectTitle}</Table.Cell>
                <Table.Cell align="right">{data.bidAmount} AR</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </CardContent>
    </Card>
  );
}
