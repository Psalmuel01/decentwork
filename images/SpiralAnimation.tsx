const SpiralAnimation = ({ className }: { className: string }) => {
  return (
    <>
      <svg
        className={className}
        width="130"
        height="209"
        viewBox="0 0 130 209"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M128.295 1.5C104.165 42.1603 133.55 100.491 115.9 120.093C98.2499 139.695 59.973 65.5973 75.4387 55.0793C90.9043 44.5613 123.401 119.775 95.7591 140.242C68.117 160.708 17.5905 98.0243 34.7441 84.3926C51.8978 70.761 96.9353 129.406 72.2082 162.829C47.481 196.253 2.24902 203.837 2.24902 203.837"
          stroke="#EEEEEE"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13.4446 194.6C13.4446 194.6 6.74698 201.51 1.00065 204.293C8.42584 204.293 15.9933 207.33 15.9933 207.33"
          stroke="#EEEEEE"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </>
  );
};

export default SpiralAnimation;
