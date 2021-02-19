# Binance Smart Faucet Bot for Discord



Discord Faucets attracted by the opportunity to receive your first cryptocurrency for free. This example uses binance testnet chain to do it !! 
This bot merge several source code provided by [1,2,3,4] using NodeJS, TypeScript and Web3. 

# Video: 

https://youtu.be/kMpV3zEuy64

[![Watch the video](https://i.imgur.com/YdEOd4H.png)](https://youtu.be/kMpV3zEuy64)


# Build
```
npm compile
```
# Run 

```
npm start
```
# Dependencies

# Configuration for custom settings 

```typescript=
const TOKEN_DECIMAL = 18n;
const FAUCET_SEND_INTERVAL = 1; 
const EMBED_COLOR_CORRECT = 0xf0B90B;
const EMBED_COLOR_ERROR = 0x12161c;
const CONSTANT = 10;
const FAUCET_SEND_MSG = "!faucet send";
const FAUCET_BALANCE_MSG = "!balance";
const ADDRESS_LENGTH = 40;
const GAS_PRICE = "0x9184e72a000";
const GAS = "0x76c0";
const TOKEN_NAME = "BNB";
const ADDRESS_PREFIX = "0x"
```
# Snapshots

!faucet send 0x.. {your address}
![](https://i.imgur.com/MGJA4FF.png)


!balance 
![](https://i.imgur.com/tUc0I5m.png)

timeout bot 

![](https://i.imgur.com/ymL38Pr.png)

# Dependencies 

```json=
  "discord.js": "^12.5.1",
    "dotenv": "^8.2.0",
    "http": "0.0.1-security",
    "https": "^1.0.0",
    "typescript": "^4.1.3",
    "web3": "^1.3.0"
```
.env configuration: 

```javascript=
DISCORD_CHANNEL =  your settings
TESTS_DISCORD_CHANNEL= your settings


RPC_URL=  https://data-seed-prebsc-2-s2.binance.org:8545/
ACCOUNT_ID = your account id
ACCOUNT_KEY=  your account key 

TOKEN_COUNT =  1
FAUCET_SEND_INTERVAL = 1
BALANCE_ALERT_THRESHOLD = 100

```



**Verify Bot actions on Binance Testnet: **

https://testnet.bscscan.com/
![](https://i.imgur.com/hafSrIp.png)


https://github.com/aadorian/BinanceBot.git


# References : 

[1] https://discord.com/developers/docs/intro
[2]https://docs.binance.org/guides/testnet.html
[3]https://github.com/w3f/polkadot
[4]https://github.com/PureStake/moonbeam
