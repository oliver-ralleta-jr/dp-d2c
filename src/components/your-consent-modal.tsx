import React from 'react';

type ConsentProps = {
  makePayment: () => void;
  closeModal: () => void;
};

const Consent: React.FC<ConsentProps> = ({ makePayment, closeModal }) => {
  return (
    <div className="modal-body your-consent-body">
      <div className="consent-title">Your Consent</div>
      <div className="consent-content">By clicking the "Accept and Continue" button below;</div>
      <div className="consent-content consent-indent">
        <b>&middot;</b>
      </div>
      <div className="consent-content consent-text">
        I understand that I have an obligation to provide responses for this application which are correct and complete as of today. I confirm that I have reviewed and where necessary, updated those answers to correctly and completely reflect information which Prudential can rely on for purposes of this application; and
      </div>
      <br />
      <div className="consent-content consent-indent">
        <b>&middot;</b>
      </div>
      <div className="consent-content consent-text">
        I acknowledge that I have read and understood the cover page, policy illustration and product summary, including any coverage exclusion. I have read, understood, consent to and confirm the contents of the Declarations above. In addition, I understand and agree that (i) any policy issued may not be valid if a material fact is not disclosed in my application; (ii)I should disclose a fact if I am in doubt as to whether that fact is material. I confirm that I am fully satisfied with the information declared in this application.
      </div>
      <div className="consent-content">Your insurance coverage will not commence until the application has been received and officially accepted by Prudential, premiums have been paid and an official letter indicating commencement of cover has been issued.</div>
      <div className="text-center">
        <button type="button" id="acceptBtn" name="acceptBtn" title="acceptBtn" className="btn btn-style" style={{ width: '250px' }} onClick={makePayment}>
          ACCEPT AND CONTINUE
        </button>
        <br />
        <a className="cancel-text cancel-lg-link" id="cancel" name="cancel" title="cancel" href="#" onClick={closeModal}>
          Cancel
        </a>
      </div>
    </div>
  );
};

export default Consent;
