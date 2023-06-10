import React, { createContext, useContext, useState, useEffect } from 'react';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import {
  FLOW_TYPES,
  SUPPORTED_TOPUP,
  TRANSACTION_STATUS,
  EXCHANGE_MODES,
} from '../utils/constant';
import { Exchange, Crypto, Fiat } from '../core';

const SnapbrilliaContext = createContext();
const useSnapbrilliaContext = () => useContext(SnapbrilliaContext);

const SnapbrilliaProvider = ({ settings, children }) => {
  const [isOpenModal, setShowModal] = useState(false);
  const [exchangeMode, setExchangeMode] = useState(settings.mode || 'crypto');
  const [supportedCurrencies, setSupportedCurrencies] = useState([]);
  const [isStarted, setIsStarted] = useState(false);
  const apiKey = settings.CHANGE_NOW_API_KEY;
  const fiatKey = settings.CHANGE_NOW_FIAT_API_KEY;

  if (!settings.CHANGE_NOW_API_KEY) {
    console.error("INVALID CHANGE NOW API KEY");
  }

  if (!settings.CHANGE_NOW_FIAT_API_KEY) {
    console.error("INVALID CHANGE NOW FIAT API KEY");
  }

  const exchangeSDK = new Exchange({
    apiKey: apiKey,
  });
  const cryptoSDK = new Crypto({
    apiKey: apiKey,
  });
  const fiatSDK = new Fiat({
    apiKey: fiatKey,
  });

  const fiatSetting = {
    fromCurrency: 'usd',
    fromNetwork: '',
    amount: 100,
  };
  const cryptoSetting = {
    fromCurrency: 'eth',
    fromNetwork: 'eth',
    toAmount: 100,

  };

  const defaultTransaction = {
    id: '',
    payinAddress: '',
    payoutAddress: '',
    rateId: '',
    validUntil: '',
    toCurrency: SUPPORTED_TOPUP[0].ticker,
    toNetwork: SUPPORTED_TOPUP[0].network,
    fromAddress: '',
    toAddress: settings.CARDANO_RECEIVE_ADDRESS,
    toAmount: 0.1,
    flow: FLOW_TYPES.FIXED,
  };

  const submitCrypto = async (values) => {
    const body = {
      ...values,
    };
    const newTransaction = await exchangeSDK.createTransaction(body);
    transactionForm.handleChange({
      target: { name: 'id', value: newTransaction.id },
    });
    transactionForm.handleChange({
      target: { name: 'payinAddress', value: newTransaction.payinAddress },
    });
  };

  const submitFiat = async (values) => {
    const body = {
      ...values,
    };
    const newTransaction = await fiatSDK.createTransaction(body);
    transactionForm.handleChange({
      target: { name: 'id', value: newTransaction.id },
    });
    window.open(newTransaction.redirect_url, '_blank').focus();
  };

  const transactionForm = useFormik({
    enableReinitialize: true,
    initialValues:
      exchangeMode === EXCHANGE_MODES.FIAT
        ? Object.assign(defaultTransaction, fiatSetting)
        : Object.assign(defaultTransaction, cryptoSetting),
    validationSchema: Yup.object({
      fromCurrency: Yup.string(),
      fromNetwork: Yup.string(),
      toCurrency: Yup.string(),
      toNetwork: Yup.string(),
      fromAddress: Yup.string(),
      toAddress: Yup.string(),
    }),
    onSubmit: async (values) => {
      if (exchangeMode === EXCHANGE_MODES.FIAT) {
        await submitFiat(values);
      } else {
        await submitCrypto(values);
      }
    },
  });

  const showModal = (amount) => {
    if (amount > 0) {
      transactionForm.handleChange({
        target: {
          name: exchangeMode === EXCHANGE_MODES.FIAT ? 'amount' : 'toAmount',
          value: amount,
        },
      });
      setShowModal(true);
    } else {
      toast.error('Invalid Amount!');
    }
  };
  const closeModal = () => {
    setShowModal(false);
  };

  const resetTransaction = () => {
    transactionForm.resetForm();
  };

  const getListCurrencies = async () => {
    const currencies = await exchangeSDK.getCurrencies({});
    setSupportedCurrencies(currencies);
  };

  const getListFiatCurrencies = async () => {
    const currencies = await fiatSDK.getFiatCurrencies({});
    setSupportedFiatCurrencies(currencies);
  };

  const initFunction = async () => {
    await Promise.all([
      getListCurrencies(),
      // getListFiatCurrencies()
    ]);
    setIsStarted(true);
  };

  const getCryptoTransaction = async () => {
    if (transactionForm.values.id) {
      const data = await exchangeSDK.getTransaction(transactionForm.values.id);
      return data;
    }
  };

  const getFiatTransaction = async () => {
    if (transactionForm.values.id) {
      const data = await fiatSDK.getTransaction(transactionForm.values.id);
      return data;
    }
  };

  const getTransaction = async () => {
    if (exchangeMode === EXCHANGE_MODES.FIAT) {
      return await getFiatTransaction();
    } else {
      return await getCryptoTransaction();
    }
  };

  let randomState = 0;
  const getTestTransaction = async () => {
    const randomData = [
      {
        status: TRANSACTION_STATUS.WAITING,
      },
      {
        status: TRANSACTION_STATUS.CONFIRMING,
      },
      {
        status: TRANSACTION_STATUS.EXCHANGING,
      },
      {
        status: TRANSACTION_STATUS.SENDING,
      },
      {
        status: TRANSACTION_STATUS.FINISHED,
      },
    ];
    if (transactionForm.values.id) {
      if (randomState < randomData.length - 1) {
        randomState += 1;
      }
      return randomData[randomState];
    }
  };

  useEffect(() => {
    initFunction();
  }, []);

  useEffect(() => {
    if (isStarted) {
      if (settings.onReady && typeof settings.onReady === 'function') {
        settings.onReady({
          showModal,
          closeModal,
        });
      }
    }
  }, [isStarted]);

  return (
    <SnapbrilliaContext.Provider
      value={{
        ...transactionForm,
        exchangeSDK,
        cryptoSDK,
        fiatSDK,
        showModal,
        closeModal,
        isOpenModal,
        resetTransaction,
        supportedCurrencies,
        getTransaction: getTransaction,
        exchangeMode,
        setExchangeMode,
        cryptoSetting,
        fiatSetting,
      }}
    >
      {isStarted && children}
    </SnapbrilliaContext.Provider>
  );
};

export { SnapbrilliaProvider, useSnapbrilliaContext };
