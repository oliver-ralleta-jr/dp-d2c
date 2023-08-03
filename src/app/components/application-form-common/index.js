// common components
var angular = require('angular');

// pages
var detailsCommon = require('./pages/details-common/details-common');
var summaryCommon = require('./pages/summary-common/summary-common');

// common components
var aboutYouCommon = require('./common/about-you-common/about-you-common');
var moreAboutYouCommon = require('./common/more-about-you-common/more-about-you-common');
var policyDetailsCommon = require('./common/policy-details-common/policy-details-common');
var healthCommon = require('./common/health-common/health-common');
var uploadYourDocumentCommon = require('./common/upload-your-document-common/upload-your-document-common');
var whatYouBuyingCommon = require('./common/what-you-buying-common/what-you-buying-common');
var yourConsentCommon = require('./common/your-consent-common/your-consent-common');
var paymentOptionCommon = require('./common/payment-option-common/payment-option-common');
const paymentOptionReview = require('./common/payment-option-review/payment-option-review');
// PACSDP-644
const paymentOptionSummary = require('./common/payment-option-summary/payment-option-summary');
// Task 1350: more about you review-edit mode
var moreAboutYouReview = require('./common/more-about-you-review/more-about-you-review');
var uploadYourDocumentReview = require('./common/upload-your-document-review/upload-your-document-review');
var selectEditReview = require('./common/utils/select/select-edit-review');
var radioEditReview = require('./common/utils/radio/radio-edit-review');
var addressEditReview = require('./common/utils/address/address-edit-review');
var healthReview = require('./common/health-review/health-review');

const yourDeclarationsCommon = require('./common/your-declarations-common/your-declarations-common');

var applicationFormCommonModule = 'applicationFormCommon';

// PD-1349 About You Common Component
var aboutYouReview = require('./common/about-you-review/about-you-review');

// Common Control
var inputReview = require('./common/utils/input/input-review');
var phoneInput = require('./common/utils/phoneInput/phone-input');
var dobInput = require('./common/utils/dobInput/dob-input');
var genderSelect = require('./common/utils/genderSelect/gender-select');

// PD-2056 Legal Updates for All Products
var yourConsentModal = require('./pages/summary-common/modal/your-consent-modal');

module.exports = applicationFormCommonModule;

angular.module(applicationFormCommonModule, [])
  .component('detailsCommon', detailsCommon)
  .component('aboutYouCommon', aboutYouCommon)
  .component('moreAboutYouCommon', moreAboutYouCommon)
  .component('policyDetailsCommon', policyDetailsCommon)
  .component('healthCommon', healthCommon)
  .component('uploadYourDocumentCommon', uploadYourDocumentCommon)
  .component('whatYouBuyingCommon', whatYouBuyingCommon)
  .component('yourDeclarationsCommon', yourDeclarationsCommon)
  .component('yourConsentCommon', yourConsentCommon)
  .component('paymentOptionCommon', paymentOptionCommon)
  .component('paymentOptionReview', paymentOptionReview)
  .component('paymentOptionSummary', paymentOptionSummary)
// PD-1349 About You Common Component
  .component('aboutYouReview', aboutYouReview)
  .component('inputReview', inputReview)
  .component('phoneInput', phoneInput)
  .component('dobInput', dobInput)
  .component('genderSelect', genderSelect)
// Task 1350: more about you review-edit mode
  .component('moreAboutYouReview', moreAboutYouReview)
  .component('uploadYourDocumentReview', uploadYourDocumentReview)
  .component('radioEditReview', radioEditReview)
  .component('selectEditReview', selectEditReview)
  .component('addressEditReview', addressEditReview)
  .component('healthReview', healthReview)
// PD-2056 Legal Updates for All Products
  .component('yourConsentModal', yourConsentModal)

// summaryCommon
  .component('summaryCommon', summaryCommon);
