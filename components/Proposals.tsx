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

const DummyStatus = [
  'open',
  'paused',
  'closed',
  'in_progress',
  'completed',
  'under_review',
  'waiting_for_payment',
];

type HiredStatusType = 'hired' | 'submitted' | 'not_hired' | 'pending';

enum E_HiredStatus {
  Hired = 'hired',
  Submitted = 'submitted',
  NotHired = 'not_hired',
  Pending = 'pending',
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
              <div className="font-medium text-lg leading-normal">{applicantName}</div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Text as={"span"}>{applicantRole}</Text>
                <DotSpacerSmall />
                <Text as={"span"}>{applicantLocation}</Text>
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

export function Proposals() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className={'flex items-center justify-between'}>
          Proposals
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

            <Select>
              <SelectTrigger className="min-w-[120px]">
                <SelectValue placeholder="Project" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Project</SelectLabel>
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
        <Grid columns={"2"} gap={"4"}>
          <ProposalCard
            jobTitle="Web Designer - UIUX"
            avatarSrc="/avatar/avatar1.svg"
            applicantName="Folake Malik"
            applicantRole="Brand & UIUX Desiger"
            applicantLocation="Uyo, Akwa Ibom"
            applicantAddress="0xc574...A578"
            description="Hi there, I'm excited about the opportunity to work on your UI/UX project. With over 4 years of experience designing intuitive and user-centered interfaces for web and mobile applications. My expertise lies in creating user-centered designs that are both aesthetically pleasing and highly functional. I am proficient in various design tools and methodologies, ensuring a seamless user experience from concept to implementation. I look forward to contributing to your team's success."
            amount="50.5 ATOM"
            date="June 20, 2025"
              skills={["Product Design", "Branding", "User Research"]}
            hiredStatus={E_HiredStatus.Hired}
          />
          <ProposalCard
            jobTitle="Web Designer - UIUX"
            avatarSrc="/avatar/avatar1.svg"
            applicantName="Folake Malik"
            applicantRole="Brand & UIUX Desiger"
            applicantLocation="Uyo, Akwa Ibom"
            applicantAddress="0xc574...A578"
            description="Hi there, I'm excited about the opportunity to work on your UI/UX project. With over 4 years of experience designing intuitive and user-centered interfaces for web and mobile applications. My expertise lies in creating user-centered designs that are both aesthetically pleasing and highly functional. I am proficient in various design tools and methodologies, ensuring a seamless user experience from concept to implementation. I look forward to contributing to your team's success."
            amount="50.5 ATOM"
            date="June 20, 2025"
            skills={["Product Design", "Branding", "User Research"]}
            hiredStatus={E_HiredStatus.NotHired}
          />
          <ProposalCard
            jobTitle="Web Designer - UIUX"
            avatarSrc="/avatar/avatar1.svg"
            applicantName="Folake Malik"
            applicantRole="Brand & UIUX Desiger"
            applicantLocation="Uyo, Akwa Ibom"
            applicantAddress="0xc574...A578"
            description="Hi there, I'm excited about the opportunity to work on your UI/UX project. With over 4 years of experience designing intuitive and user-centered interfaces for web and mobile applications. My expertise lies in creating user-centered designs that are both aesthetically pleasing and highly functional. I am proficient in various design tools and methodologies, ensuring a seamless user experience from concept to implementation. I look forward to contributing to your team's success."
            amount="50.5 ATOM"
            date="June 20, 2025"
            skills={["Product Design", "Branding", "User Research"]}
            hiredStatus={E_HiredStatus.Submitted}
          />
          <ProposalCard
            jobTitle="Web Designer - UIUX"
            avatarSrc="/avatar/avatar1.svg"
            applicantName="Folake Malik"
            applicantRole="Brand & UIUX Desiger"
            applicantLocation="Uyo, Akwa Ibom"
            applicantAddress="0xc574...A578"
            description="Hi there, I'm excited about the opportunity to work on your UI/UX project. With over 4 years of experience designing intuitive and user-centered interfaces for web and mobile applications. My expertise lies in creating user-centered designs that are both aesthetically pleasing and highly functional. I am proficient in various design tools and methodologies, ensuring a seamless user experience from concept to implementation. I look forward to contributing to your team's success."
            amount="50.5 ATOM"
            date="June 20, 2025"
            skills={["Product Design", "Branding", "User Research"]}
            hiredStatus={E_HiredStatus.Pending}
          />
          <ProposalCard
            jobTitle="Web Designer - UIUX"
            avatarSrc="/avatar/avatar1.svg"
            applicantName="Folake Malik"
            applicantRole="Brand & UIUX Desiger"
            applicantLocation="Uyo, Akwa Ibom"
            applicantAddress="0xc574...A578"
            description="Hi there, I'm excited about the opportunity to work on your UI/UX project. With over 4 years of experience designing intuitive and user-centered interfaces for web and mobile applications. My expertise lies in creating user-centered designs that are both aesthetically pleasing and highly functional. I am proficient in various design tools and methodologies, ensuring a seamless user experience from concept to implementation. I look forward to contributing to your team's success."
            amount="50.5 ATOM"
            date="June 20, 2025"
            skills={["Product Design", "Branding", "User Research"]}
            hiredStatus={E_HiredStatus.Submitted}
          />
          <ProposalCard
            jobTitle="Web Designer - UIUX"
            avatarSrc="/avatar/avatar1.svg"
            applicantName="Folake Malik"
            applicantRole="Brand & UIUX Desiger"
            applicantLocation="Uyo, Akwa Ibom"
            applicantAddress="0xc574...A578"
            description="Hi there, I'm excited about the opportunity to work on your UI/UX project. With over 4 years of experience designing intuitive and user-centered interfaces for web and mobile applications. My expertise lies in creating user-centered designs that are both aesthetically pleasing and highly functional. I am proficient in various design tools and methodologies, ensuring a seamless user experience from concept to implementation. I look forward to contributing to your team's success."
            amount="50.5 ATOM"
            date="June 20, 2025"
            skills={["Product Design", "Branding", "User Research"]}
            hiredStatus={E_HiredStatus.Pending}
          />
        </Grid>
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
