import type { ButtonHTMLAttributes } from 'react';

type Props = {
  loading?: boolean;
  text: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({ loading, text, ...props }: Props) => {
  return (
    <button
      {...props}
      type="button"
      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 w-fit"
    >
      {loading ? 'Loading...' : text}
    </button>
  );
};
