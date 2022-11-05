import "./ConnectWalletButton.css"
import { ethers, Signer } from "ethers"
import { SetStateAction } from "react"
import { io, Socket } from "socket.io-client"

import Cookies from "universal-cookie"

declare global {
  interface Window {
      ethereum:any
  }
}

interface Props {
  setAccount: React.Dispatch<SetStateAction<string | undefined>>
  setSigner: React.Dispatch<SetStateAction<Signer | undefined>>
  setSocket: React.Dispatch<SetStateAction<Socket | undefined>>
}

function ConnectWalletButton({setAccount, setSigner, setSocket}:Props) {

  async function handleClick(){
    if(window.ethereum){
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const accounts = await provider.send("eth_requestAccounts", []) as string[]
        const signer = provider.getSigner()
        setAccount(accounts[0])
        setSigner(signer)
        const cookies = new Cookies()
        if(cookies.get("signature") === undefined){
          const signature = await signer.signMessage("thats me")
          cookies.set("signature", signature)

          setSocket(io("ws://localhost:3344", {
            auth: {
              signature,
              address: accounts[0]
            }
          }))

          console.log("Wallet connected!")
          return
        }
      
      const signature = cookies.get("signature")

      setSocket(io("ws://localhost:3344", {
        auth: {
          signature,
          address: accounts[0]
        }
      }))

      console.log("Wallet connected!")
        
        

        

          


          

      } catch (error:any) {
          if(error.code === 4001) console.log("Rejected ;(")
      }
  } else {
      console.log("No wallet installed!")
  }
  }

  return (
    <div className="button" onClick={handleClick}>
     Connect Wallet
    </div>
  );
}



export default ConnectWalletButton;
