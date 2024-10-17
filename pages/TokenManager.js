// pages/TokenManager.js

import { useState } from 'react';
import { ethers } from 'ethers';
import { TOKEN_CONTRACT_ADDRESS, TOKEN_ABI } from '../constants';

const TokenManager = () => {
    const [amount, setAmount] = useState('');
    const [recipient, setRecipient] = useState('');
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [contract, setContract] = useState(null);

    const connectWallet = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.send('eth_requestAccounts', []);
        setProvider(provider);
        setSigner(provider.getSigner());
        setContract(new ethers.Contract(TOKEN_CONTRACT_ADDRESS, TOKEN_ABI, provider));
    };

    const mintTokens = async () => {
        const tx = await contract.connect(signer).mint(ethers.utils.parseUnits(amount, 18));
        await tx.wait();
        alert('Tokens minted successfully!');
    };

    const transferTokens = async () => {
        const tx = await contract.connect(signer).transfer(recipient, ethers.utils.parseUnits(amount, 18));
        await tx.wait();
        alert('Tokens transferred successfully!');
    };

    const burnTokens = async () => {
        const tx = await contract.connect(signer).burn(ethers.utils.parseUnits(amount, 18));
        await tx.wait();
        alert('Tokens burned successfully!');
    };

    return (
        <div>
            <h1>Token Manager</h1>
            <button onClick={connectWallet}>Connect Wallet</button>
            <div>
                <h2>Mint Tokens</h2>
                <input
                    type="text"
                    placeholder="Amount to mint"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
                <button onClick={mintTokens}>Mint</button>
            </div>
            <div>
                <h2>Transfer Tokens</h2>
                <input
                    type="text"
                    placeholder="Recipient address"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Amount to transfer"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
                <button onClick={transferTokens}>Transfer</button>
            </div>
            <div>
                <h2>Burn Tokens</h2>
                <input
                    type="text"
                    placeholder="Amount to burn"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
                <button onClick={burnTokens}>Burn</button>
            </div>
        </div>
    );
};

export default TokenManager;
