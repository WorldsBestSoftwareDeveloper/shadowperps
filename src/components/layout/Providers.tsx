"use client";
import { FC, ReactNode } from "react";
import { WalletContextProvider } from "./WalletProvider";
import { Toaster } from "react-hot-toast";

export const Providers: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <WalletContextProvider>
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#1e0f3d",
            color: "#e8dcfd",
            border: "1px solid rgba(91,47,212,0.4)",
            borderRadius: "12px",
          },
        }}
      />
    </WalletContextProvider>
  );
};
