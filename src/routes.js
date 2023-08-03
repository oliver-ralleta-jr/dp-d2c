module.exports = routesConfig;

/** @ngInject */
function routesConfig($stateProvider, $urlRouterProvider, $locationProvider) {
  $locationProvider.html5Mode(true).hashPrefix('!');
  $urlRouterProvider
    .otherwise('/landing');

  // [state, url, component, parms]
  let components = [
    ['app', '/', 'app'],
    ['app.landing', 'landing', 'landing'],
    ['app.estimation', 'estimation', 'estimation'],
    ['app.confirmation', 'confirmation', 'confirmation'],
    ['app.confirmationPas', 'confirmation_pas', 'confirmationPas'],
    ['app.confirmationPtv', 'confirmation_ptv', 'confirmationPtv'],
    ['app.confirmationNonPayment', 'confirmation_non', 'confirmationNonPayment'],
    ['app.paymentError', 'payment_error', 'paymentError'],
    ['app.paymentReturn', 'payment_return', 'paymentReturn'],
    ['app.paEntry', 'pa_entry', 'entry'],
    ['app.patEntry', 'pat_entry', 'entry'],
    ['app.pcEntry', 'pc_entry', 'entry'],
    ['app.psEntry', 'ps_entry', 'entry', { channelCode: '' }],
    ['app.pfcEntry', 'pfc_entry', 'entry'],
    ['app.etEntry', 'et_entry', 'entry'],
    ['app.ptEntry', 'pt_entry', 'entry'],
    ['app.manEntry', 'pm_entry', 'entry'],
    ['app.ladyEntry', 'pl_entry', 'entry'],
    ['app.ptvEntry', 'ptv_entry', 'entry'],
    ['app.pgpEntry', 'pgp_entry', 'entry'],
    ['app.pgrpEntry', 'pgrp_entry', 'entry'],
    ['app.pasEntry', 'pas_entry', 'entry'],
    ['app.perEntry', 'per_entry', 'entry'],
    ['app.parwEntry', 'parw_entry', 'entry'],
    ['app.scbprod', 'scbprod', 'entry'],
    ['products', '/products', 'products'],
    ['cyberpay', '/cyberpay', 'cyberpay'],
    ['checkoutForm', '/checkoutForm', 'checkoutForm'],
    ['ddcForm', '/ddcForm', 'ddcForm'],
    ['pdfcontainer', '/pdfcontainer', 'pdfcontainer'],
    ['otpForm', '/otpForm', 'otpForm'],
    ['stepUpForm', '/stepUpForm', 'stepUpForm'],
    ['progressbar', '/progressbar', 'progressbar'],
    ['app.redirectToAgent', 'redirect_to_agent', 'redirectToAgent', { type: '' }],
    ['app.redirectToLeadGen', 'redirect_to_lead_gen', 'redirectToLeadGen'],
    ['app.redirectGetNewAssistance', 'redirect_get_new_assistance', 'redirectGetNewAssistance', { type: '' }],
    ['app.redirectGetHelp', 'redirectGetHelp', 'redirectGetHelp', { type: '', dob: '' }],
    ['app.leadGenThank', 'leadGenThank', 'leadGenThank'],
    ['app.leadGenThankV2', 'leadGenThankV2', 'leadGenThankV2', { subheading: '' }],
    ['app.cancelConfirm', 'cancelConfirm', 'cancelConfirm'],
    ['app.login', 'login', 'login'],
    ['app.shieldAPS', 'shieldAPS', 'shieldAPS', { type: '' }],
    ['app.otpRequest', 'otpRequest', 'otpRequest'],
    ['app.otpChangeNumber', 'otpChangeNumber', 'otpChangeNumber'],
    ['app.requireHelp', 'requireHelp', 'requireHelp'],
    ['app.oneTimePassword', 'oneTimePassword', 'oneTimePassword'],
    ['app.loadingInfo', 'loadingInfo', 'loadingInfo'],
    ['app.policyDetails', 'policyDetails', 'policyDetails'],
    ['app.errorPage', 'errorPage', 'errorPage'],
    ['app.timeOutSelectNO', 'timeOutSelectNO', 'timeOutSelectNO'],
    ['app.timeOut', 'timeOut', 'timeOut'],
    ['app.authentication', 'authentication', 'authentication'],
    ['app.detailsCommon', 'detailsCommon', 'detailsCommon'],
    ['app.summaryCommon', 'summaryCommon', 'summaryCommon'],
    ['app.eligibleProduct', 'eligibleProduct', 'eligibleProduct'],
    ['app.autoCamp', 'autoCamp', 'autoCamp'],
    ['app.edmEntrance', 'edmEntrance', 'autoCamp'],
    ['app.edmSIO', 'edmSIO', 'autoCamp'],
    ['app.unavailablePGP', 'unavailable_pgp', 'unavailablePGP'],
    ['emailToCustomer', '/emailToCustomer', 'emailToCustomer'],
    ['emailToCustomerDE', '/emailToCustomerDE', 'emailToCustomerDE'],
    ['app.leadGenEdm', 'leadGenEdm', 'leadGenEdm'],
    ['app.plmfEntry', 'plmf_entry', 'entry'],
    ['app.redirectToLeadGenPlmf', 'redirect_to_lead_gen_plmf', 'redirectToLeadGenPlmf'],
    ['app.confirmationPlmf', 'confirmation_plmf', 'confirmationPlmf'],
    ['app.healthDeclaration', 'health_declaration', 'healthDeclaration'],
    ['app.needsAnalysis', 'needs_analysis', 'needsAnalysis']
  ];
  let stateControll = $stateProvider;

  for (let c in components) {
    let parms = components[c].length > 3 ? components[c][3] : null;
    let obj = {
      url: components[c][1],
      component: components[c][2]
    };
    parms && Object.defineProperty(obj, 'params', { value: parms, writable: true, enumerable: true, configurable: true });
    stateControll = stateControll.state(components[c][0], obj);
  }
}
