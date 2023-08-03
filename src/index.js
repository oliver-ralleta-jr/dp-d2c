// Modules
import Redux from './app/services/redux-service';

// React Components
import EnquiryBox from './modules/Confirmation/components/EnquiryBox.tsx';
import PSPolicyDetails from './app/components/application-form-common/common/policy-details-common/PS/PSPolicyDetails.tsx';
import PERPolicyDetails from './app/components/application-form-common/common/policy-details-common/PER/PERPolicyDetails.tsx';
import PERIllustration from './app/components/estimation/estimation-per/illustration/PERIllustration.tsx';
import PCPolicyDetails from './app/components/application-form-common/common/policy-details-common/PC/PCPolicyDetails.tsx';
import PATPolicyDetails from './app/components/application-form-common/common/policy-details-common/PAT/PATPolicyDetails.tsx';
import ThankYouPage from './app/components/lead-gen-thank-v2/ThankYouPage.tsx';
import FootNotes from './app/shared/footnotes/footnotes.tsx';
import NeedsAnalysis from './app/components/needs-analysis/NeedsAnalysis.tsx';
import DiscountBanner from './app/components/discount-banner/discount-banner.tsx';
import PlanPanel from './app/components/plan-panel/plan-panel.tsx';

// Angular Components
import redirectToLeadGen from './app/components/redirect-to-lead-gen/redirect-to-lead-gen';
//TODO: Import JQuery from Index JS
// require('jquery');
var angular = require('angular');

require('./assets/javascripts/datetime.js');

const ngRedux = process.env.NODE_ENV === 'test'
  ? require('ng-redux')
  : require('ng-redux').default;
const store = require('./modules/_Cores/store/index.ts').default;

var questionsPruModule = require('./app/shared/questions-pru/index');
var estimationModule = require('./app/components/estimation/index');
var applicationFormCommonModule = require('./app/components/application-form-common/index');
var confirmationModule = require('./app/components/confirmation/index');
var entryTemplateModule = require('./app/template/index');

require('angular-ui-router');
require('angular-ui-bootstrap');
require('ui-select');
/* eslint-disable */
require('ngstorage');
require('swiper');
require('angular-swiper');
/* eslint-disable */
require('polyfill-number');
require('angular-moment-picker');
require('angular-animate');
require('angular-cookies');
require('angular-touch');
require('angular-sanitize');
require('angular-messages');
require('angular-resource');
require('angular-toastr');
require('angular-file-upload');
require('angular-modal-service');
require('angular-scroll');
require('angularjs-slider');
require('pdfjs-dist');
require('downloadjs');
require('angular-svg-round-progressbar');
require('ng-idle');
require('angular-input-masks');
require('angular-date-time-input');
require('angular-popups');
require('bootstrap/dist/js/bootstrap.min.js');

var routesConfig = require('./routes');
var commonConfig = require('./index.config');
var constantsConfig = require('./constants');
var runBlock = require('./index.run');

