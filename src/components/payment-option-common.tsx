import React from 'react';

type PaymentOptionProps = {
  paymentQ: any;
  allQuestionaire: any;
  checkIfKickout: (qCode: string) => boolean;
  questionRequest: {
    cat: string;
  };
  summaryStep: string;
};

const PaymentOption: React.FC<PaymentOptionProps> = ({
  paymentQ,
  allQuestionaire,
  checkIfKickout,
  questionRequest,
  summaryStep,
}) => {
  return (
    <div className="common-financial-box review-summary default">
      <div className="common-box-content">
        <div className="section-title">Payment option</div>
        <div className="common-sub-box">
          <div className="content-form">
            <QuestionsPru
              filter-question={paymentQ}
              questionnaire-json={allQuestionaire}
              check-if-kickout={checkIfKickout}
              questionnaire-cat={questionRequest.cat}
              edit-mode={summaryStep === 'EDIT'}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentOption;
