"use client"
import "./globals.css";
import TrpcProvider from "@/app/_trpc/Provider";
import Header from "./_components/Header/Header";
import { Provider } from "react-redux";
import store from "@/store/store";
import { initConfig } from "@joyid/ckb";
import { JoyIDConfig } from "@/config/joyid/joyid";
import { MaterialDesignContent, SnackbarProvider } from 'notistack'; 
import { styled } from "@mui/material";

const StyledMaterialDesignContent = styled(MaterialDesignContent)(() => ({
  '&.notistack-MuiContent-success': {
    backgroundColor: '#1CB562',
    
  },
  '&.notistack-MuiContent-error': {
    backgroundColor: '#E11717',
  },
}));

function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  initConfig(JoyIDConfig)

  return (
    <html lang="en" className="min-h-full min-w-full">
      <body className="bg-primary005 bg-no-repeat min-h-full min-w-full m-0">
        <TrpcProvider>
          <SnackbarProvider
            autoHideDuration={2000} 
            Components={{
              success: StyledMaterialDesignContent,
              error: StyledMaterialDesignContent
            }}>
            <Provider store={store}>
              <div className="container relative flex flex-col min-h-screen mx-auto sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl">
                <Header />
                <div className="flex-1 flex flex-col w-full bg-gradient-conic">
                {children}
                </div>
              </div>
            </Provider>
          </SnackbarProvider>
        </TrpcProvider>
      </body>
    </html>
  );
}

export default RootLayout