var main = require('./app/components/main/main');
var landing = require('./app/components/landing/landing');
var header = require('./app/shared/header/header');
var footer = require('./app/shared/footer/footer');
var entry = require('./app/components/entries/entry');
// var paEntry = require('./app/components/entries/pa-entry/pa-entry');
// var psEntry = require('./app/components/entries/ps-entry/ps-entry');
// var etEntry = require('./app/components/entries/et-entry/et-entry');
// var ptEntry = require('./app/components/entries/pt-entry/pt-entry');
var etScbEntry = require('./app/components/entries/et-scb-entry/et-scb-entry');
var ptScbEntry = require('./app/components/entries/pt-scb-entry/pt-scb-entry');
// var manEntry = require('./app/components/entries/man-entry/man-entry');
// var ladyEntry = require('./app/components/entries/lady-entry/lady-entry');
// var pfcEntry = require('./app/components/entries/pfc-entry/pfc-entry');
var ptvEntry = require('./app/components/entries/ptv-entry/ptv-entry');
var pgpEntry = require('./app/components/entries/pgp-entry/pgp-entry');
// var pgrpEntry = require('./app/components/entries/pgrp-entry/pgrp-entry');
var products = require('./app/components/entries/products/products');
var redirectToAgent = require('./app/components/redirect-to-agent/redirect-to-agent');
var redirectGetNewAssistance = require('./app/components/redirect-get-new-assistance/redirect-get-new-assistance');
var redirectGetHelp = require('./app/components/redirect-get-help/redirect-get-help');
var leadGenThank = require('./app/components/lead-gen-thank/lead-gen-thank');
var leadGenThankV2 = require('./app/components/lead-gen-thank-v2/lead-gen-thank-v2');
var eligibleProduct = require('./app/components/eligible-product/eligible-product');
var paymentError = require('./app/components/payment-error/payment-error');
var cancelConfirm = require('./app/components/cancel/cancel');
var cancelModal = require('./app/shared/modal/cancel-modal/cancel-modal');
var csCancelModal = require('./app/shared/modal/cs-cancel-modal/cs-cancel-modal');
var pdfModal = require('./app/shared/modal/pdf-modal/pdf-modal');
var spinner = require('./app/components/spinner/spinner');
var progressbar = require('./app/components/progressbar/progressbar');
var login = require('./app/components/login/login');
var shieldAPS = require('./app/components/shield-aps/shield-aps');
var otpRequest = require('./app/components/otp-request/otp-request');
var requireHelp = require('./app/components/require-help/require-help');
var otpChangeNumber = require('./app/components/otp-changeNumber/otp-changeNumber');
var oneTimePassword = require('./app/components/one-time-password/one-time-password');
var loadingInfo = require('./app/components/loading-info/loading-info');
const errorPage = require('./app/components/error-page/error-page');
var timeOutModal = require('./app/shared/modal/time-out-modal/time-out-modal');
var timeOutSelectNO = require('./app/components/time-out-select-no/time-out-select-no');
var timeOut = require('./app/components/time-out/time-out');
var authentication = require('./app/components/authentication/authentication');
var uploadProgressbar = require('./app/components/upload-progressbar/upload-progressbar');
var consultantModal = require('./app/shared/modal/consultant-modal/consultant-modal');
var howCollectData = require('./app/shared/modal/how-collect-data/how-collect-data');
var footnotes = require('./app/shared/footnotes/footnotes');
var plmfEntry = require('./app/components/entries/plmf-entry/plmf-entry');
var pdfcontainer = require('./app/components/pdfcontainer/pdfcontainer');
var healthDeclaration = require('./app/components/health-declaration/health-declaration');


// cybersource
var cyberpay = require('./app/components/cyberpay/cyberpay');
var checkoutForm = require('./app/components/cyberpay/checkoutForm/checkoutForm');
var otpForm = require('./app/components/cyberpay/otpForm/otpForm');
var ddcForm = require('./app/components/cyberpay/ddcForm/ddcForm');
var stepUpForm = require('./app/components/cyberpay/stepUpForm/stepUpForm');

// Require services
var apiService = require('./app/services/api-service');
var httpInteceptor = require('./app/services/http-inteceptor');
var dataStoreService = require('./app/services/data-store-service');
require('./app/services/angular-smooth-scroll-updated');
var mapService = require('./app/services/map-service');
const agentAndMailService = require('./app/services/agent-mail-service');
const leadGenService = require('./app/services/lead-gen-service');
const errorsService = require('./app/services/errors-service');
const authService = require('./app/services/auth-service');

