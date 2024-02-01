"use client"
import GuestHome from "./_components/GuestHome/GuestHome";
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from "@/store/store";
import UserHome from "./_components/UserHome/UserHome";
import { useGiftReceiveModal } from "@/hooks/Modal/useGiftReceiveModal";
import { useEffect } from "react";
import { setNewGifts } from "@/store/newGiftsSlice";
import ReceiveGiftModal from "./_components/common/ReceiveGiftModal/ReceiveGiftModal";
import { fetchGiftAPI } from "@/utils/fetchAPI";
export const dynamic = "force-dynamic";

export default function Home() {
  const dispatch = useDispatch()
  const walletAddress = useSelector((state: RootState) => state.wallet.wallet?.address)
  const { openGiftReceiveModal } = useGiftReceiveModal();
  const { isGiftReceiveModalOpen, closeGiftReceiveModal } = useGiftReceiveModal();

  return (
    <main className="universe-bg max-w-3xl flex-1 overflow-auto">
      <ReceiveGiftModal isReceiveGiftModalOpen={isGiftReceiveModalOpen} closeReceiveGiftModal={closeGiftReceiveModal} />
      {
        walletAddress ? (<UserHome />) : (<GuestHome />)
      }
    </main>
  );
}
