'use client';

import { StepperFormValues } from '@/hooks/hook-stepper';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../ui/form';
import { useFormContext } from 'react-hook-form';
import {
  LucideChevronLeft,
  LucideChevronRight,
  LucidePlus,
} from 'lucide-react';
import { Button } from '../../ui/button';
import { useEffect } from 'react';
import { Text } from '@radix-ui/themes';

type LanguageDetailsProps = {
  handleBack: () => void;
  handleNext: () => void;
  step: number;
};

const LanguageDetails = ({
  handleBack,
  handleNext,
  step,
}: LanguageDetailsProps) => {
  const {
    control,
    // formState: { errors },
    // register,
  } = useFormContext<StepperFormValues>();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <main className="mt-12 lg:px-5 mb-36">
        <div className="max-w-screen-lg mx-auto w-full">
          <p className="font-circular font-bold text-[#7E8082]">{step}/5</p>

          <h1 className="font-poppins font-semibold text-[24px] mt-1">
            <span className="text-[#7E8082]">Looking good! </span> Now, tell us
            which languages you speak.
          </h1>

          <p className="text-[#7E8082] font-circular text-[14px] mt-2 max-w-screen-md">
            Clients on DecentWork often look for multilingual talent. English is
            a must, do you know any others?
          </p>

          <div className="bg-background relative rounded-xl  lg:py-10 lg:px-10 px-3 py-5 mt-9 space-y-8">
            <div className="w-full flex-col md:flex-row flex justify-between items-baseline">
              <div className="flex font-circular flex-col gap-y-1 lg:gap-y-3">
                <Text weight={'medium'}>Language</Text>
                <Text className="" color={'gray'}>
                  English (is included on all profiles)
                </Text>
              </div>

              <div className="w-full md:w-max">
                <FormField
                  control={control}
                  name="englishFluency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#545756] text-base font-normal font-circular mt-[20px] lg:mt-0 font-medium">
                        Fluency
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-transparent w-full md:min-w-44 placeholder:font-circular border-gray-300 font-circular placeholder:text-[#BEBEBE] !h-12">
                            <SelectValue
                              className="placeholder:font-circular border-gray-300 font-circular placeholder:text-[#BEBEBE]"
                              placeholder="My level"
                            />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent className="bg-white text-[#545756]">
                          <SelectItem value="fluent">Fluent</SelectItem>
                          <SelectItem value="proficient">Proficient</SelectItem>
                        </SelectContent>
                      </Select>

                      <FormMessage className="text-xs font-circular font-normal" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex w-max text-[#2ECC71] space-x-2 items-center">
              <LucidePlus size={20} className="" />
              <p className="font-circular text-base">Add language</p>
            </div>

            <div className="flex items-center lg:justify-end mt-20">
              <div className=" flex items-center w-full lg:w-max font-circular font-medium space-x-3">
                <Button
                  onClick={handleBack}
                  className="flex flex-1 lg:flex-0 h-[48px] hover:bg-white/80 items-center space-x-1 lg:space-x-3 text-primary bg-transparent border border-primary"
                >
                  <LucideChevronLeft />
                  <p className="">Back</p>
                </Button>

                <Button
                  onClick={handleNext}
                  className="flex flex-1 lg:flex-0 h-[48px] items-center space-x-1 lg:space-x-3 bg-primary text-white"
                >
                  <p className="">Next</p>
                  <LucideChevronRight />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default LanguageDetails;
