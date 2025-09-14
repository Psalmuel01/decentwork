'use client';

import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Flex } from '@radix-ui/themes';

export const description = 'A simple area chart';

const chartData = [
  { month: 'January', desktop: 186 },
  { month: 'February', desktop: 305 },
  { month: 'March', desktop: 237 },
  { month: 'April', desktop: 73 },
  { month: 'May', desktop: 209 },
  { month: 'June', desktop: 214 },
];

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig;

export function ProposalEngagementChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Proposal EngagementChart</CardTitle>
        <CardDescription>
          Showing your proposal engagement over the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Flex justify="end" align="center">
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Monthly" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Months</SelectLabel>
                <SelectItem value="january">January</SelectItem>
                <SelectItem value="february">February</SelectItem>
                <SelectItem value="march">March</SelectItem>
                <SelectItem value="april">April</SelectItem>
                <SelectItem value="may">May</SelectItem>
                <SelectItem value="june">June</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </Flex>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="desktop"
              type="natural"
              fill="#1A73E822"
              fillOpacity={0.4}
              stroke="#1A73E8"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none font-medium">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="text-muted-foreground flex items-center gap-2 leading-none">
              January - June 2024
            </div>
          </div>
        </div>
      </CardFooter> */}
    </Card>
  );
}
