"use client"

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import CreateModal from '@/app/_components/CreateModal/CreateModal';
import CreateGift from '@/app/_components/CreateModal/Gift';
import GiftList from '@/app/_components/List/GiftList';
import CreateBlindBox from '@/app/_components/CreateModal/CreateBlindBox';
import { useSporesByAddressQuery } from '@/hooks/useQuery/useSporesByAddress';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { QuerySpore } from '@/hooks/useQuery/type';
import { useSearchParams } from 'next/navigation';
import Tip from '@/app/_components/Tip/Tip';
import Button from '@/app/_components/Button/Button';


const LoadingSkeleton = () => {
  return (
    <div>
      <div className="relative my-8 h-[180px] bg-gray-200 animate-pulse"></div>
      <p className="text-center my-8 text-white001 text-hd2mb font-Montserrat bg-gray-300 rounded"></p>
    </div>
  );
};

const UserHome: React.FC = () => {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<'Gift' | 'Blind Box'>(decodeURIComponent(searchParams.get('type') || '') === 'Blind Box' ? 'Blind Box' : 'Gift');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const walletAddress = useSelector((state: RootState) => state.wallet.wallet?.address);
  const { data: spores, isLoading: isSporesLoading } = useSporesByAddressQuery(
    walletAddress as string,
  );
  const storeSporesList = useSelector((state: RootState) => state.spores.spores);
  const [sporesList, setSporesList] = useState<QuerySpore[] | []>([])
  const [blindBoxList, setBlindBoxList] = useState<[]>([]) 

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const changeTabType = () => {
    setActiveTab('Gift')
  }

  const getBlindBoxData = async () => {
    const response = await fetch('/api/blindbox', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'getList', key: walletAddress}),
    });
    const data = await response.json();
    setBlindBoxList(data.data);
  }
  
  useEffect(() => {
    if (activeTab === 'Gift') {
      setSporesList(storeSporesList || []);
    } else {
      getBlindBoxData()
    }
  }, [storeSporesList, activeTab]);

  useEffect(() => {
    let type = searchParams.get('type')
    if (type && decodeURIComponent(type) === 'Gift') {
      setActiveTab('Gift')
    } else if (type && decodeURIComponent(type) === 'Blind Box') {
      setActiveTab('Blind Box')
    }
  }, [searchParams])

  useEffect(() => {
    getBlindBoxData()
  }, [isModalOpen])


  const renderContent = () => {
    if (isSporesLoading && activeTab === 'Gift') {
      return <LoadingSkeleton />;
    }

    const currentList = activeTab === 'Gift' ? spores : blindBoxList

    if (currentList && currentList.length > 0) {
      return <GiftList onNewGiftClick={handleOpenModal} list={spores} type={activeTab} blindboxList={blindBoxList} />;
    } else {
      return (
        <div>
          <div className="relative my-8 min-h-[170px]">
            <Image
              alt='gift'
              src={`${activeTab === 'Gift' ? '/svg/ps-gift-empty.svg' : '/svg/ps-blindbox-empty.svg'}`}
              layout='fill'
              objectFit='contain'
            />
          </div>
          <p className="text-center my-8 text-white001 text-hd2mb font-Montserrat">
            {`${activeTab === 'Gift' ? 'Start Creating Your First On-Chain Gift!' : 'Start Creating Your First Blind Box!'}`}
          </p>
        </div>
      );
    }
  };


  
  return (
    <div className="container mx-auto px-4 pb-12">
      <div className="flex rounded-md bg-primary011 mt-8">
        <button
          className={`flex-1 py-2 m-1 text-white font-SourceSanPro ${activeTab === 'Gift' ? 'bg-primary010 text-labelbdmb' : 'text-labelmb text-white005'} rounded-md`}
          onClick={() => setActiveTab('Gift')}
        >
          My Gifts
        </button>
        <button
          className={`flex-1 py-1 m-1 text-white font-SourceSanPro ${activeTab === 'Blind Box' ? 'bg-primary010 text-labelbdmb' : 'text-labelmb text-white005'} rounded-md `}
          onClick={() => {
            setActiveTab('Blind Box')
          }}
        >
          My Blind Boxes
        </button>
      </div>
      { renderContent() }
      <Button type='solid' onClick={handleOpenModal} label={'Create ' + activeTab}/>
      <Tip className='mt-6' type={activeTab}/>
      {isModalOpen && (
        <CreateModal title={`Create New ${activeTab}`} onClose={handleCloseModal}>
          {activeTab === 'Gift' ? <CreateGift onClose={handleCloseModal}/> : (
            <CreateBlindBox
              onClose={handleCloseModal}
              onCreateGift={changeTabType}
              onCreateBlindBox={handleOpenModal}
              walletAddress={walletAddress!!}
            />
          )}
        </CreateModal>
      )}
    </div>
  );
};

export default UserHome;
