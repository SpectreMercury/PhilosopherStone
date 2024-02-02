"use client"

import React from "react";
import { FAQData } from "@/settings/FAQData";
import Image from "next/image";
import FAQComponent from "@/app/_components/FAQCompent/FAQComponent";

const FAQ:React.FC = () => {
    return (
        <div className="universe-bg px-4 h-full flex-1 flex flex-col pb-12">
            <FAQComponent items={FAQData} linkColor='text-primary007' />
            <div className="w-full h-[82px] rounded-md bg-primary010 flex justify-start items-center mt-8 px-4">
                <div className="w-12 h-12 relative flex items-center mr-3">
                    <Image src={'/svg/faq.svg'} layout='fill' objectFit='cover' alt={'faq'} />
                </div>
                <div>
                    <p className=" font-SourceSanPro text-white text-body1bdmb">Can&apos;t find what you’re looking for?</p>
                    <div className=" font-SourceSanPro text-white003 text-labelmb ">Check out our <a className="text-linkColor" target='_blank' href='https://github.com/lee920217/PhilosopherStone'>Github</a> or find us on <a className="text-linkColor" target='_blank' href='https://discord.gg/ruvmbEApzU'>Discord</a></div>
                </div>
            </div>
        </div>
    )
}

export default FAQ