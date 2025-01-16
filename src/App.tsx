import { ethers } from 'ethers';
import type { Contract } from 'ethers';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from './components/Button';
import { Post } from './components/Post';
import { TextField } from './components/TextField';
import abi from './contracts/Post.json';

const getEthereumObject = () => window.ethereum;
const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS as string;
const contractABI = abi.abi;

type IPost = {
  address: string;
  timestamp: Date;
  message: string;
};

function App() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [posts, setPosts] = useState<IPost[]>([]);
  const [message, setMessage] = useState('');
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

  const createPost = async () => {
    setIsLoadingPosts(true);

    const ethereum = getEthereumObject();

    if (!ethereum) {
      alert('Install Metamask extension!');
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();

      const postContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer,
      );

      let count = await postContract.getTotalPosts();
      console.log('Retrieved total post count...', Number(count));

      const postTxn = await postContract.createPost(message, {
        gasLimit: 300000,
      });
      console.log('Creating post...', postTxn.hash);

      await postTxn.wait();
      console.log('Post created and saved in blockchain!', postTxn.hash);

      count = await postContract.getTotalPosts();
      console.log('Retrieved total post count...', Number(count));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingPosts(false);
    }
  };

  const getAllPosts = useCallback(async () => {
    setIsLoadingPosts(true);

    const ethereum = getEthereumObject();

    if (!ethereum) {
      alert('Install Metamask extension!');
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();

      const postContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer,
      );

      const posts: Array<[string, string, string]> =
        await postContract.getAllPosts();

      const normalizedPosts = posts
        .map((post: [string, string, string]) => ({
          address: post[0],
          timestamp: new Date(Number(post[2]) * 1000),
          message: post[1],
        }))
        .sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
        );

      setPosts(normalizedPosts);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingPosts(false);
    }
  }, []);

  useEffect(() => {
    let postContract: Contract;

    const onNewPost = (from: string, timestamp: string, message: string) => {
      try {
        console.log('NewPost event triggered:', { from, timestamp, message });
        setPosts((prevPosts) => [
          {
            address: from,
            timestamp: new Date(Number(timestamp) * 1000),
            message: message,
          },
          ...prevPosts,
        ]);
      } catch (e) {
        console.error(e);
      }
    };

    const setupContractListener = async () => {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        postContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer,
        );
        postContract.on('NewPost', onNewPost);
      }
    };

    setupContractListener();

    return () => {
      if (postContract) {
        postContract.off('NewPost', onNewPost);
      }
    };
  }, []);

  useEffect(() => {
    findMetamaskAccount();
    getAllPosts();
  }, [findMetamaskAccount, getAllPosts]);

  return (
    <main className="bg-gray-900 min-h-screen flex items-center justify-center flex-col p-20">
      <div className="rounded-md border border-gray-700 text-white bg-gray-800 p-6 mx-auto w-full max-w-[600px]">
        <h1 className="text-2xl mb-4">Decentralized 𝕏 (Twitter)</h1>
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
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              className="mb-2"
              type="text"
              id="post"
              placeholder="John"
              required
            />
            <Button text="Send post" onClick={createPost} />
            <div className="flex items-center">
              <span className="bg-green-100 text-green-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-green-200 dark:text-green-900 h-fit">
                Wallet connected!
              </span>
              <span className="truncate">{connectedWallet.current}</span>
            </div>
          </div>
        )}
      </div>
      {connectedWallet?.current && posts.length > 0 ? (
        <div className="mt-8 rounded-md border border-gray-700 text-white bg-gray-800 p-6 mx-auto w-full max-w-[600px]">
          <h1 className="text-white text-lg mb-4">All posts</h1>
          {isLoadingPosts ? (
            <div className="text-center mb-4">Loading...</div>
          ) : (
            posts.map((post) => (
              <Post
                address={post.address}
                key={post.timestamp.toString()}
                timestamp={post.timestamp.toString()}
                message={post.message}
              />
            ))
          )}
        </div>
      ) : null}
    </main>
  );
}

export default App;
