# Retail Supply Chain System Handbook

## 1. Install the Blockchain Environment
   
Install the private blockchain Ganache and start it, then import the truffle configuration file truffle-config.js into the Ganache and restart Ganache:

![image](https://github.com/sharriewang2022/IT902---RSCF-system/assets/132410296/316b467b-c272-4905-9d6b-c3eb123544a6)


In Visual Studio Code, open the Truffle project “TRUFFLRSCF”. To deploy all the smart contracts to Ganache, in the terminal, run the command: truffle migrate --reset:
![image](https://github.com/sharriewang2022/IT902---RSCF-system/assets/132410296/68639d37-13e9-42d2-aabf-f09cc7738ec8)

Install MetaMask, create a new account to log in, and open it in the browser:
![image](https://github.com/sharriewang2022/IT902---RSCF-system/assets/132410296/b661e362-3822-495f-930e-95ba3461a991)

 
## 2. Install the Back-end Environment
   
Install MySQL Server 8.1.0:
![image](https://github.com/sharriewang2022/IT902---RSCF-system/assets/132410296/315bee55-5e4b-45ed-a5c3-2de2270a79cc)

 
In another Visual Studio Code, open the Flask project “FlaskEndRSCF”.
In the MySQL database, execute all the scripts in the folder: FlaskEndRSCF\db.
In the Flask project “FlaskEndRSCF”, configure the MySQL database in setting.py:
![image](https://github.com/sharriewang2022/IT902---RSCF-system/assets/132410296/d9e3d905-8253-4fdf-972a-5857706b5c7f)

Install IPFS, open the folder of IPFS, start IPFS by executing the command: ipfs daemon. Then the IPFS daemon is up and running on the machine, and the default server site is at http://localhost:5001/.
![image](https://github.com/sharriewang2022/IT902---RSCF-system/assets/132410296/7416212a-f5a1-455a-962e-6b48be75f167)

 
Configure the IPFS information in setting.py of the Flask project “FlaskEndRSCF”:
![image](https://github.com/sharriewang2022/IT902---RSCF-system/assets/132410296/9963892f-32cb-4f6a-807b-294c7d0f3955)

 
Get the address of the smart contract IPFSHashRSCF in Ganache:
![image](https://github.com/sharriewang2022/IT902---RSCF-system/assets/132410296/1c4b9925-eb7d-4025-918f-12055a638d2a)

 
Configure the address of the smart contract IPFSHashRSCF in setting.py of the Flask project “FlaskEndRSCF”:
![image](https://github.com/sharriewang2022/IT902---RSCF-system/assets/132410296/8a216c49-66d4-49d4-8746-f29d4c27a2a9)

 
To start the back-end server, in the terminal, run the command: flask run: 
![image](https://github.com/sharriewang2022/IT902---RSCF-system/assets/132410296/39e36441-7620-4848-82ed-b3a343b34708)


## 3. Install the Front-end Environment
Get the address of the smart contract “SupplyChainRSCF” in Ganache:
![image](https://github.com/sharriewang2022/IT902---RSCF-system/assets/132410296/58e29a5c-1308-447c-b3f4-86e9c377fc0a)

In another Visual Studio Code, open the front-end project “frontendrscf”. In the file “.env.development”, set the address of the smart contract “SupplyChainRSCF” to REACT_APP_SMART_CONTRACT_ADDRESS:
![image](https://github.com/sharriewang2022/IT902---RSCF-system/assets/132410296/0735d2fe-cc8f-4e11-bdd1-aee1ff6e348c)

 
Set the back-end server URL to REACT_APP_SERVER_BASE_URL:
![image](https://github.com/sharriewang2022/IT902---RSCF-system/assets/132410296/00a4be27-14ce-48a9-9fe2-56ad6c6edf14)
 
Set IPFS server details to REACT_APP_IPFS_HOST and REACT_APP_IPFS_PORT: 
![image](https://github.com/sharriewang2022/IT902---RSCF-system/assets/132410296/8f57c34d-3cd9-4345-8806-52111c85b25e)
 
To start the front-end project, in the terminal, run the command: npm start:
![image](https://github.com/sharriewang2022/IT902---RSCF-system/assets/132410296/14fb7499-ac8e-42ea-8acd-48bb5ff29c9a)
 
In the browser, the web application is opened automatically:
![image](https://github.com/sharriewang2022/IT902---RSCF-system/assets/132410296/0f57b92a-2d27-49fd-a975-2d8ce333a21f)
 
Get the private key to the first account of Ganache:
![image](https://github.com/sharriewang2022/IT902---RSCF-system/assets/132410296/2fbb677b-5aa4-4617-b024-8e7531b5475c)

Import this private key to MetaMask to create a new account in MetaMask and connect to this new account:
![image](https://github.com/sharriewang2022/IT902---RSCF-system/assets/132410296/d5c2eca4-6917-4a59-9f8c-28c2ae2e58f3)


## 4. System Operation Instruction
Log in to the system by default with the user name “sa” and password “12345678”, select the role “Administrator”. After entering the system, users could operate the relative modules according to their roles. The administrator can operate all the functions:
![image](https://github.com/sharriewang2022/IT902---RSCF-system/assets/132410296/59f733d0-28ea-414e-acaa-2b75189d0f8c)

### 4.1 Administration Management Module
The category management module can add users:
![image](https://github.com/sharriewang2022/IT902---RSCF-system/assets/132410296/4d967005-df5a-4ceb-a69b-4af639f6bba9)

Customers can search for user information by the Web page:
![image](https://github.com/sharriewang2022/IT902---RSCF-system/assets/132410296/cc2e1c98-cce3-4451-a51f-a4f6fe256cdf)
 
### 4.2 Category Management Module
The category management module can add categories according to similar features of products:
![image](https://github.com/sharriewang2022/IT902---RSCF-system/assets/132410296/ab1ace0a-4d03-495f-a042-72e8872d1d11)

Users can search for category information by clicking the button “Category List” :
![image](https://github.com/sharriewang2022/IT902---RSCF-system/assets/132410296/41c7c1a6-f5d3-4412-a604-f6b1a86982a4)
 
### 4.3 Product Management Module 
System users can have permission to add product details according to their roles. The product base information is stored in the blockchain network through the smart contract to track the product information in the system.
![image](https://github.com/sharriewang2022/IT902---RSCF-system/assets/132410296/e44b75e7-3df1-43a2-988e-f51211e568a6)
 
Users can search for product information by clicking the button “Product List” : 
![image](https://github.com/sharriewang2022/IT902---RSCF-system/assets/132410296/d925de62-2ca0-4ffd-bad6-e23fb3723ca7)

### 4.4 Order Management Module 
All the users could create an order in this module:
![image](https://github.com/sharriewang2022/IT902---RSCF-system/assets/132410296/c5e4edcb-a4e7-4a4a-8123-423396ed2800)

Users can search for the order information after adding it:
![image](https://github.com/sharriewang2022/IT902---RSCF-system/assets/132410296/4053abcd-040e-4144-98fd-f8143c9dba37)

### 4.5 Document Management Module
In the document management module, financial files could be uploaded to the system:
![image](https://github.com/sharriewang2022/IT902---RSCF-system/assets/132410296/b3111544-7187-46e7-86cb-febf801de939)

To determine whether the file has been altered, customers can compare the hash codes stored in the MySQL database and on the blockchain on the following page:
![image](https://github.com/sharriewang2022/IT902---RSCF-system/assets/132410296/ac132cab-65fc-4236-8eab-1e00aee17f9d)
 
### 4.6 Trace Management Module
Once the consumer has entered the product's unique serial number, they can obtain detailed information about it on the blockchain:
![image](https://github.com/sharriewang2022/IT902---RSCF-system/assets/132410296/2ef41035-05c1-4a45-8f99-a9ea21eb955c)

Customers can access relevant information about their product orders on the blockchain by clicking the button “related orders”:
![image](https://github.com/sharriewang2022/IT902---RSCF-system/assets/132410296/33ede883-80d5-4083-9da6-5773e63ee027)

The Trace Management Module also includes the Chatbot feature, which allows customers to track products and report any issues about the product:

![image](https://github.com/sharriewang2022/IT902---RSCF-system/assets/132410296/785b95d0-88e2-426d-a779-48abe065ed37)

