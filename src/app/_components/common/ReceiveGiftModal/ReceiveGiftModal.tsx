import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface ReceiveGiftModalProps {
    isReceiveGiftModalOpen: boolean,
    closeReceiveGiftModal: () => void
}

const ReceiveGiftModal: React.FC<ReceiveGiftModalProps> = ({isReceiveGiftModalOpen, closeReceiveGiftModal}) => {
    return (
        <div className={`${isReceiveGiftModalOpen ? 'fixed' : 'hidden'} w-full inset-0 bg-primary006 bg-opacity-30 flex justify-center items-center z-10`}>
            <div className=" bg-primary011 border border-primary004 p-6 rounded-lg shadow-l relative w-ful flex flex-col gap-6">
                <button onClick={closeReceiveGiftModal} className="absolute top-2 right-2">
                    <Image 
                        src='/svg/icon-x.svg'
                        width={24}
                        height={24}
                        alt='close modal'
                    />
                </button>
                <img
                    alt='gift'
                    src='/svg/ps-blindbox-empty.svg'
                    className='mt-6'
                />
                <Link href='/newGifts' className="w-full h-12 text-center text-buttonmb font-SourceSanPro border border-white002 bg-white001 text-primary011 py-2 px-4 rounded">
                Open Gift
                </Link>
            </div>
        </div>

    )
}

export default ReceiveGiftModal