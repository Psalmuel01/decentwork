import { useEffect, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/context/auth-context';
import { Button } from '../../ui/button';
import { StepperFormValues } from '@/hooks/hook-stepper';
import { format } from 'date-fns';
import { ApplicationRoutes } from '@/config/routes';
import { useRouter } from 'next/navigation';
import PencilEdit from '@/icons/freelance/pencil-edit';
import UploadSuccess from '@/icons/freelance/upload-success';
import Image from 'next/image';

type SubmitDetailsProps = {
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  step: number;
  onSubmit: () => Promise<void>;
};

const SubmitDetails = ({
  setActiveStep,
  step,
  onSubmit,
}: SubmitDetailsProps) => {
  const router = useRouter();
  const successModal = useRef<HTMLDivElement>(null);
  const { setIsNewFreelanceUser } = useAuth();
  const { getValues } = useFormContext<StepperFormValues>();
  const formData = getValues();

  const isFormValid = () => {
    return (
      formData.profile_picture &&
      formData.title &&
      formData.city &&
      formData.state &&
      formData.englishFluency &&
      formData.rate &&
      formData.skills?.length > 0 &&
      formData.bio
    );
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSuccess = async () => {
    try {
      await onSubmit();
      successModal.current?.click();
      setTimeout(() => {
        setIsNewFreelanceUser(false);
        router.push(ApplicationRoutes.FREELANCER_DASHBOARD);
      }, 3000);
    } catch (error) {
      console.error('Error submitting profile:', error);
    }
  };

  return (
    <>
      <main className="mt-32 px-5 mb-36">
        <div className="max-w-screen-lg mx-auto w-full">
          <p className="font-circular font-bold text-[#7E8082]">{step - 1}/6</p>
          <h1 className="font-poppins font-semibold text-[32px] mt-1">
            <span className="text-[#7E8082]">Review your profile</span>
          </h1>

          <p className="text-[#7E8082] font-circular text-base mt-2 max-w-screen-md">
            Please review your information before submitting. You can edit any
            section by clicking the edit icon.
          </p>

          <div className="bg-white relative rounded-xl p-10 mt-9">
            <div className="flex justify-end">
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  handleSuccess();
                }}
                disabled={!isFormValid()}
                className="text-sm font-medium font-circular rounded-md text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit profile
              </Button>
            </div>

            <div className="mt-6 grid grid-cols-9 gap-x-9">
              <div className="col-span-3 flex flex-col gap-y-5">
                {/* Profile Picture Section */}
                <div className="rounded-lg items-center border border-[#E4E4E7] flex flex-col gap-y-3 p-4">
                  <div className="relative">
                    <Image
                      src={
                        formData.profile_picture instanceof File
                          ? URL.createObjectURL(formData.profile_picture)
                          : '/images/freelancer/file.svg'
                      }
                      alt="profile image"
                      className="w-32 h-full object-cover rounded-full"
                      width={100}
                      height={100}
                    />
                    <div
                      onClick={() => setActiveStep(5)}
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-white rounded-full p-1 cursor-pointer"
                    >
                      <PencilEdit className="w-4 h-4" />
                    </div>
                  </div>

                  <p className="font-medium text-[#545756] font-circular text-[24px]">
                    {formData.title || 'Your Name'}
                  </p>

                  <div className="flex space-x-2 items-center">
                    <svg
                      width="21"
                      height="20"
                      viewBox="0 0 21 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6.33398 15C4.80988 15.3431 3.83398 15.8703 3.83398 16.4614C3.83398 17.4953 6.81875 18.3333 10.5007 18.3333C14.1826 18.3333 17.1673 17.4953 17.1673 16.4614C17.1673 15.8703 16.1914 15.3431 14.6673 15"
                        stroke="#7E8082"
                        strokeWidth="1.25"
                        strokeLinecap="round"
                      />
                      <path
                        d="M12.5827 7.49996C12.5827 8.65054 11.6499 9.58329 10.4993 9.58329C9.34877 9.58329 8.41602 8.65054 8.41602 7.49996C8.41602 6.34937 9.34877 5.41663 10.4993 5.41663C11.6499 5.41663 12.5827 6.34937 12.5827 7.49996Z"
                        stroke="#7E8082"
                        strokeWidth="1.25"
                      />
                      <path
                        d="M11.5472 14.578C11.2661 14.8486 10.8904 15 10.4995 15C10.1085 15 9.73285 14.8486 9.45177 14.578C6.87793 12.084 3.42867 9.29788 5.11077 5.25307C6.02027 3.06606 8.20347 1.66663 10.4995 1.66663C12.7955 1.66663 14.9787 3.06607 15.8882 5.25307C17.5682 9.29279 14.1273 12.0925 11.5472 14.578Z"
                        stroke="#7E8082"
                        strokeWidth="1.25"
                      />
                    </svg>
                    <p className="text-[#7E8082] text-sm">
                      {formData.city}, {formData.state}
                    </p>
                  </div>
                </div>

                {/* Language Section */}
                <div className="rounded-lg border border-[#E4E4E7] p-4">
                  <div className="flex justify-between mb-2 items-center">
                    <p className="font-medium text-[#545756] text-base font-circular">
                      Language
                    </p>
                    <div
                      onClick={() => setActiveStep(3)}
                      className="cursor-pointer"
                    >
                      <PencilEdit className="w-4 h-4" />
                    </div>
                  </div>
                  <span className="text-[#7E8082] text-sm font-circular">
                    <span className="text-[#545756]">English:</span>{' '}
                    {formData.englishFluency || 'Not specified'}
                  </span>
                </div>

                {/* Rate Section */}
                <div className="rounded-lg border border-[#E4E4E7] p-4">
                  <div className="flex justify-between mb-2 items-center">
                    <p className="font-medium text-[#545756] font-circular text-lg">
                      {formData.rate || 0} XION
                    </p>
                    <div
                      onClick={() => setActiveStep(4)}
                      className="cursor-pointer"
                    >
                      <PencilEdit className="w-4 h-4" />
                    </div>
                  </div>
                  <span className="text-[#7E8082] text-sm font-circular">
                    Hourly rate
                  </span>
                </div>

                {/* Contact Information */}
                <div className="rounded-lg border border-[#E4E4E7] p-4">
                  <div className="flex justify-between mb-2 items-center">
                    <p className="font-medium text-[#545756] text-base font-circular">
                      Contact Information
                    </p>
                    <div
                      onClick={() => setActiveStep(5)}
                      className="cursor-pointer"
                    >
                      <PencilEdit className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-[#7E8082] text-sm font-circular space-y-1">
                    <p>Phone: {formData.phone || 'Not specified'}</p>
                    <p>Address: {formData.address || 'Not specified'}</p>
                    <p>Country: {formData.country || 'Not specified'}</p>
                    <p>
                      Date of Birth:{' '}
                      {formData.date_of_birth
                        ? format(formData.date_of_birth, 'PPP')
                        : 'Not specified'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-span-6">
                {/* Work Type Section */}
                <div className="hidden rounded-lg border border-[#E4E4E7] p-4">
                  <div className="flex justify-between mb-2 items-center">
                    <p className="font-medium text-[#545756] font-circular text-lg">
                      Work Type
                    </p>
                    <div
                      onClick={() => setActiveStep(1)}
                      className="cursor-pointer"
                    >
                      <PencilEdit className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-[#7E8082] text-sm font-circular space-y-1">
                    <p>Category: {formData.category || 'Not specified'}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.specialities?.map((speciality, index) => (
                        <span
                          key={index}
                          className="bg-[#F4F4F5] text-[#545756] px-3 py-1 rounded-full text-sm"
                        >
                          {speciality}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Skills Section */}
                <div className="rounded-lg border border-[#E4E4E7] p-4">
                  <div className="flex justify-between mb-2 items-center">
                    <p className="font-medium text-[#545756] font-circular text-lg">
                      Skills
                    </p>
                    <div
                      onClick={() => setActiveStep(2)}
                      className="cursor-pointer"
                    >
                      <PencilEdit className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.skills?.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-[#F4F4F5] text-[#545756] px-3 py-1 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bio Section */}
                <div className="mt-4">
                  <div className="flex mb-6 justify-between items-center">
                    <p className="font-medium text-[#545756] font-circular text-[20px]">
                      {formData.title || 'Your Title'}
                    </p>
                    <div
                      onClick={() => setActiveStep(3)}
                      className="cursor-pointer"
                    >
                      <PencilEdit className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-base font-circular text-[#7E8082]">
                    <p>{formData.bio || 'No bio provided'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Dialog>
        <DialogTrigger asChild>
          <div ref={successModal} className="hidden">
            Submit Profile
          </div>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px] bg-white">
          <div className="flex flex-col items-center">
            <UploadSuccess className="scale-75" />
            <p className="text-[20px] font-poppins font-semibold text-[#18181B] mt-5">
              Profile Created Successfully!
            </p>
            <div className="max-w-80">
              <p className="font-circular text-[#545756] text-base text-center mt-5">
                Your profile has been created successfully. You can now start
                applying for jobs!
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SubmitDetails;
