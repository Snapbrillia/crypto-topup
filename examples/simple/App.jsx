import React, {useEffect, useState} from 'react';

import {SnapbrilliaElement, useSnapbrilliaContext ,Crypto} from '../../src';

const ExchangeForm = () => {
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
      <ExchangeForm />
    </SnapbrilliaElement>
  );
};

export default App;
