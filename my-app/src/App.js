import React, { useState } from 'react';
import Web3 from 'web3';
import { superMinterAbi } from './abi';
import './App.css';

 
const web3 = new Web3(Web3.givenProvider);
const contractAddr = '0x3860E5E623d89Ac64F5164fEd8590625E52b1a7f';
const SimpleContract = new web3.eth.Contract(superMinterAbi, contractAddr);

const handleSet = async (e) => {
  
  e.preventDefault();
  const accounts = await window.ethereum.enable();
  const account = accounts[0];

  console.log(account)

  // const gas = await SimpleContract.methods.mint.estimateGas();
  console.log(SimpleContract.methods)
  const result = await SimpleContract.methods.mint().send({ from: account });
  
  console.log(result);
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        
 <button onClick={handleSet} type="button">Get Number</button>
      </header>
    </div>
  );
}

export default App;
