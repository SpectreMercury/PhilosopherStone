"use client"

import React, { useEffect, useState } from 'react';

interface Step2Data {
  walletAddress: string;
  email: string;
  giftMessage: string;
}

interface Step2Props {
  data?: Step2Data;
  setData: (data: Step2Data) => void;
}
const Step2: React.FC<Step2Props> = ({ data, setData }) => {
  const [walletAddress, setWalletAddress] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [message, setMessage] = useState('');
  // const [deliveryDate, setDeliveryDate] = useState('');

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const emailValue = e.target.value;
    setEmail(emailValue);
    setEmailError(!/\S+@\S+\.\S+/.test(emailValue));
  };

  useEffect(() => {
    // Check if data has changed
    if (data?.walletAddress !== walletAddress || data.email !== email || data.giftMessage !== message) {
      setData({
        walletAddress,
        email,
        giftMessage: message
      });
    }
  }, [walletAddress, email, message, data, setData]);


  const handleNext = () => {
    setData({
      walletAddress,
      email,
      giftMessage: message
    })
  }

  return (
    <div className='px-4 mt-8'>
      <div className='text-labelmb text-white001 font-SourceSanPro mb-2'>Wallet Address *</div>
      <input 
        type="text" 
        id="walletAddress"
        className='block w-full h-12 rounded-md bg-primary005 px-4 text-white001'
        placeholder='E.g. 0xAbCdEfGhIjKlMnOpQrStUvWxYz0123456789'
        value={walletAddress}
        onChange={(e) => setWalletAddress(e.target.value)}
      />

      <div className='text-labelmb text-white001 font-SourceSanPro mb-2 mt-4'>Email</div>
      <input 
        type="email" 
        id="email"
        value={email}
        
        onChange={handleEmailChange}
        className={`block w-full h-12 rounded-md bg-primary005 text-white001 px-4 ${emailError ? 'error ' : ''}`}
      />
      {emailError && <p className="error-message">Email format is incorrect</p>}

      <div className='text-labelmb text-white001 font-SourceSanPro mb-2 mt-4'>Gift Message</div>
      <textarea 
        id="message"
        value={message}
        className='block w-full h-24 rounded-md bg-primary005 p-4 text-white001'
        onChange={(e) => setMessage(e.target.value)}
      />

      {/* <div className='text-labelmb text-white001 font-SourceSanPro mb-2 mt-4'>Delivery date</div>
      <input 
        type="date" 
        id="deliveryDate"
        className='block w-full h-12 rounded-md bg-primary005 px-4'
        value={deliveryDate}
        onChange={(e) => setDeliveryDate(e.target.value)}
      /> */}
      <div className='flex gap-6 my-8'>
        <button 
          className="flex-1 h-12 font-PlayfairDisplay border border-white002 bg-primary011 text-white001 py-2 px-4 rounded"
        >
            Back
        </button>
        <button 
          className="flex-1 flex items-center justify-center h-12 font-PlayfairDisplay border border-white002 bg-white001 text-primary011 py-2 px-4 rounded"
          onClick={handleNext}
        >
            Next
        </button>
      </div>
    </div>
  );
};

export default Step2;
