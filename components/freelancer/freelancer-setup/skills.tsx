'use client';

import { useFormContext } from 'react-hook-form';
import { StepperFormValues } from '@/hooks/hook-stepper';
import {
  LucideChevronLeft,
  LucideChevronRight,
  LucidePlus,
} from 'lucide-react';
import { Button } from '../../ui/button';
import { useEffect, useState } from 'react';
import { MultiSelector } from '@/components/ui/multi-select';
// import { MultiSelector } from '../../ui/multi-select';

type SkillsDetailsProps = {
  handleBack: () => void;
  handleNext: () => void;
  step: number;
};

const dummySkills = [
  'Branding',
  'Product Design',
  'Web Developer',
  'Business Presentation',
  'Blockchain Analyst',
  'Electrical Engineer',
  'Animation',
  'Software Developer',
  'Marketing',
];

const SkillsDetails = ({
  handleBack,
  handleNext,
  step,
}: SkillsDetailsProps) => {
  const { setValue, getValues } = useFormContext<StepperFormValues>();
  const [selectedSkills, setSelectedSkills] = useState<string[]>(() => {
    // Initialize from form context if available
    return getValues('skills') || [];
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    // Update form value when selectedSkills changes
    setValue('skills', selectedSkills, { shouldValidate: true });
  }, [selectedSkills, setValue]);

  const handleAddSkill = (skill: string) => {
    if (selectedSkills.length >= 5) return;
    if (!selectedSkills.includes(skill)) {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ensure skills are saved before proceeding
    setValue('skills', selectedSkills, { shouldValidate: true });
    handleNext();
  };

  return (
    <>
      <div className="mt-12 lg:px-5 mb-36">
        <div className="max-w-screen-lg mx-auto w-full">
          <p className="font-circular font-bold text-[#7E8082]">{step}/5</p>

          <h1 className="font-poppins font-semibold text-2xl mt-1">
            <span className="text-[#7E8082]">Almost there!</span> What work are
            you here to do?
          </h1>

          <div className="text-[#7E8082] font-circular mt-2">
            Your skills show clients what you can do and help us suggest the
            best jobs for you.{' '}
            <span className="text-[#545756]">
              Add, remove, or search for skills.
            </span>{' '}
            It&apos;s your choice!
          </div>

          <form onSubmit={handleFormSubmit}>
            <div className="bg-white relative rounded-xl py-5 px-3 lg:px-10 lg:py-10 mt-9 lg:pb-20">
              <div className="w-full">
                <MultiSelector
                  selected={selectedSkills}
                  onChange={setSelectedSkills}
                  maxSelections={5}
                />
              </div>

              <div className="mt-6">
                <p className="text-base font-circular text-[#545756]">
                  Suggested skills
                </p>

                <div className="flex flex-wrap w-full mt-6 gap-4">
                  {dummySkills.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => handleAddSkill(skill)}
                      disabled={selectedSkills.length >= 5}
                      className={`rounded-full flex items-center space-x-1 lg:space-x-2 cursor-pointer transition-colors font-circular text-base ${
                        selectedSkills.includes(skill)
                          ? 'bg-primary text-white'
                          : 'text-[#545756] hover:text-primary border border-gray-200'
                      } py-2 px-4`}
                    >
                      {!selectedSkills.includes(skill) && (
                        <LucidePlus size={20} />
                      )}
                      <p>{skill}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-[30px] lg:mt-0 lg:absolute flex items-center bottom-5 right-5 font-circular font-medium space-x-3">
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    handleBack();
                  }}
                  className="flex flex-1 lg:flex-0 h-[48px] hover:bg-white/80 items-center space-x-3 text-primary bg-transparent border border-primary"
                >
                  <LucideChevronLeft />
                  <p className="">Back</p>
                </Button>

                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    handleNext();
                  }}
                  className="flex flex-1 lg:flex-0 h-[48px] items-center space-x-3 bg-primary text-white"
                >
                  <p className="">Next</p>
                  <LucideChevronRight />
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default SkillsDetails;
