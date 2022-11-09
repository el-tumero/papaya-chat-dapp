/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../common";
import type { PapayaStorage, PapayaStorageInterface } from "../PapayaStorage";

const _abi = [
  {
    inputs: [],
    name: "checkIfAddressIsInitialized",
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
        internalType: "address",
        name: "_address",
        type: "address",
      },
    ],
    name: "getPublicKey",
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
        internalType: "string",
        name: "_publicKey",
        type: "string",
      },
    ],
    name: "setPublicKey",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50610924806100206000396000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c80636f6fc07714610046578063857cdbb814610076578063943fafc8146100a6575b600080fd5b610060600480360381019061005b91906103b6565b6100c4565b60405161006d919061041e565b60405180910390f35b610090600480360381019061008b9190610497565b61018e565b60405161009d9190610554565b60405180910390f35b6100ae61025e565b6040516100bb919061041e565b60405180910390f35b6000600183836040516100d89291906105b5565b908152602001604051809103902060009054906101000a900460ff16156100fe57600080fd5b60018084846040516101119291906105b5565b908152602001604051809103902060006101000a81548160ff02191690831515021790555082826000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020918261018392919061081e565b506001905092915050565b60606000808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002080546101d990610637565b80601f016020809104026020016040519081016040528092919081815260200182805461020590610637565b80156102525780601f1061022757610100808354040283529160200191610252565b820191906000526020600020905b81548152906001019060200180831161023557829003601f168201915b50505050509050919050565b6000806000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002080546102aa90610637565b80601f01602080910402602001604051908101604052809291908181526020018280546102d690610637565b80156103235780601f106102f857610100808354040283529160200191610323565b820191906000526020600020905b81548152906001019060200180831161030657829003601f168201915b5050505050905060008151111561033e576001915050610344565b60009150505b90565b600080fd5b600080fd5b600080fd5b600080fd5b600080fd5b60008083601f84011261037657610375610351565b5b8235905067ffffffffffffffff81111561039357610392610356565b5b6020830191508360018202830111156103af576103ae61035b565b5b9250929050565b600080602083850312156103cd576103cc610347565b5b600083013567ffffffffffffffff8111156103eb576103ea61034c565b5b6103f785828601610360565b92509250509250929050565b60008115159050919050565b61041881610403565b82525050565b6000602082019050610433600083018461040f565b92915050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600061046482610439565b9050919050565b61047481610459565b811461047f57600080fd5b50565b6000813590506104918161046b565b92915050565b6000602082840312156104ad576104ac610347565b5b60006104bb84828501610482565b91505092915050565b600081519050919050565b600082825260208201905092915050565b60005b838110156104fe5780820151818401526020810190506104e3565b60008484015250505050565b6000601f19601f8301169050919050565b6000610526826104c4565b61053081856104cf565b93506105408185602086016104e0565b6105498161050a565b840191505092915050565b6000602082019050818103600083015261056e818461051b565b905092915050565b600081905092915050565b82818337600083830152505050565b600061059c8385610576565b93506105a9838584610581565b82840190509392505050565b60006105c2828486610590565b91508190509392505050565b600082905092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6000600282049050600182168061064f57607f821691505b60208210810361066257610661610608565b5b50919050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b6000600883026106ca7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8261068d565b6106d4868361068d565b95508019841693508086168417925050509392505050565b6000819050919050565b6000819050919050565b600061071b610716610711846106ec565b6106f6565b6106ec565b9050919050565b6000819050919050565b61073583610700565b61074961074182610722565b84845461069a565b825550505050565b600090565b61075e610751565b61076981848461072c565b505050565b5b8181101561078d57610782600082610756565b60018101905061076f565b5050565b601f8211156107d2576107a381610668565b6107ac8461067d565b810160208510156107bb578190505b6107cf6107c78561067d565b83018261076e565b50505b505050565b600082821c905092915050565b60006107f5600019846008026107d7565b1980831691505092915050565b600061080e83836107e4565b9150826002028217905092915050565b61082883836105ce565b67ffffffffffffffff811115610841576108406105d9565b5b61084b8254610637565b610856828285610791565b6000601f8311600181146108855760008415610873578287013590505b61087d8582610802565b8655506108e5565b601f19841661089386610668565b60005b828110156108bb57848901358255600182019150602085019450602081019050610896565b868310156108d857848901356108d4601f8916826107e4565b8355505b6001600288020188555050505b5050505050505056fea26469706673582212205b14406585d4e00c600b6090bc7e572a1e60d8de8d9cd1a1f369275357def0dc64736f6c63430008110033";

type PapayaStorageConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: PapayaStorageConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class PapayaStorage__factory extends ContractFactory {
  constructor(...args: PapayaStorageConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<PapayaStorage> {
    return super.deploy(overrides || {}) as Promise<PapayaStorage>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): PapayaStorage {
    return super.attach(address) as PapayaStorage;
  }
  override connect(signer: Signer): PapayaStorage__factory {
    return super.connect(signer) as PapayaStorage__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): PapayaStorageInterface {
    return new utils.Interface(_abi) as PapayaStorageInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): PapayaStorage {
    return new Contract(address, _abi, signerOrProvider) as PapayaStorage;
  }
}