import React, { useEffect, useState } from 'react';
import ConnectWalletButton from './components/ConnectWalletButton/ConnectWalletButton';
import KeyPair from './components/KeyPair';


import './App.css';
import { Signer } from 'ethers';

function App() {

  const [account, setAccount] = useState<string>()
  const [signer, setSigner] = useState<Signer>()
  const [isLogged, setIsLogged] = useState<boolean>(false)

  useEffect(() => {
    if(account) setIsLogged(true)
  }, [account])


  return (
      <div className="App">
      <header className="App-header">
        {isLogged &&
          <KeyPair signer={signer} />
        }
        {!isLogged &&
          <ConnectWalletButton setAccount={setAccount} setSigner={setSigner}></ConnectWalletButton>
        }
        
      </header>
    </div>

    
  );
}

export default App;
