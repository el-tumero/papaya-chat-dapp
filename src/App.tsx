import React, { useEffect, useState } from 'react';
import ConnectWalletButton from './components/ConnectWalletButton/ConnectWalletButton';
import KeyPair from './components/KeyPair';
import papayaStorageData from "./abis/PapayaStorage.json"
import MessageBox from './components/MessageBox/MessageBox';
import Cookies from 'universal-cookie'

import './App.css';
import { ethers, Signer } from 'ethers';

function App() {

  const [account, setAccount] = useState<string>()
  const [signer, setSigner] = useState<Signer>()
  const [isLogged, setIsLogged] = useState<boolean>(false)
  const [isAccountInitialized, setIsAccountInitialized] = useState<boolean>(false)
  const [contract, setContract] = useState<ethers.Contract>()
  const [receiver, setReceiver] = useState<string>()


  useEffect(() => {
    if(signer){
        const {address, abi} = papayaStorageData
        const papayaStorageContract = new ethers.Contract(address, abi, signer)
        setContract(papayaStorageContract)

        

        papayaStorageContract.checkIfAddressIsInitialized()
        .then((result:any) => {
          setIsLogged(true)
          setIsAccountInitialized(result)
        })

        const cookies = new Cookies()
        if(cookies.get("signature") === undefined){
          signer.signMessage("thats me").then(result => {
            cookies.set("signature", result)
          })
        }
        
        console.log("Contract initialized & logged in!")
    }
  }, [signer])

  


  return (
      <div className="App">
      <header className="App-header">
        {(isAccountInitialized && isLogged && !receiver) &&
          <div>
            <button onClick={() => setReceiver("0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199".toLowerCase())}>Chorome</button>
            <button onClick={() => setReceiver("0xdD2FD4581271e230360230F9337D5c0430Bf44C0".toLowerCase())}>Brave</button>
          </div>
        }
        {receiver &&
          <MessageBox senderAddress={account} receiverAddress={receiver} contract={contract} />
        }
        {!isLogged &&
          <ConnectWalletButton setAccount={setAccount} setSigner={setSigner}></ConnectWalletButton>
        }
        {(!isAccountInitialized && isLogged) &&
          <KeyPair signer={signer} contract={contract} />
        }
        
      </header>
    </div>

    
  );
}

export default App;
