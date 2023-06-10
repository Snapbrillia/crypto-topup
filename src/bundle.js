import React from "react";
import ReactDOM from "react-dom";
import { ethers } from 'ethers';
import { SnapbrilliaElement } from './components/Element';

export { Exchange, Crypto, Fiat } from './core';
export { SnapbrilliaElement };
export { useWalletContext } from './context/WalletContext';
export { useSnapbrilliaContext } from './context/SnapbrilliaContext';


if (typeof window !== 'undefined') {
  window.initSnapbrilliaExchange = (settings, dom) => {
    var snapbrilliaElement = dom || document.createElement('div');
    var exportFunction = {
      onReady: settings && settings.onReady
    }
    document.body.appendChild(snapbrilliaElement);
    const root = createRoot(snapbrilliaElement);
    ReactDOM.render(React.createElement(SnapbrilliaElement, {
      settings,
      exportFunction
    }), root);
  }
}
