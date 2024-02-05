import React from 'react';
import Image from 'next/image';

interface TipProps {
  type: 'Gift' | 'Blind Box';
	className?: string | undefined;
}

const TIP_MESSAGES = {
	'Gift': 'Try uploading an image as your Gift and mint it using the corresponding CKB amount.',
	'Blind Box': 'Create a Blind Box and surprise someone! Fill it with gifts, send it out, and let the mystery unfold upon reveal!',
};

const Tip: React.FC<TipProps> = ({ type, className }) => {
  return (
    <div className={`${className} rounded p-2 bg-primary010 w-full flex gap-2 justify-start items-start`}>
			<Image 
				src='/svg/icon-lightbulb.svg'
				width={18}
				height={18}
				alt='tip'
			/>
      <p className='text-labelmb font-SourceSanPro text-white001'>{TIP_MESSAGES[type]}</p>
    </div>
  );
};

export default Tip;
