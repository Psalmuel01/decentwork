const NotificationCard = () => {
  return (
    <>
      <div className="flex items-center space-x-3">
        <div className="h-8 rounded-full w-8 bg-primary flex items-center justify-center text-white font-poppins text-[24px] font-semibold">
          A
        </div>

        <div className="font-circular">
          <p className="text-[#545756] text-sm">
            Work Identity Verification Request...
          </p>
          <p className="text-[#7E8082] text-xs mt-1">Now</p>
        </div>
      </div>
    </>
  );
};

export default NotificationCard;

// const NotificationCard = () => {
//     return (
//         <>
//             <div className=""></div>
//         </>
//     )
// }

// export default NotificationCard
