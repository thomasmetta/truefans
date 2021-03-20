import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { superMinterAbi } from './abi';
import './App.css';
import tier1Image from './tier1.png';
import tier2Image from './tier2.png';
import tier3Image from './tier3.png';

 
const web3 = new Web3(Web3.givenProvider);
const contractAddr = '0x3860E5E623d89Ac64F5164fEd8590625E52b1a7f';
const SimpleContract = new web3.eth.Contract(superMinterAbi, contractAddr);

function App() {

  const [tierOneCount, setTierOneCount] = useState(false);
  const [tierTwoCount, setTierTwoCount] = useState(false);
  const [tierThreeCount, setTierThreeCount] = useState(false);
  const [currentAddress, setCurrentAddress] = useState("");

  useEffect(() => {
    async function fetchMyAPI() {
      const accounts = await window.ethereum.enable();
      const account = accounts[0];


      const tierOneResult = await SimpleContract.methods.balanceOf(account, 1).call()
      setTierOneCount(tierOneResult > 0);

      const tierTwoResult = await SimpleContract.methods.balanceOf(account, 2).call()
      setTierTwoCount(tierTwoResult > 0);

      const tierThreeresult = await SimpleContract.methods.balanceOf(account, 3).call()
      setTierThreeCount(tierThreeresult > 0);


  console.log(tierOneCount)
  setCurrentAddress(account)
    }
  
    fetchMyAPI()
  }, [])


const handleSet = async (e) => {
  
  e.preventDefault();
  const accounts = await window.ethereum.enable();
  const account = accounts[0]
  const result = await SimpleContract.methods.mint().send({ from: account });
}
  return (
    <div className="App">
      <header className="App-header">

      <p>{currentAddress}</p>
        
      <button onClick={handleSet} type="button">Redeem membership reward</button>

      <p>Your reward</p>


      {tierOneCount && <img src={tier1Image} />}
      {tierTwoCount && <img src={tier2Image} />}
      {tierThreeCount && <img src={tier3Image} />}
      </header>
    </div>
  );
}

export default App;
