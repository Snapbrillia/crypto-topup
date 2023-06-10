import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { SnapbrilliaProvider } from '../context/SnapbrilliaContext.jsx';
import { WalletProvider } from '../context/WalletContext.jsx';
import { StepperWrapper } from './StepperWrapper.jsx';

import './style.css'

const SnapbrilliaElement = ({ settings, children }) => {
  return (
    <SnapbrilliaProvider settings={settings}>
      <WalletProvider settings={settings}>
        <StepperWrapper />
        {children}
        <ToastContainer />
      </WalletProvider>
    </SnapbrilliaProvider>
  );
};

export { SnapbrilliaElement };
