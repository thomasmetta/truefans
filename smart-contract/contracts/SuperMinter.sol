// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;


import {
    ISuperfluid,
    ISuperToken,
    ISuperAgreement
} from "https://github.com/superfluid-finance/protocol-monorepo/blob/remix-support/packages/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";

import {
    IConstantFlowAgreementV1
} from "https://github.com/superfluid-finance/protocol-monorepo/blob/remix-support/packages/ethereum-contracts/contracts/interfaces/agreements/IConstantFlowAgreementV1.sol";

import { TrueFansNFT } from './TrueFansNFT.sol';
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v3.4.0/contracts/math/SafeMath.sol";

contract SuperMinter is TrueFansNFT {
    
    using SafeMath for uint;
    
    ISuperfluid private _host; // host
    IConstantFlowAgreementV1 private _cfa; // the stored constant flow agreement class address
    ISuperToken private _acceptedToken; // accepted token
    address private _owner;
    int96 private _minimum;
    
    constructor(IConstantFlowAgreementV1 cfa, ISuperfluid host, ISuperToken acceptedToken, address owner, int96 minimum) public {
        assert(address(host) != address(0));
        assert(address(cfa) != address(0));
        assert(address(acceptedToken) != address(0));
        assert(address(owner) != address(0));
        //assert(!_host.isApp(ISuperApp(receiver)));

        _host = host;
        _cfa = cfa;
        _acceptedToken = acceptedToken;
        _owner = owner;
        _minimum = minimum;
        
    }
    
    event logTime(uint256 _value);
    
    function mint() public {
        
        
         (uint256 startTime, int96 flowRate,,) = _cfa.getFlow(_acceptedToken, msg.sender, _owner);
     
        logTime(startTime);
        
        //  timeSinceStarted is in seconds 
        uint256 timeSinceStarted = (block.timestamp - startTime);
        
        logTime(timeSinceStarted);
            // 3 hours
            if(timeSinceStarted > 10800 ) {
                //mint tier 1 NFT
                mintNFT(msg.sender,1);
            // 3 mins    
            } else if (timeSinceStarted > 180){
                //mint tier 2 NFT
                mintNFT(msg.sender,2);
            } else {
                //mint tier 3 NFTs
                mintNFT(msg.sender,3);
            }
          
    }
    
}