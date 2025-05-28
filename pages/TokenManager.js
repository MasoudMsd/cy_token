
import { ethers } from 'ethers';
import { TOKEN_CONTRACT_ADDRESS, TOKEN_ABI } from '../constants';

const TokenManager = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');

  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        setIsConnected(accounts.length > 0);
      }
    };
    checkConnection();
  }, []); // Empty dependency array to run only once on component mount

  const connectWallet = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      setProvider(provider);
      setSigner(provider.getSigner());
      setContract(new ethers.Contract(TOKEN_CONTRACT_ADDRESS, TOKEN_ABI, provider));
      setIsConnected(true);
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  const mintTokens = async () => {
    if (!contract || !signer) return; // Check for connection before interacting

    try {
      const tx = await contract.connect(signer).mint(ethers.utils.parseUnits(amount, 18));
      await tx.wait();
      alert('Tokens minted successfully!');
    } catch (error) {
      console.error('Error minting tokens:', error);
    }
  };

  const transferTokens = async () => {
    if (!contract || !signer) return; // Check for connection before interacting

    try {
      const tx = await contract.connect(signer).transfer(recipient, ethers.utils.parseUnits(amount, 18));
      await tx.wait();
      alert('Tokens transferred successfully!');
    } catch (error) {
      console.error('Error transferring tokens:', error);
    }
  };

  const burnTokens = async () => {
    if (!contract || !signer) return; // Check for connection before interacting

    try {
      const tx = await contract.connect(signer).burn(ethers.utils.parseUnits(amount, 18));
      await tx.wait();
      alert('Tokens burned successfully!');
    } catch (error) {
      console.error('Error burning tokens:', error);
    }
  };

  return (
    <div>
      <h1>Token Manager</h1>
      <button onClick={connectWallet} disabled={isConnected}>
        {isConnected ? 'Connected' : 'Connect Wallet'}
      </button>
      {isConnected && (
        <>
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
        </>
      )}
    </div>
  );
};

export default TokenManager;
