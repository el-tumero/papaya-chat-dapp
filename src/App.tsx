import React, { useEffect, useState } from 'react';
import ConnectWalletButton from './components/ConnectWalletButton/ConnectWalletButton';
import KeyPair from './components/KeyPair';
import papayaStorageData from "./abis/PapayaStorage.json"
import papayaProfileData from "./abis/PapayaProfile.json"
import MessageBox from './components/MessageBox/MessageBox';


import './App.css';
import { ethers, Signer } from 'ethers';
import RelationList from './components/RelationList/RelationList';
import { Socket } from 'socket.io-client';
import getKeyPairFromDatabase from './utils/getKeyPairFromDatabase';
import IMessageData from './types/IMessageData';
import IMessageDataDb from './types/IMessageDataDb';
import decryptMessage from './utils/decryptMessage';
import axios from 'axios';

interface IMessageDataContentAsObject extends Omit<IMessageData, "content">{
  content: {type: string, data:number[]}
}

function App() {

  const [account, setAccount] = useState<string>()
  const [signer, setSigner] = useState<Signer>()
  const [isLogged, setIsLogged] = useState<boolean>(false)
  const [isAccountInitialized, setIsAccountInitialized] = useState<boolean>(false)
  const [storageContract, setStorageContract] = useState<ethers.Contract>()
  const [profileContract, setProfileContract] = useState<ethers.Contract>()
  const [receiver, setReceiver] = useState<string>()
  const [socket, setSocket] = useState<Socket>()
  const [messageDb, setMessageDb] = useState<IMessageDataDb>({})


  // useEffect(() => {
  //   console.log(isAccountInitialized)
  //   console.log(isLogged)
  // })

  

  useEffect(() => {
    if(socket && account && isAccountInitialized){

      axios.get("http://localhost:3344/messages", {params: {address: account}}).then(response => {
        const data = response.data as IMessageDataContentAsObject[]
        if(data.length > 0){
          getKeyPairFromDatabase((pair) => {
            const decryptedMessages = data.map(msg => decryptMessage(Uint8Array.from(msg.content.data).buffer, pair) )
            
            Promise.all(decryptedMessages).then(values => {

              const temp:IMessageDataDb = {}
              data.forEach((element, i) => {
                
                if(temp[element.from]){
                  temp[element.from].push({timestamp: element.timestamp, content: values[i]})
                } else {
                  temp[element.from] = [{timestamp: element.timestamp, content: values[i]}]
                }
              })

              setMessageDb(temp)
            })
          })
        }
      })


      console.log(account)
      socket.on(account, (data:IMessageData) => {
        getKeyPairFromDatabase((pair) => {
          decryptMessage(data.content, pair).then(decrypted => {
            console.log(data.content)

            const rawInfo = localStorage.getItem(data.from)
            console.log(data.from)
            if(rawInfo) {
              const info = JSON.parse(rawInfo)
              console.log("New message from:",info.name, decrypted)
            } else {
              console.log("New message from:",data.from, decrypted)
            }

            setMessageDb(prev => {
            
            if(prev[data.from]) return ({
              ...prev,
              [data.from]: [...prev[data.from], {timestamp: data.timestamp, content: decrypted}]
            })  
            return ({
              ...prev,
              [data.from]: [{timestamp: data.timestamp, content: decrypted}]
            })

          })  
          })
        })

      })
    }
  }, [isAccountInitialized])

  useEffect(() => {
    console.log(messageDb)
  },[messageDb])

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
        
        console.log("Contract initialized & logged in!")
    }
  }, [signer])

  


  return (
      <div className="App">
      <header className="App-header">
        {(isAccountInitialized && isLogged && !receiver) &&
          <RelationList signer={signer} storageContract={storageContract} profileContract={profileContract} setReceiver={setReceiver} />
          // <div>
          //   <button onClick={() => setReceiver("0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199".toLowerCase())}>Chorome</button>
          //   <button onClick={() => setReceiver("0xdD2FD4581271e230360230F9337D5c0430Bf44C0".toLowerCase())}>Brave</button>
          // </div>
        }
        {receiver &&
          <MessageBox senderAddress={account} receiverAddress={receiver} setReceiver={setReceiver} contract={storageContract} socket={socket} messageDb={messageDb} />
        }
        {!isLogged &&
          <ConnectWalletButton setAccount={setAccount} setSigner={setSigner} setSocket={setSocket}></ConnectWalletButton>
        }
        {(!isAccountInitialized && isLogged) &&
          <KeyPair signer={signer} storageContract={storageContract} profileContract={profileContract} />
        }
        
      </header>
    </div>

    
  );
}

export default App;
