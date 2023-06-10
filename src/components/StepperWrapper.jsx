import React, { useState, useEffect } from 'react';
import { Modal } from './Modal/Modal.jsx';
import { Stepper } from './Stepper/Stepper.jsx';
import { FiatStepper } from './FiatStepper/FiatStepper.jsx';
import { useSnapbrilliaContext } from '../context/SnapbrilliaContext.jsx';
import { EXCHANGE_MODES } from '../utils/constant.js';
import close from '../assets/close.svg';

const StepperWrapper = () => {
  const [step, setStep] = useState(1);
  const {
    values,
    closeModal,
    isOpenModal,
    exchangeMode,
    setExchangeMode,
    setValues,
    fiatSetting,
    cryptoSetting,
  } = useSnapbrilliaContext();

  const stepInfos = [
    {
      title: 'Enter Exchange Details',
      description: 'Please enter the details of your exchange',
    },
    {
      title: 'Confirm the Exchange',
      description: 'Please confirm the details of your exchange',
    },
    {
      title: 'Complete the Exchange',
      description: 'Please send the funds you would like to exchange',
    },
  ];

  const nextStep = () => {
    setStep((x) => x + 1);
  };
  useEffect(() => {
    if (values.id) {
      setStep(3);
    }
  }, []);

  return (
    <Modal>
      <div className="stepper">
        <div className="stepper__step">
          <div className="first-step">
            <div className="stepper__header-panel header-panel">
              <div className="header-panel__content">
                {stepInfos[step - 1].description}
              </div>
              <button
                className="header-panel__button-close"
                type="button"
                onClick={closeModal}
              >
                <img src={close} alt="close icon" />
              </button>
            </div>
            {step === 1 && (
              <div className="first-step__tabs-selector">
                <div className="tabs">
                  <button
                    className={
                      'tabs__tab tab_exchange tab_big ' +
                      (exchangeMode === EXCHANGE_MODES.CRYPTO
                        ? 'tab_active'
                        : '')
                    }
                    type="button"
                    onClick={() => {
                      setExchangeMode(EXCHANGE_MODES.CRYPTO);
                      setValues({
                        ...values,
                        ...cryptoSetting,
                      });
                    }}
                  >
                    Crypto Currency
                  </button>
                  <button
                    className={
                      'tabs__tab tab_exchange tab_big ' +
                      (exchangeMode === EXCHANGE_MODES.FIAT ? 'tab_active' : '')
                    }
                    type="button"
                    onClick={() => {
                      setExchangeMode(EXCHANGE_MODES.FIAT);
                      setValues({
                        ...values,
                        ...fiatSetting,
                      });
                    }}
                  >
                    Fiat Currency
                  </button>
                </div>
              </div>
            )}

            {exchangeMode === EXCHANGE_MODES.FIAT && (
              <FiatStepper step={step} nextStep={nextStep} />
            )}
            {exchangeMode !== EXCHANGE_MODES.FIAT && (
              <Stepper step={step} nextStep={nextStep} />
            )}
          </div>
        </div>
      </div>
      <div className="stepper__stepper-steps stepper-steps">
        {stepInfos.map((stepInfo, index) => {
          const stepNumber = index + 1;
          return (
            <div
              key={index}
              className={`stepper-steps__step ${
                stepNumber === step ? 'stepper-steps__step_active' : ''
              }`}
              onClick={() => {
                if(!values.id && step === 2 && stepNumber === 1) {
                  setStep(1);
                }
              }}
            >
              <div className="step__number">{stepNumber}</div>
              <div className="step__title">{stepInfo.title}</div>
            </div>
          );
        })}
      </div>
    </Modal>
  );
};

export { StepperWrapper };
