'use client';

import { useForm } from 'react-hook-form';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import {
  LucideChevronLeft,
  LucideChevronRight,
  LucideInfo,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import Image from 'next/image';
import { Box, Callout, Flex, Heading, Text } from '@radix-ui/themes';
import { EmptyUserIcon } from '@/icons/EmptyUserIcon';
import { CameraIcon } from '@/icons/Camera';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

type CompanyDetailsProps = {
  handleBack: () => void;
  handleNext: () => void;
  step: number;
};

const FormSchema = z.object({
  profile_picture: z
    .instanceof(File, { message: 'Please upload a profile picture' })
    .nullable(),
  companyName: z.string({ message: 'Your company name is required' }),
  companySize: z.string({ required_error: 'Please select your company size' }),
  companyDescription: z.string({
    required_error: 'Please describe your company',
  }),
  industry: z.string({ required_error: 'Please choose an industry' }),
});

export default function CompanyDetails({
  handleBack,
  handleNext,
  step,
}: CompanyDetailsProps) {
  // Form state
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      profile_picture: null,
      companyName: '',
      companySize: '',
      companyDescription: '',
      industry: '',
    },
  });

  const { control, watch, setValue, formState } = form;
  const { errors } = formState;

  // Watch for changes in fields
  // const selectedCountry = watch('country');
  const profilePicture = watch('profile_picture');
  // const selectedState = watch('state');

  // @ts-expect-error "Negligible Error"
  // @typescript-eslint/no-unused-vars
  const [, setImageFile] = useState<File>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Cleanup function to revoke object URL when component unmounts
  useEffect(() => {
    return () => {
      if (
        previewImageUrl &&
        previewImageUrl !== '/images/freelancer/file.svg'
      ) {
        URL.revokeObjectURL(previewImageUrl);
      }
    };
  }, [previewImageUrl]);

  // Update preview when profile_picture changes in form context
  useEffect(() => {
    if (profilePicture instanceof File) {
      // Cleanup previous preview URL if it exists
      if (
        previewImageUrl &&
        previewImageUrl !== '/images/freelancer/file.svg'
      ) {
        URL.revokeObjectURL(previewImageUrl);
      }
      const newPreviewUrl = URL.createObjectURL(profilePicture);
      setPreviewImageUrl(newPreviewUrl);
      setImageFile(profilePicture);
    }
  }, [profilePicture]);

  // This form instance is no longer needed as we've defined it above
  // const form = useForm<z.infer<typeof FormSchema>>({
  //   resolver: zodResolver(FormSchema),
  // });

  const validateImage = (file: File): string | null => {
    // Check file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return 'File size must be less than 5MB';
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return 'Please upload a valid image file (JPG, PNG, or GIF)';
    }

    return null;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate the file
    const error = validateImage(file);
    if (error) {
      alert(error);
      e.target.value = ''; // Reset the input
      return;
    }

    // Cleanup previous preview URL if it exists
    if (previewImageUrl && previewImageUrl !== '/images/freelancer/file.svg') {
      URL.revokeObjectURL(previewImageUrl);
    }

    // Create new preview URL
    const newPreviewUrl = URL.createObjectURL(file);
    setPreviewImageUrl(newPreviewUrl);
    setImageFile(file);
    setValue('profile_picture', file, { shouldValidate: true });
  };

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      // Here you would typically send the data to your API
      console.log('Form data submitted:', data);

      toast.success('Account created successfully!', {
        description: 'You can now start using your freelancer account.',
      });

      // Redirect to dashboard or next step
      // window.location.href = ApplicationRoutes.FREELANCER_DASHBOARD;
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to create account', {
        description:
          'Please try again or contact support if the issue persists.',
      });
    }
  }

  const renderImage = useCallback(() => {
    return (
      <div className="relative w-32 h-32 rounded-full transition-colors">
        {previewImageUrl ? (
          <Image
            src={previewImageUrl}
            alt=""
            className="w-full h-full object-cover"
            width={100}
            height={100}
          />
        ) : (
          <>
            <EmptyUserIcon width={128} height={128} />
            <div className="absolute bottom-0 right-0 bg-background rounded-full p-1.5 border-muted border">
              <CameraIcon />
            </div>
          </>
        )}
        <div className="absolute inset-0 bg-opacity-0 hover:bg-opacity-40 transition-opacity flex items-center justify-center">
          <span className="text-white opacity-0 hover:opacity-100 transition-opacity text-sm font-medium">
            Change Photo
          </span>
        </div>
      </div>
    );
  }, [previewImageUrl]);

  const imageElement = useMemo(() => renderImage(), [renderImage]);

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="mb-36">
            <div className="w-full lg:max-w-[950px]  mx-auto">
              {/*<p className="font-circular font-bold text-[#7E8082]">{step - 1}/5</p>*/}
              <Flex
                className={'w-full mx-auto'}
                direction={'column'}
                // align={'left'}
                gap={'4'}
              >
                <Box>
                  <p className="font-circular font-bold text-[#7E8082]">
                    {step - 1}/5
                  </p>
                  <Heading className="font-poppins text-[34px]">
                    <span className="text-[#7E8082]">Welcome!</span> Let&apos;s
                    Get to Know Your Company
                  </Heading>

                  <p className="text-muted-foreground text-[14px] max-w-screen-md">
                    Tell us who you are and what your company stands for. Just
                    the essentials to set the stage.
                  </p>
                </Box>
              </Flex>

              <div className="bg-background mx-auto relative rounded-xl py-5 px-3 lg:p-10 lg:pb-30 mt-10 relative">
                {/* Display a summary of errors at the top of the form */}
                {Object.keys(errors).length > 0 && (
                  <Callout.Root color="red" className={'mb-8'}>
                    <Callout.Icon>
                      <LucideInfo size={14} />
                    </Callout.Icon>
                    <Callout.Text>
                      Please fix the errors before you proceed.
                    </Callout.Text>
                  </Callout.Root>
                )}

                <div className="w-full space-y-8">
                  <div className="flex flex-col items-start mb-8">
                    <Text className="text-[#545756]">Company logo</Text>
                    <div className="relative">
                      <Input
                        onChange={handleFileChange}
                        id="profile-upload"
                        type="file"
                        accept="image/jpeg,image/png,image/gif"
                        className="peer hidden"
                      />
                      <Label
                        htmlFor="profile-upload"
                        className="cursor-pointer"
                      >
                        {imageElement}
                      </Label>
                    </div>

                    <div className="flex flex-col items-center gap-3">
                      <p className="text-[#BEBEBE] text-[14px] font-circular">
                        250x250 Min size / 5 MB Max
                      </p>
                    </div>
                  </div>

                  <Flex className={'w-full'}>
                    <FormField
                      control={control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem className={'w-full'}>
                          <FormLabel>Company Name</FormLabel>
                          <FormControl>
                            <Input
                              className={'w-full h-12'}
                              placeholder="Enter company's name"
                              {...field}
                            />
                          </FormControl>
                          {/* <FormDescription>
                            <Text size={'1'}>Enter company&apos;s name</Text>
                          </FormDescription> */}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </Flex>

                  <Flex className={'w-full'}>
                    <FormField
                      control={control}
                      name="industry"
                      render={({ field }) => (
                        <FormItem className={'w-full'}>
                          <FormLabel className="">Country</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full bg-transparent rounded-md px-3 text-sm border-input items-center justify-between !h-12">
                                <SelectValue placeholder="Select industry" />
                              </SelectTrigger>
                            </FormControl>

                            <SelectContent className="bg-background w-full max-h-[300px] overflow-y-auto">
                              {[
                                'Technology',
                                'Healthcare',
                                'Finance',
                                'Education',
                                'E-commerce',
                                'Manufacturing',
                                'Agriculture',
                                'Entertainment',
                                'Transportation',
                                'Energy',
                              ].map((industry) => (
                                <SelectItem
                                  key={industry}
                                  value={industry}
                                  className="flex items-center"
                                >
                                  {industry}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-xs font-circular font-normal" />
                        </FormItem>
                      )}
                    />
                  </Flex>

                  <Flex className={'w-full'}>
                    <FormField
                      control={control}
                      name="companySize"
                      render={({ field }) => (
                        <FormItem className={'w-full'}>
                          <FormLabel className="">Company size</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full bg-transparent rounded-md px-3 text-sm border-input items-center justify-between !h-12">
                                <SelectValue placeholder="Select company's size" />
                              </SelectTrigger>
                            </FormControl>

                            <SelectContent className="bg-background w-full max-h-[300px] overflow-y-auto">
                              {[
                                '0 - 10',
                                '10 - 50',
                                '50 - 200',
                                '200 - 500',
                                '500 - 1000',
                                '1000+',
                              ].map((companySize) => (
                                <SelectItem
                                  key={companySize}
                                  value={companySize}
                                  className="flex items-center"
                                >
                                  {companySize}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-xs font-circular font-normal" />
                        </FormItem>
                      )}
                    />
                  </Flex>

                  <Flex className={'w-full'}>
                    <FormField
                      control={control}
                      name="companyDescription"
                      render={({ field }) => (
                        <FormItem className={'w-full'}>
                          <FormLabel>Bio</FormLabel>
                          <FormControl>
                            <Input
                              className={'w-full h-12'}
                              placeholder="Compnay descriptions"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </Flex>
                </div>
                <div className="mt-[30px] lg:mt-0 lg:absolute flex items-center bottom-5 right-10 font-circular font-medium space-x-3">
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
            </div>
          </div>
        </form>
      </Form>
    </>
  );
}
