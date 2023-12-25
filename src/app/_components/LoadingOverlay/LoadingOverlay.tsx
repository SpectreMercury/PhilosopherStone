import React, { useEffect, useState } from 'react';

interface LoadingOverlayProps {
  isVisible: boolean;
  texts: string[];
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isVisible, texts }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  // Typing and deleting animation for "Philosopher Stone"
  useEffect(() => {
    let text = 'Philosopher Stone';
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
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div>
        <h1 className="text-white text-2xl">{displayedText}</h1>
        <p className="text-white mt-4">{texts[currentIndex]}</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
