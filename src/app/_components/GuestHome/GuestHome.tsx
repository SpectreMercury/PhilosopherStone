"use client"

import React, { useState } from 'react';
import WalletModal from '../WalletModal/WalletModal';
import Image from 'next/image';
import Link from 'next/link';
import Button from '@/app/_components/Button/Button';

const GuestHome = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="px-4 flex flex-col items-center justify-center">
      <div className='text-hd1mb font-Montserrat text-white001 text-center my-12'>Philosopher&apos;s Stone</div>
      <div className="w-full h-auto bg-cover bg-center flex items-center justify-center">
        <Image 
            width={343}
            height={170}
            alt='gift demo'
            src={'/svg/ps-welcome.svg'}
        />
      </div>
      <p className="text-center my-12 max-w-[340px] font-SourceSanpro text-body1mb text-white001">
        Unveil Joy, Share Wonder: Your Surprises, Your Stories, Your Blind Box Adventure!
      </p>
      <Button type='solid' label='Log in' onClick={() => setShowModal(true)} />
      <Link href={'/FAQ'} className='block mx-auto text-linkColor font-SourceSanPro text-body1mb text-center mt-6'>
        Learn more
      </Link>
      {showModal && <WalletModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default GuestHome;
