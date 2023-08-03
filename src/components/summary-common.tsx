Sure! Here's the updated code in a React .tsx file using functional components and TypeScript types:

```tsx
import React, { useState } from 'react';

type Profile = {
  type: string;
  dob: string;
  // Add other properties as needed
};

type ValidationResult = {
  // Add validation properties as needed
};

type Props = {
  profile: Profile;
  summaryStep: string;
  validationResult: ValidationResult;
  hideUpload?: boolean;
  hideDocUpload?: boolean;
  editField?: boolean;
  showUpload?: boolean;
  hidePaymentOption?: boolean;
  hasPaymentQ?: boolean;
  isPERdirectEntry?: boolean;
  showIframe?: boolean;
  payUrl?: string;
  warning?: string;
  closeNote?: boolean;
  showError?: boolean;
  showSaveMessage?: boolean;
  firstName?: string;
  updateValidResult: (event: any) => void;
  onChange: (event: any) => void;
  triggerDeclaration: () => void;
  proxyOnClick: () => void;
};

const Summary: React.FC<Props> = ({
  profile,
  summaryStep,
  validationResult,
  hideUpload,
  hideDocUpload,
  editField,
  showUpload,
  hidePaymentOption,
  hasPaymentQ,
  isPERdirectEntry,
  showIframe,
  payUrl,
  warning,
  closeNote,
  showError,
  showSaveMessage,
  firstName,
  updateValidResult,
  onChange,
  triggerDeclaration,
  proxyOnClick,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const getIframeStyle = () => {
    // Add iframe style logic here
  };

  return (
    <div className="summary" id={`${profile.type}-summary`}>
      <div className="summary-content">
        <div className="summary-header">
          <div className="header-title">
            <div className="container visible-lg header-title-normal">{vm.pageTitle}</div>
            <div className="container hidden-lg header-title-normal-mobile">{vm.pageTitle}</div>
          </div>
          {showError && (
            <div className="error-desc container">
              <b>ERROR: </b>Some of the information provided is incomplete or invalid. Please review the fields in red and re-submit your form.
            </div>
          )}
          {!closeNote && (
            <div className="header-waring">
              <div className="container">
                <div>
                  <span className="header-warning-icon"></span> {warning}
                </div>
              </div>
            </div>
          )}
        </div>
        {(profile.type === 'PL' || profile.type === 'PM') && (
          <div className="summary-navbar">
            <div className="container application-summary-container">
              <div className="row">
                {profile.type !== 'PGP' && profile.type !== 'PGRP' && profile.type !== 'PS' && !isSinglePremium && (
                  <>
                    <div className="col-xs-3 col-sm-3 col-md-2 navbar-item complete">
                      <span className="item">
                        <span className="num">1</span>
                        <span className="circle"></span>
                      </span>
                      <span className="name">DETAILS</span>
                    </div>
                    <div className="col-xs-3 col-sm-3 col-md-2 navbar-item active">
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
                {(profile.type === 'PGP' || profile.type === 'PGRP' || profile.type === 'PS' || isSinglePremium) && (
                  <>
                    <div className="col-xs-4 col-sm-4 col-md-3 navbar-item complete">
                      <span className="item">
                        <span className="num">1</span>
                        <span className="circle"></span>
                      </span>
                      <span className="name">DETAILS</span>
                    </div>
                    <div className="col-xs-4 col-sm-4 col-md-3 navbar-item active">
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
        )}
        <div className="summary-content-box">
          <div className="container application-summary-container" style={{ position: 'relative' }}>
            <div className="row">
              <div className="col-md-12 content-title-box">
                {summaryStep === 'EDIT' ? (
                  <>
                    <h1>Here is your pre-filled application, {firstName}.</h1>
                    <h3>Please ensure all the information is correct before continuing</h3>
                  </>
                ) : (
                  <>
                    <h1>Please review your application and the terms and conditions</h1>
                    <h3>You can edit your answers by clicking on the pencil icon</h3>
                    {summaryStep !== 'EDIT' && showSaveMessage && (
                      <div className="content-view-message">
                        Your changes have been saved. Please review your Benefit Illustration, Product Summary and Policy Contract, including any coverage exclusion, as the values, financial information and benefits may have varied from the initial quotation provided to you.
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
            <div className="row">
              <div className="col-md-4 col-md-push-8">
                <PolicyDetailsCommon profile={profile} summaryStep={summaryStep} />
              </div>
              <div className="col-md-8 col-md-pull-4" id="applicationSummaryLeftContents">
                <div className={`common-details-box common-review-box ${isCollapsed ? 'common-application-box' : ''}`}>
                  <div className={`common-box-header ${isCollapsed ? 'isCollapse' : ''}`}>
                    <div className="row">
                      <div className="col-xs-10">
                        <h1>Your application</h1>
                      </div>
                      <div className="col-xs-2">
                        <a className={isCollapsed ? 'isCollapse' : ''} href="#" onClick={toggleCollapse}>
                          <span className={`glyphicon collapse-icon ${isCollapsed ? 'glyphicon-chevron-up' : 'glyphicon-chevron-down'}`}></span>
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className={`bg-content ${isCollapsed ? 'collapsed' : ''}`}>
                    <div className="each-section">
                      <AboutYouReview
                        profile={profile}
                        summaryStep={summaryStep}
                        validationResult={validationResult}
                        onUpdate={updateValidResult}
                        onIddChange={onChange}
                        dob={profile.dob}
                      />
                    </div>
                    {summaryStep === 'REVIEW' && (
                      <div className="each-section">
                        <MoreAboutYouReview
                          profile={profile}
                          hideUpload={hideUpload}
                          summaryStep={summaryStep}
                          validationResult={validationResult}
                          onUpdate={updateValidResult}
                          onIddChange={onChange}
                        />
                      </div