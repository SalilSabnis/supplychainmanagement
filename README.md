# SupplyChainManagement Decentralized Appliction using Ethereum Blockchain

## Table of Contents
1. [Application Overview](#application-overview)
2. [Problem Solved](#problem-solved)
3. [Assumptions](#assumptions)
4. [Prerequisites for Running the application](#prerequisites-for-running-the-application)
5. [Running the application on local](#running-the-application-on-local)
6. [Rules Designed for the application in Smart Contract](#rules-designed-for-the-application-in-smart-contract)

## Application Overview
1. A simple application which helps vendors to reserve items from an available list.
2. The application is built on the Ethereum Blockchain


## Problem Solved
1. The applicaation helps vendors to reserve certain items.
2. In Supply chain sometimes it becomes difficult to maintain which vendor is ordering what, but with the Blockchain we can maintain all of that easily and also have smart contracts in place which we help us define any rules

## Assumptions
1. Since Ganache gives us 10 addresses to play around with, here it is assumed that these 10 address are the vendors who want to reserve certain items.
2. For now we are assuming that we only have 3 items and each item has only 10 units available initially.
3. We are not calculating total prices of items purchased etc

## Prerequisites for Running the application
- Softwares needed
  - Install Node.js and NPM on your local machine
  - Install truffle
  - Install Ganache
  - Install and configure Metamask

## Running the application on local
- Clone the project on your local machine
- Run the command "truffle migrate"
  -  This will migrate all of the smart contracts that we have in our application to the local Ethereum blockchain
- Run the command "npm run dev"
  -  This will runs the src/app of the application where in we have the basic HTML and all js files.
  -  It will open up a browser window where in we need to connect the Ethereum addresses using Metamask
  -  Once done, to open the Supply chain management UI go to http://localhost:<port>/supply_chain.html
  -  This will open up the Supply chain UI through which we can reserve items
  
## Rules Designed for the application in Smart Contract
  - We can specify whatever business logic or rules we want our application to adhere to in our Smart contract.
  - Rules for the Supply Chain management application:
    - Each vendor (address) can reserve only 2 items at max
    - Before reserving, check if the quantity in stock is greater than 0. Basically items should be availble to reserve
    - The items should be present, meaning you cannot book item no. 4 if only 3 items are present
  
  

