import React, { useState } from 'react';

type ConsentProps = {
  title: string;
  content: string;
  showCollapse: boolean;
};

const ConsentBox: React.FC<ConsentProps> = ({ title, content, showCollapse }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="consent-box details-common">
      <div className={`common-box-header ${isCollapsed ? 'isCollapse' : ''}`}>
        <div className="row">
          <div className="col-xs-10">
            <h1>{title}</h1>
          </div>
          <div className="col-xs-2" style={{ display: showCollapse ? 'block' : 'none' }}>
            <a className={`isCollapse ${isCollapsed ? 'isCollapse' : ''}`} href="#" onClick={handleCollapse}>
              <span className={`glyphicon collapse-icon ${isCollapsed ? 'glyphicon-chevron-up' : 'glyphicon-chevron-down'}`}></span>
            </a>
          </div>
        </div>
      </div>
      <div className="common-box-content" style={{ display: isCollapsed ? 'none' : 'block' }}>
        <div className="common-main-content">
          <form name="consentForm" noValidate>
            <div className="common-sub-box">
              <div className="checkbox consent-checkbox">
                <input
                  type="checkbox"
                  className="isBlurValidation"
                  id={`${title.replace(/\s/g, '')}Value`}
                  name={`${title.replace(/\s/g, '')}Value`}
                  onChange={() => {}}
                />
                <label htmlFor={`${title.replace(/\s/g, '')}Value`}>{content}</label>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const MedicalReportConsent: React.FC = () => {
  const title = 'Consent for Release of Medical Reports to Prudential';
  const content = `
    I expressly authorize and consent to Prudential, its officers and/or employees extracting my relevant medical information from relevant medical practitioners in order to process any claims in relation to this policy.
    <span>I understand that this consent only allows Prudential to extract medical information strictly in relation to this policy only and only such as is reasonably necessary to process the claim(s).</span>
    <span>I further understand that this consent shall continue to be valid and effective unless I withdraw my consent by informing Prudential in the prescribed manner.</span>
  `;

  return <ConsentBox title={title} content={content} showCollapse={true} />;
};

const MarketingConsent: React.FC = () => {
  const title = 'Marketing Consent';
  const content = `
    I confirm that I have read, understood and given my consent for Prudential Assurance Company Singapore (Pte) Limited and its related corporations, respective representatives, agents, third party service providers, contractors and/or appointed distribution/business partners (collectively referred to as "Prudential and its authorised representatives") to collect, use, disclose and/or process my personal data for the purpose of contacting me about products and services distributed, marketed and/or introduced by Prudential and its authorised representatives through marketing activities, via all channels, including but not limited to SMS, social media, in-app push notification, phone call etc, and using my contact details which Prudential and its authorised representatives has in its records from time to time, in accordance to the Prudential's Privacy Notice available at <a href="https://www.prudential.com.sg/Privacy-Notice" target="_blank">https://www.prudential.com.sg/Privacy-Notice</a>.<br><br>If I have any existing Prudential policy(ies) or earlier insurance application, I understand that this consent will supersede my previous consent and any change will take effect 21 days from the date of commencement of cover.
  `;

  return <ConsentBox title={title} content={content} showCollapse={true} />;
};

const App: React.FC = () => {
  return (
    <div>
      <MedicalReportConsent />
      <MarketingConsent />
    </div>
  );
};

export default App;
