import React, { useState } from 'react';

interface Props {
  selectMode: string;
  loginStatus: boolean;
}

const MobileNumber: React.FC<Props> = ({ selectMode, loginStatus }) => {
  const [isEdit, setIsEdit] = useState(false);
  const [idd, setIdd] = useState('');
  const [number, setNumber] = useState('');
  const [iddEmpty, setIddEmpty] = useState(false);
  const [mobileValidError, setMobileValidError] = useState(false);

  const isEditAction = () => {
    setIsEdit(true);
  };

  const validateInput = (input: { type: string; str: string; prerequisite?: string }) => {
    // Validation logic here
  };

  const handleBlur = () => {
    validateInput({ type: 'mobile', str: number, prerequisite: idd });
    setMobileValidError(false);
  };

  return (
    <div>
      {!isEdit && selectMode !== 'DETAIL' && (
        <div>
          <label className="view-form-title">
            Mobile Number&nbsp;&nbsp;&nbsp;
            <span
              id="txtNumberEdit"
              name="txtNumberEdit"
              onClick={isEditAction}
              style={{ display: selectMode !== 'EDIT' && !loginStatus ? 'block' : 'none' }}
            >
              <img className="edit-pencil" src="assets/images/svg/edit.svg" alt="Edit" />
            </span>
          </label>
          <p className="view-form-input">
            +{idd}&nbsp;{number}
          </p>
        </div>
      )}
      {(isEdit || selectMode === 'DETAIL') && (
        <div>
          <label className="static-label label-grey">Mobile Number</label>
          <span className="error-msg error" style={{ display: iddEmpty ? 'block' : 'none' }}>
            Please select valid country code
          </span>
          <span
            className="error-msg error"
            style={{ display: (!idd && number) || (!number && mobileValidError) ? 'block' : 'none' }}
          >
            Please enter a valid mobile number
          </span>

          <div className="row">
            <div className="col-md-6 col-sm-6 col-xs-8">
              <input
                type="text"
                id="txtIdd"
                name="idd"
                className="form-control input-summary-style isBlurValidation"
                value={idd}
                onChange={(e) => setIdd(e.target.value)}
                onBlur={handleBlur}
                required
              />
            </div>
            <div className="col-md-6 col-sm-6 col-xs-8">
              <input
                type="text"
                id="txtNumber"
                name="number"
                className="form-control input-summary-style isBlurValidation"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                onBlur={handleBlur}
                placeholder=""
                required
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileNumber;
