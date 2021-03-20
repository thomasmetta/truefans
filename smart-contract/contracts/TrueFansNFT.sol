pragma solidity ^0.7.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v3.4.0/contracts/token/ERC1155/ERC1155.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v3.4.0/contracts/introspection/IERC165.sol";

contract TrueFansNFT is ERC1155 {
    using SafeMath for uint;
    
    struct membership {
        uint256 tier;
        uint256 rarity;
        uint256 series;
    }
    
    membership[] public memberships;

    constructor() public ERC1155("https://api.truefans.finance/api/v1/membership/token/") {
        memberships.push(membership(0, 0, 0));
    }

    uint256 public cards;
    mapping(uint256 => uint256) public totalSupply;
    mapping(uint256 => uint256) public circulatingSupply;

    event CardAdded(uint256 id, uint256 maxSupply);

    function getMembership(uint256 tokenId) public view returns (uint256, uint256, uint256) {
        membership storage membership = memberships[tokenId];
        return (membership.tier, membership.rarity, membership.series);
    }
    
    function changeMembership(uint256 tokenId, uint256 tier, uint256 rarity, uint256 series) public returns (bool) {
        memberships[tokenId] = membership(tier, rarity, series);
        return true;
    }
    
    function addCard(uint256 maxSupply, uint256 tier, uint256 rarity, uint256 series) public returns (uint256) {
        require(maxSupply > 0, "Maximum supply can not be 0");
        cards = cards.add(1);
        totalSupply[cards] = maxSupply;
        emit CardAdded(cards, maxSupply);
        memberships.push(membership(tier, rarity, series));
        return cards;
    }

    function mintNFT(address to, uint256 id, uint256 amount) public {
        circulatingSupply[id] = circulatingSupply[id].add(amount);
        _mint(to, id, amount, "");
    }
}