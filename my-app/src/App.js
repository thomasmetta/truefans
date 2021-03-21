import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import SuperfluidSDK from "@superfluid-finance/js-sdk";
import { superMinterAbi } from './abi';
import './App.css';
import tier1Image from './tier1.png';
import tier2Image from './tier2.png';
import tier3Image from './tier3.png';

 
const web3 = new Web3(Web3.givenProvider);
const contractAddr = '0x05a355b56c86290c1F3B47Eaea942E7fD6EEE7D7';
const SimpleContract = new web3.eth.Contract(superMinterAbi, contractAddr);

function App() {

  const [tierOneCount, setTierOneCount] = useState(false);
  const [tierTwoCount, setTierTwoCount] = useState(false);
  const [tierThreeCount, setTierThreeCount] = useState(false);
  const [currentAddress, setCurrentAddress] = useState("");
  const [amountPerSecond, setAmountPerSecond] = useState();
  const [amountPerMonth, setAmountPerMonth] = useState();
  const [isSupporter, setIsSupporter] = useState(false);

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


      const sf = new SuperfluidSDK.Framework({
        web3: new Web3(window.ethereum),
    });
    await sf.initialize()

    const user = sf.user({
      address: account,
      token: '0x8aE68021f6170E5a766bE613cEA0d75236ECCa9a'
    });

  const details = await user.details();

  if(details.cfa.flows.outFlows[0]) {
    setIsSupporter(true)
    const flowRate = details.cfa.flows.outFlows[0].flowRate;
    const formattedToEther = web3.utils.fromWei(flowRate, 'ether');
    setAmountPerSecond(formattedToEther)
    const formattedToEtherPerMonth = formattedToEther * 60 * 60 * 24 * 30;
    setAmountPerMonth(formattedToEtherPerMonth)
  }

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

        <p>Hi, I am a content creator. Please support me by sending me 
          <a className="App-link" target="_blank" href={"https://goerli.etherscan.io/address/0x8aE68021f6170E5a766bE613cEA0d75236ECCa9a"}> USDCx </a> 
          to 0x1Ad4474219e460B0Abd041565bB6C31666f39198 by opening a stream at <a className="App-link" target="_blank" href={"https://app.superfluid.finance/"}>Superfiuld</a></p>

      <p>Your current address: {currentAddress}</p>
      {isSupporter ? <><p>You are currently supporting</p> <p> {amountPerSecond} USDC per second</p>
      <p> {amountPerMonth} USDC per month</p></> : <p>You are currently not subscribed</p>}
        
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
