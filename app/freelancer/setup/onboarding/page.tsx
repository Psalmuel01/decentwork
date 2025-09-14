'use client';

import { FormProvider, useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { StepperFormValues } from '@/hooks/hook-stepper';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';
import SkillsDetails from '@/components/freelancer/freelancer-setup/skills';
import { Button } from '@/components/ui/button';
import Speciality from '@/components/freelancer/freelancer-setup/speciality';
import RateDetails from '@/components/freelancer/freelancer-setup/rate';
import BioDetails from '@/components/freelancer/freelancer-setup/bio';
import { useRouter } from 'next/navigation';
import { ApplicationRoutes } from '@/config/routes';
import SubmitDetails from '@/components/freelancer/freelancer-setup/submit';
import LanguageDetails from '@/components/freelancer/freelancer-setup/language';
import { toast } from 'sonner';

export default function Page() {
  const [activeStep, setActiveStep] = useState(1);
  const [erroredInputName, setErroredInputName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const methods = useForm<StepperFormValues>({
    mode: 'onTouched',
  });
  const router = useRouter();
  const { isNewFreelanceUser } = useAuth();

  const {
    trigger,
    handleSubmit,
    // setError,
    formState: { errors },
  } = methods;

  useEffect(() => {
    const erroredInputElement =
      document.getElementsByName(erroredInputName)?.[0];
    if (erroredInputElement instanceof HTMLInputElement) {
      erroredInputElement.focus();
      setErroredInputName('');
    }
  }, [erroredInputName]);

  const onSubmit = async (formData: StepperFormValues) => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        toast.error('Authentication token not found', {
          description: 'Please login again.',
        });
        return;
      }

      // Handle image upload if exists
      let imageUrl = '';
      if (formData.profile_picture instanceof File) {
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
            mutation CreateFreelancer(
              $address: String!
              $bio: String!
              $category: String!
              $city: String!
              $country: String!
              $dateOfBirth: String!
              $email: String!
              $fluency: String!
              $hourlyRate: Float!
              $language: String!
              $name: String!
              $phoneNumber: String!
              $postalCode: String!
              $skills: [String!]!
              $speciality: String!
              $title: String!
              $imageUrl: String
            ) {
              createFreelancer(
                address: $address
                bio: $bio
                category: $category
                city: $city
                country: $country
                dateOfBirth: $dateOfBirth
                email: $email
                fluency: $fluency
                hourlyRate: $hourlyRate
                language: $language
                name: $name
                phoneNumber: $phoneNumber
                postalCode: $postalCode
                skills: $skills
                speciality: $speciality
                title: $title
                imageURL: $imageUrl
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
            address: formData.address || '',
            bio: formData.bio || '',
            category: formData.category || '',
            city: formData.city || '',
            country: formData.country || '',
            dateOfBirth: formData.date_of_birth
              ? typeof formData.date_of_birth === 'string'
                ? formData.date_of_birth
                : new Date(formData.date_of_birth).toISOString().split('T')[0]
              : '',
            email: formData.email || '',
            fluency: formData.englishFluency || '',
            hourlyRate: Number(formData.rate) || 0,
            language: formData.language || '',
            name: formData.fullname || '',
            phoneNumber: formData.phone || '',
            postalCode: formData.zipcode?.toString() || '',
            skills: formData.skills || [],
            speciality:
              formData.specialities && formData.specialities.length > 0
                ? formData.specialities[0]
                : '',
            title: formData.title || '',
            imageUrl: imageUrl,
          },
        }),
      });

      const result = await response.json();

      if (result.errors) {
        throw new Error(result.errors[0].message);
      }

      toast.success('Freelancer profile created successfully!', {
        description: 'Welcome to the platform!',
      });

      router.push(ApplicationRoutes.FREELANCER_DASHBOARD);
    } catch (error) {
      console.error('Error creating freelancer profile:', error);
      toast.error('Failed to create profile', {
        description:
          error instanceof Error ? error.message : 'Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = async () => {
    const isStepValid = await trigger(undefined, { shouldFocus: true });
    console.log('isStepValid', isStepValid);
    if (isStepValid) setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const getStepContent = (step: number) => {
    switch (step) {
      // case 1:
      //   return <NewUsersStartPage handleNext={handleNext} step={step} />;
      //   case 2:
      //     return (
      //       <WorkTypeDetails handleBack={handleBack} handleNext={handleNext} />
      //     );
      case 1:
        return <Speciality handleNext={handleNext} step={step} />;
      case 2:
        return (
          <SkillsDetails
            handleBack={handleBack}
            handleNext={handleNext}
            step={step}
          />
        );
      case 3:
        return (
          <BioDetails
            handleBack={handleBack}
            handleNext={handleNext}
            step={step}
          />
        );
      case 4:
        return (
          <LanguageDetails
            handleBack={handleBack}
            handleNext={handleNext}
            step={step}
          />
        );
      case 5:
        return (
          <RateDetails
            handleBack={handleBack}
            handleNext={handleNext}
            step={step}
          />
        );
      case 6:
        return (
          <SubmitDetails
            setActiveStep={setActiveStep}
            handleBack={handleBack}
            onSubmit={handleSubmit(onSubmit)}
          />
        );
      default:
        return 'Unknown step';
    }
  };

  useEffect(() => {
    if (!isNewFreelanceUser && activeStep !== 6) {
      router.push(ApplicationRoutes.FREELANCER_DASHBOARD);
    }
  }, [isNewFreelanceUser, router, activeStep]);

  return (
    <>
      {/* Stepper indicator */}

      {errors.root?.formError && (
        <Alert variant="destructive" className="mt-[28px]">
          {/* <ExclamationTriangleIcon className="h-4 w-4" /> */}
          <AlertTitle>Form Error</AlertTitle>
          <AlertDescription>{errors.root?.formError?.message}</AlertDescription>
        </Alert>
      )}

      <FormProvider {...methods}>
        {getStepContent(activeStep)}
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="hidden flex justify-center space-x-[20px]">
            {activeStep > 1 && (
              <Button
                type="button"
                className="w-[100px]"
                variant="secondary"
                onClick={handleBack}
              >
                Back
              </Button>
            )}

            {activeStep === 7 ? (
              <Button
                className="w-[100px]"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
            ) : (
              <Button type="button" className="w-[100px]" onClick={handleNext}>
                Next
              </Button>
            )}
          </div>
        </form>
      </FormProvider>
    </>
  );
}
