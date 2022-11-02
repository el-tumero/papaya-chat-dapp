// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;
contract PapayaStorage {

    mapping(address => string) private publicKeys;
    mapping(string => bool) private isPublicKeyIsTaken;

    function setPublicKey(string calldata _publicKey) public returns(bool) {
        require(!isPublicKeyIsTaken[_publicKey]);
        isPublicKeyIsTaken[_publicKey] = true;
        publicKeys[msg.sender] = _publicKey;
        return true;
    }

    function checkIfAddressIsInitialized() public view returns(bool) {
        bytes memory publicKey = bytes(publicKeys[msg.sender]);
        if(publicKey.length > 0) return true;
        return false;
    }

    function getPublicKey(address _address) public view returns(string memory){
        return publicKeys[_address];
    }
}