import React, { createContext, useContext, useState, useEffect } from 'react';

import qrcode from '../../assets/qrcode.svg';
import lock from '../../assets/lock.svg';
import EtrnlButton from '../../assets/etrnl_btn.png';
import FlintButton from '../../assets/flint_btn.png';
import GeroButton from '../../assets/gero_btn.png';
import NamiButton from '../../assets/nami_btn.png';
import NufiButton from '../../assets/nufi_btn.png';
import TyphoonButton from '../../assets/typhoon_btn.png';

import { useWalletContext } from '../../context/WalletContext.jsx';
import { useSnapbrilliaContext } from '../../context/SnapbrilliaContext.jsx';

import { Dropdown } from '../Dropdown/Dropdown';
import { SUPPORTED_TOPUP, EXCHANGE_MODES, SYSTEM_FEE } from '../../utils/constant.js';
import { useDebouncedCallback } from '../../hook/useDebouncedCallback';

export const StepOne = ({nextStep}) => {
  const { cardanoWalletConnected, connectCardanoWallet, cardanoAddress, connecting } = useWalletContext();
  const { fiatSDK, values, handleChange, supportedCurrencies, setValues, setFieldValue, exchangeMode } = useSnapbrilliaContext();
  const [loading, setLoading] = useState(false);
  const [toAmount, setToAmount] = useState(0);

  const debouncedChangeAmount = useDebouncedCallback(
    (field, value) => {
      setFieldValue(field, value);
      getEstimateAmount({
        fromCurrency: values.fromCurrency,
        fromNetwork: values.fromNetwork,
        toCurrency: values.toCurrency,
        toNetwork: values.toNetwork,
        flow: values.flow,
        fromAmount: value
      })
    },
    500
  );

  const getEstimateAmount = ({
    fromCurrency, fromNetwork, toCurrency, toNetwork, fromAmount
  }) => {
    setLoading(true);
    return fiatSDK.estimate({ fromCurrency, fromNetwork, toCurrency, toNetwork, fromAmount })
      .then((data) => {
        setLoading(false);
        if (!data.value){
          setToAmount(0);
          return;
        }
        setToAmount(data.value);
      })
      .catch((err) => {
        setLoading(false);
      })
  }


  useEffect(() => {
    getEstimateAmount({
      fromCurrency: values.fromCurrency,
      fromNetwork: values.fromNetwork,
      toCurrency: values.toCurrency,
      toNetwork: values.toNetwork,
      flow: values.flow,
      fromAmount: values.amount
    })
  }, []);


  return (
    <div className="first-step__data-exchange data-exchange">
      <div className="data-exchange__settings data-exchange__settings_desktop">
        <div className="settings__rates"></div>
        <div className="settings__selectors">
          <div className="selectors__select-box select-box select-box_big">
            <div className="select-box__input">
              <label className="select-box__input-comment">You send</label>
              <input
                name='amount'
                className="select-box__input-field"
                autoComplete="off"
                inputMode="decimal"
                type='number'
                disabled={loading}
                defaultValue={values.amount}
                onChange={(e) => {
                  const { name, value } = e.target;
                  debouncedChangeAmount(name, value);
                }}
              />
            </div>
            <Dropdown value={values.fromCurrency} currencies={supportedCurrencies.filter((x) => {
              return x.isFiat
            })} onChange={(e) => {
              setValues({
                ...values,
                'fromCurrency': e.ticker,
                'fromNetwork': e.network
              });
              getEstimateAmount({
                fromCurrency: e.ticker,
                fromNetwork: e.network,
                toCurrency: values.toCurrency,
                toNetwork: values.toNetwork,
                flow: values.flow,
                fromAmount: values.amount
              })
            }} disabled={loading}/>
          </div>
          <div className="size-box"></div>
          <div className="selectors__select-box select-box select-box_big">
            <div className="select-box__input">
              <label className="select-box__input-comment">Bounty Amount</label>
              {loading ? (
                <div className="select-box__input-field">
                  <div className="lds-dual-ring loading_spinner" />
                </div>
              ) : (
                <input
                  className="select-box__input-field custom-input-field__input-wrapper_disabled"
                  disabled={true}
                  value={(toAmount * ((100 - SYSTEM_FEE)/ 100)).toFixed(5)}
                />
              )}
            </div>
            <Dropdown value={values.toCurrency} currencies={SUPPORTED_TOPUP} onChange={(e) => {
              setValues({
                ...values,
                'toCurrency': e.ticker,
                'toNetwork': e.network,
                'toAddress': e.address,
              })
            }} disabled={true} disabledSearch={true}/>
          </div>
        </div>
        <div className="fee">
          <div className="selectors__select-box select-box select-box_big">
          </div>
          <div className="size-box"></div>
          <div className="selectors__select-box select-box select-box_big">
            <b>{`${SYSTEM_FEE} % Fee: `}</b>
            <span><b>{(toAmount * (SYSTEM_FEE/ 100)).toFixed(5)}</b> {values.toCurrency?.toUpperCase()}</span>
          </div>
        </div>
        <div className="settings__hints">
          <div className="hints">
            <div className="hint-items hints-items_horizontal">
              <div className="hint-item hint-item_not-dot">
                <div className="universal-tooltip">
                  <div className="hint-item__title hint-item__title_pointer hint-item_not-dot">
                    <span className="hint-item__title-text hint-item__title_link">
                      No extra fee
                    </span>
                  </div>
                  <span className="hint-item__rate"></span>
                </div>
              </div>
              <div className="hint-item hint-item_not-dot">
                <div className="universal-tooltip">
                  <div className="hint-item__title hint-item__title_pointer hint-item_not-dot">
                    <span className="hint-item__title-text hint-item__title_link">
                      Estimated rate
                    </span>
                  </div>
                  <span className="hint-item__rate"> 1 {values.toCurrency?.toUpperCase()} ~ {values.amount && toAmount && (values.amount / toAmount).toFixed(5)} {values.fromCurrency?.toUpperCase()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="data-exchange__wallets">
        <div className="wallets__address-and-extra">
          <div className="custom-input-field wallets__custom-input-address">
            <div className="custom-input-field__header">
              <label className="header__label">
                <div className="header__label-text">Recipient Wallet</div>
              </label>
            </div>
            <div className="custom-input-field__input-wrapper custom-input-field__input-wrapper_disabled">
              <input
                type="text"
                name="toAddress"
                className="custom-input-field__input"
                value={values.toAddress}
                disabled={true}
              />
              {connecting && (<button
                type="button"
                className="custom-input-field__icon custom-input-field__button_qr"
              >
                <div className="lds-dual-ring loading_spinner" />
              </button>)}

            </div>
            <div className="collapse-panel">
              <div className="custom-input-field__hint collapse-panel__content"></div>
            </div>
          </div>
        </div>
      </div> */}
      <div className="data-exchange__button">
        <button className="custom-button" type="button" disabled={loading || !values.toAddress || toAmount <= 0} onClick={() => {
          setFieldValue('toAmount', toAmount),
          nextStep();
        }}>
          Next
        </button>
      </div>
    </div>
  );
};
