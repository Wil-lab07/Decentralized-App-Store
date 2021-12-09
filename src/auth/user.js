import {useState, useEffect, useCallback } from 'react'
import Menus from '../components/Menu';
import ConnectButton from '../components/ConnectButton';
import Card from '../views/Card';
import History from '../views/History';

import {Route, Routes} from 'react-router-dom'
import { useEthers, useEtherBalance } from "@usedapp/core";
import {Flex, Button, Heading, Stack, Text} from "@chakra-ui/react";
import {formatEther} from '@ethersproject/units'

export default function User() {
  const {activateBrowserWallet, account } = useEthers();
  const etherBalance = useEtherBalance(account);
  
  const handleConnectWallet = async ()=>{
    await activateBrowserWallet();
  }

  return(
    <Flex flexDirection='column'>
        <Flex justifyContent='space-between' alignItems='center'>
            <Flex bg='#2D3748' borderRadius='5px' px={6} py={1.5}>
                <ConnectButton/>
            </Flex>
            <Menus/>
        </Flex>
        <Routes>
            <Route path='/' element={<Card/>}></Route>
            <Route path='/transactions' element={<History/>}></Route>
        </Routes>
    </Flex>
  )
}
