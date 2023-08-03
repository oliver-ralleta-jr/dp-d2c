import React from 'react';

type Props = {
  status: number;
  declaration: string;
  disclaimer: string[];
  scrollMsg: string;
  setStatus: (status: number) => void;
  closeDialog: (status: number) => void;
};

const TermsAndConditions: React.FC<Props> = ({
  status,
  declaration,
  disclaimer,
  scrollMsg,
  setStatus,
  closeDialog,
}) => {
  return (
    <>
      {/* both mobile and desktop */}
      <section id="your-declarations">
        <div className="common-box-header">
          <div>
            <h1>Terms and Conditions</h1>
            <a href="javascript:;" onClick={() => closeDialog(0)}>
              <img src="assets/images/cross.png" alt="Close" />
            </a>
          </div>
        </div>
        <div className="common-box-content">
          <div className="declaration-box">
            <div className="declaration-herder">
              <p>
                Please read the terms and conditions carefully before you complete your application for insurance coverage with Prudential Assurance Company Singapore (Private) Limited ("Prudential"). The terms "application", "application form",
                "proposal" and "proposal form" are used interchangeably and refer to the form completed by you when applying for insurance.
              </p>
            </div>
            <div className="declaration-body" dangerouslySetInnerHTML={{ __html: declaration }}></div>
          </div>
          {/* desktop only */}
          <div className="consent-box">
            <div>
              <h3>Declaration</h3>
              <p>By clicking the "Accept" button below:</p>
              {disclaimer.map((disclaimerItem, index) => (
                <p key={index}>&#x2022; {disclaimerItem}</p>
              ))}
            </div>
            <div>
              <p className="tips">
                Your insurance coverage will not commence until the application has been received and officially accepted by Prudential, premiums have been paid and an official letter indicating commencement of cover has been issued
              </p>
            </div>
            <div>
              <button className="button-accept-desktop" onClick={() => closeDialog(1)}>
                ACCEPT
              </button>
            </div>
          </div>
          <div className="mask-box"></div>
          <div className="scroll-msg-box">
            <a href="javascript:;" className="desktop-scroll-msg">
              Scroll to read on
            </a>
            <a href="javascript:;" id="mobile-scroll-msg" className="mobile-scroll-msg" onClick={() => setStatus(0)}>
              {scrollMsg}
            </a>
          </div>
        </div>
      </section>

      {/* mobile only */}
      {status === 0 && (
        <section id="continue-footer">
          <div className="continue-box">
            <button className="button-continue-mobile" onClick={() => setStatus(1)}>
              CONTINUE
            </button>
          </div>
        </section>
      )}

      {/* mobile only */}
      {status === 1 && (
        <section id="consent-footer">
          <div className="consent-box-mobile">
            <div>
              <p>By clicking the "Accept" button below:</p>
              {disclaimer.map((disclaimerItem, index) => (
                <p key={index}>&#x2022; {disclaimerItem}</p>
              ))}
            </div>
            <div>
              <p className="tips">
                Your insurance coverage will not commence until the application has been received and officially accepted by Prudential, premiums have been paid and an official letter indicating commencement of cover has been issued
              </p>
            </div>
            <div>
              <button className="button-accept-mobile" onClick={() => closeDialog(1)}>
                ACCEPT
              </button>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default TermsAndConditions;
