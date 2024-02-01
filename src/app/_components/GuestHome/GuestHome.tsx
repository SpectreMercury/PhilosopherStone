"use client"

import React, { useState } from 'react';
import WalletModal from '../WalletModal/WalletModal';
import Image from 'next/image';

const GuestHome = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-[340px] h-[170px] bg-cover bg-center">
        <Image 
            width={340}
            height={170}
            alt='gift demo'
            src={'/svg/gift.svg'}
        />
      </div>
      <p className="text-center my-12 max-w-[340px] font-SourceSanpro text-body1mb text-white001">
        Unveil Joy, Share Wonder: Your Surprises, Your Stories, Your Blind Box Adventure!
      </p>
      <button 
        className="w-[340px] h-[48px] bg-white001 border border-primary003 text-buttonmb font-SourceSanPro text-primary011 py-2 px-4 rounded" 
        onClick={() => setShowModal(true)}
      >
        Log in
      </button>
      {showModal && <WalletModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default GuestHome;
