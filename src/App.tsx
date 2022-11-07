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
import deriveSecretKey from './utils/deriveSecretKey';
import jwkToCryptoKey from './utils/jwkToCryptoKey';

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
  const [openKeyPairScreen, setOpenKeyPairScreen] = useState<boolean>(false)

  const [lastMessageAddress, setLastMessageAddress] = useState<string[]>([])

  const serverUrl = process.env.REACT_APP_SERVER_URL

  useEffect(() => {
    if( (document.hidden || receiver !== lastMessageAddress[0]) && lastMessageAddress[0] ){
      new Notification("New message", {body: lastMessageAddress[0] + " send you a message!"})
      setLastMessageAddress([])
    }
  }, [lastMessageAddress, receiver])



  useEffect(() => {
    Notification.requestPermission().then(permision => {
      if(permision == "granted"){
        console.log("Notification access granted!")
      }
    })
  }, [])

  useEffect(() => {
    if(socket && account && isAccountInitialized){

      axios.get(serverUrl+"/messages", {params: {address: account}}).then(async response => {
        const data = response.data as IMessageDataContentAsObject[]
        if(data.length > 0){
            const pair = await getKeyPairFromDatabase()
            const secrets:{[key:string]: CryptoKey} = {}

            const messagesFromKnown = []
            let messagesFromUnknown:{[key:string]: number} = {}

            for(let i=0; i<data.length; i++){
              const rawJwk = localStorage.getItem("p"+data[i].from)

              if(rawJwk) messagesFromKnown.push(data[i])

              if(!rawJwk) messagesFromUnknown[data[i].from] = messagesFromUnknown[data[i].from] + 1 || 1

              if(!secrets[data[i].from] && rawJwk) {
                const jwk = JSON.parse(rawJwk)
                const publicKey = await jwkToCryptoKey(jwk)
                const secret = await deriveSecretKey(pair.privateKey, publicKey)
                secrets[data[i].from] = secret
              }
              
            }
            
            Object.keys(messagesFromUnknown).forEach(address => {
              console.log(messagesFromUnknown[address], "new messages from", address)
            });

            const decryptedMessages = messagesFromKnown.map(msg => decryptMessage(Uint8Array.from(msg.content.data).buffer, secrets[msg.from]))
              
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

        }
      })


      // console.log(account)
      socket.on(account, async(data:IMessageData) => {
        const pair = await getKeyPairFromDatabase()

        const rawJwk = localStorage.getItem("p" + data.from)
        if(rawJwk){
          const jwk = JSON.parse(rawJwk)
          const publicKey = await jwkToCryptoKey(jwk)
          const secret = await deriveSecretKey(pair.privateKey, publicKey)
          const decrypted = await decryptMessage(data.content, secret)

          setLastMessageAddress([data.from])

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


        }

      })
    }
  }, [isAccountInitialized])

  useEffect(() => {
    if(signer){
        const {address: storageAddress, abi: storageAbi} = papayaStorageData
        const papayaStorageContract = new ethers.Contract(storageAddress, storageAbi, signer)
        setStorageContract(papayaStorageContract)


        const {address: profileAddress, abi: profileAbi} = papayaProfileData
        const papayaProfileContract = new ethers.Contract(profileAddress, profileAbi, signer)
        setProfileContract(papayaProfileContract)


        papayaStorageContract.checkIfAddressIsInitialized()
        .then((result:boolean) => {

          // console.log(result)
          setIsLogged(true)
          setIsAccountInitialized(result)
          setOpenKeyPairScreen(!result)
        })
        
        console.log("Contract initialized & logged in!")
    }
  }, [signer])

  
  return (
      <div className="App">
      <header className="App-header">
        {(!openKeyPairScreen && isLogged && !receiver) &&
          <RelationList signer={signer} storageContract={storageContract} profileContract={profileContract} setReceiver={setReceiver} setOpenKeyPairScreen={setOpenKeyPairScreen} />
        }
        {receiver &&
          <MessageBox senderAddress={account} receiverAddress={receiver} setReceiver={setReceiver} contract={storageContract} socket={socket} messageDb={messageDb} />
        }
        {!isLogged &&
          <ConnectWalletButton setAccount={setAccount} setSigner={setSigner} setSocket={setSocket}></ConnectWalletButton>
        }
        {(isLogged && openKeyPairScreen) &&
          <KeyPair signer={signer} storageContract={storageContract} profileContract={profileContract} setOpenKeyPairScreen={setOpenKeyPairScreen} />
        }
        
      </header>
    </div>

    
  );
}

export default App;
