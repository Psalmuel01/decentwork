'use client';

import { StepperFormValues } from '@/hooks/hook-stepper';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../ui/form';
import { useFormContext } from 'react-hook-form';
import { LucideChevronLeft, LucideChevronRight } from 'lucide-react';
import { Button } from '../../ui/button';
import { useEffect } from 'react';
import { Flex } from '@radix-ui/themes';
import { PhoneInput } from '@/components/freelancer/phone-input';
import { Input } from '@/components/ui/input';

type PrimaryContactProps = {
  handleBack: () => void;
  handleNext: () => void;
  step: number;
};

const PrimaryContact = ({
  handleBack,
  handleNext,
  step,
}: PrimaryContactProps) => {
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
            <span className="text-[#7E8082]">Let&apos;s keep in touch! </span>
            Who Should We Reach Out To?
          </h1>

          <p className="text-[#7E8082] font-circular text-base text-[14px] max-w-screen-md">
            Add a contact person from your team so we know who to talk to when
            it matters.
          </p>

          <div className="bg-background relative rounded-xl px-3 py-5 lg:p-10 mt-9 space-y-8">
            <FormField
              control={control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#545756] font-circular">
                    Primary contact name
                  </FormLabel>

                  <FormControl>
                    <Input
                      className="h-12 bg-white placeholder:font-circular border-gray-300 font-circular placeholder:text-[#BEBEBE]"
                      placeholder="Enter primary contact name"
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
                <FormItem>
                  <FormLabel className="text-[#545756] font-circular">
                    Email address
                  </FormLabel>

                  <FormControl>
                    <Input
                      className="h-12 bg-white placeholder:font-circular border-gray-300 font-circular placeholder:text-[#BEBEBE]"
                      placeholder="Enter email address"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs font-circular font-normal" />
                </FormItem>
              )}
            />

            <Flex className={'w-full'}>
              <FormField
                control={control}
                name="phone"
                render={({ field }) => (
                  <FormItem className={'w-full'}>
                    <FormLabel className="">Phone Number</FormLabel>
                    <FormControl>
                      <PhoneInput className={'h-12'} {...field} />
                    </FormControl>
                    <FormMessage className="text-xs font-normal" />
                  </FormItem>
                )}
              />
            </Flex>

            <div className="flex items-center justify-end">
              <div className=" flex w-full lg:w-max items-center font-circular font-medium space-x-3">
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
        </div>
      </main>
    </>
  );
};

export default PrimaryContact;
