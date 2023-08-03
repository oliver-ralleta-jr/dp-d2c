import React from 'react';

type AboutYouFormProps = {
  principalName: string;
  firstName: string;
  lastName: string;
  loginStatus: boolean;
  nric: string;
  gender: string;
  dob: string;
  isPAS: boolean;
  myInfoSelected: boolean;
  nationalityDesc: string;
  residentialStatusDesc: string;
  passTypeDesc: string;
  passStatus: string;
  passExpiryDate: string;
  email: string;
  aboutYouQuestions: any[];
  aboutYouQ: any;
  questionnaireCat: string;
  summaryStep: string;
  showMediSave: boolean;
};

const AboutYouForm: React.FC<AboutYouFormProps> = ({
  principalName,
  firstName,
  lastName,
  loginStatus,
  nric,
  gender,
  dob,
  isPAS,
  myInfoSelected,
  nationalityDesc,
  residentialStatusDesc,
  passTypeDesc,
  passStatus,
  passExpiryDate,
  email,
  aboutYouQuestions,
  aboutYouQ,
  questionnaireCat,
  summaryStep,
  showMediSave,
}) => {
  return (
    <div className="default" id={`${principalName}-about-you`}>
      <div className="about-you common-job-box review-summary">
        <div className="common-box-content">
          <div className="section-title">
            Personal details
            {summaryStep === 'REVIEW' && (
              <a className="pull-right edit-section-link" onClick={() => vm.editSection()}>{vm.isV2UX ? 'EDIT' : ''}</a>
            )}
          </div>
          <div className="common-sub-box">
            <form className="content-form" name="aboutYouForm" noValidate>
              <div className="row each-group" style={{ display: principalName ? 'block' : 'none' }}>
                <div className="col-xs-12 col-sm-12 form-group">
                  <label className="view-form-title">Principal Name</label>
                  <p className="view-form-input">{principalName}</p>
                </div>
              </div>
              {!firstName && loginStatus && (
                <div className="row each-group">
                  <div className="col-xs-12 col-sm-6 form-group">
                    <input-review about-you-form="aboutYouForm" input-value={lastName} input-details={vm.inputDetails[0]} login-status={loginStatus} validate-input={vm.validateInput(type, str)}>
                    </input-review>
                    <span className="field-support">Per your NRIC</span>
                  </div>
                </div>
              )}
              {(firstName || !loginStatus) && (
                <div className="row each-group">
                  <div className="col-xs-12 col-sm-6 form-group">
                    <input-review about-you-form="aboutYouForm" input-value={firstName} input-details={vm.inputDetails[1]} login-status={loginStatus} validate-input={vm.validateInput(type, str)}>
                    </input-review>
                    <span className="field-support">Per your NRIC</span>
                  </div>
                  <div className="col-xs-12 col-sm-6 form-group">
                    <input-review about-you-form="aboutYouForm" input-value={lastName} input-details={vm.inputDetails[0]} login-status={loginStatus} validate-input={vm.validateInput(type, str)}>
                    </input-review>
                    <span className="field-support">Per your NRIC</span>
                  </div>
                </div>
              )}
              <div className="row each-group">
                <div className="col-xs-12 col-sm-6 form-group">
                  <label className="static-label label-grey" htmlFor="nric">NRIC/FIN/Identification No.</label>
                  <p className="view-form-input">{nric}</p>
                  <div>
                    <span className="field-support">Only customers with a valid NRIC/FIN/Identification No. can apply</span>
                  </div>
                </div>
                <div className="col-xs-12 col-sm-6 form-group" style={{ display: (isExistCustomerDecl === 'false' || myInfoSelected) ? 'block' : 'none' }}>
                  <div>
                    <phone-input
                      about-you-form="aboutYouForm" idd={vm.idd} number={vm.number}
                      mobile-valid-error={vm.mobileValidError}
                      idd-valid-error={vm.IDD}
                      login-status={loginStatus} validate-input={vm.validateInput(type, str, prerequisite)}>
                    </phone-input>
                  </div>
                  <div>
                    <span className="field-support">In case we need to contact you about this application</span>
                  </div>
                </div>
              </div>
              <div className="row each-group">
                {!myInfoSelected && (
                  <div className="col-xs-12 col-sm-6 form-group">
                    <gender-select about-you-form="aboutYouForm" gender={gender} drop-down-list={vm.genders} login-status={loginStatus} profile={vm.profile}>
                    </gender-select>
                  </div>
                )}
                {myInfoSelected && (
                  <div className="col-xs-12 col-sm-6 form-group">
                    <label className="view-form-title">Gender</label>
                    <p className="view-form-input">{gender === 'M' ? 'Male' : 'Female'}</p>
                  </div>
                )}
                <div className="col-xs-12 col-sm-6 form-group">
                  <dob-input about-you-form="aboutYouForm" dob-date={dob} login-status={loginStatus}></dob-input>
                  <span className="field-support" style={{ display: !loginStatus && isPAS ? 'block' : 'none' }}>Editing your DOB might require you to restart your application</span>
                </div>
              </div>
              <div className="row each-group" style={{ display: myInfoSelected ? 'block' : 'none' }}>
                <div className="col-xs-12 col-sm-6 form-group">
                  <div>
                    <label className="view-form-title">Nationality</label>
                    <p className="view-form-input">{nationalityDesc}</p>
                  </div>
                </div>
                {residentialStatusDesc && (
                  <div className="col-xs-12 col-sm-6 form-group">
                    <div>
                      <label className="view-form-title">Residency Status</label>
                      <p className="view-form-input">{residentialStatusDesc}</p>
                    </div>
                    {profile.residencyCode === 3 && (
                      <>
                        <label className="view-form-title">Pass Type</label>
                        <p className="view-form-input">{passTypeDesc}</p>
                        <label className="view-form-title">Pass Status</label>
                        <p className="view-form-input">{passStatus}</p>
                        <label className="view-form-title">Pass Expiry Date</label>
                        <p className="view-form-input">{passExpiryDate}</p>
                      </>
                    )}
                  </div>
                )}
              </div>
              <div className="row each-group">
                <div className="col-xs-12 col-sm-6 form-group">
                  <input-review about-you-form="aboutYouForm" input-value={email} input-details={vm.inputDetails[3]} validate-input={vm.validateInput(type, str)}>
                  </input-review>
                </div>
                <div className="col-xs-12 col-sm-6 form-group">
                  {aboutYouQuestions.length > 0 && (
                    <questions-pru filter-question={aboutYouQuestions} questionnaire-json={aboutYouQ} questionnaire-cat={questionnaireCat} edit-mode={summaryStep !== 'REVIEW'}></questions-pru>
                  )}
                </div>
              </div>
              {showMediSave && (
                <div className="row each-group">
                  <div className="col-xs-12 form-group">
                    <label className="static-label label-grey" htmlFor="mediSave">MediSave Account</label>
                    <p className="view-form-input">{nric}</p>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutYouForm;
