import { Flex, Heading, Text } from '@radix-ui/themes';

export function PageContainer({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto">{children}</div>;
}

export function PageHeader({ children }: { children: React.ReactNode }) {
  return <Flex direction={'column'}>{children}</Flex>;
}

export function PageHeaderTitle({ children }: { children: React.ReactNode }) {
  return <Heading size={'9'}>{children}</Heading>;
}

export function PageHeaderDescription({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Text color="gray" size={'2'}>
      {children}
    </Text>
  );
}

export function PageBody({ children }: { children: React.ReactNode }) {
  return <div className="">{children}</div>;
}

export function PageFooter({ children }: { children: React.ReactNode }) {
  return <div className="mt-8">{children}</div>;
}
