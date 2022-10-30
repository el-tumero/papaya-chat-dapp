import React, { useEffect, useState } from 'react';
import ConnectWalletButton from './components/ConnectWalletButton/ConnectWalletButton';
import Conversation from './components/Conversation';

import './App.css';



function App() {

  const [account, setAccount] = useState<string>()
  const [isLogged, setIsLogged] = useState<boolean>(false)

  useEffect(() => {
    if(account) setIsLogged(true)
  }, [account])


  return (
      <div className="App">
      <header className="App-header">
        {isLogged &&
          <Conversation />
        }
        {!isLogged &&
          <ConnectWalletButton setAccount={setAccount}></ConnectWalletButton>
        }
        
      </header>
    </div>

    
  );
}

export default App;
