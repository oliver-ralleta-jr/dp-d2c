Sure! Here's the updated code in a React .tsx file using functional components and TypeScript types:

```tsx
import React, { useState } from 'react';

type SummaryBoxProps = {
  reqType: string;
  showMyInfoBanner: boolean;
  showMyInfoBannerError: boolean;
  myInfoErrorClass: string;
  myInfoErrorMessage: string;
  pageTitle: string;
  showError: boolean;
  closeNote: boolean;
  warning: string;
};

const SummaryBox: React.FC<SummaryBoxProps> = ({
  reqType,
  showMyInfoBanner,
  showMyInfoBannerError,
  myInfoErrorClass,
  myInfoErrorMessage,
  pageTitle,
  showError,
  closeNote,
  warning,
}) => {
  const [isCollapsedAboutYou, setIsCollapsedAboutYou] = useState(false);
  const [isCollapsedMoreAbout, setIsCollapsedMoreAbout] = useState(false);
  const [isCollapsedHealth, setIsCollapsedHealth] = useState(false);
  const [isCollapsedPayment, setIsCollapsedPayment] = useState(false);
  const [isCollapsedUpload, setIsCollapsedUpload] = useState(false);

  const changeStep = (event: React.MouseEvent<HTMLButtonElement>) => {
    // Handle change step logic here
  };

  const validateData = () => {
    // Handle data validation logic here
  };

  return (
    <div className="summary-box" id={`${reqType}-details`}>
      {showMyInfoBanner && (
        <div className="my-info-banner">
          <div className="my-info-header">
            <h1>
              <strong>
                <span>PRU</span>Shield
              </strong>{' '}
              Application
            </h1>
          </div>
          <div className="my-info-desc">
            <p>
              We can complete your application quickly when we retrieve your personal information from{' '}
              <strong>Myinfo with Singpass</strong>
            </p>
          </div>
          <div className="get-singpass">
            <img
              src={`../../..${$root.contextPath}assets/images/svg/myinfo_button.svg`}
              onClick={handleSubmit}
            />
          </div>
          {showMyInfoBannerError && (
            <div className={`my-info-error ${myInfoErrorClass}`}>
              <p dangerouslySetInnerHTML={{ __html: myInfoErrorMessage }}></p>
            </div>
          )}
        </div>
      )}
      <div className="summary-navbar" style={{ display: reqType === 'PL' || reqType === 'PM' ? 'block' : 'none' }}>
        <div className="container">
          <div className="row">
            {reqType !== 'PGP' && reqType !== 'PGRP' && reqType !== 'PS' && !isSinglePremium && (
              <>
                <div className="col-xs-3 col-sm-3 col-md-2 navbar-item active">
                  <span className="item">
                    <span className="num">1</span>
                    <span className="circle"></span>
                  </span>
                  <span className="name">DETAILS</span>
                </div>
                <div className="col-xs-3 col-sm-3 col-md-2 navbar-item">
                  <span className="item">
                    <span className="num">2</span>
                    <span className="circle"></span>
                  </span>
                  <span className="name">REVIEW</span>
                </div>
                <div className="col-xs-3 col-sm-3 col-md-2 navbar-item">
                  <span className="item">
                    <span className="num">3</span>
                    <span className="circle"></span>
                  </span>
                  <span className="name">PAYMENT</span>
                </div>
                <div className="col-xs-3 col-sm-3 col-md-3 col-lg-2 navbar-item">
                  <span className="item">
                    <span className="num">4</span>
                    <span className="circle"></span>
                  </span>
                  <span className="name">CONFIRMATION</span>
                </div>
              </>
            )}
            {(reqType === 'PGP' || reqType === 'PGRP' || reqType === 'PS' || isSinglePremium) && (
              <>
                <div className="col-xs-4 col-sm-4 col-md-3 navbar-item active">
                  <span className="item">
                    <span className="num">1</span>
                    <span className="circle"></span>
                  </span>
                  <span className="name">DETAILS</span>
                </div>
                <div className="col-xs-4 col-sm-4 col-md-3 navbar-item">
                  <span className="item">
                    <span className="num">2</span>
                    <span className="circle"></span>
                  </span>
                  <span className="name">REVIEW</span>
                </div>
                <div className="col-xs-4 col-sm-4 col-md-3 navbar-item">
                  <span className="item">
                    <span className="num">3</span>
                    <span className="circle"></span>
                  </span>
                  <span className="name">CONFIRMATION</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="summary-content-box">
        <div className="container application-summary-container" style={{ position: 'relative' }}>
          <div className="row">
            <div className="col-md-8 content-title-box" style={{ display: summaryStep === 'EDIT' || myInfoSelected ? 'block' : 'none' }}>
              <h1>Additional information</h1>
              <h3>
                Your application has been pre-filled using your Prudential profile, however a little more information is
                required to complete it. You'll be able to review your entire application at the next step.
              </h3>
            </div>
          </div>
          <div className="row">
            <div className="col-md-4 col-md-push-8">
              <PolicyDetailsCommon profile={profile} summaryStep={summaryStep} />
            </div>
            <div className="col-md-8 col-md-pull-4" id="applicationSummaryLeftContents">
              <div className={summaryStep === 'EDIT' ? 'bg-content' : ''}>
                <div className={summaryStep === 'EDIT' ? 'each-section' : ''}>
                  <AboutYouCommon
                    isCollapsed={isCollapsedAboutYou}
                    profile={profile}
                    summaryStep={summaryStep}
                    changeDetailStep={changeStep}
                  />
                </div>
                <div className={summaryStep === 'EDIT' ? 'each-section' : ''}>
                  <MoreAboutYouCommon
                    isCollapsed={isCollapsedMoreAbout}
                    hideUpload={hideUpload}
                    profile={profile}
                    summaryStep={summaryStep}
                    changeDetailStep={changeStep}
                    showResAddChanged={showResAddChanged}
                    detailStep={detailStep}
                    show={(detailStep !== 'aboutYou' || summaryStep === 'REVIEW') || myInfoSelected}
                  />
                </div>
                <div className={summaryStep === 'EDIT' ? 'each-section' : ''}>
                  <HealthCommon
                    isCollapsed={isCollapsedHealth}
                    profile={profile}
                    summaryStep={summaryStep}
                    changeDetailStep={changeStep}
                    show={
                      (detailStep !== 'aboutYou' && detailStep !== 'moreAboutYou') ||
                      summaryStep === 'REVIEW' ||
                      myInfoSelected
                    }
                    detailStep={detailStep}
                    show={
                      reqType !== 'PA' &&
                      reqType !== 'PGP' &&
                      reqType !== 'PGRP' &&
                      reqType !== 'PAS' &&
                      reqType !== 'PER' &&
                      !isPATNonSmoker
                    }
                  />
                </div>
                <div className={summaryStep === 'EDIT' ? 'each-section' : ''} style={{ display: isPERdirectEntry ? 'block' : 'none' }}>
                  <PaymentOptionSummary
                    isCollapsed={isCollapsedPayment}
                    profile={profile}
                    summaryStep={summaryStep}
                    changeDetailStep={changeStep}
                    show={
                      (detailStep !== 'aboutYou' &&
                        detailStep !== 'moreAboutYou' &&
                        detailStep !== 'healthAndLifestyle') ||
                      summaryStep === 'REVIEW'
                    }
                    detailStep={detailStep}
                  />
                </div>
                <div
                  id="hideDocUpload"
                  className={summaryStep === 'EDIT' ? 'each-section' : ''}
                  style={{ display: !hideDocUpload ? 'block' : 'none' }}
                >
                  <UploadYourDocumentCommon
                    isCollapsed={isCollapsedUpload}
                    profile={profile}
                    summaryStep={summaryStep}
                    changeDetailStep={changeStep}
                    show={
                      (detailStep !== 'aboutYou' &&
                        detailStep !== 'moreAboutYou' &&
                        detailStep !== 'healthAndLifestyle' &&
                        detailStep !== 'paymentOption' &&
                        summaryStep === 'DETAIL') ||
                      (hideUpload && summaryStep === 'EDIT')
                    }
                    detailStep={detailStep}
                  />
                </div>
              </div>
              <div className="btn-box text-right" style={{ display: summaryStep === 'EDIT' ? 'block' : 'none' }}>
                <button
                  id="btnContinueToReviewSummary"
                  name="continueToReviewSummary"
                  title="continueToReview