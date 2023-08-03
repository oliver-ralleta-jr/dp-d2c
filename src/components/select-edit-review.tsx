import React, { useState } from 'react';

type Option = string | { [key: string]: string };

type Props = {
  selectMode: 'DETAIL' | 'EDIT' | 'REVIEW';
  labelName: string;
  dropDownKey?: [string, string];
  dropDownList: Option[];
  fieldName: string;
  currentValueDesc?: string;
  canEdit?: boolean;
  currentForm?: any;
  residencyStatus?: any;
  isOnBlur?: boolean;
};

const SelectEditReview: React.FC<Props> = ({
  selectMode,
  labelName,
  dropDownKey,
  dropDownList,
  fieldName,
  currentValueDesc,
  canEdit,
  currentForm,
  residencyStatus,
  isOnBlur,
}) => {
  const [currentValue, setCurrentValue] = useState('');

  const isEditAction = () => {
    // Handle edit action
  };

  const selectBlur = () => {
    // Handle select blur
  };

  return (
    <div className="select-edit-review form-group">
      {selectMode === 'DETAIL' && (
        <div>
          <label className="view-form-title" dangerouslySetInnerHTML={{ __html: labelName }}></label>
          {!residencyStatus && isOnBlur && <span className="error-msg">This is a required field</span>}
          {dropDownKey ? (
            <select
              id={fieldName}
              name={fieldName}
              className="form-control dropdown-input input-line-style isBlurValidation"
              value={currentValue}
              onChange={(e) => setCurrentValue(e.target.value)}
              required
            >
              {dropDownList.map((e: Option) => (
                <option key={e[dropDownKey[1]]} value={e[dropDownKey[1]]}>
                  {e[dropDownKey[0]]}
                </option>
              ))}
            </select>
          ) : (
            <select
              id={fieldName}
              name={fieldName}
              className="form-control dropdown-input input-line-style isBlurValidation"
              value={currentValue}
              onChange={(e) => setCurrentValue(e.target.value)}
              required
            >
              {dropDownList.map((option: Option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          )}
        </div>
      )}

      {selectMode === 'EDIT' && (
        <div>
          <label className="view-form-title" dangerouslySetInnerHTML={{ __html: labelName }}></label>
          <p className="view-form-input">{currentValueDesc}</p>
        </div>
      )}

      {selectMode === 'REVIEW' && (
        <div>
          <label className="view-form-title" dangerouslySetInnerHTML={{ __html: labelName }}></label>
          {!canEdit && <span onClick={isEditAction}><img className="edit-pencil" src="assets/images/svg/edit.svg" /></span>}
          <p className="view-form-input">{currentValueDesc}</p>
          {currentValue && currentForm[fieldName].$invalid && isOnBlur && <span className="error-msg">Error! This is an invalid answer</span>}
          {!currentValue && isOnBlur && <span className="error-msg">This is a required field</span>}
          {dropDownKey ? (
            <select
              id={fieldName}
              name={fieldName}
              className="form-control dropdown-input input-line-style isBlurValidation edit-review"
              value={currentValue}
              onChange={(e) => setCurrentValue(e.target.value)}
              required
              onBlur={selectBlur}
            >
              {canEdit && (
                <option value="">Select an option</option>
              )}
              {dropDownList.map((e: Option) => (
                <option key={e[dropDownKey[1]]} value={e[dropDownKey[1]]}>
                  {e[dropDownKey[0]]}
                </option>
              ))}
            </select>
          ) : (
            <select
              id={fieldName}
              name={fieldName}
              className="form-control dropdown-input input-line-style isBlurValidation edit-review"
              value={currentValue}
              onChange={(e) => setCurrentValue(e.target.value)}
              required
              onBlur={selectBlur}
            >
              {canEdit && (
                <option value="">Select an option</option>
              )}
              {dropDownList.map((option: Option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          )}
        </div>
      )}
    </div>
  );
};

export default SelectEditReview;
