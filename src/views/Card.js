import React, { useState, useEffect } from "react";
import {
    Image,
    Box,
    Center,
    Text,
    Stack,
    Flex,
    Button,
    Heading
} from '@chakra-ui/react';
import { utils } from 'ethers';
import {useContractFunction, useContractCall, useContractCalls} from '@usedapp/core'
import { Contract } from "@ethersproject/contracts";
import Store from '../artifacts/contracts/Store.sol/Store.json'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function Card(){
  const StoreABI = new utils.Interface(Store.abi) 
  const StoreAddress = process.env.REACT_APP_STORE_CONTRACT 
  const contract = new Contract(StoreAddress, StoreABI) 

  const { state, send } = useContractFunction(contract, 'buyStore', { transactionName: 'buyStore'})

  const nftList = [
    "https://gateway.pinata.cloud/ipfs/QmWR5UrZPrwUeQztfVGKpAuSzsYw7hdamTQ2dHFZPANpDW",
    "https://gateway.pinata.cloud/ipfs/QmZrQFnfyADVvDcfpEKsHDi8Es3z5Ptn26TDbuE8Gq4iTc",
    "https://gateway.pinata.cloud/ipfs/QmTESjBK3CH2UhC8BGChdhE8gGvVK1KSCJbcWuDUYLtBzW",
    "https://gateway.pinata.cloud/ipfs/QmRXSNp7yCMSz8DncSmzoaSFLzhtVgdB8dfUWHyv5Ud4eG",
    "https://gateway.pinata.cloud/ipfs/QmUJK1NusXwvPKV4nsR4PwUy8U1UMA3uthvQp7YjHdNs3A"
  ]

  const [itemCall, setItemCall] = useState([]);

  const itemLength = useContractCall({
    abi: StoreABI,
    address: StoreAddress,
    method: "getItemLength",
    args: [],
  }) ?? [];

  useEffect(()=>{
    const temp_array = []
    if(itemLength.length !== 0 || itemLength[0] !== undefined){
      for(let i = 0; i < parseInt(itemLength[0]._hex); i++){
        temp_array.push({
          abi: StoreABI,
          address: StoreAddress,
          method: "item",
          args: [i]
        })
      }
      setItemCall(temp_array)
    }
  }, [itemLength])

  const item = useContractCalls(itemCall) ?? []

  const data = []

  if(item[0] !== undefined){
    item.map((i, index) => {
      data.push({
        name: i.name,
        soldOut: i.soldOut,
        imageUrl: i.imageUrl,
        qty: parseInt(i.qty._hex),
        price: parseInt(i.price._hex) / 10**18
      })
    })
  }

  const buyItem = async (index, price)=>{
    const nftIndex = Math.floor(Math.random() * (4 - 0 + 1) + 0)
    
    await send(index, nftList[nftIndex], {value: utils.parseEther(price.toString())});

    toast.success("ID untuk Redeem NFT bisa dilihat di Menu History")
  }

  return data.length !== 0 ?(  
      <Flex py={2} px={16} flexDirection='column'>
        <Heading my={4}>Let's Buy Something</Heading>
        <Flex py={6} justifyContent='space-around' alignItems='center' width='100%'>
          {data.map((d, index)=>(
            <Box
              pb={3}
              bg={('white', 'gray.900')}
              boxShadow={'2xl'}
              rounded={'md'}
              overflow={'auto'}>
                <Box>
                  <Image 
                    width='30vh'
                    objectFit='cover' 
                    src = {d.imageUrl}
                    layout={'fill'}>
                  </Image>
                </Box>
                <Stack>
                    <Center>
                      <Text
                        color={'green.400'}
                        textTransform={'uppercase'}
                        fontWeight={600}
                        fontSize={'15px'}
                        letterSpacing={1.1}>
                        {d.name}
                      </Text>
                    </Center>
                    <Center>
                      <Center>
                        <Text
                          color={'gray.400'}
                          fontWeight={400}
                          fontSize={'15px'}
                          letterSpacing={1.1}>
                          {d.price}
                        </Text>
                        <Image
                          boxSize='35px'
                          src={'https://www.logo.wine/a/logo/Ethereum/Ethereum-Icon-Purple-Logo.wine.svg'}>
                        </Image>
                      </Center>
                      <Center>
                        <Text
                          color={'gray.400'}
                          fontWeight={400}
                          fontSize={'15px'}
                          letterSpacing={1.1}>
                          Qty: {d.qty}
                        </Text>
                      </Center>
                    </Center>
                    <Center>
                      <Button
                        isDisabled = {d.qty === 0 ? true : false} 
                        onClick={()=>{buyItem(index, d.price)}}
                        bg={'green.400'}
                        color={'white'}
                        rounded={'xl'}
                        boxShadow={'0 5px 20px 0px rgb(72 187 120 / 43%)'}
                        _hover={{
                          bg: 'green.500',
                        }}
                        _focus={{
                          bg: 'green.500',
                        }}>
                        {d.qty === 0 ? "Sold Out" : "Buy"}
                      </Button>
                    </Center>
                </Stack>
            </Box>
          ))}
        </Flex>
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </Flex>
    ): (
      <Flex height="80vh" justifyContent='center' alignItems='center'>
        <Heading>Loading...</Heading>
      </Flex>
    );
}
