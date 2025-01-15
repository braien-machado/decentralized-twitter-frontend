type Props = {
  address: string;
  timestamp: string;
  message: string;
};

export const Post = ({ address, message, timestamp }: Props) => {
  return (
    <div className="border border-gray-700 p-4 rounded mb-2">
      <div className="truncate">Carteira: {address}</div>
      <div>Data: {timestamp}</div>
      <div>Mensagem: {message}</div>
    </div>
  );
};
