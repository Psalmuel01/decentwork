'use client';

import { FormProvider, useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { StepperFormValues } from '@/hooks/hook-stepper';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';
import { useXionWallet } from '@/context/xion-context';
import { freelancerProfileService } from '@/services/freelancer-profile';
import { supabase } from '@/lib/supabase';
import CompanyDetails from '@/components/client/client-setup/company';
import { Button } from '@/components/ui/button';
import FinalDetails from '@/components/client/client-setup/final';
import CompanySocials from '@/components/client/client-setup/companySocials';
import CompanyAddress from '@/components/client/client-setup/companyAddress';
import { useRouter } from 'next/navigation';
import { ApplicationRoutes } from '@/config/routes';
import NewUsersStartPage from '@/components/freelancer/freelancer-setup/new-user-start-page';
import SubmitDetails from '@/components/freelancer/freelancer-setup/submit';
import PrimaryContact from '@/components/client/client-setup/primaryContact';

export default function Page() {
  const { isConnected, address } = useXionWallet();
  const [activeStep, setActiveStep] = useState(1);
  const [erroredInputName, setErroredInputName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const methods = useForm<StepperFormValues>({
    mode: 'onTouched',
  });
  const router = useRouter();
  const { isNewFreelanceUser } = useAuth();

  const { toast } = useToast();

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

  useEffect(() => {
    if (isConnected) {
      setActiveStep(2);
    }
  }, [isConnected, router]);

  const onSubmit = async (formData: StepperFormValues) => {
    if (!address) {
      toast({
        title: 'Error',
        description: 'Please connect your wallet first',
        variant: 'destructive',
      });
      return;
    }

    // Sign in anonymously
    const { error } = await supabase.auth.signInAnonymously({
      options: {
        data: {
          email: address,
        },
      },
    });

    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Handle profile picture upload if exists
      let profilePictureUrl = null;
      if (formData.profile_picture instanceof File) {
        profilePictureUrl = await freelancerProfileService.uploadProfilePicture(
          formData.profile_picture,
          address,
        );
      }

      // Create profile with uploaded picture URL
      const profileData = {
        ...formData,
        profile_picture: profilePictureUrl,
      };

      // @ts-expect-error "Negligible error"
      await freelancerProfileService.createProfile(profileData, address);

      toast({
        title: 'Success',
        description: 'Profile created successfully',
      });

      router.push(ApplicationRoutes.FREELANCER_DASHBOARD);
    } catch (error) {
      console.error('Error creating profile:', error);
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Failed to create profile',
        variant: 'destructive',
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
      case 1:
        return <NewUsersStartPage handleNext={handleNext} step={step} />;
      //   case 2:
      //     return (
      //       <WorkTypeDetails handleBack={handleBack} handleNext={handleNext} />
      //     );
      case 2:
        return (
          <CompanyDetails
            handleBack={handleBack}
            handleNext={handleNext}
            step={step}
          />
        );
      case 3:
        return (
          <CompanyAddress
            handleBack={handleBack}
            handleNext={handleNext}
            step={step}
          />
        );
      case 4:
        return (
          <PrimaryContact
            handleBack={handleBack}
            handleNext={handleNext}
            step={step}
          />
        );
      case 5:
        return (
          <CompanySocials
            handleBack={handleBack}
            handleNext={handleNext}
            step={step}
          />
        );
      case 6:
        return (
          <FinalDetails
          // handleBack={handleBack}
          // handleNext={handleNext}
          // step={step}
          />
        );
      case 7:
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
