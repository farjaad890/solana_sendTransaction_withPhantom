import * as web3 from "@solana/web3.js";
import { useState } from "react";
import "./App.css";
import phantomPurple from "./assets/Phantom-Icon_Transparent_Purple.png";
import phantomBlack from "./assets/Phantom-Icon_Transparent_Black.png";
import phantomWhite from "./assets/Phantom-Icon_Transparent_White.png";
import * as buffer from "buffer";
window.Buffer = buffer.Buffer;

function App() {
  const [receiver, setReceiver] = useState();
  const [address, setAddress] = useState();
  const [error, setError] = useState();
  const [amount, setAmount] = useState();
  const [transaction, setTransaction] = useState();

  async function Transfer(e) {
    e.preventDefault();
    const prov = window.phantom.solana;
    const network = "https://api.devnet.solana.com";
    const connection = new web3.Connection(network);
    const senderWallet = new web3.PublicKey(address);
    const receiverWallet = new web3.PublicKey(
      "7Np1iEcHjxuoX7EqeEGDmxAEAAMXWaTxNq5o3HVQeMon"
    );
    console.log("wallets created");
    const instructions = web3.SystemProgram.transfer({
      fromPubkey: senderWallet,
      toPubkey: receiverWallet,
      lamports: amount * 10 ** 9,
    });
    console.log("instructions created");
    const transaction = new web3.Transaction();
    console.log("transaction object created");
    transaction.add(instructions);
    console.log("instructions added");
    transaction.feePayer = senderWallet;
    console.log("fee payer added");
    const blockhash = await connection.getLatestBlockhash("finalized");
    transaction.recentBlockhash = blockhash.blockhash;
    console.log("recent block hash added");
    const { signature } = await prov.signAndSendTransaction(transaction, prov);
    await connection.getSignatureStatus(signature);
    console.log(signature);
    setTransaction(signature);
  }

  async function connectTophantom() {
    // const provider = await window.phantom.solana.connect();
    // const acount = await provider.connect();
    // console.log(acount);
    const provider = window.phantom?.solana; // see "Detecting the Provider"
    try {
      const resp = await provider.connect();
      console.log(resp.publicKey.toString());
      setAddress(resp.publicKey.toString());
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <div>
      {!address ? (
        <></>
      ) : (
        <div className="flex items-center justify-center bg-slate-500">
          <p>Wallet address: {address}</p>
        </div>
      )}
      <div className="flex items-center justify-center min-h-screen bg-slate-500">
        <div className=" flex flex-col bg-slate-500">
          <img
            src={phantomWhite}
            className="w-52 h-52  mx-auto mb-8"
            alt=""
          ></img>
          {!address ? (
            <button
              type="button"
              className="mt-2 mb-2 text-white bg-gradient-to-r from-violet-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
              onClick={() => {
                connectTophantom();
              }}
            >
              connect
            </button>
          ) : (
            <form
              className="bg-slate-400 shadow-md rounded px-8 pt-6 pb-8 mb-4"
              onSubmit={Transfer}
            >
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Address
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="username"
                  type="text"
                  placeholder="address"
                  required
                  value={receiver}
                  onChange={(event) => {
                    setReceiver(event.target.value);
                  }}
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  SOL
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                  id="value"
                  type="text"
                  placeholder="Amount"
                  value={amount}
                  required
                  onChange={(event) => {
                    setAmount(event.target.value);
                  }}
                />
              </div>
              <div className="flex items-center justify-between">
                <button
                  className="bg-gradient-to-r from-violet-500 to-blue-500 hover:bg-gradient-to-bl text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                  type="submit"
                  onSubmit={(e) => {
                    Transfer(e);
                  }}
                >
                  Transfer
                </button>
              </div>
            </form>
          )}
          {!transaction ? <></> : <p> transaction hash : {transaction}</p>}
        </div>
      </div>
    </div>
  );
}

export default App;
