##☁️ SkyFund

A decentralized crowdfunding platform that connects campaign creators with supporters through blockchain-based funding.

SkyFund is a Web3 crowdfunding application built with React, Vite, Tailwind CSS, Firebase, IPFS/Pinata, and Thirdweb. Users can create fundraising campaigns, publish campaign information to the blockchain, discover campaigns, donate using ETH, and manage their profile and campaign activity.

The project combines traditional web authentication and profile management with decentralized campaign and donation transactions.

#Live Website : https://skyfund-dev.vercel.app/
✨ Features

🔐 Authentication

Email/password registration and login

Google authentication through Firebase

Protected application routes

Persistent authentication state

Automatic redirect for unauthenticated users

🚀 Campaign Creation

Create a crowdfunding campaign with:

Campaign creator name

Title

Description

Category

Funding goal

Deadline

Campaign image

Campaign images are uploaded to IPFS through Pinata

Campaign data is published through a smart contract on Ethereum Sepolia

💰 Web3 Donations

Connect a MetaMask wallet

Donate ETH directly to campaigns

Read campaign funding information from the blockchain

Track total amount raised

Track campaign contributors

Display individual donor wallet addresses

📊 Campaign Discovery

Browse all available campaigns

View campaign progress

View campaign deadlines

View campaign categories and descriptions

Open detailed campaign pages

Filter out internal/test campaigns from the public campaign feed

👤 User Profile

View account information

Display connected wallet address

Upload a custom profile image

Select from predefined avatars

Change display name

View campaigns created by the user

View campaigns the user has donated to

🌓 UI / UX

Responsive design with Tailwind CSS

Light and dark mode

Animated landing page using Framer Motion

Responsive sidebar and navigation

Campaign progress indicators

Loading and empty states

Mobile-friendly layouts

🏗️ Architecture

SkyFund uses a hybrid architecture where different responsibilities are handled by different services:

                         ┌─────────────────────┐
                         │      SkyFund UI     │
                         │ React + Vite        │
                         │ Tailwind + Motion   │
                         └──────────┬──────────┘
                                    │
                ┌───────────────────┼───────────────────┐
                │                   │                   │
                ▼                   ▼                   ▼
       ┌────────────────┐  ┌─────────────────┐  ┌─────────────────┐
       │ Firebase Auth  │  │ Ethereum        │  │ IPFS / Pinata   │
       │                │  │ Sepolia         │  │                 │
       │ Login / Google │  │ Campaigns       │  │ Images / CIDs   │
       │ Authentication │  │ Donations       │  │ Decentralized  │
       └────────────────┘  └─────────────────┘  └─────────────────┘
                │                   │                   │
                ▼                   ▼                   ▼
       ┌────────────────┐  ┌─────────────────┐  ┌─────────────────┐
       │   Firestore    │  │ Smart Contract  │  │     IPFS        │
       │                │  │                 │  │                 │
       │ User profiles  │  │ Campaign data   │  │ Campaign media  │
       │ Profile data   │  │ Donations       │  │ Profile images  │
       └────────────────┘  └─────────────────┘  └─────────────────┘

Responsibility split

Layer

Technology

Purpose

Frontend

React + Vite

Application interface and routing

Styling

Tailwind CSS

Responsive UI and themes

Animation

Framer Motion

Landing-page and UI animations

Authentication

Firebase Auth

Email/password + Google login

User data

Firebase Firestore

Profiles and account metadata

Blockchain

Ethereum Sepolia

Campaigns and donations

Web3 SDK

Thirdweb

Wallet and smart-contract interaction

Media storage

IPFS + Pinata

Campaign/profile images

Wallet

MetaMask

User wallet connection

Routing

React Router

Public and protected routes

🔄 How SkyFund Works

1. User authentication

A user creates an account or signs in using Firebase.

User
  │
  ├── Email + Password ──► Firebase Auth
  │
  └── Google Login ──────► Firebase Auth
                              │
                              ▼
                         Authenticated User

2. Creating a campaign

Campaign Form
     │
     ├── Campaign image ──► Pinata ──► IPFS CID
     │
     └── Campaign details
              │
              ▼
       Thirdweb / Contract
              │
              ▼
      Ethereum Sepolia

The image is stored on IPFS while the campaign transaction stores the campaign information and the IPFS identifier.

3. Donating to a campaign

User
 │
 ├── Connect MetaMask
 │
 └── Enter ETH amount
          │
          ▼
   donateToCampaign()
          │
          ▼
 Ethereum Sepolia
          │
          ▼
 Campaign funding updated

4. Viewing campaign information

Campaign information is retrieved from the smart contract and normalized by the React state context before being displayed by campaign cards and detail pages.

🧰 Tech Stack

Frontend

React 18

Vite

JavaScript / JSX

React Router

Tailwind CSS

Framer Motion

Web3

Thirdweb React SDK

Thirdweb SDK

Ethereum Sepolia

MetaMask

Ethers.js

Backend / Cloud Services

Firebase Authentication

Firebase Firestore

Pinata

IPFS

🤝 Contributing

Contributions are welcome.

# Fork the repository

# Create a feature branch
git checkout -b feature/your-feature

# Make your changes

# Commit
git commit -m "feat: add your feature"

# Push
git push origin feature/your-feature

Then open a Pull Request with a clear description of the changes.

👨‍💻 Project

SkyFund is a Web3 crowdfunding project focused on exploring decentralized fundraising, blockchain transactions, IPFS-based media storage, and modern React application architecture.

Built with ❤️ using React, Firebase, Thirdweb, Ethereum Sepolia, IPFS, and Tailwind CSS.
