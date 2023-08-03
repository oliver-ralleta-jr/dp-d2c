import React, { Component } from 'react';
const cx = require('classnames');

type PolicyDetailsProps = {
  product: any,
  currentStep: any,
  channel: any,
  paymentGateway: any,
  discount: boolean,
  discountPercentage: any,
};

type PolicyDetailsState = {
  showBenefits: Boolean,
};

const displayFormatted = (value) => Number(value).toLocaleString(undefined, { maximumFractionDigits: 2 });

class PATPolicyDetails extends Component<PolicyDetailsProps, PolicyDetailsState> {
  constructor(props) {
    super(props);
  }

  benefitsView() {
    const benefits = [
      {
        text: 'Coverage up till age 100 <sup>3</sup>',
      },
      {
        text: 'Hassle-free, easy application',
      },
      {
        text: 'Affordable, customisable protection<sup>1</sup>',
      },
      {
        text: 'Full PAT coverage <sup>2</sup>',
      },
      {
        text: '100% payout for all PAT stages',
      },
    ];
    return (
      <div className="header-more-info">
        <p className="header-info-title">Key Benefits</p>
        <ul className="header-more-info-list">
          {benefits.map(({ text }, dIndex) => (
            <li key={dIndex} dangerouslySetInnerHTML={{ __html: text }} />
          ))}
        </ul>
      </div>
    );
  }

  headerSection() {
    return (
      <div className="section header-section">
        <div className="info base-info">
          <p className="info-title"><span className="pru-highlight">PRU</span>Active Term</p>
        </div>
      </div>
    );
  }

  baseSection() {
    const {
      product: {
        sumAssured,
        term,
        discountedPremium,
        totalYearlyPremium,
      },
      discount,
    } = this.props;
    return discount ? (
      <div className="section base-section">
        <p className="payout-info">
          Your quote is <strong>${parseFloat(discountedPremium).toFixed(2)}</strong> yearly for the next
          <strong> {term}</strong> years and your selected sum assured for this plan is
          <strong> ${displayFormatted(sumAssured)}</strong>.
        </p>
      </div>
    ) : (
      <div className="section base-section">
        <p className="payout-info">
        Your quote is <strong>${totalYearlyPremium.toFixed(2)}</strong> yearly for the next
        <strong> {term}</strong> years and your selected sum assured for this plan is
        <strong> ${displayFormatted(sumAssured)}</strong>.
        </p>
      </div>
    );
  }

  payableSection() {
    const {
      paymentGateway,
      currentStep,
    } = this.props;
    return (
      <div className="section payable-section">
        <div className="info payment-method-info">
          <p className="info-title">Payment Method  </p>
          {currentStep === 'CONFIRMATION' && paymentGateway && paymentGateway.tmCCNum ? (
            <div className="card-payment">
              {paymentGateway.tmCCNum.charAt(0) === '4' ? (
                <span className="visa-icon" />
              ) : (
                <span className="master-icon" />
                )}
            </div>
          ) : (
            <div className="card-payment">
              <span className="master-icon" />
              <span className="visa-icon" />
            </div>
          )}
        </div>
      </div >
    );
  }

  render() {
    const {
      product: {
        productName,
      },
    } = this.props;
    const premiumSummaryClasses = cx([
      'pat-premium-summary',
      productName,
    ]);

    const headerSection = this.headerSection();
    const baseSection = this.baseSection();
    const payableSection = this.payableSection();

    return (
      <div className={premiumSummaryClasses}>
        {headerSection}
        {baseSection}
        {payableSection}
      </div>
    );
  }
}

export default PATPolicyDetails;
