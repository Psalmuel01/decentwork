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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { GetCountries } from 'react-country-state-city';
import Image from 'next/image';
import { Box, Callout, Flex, Heading, Text } from '@radix-ui/themes';
import { EmptyUserIcon } from '@/icons/EmptyUserIcon';
import { CameraIcon } from '@/icons/Camera';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';
import { ApplicationRoutes } from '@/config/routes';
import { useXionWallet } from '@/context/xion-context';
import { PhoneInput } from '@/components/freelancer/phone-input';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

const FormSchema = z.object({
  profile_picture: z
    .instanceof(File, { message: 'Please upload a profile picture' })
    .nullable()
    .optional(),
  companyName: z
    .string()
    .min(2, { message: 'Company name must be at least 2 characters' }),
  contactName: z
    .string()
    .min(2, { message: 'Contact name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  contact: z.string().min(10, { message: 'Please enter a valid phone number' }),
  country: z.string().optional(),
  city: z.string().optional(),
  address: z.string().optional(),
  industry: z.string({ required_error: 'Please select your industry' }),
  size: z.string({ required_error: 'Please select your company size' }),
  bio: z.string().optional(),
  webLink: z.string().url({ message: 'Please enter a valid URL' }).optional(),
  linkedinLink: z
    .string()
    .url({ message: 'Please enter a valid URL' })
    .optional(),
  socialLink: z
    .string()
    .url({ message: 'Please enter a valid URL' })
    .optional(),
  terms: z.literal(true, {
    errorMap: () => ({ message: 'You must accept the terms and conditions' }),
  }),
});

export default function Page() {
  const { isConnected } = useXionWallet();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [existingData, setExistingData] = useState<any>(null);

  // Form state
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      profile_picture: null,
      companyName: '',
      contactName: '',
      email: '',
      contact: '',
      country: '',
      city: '',
      address: '',
      industry: '',
      size: '',
      bio: '',
      webLink: '',
      linkedinLink: '',
      socialLink: '',
      terms: false,
    },
  });

  const { control, watch, setValue, trigger, formState, reset } = form;
  const { errors, isValid, isDirty } = formState;

  // Watch for changes in fields
  const profilePicture = watch('profile_picture');
  const termsAccepted = watch('terms');

  const [, setImageFile] = useState<File | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [countries, setCountries] = useState<unknown[]>([]);

  // Fetch existing client data
  const fetchClientData = async () => {
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
            query GetClientDetails {
              getClientDetails {
                code
                data {
                  address
                  bio
                  city
                  clientid
                  companyName
                  contact
                  contactName
                  country
                  createdAt
                  email
                  imageURL
                  industry
                  linkedinLink
                  role
                  size
                  socialLink
                  walletAddress
                  webLink
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
        result.data?.getClientDetails?.success &&
        result.data.getClientDetails.data
      ) {
        const data = result.data.getClientDetails.data;
        setExistingData(data);

        // Prefill form with existing data
        reset({
          profile_picture: null,
          companyName: data.companyName || '',
          contactName: data.contactName || '',
          email: data.email || '',
          contact: data.contact || '',
          country: data.country || '',
          city: data.city || '',
          address: data.address || '',
          industry: data.industry || '',
          size: data.size || '',
          bio: data.bio || '',
          webLink: data.webLink || '',
          linkedinLink: data.linkedinLink || '',
          socialLink: data.socialLink || '',
          terms: true,
        });

        // Set image preview if exists
        if (data.imageURL && data.imageURL !== 'placeholder-image-url') {
          setPreviewImageUrl(data.imageURL);
        }
      }
    } catch (error) {
      console.error('Error fetching client data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load countries on component mount
  useEffect(() => {
    const loadCountries = async () => {
      const countriesData = await GetCountries();
      setCountries(countriesData);
    };
    loadCountries();
    fetchClientData();
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

  // Update preview when profile_picture changes
  useEffect(() => {
    if (profilePicture instanceof File) {
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

  const validateImage = (file: File): string | null => {
    if (file.size > 5 * 1024 * 1024) {
      return 'File size must be less than 5MB';
    }
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return 'Please upload a valid image file (JPG, PNG, or GIF)';
    }
    return null;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const error = validateImage(file);
    if (error) {
      alert(error);
      e.target.value = '';
      return;
    }

    if (previewImageUrl && previewImageUrl !== '/images/freelancer/file.svg') {
      URL.revokeObjectURL(previewImageUrl);
    }

    const newPreviewUrl = URL.createObjectURL(file);
    setPreviewImageUrl(newPreviewUrl);
    setImageFile(file);
    setValue('profile_picture', file, { shouldValidate: true });
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

      let imageUrl = existingData?.imageURL || '';
      if (data.profile_picture) {
        imageUrl = 'placeholder-image-url'; // Replace with actual image upload logic
      }

      const mutation = existingData
        ? `
            mutation UpdateClientProfile($address: String, $bio: String, $city: String, $companyName: String, $contact: String, $contactName: String, $country: String, $email: String, $industry: String, $linkedinLink: String, $size: String, $socialLink: String, $webLink: String) {
              updateClientProfile(address: $address, bio: $bio, city: $city, companyName: $companyName, contact: $contact, contactName: $contactName, country: $country, email: $email, industry: $industry, linkedinLink: $linkedinLink, size: $size, socialLink: $socialLink, webLink: $webLink) {
                address
                bio
                city
                clientid
                companyName
                contact
                contactName
                country
                createdAt
                email
                imageURL
                industry
                linkedinLink
                role
                size
                socialLink
                walletAddress
                webLink
              }
            }
          `
        : `
            mutation CreateClient($companyName: String!, $contact: String!, $contactName: String!, $email: String!, $industry: String!, $size: String!, $bio: String, $address: String, $city: String, $country: String, $imageUrl: String, $linkedinLink: String, $socialLink: String, $webLink: String) {
              createClient(companyName: $companyName, contact: $contact, contactName: $contactName, email: $email, industry: $industry, size: $size, bio: $bio, address: $address, city: $city, country: $country, imageURL: $imageUrl, linkedinLink: $linkedinLink, socialLink: $socialLink, webLink: $webLink) {
                address
                bio
                city
                clientid
                companyName
                contact
                contactName
                country
                createdAt
                email
                imageURL
                industry
                linkedinLink
                role
                size
                socialLink
                walletAddress
                webLink
              }
            }
          `;

      const response = await fetch('https://decentwork.onrender.com/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: mutation,
          variables: {
            companyName: data.companyName,
            contact: data.contact,
            contactName: data.contactName,
            email: data.email,
            industry: data.industry,
            size: data.size,
            bio: data.bio || undefined,
            address: data.address || undefined,
            city: data.city || undefined,
            country: data.country || undefined,
            imageUrl: imageUrl || undefined,
            linkedinLink: data.linkedinLink || undefined,
            socialLink: data.socialLink || undefined,
            webLink: data.webLink || undefined,
          },
        }),
      });

      const result = await response.json();

      if (result.errors) {
        throw new Error(result.errors[0].message);
      }

      toast.success(
        existingData
          ? 'Profile updated successfully!'
          : 'Account created successfully!',
        {
          description: existingData
            ? 'Your changes have been saved.'
            : 'You can now start using your client account.',
        },
      );

      window.location.href =
        ApplicationRoutes.CLIENT_DASHBOARD || '/client-dashboard';
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(
        existingData ? 'Failed to update profile' : 'Failed to create account',
        {
          description:
            error instanceof Error ? error.message : 'Please try again.',
        },
      );
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
            Change Logo
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
              <Flex
                className={'w-4/5 mx-auto text-center'}
                direction={'column'}
                align={'center'}
                gap={'4'}
              >
                <Box>
                  <Heading className="font-poppins" size={'8'}>
                    {existingData
                      ? 'Update client profile'
                      : 'Setup client account'}
                  </Heading>
                  <p className="text-muted-foreground text-base mt-2 max-w-screen-md">
                    {existingData
                      ? 'Update your profile information to keep it current and attract top talent!'
                      : 'Complete your profile to post jobs and hire top talent!'}
                  </p>
                </Box>
                {isConnected && (
                  <Flex
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
                  </Flex>
                )}
              </Flex>

              <div className="bg-background mx-auto relative rounded-xl p-10 mt-10">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-4"></div>
                    <Text>Loading your profile data...</Text>
                  </div>
                ) : (
                  <>
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
                        <Text weight={'bold'}>Upload Your Logo</Text>
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
                          <p className="text-[#BEBEBE] text-sm font-circular">
                            JPG, PNG or GIF (max. 5MB)
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
                                  placeholder="e.g., Acme Corp"
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
                          name="contactName"
                          render={({ field }) => (
                            <FormItem className={'w-full'}>
                              <FormLabel>Contact Name</FormLabel>
                              <FormControl>
                                <Input
                                  className={'w-full h-12'}
                                  placeholder="e.g., John Doe"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                <Text size={'1'}>
                                  Your contact person&apos;s First Name and Last
                                  Name
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
                          name="contact"
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
                                      value={country?.name}
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

                      <Flex className={'w-full'}>
                        <FormField
                          control={control}
                          name="city"
                          render={({ field }) => (
                            <FormItem className={'w-full'}>
                              <FormLabel className="">City</FormLabel>
                              <FormControl>
                                <Input
                                  className="w-full h-12"
                                  placeholder="e.g., New York"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="text-xs font-normal" />
                            </FormItem>
                          )}
                        />
                      </Flex>

                      <Flex className={'w-full'}>
                        <FormField
                          control={control}
                          name="address"
                          render={({ field }) => (
                            <FormItem className={'w-full'}>
                              <FormLabel className="">Street address</FormLabel>
                              <FormControl>
                                <Input
                                  className="w-full h-12"
                                  placeholder="No 1, first street, avenue..."
                                  {...field}
                                  onChange={(e) => {
                                    field.onChange(e);
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
                          name="industry"
                          render={({ field }) => (
                            <FormItem className={'w-full'}>
                              <FormLabel>Industry</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="w-full h-12">
                                    <SelectValue placeholder="Select your industry" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="technology">
                                    Technology
                                  </SelectItem>
                                  <SelectItem value="finance">
                                    Finance
                                  </SelectItem>
                                  <SelectItem value="healthcare">
                                    Healthcare
                                  </SelectItem>
                                  <SelectItem value="education">
                                    Education
                                  </SelectItem>
                                  <SelectItem value="marketing">
                                    Marketing
                                  </SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
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
                          name="size"
                          render={({ field }) => (
                            <FormItem className={'w-full'}>
                              <FormLabel>Company Size</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="w-full h-12">
                                    <SelectValue placeholder="Select company size" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="1-10">
                                    1-10 employees
                                  </SelectItem>
                                  <SelectItem value="11-50">
                                    11-50 employees
                                  </SelectItem>
                                  <SelectItem value="51-200">
                                    51-200 employees
                                  </SelectItem>
                                  <SelectItem value="201-500">
                                    201-500 employees
                                  </SelectItem>
                                  <SelectItem value="500+">
                                    500+ employees
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
                          name="bio"
                          render={({ field }) => (
                            <FormItem className={'w-full'}>
                              <FormLabel>Bio</FormLabel>
                              <FormControl>
                                <textarea
                                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                  placeholder="Tell us about your company and what you do..."
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </Flex>

                      <Flex className={'w-full'} direction="column" gap="4">
                        <Flex className={'w-full'}>
                          <FormField
                            control={control}
                            name="webLink"
                            render={({ field }) => (
                              <FormItem className={'w-full'}>
                                <FormLabel>Website</FormLabel>
                                <FormControl>
                                  <Input
                                    className={'w-full h-12'}
                                    placeholder="e.g., https://www.acmecorp.com"
                                    type="url"
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
                            name="linkedinLink"
                            render={({ field }) => (
                              <FormItem className={'w-full'}>
                                <FormLabel>LinkedIn</FormLabel>
                                <FormControl>
                                  <Input
                                    className={'w-full h-12'}
                                    placeholder="e.g., https://www.linkedin.com/company/acmecorp"
                                    type="url"
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
                            name="socialLink"
                            render={({ field }) => (
                              <FormItem className={'w-full'}>
                                <FormLabel>Social Media</FormLabel>
                                <FormControl>
                                  <Input
                                    className={'w-full h-12'}
                                    placeholder="e.g., https://twitter.com/acmecorp"
                                    type="url"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </Flex>
                      </Flex>

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
                          className={'h-12'}
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
                              ? existingData
                                ? 'Updating Profile...'
                                : 'Creating Account...'
                              : existingData
                                ? 'Update Profile'
                                : 'Join as a Client'}
                        </Button>
                      </Flex>

                      <Flex
                        align={'center'}
                        className={'text-center'}
                        gap={'1'}
                        justify={'center'}
                      >
                        <Text>Already have an account?</Text>
                        <Link className={'font-medium text-primary'} href={'/'}>
                          Sign in
                        </Link>
                      </Flex>
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
