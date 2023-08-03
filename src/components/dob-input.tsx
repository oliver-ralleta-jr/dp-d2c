import React, { useState } from 'react';

type ReviewSummaryProps = {
  selectMode: string;
  isEdit: boolean;
  loginStatus: boolean;
  reqType: string;
  dobDate: string;
};

const ReviewSummary: React.FC<ReviewSummaryProps> = ({
  selectMode,
  isEdit,
  loginStatus,
  reqType,
  dobDate,
}) => {
  const [onFocus, setOnFocus] = useState(false);

  const isEditAction = () => {
    setOnFocus(true);
  };

  const changeProfileDob = () => {
    setOnFocus(false);
  };

  return (
    <div>
      {/* display mode for review summary */}
      {!isEdit && selectMode !== 'DETAIL' && (
        <>
          {/* PD-1639: Pencil icons in editable fields on review summary */}
          <label className="view-form-title">
            Date of birth&nbsp;&nbsp;&nbsp;
            <span
              id="txtDobEdit"
              name="txtDobEdit"
              onClick={isEditAction}
              style={{
                display:
                  selectMode !== 'EDIT' &&
                  !loginStatus &&
                  reqType !== 'PAS' &&
                  reqType !== 'PS' &&
                  reqType !== 'PER' &&
                  reqType !== 'PT' &&
                  reqType !== 'PC' &&
                  reqType !== 'PAT'
                    ? 'inline'
                    : 'none',
              }}
            >
              <img
                className="edit-pencil"
                src="assets/images/svg/edit.svg"
                alt="Edit"
              />
            </span>
          </label>
          <p className="view-form-input">{dobDate}</p>
        </>
      )}

      {/* edit mode for review summary */}
      {(isEdit || selectMode === 'DETAIL') && (
        <>
          <label
            className={`static-label ${
              !dobDate && !onFocus ? 'empty' : ''
            } ${(!dobDate && onFocus) || (dobDate && dobDate && onFocus) ? 'focus' : ''} ${
              (!dobDate && onFocus) || (dobDate && onFocus) ? 'edit' : ''
            } ${(!dobDate && onFocus) || (dobDate && onFocus && dobDate && onFocus) ? 'error' : ''}`}
            htmlFor="dob"
          >
            Date of birth
          </label>
          {!dobDate && onFocus && (
            <span className="error-msg">Please enter a valid date of birth</span>
          )}
          <input
            type="text"
            datetime="dd/MM/yyyy"
            datetime-model="dd/MM/yyyy"
            name="dob"
            className={`form-control input-summary-style medium-input-style isBlurValidation ${
              onFocus && !dobDate ? 'error-input' : ''
            }`}
            value={dobDate}
            onChange={(e) => setDobDate(e.target.value)}
            onBlur={changeProfileDob}
            onFocus={() => setOnFocus(true)}
          />
        </>
      )}
    </div>
  );
};

export default ReviewSummary;
