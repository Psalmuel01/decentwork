'use client';
import { LucideChevronRight, X, Check } from 'lucide-react';
import { Button } from '../../ui/button';
import { useState } from 'react';
// import { MultiSelector } from '../../ui/multi-select';

type SkillsDetailsProps = {
  handleNext: () => void;
  step: number;
};

const categories = [
  'Admin Support',
  'Data Science & Analytics',
  'Designer and Creator',
  'Engineering & Architecture',
  'IT & Networking',
  'Translation',
  'Web, Mobile & Software Dev',
  'Writing',
];

const subcategoriesMap: Record<string, string[]> = {
  'Admin Support': [
    'Calendar Management',
    'Email Support',
    'Virtual Assistance',
  ],
  'Data Science & Analytics': [
    'Data Cleaning',
    'Data Visualization',
    'Statistical Modeling',
  ],
  'Designer and Creator': [
    'Audio & Music Production',
    'Art & Illustration',
    'Video & Animation',
    'Product Design',
  ],
  'Engineering & Architecture': [
    'CAD Design',
    'Mechanical Engineering',
    'Structural Planning',
  ],
  'IT & Networking': [
    'System Administration',
    'Network Setup',
    'Cybersecurity',
  ],
  Translation: ['English ↔ French', 'English ↔ Spanish', 'Transcription'],
  'Web, Mobile & Software Dev': [
    'Frontend Development',
    'Backend APIs',
    'Mobile Apps',
  ],
  Writing: ['Copywriting', 'Technical Writing', 'Blog Articles'],
};

const SkillsDetails = ({ handleNext, step }: SkillsDetailsProps) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>(
    [],
  );

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    setSelectedSubcategories([]); // Reset selection when switching categories
  };

  const toggleSubcategory = (subcategory: string) => {
    setSelectedSubcategories((prev: string[]) =>
      prev.includes(subcategory)
        ? prev.filter((item: string) => item !== subcategory)
        : [...prev, subcategory],
    );
  };

  const handleClearAll = () => {
    setSelectedSubcategories([]);
  };

  const subcategories = activeCategory
    ? subcategoriesMap[activeCategory] || []
    : [];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ensure skills are saved before proceeding
    handleNext();
  };

  return (
    <>
      <div className="mt-12 lg:px-5 mb-36">
        <div className="max-w-screen-lg mx-auto w-full">
          <p className="font-circular font-bold text-[#7E8082]">{step}/5</p>

          <h1 className="font-poppins font-semibold text-2xl mt-1">
            <span className="text-[#7E8082]">Awesome!</span> What type of work
            are you looking to do?
          </h1>

          <div className="text-[#7E8082] font-circular">
            You can always update your choices later.
          </div>

          <form onSubmit={handleFormSubmit}>
            <div className="bg-white relative rounded-xl p-10 mt-9 pb-20">
              <div className="flex flex-col md:flex-row">
                <div className="">
                  <h2 className="text-[#7E8082] text-[16px] mb-[15px] lg:mb-[30px]">
                    Select a category
                  </h2>
                  <ul className="space-y-2 flex flex-col gap-y-[5px] lg:gap-y-[10px] border-b-[#E4E4E7] md:border-b-none md:border-r-[#E4E4E7] border-b-[1px] md:border-r-[1px] pb-[20px] md:pb-0 pr-[70px]">
                    {categories.map((cat) => (
                      <li
                        key={cat}
                        onClick={() => handleCategoryClick(cat)}
                        className={`cursor-pointer text-sm font-medium ${
                          activeCategory === cat
                            ? 'text-[#1A73E8]'
                            : 'text-[#545756]'
                        }`}
                      >
                        {cat}
                      </li>
                    ))}
                  </ul>
                </div>

                {activeCategory && (
                  <div className="space-y-3 pt-[30px] md:pt-0 md:pl-[70px]">
                    <h2 className="text-[#7E8082] text-[16px] mb-[10px] lg:mb-[30px]">
                      Now, choose 1 to 3 specialties
                    </h2>
                    <ul className="space-y-2 flex flex-col gap-y-[5px] lg:gap-y-[10px]">
                      {subcategories.map((sub) => (
                        <li
                          key={sub}
                          className="flex items-center gap-2 text-[#545756] cursor-pointer text-gray-800"
                          onClick={() => toggleSubcategory(sub)}
                        >
                          <span
                            className={`rounded-full w-5 h-5 flex items-center justify-center border ${
                              selectedSubcategories.includes(sub)
                                ? 'border-[#1A73E8] text-[#1A73E8]'
                                : 'border-[#545756] text-[#545756]'
                            }`}
                          >
                            {selectedSubcategories.includes(sub) && (
                              <Check size={16} />
                            )}
                          </span>
                          <span className="text-sm">{sub}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Clear all */}
                    {selectedSubcategories.length > 0 && (
                      <button
                        onClick={handleClearAll}
                        className="flex items-center gap-2 text-red-500 text-sm font-medium mt-4"
                      >
                        <X size={16} className="stroke-[3]" />
                        Clear all
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="absolute flex items-center bottom-5 right-5 font-circular font-medium space-x-3">
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    handleNext();
                  }}
                  className="flex items-center space-x-3 bg-primary text-white"
                >
                  <p className="">Next</p>
                  <LucideChevronRight />
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default SkillsDetails;
