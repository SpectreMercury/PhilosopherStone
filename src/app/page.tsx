"use client"
import GuestHome from "./_components/GuestHome/GuestHome";
import { useSelector, useDispatch } from 'react-redux'
import { serverClient } from "./_trpc/serverClient";
import { AppDispatch, RootState } from "@/store/store";
import UserHome from "./_components/UserHome/UserHome";

export const dynamic = "force-dynamic";

export default function Home() {
  // const todos = await serverClient.getTodos();

  const dispath = useDispatch()
  const walletAddress = useSelector((state: RootState) => state.wallet.wallet?.address)
  return (
    <main className="universe-bg max-w-3xl flex-1">
      <div className="text-hd1mb font-PlayfairDisplay text-white001 text-center py-12">
        Philosopher Stone
      </div>
      {
        walletAddress ? (<UserHome />) : (<GuestHome />)
      }
    </main>
  );
}
