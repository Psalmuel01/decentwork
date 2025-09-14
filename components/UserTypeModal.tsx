'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import FreelancerIcon from '@/icons/join/freelancer';
import { Label } from '@/components/ui/label';

import LaptopIcon from '@/icons/join/laptop';
import { ApplicationRoutes } from '@/config/routes';
import { useRouter } from 'next/navigation';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

// interface GetRoleResponse {
//   code: string;
//   message: string;
//   role: string | null;
//   success: boolean;
// }

export function UserTypeModal() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [userType, setUserType] = useState<'freelancer' | 'client'>(
    'freelancer',
  );
  const [isCheckingRole, setIsCheckingRole] = useState(false);

  const checkExistingRole = async () => {
    try {
      setIsCheckingRole(true);
      const token = localStorage.getItem('authToken');

      if (!token) {
        return;
      }

      const response = await fetch('https://decentwork.onrender.com/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: `
            query GetRole {
              getRole {
                code
                message
                role
                success
              }
            }
          `,
        }),
      });

      const result = await response.json();

      if (result.data?.getRole?.success && result.data.getRole.role) {
        const role = result.data.getRole.role;

        // Automatically redirect based on existing role
        if (role === 'Client') {
          router.push(ApplicationRoutes.CLIENT_DASHBOARD);
        } else if (role === 'Freelancer') {
          router.push(ApplicationRoutes.FREELANCER_DASHBOARD);
        }

        setIsOpen(false);
      }
      // If no role exists, modal will remain open for user selection
    } catch (error) {
      console.error('Error checking existing role:', error);
      // If error occurs, let user select role manually
    } finally {
      setIsCheckingRole(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      checkExistingRole();
    }
  }, [isOpen]);

  const handleJoin = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    userType === 'client'
      ? router.push(ApplicationRoutes.CLIENT_DASHBOARD)
      : router.push(ApplicationRoutes.FREELANCER_DASHBOARD);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={'default'}>Go to Dashboard</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-poppins font-semibold text-[20px] text-center">
            {isCheckingRole
              ? 'Checking your role...'
              : 'Join as a Client or Freelancer'}
          </DialogTitle>
        </DialogHeader>

        {isCheckingRole ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-sm text-gray-600">Please wait...</p>
            </div>
          </div>
        ) : (
          <div className="">
            <RadioGroup
              defaultValue={userType}
              className="flex flex-col gap-y-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="client"
                  id="client"
                  onClick={() => setUserType('client')}
                  className="hidden" // Hide the default radio button
                />

                <Label
                  htmlFor="client"
                  className="border-gray-300 border cursor-pointer rounded-md w-full p-4 flex justify-between items-center"
                >
                  <div className="flex space-x-3">
                    <LaptopIcon className="w-9 h-9" />
                    <div className="">
                      <p className="font-poppins font-semibold text-base text-[#545756]">
                        I&apos;m a Client
                      </p>
                      <p className="text-[14px] text-[#7E8082] font-normal font-circular">
                        Hiring skill professionals
                      </p>
                    </div>
                  </div>

                  <div
                    className={`h-4 w-4 rounded-full border-2 border-gray-300 flex items-center justify-center ${
                      userType === 'client' ? 'border-primary' : ''
                    }`}
                  >
                    {userType === 'client' && (
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                    )}
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="freelancer"
                  id="freelancer"
                  onClick={() => setUserType('freelancer')}
                  className="hidden" // Hide the default radio button
                />

                <Label
                  htmlFor="freelancer"
                  className="border-gray-300 border cursor-pointer rounded-md w-full p-4 flex justify-between items-center"
                >
                  <div className="flex space-x-3">
                    <FreelancerIcon className="w-9 h-9" />
                    <div className="">
                      <p className="font-poppins font-semibold text-base text-[#545756]">
                        I&apos;m a Freelancer
                      </p>
                      <p className="text-[14px] text-[#7E8082] font-normal font-circular">
                        Seeking job opportunities
                      </p>
                    </div>
                  </div>
                  <div
                    className={`h-4 w-4 rounded-full border-2 border-gray-300 flex items-center justify-center ${
                      userType === 'freelancer' ? 'border-primary' : ''
                    }`}
                  >
                    {userType === 'freelancer' && (
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                    )}
                  </div>
                </Label>
              </div>
            </RadioGroup>

            <div className="">
              <Button
                onClick={() => {
                  handleJoin();
                }}
                className="bg-primary text-white w-full mt-6 py-6"
              >
                Join as a {userType === 'freelancer' ? 'Freelancer' : 'Client'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
