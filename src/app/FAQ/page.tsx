"use client"

import React from "react";
import Faq from "../_components/FAQ/FAQ";
import { FAQData } from "@/settings/FAQData";
import Image from "next/image";

const FAQ:React.FC = () => {
    return (
        <div className="universe-bg px-4 h-full flex-1 flex flex-col">
            <Faq items={FAQData} linkColor='text-primary007' />
            <div className="w-[343px] h-[82px] rounded-md bg-primary010 flex justify-between items-center mx-auto mt-8 px-4">
                <div className="w-12 h-12 relative flex items-center">
                    <Image src={'/svg/faq.svg'} layout='fill' objectFit='cover' alt={'faq'} />
                </div>
                <div>
                    <p className=" font-SourceSanPro text-white text-body1bdmb">Can’t find what you’re looking for?</p>
                    <div className=" font-SourceSanPro text-white text-labelmb ">Check out our <a className="text-linkColor">Github</a> or find us on <a className="text-linkColor">Discord</a></div>
                </div>
            </div>
        </div>
    )
}

export default FAQ