// Require directives
var isBlurValidation = require('./app/directives/isBlurValidation');
var onlyNumber = require('./app/directives/onlyNumber');
var phoneValidation = require('./app/directives/phoneValidation');
var alphabetValidation = require('./app/directives/alphabetValidation');
var unitnoValidation = require('./app/directives/unitnoValidation');
var iddValidation = require('./app/directives/iddValidation');
var format = require('./app/directives/format');
var ngEnter = require('./app/directives/ngEnter');
// Utils
var utils = require('./app/utils/utils');
var estimationUtils = require('./app/utils/estimation-utils');
var timeoutPopUp = require('./app/utils/timeout/timeoutPopUp');
var getEDMWorkFlow = require('./app/utils/EDM/getEDMWorkFlow');
// #1894: new edm for CRM
var autoCamp = require('./app/components/auto-camp/auto-camp');
// pgp tranche limit less than min value
var unavailablePGP = require('./app/components/unavailable-pgp/unavailable-pgp');
// PD-2238: email template
var emailToCustomer = require('./app/components/email-to-customer/email-to-customer');
var emailToCustomerDE = require('./app/components/email-to-customer/email-to-customer-de');
// PD-2419: add lendgen for EDM
var leadGenEdm = require('./app/components/lead-gen-edm/lead-gen-edm');
var redirectToLeadGenPlmf = require('./app/components/redirect-to-lead-gen/PLMF/redirect-to-lead-gen-PLMF');

// Require stylesheets
require('angular-moment-picker/dist/angular-moment-picker.css');
require('bootstrap/dist/css/bootstrap.min.css');
require('angularjs-slider/dist/rzslider.css');
require('swiper/dist/css/swiper.min.css');
require('./index.scss');

// temp logic for base tag injection (ui-router related)
(() => {
  const baseTag = document.createElement('base');
  const isProduction = process.env.NODE_ENV === 'production';
  baseTag.setAttribute('href', isProduction ? '/d2c/' : '/');
  const firstMetaTag = document.getElementsByTagName('meta')[0];
  document.head.insertBefore(baseTag, firstMetaTag);
})();

