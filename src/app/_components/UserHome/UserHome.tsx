import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import CreateModal from '../CreateModal/CreateModal';
import CreateGift from '../CreateModal/Gift';
import GiftList from '@/app/_components/List/GiftList';
import CreateBlindBox from '../CreateModal/CreateBlindBox';
import { useSporesByAddressQuery } from '@/hooks/useQuery/useSporesByAddress';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { QuerySpore } from '@/hooks/useQuery/type';

const LoadingSkeleton = () => {
  return (
    <div>
      <div className="relative my-8 h-[180px] bg-gray-200 animate-pulse">
        {/* You can add additional styling here to mimic the layout */}
      </div>
      <p className="text-center my-8 text-white001 text-hd2mb font-PlayfairDisplay bg-gray-300 rounded">
        {/* This is for the text skeleton */}
        &nbsp;
      </p>
    </div>
  );
};

const UserHome: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Gift' | 'Blind Box'>('Gift');
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
    }
  }, [storeSporesList, blindBoxList, activeTab]);


  const renderContent = () => {
    if (isSporesLoading && activeTab === 'Gift') {
      return <LoadingSkeleton />;
    }

    const currentList = activeTab === 'Gift' ? sporesList : blindBoxList

    if (currentList && currentList.length > 0) {
      return <GiftList onNewGiftClick={handleOpenModal} list={sporesList} type={activeTab} blindboxList={blindBoxList} />;
    } else {
      return (
        <div>
          <div className="relative my-8 h-[180px] bg-gray-200">
            <Image
              alt='gift'
              src='/svg/BlindBox.svg'
              layout='fill'
              objectFit='cover'
            />
          </div>
          <p className="text-center my-8 text-white001 text-hd2mb font-PlayfairDisplay">
            Create Your Gift and Let Smiles Bloom!
          </p>
        </div>
      );
    }
  };


  return (
    <div className="container mx-auto p-4">
      <div className="flex rounded-md bg-primary011">
        <button
          className={`flex-1 py-2 m-1 font-semibold text-white font-SourceSanPro ${activeTab === 'Gift' ? 'bg-primary010' : ''} rounded-md`}
          onClick={() => setActiveTab('Gift')}
        >
          Gift
        </button>
        <button
          className={`flex-1 py-1 m-1 font-semibold text-white font-SourceSanPro ${activeTab === 'Blind Box' ? 'text-blue-500 bg-primary010' : ''} rounded-md `}
          onClick={() => {
            setActiveTab('Blind Box')
            getBlindBoxData()
          }}
        >
          Blind Box
        </button>
      </div>
      { renderContent() }
      <button 
        className="w-full h-12 font-PlayfairDisplay border border-white002 bg-white001 text-primary011 py-2 px-4 rounded"
        onClick={handleOpenModal}
      >
        Design {activeTab}
      </button>
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
