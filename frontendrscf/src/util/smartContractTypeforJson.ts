export type supplyChainAbiType = readonly [{
  "anonymous": false,
  "inputs": [
    {
      "indexed": false,
      "internalType": "string",
      "name": "info",
      "type": "string"
    }
  ],
  "name": "Info",
  "type": "event"
},
{
  "anonymous": false,
  "inputs": [
    {
      "indexed": false,
      "internalType": "string",
      "name": "productId",
      "type": "string"
    },
    {
      "indexed": false,
      "internalType": "address",
      "name": "owner",
      "type": "address"
    },
    {
      "indexed": false,
      "internalType": "string",
      "name": "productName",
      "type": "string"
    },
    {
      "indexed": false,
      "internalType": "string",
      "name": "manufacturer",
      "type": "string"
    },
    {
      "indexed": false,
      "internalType": "string",
      "name": "supplier",
      "type": "string"
    },
    {
      "indexed": false,
      "internalType": "string",
      "name": "currentLocation",
      "type": "string"
    },
    {
      "indexed": false,
      "internalType": "uint256",
      "name": "date",
      "type": "uint256"
    }
  ],
  "name": "ProductAdded",
  "type": "event"
},
{
  "anonymous": false,
  "inputs": [
    {
      "indexed": false,
      "internalType": "string",
      "name": "productId",
      "type": "string"
    },
    {
      "indexed": false,
      "internalType": "string",
      "name": "currentLocation",
      "type": "string"
    }
  ],
  "name": "locationChanged",
  "type": "event"
},
{
  "inputs": [
    {
      "internalType": "string",
      "name": "",
      "type": "string"
    }
  ],
  "name": "ProductMap",
  "outputs": [
    {
      "internalType": "string",
      "name": "productId",
      "type": "string"
    },
    {
      "internalType": "address",
      "name": "owner",
      "type": "address"
    },
    {
      "internalType": "string",
      "name": "productName",
      "type": "string"
    },
    {
      "internalType": "string",
      "name": "manufacturer",
      "type": "string"
    },
    {
      "internalType": "string",
      "name": "supplier",
      "type": "string"
    },
    {
      "internalType": "string",
      "name": "currentLocation",
      "type": "string"
    },
    {
      "internalType": "uint256",
      "name": "date",
      "type": "uint256"
    }
  ],
  "stateMutability": "view",
  "type": "function"
},
{
  "inputs": [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ],
  "name": "Products",
  "outputs": [
    {
      "internalType": "string",
      "name": "productId",
      "type": "string"
    },
    {
      "internalType": "address",
      "name": "owner",
      "type": "address"
    },
    {
      "internalType": "string",
      "name": "productName",
      "type": "string"
    },
    {
      "internalType": "string",
      "name": "manufacturer",
      "type": "string"
    },
    {
      "internalType": "string",
      "name": "supplier",
      "type": "string"
    },
    {
      "internalType": "string",
      "name": "currentLocation",
      "type": "string"
    },
    {
      "internalType": "uint256",
      "name": "date",
      "type": "uint256"
    }
  ],
  "stateMutability": "view",
  "type": "function"
},
{
  "inputs": [
    {
      "internalType": "string",
      "name": "",
      "type": "string"
    }
  ],
  "name": "productAdded",
  "outputs": [
    {
      "internalType": "bool",
      "name": "",
      "type": "bool"
    }
  ],
  "stateMutability": "view",
  "type": "function"
},
{
  "inputs": [],
  "name": "productCount",
  "outputs": [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ],
  "stateMutability": "view",
  "type": "function"
},
{
  "inputs": [],
  "name": "productOutput",
  "outputs": [
    {
      "internalType": "string",
      "name": "",
      "type": "string"
    }
  ],
  "stateMutability": "view",
  "type": "function"
},
{
  "inputs": [
    {
      "internalType": "uint256",
      "name": "_a",
      "type": "uint256"
    }
  ],
  "name": "settest1",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "inputs": [],
  "name": "gettest1",
  "outputs": [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ],
  "stateMutability": "view",
  "type": "function"
},
{
  "inputs": [],
  "name": "proOutput",
  "outputs": [
    {
      "internalType": "string",
      "name": "",
      "type": "string"
    }
  ],
  "stateMutability": "view",
  "type": "function"
},
{
  "inputs": [
    {
      "internalType": "string",
      "name": "_productId",
      "type": "string"
    },
    {
      "internalType": "string",
      "name": "_productName",
      "type": "string"
    },
    {
      "internalType": "string",
      "name": "_manufacturer",
      "type": "string"
    },
    {
      "internalType": "string",
      "name": "_supplier",
      "type": "string"
    },
    {
      "internalType": "string",
      "name": "_currentLocation",
      "type": "string"
    }
  ],
  "name": "addProduct",
  "outputs": [
    {
      "internalType": "bool",
      "name": "",
      "type": "bool"
    }
  ],
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "inputs": [],
  "name": "getProducts",
  "outputs": [
    {
      "components": [
        {
          "internalType": "string",
          "name": "productId",
          "type": "string"
        },
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "productName",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "manufacturer",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "supplier",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "currentLocation",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "date",
          "type": "uint256"
        }
      ],
      "internalType": "struct SupplyChainRSCF.Product[]",
      "name": "",
      "type": "tuple[]"
    }
  ],
  "stateMutability": "view",
  "type": "function"
},
{
  "inputs": [
    {
      "internalType": "string",
      "name": "_location",
      "type": "string"
    },
    {
      "internalType": "string",
      "name": "_productId",
      "type": "string"
    },
    {
      "internalType": "address",
      "name": "_new_owner",
      "type": "address"
    }
  ],
  "name": "changeLocation",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "inputs": [
    {
      "internalType": "string",
      "name": "_productId",
      "type": "string"
    }
  ],
  "name": "fetchProductInfo",
  "outputs": [
    {
      "internalType": "string",
      "name": "",
      "type": "string"
    }
  ],
  "stateMutability": "view",
  "type": "function"
},
{
  "inputs": [
    {
      "internalType": "string",
      "name": "_producId",
      "type": "string"
    }
  ],
  "name": "fetchAddress",
  "outputs": [
    {
      "internalType": "address",
      "name": "",
      "type": "address"
    }
  ],
  "stateMutability": "view",
  "type": "function"
},
{
  "inputs": [
    {
      "internalType": "string",
      "name": "_producId",
      "type": "string"
    }
  ],
  "name": "fetchAllLocation",
  "outputs": [
    {
      "internalType": "string[15]",
      "name": "",
      "type": "string[15]"
    }
  ],
  "stateMutability": "view",
  "type": "function"
},
{
  "inputs": [
    {
      "internalType": "string",
      "name": "s1",
      "type": "string"
    },
    {
      "internalType": "string",
      "name": "s2",
      "type": "string"
    }
  ],
  "name": "compareStringValue",
  "outputs": [
    {
      "internalType": "bool",
      "name": "",
      "type": "bool"
    }
  ],
  "stateMutability": "pure",
  "type": "function"
}
];