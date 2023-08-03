import React, { useState } from 'react';

type HealthDetails = {
  height: string;
  weight: string;
};

type HealthFormProps = {
  healthDetails: HealthDetails;
  inputHeight: string;
  inputWeight: string;
};

const HealthForm: React.FC<HealthFormProps> = ({
  healthDetails,
  inputHeight,
  inputWeight,
}) => {
  return (
    <form className="content-form" name="healthForm" noValidate>
      <div className="each-group">
        {/* Render questions based on reqType */}
        {reqType === 'PS' ? (
          <QuestionsShield
            questionnaireJson={healthQ}
            questionnaireCat={questionRequest.cat}
            checkIfKickout={checkIfKickout}
            summaryStep={summaryStep}
            editMode={summaryStep === 'EDIT' || summaryStep === 'DETAIL'}
          />
        ) : (
          <QuestionsPru
            questionnaireJson={allQuestionaire}
            questionnaireCat={questionCat}
            checkIfKickout={checkIfKickout}
            editMode={summaryStep === 'EDIT'}
          />
        )}
      </div>
      {/* Render height and weight inputs */}
      {reqType !== 'PC' && reqType !== 'PAT' && !healthSectionSIO && (
        <div className="row each-group heightandweight">
          <div className="col-xs-12 col-sm-6 form-group">
            <InputReview
              aboutYouForm="healthForm"
              inputValue={healthDetails.height}
              inputDetails={inputHeight}
            />
          </div>
          <div className="col-xs-12 col-sm-6 form-group">
            <InputReview
              aboutYouForm="healthForm"
              inputValue={healthDetails.weight}
              inputDetails={inputWeight}
            />
          </div>
        </div>
      )}
    </form>
  );
};

type HealthReviewProps = {
  profileType: string;
  reqType: string;
  isV2UX: boolean;
  healthQ: any;
  questionRequest: any;
  checkIfKickout: (qCode: string) => void;
  summaryStep: string;
  allQuestionaire: any;
  questionCat: any;
  healthSectionSIO: boolean;
};

const HealthReview: React.FC<HealthReviewProps> = ({
  profileType,
  reqType,
  isV2UX,
  healthQ,
  questionRequest,
  checkIfKickout,
  summaryStep,
  allQuestionaire,
  questionCat,
  healthSectionSIO,
}) => {
  const [healthDetails, setHealthDetails] = useState<HealthDetails>({
    height: '',
    weight: '',
  });
  const [inputHeight, setInputHeight] = useState('');
  const [inputWeight, setInputWeight] = useState('');

  const editSection = () => {
    // Handle edit section logic
  };

  return (
    <div id={`${profileType}-health-review`}>
      <div className="about-you review-summary">
        <div className="common-box-content">
          <div className="section-title">
            <span
              style={{ display: reqType === 'PC' || reqType === 'PAT' ? 'none' : 'block' }}
            >
              Health and Lifestyle
            </span>
            <span style={{ display: reqType === 'PC' || reqType === 'PAT' ? 'block' : 'none' }}>
              Your Health
            </span>
            {isV2UX && (
              <a className="pull-right edit-section-link" onClick={editSection}>
                EDIT
              </a>
            )}
          </div>
          <div className="common-sub-box">
            <HealthForm
              healthDetails={healthDetails}
              inputHeight={inputHeight}
              inputWeight={inputWeight}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthReview;
