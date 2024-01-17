import React, { useState, useEffect } from 'react';

const ProgressBar = ({ status }: { status: 'pending' | 'done' }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: string | number | NodeJS.Timeout | undefined;

    if (status === 'pending' && progress < 90) {
      interval = setInterval(() => {
        setProgress((oldProgress) => {
          const newProgress = Math.min(oldProgress + 3, 90);
          return newProgress >= 90 ? Math.floor(Math.random() * (99 - 90 + 1) + 90) : newProgress;
        });
      }, 333);
    }

    if (status === 'done') {
      setProgress(100);
    }

    return () => {
      clearInterval(interval);
    };
  }, [status, progress]);

  return (
    <div className="w-full bg-primary008 h-2 rounded-lg">
      <div
        style={{ width: `${progress}%` }}
        className=" bg-primary003 h-2 transition-all ease-in-out duration-300 rounded-lg"
      />
    </div>
  );
};

export default ProgressBar;
