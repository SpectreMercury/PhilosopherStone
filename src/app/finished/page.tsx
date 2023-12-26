import React from "react";
import Image from "next/image";
import Link from "next/link";

const Finished: React.FC = () => {
    return (
        <div className="flex-1 flex items-center justify-center flex-col gap-8">
            <Image 
                width={340}
                height={170}
                alt='gift demo'
                src={'/svg/gift.svg'}
            />
            <div className="px-4 text-white001 text-hd2mb font-PlayfairDisplay text-center">
                🎉 Hooray! Your Blind Box has been sent successfully! 🎁
            </div>
            <div className="px-4 text-white001 text-center font-SourceSanPro">
                You&lsquo;ve just shared a delightful surprise. You can keep track of your gift on <Link className=" text-primary005" target="_blank" href={'https://explorer.nervos.org/'}>CKB Explorer</Link>. Thank you for spreading joy with Spore Gift! 🌟
            </div>
        </div>
    )
}

export default Finished