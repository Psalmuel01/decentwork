'use client';

import { useFormContext } from 'react-hook-form';
// import { StepperFormValues } from '../../../hooks/hook-stepper';
import { RadioGroup, RadioGroupItem } from '../../ui/radio-group';
import { Label } from '../../ui/label';
import { FormControl, FormField, FormItem, FormLabel } from '../../ui/form';
// import { cn } from '../../../lib/utils';
// import { Checkbox } from '../../ui/checkbox';
import { LucideChevronLeft, LucideChevronRight, LucideX } from 'lucide-react';
import { Button } from '../../ui/button';
import { useEffect } from 'react';
import { StepperFormValues } from '@/hooks/hook-stepper';
import { cn } from '@/lib/utils';

type WorkTypeDetailsProps = {
  handleNext: () => void;
  handleBack: () => void;
};

const dummyCategory = [
  {
    label: 'Admin Support',
    value: 'admin',
  },
  {
    label: 'Data Science & Analytics',
    value: 'ds',
  },
  {
    label: 'Designer and Creator',
    value: 'design',
  },
  {
    label: 'Engineering & Architecture',
    value: 'engineering',
  },
  {
    label: 'IT & Networking',
    value: 'it',
  },
  {
    label: 'Translation',
    value: 'translate',
  },
  {
    label: 'Web, Mobile & Software Dev',
    value: 'software',
  },
  {
    label: 'Writing',
    value: 'write',
  },
];

const items = [
  {
    id: 'audio',
    label: 'Audio & Music Production',
  },
  {
    id: 'art',
    label: 'Art & Illustration',
  },
  {
    id: 'anime',
    label: 'Video & Animation',
  },
  {
    id: 'product',
    label: 'Product Design',
  },
] as const;

const WorkTypeDetails = ({ handleNext, handleBack }: WorkTypeDetailsProps) => {
  const {
    control,
    // formState: { errors },
    // register,
    getValues,
    setValue,
  } = useFormContext<StepperFormValues>();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <main className="mt-32 px-5 mb-36">
        <div className="max-w-screen-lg mx-auto w-full">
          <p className="font-circular font-bold text-[#7E8082]">1/5</p>

          <h1 className="font-poppins font-semibold text-[32px] mt-1">
            <span className="text-[#7E8082]">Awesome!</span> What type of work
            are you looking to do?
          </h1>

          <p className="text-[#7E8082] font-circular text-base mt-2">
            You can always update your choices later.
          </p>

          <div className="bg-white relative rounded-xl p-10 mt-9 flex pb-20">
            <div className="">
              <h3 className="font-circular text-sm text-[#7E8082] mb-8">
                Select a category
              </h3>

              <FormField
                control={control}
                name="category"
                render={({ field }) => (
                  <FormItem className="border-r border-gray-200 pr-16 w-max">
                    <FormControl>
                      <RadioGroup
                        defaultValue={'design'}
                        className="flex flex-col gap-y-4"
                        onValueChange={field.onChange}
                      >
                        {dummyCategory.map((category) => {
                          return (
                            <FormItem
                              key={category.value}
                              className="flex space-x-3"
                            >
                              <FormControl>
                                <div className="">
                                  <RadioGroupItem
                                    value={category.value}
                                    id={category.value}
                                    className="hidden" // Hide the default radio button
                                  />

                                  <Label
                                    htmlFor={category.value}
                                    className={cn(
                                      'text-[#545756] cursor-pointer font-circular font-normal text-base',
                                      {
                                        'text-primary':
                                          getValues('category') ===
                                          category.value,
                                      },
                                    )}
                                  >
                                    {category.label}
                                  </Label>
                                </div>
                              </FormControl>
                            </FormItem>
                          );
                        })}
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="pl-16">
              <h3 className="font-circular text-sm text-[#7E8082] mb-8">
                Now, choose 1 to 3 specialties
              </h3>

              <div className="">
                <FormField
                  control={control}
                  name="specialities"
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  render={({ field }) => (
                    <FormItem className=" w-max flex flex-col gap-y-3">
                      {items.map((item) => (
                        <FormField
                          key={item.id}
                          control={control}
                          name="specialities"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={item.id}
                                className="flex flex-row items-center space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <div className="checkbox-wrapper-12">
                                    <div className="cbx">
                                      <input
                                        id={item.id}
                                        type="checkbox"
                                        className="h-10"
                                        checked={getValues(
                                          'specialities',
                                        )?.includes(item.id)}
                                        onChange={(checked) => {
                                          return checked
                                            ? getValues('specialities')?.push(
                                                item.id,
                                              )
                                            : field.onChange(
                                                getValues(
                                                  'specialities',
                                                )?.filter(
                                                  (value) => value !== item.id,
                                                ),
                                              );
                                        }}
                                      />
                                      <label htmlFor={item.id}></label>
                                      <svg
                                        width="15"
                                        height="14"
                                        viewBox="0 0 15 14"
                                        fill="none"
                                      >
                                        <path d="M2 8.36364L6.23077 12L13 2"></path>
                                      </svg>
                                    </div>
                                    <svg
                                      className=""
                                      xmlns="http://www.w3.org/2000/svg"
                                      version="1.1"
                                    >
                                      <defs>
                                        <filter id="goo-12">
                                          <feGaussianBlur
                                            in="SourceGraphic"
                                            stdDeviation="4"
                                            result="blur"
                                          ></feGaussianBlur>
                                          <feColorMatrix
                                            in="blur"
                                            mode="matrix"
                                            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -7"
                                            result="goo-12"
                                          ></feColorMatrix>
                                          <feBlend
                                            in="SourceGraphic"
                                            in2="goo-12"
                                          ></feBlend>
                                        </filter>
                                      </defs>
                                    </svg>
                                  </div>
                                  {/* <Checkbox
                                                                className="rounded-full cbx-12"
                                                                checked={getValues("specialities")?.includes(item.id)}

                                                                onCheckedChange={(checked) => {
                                                                return checked
                                                                    ? getValues("specialities")?.push(item.id)
                                                                    : field.onChange(
                                                                        (getValues("specialities")?.filter(
                                                                            (value) => value !== item.id
                                                                        ))
                                                                    )
                                                                }}
                                                            /> */}
                                </FormControl>

                                <FormLabel className="font-normal bg-white text-[#545756] font-circular">
                                  {item.label}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                      {/* <FormMessage /> */}
                    </FormItem>
                  )}
                />

                <div
                  onClick={() => {
                    setValue('specialities', []);
                  }}
                  className="flex font-circular mt-4 font-normal space-x-2 cursor-pointer items-center text-red-500"
                >
                  <LucideX size={20} />
                  <p className="">Clear all</p>
                </div>
              </div>
            </div>

            <div className="absolute flex items-center bottom-5 right-5 font-circular font-medium space-x-3">
              <Button
                onClick={handleBack}
                className="flex hover:bg-white/80  items-center space-x-3 text-primary bg-transparent border border-primary"
              >
                <LucideChevronLeft />
                <p className="">Back</p>
              </Button>

              <Button
                onClick={handleNext}
                className="flex items-center space-x-3 bg-primary text-white"
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

export default WorkTypeDetails;
