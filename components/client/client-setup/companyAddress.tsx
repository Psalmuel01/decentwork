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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type CompanyAddressProps = {
  handleBack: () => void;
  handleNext: () => void;
  step: number;
};

const CompanyAddress = ({
  handleBack,
  handleNext,
  step,
}: CompanyAddressProps) => {
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
          <p className="font-circular font-bold text-[#7E8082]">{step - 1}/5</p>

          <h1 className="font-poppins font-semibold text-[24px] mt-1">
            <span className="text-[#7E8082]">Welcome! </span>Where Are You
            Based?
          </h1>

          <p className="text-[#7E8082] font-circular text-base text-[14px]">
            Help us understand where you operate from. This keeps things
            relevant for your job listings.
          </p>

          <div className="bg-white relative rounded-xl px-3 py-5 lg:p-10 mt-9 lg:pb-32 ">
            <div className="flex flex-col gap-y-8">
              <FormField
                control={control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#545756] font-circular">
                      Comapny&apos;s address
                    </FormLabel>

                    <FormControl>
                      <Input
                        className="h-12 bg-white placeholder:font-circular border-gray-300 font-circular placeholder:text-[#BEBEBE]"
                        placeholder="Enter company's address"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs font-circular font-normal" />
                  </FormItem>
                )}
              />

              <div className="flex flex-col lg:flex-row lg:items-center gap-[20px]">
                <FormField
                  control={control}
                  name="language"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="text-[#545756] text-base font-normal font-circular">
                        Country
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl className="">
                          <SelectTrigger className="bg-transparent !h-12 w-full placeholder:font-circular border-gray-300 font-circular placeholder:text-[#BEBEBE]">
                            <SelectValue
                              className="placeholder:font-circular border-gray-300 font-circular placeholder:text-[#BEBEBE]"
                              placeholder="Select country"
                            />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent className="bg-white text-[#545756]">
                          <SelectItem value="english">English</SelectItem>
                          <SelectItem value="spanish">Spanish</SelectItem>
                          <SelectItem value="french">French</SelectItem>
                          <SelectItem value="german">German</SelectItem>
                          <SelectItem value="italian">Italian</SelectItem>
                          <SelectItem value="portuguese">Portuguese</SelectItem>
                          <SelectItem value="russian">Russian</SelectItem>
                          <SelectItem value="chinese">Chinese</SelectItem>
                          <SelectItem value="japanese">Japanese</SelectItem>
                          <SelectItem value="korean">Korean</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-xs font-circular font-normal" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="englishFluency"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="text-[#545756] text-base font-normal font-circular">
                        City/State
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={!control._formValues.language}
                      >
                        <FormControl className="">
                          <SelectTrigger className="bg-transparent !h-12 w-full placeholder:font-circular border-gray-300 font-circular placeholder:text-[#BEBEBE]">
                            <SelectValue
                              className="placeholder:font-circular border-gray-300 font-circular placeholder:text-[#BEBEBE]"
                              placeholder="Select city/state"
                            />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent className="bg-white text-[#545756]">
                          <SelectItem value="fluent">Fluent</SelectItem>
                          <SelectItem value="proficient">Proficient</SelectItem>
                          <SelectItem value="intermediate">
                            Intermediate
                          </SelectItem>
                          <SelectItem value="basic">Basic</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-xs font-circular font-normal" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="mt-[30px] lg:mt-0 lg:absolute flex items-center bottom-5 right-5 font-circular font-medium space-x-3">
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

export default CompanyAddress;
