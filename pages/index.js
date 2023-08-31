import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(new ethers.providers.Web3Provider(window.ethereum));
    }
  };

  const handleAccount = async () => {
    const accounts = await ethWallet.listAccounts();
    if (accounts.length > 0) {
      console.log("Account connected:", accounts[0]);
      setAccount(accounts[0]);
      getATMContract();
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    await ethWallet.send("eth_requestAccounts", []);
    handleAccount();
  };

  const getATMContract = () => {
    const signer = ethWallet.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
  };

  const getBalance = async () => {
    if (atm) {
      const balance = await atm.getBalance();
      setBalance(balance.toNumber());
    }
  };

  const deposit = async() => {
    if (atm) {
      let tx = await atm.deposit(1);
      await tx.wait()
      getBalance();
    }
  }

  
  const withdraw = async() => {
    if (atm) {
      let tx = await atm.withdraw(1);
      await tx.wait()
      getBalance();
    }
  }
  
  const transfer = async () => {
    if (atm) {
        const targetAddress = "0x976EA74026E726554dB657fA54763abd0C3a0aa9"; // Replace with the target address
        const amountToSend = ethers.utils.parseEther("0.5");
        let tx = await atm.transfer(targetAddress, amountToSend, {gasLimit: 300000} );
        await tx.wait();
        getBalance();
    }
  };
  
  
  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p>Please install MetaMask to use this ATM.</p>;
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return (
        <button
          style={{
            backgroundColor: "#4caf50",
            color: "#ffffff",
            fontSize: "18px",
            padding: "10px 20px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            margin: "5px",
          }}
          onClick={connectAccount}
        >
          --Connect your MetaMask wallet--
        </button>
      );
    }

    if (balance === undefined) {
      getBalance();
    }

    return (
      <div>
        <p style={{ fontWeight: 'bold' }}>Your Account: {account}</p>
        <p style={{ fontWeight: 'bold' }}>Your Current Balance is : {balance}</p>
        <button onClick={deposit} style={{ backgroundColor: 'green', color: 'white' }}>Deposit 1 ETH</button>
        <button onClick={withdraw}style={{ backgroundColor: 'red', color: 'white' }}>Withdraw 1 ETH</button>
        <button onClick={transfer}style={{backgroundColor: 'blue', color: 'white'}}>Transfer 0.5 ETH</button>
    </div>
  );
};

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <main className="container">
      <header>
        <h1>MetaCrafter Ether ATM</h1>
      </header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center;
          background-color: #faf0e6;
          color: #7d7463;
          padding: 20px;
        }
        h1 {
          font-size: 30px;
          color: #352f44;
        }
      `}</style>
    </main>
  );
}
