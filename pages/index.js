import { BigNumber, Contract, providers, utils } from "ethers";
import Head from "next/head";
import React, { useEffect, useRef, useState } from "react";
import Web3Modal from "web3modal";
import { TOKEN_CONTRACT_ABI, TOKEN_CONTRACT_ADDRESS } from "../constants";
import TokenManager from './TokenManager'; // Import TokenManager
import styles from "../styles/Home.module.css";

export default function Home() {
  const zero = BigNumber.from(0);
  const [walletConnected, setWalletConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tokensToBeClaimed, setTokensToBeClaimed] = useState(zero);
  const [balanceOfCryptoDevTokens, setBalanceOfCryptoDevTokens] = useState(zero);
  const [tokenAmount, setTokenAmount] = useState(zero);
  const [tokensMinted, setTokensMinted] = useState(zero);
  const [isOwner, setIsOwner] = useState(false);
  const web3ModalRef = useRef();

  // Your existing functions...

  const connectWallet = async () => {
    try {
      await getProviderOrSigner();
      setWalletConnected(true);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "bsc",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
      getTotalTokensMinted();
      getBalanceOfFCKFTokens();
      getTokensToBeClaimed();
    }
  }, [walletConnected]);

  return (
    <div>
      <Head>
        <title>Token DApp</title>
        <meta name="description" content="Token Management DApp" />
      </Head>
      <div className={styles.main}>
        <h1 className={styles.title}>Welcome to the Token DApp!</h1>
        {walletConnected ? (
          <div>
            <div className={styles.description}>
              You have minted{" "}
              {parseFloat(utils.formatEther(balanceOfCryptoDevTokens)).toLocaleString()}{" "}
              tokens
            </div>
            <div className={styles.description}>
              Overall{" "}
              {parseFloat(utils.formatEther(tokensMinted)).toLocaleString()}{" "}
              tokens have been minted!!!
            </div>
            <TokenManager /> {/* Render the TokenManager component */}
          </div>
        ) : (
          <button onClick={connectWallet} className={styles.button}>
            Connect your wallet
          </button>
        )}
      </div>
      <footer className={styles.footer}>
        <p className="mt-4">&copy; 2023 Token DApp. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
