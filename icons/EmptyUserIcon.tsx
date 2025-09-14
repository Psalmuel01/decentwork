import React from 'react';

type EmptyUserIconProps = {
  width?: number | string;
  height?: number | string;
};

export function EmptyUserIcon({
  width = 100,
  height = 100,
}: EmptyUserIconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_1717_6034)">
        <rect width="100" height="100" rx="50" fill="#F4F4F5" />
        <path
          d="M49.9175 23.1992C38.3109 23.1992 28.875 32.6351 28.875 44.2417C28.875 55.6268 37.7793 64.8412 49.3859 65.2399C49.7403 65.1956 50.0947 65.1956 50.3605 65.2399C50.4491 65.2399 50.4934 65.2399 50.582 65.2399C50.6263 65.2399 50.6263 65.2399 50.6706 65.2399C62.0114 64.8412 70.9157 55.6268 70.96 44.2417C70.96 32.6351 61.5241 23.1992 49.9175 23.1992Z"
          fill="white"
        />
        <path
          d="M72.4258 77.0236C60.0661 68.7838 39.9098 68.7838 27.4615 77.0236C21.8354 80.7891 18.7344 85.8836 18.7344 91.3325C18.7344 96.7814 21.8354 101.832 27.4172 105.553C33.6192 109.717 41.7702 111.799 49.9214 111.799C58.0726 111.799 66.2238 109.717 72.4258 105.553C78.0076 101.787 81.1086 96.7371 81.1086 91.2439C81.0643 85.795 78.0076 80.7448 72.4258 77.0236Z"
          fill="white"
        />
      </g>
      <defs>
        <clipPath id="clip0_1717_6034">
          <rect width="100" height="100" rx="50" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
