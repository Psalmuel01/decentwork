'use client';

import FreelancCalendar from '@/icons/freelance/freelance-calendar';
// import FreelancCalendar from '../icons/freelance/freelance-calendar';

export type ProjectListingComponentProps = {
  data: ProjectListingComponentType;
  jobDetailsModal: React.MutableRefObject<HTMLDivElement>;
  onViewDetails?: () => void;
};

export type ProjectListingComponentType = {
  id?: string;
  timePosted?: string; // Made optional to match Job interface
  role?: string;
  hourlyPay?: string;
  duration?: string;
  detail?: string;
  skills?: string[];
  verified?: boolean;
  funding?: string;
  applicants?: string;
  location?: string;
  status?: string;
  freelancer_address?: string;
  client_address?: string;
  payment_status?: string;
  title?: string; // Added to match Job interface
};

const ProjectListingComponent = ({
  data: {
    id,
    applicants = '0 to 5',
    detail = 'No description provided',
    duration = '1-3 weeks',
    funding = '0 AR',
    hourlyPay = '0 AR/hr',
    // location = 'Remote',
    role,
    skills = ['General'],
    timePosted = 'Recently',
    verified = true,
    status,
  },
  jobDetailsModal,
  onViewDetails,
}: ProjectListingComponentProps) => {
  // const { isConnected } = useXionWallet();

  // Use role or title for display
  const displayTitle = role || 'Untitled Job';

  const handleClick = () => {
    console.log('Job clicked:', { id, role });

    if (onViewDetails) {
      onViewDetails();
    } else {
      jobDetailsModal.current.click();
    }
  };

  return (
    <>
      <div
        onClick={handleClick}
        className="pt-5 font-circular cursor-pointer first:pt-0"
      >
        <p className="text-[#7E8082] text-sm">Posted {timePosted}</p>
        <p className="mt-2 font-medium text-lg text-[#18181B]">
          {displayTitle}
        </p>

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

        <div className="py-4 flex items-center text-[#7E8082] text-sm space-x-2">
          <p className="">Hourly {hourlyPay}</p>
          <p className="">-</p>
          <p className="">Est. Time: {duration}</p>
          {verified && (
            <div className="flex items-center px-2 py-0.5 bg-green-50 rounded-lg">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mr-1"></span>
              <span className="text-xs text-green-800">Verified</span>
            </div>
          )}
        </div>

        <p className="text-base font-normal text-[#545756] line-clamp-2">
          {detail}
        </p>

        <div className="mt-5 flex items-center space-x-3 flex-wrap gap-y-2">
          {skills &&
            skills.map((skill, index) => (
              <div
                key={index}
                className="border-[#E4E4E7] bg-[#F4F4F5] text-[#545756] rounded-full text-sm py-1 px-3"
              >
                {skill}
              </div>
            ))}
        </div>

        <div className="flex items-center space-x-6 mt-5 flex-wrap">
          <div className="flex items-center space-x-1">
            <p className="text-sm font-normal text-[#7E8082]">Funding:</p>
            <p className="text-[#545756]">{funding}</p>
          </div>

          <div className="flex items-center space-x-1">
            <p className="text-sm font-normal text-[#7E8082]">Applicants:</p>
            <p className="text-[#545756]">{applicants}</p>
          </div>

          <div className="flex items-center space-x-1">
            <FreelancCalendar />
            <p className="text-sm font-normal text-[#7E8082]">{duration}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectListingComponent;
