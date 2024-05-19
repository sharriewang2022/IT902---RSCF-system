import type { MetaMaskInpageProvider } from "@metamask/providers";
import { ExternalProvider } from "@ethersproject/providers";
import { initializeProvider } from '@metamask/providers';

// Create a stream to a remote provider:
const metamaskStream =  ({
  name: 'inpage',
  target: 'contentscript',
});

// this will initialize the provider and set it as window.ethereum
// initializeProvider({
//    connectionStream: metamaskStream,
// });

declare global {
//   interface Window {
//     ethereum?: ExternalProvider;
//   }
 }
export const useMetaMask = () => {
  const ethereum = global?.window?.ethereum;
  if (!ethereum || !ethereum.isMetaMask) return;
  return ethereum as unknown as MetaMaskInpageProvider;
};