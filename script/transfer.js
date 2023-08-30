//script to transfer sol to from one accoun to another account
import * as web3 from "@solana/web3.js";
import bs58 from "bs58";

const url =
  "https://solana-devnet.g.alchemy.com/v2/6KEPGUNvvWjUUW5uHi9FzMrkgzpzRBWO";
const connection = new web3.Connection(url);
const privatekey =
  "yRixf7guLyBsdDZ7cDuj39xRSqGYyEP7vqReodrioLMLsY1HpTdZygeVMavRXoTJ15pddWZiFMowqbKAtgw5hje";
async function Transfer() {
  const wallet = web3.Keypair.fromSecretKey(bs58.decode(privatekey));
  //const senderWallet = new web3.PublicKey(address);
  const receiverWallet = new web3.PublicKey(
    "7Np1iEcHjxuoX7EqeEGDmxAEAAMXWaTxNq5o3HVQeMon"
  );
  console.log("wallets created");
  console.log(receiverWallet);
  const instructions = web3.SystemProgram.transfer({
    fromPubkey: wallet.publicKey,
    toPubkey: receiverWallet,
    lamports: 1000000,
  });
  console.log("instructions created");
  const transaction = new web3.Transaction();
  console.log("transaction object created");
  transaction.add(instructions);
  console.log("instructions added");
  //   const sender = new web3.PublicKey(wallet.publicKey.toString());
  //   console.log(sender);
  transaction.feePayer = wallet.publicKey;
  console.log("fee payer added");
  const blockhash = await connection.getLatestBlockhash("finalized");
  transaction.recentBlockhash = blockhash.blockhash;
  console.log("recent block hash added");
  const signature = await web3.sendAndConfirmTransaction(
    connection,
    transaction,
    [wallet]
  );
  await connection.getSignatureStatus(signature);
  console.log(signature);
}
Transfer();
