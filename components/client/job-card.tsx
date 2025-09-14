'use client';

import { Button } from '../ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from '../ui/dialog';
import { useEffect, useRef, useState } from 'react';
import ProposalsList from './proposals-list';
import FreelancCalendar from '@/icons/freelance/freelance-calendar';
import LocationIcon from '@/icons/freelance/location-icon';

export type PostJobCardComponentType = {
  id: string;
  applicants?: string;
  detail?: string;
  duration?: string;
  funding?: string;
  hourlyPay?: string;
  location?: string;
  role?: string;
  skills?: string[];
  timePosted?: string;
  verified?: boolean;
  status?: string;
  freelancer_address?: string;
  payment_status?: string;
  title?: string;
  proposalCount?: number;
};

type PostJobCardComponentProps = {
  data: PostJobCardComponentType;
  editJob: React.MutableRefObject<HTMLDivElement>;
  onSelectForPayment?: (job: object) => void;
  getProposalCount?: (jobId: string) => Promise<number>;
};

const PostJobCard = ({
  data: {
    id,
    detail,
    duration,
    funding,
    hourlyPay,
    location,
    role,
    skills,
    timePosted,
    verified,
    status,
    freelancer_address,
    proposalCount: initialProposalCount = 0,
  },
  editJob,
  onSelectForPayment,
  getProposalCount,
}: PostJobCardComponentProps) => {
  // Check if the job has a freelancer assigned and is in progress
  const showPaymentOption = status === 'in_progress' && freelancer_address;
  const viewProposalsRef = useRef<HTMLDivElement>(null);
  const [jobId, setJobId] = useState<string>(id);
  const [proposalCount, setProposalCount] =
    useState<number>(initialProposalCount);

  // Fetch real proposal count if getProposalCount is provided
  useEffect(() => {
    const fetchProposalCount = async () => {
      if (id && getProposalCount) {
        try {
          const count = await getProposalCount(id);
          setProposalCount(count);
        } catch (err) {
          console.error('Error fetching proposals count:', err);
        }
      }
    };

    if (status === 'open') {
      fetchProposalCount();
    }
  }, [id, status, getProposalCount]);

  const handlePayment = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the parent onClick
    if (onSelectForPayment) {
      onSelectForPayment({
        id,
        title: role,
        budget: funding?.replace(' XION', ''), // Extract numeric value
        freelancer_address,
        status,
      });
    }
  };

  return (
    <>
      <div
        onClick={() => {
          editJob.current?.click();
        }}
        className="pt-5 font-circular first:pt-0"
      >
        <div className="flex justify-between">
          <div className="">
            <p className="text-[#7E8082]  text-sm">Posted {timePosted}</p>

            <p className="mt-2 font-medium text-lg text-[#18181B]">{role}</p>
            {status && (
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  status === 'open'
                    ? 'bg-blue-100 text-blue-700'
                    : status === 'in_progress'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                }`}
              >
                {status === 'in_progress'
                  ? 'In Progress'
                  : status === 'open'
                    ? 'Open'
                    : status === 'completed'
                      ? 'Completed'
                      : status}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {showPaymentOption && (
              <Button
                onClick={handlePayment}
                size="sm"
                className="mr-2 bg-green-500 hover:bg-green-600 text-white"
              >
                Pay Freelancer
              </Button>
            )}

            {status === 'open' && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  setJobId(id);
                  viewProposalsRef.current?.click();
                }}
                size="sm"
                className="mr-2 bg-primary hover:bg-primary/90 text-white"
              >
                View Proposals {proposalCount > 0 ? `(${proposalCount})` : ''}
              </Button>
            )}

            <svg
              className="cursor-pointer"
              width="44"
              height="44"
              viewBox="0 0 44 44"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                opacity="0.05"
                width="44"
                height="44"
                rx="22"
                fill="#7E8082"
              />
              <path
                d="M29.5 21.5V28.5C29.5 29.0304 29.2893 29.5391 28.9142 29.9142C28.5391 30.2893 28.0304 30.5 27.5 30.5H16.5C15.9696 30.5 15.4609 30.2893 15.0858 29.9142C14.7107 29.5391 14.5 29.0304 14.5 28.5V17.5C14.5 16.9696 14.7107 16.4609 15.0858 16.0858C15.4609 15.7107 15.9696 15.5 16.5 15.5H23.5"
                stroke="#7E8082"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M27.5 13.5L30.5 16.5L22.5 24.5H19.5V21.5L27.5 13.5Z"
                stroke="#7E8082"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <p className="max-w-full text-base text-[#545756] mt-3 line-clamp-2">
          {detail}
        </p>

        <div className="flex items-center space-x-4 mt-3">
          {skills?.map((skill, key) => (
            <div
              key={key}
              className="border border-[#E4E4E7] bg-[#F4F4F5] py-1 px-4 text-[#545756] rounded-full"
            >
              {skill}
            </div>
          ))}
        </div>

        <div className="flex items-center space-x-5 mt-4 -ml-0.5">
          <div className="flex items-center space-x-1">
            <FreelancCalendar />
            <p className="font-circular text-[#7E8082] text-sm">
              Hourly: {hourlyPay}
            </p>
          </div>

          <p className="text-[#7E8082] text-sm">
            <span className="">Duration: {duration}</span>
          </p>
        </div>

        <div className="flex items-center space-x-5 font-circular text-sm mt-2">
          <div className="flex items-center space-x-1">
            <svg
              className="stroke-1"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="8"
                cy="8"
                r="6"
                stroke={verified ? '#1A73E8' : '#FF5733'}
                fill={verified ? '#1A73E8' : '#FF5733'}
                opacity="0.1"
              />
              <circle
                cx="8"
                cy="8"
                r="3.5"
                stroke={verified ? '#1A73E8' : '#FF5733'}
                fill={verified ? '#1A73E8' : '#FF5733'}
              />
            </svg>
            <p className="text-sm font-normal text-[#7E8082]">
              Funds {verified ? 'verified' : 'not verified'}
            </p>
          </div>

          <div className="flex items-center space-x-1">
            <p className="text-sm font-normal text-[#7E8082]">Funding:</p>
            <p className="text-[#545756]">{funding}</p>
          </div>

          <div className="flex items-center space-x-1">
            <p className="text-sm font-normal text-[#7E8082]">Applicants:</p>
            <p className="text-[#545756]">
              {proposalCount > 0 ? proposalCount : 'No'}{' '}
              {proposalCount === 1 ? 'proposal' : 'proposals'}
            </p>
          </div>

          <div className="flex items-center space-x-1">
            <LocationIcon />
            <p className="text-sm font-normal text-[#7E8082]">{location}</p>
          </div>
        </div>

        {freelancer_address && (
          <div className="mt-3 ml-1">
            <div className="flex items-center space-x-1">
              <p className="text-sm font-normal text-[#7E8082]">Assigned to:</p>
              <p className="text-[#545756]">
                {freelancer_address.substring(0, 12)}...
              </p>
            </div>
          </div>
        )}
      </div>

      {/* View Proposals Dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <div ref={viewProposalsRef} className="hidden">
            View Proposals
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto bg-white">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-lg">
                Proposals for: {role || 'Job'}
              </h3>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  status === 'open'
                    ? 'bg-blue-100 text-blue-700'
                    : status === 'in_progress'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                }`}
              >
                {status === 'in_progress'
                  ? 'In Progress'
                  : status === 'open'
                    ? 'Open'
                    : status === 'completed'
                      ? 'Completed'
                      : status || 'Open'}
              </span>
            </div>

            {jobId && (
              <ProposalsList
                jobId={parseInt(jobId)}
                onProposalAccepted={() => {
                  // Close the dialog and refresh the page after proposal is accepted
                  const closeButton = document.querySelector(
                    '[data-radix-dialog-close]',
                  ) as HTMLElement;
                  closeButton?.click();
                  setTimeout(() => window.location.reload(), 500);
                }}
              />
            )}

            <div className="flex justify-end pt-4">
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PostJobCard;
