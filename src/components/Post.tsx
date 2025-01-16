type Props = {
  address: string;
  timestamp: string;
  message: string;
};

export const Post = ({ address, message, timestamp }: Props) => {
  return (
    <div className="border border-gray-700 p-4 rounded mb-2">
      <div className="truncate">Wallet: {address}</div>
      <div>Date: {timestamp}</div>
      <div>Message: {message}</div>
    </div>
  );
};
