module.exports = {
  template: require('./payment-option-summary.html'),
  controller: paymentOptionSummaryController,
  controllerAs: 'vm',
  bindings: {
    profile: '<',
    showCollapse: '<',
    hideUpload: '=',
    summaryStep: '<',
    detailStep: '<',
    changeDetailStep: '&',
    isCollapsed: '<',
  }
};

/** @ngInject */
function paymentOptionSummaryController($scope, utils, $uibModal, apiService, dataStoreService, constants) {
  const vm = this;
  vm.reqType = dataStoreService.getItem('reqType');
  vm.product = dataStoreService.getOrderItem('product');
  vm.isSinglePremium = vm.product.basic.isSinglePremium || false;
  vm.isCollapsed = false;
  vm.setStep = setStep;
  vm.nextToUpload = nextToUpload;
  vm.partnerChannel = dataStoreService.getItem('partnerChannel') || 'NML';
  vm.isPerDirectEntry = (vm.reqType === 'PER' && vm.partnerChannel !== constants.channel.UOB);
  /* encryption key*/
  vm.encryptKeyList = ['aboutYou', 'moreAboutYou', 'lifeProfile', 'customerEmail', 'givenName', 'surName', 'mobilePhone', 'phoneIDD', 'phoneCountryCode', 'nricFin', 'clientNumber'];
  vm.encryptSubKeyList = ['surName', 'givenName', 'nricFin', 'idd', 'mobilePhone', 'phoneIDD', 'phoneCountryCode', 'nric', 'customerEmail', 'mailingUnitNo', 'mailingStreetName', 'mailingBuildingName', 'mailingBlockNo', 'mailingPostalCode', 'residentialUnitNo',
    'residentialStreetName', 'residentialBuildingName', 'residentialBlockNo', 'residentialPostalCode', 'residentialCountry', 'mailingCountry', 'nationality'
  ];
  vm.encryptionLength = vm.encryptKeyList.length;
  vm.errorMsg = '';
  vm.configs = [
    {
      label: constants.paymentQ.card.label,
      value: constants.paymentQ.card.value,
      details: '',
    },
    {
      label: constants.paymentQ.cash.label,
      value: constants.paymentQ.cash.value,
      details: '',
    },
    {
      label: constants.paymentQ.srs.label,
      value: constants.paymentQ.srs.value,
      details: `<b>What is Supplementary Retirement Scheme ("SRS")?</b></br>
      The SRS is a savings scheme that complements your CPF savings for retirement. Participation is voluntary and you can contribute any amount to this account, subject to the annual SRS contribution cap.</br>
      </br>
      <b>Benefits of SRS</b></br>
      You can enjoy tax deferment on your SRS contributions. Please consult with your tax advisor for further information.</br>
      </br>
      Your SRS funds can be used to invest in financial assets such as shares which are listed on the Singapore Exchange, bonds, unit trusts, fixed deposits or insurance.</br>
      </br>
      <b>Do not have an SRS account?</b></br>
      Don't worry. Prudential can help you open an account as part of your application. Once your application has been successfully submitted, one of our friendly consultants will get in touch with you.`
    },
  ];
  vm.perPaymentConfig = [
    {
      label: constants.perPaymentQ.card.label,
      value: constants.perPaymentQ.card.value,
      details: '',
    },
    {
      label: constants.perPaymentQ.cash.label,
      value: constants.perPaymentQ.cash.value,
      details: '',
    }
  ];
  vm.showToolTip = constants.paymentQ.srs.value;
  vm.openTooltipUncheck = false;

  const handleOptions = (options, isSinglePremium) => {
    const result = [...options];
    // eslint-disable-next-line
    isSinglePremium
      ? result.splice(0, 1)
      : result.splice(2, 1);
    return result;
  };

  vm.options = handleOptions(vm.configs, vm.isSinglePremium);

  // PACSDP-713 PAS SRS questionaire compatibility (QMAY036)
  // SRS Yes: QMAY03601
  // SRS Intend to open bank account: QMAY03602
  const paymentMethod = dataStoreService.getOrderItem('paymentQ');
  // radio input prefill logic
  const prefill = (pMethod, isSinglePremium) => {
    let initPaymentOption = '';
    switch (pMethod) {
      case constants.paymentQ.srs.key:
      case constants.paymentQ.intend.key: // intend will be regard as SRS prefill
        initPaymentOption = isSinglePremium
          ? constants.paymentQ.srs.value
          : vm.options[0].value;
        break;
      case constants.paymentQ.cash.key:
        initPaymentOption = isSinglePremium
          ? constants.paymentQ.cash.value
          : vm.options[0].value;
        break;
      default:
        initPaymentOption = vm.options[0].value;
        break;
    }
    return initPaymentOption;
  };

  vm.initPaymentOption = prefill(paymentMethod, vm.isSinglePremium);
  vm.onChangeHandler = (e) => {
    if (vm.product) {
      vm.product.paymentOption = e;
      dataStoreService.setOrderItem('product', vm.product);
    }

    // 'paymentQ' handling
    // 'paymentQ' is for displaying payment-way in confirmation
    // base on the conditions - cash, srs, intend.
    if (vm.reqType !== 'PER') {
      if (e !== constants.paymentQ.card.value) {
        let paymentQ;
        Object.keys(constants.paymentQ).forEach((key) => {
          if (constants.paymentQ[key].value === e) {
            paymentQ = key.toUpperCase();
          }
        });
        // if the customer selected 'INTEND' via the questionaire previously.
        if (paymentQ === constants.paymentQ.srs.key && paymentMethod === constants.paymentQ.intend.key) {
          paymentQ = constants.paymentQ.intend.key;
        }
        dataStoreService.setOrderItem('paymentQ', paymentQ);
      }
    } else if (vm.isPerDirectEntry) {
      const keys = Object.keys(constants.perPaymentQ);
      let perPaymentQ;
      for (const key of keys) {
        if (constants.perPaymentQ[key].value === e) {
          perPaymentQ = key.toUpperCase();
        }
      }
      dataStoreService.setOrderItem('perPaymentQ', perPaymentQ);
    }
  };

  function setStep() {
    vm.isCollapsed = !vm.isCollapsed;
    if (!vm.isCollapsed && vm.summaryStep === constants.step.detail) {
      vm.changeDetailStep({
        $event: {
          detailStep: constants.section.paymentOption
        }
      });
    }
  }
  function nextToUpload() {
    const aboutYouDetails = dataStoreService.getOrderItem('aboutYouDetails');
    const moreAboutYouDetails = dataStoreService.getOrderItem('moreAboutYouDetails');
    const QMAYData = dataStoreService.getOrderItem('QMAYData') || dataStoreService.session.getObject('QMAYData');
    const QPSData = dataStoreService.getOrderItem('QPSData') || dataStoreService.session.getObject('QPSData');
    const healthDetails = dataStoreService.getOrderItem('healthDetails');
    let paymentQuestion = constants.questionnairePaymentType;
    const paymentSelected = dataStoreService.getOrderItem('perPaymentQ').toLowerCase();
    paymentQuestion.answer.value = paymentQuestion.answer.label = constants.perPaymentQ[paymentSelected].label;
    QMAYData.push(paymentQuestion);
    const saveAllRequest = {
      customId: vm.profile.customID,
      productType: vm.reqType,
      surName: aboutYouDetails.surName,
      givenName: aboutYouDetails.givenName,
      nricFin: aboutYouDetails.nricFin,
      idd: aboutYouDetails.idd,
      phoneIDD: aboutYouDetails.phoneIDD,
      phoneCountryCode: aboutYouDetails.phoneCountryCode,
      mobilePhone: `${aboutYouDetails.idd}${aboutYouDetails.mobilePhone}`, // fix PD-1485:Mobile number country code error
      clientNumber: dataStoreService.getItem('clientNumber') || null,
      gender: aboutYouDetails.gender,
      nationality: moreAboutYouDetails.nationality,
      dob: aboutYouDetails.dob,
      customerEmail: aboutYouDetails.customerEmail,
      mailingUnitNo: moreAboutYouDetails.mailingUnitNo,
      mailingStreetName: moreAboutYouDetails.mailingStreetName || moreAboutYouDetails.foreignMailStreet,
      mailingBuildingName: moreAboutYouDetails.mailingBuildingName,
      mailingBlockNo: moreAboutYouDetails.mailingBlockNo,
      mailingPostalCode: moreAboutYouDetails.mailingPostalCode || moreAboutYouDetails.foreignMailPostcode,
      residentialUnitNo: moreAboutYouDetails.residentialUnitNo,
      residentialStreetName: moreAboutYouDetails.residentialStreetName || moreAboutYouDetails.foreignStreet,
      residentialBuildingName: moreAboutYouDetails.residentialBuildingName,
      residentialBlockNo: moreAboutYouDetails.residentialBlockNo,
      residentialPostalCode: moreAboutYouDetails.residentialPostalCode || moreAboutYouDetails.foreignPostcode,
      residentialCountry: moreAboutYouDetails.residentialCountry,
      residencyStatus: moreAboutYouDetails.residencyStatus,
      mailingCountry: moreAboutYouDetails.mailingCountry,
      annualIncome: moreAboutYouDetails.annualIncome,
      height: healthDetails ? healthDetails.height : 0,
      weight: healthDetails ? healthDetails.weight : 0,
      qmayQuestionnaires: JSON.stringify(QMAYData),
      qpsQuestionnaires: JSON.stringify(QPSData),
      requestFinancialConsultant: 'false'
    };
    vm.saveEncryptionRequest = angular.copy(saveAllRequest);
    apiService.encryption(`count=${vm.encryptionLength}`).then(function (res) {
      var random = res.data.random;
      var publicKey = res.data.rsaPublicKey;
      vm.saveEncryptionRequest = utils.setEncryptionList(vm.saveEncryptionRequest, publicKey, random, vm.encryptSubKeyList);
      return apiService.saveAllCustomerInputInfo(vm.saveEncryptionRequest);
    }).then(function () {
      vm.changeDetailStep({
        $event: {
          detailStep: constants.section.uploadDocument
        }
      });
      vm.isCollapsed = true;
    }).catch(function (error) {
      throw error;
    });
  }

  vm.$onInit = () => {
    if (vm.reqType !== 'PER') {
      vm.product.paymentOption = vm.initPaymentOption;
    } else if (vm.isPerDirectEntry) {
      vm.product.paymentOption = vm.perPaymentConfig[0].value;
      dataStoreService.setOrderItem('perPaymentQ', constants.perpaymentQMethod.card);
    }
    dataStoreService.setOrderItem('product', vm.product);
  };
}
