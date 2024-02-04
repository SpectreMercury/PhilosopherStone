import Link from 'next/link';
import React from 'react';

export const FAQData = [
  {
    question: 'What is Philosopher\'s Stone?',
    answer: (<span>Philosopher&apos;s Stone is a novel NFT platform powered by the <Link className='text-linkColor' target='_blank' href={'https://spore.pro'}>Spore Protocol</Link>. It blends the excitement of Blind Box gifting, delivering a captivating user experience. Each Gift on Philosopher&apos;s Stone unveils a unique adventure in a creative and secure way.</span>)
  },
  {
    question: 'What is a Blind Box?',
    answer: 'A Blind Box is a type of Gift where the contents are a surprise until it is opened. In Philosopher\’s Stone, you can send Gifts either in traditional, known format or as Blind Boxes for a more mysterious and thrilling gifting experience.'
  },
  {
    question: 'How do I create a Gift or a Blind Box?',
    answer: (<span>To create a Gift or a Blind Box, simply navigate to the <Link className='text-linkColor' href={'/'}>Home</Link> page and click on &quot;Create&quot;. Here, you can upload an image as your Gift and mint it using the corresponding CKB amount.</span>)
  },
  {
    question: 'How do I send a Gift or Blind Box?',
    answer: 'Once your Gift or Blind box is ready, initiate sending by clicking “Send as Gift” from its detail page. You can either enter the recipient\'s wallet address or send it via URL.'
  },
  {
    question: 'How do I claim a Gift?',
    answer: 'To claim a Gift, simply follow the unique URL provided by the sender. If the Gift was sent directly to your address, you can also claim it directly on our platform.'
  },
  {
    question: 'Why aren\'t my Gift actions showing up immediately in the Gift List?',
    answer: (<span>Due to the nature of blockchain technology and varying network traffic, actions like creating, melting, sending, or claiming Gifts via Philosopher&apos;s Stone might not immediately appear in your Gift List. These transactions require confirmation on the blockchain, which can take some time depending on the current network conditions. Rest assured, your actions are being processed. We recommend checking your <Link className='text-linkColor' href={'/history'}>History</Link> tab to see the updates. Thank you for your patience and understanding!</span>)
  },
  {
    question: 'What can I do with my Gift?',
    answer: 'Once you\'ve received a Gift, it\'s yours to manage. You can treasure it as part of your digital collection, share it with friends, or even \'melt\' it in exchange for $CKB. Make your choice and strengthen the Nervos ecosystem now.'
  }
];