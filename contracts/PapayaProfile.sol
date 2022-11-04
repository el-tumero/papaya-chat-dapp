// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract PapayaProfile is ERC721URIStorage {
    constructor() ERC721("PapayaProfile", "PAP") {}

    uint256 private counter = 1;
    mapping (address => uint256) private activeProfileTokenId;

    function mint(string memory uri) public {
        _safeMint(msg.sender, counter);
        _setTokenURI(counter, uri);
        activeProfileTokenId[msg.sender] = counter;
        counter++;
    }

    function activeProfile(address owner) public view returns (string memory) {
       require(activeProfileTokenId[owner] != 0);
       return tokenURI(activeProfileTokenId[owner]);
    }

}