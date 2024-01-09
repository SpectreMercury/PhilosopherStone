// components/Faq.tsx
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqProps {
  items: FaqItem[];
  linkColor: string;
}

const Faq: React.FC<FaqProps> = ({ items, linkColor }) => {
  const [openItemIndex, setOpenItemIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    if (openItemIndex === index) {
      setOpenItemIndex(null);
    } else {
      setOpenItemIndex(index);
    }
  };

  return (
    <div id="faq">
      <div className=' text-primary001 text-hd1mb mt-8 border-b-4 w-[66px] border-primary005 py-2'>FAQ</div>
      {items.map((item, index) => (
        <div key={index} className="border-b border-gray-200">
          <div className="flex justify-between items-center p-4">
            <h2 className="text-white001 font-SourceSanPro text-hd3mb">{item.question}</h2>
            <button className='text-white001' onClick={() => toggleItem(index)}>
              {openItemIndex === index ? '-' : '+'}
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

export default Faq;
