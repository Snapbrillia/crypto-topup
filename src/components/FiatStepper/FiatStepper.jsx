import React, { useState, useEffect } from 'react';

import './style.css';
import close from '../../assets/close.svg';

import { StepOne } from './StepOne.jsx';
import { StepTwo } from './StepTwo.jsx';
import { StepThree } from './StepThree.jsx';
import { useSnapbrilliaContext } from '../../context/SnapbrilliaContext.jsx';
import { EXCHANGE_MODES } from '../../utils/constant.js';

export const FiatStepper = ({step, nextStep}) => {
  return (
    <>
      {step === 1 && <StepOne nextStep={nextStep} />}
      {step === 2 && <StepTwo nextStep={nextStep} />}
      {step === 3 && <StepThree />}
    </>
  );
};
