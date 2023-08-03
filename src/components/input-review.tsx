import React, { useState } from 'react';

interface InputDetails {
  labelValue: string;
  inputName: string;
  validationType?: string;
  isNotRequired: boolean;
  maxlength?: number;
}

interface Props {
  inputDetails: InputDetails;
  inputValue: string;
  validateInput: (data: { type: string; str: string }) => void;
}

const ReviewSummary: React.FC<Props> = ({ inputDetails, inputValue, validateInput }) => {
  const [isEdit, setIsEdit] = useState(false);
  const [onFocus, setOnFocus] = useState(false);

  const isDetailMode = isEdit || inputDetails.inputName === 'DETAIL';

  const handleEditAction = () => {
    setIsEdit(true);
  };

  const handleBlur = () => {
    setOnFocus(false);
    validateInput({ type: inputDetails.inputName, str: inputValue });
  };

  const handleFocus = () => {
    setOnFocus(true);
  };

  return (
    <div>
      {/* display mode for review summary */}
      {!isEdit && inputDetails.inputName !== 'DETAIL' && (
        <div>
          <label className="view-form-title">
            {inputDetails.labelValue || 'N/A'}
            {!isDetailMode && !loginStatus && (
              <span id={`${inputDetails.inputName}-edit`} name={`${inputDetails.inputName}-edit`} onClick={handleEditAction}>
                <img className="edit-pencil" src="assets/images/svg/edit.svg" alt="Edit" />
              </span>
            )}
          </label>
          <p className="view-form-input" ng-if={!withDollar && (inputDetails.inputName !== 'nric' || isDetailMode)}>
            {inputValue}
          </p>
          <p className="view-form-input" ng-if={withDollar}>
            S${inputValue}
          </p>
          <p className="view-form-input" ng-if={inputDetails.inputName === 'nric' && !isDetailMode}>
            {inputValue}
          </p>
        </div>
      )}

      {/* edit mode for review summary */}
      {(isEdit || inputDetails.inputName === 'DETAIL') && (
        <div>
          <label
            className={`static-label ${!inputValue && !onFocus ? 'empty' : ''} ${(!inputValue && aboutYouForm[inputDetails.inputName].$isOnBlur) || (inputValue && aboutYouForm[inputDetails.inputName].$invalid && aboutYouForm[inputDetails.inputName].$isOnBlur) ? 'error' : ''} ${onFocus ? 'edit' : ''} ${onFocus || inputValue ? 'focus' : ''}`}
            htmlFor={inputDetails.inputName}
          >
            {inputDetails.labelValue}
          </label>
          {inputValue && aboutYouForm[inputDetails.inputName].$invalid && aboutYouForm[inputDetails.inputName].$isOnBlur && (
            <span className="error-msg error">Please enter a valid {inputDetails.inputName}</span>
          )}
          {!inputValue && aboutYouForm[inputDetails.inputName].$isOnBlur && <span className="error-msg">Please enter a valid {inputDetails.inputName}</span>}
          {/* normal input */}
          {withDollar && <span className="view-form-input">S$</span>}
          <input
            className={`form-control input-summary-style isBlurValidation ${inputDetails.inputName !== 'email' ? 'medium-input-style' : ''}`}
            type="text"
            name={inputDetails.inputName}
            title={inputDetails.inputName}
            id={inputDetails.inputName}
            value={inputValue}
            onBlur={handleBlur}
            onFocus={handleFocus}
            maxLength={inputDetails.maxlength}
            required={!inputDetails.isNotRequired}
          />
          {/* number input */}
          {inputDetails.validationType === 'idd-validation' && (
            <input
              className="form-control input-summary-style medium-input-style isBlurValidation with-dollar"
              type="text"
              name={inputDetails.inputName}
              title={inputDetails.inputName}
              id={inputDetails.inputName}
              value={inputValue}
              onBlur={handleBlur}
              onFocus={handleFocus}
              onChange={validateLength}
              maxLength={inputDetails.maxlength}
              required={!inputDetails.isNotRequired}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewSummary;
