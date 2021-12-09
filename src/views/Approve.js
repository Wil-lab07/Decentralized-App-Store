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

export default function Approve(){
  const {activateBrowserWallet, account } = useEthers();
  const StoreABI = new utils.Interface(Store.abi)
  const StoreAddress = process.env.REACT_APP_STORE_CONTRACT
  const contract = new Contract(StoreAddress, StoreABI)

  const { state, send } = useContractFunction(contract, 'approveItem', { transactionName: 'approveItem'})



  const [transactionCall, setTransactionCall] = useState([]);

  const transactionLength = useContractCall({
    abi: StoreABI,
    address: StoreAddress,
    method: "getHistoryLength",
    args: [],
  }) ?? [];

  useEffect(()=>{
    const temp_array = []
    if(transactionLength.length !== 0 || transactionLength[0] !== undefined){
        for(let i = 0; i < parseInt(transactionLength[0]._hex); i++){
        temp_array.push({
            abi: StoreABI,
            address: StoreAddress,
            method: "history",
            args: [i]
        })
      }
      setTransactionCall(temp_array)
    }
  }, [transactionLength])

  const transaction = useContractCalls(transactionCall) ?? []

  const data = []

  // const data = [
  //   ["0", "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4", "Headphone", `${0.08} eth`],
  //   ["1", "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4", "Headphone", `${0.08} eth`],
  //   ["2", "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4", "Headphone", `${0.08} eth`],
  //   ["3", "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4", "Headphone", `${0.08} eth`],
  // ]

  const approveThis = async (index)=>{
    send(index)
  }

  const columns = [
    {
        name: "Index",
        label: "Index",
        options: {
          display: false
        }
    }
    ,"Address", "Item", "Price",
    {
        name: "Is Arrived",
        label: "Is Arrived",
        options: {
          customBodyRender: (value, tableMeta) => (
            <Flex flexDirection="row">
              <Button colorScheme="teal" size="sm" onClick={() => approveThis(tableMeta.rowData[0])} mr={4}>Confirm</Button>
            </Flex>
          )
        }
    }
  ]

  if(transaction[0] !== undefined){
    transaction.map((t, index)=>{
      data.push([
        index,
        t.user, 
        t.name, 
        `${parseInt(t.price._hex) / 10**18} ETH`,
      ])
    })
  }
  
  return (
    <Flex py={2} px={16} flexDirection="column">
        <Heading my={4}>Unconfirmed Transaction List</Heading>
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
