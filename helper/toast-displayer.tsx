import {
  LucideCircleAlert,
  LucideCircleCheck,
  LucideInfo,
  LucideTriangleAlert,
} from 'lucide-react';
import { Toast, ToasterToast } from '../hooks/use-toast';
import { cn } from '../lib/utils';

type ToastProps = {
  toast: ({ ...props }: Toast) => {
    id: string;
    dismiss: () => void;
    update: (props: ToasterToast) => void;
  };
  messageType: MessageType;
  message: string;
};

type MessageType = 'success' | 'error' | 'info' | 'warning';

export const displayToast = ({ messageType, message, toast }: ToastProps) => {
  toast({
    description: (
      <ToastComponent
        className={cn(
          'border-2 rounded-lg bg-white  font-semibold z-[1000000]  w-full p-4 md:pr-20',
          { 'border-[#02AA63] text-[#02AA63]': messageType === 'success' },
          { 'border-[#F72727] text-[#F72727]': messageType === 'error' },
          { 'border-[#8048FF] text-[#8048FF]': messageType === 'info' },
          { 'border-[#E68C00] text-[#E68C00]': messageType === 'warning' },
        )}
        message={message}
        messageType={messageType}
      />
    ),
    className: 'p-0',
  });
};

const ToastComponent = ({
  className,
  message,
  messageType,
}: {
  className: string;
  message: string;
  messageType: MessageType;
}) => {
  return (
    <>
      <div className={className}>
        <div className="flex items-center space-x-3">
          {messageType === 'success' && (
            <LucideCircleCheck
              size={24}
              className="text-white"
              fill="#02AA63"
            />
          )}
          {messageType === 'error' && (
            <LucideCircleAlert
              size={24}
              className="text-white"
              fill="#F72727"
            />
          )}
          {messageType === 'info' && (
            <LucideInfo size={24} className="text-white" fill="#8048FF" />
          )}
          {messageType === 'warning' && (
            <LucideTriangleAlert
              size={24}
              className="text-white"
              fill="#E68C00"
            />
          )}

          <p className="text-sm font-normal text-black leading-[16.94px]">
            {message}
          </p>
        </div>
      </div>
    </>
  );
};

//
