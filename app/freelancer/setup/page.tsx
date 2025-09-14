'use client';

import { useForm } from 'react-hook-form';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { LucideCheck, LucideInfo } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { GetCity, GetCountries, GetState } from 'react-country-state-city';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import Image from 'next/image';
import { Box, Callout, Flex, Heading, Text } from '@radix-ui/themes';
import { EmptyUserIcon } from '@/icons/EmptyUserIcon';
import { CameraIcon } from '@/icons/Camera';
import CalendarIcon from '@/icons/Calendar';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';
import { ApplicationRoutes } from '@/config/routes';
import { PhoneInput } from '@/components/freelancer/phone-input';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const FormSchema = z.object({
  profile_picture: z
    .instanceof(File, { message: 'Please upload a profile picture' })
    .nullable()
    .optional(),
  fullname: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  phone: z.string().min(10, { message: 'Please enter a valid phone number' }),
  date_of_birth: z.date({
    required_error: 'A date of birth is required.',
  }),
  country: z.string({ required_error: 'Please select your country' }),
  state: z.string({ required_error: 'Please select your state/province' }),
  city: z.string({ required_error: 'Please select your city' }),
  address: z.string().min(5, { message: 'Please enter your full address' }),
  zipcode: z.string().min(3, { message: 'Please enter a valid postal code' }),
  category: z.string({ required_error: 'Please select a category' }),
  speciality: z.string().min(2, { message: 'Please enter your speciality' }),
  skills: z
    .array(z.string())
    .min(1, { message: 'Please add at least one skill' }),
  title: z.string().min(5, { message: 'Please enter your professional title' }),
  bio: z.string().min(20, { message: 'Bio must be at least 20 characters' }),
  language: z.string({ required_error: 'Please select a language' }),
  fluency: z.string({ required_error: 'Please select your fluency level' }),
  hourlyRate: z.number().min(1, { message: 'Please enter your hourly rate' }),
  terms: z.literal(true, {
    errorMap: () => ({ message: 'You must accept the terms and conditions' }),
  }),
});

