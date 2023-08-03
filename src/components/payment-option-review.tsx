import React, { useState } from 'react';

type PaymentOption = {
  label: string;
  value: string;
  details: string;
};

type Product = {
  paymentOption: string;
};

type PaymentOptionsProps = {
  isPerDirectEntry: boolean;
  perPaymentConfig: PaymentOption[];
};

const PaymentOptions: React.FC<PaymentOptionsProps> = ({
  isPerDirectEntry,
  perPaymentConfig,
}) => {
  const [editMode, setEditMode] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedPaymentOption, setSelectedPaymentOption] = useState('');

  const editSection = () => {
    setEditMode(true);
  };

  const onChangeHandler = (value: string) => {
    setSelectedPaymentOption(value);
    setErrorMsg('');
  };

  const answer = perPaymentConfig.find(
    (option) => option.value === selectedPaymentOption
  );

  return (
    <div id={`${isPerDirectEntry ? 'per' : 'non-per'}-payment-option`}>
      <div className="payment-options details-common common-details-box">
        <div className="common-box-header">
          <div className="row">
            <div className="col-xs-12">
              {!editMode && (
                <a
                  className="pull-right edit-section-link"
                  onClick={editSection}
                >
                  <img
                    className="edit-pencil"
                    src="assets/images/svg/edit.svg"
                    alt="Edit"
                  />
                </a>
              )}
              <h1>Payment Options</h1>
            </div>
          </div>
        </div>
        <div className="common-box-content">
          <div className="common-main-content">
            <div className="common-sub-box">
              <div className="row each-group">
                <div id="payment-option-review">
                  <div className="common-box-content col-xs-12">
                    {editMode ? (
                      <>
                        <div className="per-payment-desc">
                          For more information on payment methods, please{' '}
                          <a
                            href="https://www.prudential.com.sg/services/making-payments/ipay"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            click here
                          </a>
                        </div>
                        <p className="grey-text">How do you wish to pay?</p>
                        <div className="consent-radio row">
                          {perPaymentConfig.map((option) => (
                            <div
                              className="col-xs-12 col-sm-12"
                              key={option.label}
                            >
                              <div className="radio-inline">
                                <div className="radio">
                                  <input
                                    type="radio"
                                    name="paymentOptions"
                                    id={option.label}
                                    title={option.label}
                                    value={option.value}
                                    checked={
                                      selectedPaymentOption === option.value
                                    }
                                    onChange={() =>
                                      onChangeHandler(option.value)
                                    }
                                  />
                                  <label htmlFor={option.label}>
                                    pay via {option.label}
                                  </label>
                                </div>
                                {option.value === selectedPaymentOption && (
                                  <span
                                    className="info-tooltip no-margin"
                                    dangerouslySetInnerHTML={{
                                      __html: option.details,
                                    }}
                                  ></span>
                                )}
                              </div>
                            </div>
                          ))}
                          {errorMsg && (
                            <p className="error-msg">{errorMsg}</p>
                          )}
                        </div>
                      </>
                    ) : (
                      <div>
                        <span>How do you wish to pay?</span>&nbsp;
                        <b>via {answer?.label}</b>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentOptions;
