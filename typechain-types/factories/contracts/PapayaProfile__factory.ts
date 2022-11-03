/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../common";
import type {
  PapayaProfile,
  PapayaProfileInterface,
} from "../../contracts/PapayaProfile";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "approved",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "getApproved",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "isApprovedForAll",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "uri",
        type: "string",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "ownerOf",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "tokenURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405260006007553480156200001657600080fd5b506040518060400160405280600d81526020017f50617061796150726f66696c65000000000000000000000000000000000000008152506040518060400160405280600381526020017f5041500000000000000000000000000000000000000000000000000000000000815250816000908162000094919062000329565b508060019081620000a6919062000329565b50505062000410565b600081519050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b600060028204905060018216806200013157607f821691505b602082108103620001475762000146620000e9565b5b50919050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b600060088302620001b17fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8262000172565b620001bd868362000172565b95508019841693508086168417925050509392505050565b6000819050919050565b6000819050919050565b60006200020a62000204620001fe84620001d5565b620001df565b620001d5565b9050919050565b6000819050919050565b6200022683620001e9565b6200023e620002358262000211565b8484546200017f565b825550505050565b600090565b6200025562000246565b620002628184846200021b565b505050565b5b818110156200028a576200027e6000826200024b565b60018101905062000268565b5050565b601f821115620002d957620002a3816200014d565b620002ae8462000162565b81016020851015620002be578190505b620002d6620002cd8562000162565b83018262000267565b50505b505050565b600082821c905092915050565b6000620002fe60001984600802620002de565b1980831691505092915050565b6000620003198383620002eb565b9150826002028217905092915050565b6200033482620000af565b67ffffffffffffffff81111562000350576200034f620000ba565b5b6200035c825462000118565b620003698282856200028e565b600060209050601f831160018114620003a157600084156200038c578287015190505b6200039885826200030b565b86555062000408565b601f198416620003b1866200014d565b60005b82811015620003db57848901518255600182019150602085019450602081019050620003b4565b86831015620003fb5784890151620003f7601f891682620002eb565b8355505b6001600288020188555050505b505050505050565b612a6080620004206000396000f3fe608060405234801561001057600080fd5b50600436106100ea5760003560e01c806370a082311161008c578063b88d4fde11610066578063b88d4fde1461025b578063c87b56dd14610277578063d85d3d27146102a7578063e985e9c5146102c3576100ea565b806370a08231146101f157806395d89b4114610221578063a22cb4651461023f576100ea565b8063095ea7b3116100c8578063095ea7b31461016d57806323b872dd1461018957806342842e0e146101a55780636352211e146101c1576100ea565b806301ffc9a7146100ef57806306fdde031461011f578063081812fc1461013d575b600080fd5b610109600480360381019061010491906117f2565b6102f3565b604051610116919061183a565b60405180910390f35b6101276103d5565b60405161013491906118e5565b60405180910390f35b6101576004803603810190610152919061193d565b610467565b60405161016491906119ab565b60405180910390f35b610187600480360381019061018291906119f2565b6104ad565b005b6101a3600480360381019061019e9190611a32565b6105c4565b005b6101bf60048036038101906101ba9190611a32565b610624565b005b6101db60048036038101906101d6919061193d565b610644565b6040516101e891906119ab565b60405180910390f35b61020b60048036038101906102069190611a85565b6106f5565b6040516102189190611ac1565b60405180910390f35b6102296107ac565b60405161023691906118e5565b60405180910390f35b61025960048036038101906102549190611b08565b61083e565b005b61027560048036038101906102709190611c7d565b610854565b005b610291600480360381019061028c919061193d565b6108b6565b60405161029e91906118e5565b60405180910390f35b6102c160048036038101906102bc9190611da1565b6109c8565b005b6102dd60048036038101906102d89190611dea565b6109fb565b6040516102ea919061183a565b60405180910390f35b60007f80ac58cd000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191614806103be57507f5b5e139f000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916145b806103ce57506103cd82610a8f565b5b9050919050565b6060600080546103e490611e59565b80601f016020809104026020016040519081016040528092919081815260200182805461041090611e59565b801561045d5780601f106104325761010080835404028352916020019161045d565b820191906000526020600020905b81548152906001019060200180831161044057829003601f168201915b5050505050905090565b600061047282610af9565b6004600083815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050919050565b60006104b882610644565b90508073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1603610528576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161051f90611efc565b60405180910390fd5b8073ffffffffffffffffffffffffffffffffffffffff16610547610b44565b73ffffffffffffffffffffffffffffffffffffffff161480610576575061057581610570610b44565b6109fb565b5b6105b5576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016105ac90611f8e565b60405180910390fd5b6105bf8383610b4c565b505050565b6105d56105cf610b44565b82610c05565b610614576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161060b90612020565b60405180910390fd5b61061f838383610c9a565b505050565b61063f83838360405180602001604052806000815250610854565b505050565b6000806002600084815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16036106ec576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016106e39061208c565b60405180910390fd5b80915050919050565b60008073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603610765576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161075c9061211e565b60405180910390fd5b600360008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b6060600180546107bb90611e59565b80601f01602080910402602001604051908101604052809291908181526020018280546107e790611e59565b80156108345780601f1061080957610100808354040283529160200191610834565b820191906000526020600020905b81548152906001019060200180831161081757829003601f168201915b5050505050905090565b610850610849610b44565b8383610f00565b5050565b61086561085f610b44565b83610c05565b6108a4576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161089b90612020565b60405180910390fd5b6108b08484848461106c565b50505050565b60606108c182610af9565b60006006600084815260200190815260200160002080546108e190611e59565b80601f016020809104026020016040519081016040528092919081815260200182805461090d90611e59565b801561095a5780601f1061092f5761010080835404028352916020019161095a565b820191906000526020600020905b81548152906001019060200180831161093d57829003601f168201915b50505050509050600061096b6110c8565b905060008151036109805781925050506109c3565b6000825111156109b557808260405160200161099d92919061217a565b604051602081830303815290604052925050506109c3565b6109be846110df565b925050505b919050565b6109d433600754611147565b6109e060075482611165565b600760008154809291906109f3906121cd565b919050555050565b6000600560008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16905092915050565b60007f01ffc9a7000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916149050919050565b610b02816111d2565b610b41576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610b389061208c565b60405180910390fd5b50565b600033905090565b816004600083815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550808273ffffffffffffffffffffffffffffffffffffffff16610bbf83610644565b73ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45050565b600080610c1183610644565b90508073ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff161480610c535750610c5281856109fb565b5b80610c9157508373ffffffffffffffffffffffffffffffffffffffff16610c7984610467565b73ffffffffffffffffffffffffffffffffffffffff16145b91505092915050565b8273ffffffffffffffffffffffffffffffffffffffff16610cba82610644565b73ffffffffffffffffffffffffffffffffffffffff1614610d10576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610d0790612287565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603610d7f576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610d7690612319565b60405180910390fd5b610d8a83838361123e565b610d95600082610b4c565b6001600360008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254610de59190612339565b925050819055506001600360008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254610e3c919061236d565b92505081905550816002600083815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550808273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef60405160405180910390a4610efb838383611243565b505050565b8173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1603610f6e576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610f65906123ed565b60405180910390fd5b80600560008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff0219169083151502179055508173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c318360405161105f919061183a565b60405180910390a3505050565b611077848484610c9a565b61108384848484611248565b6110c2576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016110b99061247f565b60405180910390fd5b50505050565b606060405180602001604052806000815250905090565b60606110ea82610af9565b60006110f46110c8565b90506000815111611114576040518060200160405280600081525061113f565b8061111e846113cf565b60405160200161112f92919061217a565b6040516020818303038152906040525b915050919050565b61116182826040518060200160405280600081525061152f565b5050565b61116e826111d2565b6111ad576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016111a490612511565b60405180910390fd5b806006600084815260200190815260200160002090816111cd91906126dd565b505050565b60008073ffffffffffffffffffffffffffffffffffffffff166002600084815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614159050919050565b505050565b505050565b60006112698473ffffffffffffffffffffffffffffffffffffffff1661158a565b156113c2578373ffffffffffffffffffffffffffffffffffffffff1663150b7a02611292610b44565b8786866040518563ffffffff1660e01b81526004016112b49493929190612804565b6020604051808303816000875af19250505080156112f057506040513d601f19601f820116820180604052508101906112ed9190612865565b60015b611372573d8060008114611320576040519150601f19603f3d011682016040523d82523d6000602084013e611325565b606091505b50600081510361136a576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016113619061247f565b60405180910390fd5b805181602001fd5b63150b7a0260e01b7bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916817bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916149150506113c7565b600190505b949350505050565b606060008203611416576040518060400160405280600181526020017f3000000000000000000000000000000000000000000000000000000000000000815250905061152a565b600082905060005b60008214611448578080611431906121cd565b915050600a8261144191906128c1565b915061141e565b60008167ffffffffffffffff81111561146457611463611b52565b5b6040519080825280601f01601f1916602001820160405280156114965781602001600182028036833780820191505090505b5090505b60008514611523576001826114af9190612339565b9150600a856114be91906128f2565b60306114ca919061236d565b60f81b8183815181106114e0576114df612923565b5b60200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a905350600a8561151c91906128c1565b945061149a565b8093505050505b919050565b61153983836115ad565b6115466000848484611248565b611585576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161157c9061247f565b60405180910390fd5b505050565b6000808273ffffffffffffffffffffffffffffffffffffffff163b119050919050565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff160361161c576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016116139061299e565b60405180910390fd5b611625816111d2565b15611665576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161165c90612a0a565b60405180910390fd5b6116716000838361123e565b6001600360008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546116c1919061236d565b92505081905550816002600083815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550808273ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef60405160405180910390a461178260008383611243565b5050565b6000604051905090565b600080fd5b600080fd5b60007fffffffff0000000000000000000000000000000000000000000000000000000082169050919050565b6117cf8161179a565b81146117da57600080fd5b50565b6000813590506117ec816117c6565b92915050565b60006020828403121561180857611807611790565b5b6000611816848285016117dd565b91505092915050565b60008115159050919050565b6118348161181f565b82525050565b600060208201905061184f600083018461182b565b92915050565b600081519050919050565b600082825260208201905092915050565b60005b8381101561188f578082015181840152602081019050611874565b60008484015250505050565b6000601f19601f8301169050919050565b60006118b782611855565b6118c18185611860565b93506118d1818560208601611871565b6118da8161189b565b840191505092915050565b600060208201905081810360008301526118ff81846118ac565b905092915050565b6000819050919050565b61191a81611907565b811461192557600080fd5b50565b60008135905061193781611911565b92915050565b60006020828403121561195357611952611790565b5b600061196184828501611928565b91505092915050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006119958261196a565b9050919050565b6119a58161198a565b82525050565b60006020820190506119c0600083018461199c565b92915050565b6119cf8161198a565b81146119da57600080fd5b50565b6000813590506119ec816119c6565b92915050565b60008060408385031215611a0957611a08611790565b5b6000611a17858286016119dd565b9250506020611a2885828601611928565b9150509250929050565b600080600060608486031215611a4b57611a4a611790565b5b6000611a59868287016119dd565b9350506020611a6a868287016119dd565b9250506040611a7b86828701611928565b9150509250925092565b600060208284031215611a9b57611a9a611790565b5b6000611aa9848285016119dd565b91505092915050565b611abb81611907565b82525050565b6000602082019050611ad66000830184611ab2565b92915050565b611ae58161181f565b8114611af057600080fd5b50565b600081359050611b0281611adc565b92915050565b60008060408385031215611b1f57611b1e611790565b5b6000611b2d858286016119dd565b9250506020611b3e85828601611af3565b9150509250929050565b600080fd5b600080fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b611b8a8261189b565b810181811067ffffffffffffffff82111715611ba957611ba8611b52565b5b80604052505050565b6000611bbc611786565b9050611bc88282611b81565b919050565b600067ffffffffffffffff821115611be857611be7611b52565b5b611bf18261189b565b9050602081019050919050565b82818337600083830152505050565b6000611c20611c1b84611bcd565b611bb2565b905082815260208101848484011115611c3c57611c3b611b4d565b5b611c47848285611bfe565b509392505050565b600082601f830112611c6457611c63611b48565b5b8135611c74848260208601611c0d565b91505092915050565b60008060008060808587031215611c9757611c96611790565b5b6000611ca5878288016119dd565b9450506020611cb6878288016119dd565b9350506040611cc787828801611928565b925050606085013567ffffffffffffffff811115611ce857611ce7611795565b5b611cf487828801611c4f565b91505092959194509250565b600067ffffffffffffffff821115611d1b57611d1a611b52565b5b611d248261189b565b9050602081019050919050565b6000611d44611d3f84611d00565b611bb2565b905082815260208101848484011115611d6057611d5f611b4d565b5b611d6b848285611bfe565b509392505050565b600082601f830112611d8857611d87611b48565b5b8135611d98848260208601611d31565b91505092915050565b600060208284031215611db757611db6611790565b5b600082013567ffffffffffffffff811115611dd557611dd4611795565b5b611de184828501611d73565b91505092915050565b60008060408385031215611e0157611e00611790565b5b6000611e0f858286016119dd565b9250506020611e20858286016119dd565b9150509250929050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b60006002820490506001821680611e7157607f821691505b602082108103611e8457611e83611e2a565b5b50919050565b7f4552433732313a20617070726f76616c20746f2063757272656e74206f776e6560008201527f7200000000000000000000000000000000000000000000000000000000000000602082015250565b6000611ee6602183611860565b9150611ef182611e8a565b604082019050919050565b60006020820190508181036000830152611f1581611ed9565b9050919050565b7f4552433732313a20617070726f76652063616c6c6572206973206e6f7420746f60008201527f6b656e206f776e6572206e6f7220617070726f76656420666f7220616c6c0000602082015250565b6000611f78603e83611860565b9150611f8382611f1c565b604082019050919050565b60006020820190508181036000830152611fa781611f6b565b9050919050565b7f4552433732313a2063616c6c6572206973206e6f7420746f6b656e206f776e6560008201527f72206e6f7220617070726f766564000000000000000000000000000000000000602082015250565b600061200a602e83611860565b915061201582611fae565b604082019050919050565b6000602082019050818103600083015261203981611ffd565b9050919050565b7f4552433732313a20696e76616c696420746f6b656e2049440000000000000000600082015250565b6000612076601883611860565b915061208182612040565b602082019050919050565b600060208201905081810360008301526120a581612069565b9050919050565b7f4552433732313a2061646472657373207a65726f206973206e6f74206120766160008201527f6c6964206f776e65720000000000000000000000000000000000000000000000602082015250565b6000612108602983611860565b9150612113826120ac565b604082019050919050565b60006020820190508181036000830152612137816120fb565b9050919050565b600081905092915050565b600061215482611855565b61215e818561213e565b935061216e818560208601611871565b80840191505092915050565b60006121868285612149565b91506121928284612149565b91508190509392505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b60006121d882611907565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff820361220a5761220961219e565b5b600182019050919050565b7f4552433732313a207472616e736665722066726f6d20696e636f72726563742060008201527f6f776e6572000000000000000000000000000000000000000000000000000000602082015250565b6000612271602583611860565b915061227c82612215565b604082019050919050565b600060208201905081810360008301526122a081612264565b9050919050565b7f4552433732313a207472616e7366657220746f20746865207a65726f2061646460008201527f7265737300000000000000000000000000000000000000000000000000000000602082015250565b6000612303602483611860565b915061230e826122a7565b604082019050919050565b60006020820190508181036000830152612332816122f6565b9050919050565b600061234482611907565b915061234f83611907565b92508282039050818111156123675761236661219e565b5b92915050565b600061237882611907565b915061238383611907565b925082820190508082111561239b5761239a61219e565b5b92915050565b7f4552433732313a20617070726f766520746f2063616c6c657200000000000000600082015250565b60006123d7601983611860565b91506123e2826123a1565b602082019050919050565b60006020820190508181036000830152612406816123ca565b9050919050565b7f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560008201527f63656976657220696d706c656d656e7465720000000000000000000000000000602082015250565b6000612469603283611860565b91506124748261240d565b604082019050919050565b600060208201905081810360008301526124988161245c565b9050919050565b7f45524337323155524953746f726167653a2055524920736574206f66206e6f6e60008201527f6578697374656e7420746f6b656e000000000000000000000000000000000000602082015250565b60006124fb602e83611860565b91506125068261249f565b604082019050919050565b6000602082019050818103600083015261252a816124ee565b9050919050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b6000600883026125937fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82612556565b61259d8683612556565b95508019841693508086168417925050509392505050565b6000819050919050565b60006125da6125d56125d084611907565b6125b5565b611907565b9050919050565b6000819050919050565b6125f4836125bf565b612608612600826125e1565b848454612563565b825550505050565b600090565b61261d612610565b6126288184846125eb565b505050565b5b8181101561264c57612641600082612615565b60018101905061262e565b5050565b601f8211156126915761266281612531565b61266b84612546565b8101602085101561267a578190505b61268e61268685612546565b83018261262d565b50505b505050565b600082821c905092915050565b60006126b460001984600802612696565b1980831691505092915050565b60006126cd83836126a3565b9150826002028217905092915050565b6126e682611855565b67ffffffffffffffff8111156126ff576126fe611b52565b5b6127098254611e59565b612714828285612650565b600060209050601f8311600181146127475760008415612735578287015190505b61273f85826126c1565b8655506127a7565b601f19841661275586612531565b60005b8281101561277d57848901518255600182019150602085019450602081019050612758565b8683101561279a5784890151612796601f8916826126a3565b8355505b6001600288020188555050505b505050505050565b600081519050919050565b600082825260208201905092915050565b60006127d6826127af565b6127e081856127ba565b93506127f0818560208601611871565b6127f98161189b565b840191505092915050565b6000608082019050612819600083018761199c565b612826602083018661199c565b6128336040830185611ab2565b818103606083015261284581846127cb565b905095945050505050565b60008151905061285f816117c6565b92915050565b60006020828403121561287b5761287a611790565b5b600061288984828501612850565b91505092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b60006128cc82611907565b91506128d783611907565b9250826128e7576128e6612892565b5b828204905092915050565b60006128fd82611907565b915061290883611907565b92508261291857612917612892565b5b828206905092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b7f4552433732313a206d696e7420746f20746865207a65726f2061646472657373600082015250565b6000612988602083611860565b915061299382612952565b602082019050919050565b600060208201905081810360008301526129b78161297b565b9050919050565b7f4552433732313a20746f6b656e20616c7265616479206d696e74656400000000600082015250565b60006129f4601c83611860565b91506129ff826129be565b602082019050919050565b60006020820190508181036000830152612a23816129e7565b905091905056fea26469706673582212209f1b469dc74d340029b052cb8c1a8fb45940d7c7823ea6f06c37c023124d80f164736f6c63430008110033";

type PapayaProfileConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: PapayaProfileConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class PapayaProfile__factory extends ContractFactory {
  constructor(...args: PapayaProfileConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<PapayaProfile> {
    return super.deploy(overrides || {}) as Promise<PapayaProfile>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): PapayaProfile {
    return super.attach(address) as PapayaProfile;
  }
  override connect(signer: Signer): PapayaProfile__factory {
    return super.connect(signer) as PapayaProfile__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): PapayaProfileInterface {
    return new utils.Interface(_abi) as PapayaProfileInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): PapayaProfile {
    return new Contract(address, _abi, signerOrProvider) as PapayaProfile;
  }
}