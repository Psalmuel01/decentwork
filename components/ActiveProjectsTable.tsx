import { Table } from '@radix-ui/themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TableDummyData = [
  {
    projectTitle: 'Product Designer',
    proposals: 49,
    postedDate: '2025-06-20',
  },
  {
    projectTitle: 'UX Researcher',
    proposals: 40,
    postedDate: '2025-06-20',
  },
  {
    projectTitle: 'UI/UX Designer',
    proposals: 40,
    postedDate: '2025-06-20',
  },
  {
    projectTitle: 'Frontend Developer',
    proposals: 20,
    postedDate: '2025-06-20',
  },
];

export function ActiveProjectsTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Projects</CardTitle>
      </CardHeader>
      <CardContent>
        <Table.Root variant="surface" className="w-full border-0">
          <Table.Header>
            <Table.Row className="h-10 leading-10">
              <Table.ColumnHeaderCell>Project Title</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Proposals</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Posted Date</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {TableDummyData.map((data, index) => (
              <Table.Row key={index} className="h-12 leading-[48px]">
                <Table.RowHeaderCell>{data.projectTitle}</Table.RowHeaderCell>
                <Table.Cell>{data.proposals}</Table.Cell>
                <Table.Cell>{data.postedDate}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </CardContent>
    </Card>
  );
}
