// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import 'contracts/StoreNFT.sol';

contract Store{
    address public owner;
    address public nftAddress;
    uint public amount;
    receive() external payable{}
    fallback() external payable{}

    constructor(address _nftAddress){
        owner = msg.sender;
        nftAddress = _nftAddress;
    }

    modifier onlyOwner(){
        require(owner == msg.sender, "Only owner is allowed");
        _;
    }

    struct ItemSchema {
        string name;
        bool soldOut;
        string imageUrl;
        string deskripsi;
        uint qty;
        uint price;
    }

    struct LedgerSchema {
        address user;
        string name;
        uint price;
        string imageUrl;
        string deskripsi;
        bool status;
        uint chainID;
    }

    ItemSchema[] public item;

    LedgerSchema[] public history;

    LedgerSchema[] public realHistory;

    function createItem(string memory _name, string memory _imageUrl, string memory _deskripsi, uint _price, uint _qty) 
        onlyOwner
        public returns(string memory){
        
        ItemSchema memory temp_struct;
        
        temp_struct.name = _name;
        temp_struct.price = _price * 10**15;
        temp_struct.soldOut = false;
        temp_struct.imageUrl = _imageUrl;
        temp_struct.qty = _qty;
        temp_struct.deskripsi = _deskripsi;
        
        item.push(temp_struct);
        
        return "Barang baru berhasil disimpan";
    }

    function getItemLength() public view returns(uint){
        return item.length;
    }

    function getHistoryLength() public view returns(uint){
        return history.length;
    }

    function getRealHistoryLength() public view returns(uint){
        return realHistory.length;
    }

    function approveItem(uint _index) onlyOwner public {
        history[_index].status = true;
        realHistory[_index].status = true;

        for (uint i = _index; i < history.length - 1; i++) {
            history[i] = history[i + 1];
        }
        
        delete history[history.length - 1];
        
        history.pop();
    }

    function buyStore(uint _index, string memory _metadataURL) payable public returns(string memory message, uint256){
        StoreNFT storeNFT = StoreNFT(nftAddress);
        uint nft;

        if(item[_index].qty == 0){
            message = "Maaf barang yang anda pesan telah habis";
        }
        else if((msg.sender).balance < item[_index].price){
            message = "Maaf saldo anda tidak mencukupi";
        }
        else if((msg.value) < item[_index].price){
            message = "Maaf value yang anda berikan tidak memenuhi";
        }
        else{
            nft = storeNFT.mintNFT(msg.sender, _metadataURL);
            payable (address(this)).transfer(msg.value);  
            
            item[_index].qty -= 1;

            LedgerSchema memory temp_struct;

            temp_struct.user = msg.sender;
            temp_struct.name = item[_index].name;
            temp_struct.price = item[_index].price;
            temp_struct.imageUrl = item[_index].imageUrl;
            temp_struct.deskripsi = item[_index].deskripsi;
            temp_struct.status = false;
            temp_struct.chainID = nft;

            history.push(temp_struct);

            realHistory.push(temp_struct);

            message = "Pembayaran Berhasil";
        }
        return (message, nft);
    }
}

