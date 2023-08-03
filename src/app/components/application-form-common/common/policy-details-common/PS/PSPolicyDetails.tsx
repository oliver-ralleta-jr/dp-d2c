import React, { Component } from 'react';
const cx = require('classnames');
import _ from 'lodash';

type PolicyDetailsProps = {
  product: any,
};

type PolicyDetailsState = {
  showBenefits: Boolean,
  showRiderBenefits: Boolean,
  basePaymentFrequency: String,
  riderPaymentFrequency: String,
  discountPercentage: number,
  creditCardEnrollmentEnabled: Boolean,
};
const displayFormatted = (value) => Number(value).toLocaleString(undefined, { maximumFractionDigits: 2 });

class PSPolicyDetails extends Component<PolicyDetailsProps, PolicyDetailsState> {

  constructor(props) {
    super(props);
    const dataStoreService = window['$injector'].get('dataStoreService');
    this.state = {
      showBenefits: false,
      showRiderBenefits: false,
      basePaymentFrequency: dataStoreService.getItem('basePaymentFrequency') || 'Y',
      riderPaymentFrequency: dataStoreService.getItem('riderPaymentFrequency') || 'Y',
      discountPercentage: dataStoreService.getItem('discountPercentage'),
      creditCardEnrollmentEnabled: dataStoreService.getItem('creditCardEnrollmentEnabled'),
    };

    this.showBenefits = this.showBenefits.bind(this);
    this.showRiderBenefits = this.showRiderBenefits.bind(this);
  }

  showBenefits() {
    this.setState({
      showBenefits: !this.state.showBenefits,
    });
  }

  discountView(product) {
    return product.hasDiscount ?
      (
      <div>
        {this.state.creditCardEnrollmentEnabled ?
        <div>
          <div className="info discount-info">
            <p className="info-title">First Year Discount</p>
            {this.state.basePaymentFrequency === 'Y'
            ? <span className="price-tag">-${_.round(product.basic.yearlyPremium - product.basic.discountedPremium, 2)}</span>
            : <span className="price-tag">-${_.round(product.basic.monthlyPremium - (product.basic.monthlyPremium
            * ((100 - this.state.discountPercentage) / 100)), 2)}</span>}
          </div>
        </div>
        : <div className="info discount-info">
          <p className="info-title">Discount</p>
          <span className="price-tag">-${displayFormatted(product.basic.yearlyPremium - product.basic.discountedPremium)} </span>
        </div>}
        </div>
      )
      : null;
  }

  medisaveView(product) {
    return product.isMedisave ?
      (
        <div className="info medisave-info">
          <p className="info-title">Pay by <strong>MediSave</strong></p>
          <span className="price-tag">
            -${product.hasDiscount ? product.basic.payableByDiscountMedisave : product.basic.payableByMedisaveYearly}
          </span>
        </div>
      )
      : null;
  }

  benefitsView(product) {
    const {
      showBenefits,
    } = this.state;

    return showBenefits ?
      (
        <div className="base-more-info">
          <p className="more-info-title">Key Benefits</p>
          <ul className="base-more-info-list">
            {product.summary.details.map(({ text }, dIndex) => (
              <li key={dIndex} dangerouslySetInnerHTML={{ __html: text }} />
            ))}
          </ul>
        </div>
      ) :
      null;
  }

  headerSection() {
    const {
      product,
    } = this.props;

    return (
      <div className="section header-section">
        <div className="header-title">
          <p>
            {product.basic.displayName}
          </p>
        </div>
        <div className="header-info">
          <p>Plan Summary</p>
        </div>
      </div>
    );
  }

