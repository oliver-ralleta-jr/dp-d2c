import React, { useState } from 'react';

type PaymentOption = {
  label: string;
  value: string;
  details: string;
};

type Props = {
  options: PaymentOption[];
  showToolTip: string;
};

const PaymentOptions: React.FC<Props> = ({ options, showToolTip }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const onChangeHandler = (value: string) => {
    // Handle onChange event
  };

  return (
    <div id="payment-option-summary">
      <div className={`common-box-header ${isCollapsed ? 'isCollapse' : ''}`}>
        <div className="row">
          <div className="col-xs-10">
            <h1>How do you like to make payment?</h1>
          </div>
          <div className="col-xs-2" style={{ display: 'flex', alignItems: 'center' }}>
            <a className={`isCollapse ${isCollapsed ? 'isCollapse' : ''}`} href="#" onClick={() => setIsCollapsed(!isCollapsed)}>
              <span className={`glyphicon collapse-icon ${isCollapsed ? 'glyphicon-chevron-up' : 'glyphicon-chevron-down'}`}></span>
            </a>
          </div>
        </div>
      </div>
      <div className="common-box-content col-xs-12" style={{ display: isCollapsed ? 'none' : 'block' }}>
        <div className="row">
          <div className="payment-desc">
            For more information on payment methods, please{' '}
            <a href="https://www.prudential.com.sg/services/payments" target="_blank" rel="noopener noreferrer">
              click here
            </a>
          </div>
        </div>
        <div className="consent-radio row">
          {options.map((option) => (
            <div className={`col-xs-12 col-sm-${12 / options.length}`} key={option.label}>
              <div className="radio-inline">
                <div className="radio">
                  <input
                    type="radio"
                    name="paymentOptions"
                    id={option.label}
                    title={option.label}
                    value={option.value}
                    checked={option.value === showToolTip}
                    onChange={() => onChangeHandler(option.value)}
                  />
                  <label htmlFor={option.label}>{option.label}</label>
                </div>
                {option.value === showToolTip && (
                  <span className="info-tooltip no-margin" dangerouslySetInnerHTML={{ __html: option.details }}></span>
                )}
              </div>
            </div>
          ))}
          <p className="error-msg" style={{ display: errorMsg ? 'block' : 'none' }}>
            {errorMsg}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentOptions;
