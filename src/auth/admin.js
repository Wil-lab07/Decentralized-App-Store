import ConnectButton from '../components/ConnectButton';
import { useEthers, useEtherBalance } from "@usedapp/core";
import {Flex, Button, Heading, Stack, Text} from "@chakra-ui/react";
import Approve from '../views/Approve';

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
        </Flex>
        <Approve/>
    </Flex>
  )
}
