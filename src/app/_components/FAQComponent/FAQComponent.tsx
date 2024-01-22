// components/Faq.tsx
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Image from 'next/image';

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqProps {
  items: FaqItem[];
  linkColor: string;
}

const FAQComponent: React.FC<FaqProps> = ({ items, linkColor }) => {
  const [openItemIndex, setOpenItemIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    if (openItemIndex === index) {
      setOpenItemIndex(null);
    } else {
      setOpenItemIndex(index);
    }
  };

  return (
    <div>
      <div className='text-primary001 text-center text-hd3mb font-Montserrat mt-8 w-[66px] py-2'>FAQ</div>
      {items.map((item, index) => (
        <div key={index} className="border-b border-white009">
          <div className="flex justify-between items-center p-4 cursor-pointer" onClick={() => toggleItem(index)}>
            <p className="text-white001 font-SourceSanPro text-body1bdmb">{item.question}</p>
            <button className='text-white001'>
              {openItemIndex === index ? 
                <Image 
                  src='/svg/icon-minus.svg' 
                  width={18}
                  height={18}
                  alt='Collapse answer'
                />
              : 
              <Image 
                  src='/svg/icon-plus.svg' 
                  width={18}
                  height={18}
                  alt='View answer'
                />
              }
            </button>
          </div>
          {openItemIndex === index && (
            <div className="pt-2 pb-4 px-4 text-white001">
              <ReactMarkdown className={`text-white003 font-SourceSanPro link-color-${linkColor}`} remarkPlugins={[remarkGfm]}>
                {item.answer}
              </ReactMarkdown>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FAQComponent;
