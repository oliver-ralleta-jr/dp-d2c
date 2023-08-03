import React, { Component } from 'react';
import ReactTooltip from 'react-tooltip';
const cx = require('classnames');

type PolicyDetailsProps = {
  product: any,
  onViewIllustration: any,
  channel: any,
  currentStep: any,
  paymentSelected: any,
};

type PolicyDetailsState = {
  showBenefits: Boolean,
};

const displayFormatted = (value) => Number(value).toLocaleString(undefined, { maximumFractionDigits: 2 });

class PERPolicyDetails extends Component<PolicyDetailsProps, PolicyDetailsState> {
  constructor(props) {
    super(props);
  }

  headerSection() {
    const {
      product: {
        totalPayout,
        nonGuaranteedPayout,
        sumAssured,
      },
      onViewIllustration,
    } = this.props;
    return (
      <div className="section header-section">
        <ReactTooltip id="payoutInfo" className="payout-tooltip" type="light" place="top">
          <span>
            The illustrated maturity value below uses bonus rates that
            assume an illustrated investment rate of <strong>4.25%</strong> per year.
          </span>
        </ReactTooltip>
        <p className="header-info">
          <span>Potential Returns after 10 years</span>
          <span data-tip={true} data-for="payoutInfo" className="info-tooltip" />
        </p>
        <p className="total-payout price-tag">${displayFormatted(totalPayout)}</p>
        <p className="payout-info">
          Guaranteed payout: <span className="price-tag">${displayFormatted(sumAssured)}</span>
        </p>
        <p className="payout-info">
          Non-guaranteed payout: Up to <span className="price-tag">${displayFormatted(nonGuaranteedPayout)}</span>
        </p>
        <div className="illustration-link" onClick={onViewIllustration}>
          <span className="view-icon" />
          <span>View Illustrated Payout</span>
        </div>
      </div>
    );
  }

  discountView() {
    const {
      product: {
        hasDiscount,
        discountedAmount,
      },
    } = this.props;
    return hasDiscount ? (
      <div className="info discount-info">
        <p className="info-title">Discount for first year</p>
        <span className="price-tag">-${displayFormatted(discountedAmount)}</span>
      </div>
    ) : null;
  }

  benefitsView() {
    const benefits = [
      {
        text: 'Capital guaranteed upon maturity',
      },
      {
        text: 'Comes with Death Benefit coverage<span class="asterisk">*</span>',
      },
    ];
    return (
      <div className="base-more-info">
        <p className="more-info-title">Key Benefits</p>
        <ul className="base-more-info-list">
          {benefits.map(({ text }, dIndex) => (
            <li key={dIndex} dangerouslySetInnerHTML={{ __html: text }} />
          ))}
        </ul>
      </div>
    );
  }

  baseSection() {
    const {
      product: {
        yearlyPremium,
      },
    } = this.props;

    const discountView = this.discountView();
    const benefitsView = this.benefitsView();
    return (
      <div className="section base-section">
        <div className="info base-info">
          <p className="info-title"><span className="pru-highlight">PRU</span>Easy Rewards</p>
          <span className="price-tag">${displayFormatted(yearlyPremium)}</span>
        </div>
        {discountView}
        {benefitsView}
      </div>
    );
  }

  totalSection() {
    const {
      product: {
        yearlyPremium,
        discountedPremium,
      },
    } = this.props;

    return (
      <div className="section total-section">
        <div className="info total-info">
          <span className="info-title">
            <h4>First Year Premium</h4>
            <span className="suffix-text">(after Discount)</span>
          </span>
          <span className="price-tag">
            <h4>${displayFormatted(discountedPremium)}</h4>
            <span className="suffix-text" />
          </span>
        </div>
        <div className="info total-info">
          <span className="info-title">
            <h4>Second and Third Year Premium</h4>
            <span className="suffix-text" />
          </span>
          <span className="price-tag">
            <h4>${displayFormatted(yearlyPremium)}</h4>
            <span className="suffix-text" />
          </span>
        </div>
      </div>
    );
  }

  payableSection() {
    const {
      product: {
        hasDiscount,
        discountedPremium,
        yearlyPremium,
        isConfirmation,
      },
      channel,
      currentStep,
      paymentSelected,
    } = this.props;
    const uobLink = 'https://pib.uob.com.sg/PIBLogin/Public/processPreCapture.do?keyId=lpc&shortcutId=BPY';
    const paymentLink = isConfirmation ? (
      <div className="info payment-info">
        {(channel === 'UOB') ?
        (<a className="btn btn-block primary-btn" href={uobLink} target="_blank">PAY NOW</a>)
        : null}
      </div>
    ) : null;

    return (
      <div className="section payable-section">
        <div className="info payment-method-info">
          <p className="info-title">Payment Method  </p>
          {(channel === 'UOB') ?
            (<div className="uob-payment">
                    <span className="uob-icon" />
                    <p className="payment-info">
                        Payment can be made via UOB Internet Banking / Current or Savings Account
                    </p>
            </div>) :
            (<div className="uob-payment">
            { (currentStep !== 'REVIEW' && currentStep !== 'CONFIRMATION') ?
                (
                  <p className="payment-info">
                    Payment can be done via Visa / MasterCard or iBanking, FAST (Fast and Secure Transfers) , Cheque
                  </p>
                ) :
                (
                <div>
                 { (paymentSelected === 'CASH') ?
                  (<p className="payment-info"> Payment is done via iBanking, FAST (Fast and Secure Transfers) , Cheque </p>) :
                  (<p className="payment-info extra-margin"> Payment is done via Visa / MasterCard </p>)
                 }
                 </div>
                )
           }
            </div>)
          }
        </div>
        <div className="info payable-info">
          <span className="info-title">
            <h4>You Pay</h4>
          </span>
          <span className="price-tag">
            <h4>${hasDiscount ?
              displayFormatted(discountedPremium) :
              displayFormatted(yearlyPremium)}</h4>
            <span className="suffix-text">for first year</span>
          </span>
        </div>
        {paymentLink}
      </div >
    );
  }

  render() {
    const {
      product: {
        hasDiscount,
        productName,
      },
    } = this.props;
    const premiumSummaryClasses = cx([
      'per-premium-summary',
      productName,
    ]);

    const headerSection = this.headerSection();
    const baseSection = this.baseSection();
    const totalSection =  hasDiscount ? this.totalSection() : null;
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

export default PERPolicyDetails;
