import {
  PageBody,
  PageContainer,
  PageHeader,
} from '@/components/PageContainer';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Container,
  Flex,
  Grid,
  Heading,
  Separator,
  Text,
} from '@radix-ui/themes';
import { LucideArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { FundingIcon } from '@/icons/FundingIcon';
import { ApplicantsIcon } from '@/icons/ApplicantsIcon';
import CalendarIcon from '@/icons/Calendar';
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
import { Textarea } from '@/components/ui/textarea';
import { LockedIcon } from '@/icons/LockedIcon';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { ApplicationRoutes } from '@/config/routes';

export default function Page() {
  return (
    <Container>
      <PageContainer>
        <PageBody>
          <Flex direction={'column'} gap={"6"} className={'bg-background p-6 rounded-lg'}>
            <Link href={ApplicationRoutes.FREELANCER_DASHBOARD}>
              <LucideArrowLeft size={24} />
            </Link>

            <Grid columns={'3'} gap={'8'} align={'start'}>
              <Flex direction={'column'} gap={'6'} className={'col-span-2'}>
                <PageHeader>
                  <Heading>Submit a Proposal</Heading>
                  <Text size={'2'} color={'gray'}>
                    Please share your contact details and let us know how you’d
                    prefer to be contacted.
                  </Text>
                </PageHeader>

                <Flex direction={'column'} gap={'6'}>
                  <Flex direction={'column'} gap={'2'}>
                    <Text size={'2'} weight={'bold'}>
                      Your Offer
                    </Text>
                    <Flex
                      align={'center'}
                      className={'border border-border rounded-lg'}
                    >
                      <Input
                        type="text"
                        placeholder="Enter your bid offer"
                        className="border-0 px-4 h-12 w-full shadow-none focus:ring-0 focus:border-0 focus-visible:outline-none focus-visible:ring-0"
                      />
                      <Separator orientation={'vertical'} size={'4'} />
                      <Text color={'gray'} className={'px-4'}>
                        ATOM
                      </Text>
                    </Flex>
                  </Flex>
                  <Flex direction={'column'} gap={'2'}>
                    <Text size={'2'} weight={'bold'}>
                      Estimated Delivery Time
                    </Text>
                    <Flex
                      align={'center'}
                      className={'border border-border rounded-lg'}
                    >
                      <Input
                        type="text"
                        placeholder="Estimated Delivery Time"
                        className="border-0 px-4 h-12 w-full shadow-none focus:ring-0 focus:border-0 focus-visible:outline-none focus-visible:ring-0"
                      />
                      <Separator orientation={'vertical'} size={'4'} />
                      <Select>
                        <SelectTrigger className="w-[100px] ring-0 focus:ring-0 focus-visible:ring-0 border-0">
                          <SelectValue placeholder="Days" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Days</SelectLabel>
                            <SelectItem value="apple">Apple</SelectItem>
                            <SelectItem value="banana">Banana</SelectItem>
                            <SelectItem value="blueberry">Blueberry</SelectItem>
                            <SelectItem value="grapes">Grapes</SelectItem>
                            <SelectItem value="pineapple">Pineapple</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </Flex>
                  </Flex>
                  <Flex direction={'column'} gap={'2'}>
                    <Text size={'2'} weight={'bold'}>
                      Cover Letter
                    </Text>
                    <Textarea
                      placeholder="Write your pitch... explain why you're the best fit, your approach, and past experience."
                      className="resize-none"
                    />
                    <Text align={'right'} color={'gray'} size={'2'}>
                      Characters Left: 750
                    </Text>
                  </Flex>
                  <Flex direction={'column'} gap={'2'}>
                    <Text size={'2'} weight={'bold'}>
                      ATOM Wallet Address
                    </Text>
                    <Flex
                      align={'center'}
                      className={'border border-border bg-muted rounded-lg'}
                    >
                      <Input
                        disabled
                        className="border-0 px-4 h-12 w-full shadow-none focus:ring-0 focus:border-0 focus-visible:outline-none focus-visible:ring-0"
                        placeholder="0x22B202d30973456aD12c4358AF6758900B61bc5d"
                        type="text"
                        value={'0x22B202d30973456aD12c4358AF6758900B61bc5d'}
                      />
                      <Text color={'gray'} className={'px-4'}>
                        <LockedIcon />
                      </Text>
                    </Flex>
                  </Flex>

                  <Flex direction={'column'} gap={'3'}>
                    <Flex align={'center'} gap={'3'}>
                      <Checkbox id="time_agreement" />
                      <Label htmlFor="time_agreement" className={"font-normal"}>
                        I agree to deliver this work within the time and budget.
                      </Label>
                    </Flex>
                    <Flex align={'center'} gap={'3'}>
                      <Checkbox id="payment_agreement" />
                      <Label htmlFor="payment_agreement" className={"font-normal"}>
                        I understand payment is secured via crypto escrow.
                      </Label>
                    </Flex>
                  </Flex>

                  <Flex direction={'column'} gap={'3'}>
                    <Button className={"h-12"}>
                      Submit Proposal
                    </Button>
                  </Flex>
                </Flex>
              </Flex>
              <Flex
                direction={'column'}
                gap={'3'}
                p={'4'}
                className={'col-span-1 bg-muted rounded-xl'}
              >
                <Card className={'border-0 shadow-none'}>
                  <CardHeader>
                    <Text color={'gray'} size={'2'}>
                      Posted 3 hours ago
                    </Text>
                    <Flex align={'center'} gap={'2'} className={''}>
                      <Image
                        src="/avatar/avatar1.svg"
                        alt="Company Logo"
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <Flex direction={'column'} className={''}>
                        <CardTitle>Web Design - UI/UX</CardTitle>
                        <CardDescription className={'leading-normal'}>
                          Coinbase . Canada
                        </CardDescription>
                      </Flex>
                    </Flex>
                  </CardHeader>
                </Card>

                <Flex direction={'column'} gap={'4'}>
                  <Flex align={'center'} gap={'2'}>
                    <Text>
                      <FundingIcon />
                    </Text>
                    <Text color={'gray'} size={'2'}>
                      Funding
                    </Text>
                    <Text size={'2'}>50.5 ATOM</Text>
                  </Flex>
                  <Flex align={'center'} gap={'2'}>
                    <Text>
                      <ApplicantsIcon />
                    </Text>
                    <Text color={'gray'} size={'2'}>
                      Applicants
                    </Text>
                    <Text size={'2'}>5 to 10</Text>
                  </Flex>
                  <Flex align={'center'} gap={'2'}>
                    <Text>
                      <CalendarIcon />
                    </Text>
                    <Text color={'gray'} size={'2'}>
                      Estimated Time
                    </Text>
                    <Text size={'2'}>1 - 3 weeks</Text>
                  </Flex>
                </Flex>
              </Flex>
            </Grid>
          </Flex>
        </PageBody>
      </PageContainer>
    </Container>
  );
}
