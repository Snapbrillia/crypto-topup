# crypto-top-up

# Table of Contents

<!-- TOC -->
* [Introduction](#introduction)
* [Prerequisite](#prerequisite)
* [Dev Setup](#dev-setup)
* [React Use](#react-use)
* [Build](#build)

<!-- TOC -->

# Introduction
Crypto Top up help you intergrate crypto payment gateway into your website. Right now we only support cardano topup wallet. You could change this by yourself.

# Prerequisite
Before using this library you should register some services.

1. [Wallet Connect](https://docs.walletconnect.com/2.0/cloud/explorer)
2. [Change Now](https://changenow.io/affiliate)
3. You should contact Change Now to enable Fiat feature. Fiat ChangeNow API Key and Normal ChangeNow API Key aren't not the same.

# Dev Setup

1. Clone this project and run `npm install`
2. Go to `examples` folder
  - Go to `simple` folder, run `npm install`
  - In `App.jsx` file, fill `WALLET_CONNECT_PROJECT_ID`, `CHANGE_NOW_API_KEY` and `CARDANO_RECEIVE_ADDRESS` with your key.
  - If you want to use fiat feature, fill `CHANGE_NOW_FIAT_API_KEY` with your key.
  - Run `npm start`
  - Go to `localhost:3000` in your browser.

# React Use

- Install our `node_module` from github.

```bash
npm install "https://github.com/Snapbrillia/crypto-topup.git" --save
```

- Create a simple TopUpForm like this. Remember to replace your `WALLET_CONNECT_PROJECT_ID`, `CHANGE_NOW_API_KEY`, `CARDANO_RECEIVE_ADDRESS`.

```javascript
import {SnapbrilliaElement, useSnapbrilliaContext} from '../../src';

const TopUpForm = () => {
  const [amount, setAmount] = useState(100);
  const {showModal} = useSnapbrilliaContext();
  return (
    <form >
      <input type="number" value={amount} onChange={e => setAmount(e.target.value)}/>
      <button type="button" onClick={() => showModal(amount)}>
        Deposit
      </button>
    </form>
  );
};

const App = () => {
  const settings = {
    CHANGE_NOW_API_KEY: 'xxxx',
    CHANGE_NOW_FIAT_API_KEY: 'xxxx',
    WALLET_CONNECT_PROJECT_ID: 'xxxx',
    CARDANO_RECEIVE_ADDRESS: 'xxxxx',
    onFinish: (data) => {
      console.log(data);
    }
  }
  return (
    <SnapbrilliaElement settings={settings}>
      <TopUpForm />
    </SnapbrilliaElement>
  );
};

```

# Build
 To build your custom version
 - Fork our repo.
 - Change our code.
 - Run 
```bash
npm run build
```
