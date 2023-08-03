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

class PCPolicyDetails extends Component<PolicyDetailsProps, PolicyDetailsState> {
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
        text: 'Full cancer coverage <sup>2</sup>',
      },
      {
        text: '100% payout for all cancer stages',
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
          <p className="info-title"><span className="pru-highlight">PRU</span>Cancer 360</p>
        </div>
      </div>
    );
  }

  baseSection() {
    const {
      product: {
        yearlyPremium,
        sumAssured,
        term,
        discountedPremium,
      },
      discount,
    } = this.props;
    return discount ? (
      <div className="section base-section">
        <p className="payout-info">
        Your quote is ${discountedPremium}
        <span className="price-tag"> for the first year</span> and then ${yearlyPremium}
        <span className="price-tag"> for the following {term - 1} years</span>.
        </p>
        <br/>
        <p className="payout-info">
        Your selected sum assured for this plan is
        ${displayFormatted(sumAssured)} and <span className="price-tag">renewable </span>
        at the end of every {term} years.
        </p>
      </div>
    ) : (
      <div className="section base-section">
        <p className="payout-info">
        Your quote is ${yearlyPremium} yearly for the
        <span className="price-tag"> next {term} years</span>. Your selected sum assured for this plan is
        ${displayFormatted(sumAssured)} and <span className="price-tag">renewable </span>
        at the end of every {term} years.
        </p>
      </div>
    );
  }

  totalSection() {
    const {
      product,
      discount,
      discountPercentage,
    } = this.props;
    return discount ? (
      <div className="section total-section">
        <div className="info total-info">
          <div className="info-discount">
            <span className="info-discount-title">Discount for first year</span>
            <span className="price-discount-tag">- {discountPercentage} %</span>
          </div>
          <span className="info-title">Total Premium</span>
          <span className="price-tag">
            <h4>${product.discountedPremium}</h4>
          </span>
          <span className="price-tag-metric">for first year</span>
        </div>
      </div>
    ) : (
      <div className="section total-section">
        <div className="info total-info">
          <span className="info-title">
            <h4>Total Premium</h4>
          </span>
          <span className="price-tag">
            <h4>${product.yearlyPremium}</h4>
            <span className="suffix-text">/year</span>
          </span>
        </div>
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
      'pc-premium-summary',
      productName,
    ]);

    const headerSection = this.headerSection();
    const baseSection = this.baseSection();
    const totalSection = this.totalSection();
    const payableSection = this.payableSection();

    return (
      <div className={premiumSummaryClasses}>
        {headerSection}
        {baseSection}
        {totalSection}
        {payableSection}
      </div>
    );
  }
}

export default PCPolicyDetails;
