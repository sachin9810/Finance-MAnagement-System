import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react";
import { WagmiConfig } from "wagmi";
// import { LOOP } from "viem/chains";
import { defineChain } from "viem";

export const LOOP = defineChain({
  id: 97,
  name: 'BNB Smart Chain Testnet',
  network: 'BNB Smart Chain Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'BNB Smart Chain Testnet',
    symbol: 'tBNB',
  },
  rpcUrls: {

    default: {
      http: ['https://bsc-testnet-rpc.publicnode.com'],
      webSocket: ['wss://rpc.zora.energy'],
    },
    public: {
      http: ['https://bsc-testnet-rpc.publicnode.com'],
      webSocket: ['wss://rpc.zora.energy'],
    },
  },

  blockExplorers: {
    default: { name: 'Explorer', url: 'https://amoy.polygonscan.com/' },
  },

})

// 1. Get projectId at https://cloud.walletconnect.com
const projectId = "aa0b77fbf0f2a66bee80cddfc48fd319";
// const projectId = 'ae64d2d938316ce3350fea4c10f6cc79'

// 2. Create wagmiConfig
const metadata = {
  name: "Web3Modal",
  description: "Web3Modal Example",
  url: "https://web3modal.com",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};
const chains = [LOOP];
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });

// 3. Create modal
createWeb3Modal({ wagmiConfig, projectId, chains });

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <WagmiConfig config={wagmiConfig}>
      <App />
    </WagmiConfig>
  </React.StrictMode>
);
