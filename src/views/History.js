import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";

import { utils } from 'ethers';
import {useContractFunction, useContractCall, useContractCalls} from '@usedapp/core'
import { Contract } from "@ethersproject/contracts";
import Store from '../artifacts/contracts/Store.sol/Store.json'
import { useEthers, useEtherBalance } from "@usedapp/core";

import {
    Flex,
    Heading,
    Button,
    Text,
    Switch,
    Spacer,
    Box
  } from "@chakra-ui/react";

export default function History(){
    const {activateBrowserWallet, account } = useEthers();
    const StoreABI = new utils.Interface(Store.abi)
    const StoreAddress = process.env.REACT_APP_STORE_CONTRACT
    const contract = new Contract(StoreAddress, StoreABI)

    const [transactionCall, setTransactionCall] = useState([]);

    const transactionLength = useContractCall({
        abi: StoreABI,
        address: StoreAddress,
        method: "getRealHistoryLength",
        args: [],
    }) ?? [];
    
    useEffect(()=>{
        const temp_array = []
        if(transactionLength.length !== 0 || transactionLength[0] !== undefined){
            for(let i = 0; i < parseInt(transactionLength[0]._hex); i++){
            temp_array.push({
                abi: StoreABI,
                address: StoreAddress,
                method: "realHistory",
                args: [i]
            })
            }
            setTransactionCall(temp_array)
        }
    }, [transactionLength])

    const transaction = useContractCalls(transactionCall) ?? []

    const data = []

    const columns = [
        "Item", "Price", "ChainID", "Is Arrived"
    ]

    if(transaction[0] !== undefined){
        let status;
        transaction.map((t, index)=>{
            if(t.status === false){
                status = 'On the Way'
            }
            else{
                status = 'Arrived'
            }

            if(t.user === account){
                data.push([
                    t.name, 
                    `${parseInt(t.price._hex) / 10**18} ETH`, 
                    parseInt(t.chainID._hex), 
                    status
                ])
            }        
        })
    }
    
    return (
        <Flex py={2} px={16} flexDirection="column">
            <Heading my={4}>Transaction List</Heading>
            <Box my={6} w="100%">
            <MUIDataTable
                title={"Transaction List"}
                data={data}
                columns={columns}
                options={{
                selectableRows: "none",
                rowsPerPage: 15,
                rowsPerPageOptions: [10, 15, 20],
                elevation: 0,
                }}
            />
            </Box>
        </Flex>
    );
}

