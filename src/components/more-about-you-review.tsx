import React from 'react';

type AddressData = {
  postalCode: string;
  blockNo: string;
  streetName: string;
  buildingName: string;
  unitNo: string;
  countryName: string;
  isSingapore: boolean;
};

type InputDetails = {
  label: string;
  value: string;
};

type Props = {
  nationality: string;
  nationalityDesc: string;
  residencyCode: string;
  passType: string;
  profile: {
    identity: number;
  };
  reqType: string;
  myInfoSelected: boolean;
  sectionQ1: string;
  section: string;
  residentialData: AddressData;
  residentialPostalCode: string;
  residentialBlockNo: string;
  residentialStreet: string;
  residentialBuilding: string;
  residentialUnitNo: string;
  residentialCountry: string;
  residentialIsSingapore: boolean;
  setMailingAddress: (type: string) => void;
  mailingData: AddressData;
  mailingPostalCode: string;
  mailingBlockNo: string;
  mailingStreet: string;
  mailingBuilding: string;
  mailingUnitNo: string;
  mailingCountry: string;
  isMailingAddress: boolean;
  mailIsSingapore: boolean;
  setUploadList: () => void;
  mask: string;
  showInputResidential: () => void;
  sectionQ2: string;
  annualIncome: string;
  sectionQ3: string;
  sectionQ4: string;
  isAPSRequired: boolean;
  apsOption: {
    isEdit: boolean;
    value: boolean;
  };
  apsOptionChange: () => void;
};

const ReviewSummary: React.FC<Props> = ({
  nationality,
  nationalityDesc,
  residencyCode,
  passType,
  profile,
  reqType,
  myInfoSelected,
  sectionQ1,
  section,
  residentialData,
  residentialPostalCode,
  residentialBlockNo,
  residentialStreet,
  residentialBuilding,
  residentialUnitNo,
  residentialCountry,
  residentialIsSingapore,
  setMailingAddress,
  mailingData,
  mailingPostalCode,
  mailingBlockNo,
  mailingStreet,
  mailingBuilding,
  mailingUnitNo,
  mailingCountry,
  isMailingAddress,
  mailIsSingapore,
  setUploadList,
  mask,
  showInputResidential,
  sectionQ2,
  annualIncome,
  sectionQ3,
  sectionQ4,
  isAPSRequired,
  apsOption,
  apsOptionChange,
}) => {
  return (
    <div className="review-summary">
      <div
        className={`common-box-content ${
          !myInfoSelected && reqType === 'PA' && profile.identity === 1 ? 'common-financial-box' : 'common-combine-box'
        }`}
      >
        <form className="content-form" name="moreAboutYouForm" noValidate>
          <div className="summary-more-content common-sub-box">
            <div className="section-title">
              About You
              <a className="pull-right edit-section-link" onClick={vm.editSection} ng-if={vm.isV2UX}>
                EDIT
              </a>
            </div>
            {/* Residency Details */}
            <div className="section-title">Residency details</div>
            {/* Nationality */}
            {profile.identity !== 1 && reqType !== 'PER' && reqType !== 'PC' && reqType !== 'PAT' && !myInfoSelected && (
              <select-edit-review
                label-name="'Nationality'"
                current-value={nationality}
                current-value-desc={nationalityDesc}
                drop-down-list={allNationality}
                current-form="moreAboutYouForm"
                field-name="'nationality'"
                select-mode="'REVIEW'"
                drop-down-key={['option', 'value']}
              ></select-edit-review>
            )}
            {/* Residency Status and Pass type if foreigner */}
            {(reqType === 'PER' || reqType === 'PC' || reqType === 'PAT') && (
              <div className="each-group residency-section">
                <label className="view-form-title"> Nationality</label>
                <p className="view-form-input">{nationalityDesc}</p>
                <label className="view-form-title"> Residency Status</label>
                <p className="view-form-input">{residencyCode}</p>
                {residentialData.residencyCode === 3 && (
                  <div>
                    <label className="view-form-title"> Pass Type </label>
                    <p className="view-form-input">{passType}</p>
                  </div>
                )}
              </div>
            )}
            <div className="each-group">
              {/* Have you lived */}
              <div className="each-group">
                <questions-pru
                  filter-question={sectionQ1}
                  questionnaire-json={allQuestionaire}
                  check-if-kickout={vm.checkIfKickout(qCode)}
                  questionnaire-cat={questionCat}
                  edit-mode={vm.summaryStep === 'EDIT'}
                ></questions-pru>
              </div>
              {/* Were you born in the United States of America? */}
              {/* Which country do you currently live in? */}
              {/* Residential address */}
              <div className="each-group">
                <address-edit-review
                  current-form="moreAboutYouForm"
                  select-mode="'REVIEW'"
                  address-data={residentialData}
                  postal-code={residentialPostalCode}
                  block-no={residentialBlockNo}
                  street-name={residentialStreet}
                  building-name={residentialBuilding}
                  unit-no={residentialUnitNo}
                  country-name={residentialCountry}
                  set-mailing-address={setMailingAddress}
                  is-singapore={residentialIsSingapore}
                  login-status={vm.loginStatus}
                  mask={mask}
                  change-residential-address={showInputResidential}
                ></address-edit-review>
              </div>
              {/* Has your residential address changed */}
              <div className="each-group">
                <questions-pru
                  filter-question={section}
                  questionnaire-json={allQuestionaire}
                  check-if-kickout={vm.checkIfKickout(qCode)}
                  questionnaire-cat={questionCat}
                  edit-mode={vm.summaryStep === 'EDIT'}
                ></questions-pru>
              </div>
              {/* Is this also your mailing address? */}
              {/* PD-1639: change mailing address to editable for login user */}
              <div className="each-group">
                <address-edit-review
                  current-form="moreAboutYouForm"
                  select-mode="'REVIEW'"
                  address-data={mailingData}
                  postal-code={mailingPostalCode}
                  block-no={mailingBlockNo}
                  street-name={mailingStreet}
                  building-name={mailingBuilding}
                  unit-no={mailingUnitNo}
                  country-name={mailingCountry}
                  is-mailing-address={isMailingAddress}
                  is-singapore={mailIsSingapore}
                  set-upload-list={setUploadList}
                  mask={mask}
                  change-residential-address={showInputResidential}
                ></address-edit-review>
              </div>
              {/* PD-1430 Summary Review Page Layout Change */}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewSummary;
