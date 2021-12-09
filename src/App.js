import {useState, useEffect, useCallback } from 'react'
import Menus from './components/Menu';
import ConnectButton from './components/ConnectButton';
import Card from './views/Card';
import History from './views/History';
import User from './auth/user';
import Admin from './auth/admin';

import {Route, Routes} from 'react-router-dom'
import { useEthers, useEtherBalance } from "@usedapp/core";
import {Flex, Button, Heading, Stack, Text} from "@chakra-ui/react";

function App() {
  const {activateBrowserWallet, account } = useEthers();
  const etherBalance = useEtherBalance(account);

  const handleConnectWallet = async ()=>{
    activateBrowserWallet();
  }

  return account ?(
    <div className="App p-10">
      {account === process.env.REACT_APP_OWNER_WALLET_ADDRESS ? (<Admin/>) : (<User/>)}
    </div>
  ) : (
    <Flex justifyContent='center' alignItems='center' flexDirection='column' height='80vh'>
        <Stack>
            <Heading>Welcome to Willy's Store</Heading>
            <Flex justifyContent='center' alignItems='center'>
                <Text mr={5}>Please Connect to Wallet:</Text>
                <Button onClick={handleConnectWallet}>Wallet</Button>
            </Flex>
        </Stack>
    </Flex>
  );
}

export default App;
