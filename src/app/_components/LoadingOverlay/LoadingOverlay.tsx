import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import ProgressBar from '@/app/_components/ProgressBar/ProgressBar';

interface LoadingOverlayProps {
  isVisible: boolean;
  texts: string[];
  progressStatus: 'pending' | 'done';
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isVisible, texts, progressStatus }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  // Typing and deleting animation for "Philosopher Stone"
  useEffect(() => {
    let text = 'Philosopher\'s Stone';
    let i = 0;
    let isDeleting = false;

    const type = () => {
      if (isDeleting) {
        setDisplayedText(text.slice(0, i--));
        if (i === 0) isDeleting = false;
      } else {
        setDisplayedText(text.slice(0, i++));
        if (i === text.length) {
          isDeleting = true;
        }
      }

      setTimeout(type, isDeleting ? 50 : 100);
    };

    if (isVisible) {
      type();
    } else {
      setDisplayedText('');
    }
  }, [isVisible]);

  // Changing random text every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(Math.floor(Math.random() * texts.length));
    }, 10000);

    return () => clearInterval(interval);
  }, [texts.length]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-primary011 bg-opacity-90 flex items-center justify-center">
      <div className='w-full px-4 flex flex-col items-center justify-center'>
        <Image
          className='mb-8'
          alt={"logo"}
          src={"/svg/ps-logo-light.svg"}
          width={174}
          height={40}
        />
        <ProgressBar status={progressStatus} />
        <p className="text-white001 font-SourceSanPro mt-4"> {texts[currentIndex]}</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
