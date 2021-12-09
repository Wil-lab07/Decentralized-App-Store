import { Button, Box, Text } from "@chakra-ui/react";
import { useEthers, useEtherBalance } from "@usedapp/core";
import {formatEther} from '@ethersproject/units'

export default function ConnectButton(){
    const {activateBrowserWallet, account } = useEthers();
    const etherBalance = useEtherBalance(account);

    return account ?(
        <Box>
            <Text color="white" fontSize="md">
                {etherBalance && parseFloat(formatEther(etherBalance)).toFixed(3)} ETH
            </Text>
        </Box>
    ) : (
        <Button>Connect to a wallet</Button>
    );
}