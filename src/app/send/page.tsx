"use client"

import React, { useState } from 'react';
import Step1 from '../_components/SendStep/Step1';
import Step2 from '../_components/SendStep/Step2';
import Step3 from '../_components/SendStep/Step3';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';


const SendGift: React.FC = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [gift, setGift] = useState('');
  const [recipient, setRecipient] = useState({ name: '', address: '' });
  const [stepStatus, setStepStatus] = useState({ step1: false, step2: false, step3: false });

  const handleGiftChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGift(e.target.value);
  };

  const handleRecipientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRecipient(prev => ({ ...prev, [name]: value }));
  };

  const toggleStep = (stepNumber: number) => {
    setActiveStep(prevStep => prevStep === stepNumber ? 0 : stepNumber);
  };

  const renderStepIcon = (step: number) => {
    return activeStep === step ? <ExpandLessIcon className='text-white001'/> : <ExpandMoreIcon  className='text-white001'/>;
  };

  return (
    <div className="container mx-auto">
      <div>
        <div>
          <div className="flex justify-between px-4 items-center h-16 bg-primary008" onClick={() => toggleStep(1)}>
            <div>
              <div className='text-white007 font-SourceSanPro text-labelmb'>Step 1/3</div>
              <div className='text-white001 font-PlayfairDisplay text-subheadermb'>Choose Your Gift</div>
            </div>
            {renderStepIcon(1)}
          </div>
          {activeStep === 1 && (
            <Step1 />
          )}
        </div>

        <div>
          <div className="flex justify-between px-4 items-center h-16 bg-primary008" onClick={() => toggleStep(2)}>
            <div>
              <div className='text-white007 font-SourceSanPro text-labelmb'>Step 2/3</div>
              <div className='text-white001 font-PlayfairDisplay text-subheadermb'>Provide Recipient Details</div>
            </div>
            {renderStepIcon(2)}
          </div>
          {activeStep === 2 && (
            <Step2 />
          )}
        </div>

        <div>
          <div className="flex justify-between px-4 items-center h-16 bg-primary008" onClick={() => toggleStep(3)}>
            <div>
              <div className='text-white007 font-SourceSanPro text-labelmb'>Step 3/3</div>
              <div className='text-white001 font-PlayfairDisplay text-subheadermb'>Confirm and Send</div>
            </div>
            {renderStepIcon(3)}
          </div>
          {activeStep === 3 && (
            <Step3 />
          )}
        </div>
      </div>
    </div>
  );
};

export default SendGift;
