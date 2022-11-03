import React, { useEffect, useState } from 'react';
import ConnectWalletButton from './components/ConnectWalletButton/ConnectWalletButton';
import KeyPair from './components/KeyPair';
import papayaStorageData from "./abis/PapayaStorage.json"
import papayaProfileData from "./abis/PapayaProfile.json"
import MessageBox from './components/MessageBox/MessageBox';
import Cookies from 'universal-cookie'

import './App.css';
import { ethers, Signer } from 'ethers';

function App() {

  const [account, setAccount] = useState<string>()
  const [signer, setSigner] = useState<Signer>()
  const [isLogged, setIsLogged] = useState<boolean>(false)
  const [isAccountInitialized, setIsAccountInitialized] = useState<boolean>(false)
  const [storageContract, setStorageContract] = useState<ethers.Contract>()
  const [profileContract, setProfileContract] = useState<ethers.Contract>()
  const [receiver, setReceiver] = useState<string>()

  // useEffect(() => {
  //   console.log(isAccountInitialized)
  // })

  useEffect(() => {
    if(signer){
        const {address: storageAddress, abi: storageAbi} = papayaStorageData
        const papayaStorageContract = new ethers.Contract(storageAddress, storageAbi, signer)
        setStorageContract(papayaStorageContract)


        const {address: profileAddress, abi: profileAbi} = papayaProfileData
        const papayaProfileContract = new ethers.Contract(profileAddress, profileAbi, signer)
        setProfileContract(papayaProfileContract)


        papayaStorageContract.checkIfAddressIsInitialized()
        .then((result:any) => {

          console.log(result)
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
        {/* {(isAccountInitialized && isLogged && !receiver) &&
          <div>
            <button onClick={() => setReceiver("0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199".toLowerCase())}>Chorome</button>
            <button onClick={() => setReceiver("0xdD2FD4581271e230360230F9337D5c0430Bf44C0".toLowerCase())}>Brave</button>
          </div>
        } */}
        {receiver &&
          <MessageBox senderAddress={account} receiverAddress={receiver} contract={storageContract} />
        }
        {!isLogged &&
          <ConnectWalletButton setAccount={setAccount} setSigner={setSigner}></ConnectWalletButton>
        }
        {(isAccountInitialized && isLogged) &&
          <KeyPair signer={signer} storageContract={storageContract} profileContract={profileContract} />
        }
        
      </header>
    </div>

    
  );
}

export default App;
