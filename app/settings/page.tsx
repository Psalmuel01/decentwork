import {
  PageBody,
  PageContainer,
  PageHeader,
  PageHeaderDescription,
  PageHeaderTitle,
} from '@/components/PageContainer';
import { Flex } from '@radix-ui/themes';
import { Settings } from '@/components/Settings';

export default function Page() {
  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderTitle>Settings</PageHeaderTitle>
        <PageHeaderDescription>
          Manage your company details, preferences, and billing — all in one
          place.
        </PageHeaderDescription>
      </PageHeader>

      <PageBody>
        <Flex direction={'column'} gap={'8'} py={'8'}>
          <Flex direction={'column'} gap={'4'}>
            <Settings />
          </Flex>
        </Flex>
      </PageBody>
    </PageContainer>
  );
}
