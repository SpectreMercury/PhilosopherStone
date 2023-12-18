import React from 'react';

const Step3: React.FC = () => {
  // 假设这些是从之前步骤中获取的数据
  const giftInfo = {
    type: 'Gift Type',
    name: 'Gift Name',
  };

  const recipientInfo = {
    walletAddress: '0x123...456',
    email: 'example@example.com',
  };

  return (
    <div className='px-4 mt-8'>
      <div className='font-SourceSanPro text-white001 text-subheadermb mb-2'>Gift Information</div>
      <table className="table-auto w-full mb-8">
        <tbody>
          <tr>
            <td className="border px-4 py-2 w-32 font-SourceSanPro text-white001">Type:</td>
            <td className="border px-4 py-2 font-SourceSanPro text-white001">{giftInfo.type}</td>
          </tr>
          <tr>
            <td className="border px-4 py-2 w-32 font-SourceSanPro text-white001">Name:</td>
            <td className="border px-4 py-2 font-SourceSanPro text-white001">{giftInfo.name}</td>
          </tr>
        </tbody>
      </table>
      <div className='font-SourceSanPro text-white001 text-subheadermb mb-2'>Recipient Information</div>
      <table className="table-auto w-full">
        <tbody>
          <tr>
            <td className="border px-4 py-2 w-36 font-SourceSanPro text-white001">Recipient</td>
            <td className="border px-4 py-2 font-SourceSanPro text-white001">{recipientInfo.walletAddress}</td>
          </tr>
          <tr>
            <td className="border px-4 py-2 w-32 font-SourceSanPro text-white001">Email:</td>
            <td className="border px-4 py-2 font-SourceSanPro text-white001">{recipientInfo.email}</td>
          </tr>
        </tbody>
      </table>
      <div className='flex gap-6 my-8'>
        <button 
            className="flex-1 h-12 font-PlayfairDisplay border border-white002 bg-primary011 text-white001 py-2 px-4 rounded"
        >
            Back
        </button>
        <button 
            className="flex-1 h-12 font-PlayfairDisplay border border-white002 bg-white001 text-primary011 py-2 px-4 rounded"
        >
            Confirm
        </button>
      </div>
    </div>
  );
};

export default Step3;
