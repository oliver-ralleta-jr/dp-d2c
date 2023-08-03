import React, { useState } from 'react';

const ReviewSummary: React.FC = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [selectMode, setSelectMode] = useState('');

  const [gender, setGender] = useState('');
  const [isOnBlur, setIsOnBlur] = useState(false);

  const dropDownList = {
    M: 'Male',
    F: 'Female',
  };

  const isEditAction = () => {
    setIsEdit(true);
  };

  const selectBlur = () => {
    setIsOnBlur(true);
  };

  return (
    <div>
      {/* display mode for review summary */}
      {!isEdit && selectMode !== 'DETAIL' && (
        <>
          {/* PD-1639: Pencil icons in editable fields on review summary */}
          <label className="view-form-title">
            Gender&nbsp;&nbsp;&nbsp;
            {!selectMode !== 'EDIT' && !loginStatus && profile.type !== 'PM' && profile.type !== 'PL' && profile.type !== 'PC' && (
              <img className="edit-pencil" src="assets/images/svg/edit.svg" onClick={isEditAction} />
            )}
          </label>
          <p className="view-form-input">{gender ? (gender === 'M' ? 'Male' : 'Female') : ''}</p>
        </>
      )}

      {/* edit mode for review summary */}
      {(isEdit || selectMode === 'DETAIL') && (
        <>
          <label className="static-label" htmlFor="gender">
            Gender
          </label>
          <span className="error-msg" style={{ display: !gender && isOnBlur ? 'block' : 'none' }}>
            This is a required field
          </span>
          <select
            id="txtGender"
            name="gender"
            className="form-control dropdown-input input-summary-style isBlurValidation edit-review medium-input-style"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required={true}
            style={{ display: isEdit ? 'block' : 'none' }}
            onBlur={selectBlur}
          >
            {Object.entries(dropDownList).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </select>
        </>
      )}
    </div>
  );
};

export default ReviewSummary;
