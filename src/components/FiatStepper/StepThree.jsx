import React, { useEffect, useState, useCallback } from 'react';
import QRCode from "react-qr-code";
import { utils } from 'ethers'
import { toast } from 'react-toastify';
import copy from '../../assets/copy.svg';

import WalletConnectBtn from '../../assets/walletconnect_btn.png';
import { useSnapbrilliaContext } from '../../context/SnapbrilliaContext.jsx';
import { useWalletContext } from '../../context/WalletContext.jsx';

import { TRANSACTION_STATUS } from '../../utils/constant.js';
import { useIntervalAsync } from '../../hook/useIntervalAsync';

export const StepThree = () => {
  const { values, getTransaction } = useSnapbrilliaContext();
  const { settings } = useWalletContext();
  const [isConnected, setConnected] = useState(false);
  const [isFinishCalled, setIsFinishCalled] = useState(false);
  const [status, setStatus] = useState(TRANSACTION_STATUS.WAITING);


  const checkTransaction = useCallback(async () => {
    const data = await getTransaction();
    if (data.status) {
      setStatus(data.status);
      if (data.status === TRANSACTION_STATUS.FINISHED) {
        if (settings.onFinish && !isFinishCalled) {
          setIsFinishCalled(true);
          settings.onFinish(values);
          removeInterval();
          toast('Success');
        }
      }
    }
  }, [isFinishCalled]);

  const [removeInterval] = useIntervalAsync(checkTransaction, 2000);

  return (
    <div className="third-step__info">
      <div className="deposit-address">
        <div className="address-wrapper">
          <div className="address-header">
            <span className="address-header">Amount</span>
          </div>
          <span className="address-value">{values.amount} {values.fromCurrency?.toUpperCase()} </span>
        </div>
      </div>
      <div className="tx-step--status">
        <div className="tx-step--status-item">
          <div className="tx-step--status-content">
            <div className="tx-step--status-progress-wrap">
              {
                status === TRANSACTION_STATUS.WAITING &&
                <div className="lds-dual-ring loading_spinner" />
              }
            </div>
            <span className="tx-step--status-text tx-step--status-text__active">
              Awaiting deposit
            </span>
            <div className="progress-line progress-inactive"></div>
          </div>
        </div>
        <div className="tx-step--status-item">
          <div className="tx-step--status-content">
            <div className="tx-step--status-progress-wrap">
              {
                status === TRANSACTION_STATUS.CONFIRMING &&
                <div className="lds-dual-ring loading_spinner" />
              }
            </div>
            <span className="tx-step--status-text tx-step--status-text__inactive">
              Confirming
            </span>
            <div className="progress-line progress-inactive"></div>
          </div>
        </div>
        <div className="tx-step--status-item">
          <div className="tx-step--status-content">
            <div className="tx-step--status-progress-wrap">
              {
                status === TRANSACTION_STATUS.EXCHANGING &&
                <div className="lds-dual-ring loading_spinner" />
              }
            </div>
            <span className="tx-step--status-text tx-step--status-text__inactive">
              Exchanging
            </span>
            <div className="progress-line progress-inactive"></div>
          </div>
        </div>
        <div className="tx-step--status-item">
          <div className="tx-step--status-content">
            <div className="tx-step--status-progress-wrap">
              {
                status === TRANSACTION_STATUS.SENDING &&
                <div className="lds-dual-ring loading_spinner" />
              }
            </div>
            <span className="tx-step--status-text tx-step--status-text__inactive">
              Sending to you
            </span>
          </div>
        </div>
      </div>
      <div className="tx-info-stepper">
        <div className="tx-info-stepper__info-block">You will get result to wallet</div>
        <div className="tx-info-stepper__info-block truncate-middle">
          <div className="tx-info-stepper__wallet">{values.toAddress}</div>
        </div>
        <div className="tx-info-id tx-info-stepper__tx-id">
          <div className="tx-info-id__title">Exchange ID</div>
          <div className="tx-info-id__value">{values.id}</div>
          <button className="copy-button" type="button" onClick={() => navigator.clipboard.writeText(values.id)}>
          </button>
        </div>
      </div>
      <div className="third-step__other-info"></div>
    </div>
  );
};
