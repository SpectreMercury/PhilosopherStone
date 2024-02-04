"use client"
import "./globals.css";
import TrpcProvider from "@/app/_trpc/Provider";
import Header from "./_components/Header/Header";
import { Provider } from "react-redux";
import store from "@/store/store";
import { initConfig } from "@joyid/ckb";
import { JoyIDConfig } from "@/config/joyid/joyid";
import { ConnectProvider } from '@/hooks/useConnect';
import JoyIdConnector from '@/connectors/joyId';
import MetaMaskConnector from "@/connectors/metamask";
import { MaterialDesignContent, SnackbarProvider } from 'notistack'; 
import { styled } from "@mui/material";
import { GiftReceiveModalProvider } from "./context/GiftReceiveModalContext";
import DesktopHeader from "./_components/Header/DesktopHeader";
import useWindowDimensions from '@/hooks/getWindowDimension';
import Image from "next/image";
import { predefinedSporeConfigs, setSporeConfig } from "@spore-sdk/core";
import { predefined } from "@ckb-lumos/config-manager";

const StyledMaterialDesignContent = styled(MaterialDesignContent)(() => ({
  '&.notistack-MuiContent-success': {
    backgroundColor: '#1CB562',
    
  },
  '&.notistack-MuiContent-error': {
    backgroundColor: '#E11717',
  },
}));

const config = {
  autoConnect: true,
  connectors: [new JoyIdConnector(), new MetaMaskConnector()],
};



function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { width } = useWindowDimensions();
  setSporeConfig(predefinedSporeConfigs.Mainnet);
  // initConfig(JoyIDConfig)  
  return (
    <html lang="en" className="min-h-full min-w-full">
      <head>
        <meta property="og:title" content="Philosopher's Stone" />
        <meta property="og:description" content="On-Chain Gifting Platform" />
        <meta property="og:image" content="/svg/ps-og.png" />
      </head>
      <body className="bg-desktop-bg bg-no-repeat min-h-full min-w-full m-0">
        <Image 
          src='/svg/bg-line-top.svg'
          width={254}
          height={154}
          alt='decor lines'
          className="absolute top-0 right-0"
        />
        <Image 
          src='/svg/bg-line-bottom.svg'
          width={495}
          height={377}
          alt='decor lines'
          className="absolute bottom-0 left-0"
        />
         <Image 
          src='/svg/bg-middle.svg'
          width={1142}
          height={564}
          alt='decor lines'
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        />
        <TrpcProvider>
          <ConnectProvider value={config}>
            <GiftReceiveModalProvider>
              <SnackbarProvider
                autoHideDuration={5000} 
                Components={{
                  success: StyledMaterialDesignContent,
                  error: StyledMaterialDesignContent
                }}>
                <Provider store={store}>
                  {width >= 640 && <div className="w-full mb-8"><DesktopHeader /></div>}
                  <div className="container relative flex flex-col min-h-screen mx-auto sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl">
                    {width < 640 && <Header />}
                    <div 
                      className={`flex-1 flex flex-col w-full overflow-y-auto bg-gradient-conic ${width < 640 ? 'rounded-none' : 'rounded-3xl'}`}
                      style={{boxShadow: '0px -2px 4px 0px rgba(0, 0, 0, 0.25)'}}
                    >
                      {children}
                    </div>
                  </div>
                </Provider>
              </SnackbarProvider>
            </GiftReceiveModalProvider>
            
          </ConnectProvider>
        </TrpcProvider>
      </body>
    </html>
  );
}

export default RootLayout