  baseSection() {
    const {
      product,
    } = this.props;

    const {
      showBenefits,
    } = this.state;

    const chevronClass = cx([
      'pull-right collapse-icon glyphicon',
      {
        'glyphicon-chevron-up': showBenefits,
      },
      {
        'glyphicon-chevron-down': !showBenefits,
      },
    ]);

    const discountView = this.discountView(product);
    const medisaveView = this.medisaveView(product);
    const benefitsView = this.benefitsView(product);
    return (
      <div className="section base-section">
       {this.state.creditCardEnrollmentEnabled ?
        <div>
          <p className="group-title base-header">
            <img src="assets/images/svg/plan_icon.svg" />
            <span>Your <strong>Base Plan</strong></span>
          </p>
          <div className="info base-info">
            <p className="info-title"> <span className="pru-highlight">PRU</span>Shield {product.basic.displayName}</p>
            {this.state.creditCardEnrollmentEnabled ?
            <span className="price-tag">${this.state.basePaymentFrequency === 'Y' ?
            product.basic.yearlyPremium : product.basic.monthlyPremium}</span>
            : <span className="price-tag">${product.basic.yearlyPremium}</span>}
          </div>
          <div className="info base-payment-frequency">
            <span className="payment-frequency">{this.state.basePaymentFrequency === 'Y' ? 'per year' : 'per month'}</span>
          </div>
        </div>
        :
        <div>
          <p className="group-title">
            Base Plan
            <span className={chevronClass} onClick={this.showBenefits} />
          </p>
          <div className="info base-info">
            <p className="info-title"> <span className="pru-highlight">PRU</span>Shield {product.basic.displayName}</p>
            <span className="price-tag">${product.basic.yearlyPremium}</span>
          </div>
          <div className="info base-info">
            <span className="payment-frequency">{this.state.basePaymentFrequency === 'YEARLY' ? 'per year' : 'per month'}</span>
          </div>
        </div>}
        {discountView}
        {medisaveView}
        {benefitsView}
      </div>
    );
  }

  showRiderBenefits() {
    this.setState({
      showRiderBenefits: !this.state.showRiderBenefits,
    });
  }

  riderDiscountView(product, rider) {
    return rider.hasDiscount ?
      (
        <div>
          {this.state.creditCardEnrollmentEnabled ?
          <div className="info discount-info">
            <p className="info-title">First Year Discount</p>
            <span className="price-tag">-${this.state.riderPaymentFrequency === 'Y' ?
            displayFormatted(rider.yearlyPremium - rider.discountedPremium) :
            displayFormatted(rider.monthlyPremium - (rider.monthlyPremium * ((100 - this.state.discountPercentage) / 100)))} </span>
          </div>
          :
          <div className="info discount-info">
            <p className="info-title">Discount</p>
            <span className="price-tag">-${displayFormatted(rider.yearlyPremium - rider.discountedPremium)} </span>
          </div>}
        </div>
      )
      : null;
  }

  riderAdditionalInfoView(rider) {
    return rider.additionalInfo ?
      (
        <div className="info extra-info">
          <p className="info-title">
            <span className="mark">{rider.highlightInfo || null}</span>
            {rider.additionalInfo} <sup>*</sup>
          </p>
          {this.state.creditCardEnrollmentEnabled ? null : <span className="price-tag">_</span>}
        </div>
      ) : null;

  }

  riderBenefitsView(product, rider) {
    return this.state.showRiderBenefits ?
      (
        <div className="riders-more-info">
          <p className="more-info-title">Key Benefits</p>
          <ul className="riders-more-info-list">
            {rider.benefits.map(({ text, subText }, dIndex) => (
              <li key={dIndex}>
                <span className="benefit-text" dangerouslySetInnerHTML={{ __html: text }} />
                <span className="benefit-sub-text" dangerouslySetInnerHTML={{ __html: subText }} />
              </li>
            ))}
          </ul>
        </div>
      ) : null;

  }

  riderDetails(product) {
    return product.rider.map(rider => {
      const discountView = this.riderDiscountView(product, rider);
      const benefitsView = this.riderBenefitsView(product, rider);
      const additionalInfoView = this.riderAdditionalInfoView(rider);
      const note = 'Get additional 20% savings on your PRUExtra Premier CoPay premium '
      + 'when you have no existing health conditions upon policy inception';
      const noteSection = this.noteSection(note);
      return (
        <div key={rider.displayName}>
          <div className="info rider-info">
            <p className="info-title">
              <span className="pru-highlight">PRU</span>{rider.displayName}
            </p>
            {this.state.creditCardEnrollmentEnabled ?
            <span className="price-tag">${this.state.riderPaymentFrequency === 'Y' ?
            rider.yearlyPremium : rider.monthlyPremium}</span>
            : <span className="price-tag">${rider.yearlyPremium}</span>}
          </div>
          {this.state.creditCardEnrollmentEnabled ? <div className="info rider-payment-frequency">
            <span className="payment-frequency">{this.state.riderPaymentFrequency === 'Y' ? 'per year' : 'per month'}</span>
          </div> : null}
          {discountView}
          {additionalInfoView}
          {benefitsView}
          {this.state.creditCardEnrollmentEnabled ? noteSection : null}
        </div>
      );
    });
  }

