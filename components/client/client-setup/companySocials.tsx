import { useFormContext } from 'react-hook-form';
import { StepperFormValues } from '@/hooks/hook-stepper';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../ui/form';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { LucideChevronLeft, LucideChevronRight } from 'lucide-react';
import { useEffect } from 'react';

type CompanySocialsProps = {
  handleBack: () => void;
  handleNext: () => void;
  step: number;
};

const CompanySocials = ({
  handleBack,
  handleNext,
  step,
}: CompanySocialsProps) => {
  const {
    control,
    // formState: { errors },
    // register,
    watch,
    setValue,
  } = useFormContext<StepperFormValues>();

  const isVoluntary = watch('isVoluntary');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (isVoluntary) {
      setValue('rate', 0);
    }
  }, [isVoluntary, setValue]);

  return (
    <>
      <main className="mt-12 lg:px-5">
        <div className="max-w-screen-lg mx-auto w-full">
          <p className="font-circular font-bold text-[#7E8082]">{step - 1}/5</p>

          <h1 className="font-poppins font-semibold text-[24px] mt-1">
            <span className="text-[#7E8082]">Show them who you are! </span>Show
            Off Your Online Footprint
          </h1>

          <p className="text-[#7E8082] font-circular text-[14px] max-w-screen-md">
            Add a contact person from your team so we know who to talk to when
            it matters.
          </p>

          <div className="bg-white relative rounded-xl px-3 py-5 lg:p-10 mt-9 font-circular ">
            <FormField
              control={control}
              name="title"
              render={({ field }) => (
                <FormItem className="mb-[20px]">
                  <FormLabel className="text-[#545756] font-circular">
                    Company website
                  </FormLabel>

                  <FormControl>
                    <Input
                      className="h-12 bg-white placeholder:font-circular border-gray-300 font-circular placeholder:text-[#BEBEBE]"
                      placeholder="Enter company website"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs font-circular font-normal" />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="title"
              render={({ field }) => (
                <FormItem className="mb-[20px]">
                  <FormLabel className="text-[#545756] font-circular">
                    Linkedin page
                  </FormLabel>

                  <FormControl>
                    <Input
                      className="h-12 bg-white placeholder:font-circular border-gray-300 font-circular placeholder:text-[#BEBEBE]"
                      placeholder="Enter linkedin link"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs font-circular font-normal" />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="title"
              render={({ field }) => (
                <FormItem className="mb-[20px]">
                  <FormLabel className="text-[#545756] font-circular">
                    Other social media (optional)
                  </FormLabel>

                  <FormControl>
                    <Input
                      className="h-12 bg-white placeholder:font-circular border-gray-300 font-circular placeholder:text-[#BEBEBE]"
                      placeholder="Enter other social media link"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs font-circular font-normal" />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-end bottom-5 right-5 font-circular font-medium space-x-3 mt-6 lg:mt-12">
              <Button
                onClick={handleBack}
                className="flex flex-1 lg:flex-0 h-[48px] hover:bg-white/80 items-center space-x-3 text-primary bg-transparent border border-primary"
              >
                <LucideChevronLeft />
                <p className="">Back</p>
              </Button>

              <Button
                onClick={handleNext}
                className="flex flex-1 lg:flex-0 h-[48px] items-center space-x-3 bg-primary text-white"
              >
                <p className="">Next</p>
                <LucideChevronRight />
              </Button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default CompanySocials;
