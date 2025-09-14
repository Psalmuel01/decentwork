import { useFormContext } from 'react-hook-form';
import { StepperFormValues } from '@/hooks/hook-stepper';
import { FormControl, FormField, FormItem, FormMessage } from '../../ui/form';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { LucideChevronLeft, LucideChevronRight } from 'lucide-react';
import { useEffect } from 'react';

type RateDetailsProps = {
  handleBack: () => void;
  handleNext: () => void;
  step: number;
};

const RateDetails = ({ handleBack, handleNext, step }: RateDetailsProps) => {
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
          <p className="font-circular font-bold text-[#7E8082]">{step}/5</p>

          <h1 className="font-poppins font-semibold text-[32px] mt-1">
            <span className="text-[#7E8082]">Now </span>set your hourly rate
          </h1>

          <p className="text-[#7E8082] font-circular text-base mt-2 max-w-screen-md">
            Your hourly rate will be visible to clients on your profile and in
            search results once published. You can update it each time you
            submit a proposal to match the project&apos;s needs.{' '}
          </p>

          <div className="bg-white relative rounded-xl px-3 py-5 lg:py-10 lg:px-10 mt-9 font-circular ">
            {!isVoluntary && (
              <>
                <div className="flex lg:items-center flex-col md:flex-row justify-between border-b border-gray-200 pb-6 w-full">
                  <div className="flex flex-col mb-2 lg:mb-0">
                    <p className="text-[#18181B] text-lg font-medium text-[14px]">
                      Hourly rate
                    </p>
                    <p className="text-[#7E8082] lg:mt-2 text-[12px]">
                      Total amount the client will see.
                    </p>
                  </div>

                  <div className="flex flex-col gap-y-2 ">
                    <FormField
                      control={control}
                      name="rate"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative ">
                              <Input
                                className="w-full lg:w-56 h-12 bg-white text-[#7E8082] pr-24 text-base border-gray-300 font-circular placeholder:text-[#BEBEBE]"
                                placeholder="0.0"
                                type="number"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                              />
                              <p className="h-12 leading-[48px] absolute right-2 top-1/2 -translate-y-1/2 w-20 text-center text-sm text-muted-foreground border-l">
                                <span className="">ATOM</span>/hr
                              </p>
                            </div>
                          </FormControl>
                          <FormMessage className="text-xs font-circular font-normal" />
                        </FormItem>
                      )}
                    />

                    <div className="flex text-sm items-center justify-end space-x-2">
                      <p className=" text-[#FB822F] mr-3">Service fee:</p>
                      <p className="text-[#7E8082] font-medium">0.00</p>
                      <p className="">ATOM/hr</p>
                    </div>
                  </div>
                </div>

                <div className="flex lg:items-center flex-col md:flex-row justify-between pt-6">
                  <div className="flex flex-col mb-2 lg:mb-0">
                    <p className="text-[#18181B] text-lg font-medium text-[14px]">
                      You&apos;ll receive
                    </p>
                    <p className="text-[#7E8082] text-[12px] lg:mt-2">
                      The estimated amount after the platform fee is deducted.
                    </p>
                  </div>

                  <div className="flex flex-col gap-y-2 ">
                    <FormField
                      control={control}
                      name="rate"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative ">
                              <Input
                                disabled
                                className="w-full lg:w-56 h-12 bg-white disabled:bg-gray-200 text-[#7E8082] pr-24 text-base border-gray-300 font-circular placeholder:text-[#BEBEBE]"
                                placeholder="0.0"
                                {...field}
                              />
                              <p className="h-12 leading-[48px] absolute right-2 top-1/2 -translate-y-1/2 w-20 text-center text-sm text-muted-foreground border-l">
                                <span className="">ATOM</span>/hr
                              </p>
                            </div>
                          </FormControl>
                          <FormMessage className="text-xs font-circular font-normal" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </>
            )}

            <div className="flex items-center justify-end bottom-5 right-5 font-circular font-medium space-x-3 mt-12">
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
      </main>
    </>
  );
};

export default RateDetails;
