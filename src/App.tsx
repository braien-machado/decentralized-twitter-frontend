import { Button } from './components/Button';
import { Post } from './components/Post';
import { TextField } from './components/TextField';

function App() {
  return (
    <main className="bg-gray-900 min-h-screen flex items-center justify-center flex-col p-20">
      <div className="rounded-md border border-gray-700 text-white bg-gray-800 p-6 mx-auto w-full max-w-[600px]">
        <h1 className="text-2xl mb-4">𝕏 (Twitter) Descentralizado</h1>
        <p className="text-base mb-4">
          This is a decentralized twitter-like app. Connect your blockchain wallet and use eth to send messages. Each post grant you a chance of earning eth back.
        </p>
        <Button text="Conectar carteira" />
        <TextField
          label="Post"
          name="post"
          className="mb-2"
          type="text"
          id="post"
          placeholder="John"
          required
        />
        <Button text="Enviar post" />
        <div className="flex items-center">
          <span className="bg-green-100 text-green-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-green-200 dark:text-green-900 h-fit">
            Conectado!
          </span>
          <span className="truncate">
            {/* <!-- {{ currentAccount }} --> */}
          </span>
        </div>
      </div>
      <div className="mt-8 rounded-md border border-gray-700 text-white bg-gray-800 p-6 mx-auto w-full max-w-[600px]">
        <h1 className="text-white text-lg mb-4">Todos os posts</h1>
        <div className="text-center mb-4">Carregando...</div>
        <Post address="123" timestamp="16:54" message="Descrição da mensagem" />
      </div>
    </main>
  );
}

export default App;