export default function Page() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [existingData, setExistingData] = useState<any>(null);

  // Form state
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      profile_picture: null,
      fullname: '',
      email: '',
      phone: '',
      date_of_birth: new Date(),
      country: '',
      state: '',
      city: '',
      address: '',
      zipcode: '',
      category: '',
      speciality: '',
      skills: [],
      title: '',
      bio: '',
      language: '',
      fluency: '',
      hourlyRate: 0,
    },
  });

  const { control, watch, setValue, trigger, formState, reset } = form;
  const { errors, isValid, isDirty } = formState;

  // Watch for changes in fields
  const selectedCountry = watch('country');
  const profilePicture = watch('profile_picture');
  const termsAccepted = watch('terms');
  const selectedState = watch('state');

  // @ts-expect-error "Negligible Error"
  // @typescript-eslint/no-unused-vars
  const [, setImageFile] = useState<File>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [skillInput, setSkillInput] = useState('');

  const [countries, setCountries] = useState<unknown[]>([]);
  const [states, setStates] = useState<unknown[]>([]);
  const [cities, setCities] = useState<unknown[]>([]);

  // Fetch existing freelancer data
  const fetchFreelancerData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      const response = await fetch('https://decentwork.onrender.com/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: `
            query GetFreelancerDetails {
              getFreelancerDetails {
                code
                data {
                  address
                  bio
                  category
                  city
                  country
                  createdAt
                  dateOfBirth
                  email
                  fluency
                  freelancerid
                  hourlyRate
                  imageURL
                  jobs
                  language
                  name
                  phoneNumber
                  postalCode
                  rating
                  skills
                  speciality
                  title
                  walletAddress
                }
                message
                success
              }
            }
          `,
        }),
      });

      const result = await response.json();
      if (
        result.data?.getFreelancerDetails?.success &&
        result.data.getFreelancerDetails.data
      ) {
        const data = result.data.getFreelancerDetails.data;
        setExistingData(data);

        // Prefill form with existing data
        reset({
          profile_picture: null,
          fullname: data.name || '',
          email: data.email || '',
          phone: data.phoneNumber || '',
          date_of_birth: data.dateOfBirth
            ? new Date(data.dateOfBirth)
            : new Date(),
          country: '', // Will be set after countries load
          state: '',
          city: '',
          address: data.address || '',
          zipcode: data.postalCode || '',
          category: data.category || '',
          speciality: data.speciality || '',
          skills: data.skills || [],
          title: data.title || '',
          bio: data.bio || '',
          language: data.language || '',
          fluency: data.fluency || '',
          hourlyRate: data.hourlyRate || 0,
          terms: true,
        });

        // Set image preview if exists
        if (data.imageURL && data.imageURL !== 'placeholder-image-url') {
          setPreviewImageUrl(data.imageURL);
        }
      }
    } catch (error) {
      console.error('Error fetching freelancer data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load countries on component mount
  useEffect(() => {
    const loadCountries = async () => {
      const countriesData = await GetCountries();
      setCountries(countriesData);

      // Set country after countries are loaded and we have existing data
      if (existingData && existingData.country && countriesData) {
        const country = countriesData.find(
          (c: any) => c.name === existingData.country,
        );
        if (country) {
          setValue('country', country.id.toString());
        }
      }
    };
    loadCountries();
  }, [existingData, setValue]);

  // Load states when country changes
  useEffect(() => {
    const loadStates = async () => {
      if (selectedCountry) {
        const statesData = await GetState(parseInt(selectedCountry));
        setStates(statesData);

        // Set state if we have existing data
        if (existingData && existingData.city && !watch('state')) {
          const state = statesData.find(
            (s: any) => s.name === existingData.city,
          );
          if (state) {
            setValue('state', state.id.toString());
          }
        } else if (!existingData) {
          // Clear state and city when country changes for new data
          setValue('state', '');
          setValue('city', '');
          setCities([]);
        }
      }
    };
    loadStates();
  }, [selectedCountry, setValue, existingData, watch]);

  // Load cities when state changes
  useEffect(() => {
    const loadCities = async () => {
      if (selectedCountry && selectedState) {
        const citiesData = await GetCity(
          parseInt(selectedCountry),
          parseInt(selectedState),
        );
        setCities(citiesData);

        // Set city if we have existing data
        if (existingData && existingData.city && !watch('city')) {
          const city = citiesData.find(
            (c: any) => c.name === existingData.city,
          );
          if (city) {
            setValue('city', city.id.toString());
          }
        } else if (!existingData) {
          // Clear city when state changes for new data
          setValue('city', '');
        }
      }
    };
    loadCities();
  }, [selectedCountry, selectedState, setValue, existingData, watch]);

  // Reset state and city when country changes (only for new data)
  useEffect(() => {
    if (selectedCountry && !existingData) {
      setValue('state', '');
      setValue('city', '');
      // Trigger validation after clearing fields
      trigger(['state', 'city']);
    }
  }, [selectedCountry, setValue, trigger, existingData]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchFreelancerData();
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

  const addSkill = () => {
    const currentSkills = form.getValues('skills');
    if (skillInput.trim() && !currentSkills.includes(skillInput.trim())) {
      setValue('skills', [...currentSkills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    const currentSkills = form.getValues('skills');
    setValue(
      'skills',
      currentSkills.filter((skill) => skill !== skillToRemove),
    );
  };

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('authToken');
      if (!token) {
        toast.error('Authentication token not found', {
          description: 'Please login again.',
        });
        return;
      }

      // Upload image if exists
      let imageUrl = '';
      if (data.profile_picture) {
        // Handle image upload logic here
        // For now, we'll use a placeholder
        imageUrl = 'placeholder-image-url';
      }

      const response = await fetch('https://decentwork.onrender.com/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: `
            mutation UpdateFreelancerProfile(
              $address: String
              $bio: String
              $category: String
              $city: String
              $country: String
              $dateOfBirth: String
              $email: String
              $fluency: String
              $hourlyRate: Float
              $imageUrl: String
              $language: String
              $name: String
              $phoneNumber: String
              $postalCode: String
              $skills: [String!]
              $speciality: String
              $title: String
            ) {
              updateFreelancerProfile(
                address: $address
                bio: $bio
                category: $category
                city: $city
                country: $country
                dateOfBirth: $dateOfBirth
                email: $email
                fluency: $fluency
                hourlyRate: $hourlyRate
                imageURL: $imageUrl
                language: $language
                name: $name
                phoneNumber: $phoneNumber
                postalCode: $postalCode
                skills: $skills
                speciality: $speciality
                title: $title
              ) {
                freelancerid
                name
                email
                walletAddress
                createdAt
              }
            }
          `,
          variables: {
            address: data.address,
            bio: data.bio,
            category: data.category,
            city: data.city,
            country: data.country,
            dateOfBirth: data.date_of_birth.toISOString().split('T')[0],
            email: data.email,
            fluency: data.fluency,
            hourlyRate: data.hourlyRate,
            language: data.language,
            name: data.fullname,
            phoneNumber: data.phone,
            postalCode: data.zipcode,
            skills: data.skills,
            speciality: data.speciality,
            title: data.title,
            imageUrl: imageUrl,
          },
        }),
      });

      const result = await response.json();

      if (result.errors) {
        throw new Error(result.errors[0].message);
      }

      toast.success('Profile updated successfully!', {
        description: 'Your changes have been saved.',
      });

      router.push(ApplicationRoutes.FREELANCER_DASHBOARD);
    } catch (error) {
      console.error('Error updating freelancer profile:', error);
      toast.error('Failed to update profile', {
        description:
          error instanceof Error ? error.message : 'Please try again.',
      });
    } finally {
      setIsSubmitting(false);
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
            <div className="w-full lg:max-w-xl mx-auto">
              {/*<p className="font-circular font-bold text-[#7E8082]">{step - 1}/5</p>*/}
              <Flex
                className={'w-4/5 mx-auto text-center'}
                direction={'column'}
                align={'center'}
                gap={'4'}
              >
                <Box>
                  <Heading className="font-poppins" size={'8'}>
                    Update freelancer profile
                  </Heading>

                  <p className="text-muted-foreground text-base mt-2 max-w-screen-md">
                    Update your profile information to keep it current and
                    attract more clients!
                  </p>
                </Box>

                {/*<Flex
                  align={'center'}
                  className={
                    'bg-[#DFFFED] border border-[#9BFFC5] h-14 leading-[48px] rounded-full'
                  }
                  gap={'4'}
                  px={'5'}
                >
                  <Text color={'gray'} weight={'medium'}>
                    Wallet Connected
                  </Text>
                  <Flex
                    align={'center'}
                    justify={'center'}
                    className={'bg-[#2ECC71] rounded-full size-5 leading-5'}
                  >
                    <LucideCheck color={'white'} size={12} strokeWidth={3} />
                  </Flex>
                </Flex>*/}
              </Flex>

              <div className="bg-background mx-auto relative rounded-xl px-[20px] lg:px-10 p-10 mt-10 ">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-4"></div>
                    <Text>Loading your profile data...</Text>
                  </div>
                ) : (
                  <>
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
                      <div className="flex flex-col items-start gap-4 mb-8">
                        <Text weight={'bold'}>Upload Your Avatar</Text>
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
                          {/*<Button
                        type="button"
                        onClick={() =>
                          document.getElementById('profile-upload')?.click()
                        }
                        variant="outline"
                        className="flex items-center gap-2 text-primary border-primary hover:bg-primary/10"
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M10 4.16667V15.8333M4.16667 10H15.8333"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        Upload Photo
                      </Button>*/}
                          <p className="text-[#BEBEBE] text-sm font-circular">
                            JPG, PNG or GIF (max. 5MB)
                          </p>
                        </div>
                      </div>

                      <Flex className={'w-full'}>
                        <FormField
                          control={control}
                          name="fullname"
                          render={({ field }) => (
                            <FormItem className={'w-full'}>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                <Input
                                  className={'w-full h-12'}
                                  placeholder="e.g., John Doe"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                <Text size={'1'}>
                                  Your First Name and Last Name
                                </Text>
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </Flex>

                      <Flex className={'w-full'}>
                        <FormField
                          control={control}
                          name="email"
                          render={({ field }) => (
                            <FormItem className={'w-full'}>
                              <FormLabel>Email Address</FormLabel>
                              <FormControl>
                                <Input
                                  className={'w-full h-12'}
                                  placeholder="example@gmail.com"
                                  type={'email'}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </Flex>

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

                      <Flex className={'w-full'}>
                        <FormField
                          control={control}
                          name="date_of_birth"
                          render={({ field }) => (
                            <FormItem className="flex flex-col w-full">
                              <FormLabel>Date of birth</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant={'outline'}
                                      className={cn(
                                        'w-full h-12 pl-3 text-left font-normal',
                                        !field.value && 'text-muted-foreground',
                                      )}
                                    >
                                      {field.value ? (
                                        format(field.value, 'PPP')
                                      ) : (
                                        <span>Pick a date</span>
                                      )}
                                      <div className="ml-auto h-4 w-4 opacity-50">
                                        <CalendarIcon />
                                      </div>
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="w-auto p-0"
                                  align="start"
                                >
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) =>
                                      date > new Date() ||
                                      date < new Date('1900-01-01')
                                    }
                                    captionLayout="dropdown"
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormDescription>
                                <Text size={'1'}>
                                  Your date of birth is used to calculate your
                                  age.
                                </Text>
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </Flex>

                      <Flex className={'w-full'}>
                        <FormField
                          control={control}
                          name="country"
                          render={({ field }) => (
                            <FormItem className={'w-full'}>
                              <FormLabel className="">Country</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="w-full bg-transparent !h-12">
                                    <SelectValue
                                      className=""
                                      placeholder="Select your country"
                                    />
                                  </SelectTrigger>
                                </FormControl>

                                <SelectContent className="bg-background w-full max-h-[300px] overflow-y-auto">
                                  {countries.map((country) => (
                                    <SelectItem
                                      // @ts-expect-error "Negligible Error"
                                      key={country?.id}
                                      // @ts-expect-error "Negligible Error"
                                      value={country?.id.toString()}
                                      className="flex items-center gap-2"
                                    >
                                      {/* @ts-expect-error "Negligible Error" */}
                                      <span className="mr-2">
                                        {country?.emoji}
                                      </span>
                                      {/* @ts-expect-error "Negligible Error" */}
                                      {country?.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage className="text-xs font-circular font-normal" />
                            </FormItem>
                          )}
                        />
                      </Flex>

                      <Flex
                        className={'w-full flex-col lg:flex-row'}
                        align={'center'}
                        justify={'between'}
                        gap={'4'}
                      >
                        <Flex className={'w-full'}>
                          <FormField
                            control={control}
                            name="state"
                            render={({ field }) => (
                              <FormItem className={'w-full'}>
                                <FormLabel className="">
                                  State/Province
                                </FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                  disabled={!selectedCountry}
                                >
                                  <FormControl>
                                    <SelectTrigger className="w-full !h-12">
                                      <SelectValue
                                        className=""
                                        placeholder="Select state/province"
                                      />
                                    </SelectTrigger>
                                  </FormControl>

                                  <SelectContent className="bg-white max-h-[300px] overflow-y-auto">
                                    {states.map((state) => (
                                      <SelectItem
                                        // @ts-expect-error "Negligible Error"
                                        key={state.id}
                                        // @ts-expect-error "Negligible Error"
                                        value={state.id.toString()}
                                      >
                                        {/* @ts-expect-error "Negligible Error" */}
                                        {state.name}
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
                            name="city"
                            render={({ field }) => (
                              <FormItem className={'w-full'}>
                                <FormLabel className="">City</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                  disabled={!watch('state')}
                                >
                                  <FormControl>
                                    <SelectTrigger className="w-full !h-12">
                                      <SelectValue
                                        className=""
                                        placeholder="Select city"
                                      />
                                    </SelectTrigger>
                                  </FormControl>

                                  <SelectContent className="bg-background max-h-[300px] overflow-y-auto">
                                    {cities.map((city) => (
                                      <SelectItem
                                        // @ts-expect-error "Negligible Error"
                                        key={city.id}
                                        // @ts-expect-error "Negligible Error"
                                        value={city.id.toString()}
                                      >
                                        {/* @ts-expect-error "Negligible Error" */}
                                        {city.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage className="text-xs font-normal" />
                              </FormItem>
                            )}
                          />
                        </Flex>
                      </Flex>

                      <Flex
                        className={'w-full flex-col lg:flex-row'}
                        align={'center'}
                        justify={'between'}
                        gap={'4'}
                      >
                        <Flex className={'w-full'}>
                          <FormField
                            control={control}
                            name="address"
                            render={({ field }) => (
                              <FormItem className={'w-full'}>
                                <FormLabel className="">
                                  Street address*
                                </FormLabel>

                                <FormControl>
                                  <Input
                                    className="w-full h-12"
                                    placeholder="No 1, first street, avenue..."
                                    {...field}
                                    onChange={(e) => {
                                      field.onChange(e);
                                      // Trigger validation on change
                                      trigger('address');
                                    }}
                                  />
                                </FormControl>
                                <FormMessage className="text-xs font-circular font-normal" />
                              </FormItem>
                            )}
                          />
                        </Flex>

                        <Flex className={'w-full'}>
                          <FormField
                            control={control}
                            name="zipcode"
                            render={({ field }) => (
                              <FormItem className={'w-full'}>
                                <FormLabel className="">
                                  ZIP/Postal code
                                </FormLabel>

                                <FormControl>
                                  <Input
                                    className="h-12"
                                    placeholder="Enter zip/postal code"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage className="text-xs" />
                              </FormItem>
                            )}
                          />
                        </Flex>
                      </Flex>

                      <Flex className={'w-full'}>
                        <FormField
                          control={control}
                          name="category"
                          render={({ field }) => (
                            <FormItem className={'w-full'}>
                              <FormLabel>Category</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="w-full h-12">
                                    <SelectValue placeholder="Select your category" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="development">
                                    Development & IT
                                  </SelectItem>
                                  <SelectItem value="design">
                                    Design & Creative
                                  </SelectItem>
                                  <SelectItem value="marketing">
                                    Sales & Marketing
                                  </SelectItem>
                                  <SelectItem value="writing">
                                    Writing & Translation
                                  </SelectItem>
                                  <SelectItem value="admin">
                                    Admin & Customer Support
                                  </SelectItem>
                                  <SelectItem value="engineering">
                                    Engineering & Architecture
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </Flex>

                      <Flex className={'w-full'}>
                        <FormField
                          control={control}
                          name="speciality"
                          render={({ field }) => (
                            <FormItem className={'w-full'}>
                              <FormLabel>Speciality</FormLabel>
                              <FormControl>
                                <Input
                                  className={'w-full h-12'}
                                  placeholder="e.g., Frontend Development"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </Flex>

                      <Flex className={'w-full'}>
                        <FormField
                          control={control}
                          name="title"
                          render={({ field }) => (
                            <FormItem className={'w-full'}>
                              <FormLabel>Professional Title</FormLabel>
                              <FormControl>
                                <Input
                                  className={'w-full h-12'}
                                  placeholder="e.g., Senior React Developer"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </Flex>

                      <Flex className={'w-full'}>
                        <FormField
                          control={control}
                          name="bio"
                          render={({ field }) => (
                            <FormItem className={'w-full'}>
                              <FormLabel>Bio</FormLabel>
                              <FormControl>
                                <textarea
                                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                  placeholder="Tell us about yourself and your experience..."
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </Flex>

                      <Flex className={'w-full flex-col lg:flex-row'} gap={'4'}>
                        <Flex className={'w-full'}>
                          <FormField
                            control={control}
                            name="language"
                            render={({ field }) => (
                              <FormItem className={'w-full'}>
                                <FormLabel>Language</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger className="w-full h-12">
                                      <SelectValue placeholder="Select language" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="english">
                                      English
                                    </SelectItem>
                                    <SelectItem value="spanish">
                                      Spanish
                                    </SelectItem>
                                    <SelectItem value="french">
                                      French
                                    </SelectItem>
                                    <SelectItem value="german">
                                      German
                                    </SelectItem>
                                    <SelectItem value="chinese">
                                      Chinese
                                    </SelectItem>
                                    <SelectItem value="arabic">
                                      Arabic
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </Flex>

                        <Flex className={'w-full'}>
                          <FormField
                            control={control}
                            name="fluency"
                            render={({ field }) => (
                              <FormItem className={'w-full'}>
                                <FormLabel>Fluency</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger className="w-full h-12">
                                      <SelectValue placeholder="Select fluency level" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="native">
                                      Native
                                    </SelectItem>
                                    <SelectItem value="fluent">
                                      Fluent
                                    </SelectItem>
                                    <SelectItem value="conversational">
                                      Conversational
                                    </SelectItem>
                                    <SelectItem value="basic">Basic</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </Flex>
                      </Flex>

                      <Flex className={'w-full'}>
                        <FormField
                          control={control}
                          name="hourlyRate"
                          render={({ field }) => (
                            <FormItem className={'w-full'}>
                              <FormLabel>Hourly Rate (USD)</FormLabel>
                              <FormControl>
                                <Input
                                  className={'w-full h-12'}
                                  type="number"
                                  placeholder="e.g., 50"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(parseFloat(e.target.value))
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </Flex>

                      <div className="w-full">
                        <FormField
                          control={control}
                          name="skills"
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <FormLabel>Skills</FormLabel>
                              <div className="space-y-2">
                                <div className="flex gap-2">
                                  <Input
                                    className="h-12"
                                    placeholder="Add a skill (e.g., React, Node.js)"
                                    value={skillInput}
                                    onChange={(e) =>
                                      setSkillInput(e.target.value)
                                    }
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        e.preventDefault();
                                        addSkill();
                                      }
                                    }}
                                  />
                                  <Button
                                    type="button"
                                    onClick={addSkill}
                                    variant="outline"
                                    className="h-12 px-6"
                                  >
                                    Add
                                  </Button>
                                </div>
                                {field.value.length > 0 && (
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {field.value.map((skill, index) => (
                                      <div
                                        key={index}
                                        className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-2"
                                      >
                                        {skill}
                                        <button
                                          type="button"
                                          onClick={() => removeSkill(skill)}
                                          className="text-primary hover:text-primary/80"
                                        >
                                          ×
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={control}
                        name="terms"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                id="terms"
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel
                                htmlFor="terms"
                                className={
                                  'font-normal flex flex-row items-center flex-wrap gap-0.5'
                                }
                              >
                                Yes, I agree to the
                                <Link
                                  className={'text-primary'}
                                  href={ApplicationRoutes.TERMS}
                                >
                                  Terms of Service,
                                </Link>{' '}
                                <Link
                                  className={'text-primary'}
                                  href={ApplicationRoutes.USER_AGREEMENT}
                                >
                                  User Agreement,
                                </Link>
                                and
                                <Link
                                  className={'text-primary'}
                                  href={ApplicationRoutes.PRIVACY}
                                >
                                  Privacy Policy.
                                </Link>
                              </FormLabel>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />

                      <Flex direction={'column'}>
                        <Button
                          className={`h-12 ${!isValid || !termsAccepted || isSubmitting ? 'bg-[#BEBEBE]' : ''}`}
                          disabled={
                            !isValid ||
                            !termsAccepted ||
                            isSubmitting ||
                            isLoading
                          }
                          variant={'default'}
                          size={'lg'}
                          type="submit"
                        >
                          {isLoading
                            ? 'Loading...'
                            : isSubmitting
                              ? 'Updating Profile...'
                              : 'Update Profile'}
                        </Button>
                      </Flex>

                      {/*<Flex
                    align={'center'}
                    className={'text-center'}
                    gap={'1'}
                    justify={'center'}
                  >
                    <Text>Already have an account?</Text>
                    <Link className={'font-medium text-primary'} href={'/'}>
                      Sign in
                    </Link>
                  </Flex>*/}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
}
