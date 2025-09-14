import Link from 'next/link';

const quickLinks = [
  {
    label: 'About',
    link: '',
  },
  {
    label: 'Privacy Policy',
    link: '',
  },
  {
    label: 'Terms of Use',
    link: '',
  },
  {
    label: 'Customer Support',
    link: '',
  },
];

const FooterCenter = () => {
  return (
    <div className="flex mt-[40px] lg:mt-0">
      <div className="flex flex-col md:px-[20px] gap-y-3 lg:gap-y-5 text-[#545756] text-[15px] font-normal font-circular">
        {quickLinks.map((link) => {
          return (
            <Link className="font-normal" key={link.label} href={link.link}>
              {link.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default FooterCenter;
