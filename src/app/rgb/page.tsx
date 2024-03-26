"use client"

import React, { useState, useEffect } from 'react';

const GridComponent: React.FC = () => {
  const letterA = [
    [0, 0, 1, 1, 0, 0],
    [0, 1, 0, 0, 1, 0],
    [1, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 1]
  ];

  const [colors, setColors] = useState<string[]>([]);

  const backgroundColour = 'rgb(200, 200, 200)'; // 背景色
  const letterColour = 'rgb(0, 0, 0)'; // 字母色

  useEffect(() => {
    const newColors: string[] = letterA.flat().map(cell => cell ? letterColour : backgroundColour);
    setColors(newColors);
  }, []);

  return (
    <div className='w-64 grid grid-cols-6 gap-1'>
      {colors.map((color, index) => (
        <div
          key={index}
          className='w-10 h-10'
          style={{ backgroundColor: color }}
        ></div>
      ))}
    </div>
  );
};

export default GridComponent;
