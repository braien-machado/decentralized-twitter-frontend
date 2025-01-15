import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from './components/Button';
import { Post } from './components/Post';
import { TextField } from './components/TextField';

const getEthereumObject = () => window.ethereum;

function App() {
  const [isConnecting, setIsConnecting] = useState(false);
  const connectedWallet = useRef(null);

  const findMetamaskAccount = useCallback(async () => {
    setIsConnecting(true);

    try {
      const ethereum = getEthereumObject();

      if (!ethereum) {
        console.error('Install Metamask extension!');
        return null;
      }

      console.info('Metamask detected:', ethereum);

      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if (accounts.length === 0) {
        console.error('No MetaMask connected');
        return null;
      }

      const account = accounts[0];
      console.info('Account found:', account);
      connectedWallet.current = account;

      return account;
    } catch (error) {
      console.error(error);
      return null;
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const connectWallet = async () => {
    setIsConnecting(true);

    try {
      const ethereum = getEthereumObject();

      if (!ethereum) {
        alert('Install Metamask extension!');
        return;
      }

      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });

      console.info('Connected account:', accounts[0]);
      connectedWallet.current = accounts[0];
      // getAllWaves();
    } catch (error) {
      console.error(error);
    } finally {
      setIsConnecting(false);
    }
  };

  useEffect(() => {
    findMetamaskAccount();
  }, [findMetamaskAccount]);

  return (
    <main className="bg-gray-900 min-h-screen flex items-center justify-center flex-col p-20">
      <div className="rounded-md border border-gray-700 text-white bg-gray-800 p-6 mx-auto w-full max-w-[600px]">
        <h1 className="text-2xl mb-4">𝕏 (Twitter) Descentralizado</h1>
        <p className="text-base mb-4">
          This is a decentralized twitter-like app. Connect your blockchain
          wallet and use eth to send messages. Each post grant you a chance of
          earning eth back.
        </p>
        {!connectedWallet?.current ? (
          <Button
            text="Conectar carteira"
            onClick={connectWallet}
            loading={isConnecting}
          />
        ) : (
          <div className="flex flex-col gap-4">
            <TextField
              label="Post"
              name="post"
              className="mb-2"
              type="text"
              id="post"
              placeholder="John"
              required
            />
            <Button text="Send post" />
            <div className="flex items-center">
              <span className="bg-green-100 text-green-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-green-200 dark:text-green-900 h-fit">
                Wallet connected!
              </span>
              <span className="truncate">{connectedWallet.current}</span>
            </div>
          </div>
        )}
      </div>
      {connectedWallet?.current ? (
        <div className="mt-8 rounded-md border border-gray-700 text-white bg-gray-800 p-6 mx-auto w-full max-w-[600px]">
          <h1 className="text-white text-lg mb-4">All posts</h1>
          <div className="text-center mb-4">Loading...</div>
          <Post address="123" timestamp="16:54" message="Message description" />
        </div>
      ) : null}
    </main>
  );
}

export default App;
