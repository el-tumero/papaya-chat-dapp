// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract PapayaProfile is ERC721URIStorage {
    constructor() ERC721("PapayaProfile", "PAP") {}

    uint256 private counter = 0;

    function mint(string memory uri) public {
        _safeMint(msg.sender, counter);
        _setTokenURI(counter, uri);
        counter++;
    }
}