// Define angular module
module.exports = angular.module('app', [
  ngRedux,
  entryTemplateModule,
  estimationModule,
  applicationFormCommonModule,
  questionsPruModule,
  confirmationModule,
  'ui.router',
  'ui.bootstrap',
  'ui.select',
  'ngAnimate',
  'ngCookies',
  'ngTouch',
  'ngSanitize', 'ngMessages', 'ngResource', 'toastr', 'datetime', 'angularFileUpload', 'angularModalService', 'rzModule', 'duScroll', 'smoothScroll',
  'moment-picker', 'ngStorage', 'angular-svg-round-progressbar', 'ngIdle', 'ksSwiper', 'ui.utils.masks', 'angular-popups'])
    .config(routesConfig)
    .config(commonConfig)
    .config(($ngReduxProvider) => $ngReduxProvider.provideStore(store))
    .constant('constants', constantsConfig)
    .run(runBlock)

    .component('app', main)
    .component('landing', landing)
    .component('fountainHeader', header)
    .component('fountainFooter', footer)
    .component('entry', entry)
    .component('etScbEntry', etScbEntry)
    .component('ptScbEntry', ptScbEntry)
    .component('ptvEntry', ptvEntry)
    .component('plmfEntry', plmfEntry)
    .component('pgpEntry', pgpEntry)
    .component('products', products)
    .component('redirectToAgent', redirectToAgent)
    .component('redirectToLeadGen', redirectToLeadGen)
    .component('paymentError', paymentError)
    .component('cancelConfirm', cancelConfirm)
    .component('pdfModal', pdfModal)
    .component('spinner', spinner)
    .component('requireHelp', requireHelp)
    .component('progressbar', progressbar)
    .component('loadingInfo', loadingInfo)
    .component('cancelModal', cancelModal)
    .component('csCancelModal', csCancelModal)
    .component('login', login)
    .component('shieldAPS', shieldAPS)
    .component('otpChangeNumber', otpChangeNumber)
    .component('otpRequest', otpRequest)
    .component('oneTimePassword', oneTimePassword)
    .component('errorPage', errorPage)
    .component('timeOutModal', timeOutModal)
    .component('timeOutSelectNO', timeOutSelectNO)
    .component('timeOut', timeOut)
    .component('authentication', authentication)
    .component('uploadProgressbar', uploadProgressbar)
    .component('consultantModal', consultantModal)
    .component('howCollectData', howCollectData)
    .component('redirectGetNewAssistance', redirectGetNewAssistance)
    .component('redirectGetHelp', redirectGetHelp)
    .component('leadGenThank', leadGenThank)
    .component('leadGenThankV2', leadGenThankV2)
    .component('eligibleProduct', eligibleProduct)
    .component('footnotes', footnotes)
    .component('autoCamp', autoCamp)
    .component('unavailablePGP', unavailablePGP)
    .component('emailToCustomer', emailToCustomer)
    .component('emailToCustomerDE', emailToCustomerDE)
    .component('leadGenEdm', leadGenEdm)
    .component('cyberpay', cyberpay)
    .component('checkoutForm', checkoutForm)
    .component('ddcForm', ddcForm)
    .component('pdfcontainer', pdfcontainer)
    .component('otpForm', otpForm)
    .component('stepUpForm', stepUpForm)
    .component('healthDeclaration', healthDeclaration)

    .component('reactEnquiryBox', r2a.react2angular(
      EnquiryBox,
      ['enquiryHeading', 'enquirySubheading', 'financialConsultant', 'businessName', 'mobileNumber', 'id', 'testId', 'className', 'isDpiProduct', 'partnerChannel']))
    .component('psPolicyDetails', r2a.react2angular(PSPolicyDetails, ['product']))
    .component('perPolicyDetails', r2a.react2angular(PERPolicyDetails, ['product','channel','paymentSelected','currentStep','onViewIllustration']))
    .component('perIllustration', r2a.react2angular(PERIllustration, ['product']))
    .component('pcPolicyDetails', r2a.react2angular(PCPolicyDetails, ['product','channel','currentStep','paymentGateway','discount','discountPercentage']))
    .component('patPolicyDetails', r2a.react2angular(PATPolicyDetails, ['product','channel','currentStep','paymentGateway','discount','discountPercentage']))
    .component('thankYouPage', r2a.react2angular(ThankYouPage, ['pageDetails', 'onChangeNumber', 'partnerChannel']))
    .component('footNotes', r2a.react2angular(FootNotes, ['header', 'message']))
    .component('needsAnalysis', r2a.react2angular(NeedsAnalysis))
    .component('discountBanner', r2a.react2angular(DiscountBanner, ['hideIcon', 'hasDiscount', 'discountIsStatic', 'discountMessage']))
    .component('planPanel', r2a.react2angular(PlanPanel, ['product', 'planType', 'planTypeName', 'benefits', 'hasMedisave', 'tooltip', 'additionalStyle', 'showSelectButton', 'selectBasePlan', 'selectSupplementaryPlan', 'updateProductInfo', 'downloadSummaryAndContract', 'submitButtonStyle', 'paymentFrequency']))
    .component('redirectToLeadGenPlmf', redirectToLeadGenPlmf)

    .service('Redux', Redux)
    .service('apiService', apiService)
    .service('utils', utils)
    .service('estimationUtils', estimationUtils)
    .service('timeoutPopUp', timeoutPopUp)
    .service('getEDMWorkFlow', getEDMWorkFlow)
    .service('httpInteceptor', httpInteceptor)
    .service('dataStoreService', dataStoreService)
    .service('mapService', mapService)
    .service('agentAndMailService', agentAndMailService)
    .service('leadGenService', leadGenService)
    .service('errorsService', errorsService)
    .service('authService', authService)

    .directive('isBlurValidation', isBlurValidation)
    .directive('onlyNumber', onlyNumber)
    .directive('phoneValidation', phoneValidation)
    .directive('alphabetValidation', alphabetValidation)
    .directive('unitnoValidation', unitnoValidation)
    .directive('iddValidation', iddValidation)
    .directive('format', format)
    .directive('ngEnter', ngEnter)

    .filter('mask', utils.mask)
    .filter('formatCurrency', utils.formatCurrency);
