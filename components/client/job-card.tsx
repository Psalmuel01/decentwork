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
  projectid?: string;
  title?: string;
  description?: string;
  budget?: string;
  status?: string;
  category?: string;
  skills?: string[];
  timeline?: string;
  createdAt?: string;
  clientid?: string;
  // Legacy fields for backwards compatibility
  applicants?: string;
  detail?: string;
  duration?: string;
  funding?: string;
  hourlyPay?: string;
  location?: string;
  role?: string;
  timePosted?: string;
  verified?: boolean;
  freelancer_address?: string;
  payment_status?: string;
  proposalCount?: number;
  proposals?: any[];
};

type PostJobCardComponentProps = {
  data: PostJobCardComponentType;
  // editJob: React.MutableRefObject<HTMLDivElement>;
  onSelectForPayment?: (project: object) => void;
  getProposalCount?: (projectId: string) => number;
};

const PostJobCard = ({
  data: {
    id,
    projectid,
    title,
    description,
    budget,
    status,
    category,
    skills,
    timeline,
    createdAt,
    clientid,
    proposals,
    // Legacy fields fallback
    detail,
    duration,
    funding,
    hourlyPay,
    location,
    role,
    timePosted,
    verified = true,
    freelancer_address,
    proposalCount: initialProposalCount = 0,
  },
  // editJob,
  onSelectForPayment,
  getProposalCount,
}: PostJobCardComponentProps) => {
  // Use new fields with fallback to legacy fields
  const projectTitle = title || role || 'Untitled Project';
  const projectDescription =
    description || detail || 'No description available';
  const projectBudget = budget || funding || '0';
  const projectDuration = timeline || duration || 'Not specified';
  const projectStatus = status || 'open';
  const projectSkills = skills || [];
  const projectId = projectid || id;
  const postedTime = createdAt || timePosted || 'Recently';

  // Check if the project has a freelancer assigned and is in progress
  const showPaymentOption =
    projectStatus === 'in_progress' && freelancer_address;
  const viewProposalsRef = useRef<HTMLDivElement>(null);
  const [currentProjectId, setCurrentProjectId] = useState<string>(projectId);
  const [proposalCount, setProposalCount] = useState<number>(
    proposals?.length || initialProposalCount || 0,
  );

  // Update proposal count when getProposalCount is provided
  useEffect(() => {
    if (projectId && getProposalCount) {
      const count = getProposalCount(projectId);
      setProposalCount(count);
    } else if (proposals) {
      setProposalCount(proposals.length);
    }
  }, [projectId, getProposalCount, proposals]);

  const handlePayment = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSelectForPayment) {
      onSelectForPayment({
        projectid: projectId,
        id: projectId,
        title: projectTitle,
        budget: projectBudget.replace(/[^0-9.]/g, ''), // Extract numeric value
        freelancer_address,
        status: projectStatus,
      });
    }
  };

  // Format the posted time
  const formatPostedTime = (dateString: string) => {
    if (!dateString || dateString === 'Recently') return 'Recently';

    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInDays = Math.floor(
        (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (diffInDays === 0) return 'Today';
      if (diffInDays === 1) return 'Yesterday';
      if (diffInDays < 7) return `${diffInDays} days ago`;
      if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
      return `${Math.floor(diffInDays / 30)} months ago`;
    } catch {
      return dateString;
    }
  };

  // Get status display
  const getStatusDisplay = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'open':
      case 'active':
        return { label: 'Open', class: 'bg-blue-100 text-blue-700' };
      case 'in_progress':
      case 'ongoing':
        return { label: 'In Progress', class: 'bg-green-100 text-green-700' };
      case 'completed':
        return { label: 'Completed', class: 'bg-gray-100 text-gray-700' };
      case 'closed':
        return { label: 'Closed', class: 'bg-red-100 text-red-700' };
      default:
        return { label: 'Open', class: 'bg-blue-100 text-blue-700' };
    }
  };

  const statusDisplay = getStatusDisplay(projectStatus);

  return (
    <>
      <div
        // onClick={() => {
        //   editJob.current?.click();
        // }}
        className="pt-5 font-circular first:pt-0 cursor-pointer hover:bg-gray-50 rounded-lg p-4 transition-colors"
      >
        <div className="flex justify-between">
          <div className="flex-1">
            <p className="text-[#7E8082] text-sm">
              Posted {formatPostedTime(postedTime)}
            </p>

            <p className="mt-2 font-medium text-lg text-[#18181B]">
              {projectTitle}
            </p>

            <div className="flex items-center gap-2 mt-1">
              <span
                className={`text-xs px-2 py-1 rounded-full ${statusDisplay.class}`}
              >
                {statusDisplay.label}
              </span>

              {category && (
                <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700">
                  {category}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {showPaymentOption && (
              <Button
                onClick={handlePayment}
                size="sm"
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                Pay Freelancer
              </Button>
            )}

            {(projectStatus === 'open' || projectStatus === 'active') && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentProjectId(projectId);
                  viewProposalsRef.current?.click();
                }}
                size="sm"
                className="bg-primary hover:bg-primary/90 text-white"
              >
                View Proposals {proposalCount > 0 ? `(${proposalCount})` : ''}
              </Button>
            )}

            <svg
              className="cursor-pointer hover:opacity-70"
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
          {projectDescription}
        </p>

        <div className="flex items-center space-x-2 mt-3 flex-wrap gap-2">
          {projectSkills.map((skill, key) => (
            <div
              key={key}
              className="border border-[#E4E4E7] bg-[#F4F4F5] py-1 px-3 text-sm text-[#545756] rounded-full"
            >
              {skill}
            </div>
          ))}
        </div>

        <div className="flex items-center space-x-5 mt-4 -ml-0.5 flex-wrap gap-2">
          <div className="flex items-center space-x-1">
            <FreelancCalendar />
            <p className="font-circular text-[#7E8082] text-sm">
              Budget: ${projectBudget}
            </p>
          </div>

          <div className="flex items-center space-x-1">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 1.5L9.09 5.26L10.91 1.91L11.09 5.74L13.5 3.5L12.26 6.91L15.5 8L11.74 9.09L14.09 10.91L10.26 11.09L12.5 13.5L9.09 12.26L8 15.5L6.91 11.74L5.09 14.09L4.91 10.26L2.5 12.5L3.74 9.09L0.5 8L4.26 6.91L1.91 5.09L5.74 4.91L3.5 2.5L6.91 3.74L8 1.5Z"
                fill="#7E8082"
              />
            </svg>
            <p className="text-[#7E8082] text-sm">
              Duration: {projectDuration}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-5 font-circular text-sm mt-2 flex-wrap gap-3">
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
              Budget {verified ? 'verified' : 'not verified'}
            </p>
          </div>

          <div className="flex items-center space-x-1">
            <p className="text-sm font-normal text-[#7E8082]">Proposals:</p>
            <p className="text-[#545756]">
              {proposalCount > 0 ? proposalCount : 'No'}{' '}
              {proposalCount === 1 ? 'proposal' : 'proposals'}
            </p>
          </div>

          {location && (
            <div className="flex items-center space-x-1">
              <LocationIcon />
              <p className="text-sm font-normal text-[#7E8082]">{location}</p>
            </div>
          )}
        </div>

        {freelancer_address && (
          <div className="mt-3 ml-1">
            <div className="flex items-center space-x-1">
              <p className="text-sm font-normal text-[#7E8082]">Assigned to:</p>
              <p className="text-[#545756] font-mono text-xs">
                {freelancer_address.substring(0, 12)}...
              </p>
            </div>
          </div>
        )}

        {clientid && (
          <div className="mt-1 ml-1">
            <div className="flex items-center space-x-1">
              <p className="text-sm font-normal text-[#7E8082]">Project ID:</p>
              <p className="text-[#545756] font-mono text-xs">#{projectId}</p>
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
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto bg-white">
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <h3 className="font-semibold text-lg">
                  Proposals for: {projectTitle}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Project ID: #{projectId}
                </p>
              </div>
              <span
                className={`text-xs px-3 py-1 rounded-full ${statusDisplay.class}`}
              >
                {statusDisplay.label}
              </span>
            </div>

            {projectDescription && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Project Description:</strong> {projectDescription}
                </p>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                  <span>Budget: ${projectBudget}</span>
                  <span>Duration: {projectDuration}</span>
                  {category && <span>Category: {category}</span>}
                </div>
              </div>
            )}

            {currentProjectId && (
              <ProposalsList
                jobId={parseInt(currentProjectId)}
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

            <div className="flex justify-end pt-4 border-t">
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
