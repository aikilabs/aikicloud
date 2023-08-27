import { BrowserProvider } from 'ethers';
import {SiweMessage} from "siwe";

const BACKEND_URL = "http://localhost:5000";

const domain = window.location.hostname;
const origin = window.location.origin;
const chainId = "1";
const provider = new BrowserProvider(window.ethereum);

async function createSiweMessage(address, statement) {
  const res = await fetch(`${BACKEND_URL}/nonce`, {
    credentials: "include",
  });

  const message = new SiweMessage({
    domain,
    address,
    statement,
    uri: origin,
    version: "1",
    chainId,
    nonce: await res.text(),
  });

  return message.prepareMessage();
}

async function signInWithEthereum(tokenId) {
  const signer = provider.getSigner();
  const address = await signer.getAddress();
  const message = await createSiweMessage(
    address,
    "Sign in with Ethereum to verify your identity");

  const signature = await signer.signMessage(message);

  const res = await fetch(`${BACKEND_URL}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({message, signature, tokenId}),
    credentials: "include",
  });

  console.log(await res.text());
}