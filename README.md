# Bank of SUI

A groundbreaking digital banking application that streamlines crypto adoption through effortless onboarding and gasless transactions.

## The Problem We Solve

Traditional crypto applications present substantial entry barriers:

* Complex wallet creation and management
* Requirement to purchase gas tokens
* Technical knowledge prerequisites
* Poor user experience

## Our Solution

Bank of SUI revolutionizes crypto adoption by:

* Leveraging zkLogin for seamless Google authentication
* Implementing gasless transactions powered by Enoki
* Offering a familiar banking interface
* Eliminating the need for wallet management

## Key Features

* 🔐 One-click Google login (powered by zkLogin)
* 💸 Gasless USDC transfers (powered by Enoki)
* 💳 Virtual card management
* 📊 Real-time balance tracking
* 👥 Contact management
* 📱 Cross-platform support (iOS, Android, Web)

## Tech Stack

* React Native with Expo
* Expo Router for navigation
* Sui blockchain integration
* zkLogin for authentication
* Enoki for sponsored transactions
* TypeScript for type safety

## Getting Started

### Prerequisites

* Node.js 18 or higher
* npm or yarn
* Expo CLI

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/mxber2022/bank-of-sui.git
   cd bank-of-sui
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:

   ```plaintext
   EXPO_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
   EXPO_PUBLIC_ENOKI_API_KEY=your_enoki_api_key
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

## Project Structure

```
bank-of-sui/
├── app/                   # Application routes
│   ├── (auth)/           # Authentication routes
│   ├── (tabs)/           # Main tab navigation
│   └── _layout.tsx       # Root layout
├── components/           # Reusable components
├── constants/            # App constants
├── data/                # Mock data
├── hooks/               # Custom hooks
├── types/               # TypeScript types
└── utils/               # Utility functions
```

## Features in Detail

**Simplified Authentication**

* One-click Google sign-in
* Automatic wallet creation via zkLogin
* No seed phrases or private keys to manage
* Secure session management

**Gasless Transactions**

* Send and receive USDC without gas fees
* Transactions sponsored through Enoki
* Real-time balance updates
* Transaction history tracking

**Virtual Card**

* Digital card management
* Secure card details storage
* Copy-to-clipboard functionality
* Dynamic card number visibility

**Contact Management**

* Easy contact addition
* Favorite contacts for quick access
* QR code scanning for addresses
* Contact transaction history

## Technical Implementation

**zkLogin Integration**

* Seamless authentication flow
* Secure wallet generation
* Session management
* Google OAuth integration

**Enoki Implementation**

* Transaction sponsorship
* Gas fee abstraction
* Secure API integration
* Transaction validation

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

* Sui Blockchain for the underlying blockchain infrastructure
* zkLogin for simplified authentication
* Enoki for transaction sponsorship
* Expo for the development framework
