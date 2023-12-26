"use client"

import React, { useEffect, useState } from 'react';
import Step1 from '../_components/SendStep/Step1';
import Step2 from '../_components/SendStep/Step2';
import Step3 from '../_components/SendStep/Step3';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useSearchParams } from 'next/navigation';
import { transferSpore as _transferSpore } from '@spore-sdk/core';
import { QuerySpore } from '@/hooks/useQuery/type';

interface Step2Data {
  walletAddress: string;
  email: string;
  giftMessage: string;
}

const SendGift: React.FC = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [gift, setGift] = useState('');
  const [recipient, setRecipient] = useState({ name: '', address: '' });
  const [stepStatus, setStepStatus] = useState({ step1: false, step2: false, step3: false });
  const [step1Data, setStep1Data] = useState<QuerySpore>();
  const [step2Data, setStep2Data] = useState<Step2Data>();
  const [hasGift, setHasGift] = useState<string>()
  const searchParams = useSearchParams();

  const handleGiftChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGift(e.target.value);
  };

  useEffect(() => {
    const hasGiftValue = searchParams.get('hasGift');
    setHasGift(hasGiftValue ?? '');
  }, [searchParams])

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

  const handleStep1Selection = (selectedData: QuerySpore) => {
    setStep1Data(selectedData);
  };

  const _setStep2Data = (data: Step2Data) => {
    setStep2Data(data)
  }

  useEffect(() => {
    const type = searchParams.get('type');
    const address = searchParams.get('address');

    if (type && (type === 'gift' || type === 'blindbox') && address) {
      setActiveStep(2);
    } else {
      setActiveStep(1);
    }
  }, [searchParams]);

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
            <Step1 onSelection={handleStep1Selection} selected={step1Data} hasGift={hasGift}/>
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
            <Step2 data={step2Data} setData={_setStep2Data}/>
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
          {(activeStep === 3 && step1Data && step2Data ) && (
            <Step3 step1Data={step1Data} step2Data={step2Data} />
          )}
        </div>
      </div>
    </div>
  );
};

export default SendGift;
