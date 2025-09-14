import FreelancCalendar from '@/icons/freelance/freelance-calendar';
import { Button } from '../ui/button';

type ActiveJobCardProps = {
  terminateContract: React.MutableRefObject<HTMLDivElement>;
  completeJobModal?: React.MutableRefObject<HTMLDivElement>;
  jobId?: string;
  jobData?: {
    title: string;
    amount: string;
    duration: string;
    status?: string;
  };
  showCompleteButton?: boolean;
};

const ActiveJobCard = ({
  terminateContract,
  completeJobModal,
  jobId = '1',
  jobData = {
    title: 'Web Designer - UIUX Role',
    amount: '50.5',
    duration: '1 - 2 weeks',
    status: 'in_progress',
  },
  showCompleteButton = true,
}: ActiveJobCardProps) => {
  const isCompleted = jobData.status === 'completed';

  return (
    <div className="mb-6">
      <div className="flex space-x-3">
        <div className="h-8 rounded-full w-8 bg-primary flex items-center justify-center text-white font-poppins text-[24px] font-semibold">
          A
        </div>

        <div className="w-full">
          <div className="flex justify-between items-center font-circular space-x-5 w-full">
            <p className="text-sm text-[#545756]">{jobData.title}</p>
            <span className="text-[#7E8082] text-sm ">
              <span className="text-[#18181B]">{jobData.amount}</span> XION
            </span>
          </div>

          <div className="flex items-center space-x-5 font-circular text-sm mt-4">
            <div className="flex items-center space-x-1">
              <FreelancCalendar />
              <p className="font-circular text-[#7E8082] text-sm">
                {jobData.duration}
              </p>
            </div>

            <p className="text-[#7E8082] text-xs">Now</p>

            <div className="flex items-center space-x-1">
              <span
                className={`h-1 w-1 ${
                  isCompleted ? 'bg-purple-500' : 'bg-[#2ECC71]'
                } block rounded-full`}
              ></span>
              <p
                className={`${
                  isCompleted ? 'text-purple-500' : 'text-[#2ECC71]'
                } text-sm`}
              >
                {isCompleted ? 'Completed' : 'Active'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {!isCompleted && (
        <div className="flex items-center space-x-5 font-circular text-sm mt-4">
          <Button
            onClick={() => {
              terminateContract.current?.click();
            }}
            className="w-1/2 bg-white hover:bg-white rounded-full focus:bg-white border-[#FB822F] text-[#FB822F] border"
            data-job-id={jobId}
          >
            Terminate
          </Button>

          {showCompleteButton && completeJobModal && (
            <Button
              onClick={() => {
                completeJobModal.current?.click();
              }}
              className="w-1/2 bg-green-50 hover:bg-green-100 rounded-full focus:bg-green-50 text-green-600 border-green-300 border"
              data-job-id={jobId}
            >
              Complete
            </Button>
          )}
        </div>
      )}

      {isCompleted && (
        <div className="flex items-center space-x-5 font-circular text-sm mt-4">
          <p className="w-full text-center text-purple-500 py-2">
            Job completed successfully
          </p>
        </div>
      )}
    </div>
  );
};

export default ActiveJobCard;