  riderSection() {
    const {
      product,
    } = this.props;

    const {
      showRiderBenefits,
    } = this.state;

    const riderDetails = this.riderDetails(product);
    const chevronClass = cx([
      'pull-right collapse-icon glyphicon',
      {
        'glyphicon-chevron-up': showRiderBenefits,
      },
      {
        'glyphicon-chevron-down': !showRiderBenefits,
      },
    ]);
    return product.rider.length > 0 ?
      (
        <div className="section rider-section">
        {this.state.creditCardEnrollmentEnabled ?
          <p className="group-title rider-header">
            <img src="assets/images/svg/plan_icon.svg" />
            <span>Your <strong>Supplementary Plan</strong></span>
          </p>
          :
          <p className="group-title">
            Supplementary Plan
            <span className={chevronClass} onClick={this.showRiderBenefits} />
          </p>}
          {riderDetails}
        </div>
      ) : null;
  }

  riderTotal(product) {
    return product.rider.map(rider => {
      return (
        <div key={rider.displayName}>
          <div className="info rider-info">
            <p className="info-title">Supplementary Plan</p>
            {this.state.creditCardEnrollmentEnabled ?
              this.state.riderPaymentFrequency === 'Y'
              ? <span className="price-tag">${rider.hasDiscount
              ? rider.discountedPremium : rider.yearlyPremium}</span>
            : <span className="price-tag">${rider.hasDiscount
            ? _.round((rider.monthlyPremium * ((100 - this.state.discountPercentage) / 100)), 2)
            : rider.monthlyPremium}</span>
            : <span className="price-tag">${rider.yearlyPremium}</span>}
          </div>
          <div className="info rider-payment-frequency">
            <p className="payment-frequency">{this.state.riderPaymentFrequency === 'Y' ? 'Yearly Premium' : 'Monthly Premium'}</p>
            <p className="base-discount">for the first year</p>
          </div>
          <hr/>
        </div>
      );
    });
  }

  totalSection() {
    const {
      product,
    } = this.props;
    const riderTotal = this.riderTotal(product);
    return (
      <div className="section total-section">
        {this.state.creditCardEnrollmentEnabled ?
        <div>
        <p className="group-title total-header">
          <img src="assets/images/svg/plan_icon.svg" />
          <span>Your <strong>Premium Total</strong></span>
        </p>
        <div className="info base-info">
          <p className="info-title">Base Plan</p>
          {this.state.creditCardEnrollmentEnabled ?
            this.state.basePaymentFrequency === 'Y'
            ? <span className="price-tag">${this.state.discountPercentage > 0
            ? product.basic.discountedPremium : product.basic.yearlyPremium}</span>
          : <span className="price-tag">${this.state.discountPercentage > 0
          ? _.round(product.basic.monthlyPremium * ((100 - this.state.discountPercentage) / 100), 2)
          : product.basic.monthlyPremium}</span>
          : <span className="price-tag">${product.basic.yearlyPremium}</span>}
        </div>
        <div className="info base-payment-frequency">
          <p className="payment-frequency">{this.state.basePaymentFrequency === 'Y' ? 'Yearly Premium' : 'Monthly Premium'}</p>
          <p className="base-discount">for the first year</p>
        </div>
        <div>
          {this.state.creditCardEnrollmentEnabled && product.isMedisave ?
          <div className="info medi-info">
            <span>
              <p>Total Premium</p>
              <span className="medi-label">
                <span className="suffix-text">(without Medisave Payable)</span>
              </span>
            </span>
            <span className="price-tag">
              <p>${product.totalYearlyPremium}</p>
              <span className="suffix-text">per year</span>
            </span>
          </div> : null}
        </div>
        <hr/>
        {riderTotal}
        </div>
        :
        <div className="info total-info">
          <span className="info-title">
            <h4>Total Premium<sup>**</sup></h4>
            {product.isMedisave ? <span className="suffix-text">(without Medisave Payable)</span> : null}
          </span>
          <span className="price-tag">
            <h4>${product.totalYearlyPremium}</h4>
            <span className="suffix-text">per year</span>
          </span>
        </div>}
      </div>
    );
  }

