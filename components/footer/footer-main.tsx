import FooterCenter from './footer-center';
import FooterEnd from './footer-end';
import FooterStart from './footer-start';

const FooterMain = () => {
  return (
    <>
      <div className="bg-muted app-container">
        <div className="grid grid-cols-1 md:grid-cols-3 py-10 justify-between border-b border-gray-300">
          <FooterStart />

          <FooterCenter />

          <FooterEnd />
        </div>

        <div className="py-4 flex justify-center">
          <p className="text-[#545756] font-circular font-medium text-[14px]">
            &copy; 2025 Work. All rights reserved
          </p>
        </div>
      </div>
    </>
  );
};

export default FooterMain;
