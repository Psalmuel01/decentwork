import { Flex, Text } from '@radix-ui/themes';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function DashboardCards({
  title,
  subtitle,
  description,
  icon,
  showSelect = false,
}: {
  title: string;
  subtitle?: string;
  description: string;
  icon: React.ReactNode;
  showSelect?: boolean;
}) {
  return (
    <Card className="shadow-none rounded-2xl">
      <CardHeader>
        {/* <CardDescription>Total Revenue</CardDescription> */}
        <CardTitle className="text-2xl font-semibold tabular-nums w-full">
          <Flex
            align={'center'}
            className="w-full"
            gap={'2'}
            justify={'between'}
          >
            <Flex
              align={'center'}
              justify={'center'}
              className="size-8 leading-8 text-center rounded-lg border-border border"
            >
              {icon}
            </Flex>
            {showSelect && (
              <div>
                <Select>
                  <SelectTrigger className="px-2 !py-0 rounded-xl">
                    <SelectValue placeholder="April 2025" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Months</SelectLabel>
                      <SelectItem value="april">April 2025</SelectItem>
                      <SelectItem value="march">March 2025</SelectItem>
                      <SelectItem value="february">February 2025</SelectItem>
                      <SelectItem value="january">January 2025</SelectItem>
                      <SelectItem value="december">December 2024</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            )}
          </Flex>
        </CardTitle>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <Text className="line-clamp-1" size={'6'} weight={'bold'}>
          {title}
          {subtitle && (
            <Text color="gray" size={'2'} className="ml-1">
              {subtitle}
            </Text>
          )}
        </Text>
        <Text color="gray" size={'2'}>
          {description}
        </Text>
      </CardFooter>
    </Card>
  );
}
