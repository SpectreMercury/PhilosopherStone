"use client"
import GuestHome from "./_components/GuestHome/GuestHome";
import { useSelector, useDispatch } from 'react-redux'
import { serverClient } from "./_trpc/serverClient";
import { AppDispatch, RootState } from "@/store/store";
import UserHome from "./_components/UserHome/UserHome";
import { useGiftReceiveModal } from "@/hooks/Modal/useGiftReceiveModal";
import { useEffect } from "react";
import { setNewGifts } from "@/store/newGiftsSlice";
import ReceiveGiftModal from "./_components/common/ReceiveGiftModal/ReceiveGiftModal";

export const dynamic = "force-dynamic";

export default function Home() {
  // const todos = await serverClient.getTodos();

  const dispatch = useDispatch()
  const walletAddress = useSelector((state: RootState) => state.wallet.wallet?.address)
  const { openGiftReceiveModal } = useGiftReceiveModal();
  const { isGiftReceiveModalOpen, closeGiftReceiveModal } = useGiftReceiveModal();


  const getGiftStatus = async () => {
    const response = await fetch('/api/gift', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'checkStatus', key: walletAddress, v: [] }),
    });
    const data = await response.json();
    if(data.data.length) {
      dispatch(setNewGifts(data.data));
      openGiftReceiveModal()
    }
    return data;
  }

  useEffect(() => {
    if (walletAddress) {
      getGiftStatus()
    }
  }, [walletAddress])

  return (
    <main className="universe-bg max-w-3xl flex-1">
      <ReceiveGiftModal isReceiveGiftModalOpen={isGiftReceiveModalOpen} closeReceiveGiftModal={closeGiftReceiveModal} />
      <div className="text-hd1mb font-PlayfairDisplay text-white001 text-center py-12">
        Philosopher Stone
      </div>
      {
        walletAddress ? (<UserHome />) : (<GuestHome />)
      }
    </main>
  );
}
