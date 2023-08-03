import React, { useState } from 'react';

type HealthDetails = {
  height: string;
  weight: string;
};

type Question = {
  description: string;
};

type Answer = {
  label: string;
};

type QuestionOccu = {
  question: Question;
  answer: Answer;
};

type GeneralDetails = {
  question: Question;
  answer: Answer;
};

type HealthProps = {
  profileType: string;
  summaryStep: string;
  reqType: string;
  healthQ: any; // Replace 'any' with the actual type of healthQ
  questionRequest: any; // Replace 'any' with the actual type of questionRequest
  healthSectionSIO: boolean;
  previousPolicyInSummary: QuestionOccu[];
  generalDetailsInSummary: GeneralDetails[];
};

const Health: React.FC<HealthProps> = ({
  profileType,
  summaryStep,
  reqType,
  healthQ,
  questionRequest,
  healthSectionSIO,
  previousPolicyInSummary,
  generalDetailsInSummary,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [healthDetails, setHealthDetails] = useState<HealthDetails>({
    height: '',
    weight: '',
  });

  const setStep = () => {
    setIsCollapsed(!isCollapsed);
  };

  const checkIfKickout = (qCode: string) => {
    // Implement the logic for checkIfKickout
  };

  const validateForm = () => {
    // Implement the form validation logic
  };

  return (
    <div id={`${profileType}-health`}>
      <div className={`about-you details-common ${summaryStep === 'DETAIL' ? 'common-details-box' : ''}`}>
        <div className={`common-box-header ${isCollapsed ? 'isCollapse' : ''}`} style={{ display: summaryStep !== 'EDIT' ? 'block' : 'none' }}>
          <div className="row">
            <div className="col-xs-10">
              <h1 style={{ display: reqType !== 'PC' ? 'block' : 'none' }}>Health and Lifestyle</h1>
              <h1 style={{ display: reqType === 'PC' ? 'block' : 'none' }}>Your Health</h1>
            </div>
            <div className="col-xs-2">
              <a className={`isCollapse ${isCollapsed ? 'glyphicon-chevron-down' : 'glyphicon-chevron-up'}`} href="#" onClick={setStep} id="healthCommonHide" name="healthCommonHide" title="healthCommonHide">
                <span className="pull-right collapse-icon glyphicon"></span>
              </a>
            </div>
          </div>
        </div>
        <div className="common-box-content" style={{ display: isCollapsed ? 'none' : 'block' }}>
          <div className="section-title" style={{ display: summaryStep === 'REVIEW' || summaryStep === 'EDIT' ? 'block' : 'none' }}>
            <span style={{ display: reqType !== 'PC' && reqType !== 'PAT' ? 'block' : 'none' }}>Health details</span>
            <span style={{ display: reqType === 'PC' || reqType === 'PAT' ? 'block' : 'none' }}>Your Health</span>
          </div>
          <div className={`common-main-content ${summaryStep === 'DETAIL' ? 'common-main-content' : ''}`}>
            <div className="common-sub-box">
              <form className="content-form" name="healthForm" noValidate>
                <div className="each-group">
                  {reqType === 'PS' ? (
                    <questions-shield
                      questionnaire-json={healthQ}
                      questionnaire-cat={questionRequest.cat}
                      check-if-kickout={checkIfKickout}
                      summary-step={summaryStep}
                      edit-mode={summaryStep === 'EDIT' || summaryStep === 'DETAIL'}
                    ></questions-shield>
                  ) : (
                    <questions-pru
                      questionnaire-json={healthQ}
                      questionnaire-cat={questionRequest.cat}
                      check-if-kickout={checkIfKickout}
                      edit-mode={summaryStep === 'EDIT' || summaryStep === 'DETAIL'}
                    ></questions-pru>
                  )}
                </div>
                <div className="row each-group heightandweight" style={{ display: reqType !== 'PC' && reqType !== 'PAT' && !healthSectionSIO ? 'block' : 'none' }}>
                  <div className="col-xs-12 col-sm-6 col-md-6 form-group">
                    <div style={{ display: summaryStep === 'EDIT' || summaryStep === 'DETAIL' ? 'block' : 'none' }}>
                      <label className={`static-label label-grey focus error`} htmlFor="txtHeight">
                        Height(cm)
                      </label>
                      <span className="error-msg" style={{ display: healthDetails.height && healthForm.height.$invalid && healthForm.height.$isOnBlur ? 'block' : 'none' }}>
                        Please enter a valid height
                      </span>
                      <span className="error-msg" style={{ display: !healthDetails.height && healthForm.height.$isOnBlur ? 'block' : 'none' }}>
                        Please enter a valid height
                      </span>
                      <input
                        type="text"
                        required
                        className="form-control input-summary-style isBlurValidation"
                        id="txtHeight"
                        name="height"
                        title="height"
                        value={healthDetails.height}
                        onChange={(e) => setHealthDetails({ ...healthDetails, height: e.target.value })}
                        maxLength={3}
                      />
                    </div>
                    <div style={{ display: summaryStep === 'REVIEW' ? 'block' : 'none' }}>
                      <label className="view-form-title">Height(cm)</label>
                      <p className="view-form-input">{healthDetails.height}</p>
                    </div>
                  </div>
                  <div className="col-xs-12 col-sm-6 col-md-6 form-group">
                    <div style={{ display: summaryStep === 'EDIT' || summaryStep === 'DETAIL' ? 'block' : 'none' }}>
                      <label className={`static-label label-grey focus error`} htmlFor="txtWeight">
                        Weight(kg)
                      </label>
                      <span className="error-msg" style={{ display: healthDetails.weight && healthForm.weight.$invalid && healthForm.weight.$isOnBlur ? 'block' : 'none' }}>
                        Please enter a valid weight
                      </span>
                      <span className="error-msg" style={{ display: !healthDetails.weight && healthForm.weight.$isOnBlur ? 'block' : 'none' }}>
                        Please enter a valid weight
                      </span>
                      <input
                        type="text"
                        required
                        className="form-control input-summary-style isBlurValidation"
                        id="txtWeight"
                        name="weight"
                        title="weight"
                        value={healthDetails.weight}
                        onChange={(e) => setHealthDetails({ ...healthDetails, weight: e.target.value })}
                        maxLength={3}
                      />
                    </div>
                    <div style={{ display: summaryStep === 'REVIEW' ? 'block' : 'none' }}>
                      <label className="view-form-title">Weight(kg)</label>
                      <p className="view-form-input">{healthDetails.weight}</p>
                    </div>
                  </div>
                </div>
                {summaryStep === 'REVIEW' &&
                  previousPolicyInSummary.map((questionOccu, index) => (
                    <div className="box-label" key={index}>
                      <p dangerouslySetInnerHTML={{ __html: questionOccu.question.description }}></p>
                      <p className="label-text">{questionOccu.answer.label}</p>
                    </div>
                  ))}
                {summaryStep === 'REVIEW' &&
                  generalDetailsInSummary.map((question, index) => (
                    <div className="box-label" key={index}>
                      <p dangerouslySetInnerHTML={{ __html: question.question.description }}></p>
                      <p className="label-text">{question.answer.label}</p>
                    </div>
                  ))}
              </form>
            </div>
          </div>
        </div>
        {summaryStep === 'DETAIL' && !isCollapsed && (
          <div className="btn-box text-right">
            <button id="btnNextToUpload" name="nextToUpload" title="nextToUpload" className="btn detail-btn detail-submit-btn" onClick={validateForm}>
              NEXT
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Health;
