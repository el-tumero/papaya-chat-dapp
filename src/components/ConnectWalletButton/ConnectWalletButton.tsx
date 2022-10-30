import "./ConnectWalletButton.css"
import { ethers } from "ethers"
import { SetStateAction } from "react"

declare global {
  interface Window {
      ethereum:any
  }
}

interface Props {
  setAccount: React.Dispatch<SetStateAction<string | undefined>>
}

function ConnectWalletButton({setAccount}:Props) {

  async function handleClick(){
    if(window.ethereum){
      try {
          const provider = new ethers.providers.Web3Provider(window.ethereum)
          let accounts = await provider.send("eth_requestAccounts", []) as string[]

          setAccount(accounts[0])

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