  payableSection() {
    const {
      product,
    } = this.props;
    const priceView = (product.hasDiscount  ||
      (product.rider && product.rider.length > 0 && product.rider[0].hasDiscount)) ?
      (
        <span className="price-tag">
          {this.state.creditCardEnrollmentEnabled ?
          <p>${product.payableByCreditcardYearlyDiscounted.toFixed(2)}</p>
          : <h4>${product.payableByCreditcardYearlyDiscounted.toFixed(2)}</h4>}
          <span className="suffix-text">for first year</span>
        </span>
      ) : (
      this.state.creditCardEnrollmentEnabled ?
      (
      <span>
        <p>${product.payableByCreditcardYearly.toFixed(2)}</p>
        <span className="payment-frequency">{this.state.basePaymentFrequency === 'Y' ? 'per year' : 'per month'}</span>
      </span>)
      :
      (
      <span>
        <h4>${product.payableByCreditcardYearly}</h4>
        <span className="suffix-text">per year</span>
      </span>)
      );
    return (
      <div className="section payable-section">
          <div className="info payable-info">
          {this.state.creditCardEnrollmentEnabled ?
            <span className="info-title">
              <p>Total Payable</p>
              <p>by Credit Card Today</p>
            </span>
            :
            <span className="info-title">
              <h4>Payable by Credit Card</h4>
              {product.hasDiscount ||
              (product.rider && product.rider.length > 0 && product.rider[0].hasDiscount) ?
              <span className="suffix-text">(after discount)</span> : null}
            </span>}
            {!this.state.creditCardEnrollmentEnabled ? priceView : null}
          </div>
          {this.state.creditCardEnrollmentEnabled ? priceView : null}
      </div>
    );
  }

  noteSection(note) {
    const {
      product,
    } = this.props;
    const premierInfo = 'https://www.prudential.com.sg/products/medical/pruextra-premier';
    return (
      this.state.creditCardEnrollmentEnabled ?
      (
      <div className="section note-section">
        <p className="group-title">{note}</p>
      </div>
      )
      :
      (
      product.isConfirmation ? null :
        (
        <div className="section note-section">
        {
          product.rider
            .filter(rider => rider.additionalInfo)
            .map(({ extraInfo }, rIndex) => (
              <div key={rIndex}>
                <p className="group-title">
                  <sup>*</sup>
                  <span dangerouslySetInnerHTML={{ __html: extraInfo }} />
                  <a className="info-more-btn" href={premierInfo} target="_blank">Read more</a>
                </p>
              </div>
            ))
        }
        <p className="group-title"><sup>**</sup> Premiums (inclusive of the prevailing rate of GST) are not guaranteed and will increase as you get older.</p>
        <p className="group-title">Terms and Conditions apply.</p>
      </div>))
    );
  }

  render() {
    const {
      product,
    } = this.props;
    const premiumSummaryClasses = this.state.creditCardEnrollmentEnabled ?
      cx(['ps-premium-summary-cc', product.productName])
      :
      cx(['ps-premium-summary', product.productName]);

    const headerSection = this.headerSection();
    const baseSection = this.baseSection();
    const riderSection = this.riderSection();
    const totalSection = this.totalSection();
    const payableSection = this.payableSection();
    const note = 'Credit Card enrolment required for premium portion in excess '
    + 'of Additional/Medisave withdrawal limit and/or insufficient fund.';
    const noteSection = this.noteSection(note);

    return (
      <div className={premiumSummaryClasses}>
        {this.state.creditCardEnrollmentEnabled ? headerSection : null}
        {baseSection}
        {riderSection}
        {totalSection}
        {payableSection}
        {noteSection}
      </div>
    );
  }
}

export default PSPolicyDetails;
