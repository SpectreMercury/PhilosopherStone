import { QuerySpore } from '@/hooks/useQuery/type';
import { predefinedSporeConfigs, transferSpore as _transferSpore } from '@spore-sdk/core';
import { useMutation } from '@tanstack/react-query';
import React, { useCallback } from 'react';
import { BI, OutPoint, config, helpers } from '@ckb-lumos/lumos';
import { enqueueSnackbar } from 'notistack';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useConnect } from '@/hooks/useConnect';
import { sendTransaction } from '@/utils/transaction';


interface Step2Data {
  walletAddress: string;
  email: string;
  giftMessage: string;
}

interface Step3Props {
  step1Data: QuerySpore;
  step2Data: Step2Data;
}


const Step3: React.FC<Step3Props> = ({ step1Data, step2Data }) => {
  const { signTransaction } = useConnect()
  const walletAddress = useSelector((state: RootState) => state.wallet.wallet?.address);

  const transferSpore = useCallback(
    async (...args: Parameters<typeof _transferSpore>) => {
      const { txSkeleton, outputIndex } = await _transferSpore(...args);
      const signedTx = await signTransaction(txSkeleton);
      const txHash = await sendTransaction(signedTx);
      return {
        txHash,
        index: BI.from(outputIndex).toHexString(),
      } as OutPoint;
    },
    [signTransaction],
  );

  const transferSporeMutation = useMutation({
    mutationFn: transferSpore,
    onSuccess: () => {
      enqueueSnackbar('Gift Send Successful', { variant: 'success' })
    },
    onError: (error) => {
      console.log(error)
      enqueueSnackbar('Gift Send Failed', { variant: 'error' })
    }
  });
  

  const handleSubmit = useCallback(
    async (values: { to: string }) => {
      console.log(values.to)
      if (!step2Data.walletAddress || !values.to || !step1Data?.cell) {
        return;
      }

      await transferSporeMutation.mutateAsync({
        outPoint: step1Data.cell.outPoint!,
        fromInfos: [walletAddress!!],
        toLock: helpers.parseAddress(values.to, {
          config: config.predefined.AGGRON4,
        }),
        config: predefinedSporeConfigs.Aggron4,
        useCapacityMarginAsFee: true,
      });
      enqueueSnackbar('Gift Send Successful', { variant: 'success' });
    },
    [step2Data.walletAddress, step1Data?.cell, transferSporeMutation],
  );

  return (
    <div className='px-4 mt-8'>
      <div className='font-SourceSanPro text-white001 text-subheadermb mb-2'>Gift Information</div>
      <table className="table-auto w-full mb-8">
        <tbody>
          <tr>
            <td className="border px-4 py-2 w-32 font-SourceSanPro text-white001">Type:</td>
            <td className="border px-4 py-2 font-SourceSanPro text-white001">Gift</td>
          </tr>
          <tr>
            <td className="border px-4 py-2 w-32 font-SourceSanPro text-white001">Name:</td>
            <td className="border px-4 py-2 font-SourceSanPro text-white001">{step1Data.id.slice(0, 10)}...{step1Data.id.slice(step1Data.id.length - 10, step1Data.id.length)}</td>
          </tr>
        </tbody>
      </table>
      <div className='font-SourceSanPro text-white001 text-subheadermb mb-2'>Recipient Information</div>
      <table className="table-auto w-full">
        <tbody>
          <tr>
            <td className="border px-4 py-2 w-36 font-SourceSanPro text-white001">Recipient</td>
            <td className="border px-4 py-2 font-SourceSanPro text-white001">{step2Data.walletAddress.slice(0, 10)}...{step2Data.walletAddress.slice(step2Data.walletAddress.length - 10, step2Data.walletAddress.length)}</td>
          </tr>
          <tr>
            <td className="border px-4 py-2 w-32 font-SourceSanPro text-white001">Email:</td>
            <td className="border px-4 py-2 font-SourceSanPro text-white001">{step2Data.email}</td>
          </tr>
        </tbody>
      </table>
      <div className='flex gap-6 my-8'>
        <button 
            className="flex-1 h-12 font-PlayfairDisplay border border-white002 bg-primary011 text-white001 py-2 px-4 rounded"
        >
            Back
        </button>
        <div 
          className="flex-1 h-12 font-PlayfairDisplay border border-white002 bg-white001 text-primary011 py-2 px-4 rounded"
          onClick={async() => {
            await handleSubmit({to: step2Data.walletAddress})
          }}
        >
            Confirm
        </div>
      </div>
    </div>
  );
};

export default Step3;
