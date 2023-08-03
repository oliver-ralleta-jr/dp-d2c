module.exports = {
  template: require('./details-common.html'),
  controller: DetailsCommonController,
  controllerAs: 'vm',
};

/** @ngInject */
function DetailsCommonController(dataStoreService, $scope, $ngRedux, $rootScope, $state, $timeout, apiService, constants, utils, Idle, $uibModal, timeoutPopUp, $window) {
  var vm = this;

  var customerInfo;
  vm.detailStep = constants.section.aboutYou;
  /* component switch*/
  vm.isCollapsedAboutYou = undefined;
  vm.isCollapsedMoreAbout = undefined;
  vm.isCollapsedHealth = undefined;
  vm.isCollapsedUpload = undefined;
  vm.isCollapsedPayment = undefined;
  /* encryption key*/
  vm.encryptKeyList = ['aboutYou', 'moreAboutYou', 'lifeProfile', 'customerEmail', 'givenName', 'surName', 'mobilePhone', 'phoneIDD', 'phoneCountryCode', 'nricFin', 'clientNumber'];
  vm.encryptSubKeyList = ['surName', 'givenName', 'nricFin', 'idd', 'mobilePhone', 'phoneIDD', 'phoneCountryCode', 'nric', 'customerEmail', 'mailingUnitNo', 'mailingStreetName', 'mailingBuildingName', 'mailingBlockNo', 'mailingPostalCode', 'residentialUnitNo',
    'residentialStreetName', 'residentialBuildingName', 'residentialBlockNo', 'residentialPostalCode', 'residentialCountry', 'mailingCountry', 'nationality'
  ];
  vm.encryptionLength = vm.encryptSubKeyList.length;
  /* summary validation flag*/
  $rootScope.aboutYou = false;
  $rootScope.moreAboutYou = false;
  $rootScope.healthAndLifestyle = false;
  $rootScope.assignConsultant = true;

  /* function declaration*/
  vm.validateData = validateData;
  vm.changeStep = changeStep;
  vm.openCancelModal = openCancelModal;
  vm.consultantAndSendMail = consultantAndSendMail;

  // Bug 1762: Field validation error message not appearing
  vm.showError = false;

  vm.purpose = 'MyInfo';
  vm.showMyInfoBanner = false;
  vm.showMyInfoError = false;
  vm.showResAddChanged = true;
  vm.authCodeAndState = undefined;
  vm.details = {};
  vm.handleSubmit = handleSubmit;
  vm.showMyInfoBannerError = false;
  vm.myInfoSelected = false;
  vm.myInfoErrorMessage = '';
  vm.myInfoErrorClass = '';

  // PD-2364 Observation #57: Boundary Condition Handling
  dataStoreService.session.setObject('esubFlag', false);
  const mapStateToProp = ({
    angular: {
      isV2UX
    }
  }) => {
    return {
      isV2UX
    };
  };
  $ngRedux.connect(mapStateToProp)(vm);

  vm.$onInit = function () {
    $scope.$broadcast('myInfoSelected', false);
    putDataInSession();
    vm.profile = dataStoreService.session.getObject('profile');
    vm.channel = dataStoreService.getItem('channel');
    vm.fcmobile = vm.profile.preferredFcMobile;
    const partnerChannel = dataStoreService.getItem('partnerChannel');
    vm.reqType = vm.profile.type;
    vm.customer = dataStoreService.getItem('customer');
    vm.loginStatus = dataStoreService.getItem('loginStatus');
    vm.isPERdirectEntry = (vm.reqType === 'PER' && partnerChannel !== constants.channel.UOB);
    vm.isPATSmoker = (vm.reqType === 'PAT' && vm.profile.smoker === 1);
    vm.isPATNonSmoker = (vm.reqType === 'PAT' && vm.profile.smoker === 2);
    vm.isDirectEntryChannelCode = dataStoreService.getItem('isDirectEntryChannelCode');
    vm.showMyInfoBanner = vm.reqType === 'PS'; // PACSDP-5065 removed (!navigator.userAgent.toUpperCase().includes('ANDROID')) to enable button to display in android view
    if (vm.isV2UX) {
      dataStoreService.setItem('appHeaderText', `<strong>${constants.production[vm.reqType].name} Application</strong>`);
    }
    vm.footNote = constants.production[vm.reqType].footNote || '';
    // PACSDP-549: save DOB validation (only for existing customer)
    // EDM-targeted will skip this due to skipping entry, estimation.
    const isTargetEDM = !dataStoreService.session.getValue('isNonTarget') && vm.channel === constants.channel.EDM;
    if (vm.reqType === constants.production.PAS.shortName
      && !isTargetEDM
      && !dataStoreService.getItem('dobValidation:PAS')
      && vm.loginStatus
      && (vm.customer && vm.customer.dateOfBirth)
    ) {
      const prevDOB = dataStoreService.getItem('entryDOB');
      const dobValidationPas = prevDOB === vm.customer.dateOfBirth;
      dataStoreService.setItem('dobValidation:PAS', dobValidationPas); // boolean

      // todo: check which dob must be prefilled
      vm.profile.dob = prevDOB;
      dataStoreService.session.setObject('prefillFields', vm.profile);

      if (!dobValidationPas) {
        dataStoreService.setItem('dobValidationError', true);
        return $state.go('app.pasEntry');
      }

      dataStoreService.setItem('dobValidationError', false);
    } else if ((vm.reqType === constants.production.PER.shortName || vm.reqType === constants.production.PC.shortName
      || vm.reqType === constants.production.PA.shortName || vm.reqType === constants.production.PT.shortName)
      && vm.loginStatus
      && (vm.customer && vm.customer.dateOfBirth && vm.customer.gender)) {
      // dataStoreService.session.setObject('prefillFields', vm.profile);
      // dataStoreService.setItem('dobValidationError', false);
      const prevDOB = dataStoreService.getItem('entryDOB');
      const dobValidationPer = prevDOB === vm.customer.dateOfBirth;
      const prevGender = dataStoreService.getItem('entryGender');
      const genderValidation = prevGender === (vm.customer && vm.customer.gender);
      dataStoreService.setItem('dobValidation:PER', dobValidationPer); // boolean
      dataStoreService.setItem('genderValidation', genderValidation); // boolean

      // todo: check which dob must be prefilled
      vm.profile.dob = prevDOB;
      vm.profile.gender = prevGender;
      dataStoreService.session.setObject('prefillFields', vm.profile);

      if (!dobValidationPer || (prevGender && !genderValidation)) {
        dataStoreService.setItem('dobValidationError', !dobValidationPer);
        if (vm.reqType === constants.production.PC.shortName || vm.reqType === constants.production.PA.shortName || vm.reqType === constants.production.PT.shortName) {
          dataStoreService.setItem('genderValidationError', !genderValidation);
        }
        return $state.go('app.' + constants.production[vm.reqType].shortName.toLowerCase() + 'Entry');
      }
      dataStoreService.setItem('dobValidationError', false);
      dataStoreService.setItem('genderValidationError', false);
    }

    // init kickout flag
    dataStoreService.setItem('kickoutQ', {
      QMAY: false,
      QPS: false
    });
    dataStoreService.setItem('kickoutFlag', false);
    vm.product = dataStoreService.getOrderItem('product');

    // PACSDP - 713 PAS
    vm.isSinglePremium = vm.product.basic && vm.product.basic.isSinglePremium;
    if (vm.channel === constants.channel.PRUACCESS) {
      vm.profile.loginDetail = dataStoreService.getUser();
    }
    // vm.customer = prefillCustomerInfo();
    vm.customId = vm.profile.customID;
    vm.summaryStep = dataStoreService.getItem('summaryStep') || constants.step.detail;
    vm.pageTitle = `<b>${vm.reqType === constants.production.PT.shortName ? 'DIRECT - ' : ''}${constants.production[vm.reqType].name.slice(0, 3)}</b>${constants.production[vm.reqType].name.slice(3)} application form`;
    vm.warning = constants.production[vm.reqType].warningText;
    /* Reset showHealth to false for PA, PGP and PGRP */
    if (vm.reqType === constants.production.PA.shortName || vm.reqType === constants.production.PGP.shortName || vm.reqType === constants.production.PGRP.shortName) constants.showHealth = false;
    if (vm.reqType === constants.production.PA.shortName) {
      vm.noteText = constants.production[vm.reqType].noteText;
    }
    /** ********************************************************************
     * If not login, show details-common page
     * If login, show edit summary page
     * If channel is Pruaccess, show edit summary page
     **********************************************************************/
    if (vm.loginStatus || (!vm.loginStatus && (vm.channel === constants.channel.PRUACCESS))) {
      vm.detailStep = constants.step.edit;
      window.scrollTo(0, 0);
      vm.isCollapsedAboutYou = vm.isCollapsedAboutYou === 0 ? false : 0;
      vm.isCollapsedMoreAbout = vm.isCollapsedMoreAbout === 0 ? false : 0;
      vm.isCollapsedHealth = vm.isCollapsedHealth === 0 ? false : 0;
      vm.isCollapsedPayment = vm.isCollapsedPayment === 0 ? false : 0;
      vm.isCollapsedUpload = vm.isCollapsedUpload === 0 ? false : 0;
      customerInfo = dataStoreService.getItem('customer');
      // Handling direct Entry channel code like PULSE
      if ((Object.values(constants.dpchannel).includes(vm.channel)) || vm.isDirectEntryChannelCode) {
        vm.closeEmailReq = {
          mailType: constants.mailType.closeBrowser,
          customId: vm.profile.customID,
          givenName: customerInfo.firstName,
          surName: customerInfo.lastName,
          mobilePhone: customerInfo.contact.mobileContactIDD + customerInfo.contact.mobilePhone || utils.getIddNumber(customerInfo.contact.mobilePhoneArea) + customerInfo.contact.mobilePhone,
          phoneIDD: customerInfo.contact.mobileContactIDD || '65',
          phoneCountryCode: customerInfo.contact.mobilePhoneArea || 'SGP',
          stage: '',
          productName: constants.production[vm.profile.type].name,
          age: utils.calculateAge(customerInfo.dateOfBirth),
          occupation: customerInfo ? customerInfo.occupationDescription : '',
          nationality: customerInfo ? customerInfo.nationality : '',
          erefNo: '',
          nricFin: customerInfo.idNumber || '',
          gender: customerInfo.gender || vm.profile.gender || '',
          dob: vm.profile.dob,
          customerEmail: (customerInfo && customerInfo.contact) ? customerInfo.contact.email || '' : '',
          isExistingClient: true,
          clientNumber: dataStoreService.getItem('clientNumber') || null,
          selectedProducts: {
            docId: vm.product.docId,
            prodCode: vm.product.prodCode,
            components: [vm.product.basic, ...vm.product.rider]
          },
          referralAgentCode: dataStoreService.getItem('referralAgentCode') || '',
          preferredAgentMobile: vm.fcmobile ? (constants.iddNumber.sgIddWithHyphen + vm.fcmobile) : '',
          assignedAgent: dataStoreService.getItem('assignedAgent') || null
        };
        // get agent
        consultantAndSendMail(vm.closeEmailReq);
      }
    }

    utils.listen({
      scope: $scope,
      event: 'getAboutYouValidation',
      callback: (event, func) => {
        vm.validateAboutYou = func;
      }
    }, {
      scope: $scope,
      event: 'showProofOfAddress',
      callback: (event, showProofOfAddress) => {
        // broadcast to upload
        $scope.$broadcast('uploadShowProofOfAddress', showProofOfAddress);
      }
    }, {
      scope: $scope,
      event: 'getMoreAboutYouValidation',
      callback: (event, func) => {
        vm.validateMoreAboutYou = func;
      }
    }, {
      scope: $scope,
      event: 'getHealthValidation',
      callback: (event, func) => {
        vm.validateHealth = func;
      }
    }, {
      scope: $scope,
      event: 'uploadDocumentValidation',
      callback: (event, func) => {
        vm.uploadDocumentValidation = func;
      }
    }, {
      scope: $scope,
      event: 'controlShowIDProof',
      callback: (e, onlyShowIDProof) => {
        // broadcast to upload
        $scope.$broadcast('setImgAmount', onlyShowIDProof);
      }
    }, {
      scope: $scope,
      event: 'updateUploadSection',
      callback: () => {
        // broadcase to upload
        $scope.$broadcast('resetUploadSection');
      }
    });

    // PD-2397 FATCA/CRS question enhancement when phone country and country of residence don’t match
    apiService.getCountryInfo().then(function (res) {
      var countryInfo = res.data;
      dataStoreService.setItem('countryInfo', countryInfo);
    }).catch(function (error) {
      throw error;
    });

    if (vm.reqType === constants.production.PS.shortName && vm.profile.loginStatus && utils.getResidencyStatus() === 'C') {
      vm.hideDocUpload = true;
    }
    vm.isSIOCampaignValid = dataStoreService.getItem('SIOCampaign');
    if (vm.reqType === constants.production.PS.shortName) {
      if (vm.isSIOCampaignValid === undefined) {
        apiService.getPsSIOCampaign(constants.production.PS.shortName).then((res) => {
          vm.isSIOCampaignValid = res.data.status;
          dataStoreService.setItem('SIOCampaign', vm.isSIOCampaignValid);
        });
      }
    }

    getMyInfoConfig();
  };

  $scope.$on('hideHealthSection', function (e, hideHealthSection) {
    if (vm.reqType === constants.production.PS.shortName && vm.isSIOCampaignValid === 'valid') {
      $scope.$broadcast('hideHealthShieldSection', hideHealthSection);
    }
  });
  // stick the policy details
  angular.element($window).bind('scroll', function () {
    stickyPolicyDetails();
  });

  function stickyPolicyDetails() {
    const creditCardEnrollmentEnabled = dataStoreService.getItem('creditCardEnrollmentEnabled');
    if (!creditCardEnrollmentEnabled) {
      let summaryHeader = $('.summary-header');
      let pruHeader = $('#pruHeader');
      let navigate = $('.summary-navbar');
      let contentTitle = $('.content-title-box');
      let myBannerInfo = $('.my-info-banner');
      let headerWarning = $('.header-waring');
      let headerHeight = summaryHeader.height() + pruHeader.height() + navigate.height() + contentTitle.height() + myBannerInfo.height() + headerWarning.height();
      utils.stickyPolicy('#applicationSummaryLeftContents', '.application-summary-container .policy-details-container', $window.innerWidth, $(window).scrollTop(), headerHeight);
    }
  }

  // reset policy position when policy's height changed
  $scope.$on('policyHeightChanged', function () {
    // call it here
    var changePolicyTop = setTimeout(function () { stickyPolicyDetails(); }, 500);
    return changePolicyTop;
  });
  // reset policy position when left contents' height changed
  $scope.$on('leftContentsHeightChanged', function () {
    // call it here
    var changePolicyTop = setTimeout(function () { stickyPolicyDetails(); }, 500);
    return changePolicyTop;
  });
  // show buttons and shadow on window width changed
  vm.width = $window.innerWidth;
  $(window).on('resize', function () {
    if ($window.innerWidth !== vm.width) {
      vm.width = $window.innerWidth;
      // show/hide swiper button on desktop view
      stickyPolicyDetails();
    }
  });
  // reset sticky button position when orientation changed
  $(window).bind('orientationchange', function () {
    stickyPolicyDetails();
  });

  function consultantAndSendMail(emailReq) {
    apiService.encryption().then(function (res) {
      var encryptedContent = null;
      var publicKey = res.data.rsaPublicKey;
      var random = res.data.random;
      encryptedContent = utils.setEncryptionList(emailReq, publicKey, random, vm.encryptKeyList);
      return apiService.addmail(encryptedContent, function () {
        $scope.$emit('getAgentInfo', true);
        dataStoreService.setItem('assignedAgent', true);
      });
    }).catch(function (error) {
      throw error;
    });
  }

  function validateData() {
    // clear invalid fields
    // dataStoreService.session.setObject('invalidFields', []);
    // to avoid message delay, reset the flg
    vm.showError = false;
    dataStoreService.session.setObject('hideUpload', vm.hideUpload);
    vm.validateAboutYou();
    vm.validateMoreAboutYou();
    // #2045: for PGRP
    if (
      vm.reqType !== constants.production.PA.shortName
      && vm.reqType !== constants.production.PGP.shortName
      && vm.reqType !== constants.production.PGRP.shortName
      && vm.reqType !== constants.production.PAS.shortName
      && vm.reqType !== constants.production.PER.shortName
      && !vm.isPATNonSmoker) {
      vm.validateHealth();
    } else {
      $rootScope.healthAndLifestyle = true;
    }

    if (vm.hideUpload && !vm.hideDocUpload) {
      vm.uploadDocumentValidation();
    }
    $timeout(function () {
      if ($rootScope.aboutYou && $rootScope.moreAboutYou && $rootScope.healthAndLifestyle && $rootScope.assignConsultant && ((vm.hideUpload && !vm.hideDocUpload) ? $rootScope.uploadYourDocument : true)) {
        vm.showError = false;
        vm.aboutYouDetails = dataStoreService.getOrderItem('aboutYouDetails');
        vm.moreAboutYouDetails = dataStoreService.getOrderItem('moreAboutYouDetails');
        vm.QMAYData = dataStoreService.getOrderItem('QMAYData');
        vm.QPSData = dataStoreService.getOrderItem('QPSData');
        vm.healthDetails = dataStoreService.getOrderItem('healthDetails');
        vm.profile = dataStoreService.session.getObject('profile'); // getting the updated profile object

        if (!utils.eligibilityValidation(vm.reqType, vm.loginStatus)) {
          const leadGenPage = vm.isV2UX ? 'app.leadGenThankV2' : 'app.leadGenThank';
          $state.go(leadGenPage);
          return;
        }
        // for PER, temporary changes to pass the foreigners pass type
        if (vm.reqType === 'PER' || vm.reqType === 'PC') {
          let passQuestion = constants.questionnairePassType;
          if (vm.profile && vm.profile.identity === 3 && vm.passType && typeof vm.passType === 'object') {
            passQuestion = {
              ...passQuestion,
              answer: {
                value: vm.passType.option,
                label: vm.passType.option,
              },
            };
          }
          vm.QMAYData.push(passQuestion);
        }
        if (vm.isPERdirectEntry) {
          let paymentQuestion = constants.questionnairePaymentType;
          const paymentSelected = dataStoreService.getOrderItem('perPaymentQ').toLowerCase();
          paymentQuestion.answer.value = paymentQuestion.answer.label = constants.perPaymentQ[paymentSelected].label;
          vm.QMAYData.push(paymentQuestion);
        }
        vm.saveAllRequest = {
          customId: vm.customId,
          productType: vm.reqType,
          surName: vm.aboutYouDetails.surName,
          givenName: vm.aboutYouDetails.givenName,
          nricFin: vm.aboutYouDetails.nricFin,
          idd: vm.aboutYouDetails.idd,
          mobilePhone: `${vm.aboutYouDetails.idd}${vm.aboutYouDetails.mobilePhone}`, // fix PD-1485:Mobile number country code error
          phoneIDD: vm.aboutYouDetails.phoneIDD,
          phoneCountryCode: vm.aboutYouDetails.phoneCountryCode,
          clientNumber: dataStoreService.getItem('clientNumber') || null,
          gender: vm.aboutYouDetails.gender,
          nationality: vm.moreAboutYouDetails.nationality,
          dob: vm.aboutYouDetails.dob,
          customerEmail: vm.aboutYouDetails.customerEmail,
          mailingUnitNo: vm.moreAboutYouDetails.mailingUnitNo,
          mailingStreetName: vm.moreAboutYouDetails.mailingStreetName || vm.moreAboutYouDetails.foreignMailStreet,
          mailingBuildingName: vm.moreAboutYouDetails.mailingBuildingName,
          mailingBlockNo: vm.moreAboutYouDetails.mailingBlockNo,
          mailingPostalCode: vm.moreAboutYouDetails.mailingPostalCode || vm.moreAboutYouDetails.foreignMailPostcode,
          residentialUnitNo: vm.moreAboutYouDetails.residentialUnitNo,
          residentialStreetName: vm.moreAboutYouDetails.residentialStreetName || vm.moreAboutYouDetails.foreignStreet,
          residentialBuildingName: vm.moreAboutYouDetails.residentialBuildingName,
          residentialBlockNo: vm.moreAboutYouDetails.residentialBlockNo,
          residentialPostalCode: vm.moreAboutYouDetails.residentialPostalCode || vm.moreAboutYouDetails.foreignPostcode,
          residentialCountry: vm.moreAboutYouDetails.residentialCountry,
          residencyStatus: vm.moreAboutYouDetails.residencyStatus,
          mailingCountry: vm.moreAboutYouDetails.mailingCountry,
          othNationality: vm.moreAboutYouDetails.othNationality,
          othMailingCountry: vm.moreAboutYouDetails.othMailingCountry,
          annualIncome: vm.moreAboutYouDetails.annualIncome,
          height: vm.healthDetails ? vm.healthDetails.height : 0,
          weight: vm.healthDetails ? vm.healthDetails.weight : 0,
          qmayQuestionnaires: JSON.stringify(vm.QMAYData),
          qpsQuestionnaires: JSON.stringify(vm.QPSData),
          requestFinancialConsultant: 'false'
        };
        vm.saveEncrptionRequest = angular.copy(vm.saveAllRequest);

        vm.isSmoker = _.find(vm.QPSData, function (item) {
          return item.question.code === 'QPS005';
        });
        if (vm.isSmoker) {
          if (vm.reqType === 'PAT') {
            if (vm.profile.smoker === 1) {
              vm.isSmoker.answer.value = 'true';
            }
          }
          if (vm.isSmoker.answer.value === 'true') {
            vm.profile.smoker = 1;
          } else {
            vm.profile.smoker = 2;
          }
          dataStoreService.session.setObject('profile', vm.profile);
        }

        // PD-1532: set gender to profile for PGP
        // PD-2045: set gender to profile for PGRP
        if (vm.reqType === constants.production.PGP.shortName || vm.reqType === constants.production.PGRP.shortName || vm.reqType === constants.production.PAS.shortName || vm.reqType === constants.production.PER.shortName || vm.reqType === constants.production.PC.shortName) {
          vm.profile.gender = vm.moreAboutYouDetails.gender;
          dataStoreService.session.setObject('profile', vm.profile);
        }

        // PGRP Existing User, If Premium is under 20000, the page will navigate to lead gen
        if (vm.reqType === constants.production.PGRP.shortName && vm.product && vm.product.basic && vm.product.basic.yearlyPremium < 20000) {
          dataStoreService.setItem('kickoutFlag', true);
        }
        apiService.encryption(`count=${vm.encryptionLength}`).then(function (res) {
          var random = res.data.random;
          var publicKey = res.data.rsaPublicKey;
          vm.saveEncrptionRequest = utils.setEncryptionList(vm.saveEncrptionRequest, publicKey, random, vm.encryptSubKeyList);
          return apiService.saveAllCustomerInputInfo(vm.saveEncrptionRequest);
        }).then(function () {
          var kickoutFlag = dataStoreService.getItem('kickoutFlag');
          let kickoutQDataStore = dataStoreService.getItem('kickoutQ');
          let kickoutQ = [];
          Object.entries(kickoutQDataStore).forEach(([key, value]) => {
            if (value === true) {
              if (vm.reqType !== 'PC' || (vm.reqType === 'PC' && key !== 'QPS')) {
                kickoutQ.push(value);
              }
            }
          });
          if (kickoutFlag || kickoutQ.length > 0) {
            utils.kickoutSendMail(dataStoreService);
          } else {
            $state.go('app.summaryCommon');
          }
        }).catch(function (error) {
          $rootScope.nextDisable = false;
          throw error;
        });
      } else {
        utils.scrollToFirstInvalidField();
        vm.showError = true;
      }
    }, 0);
  }

  function changeStep(event) {
    vm.detailStep = event.detailStep;
    // FIXED BY PD-485
    window.scrollTo(0, 0);
    if (event.detailStep === constants.section.aboutYou) {
      vm.isCollapsedMoreAbout = vm.isCollapsedMoreAbout === 0 ? false : 0;
    } else if (event.detailStep === constants.section.moreAboutYou) {
      vm.isCollapsedHealth = vm.isCollapsedHealth === 0 ? false : 0;
    } else if (event.detailStep === constants.section.paymentOption) {
      vm.isCollapsedPayment = vm.isCollapsedPayment === 0 ? false : 0;
    } else if (event.detailStep === constants.section.healthAndLifestyle || event.detailStep === constants.section.uploadDocument) {
      vm.isCollapsedUpload = vm.isCollapsedUpload === 0 ? false : 0;
    } else if (event.detailStep === constants.step.edit) {
      vm.summaryStep = event.detailStep;
      vm.isCollapsedAboutYou = vm.isCollapsedAboutYou === 0 ? false : 0;
      vm.isCollapsedMoreAbout = vm.isCollapsedMoreAbout === 0 ? false : 0;
      vm.isCollapsedHealth = vm.isCollapsedHealth === 0 ? false : 0;
      vm.isCollapsedPayment = vm.isCollapsedPayment === 0 ? false : 0;
      vm.isCollapsedUpload = vm.isCollapsedUpload === 0 ? false : 0;
    }
  }

  function openCancelModal() {
    utils.openCancelModal(vm.customId);
  }

  function putDataInSession() {
    //getting data from page and putting to session before MyInfo page reload
    if (dataStoreService.getItem('reqType')) {
      dataStoreService.session.setValue('reqType', dataStoreService.getItem('reqType'));
    }
    const reqType = dataStoreService.getItem('reqType') || dataStoreService.session.getValue('reqType');
    if (reqType === 'PS') {
      if (dataStoreService.getItem('isV2UX')) {
        dataStoreService.session.setObject('isV2UX', dataStoreService.getItem('isV2UX'));
      }
      if (dataStoreService.getItem('customer')) {
        dataStoreService.session.setObject('customer', dataStoreService.getItem('customer'));
      }
      if (dataStoreService.getItem('loginStatus')) {
        dataStoreService.session.setValue('loginStatus', dataStoreService.getItem('loginStatus'));
      }
      if (dataStoreService.getItem('product')) {
        dataStoreService.session.setObject('product', dataStoreService.getItem('product'));
      }
      if (dataStoreService.getOrderItem('product')) {
        dataStoreService.session.setObject('product', dataStoreService.getOrderItem('product'));
      }
      if (dataStoreService.getItem('summaryStep')) {
        dataStoreService.session.setValue('summaryStep', dataStoreService.getItem('summaryStep'));
      }
      if (dataStoreService.getCustomId()) {
        dataStoreService.session.setValue('customID', dataStoreService.getCustomId());
      }
      if (dataStoreService.getItem('isExistCustomerDecl')) {
        dataStoreService.session.setValue('isExistCustomerDecl', dataStoreService.getItem('isExistCustomerDecl'));
      }
      if (dataStoreService.getItem('clientNumber')) {
        dataStoreService.session.setValue('clientNumber', dataStoreService.getItem('clientNumber'));
      }
      if (dataStoreService.getItem('channel')) {
        dataStoreService.session.setValue('channel', dataStoreService.getItem('channel'));
      }
      if (dataStoreService.getItem('partnerChannel')) {
        dataStoreService.session.setValue('partnerChannel', dataStoreService.getItem('partnerChannel'));
      }
      if (dataStoreService.getItem('isDirectEntryChannelCode')) {
        dataStoreService.session.setValue('isDirectEntryChannelCode', dataStoreService.getItem('isDirectEntryChannelCode'));
      }
      if (dataStoreService.getItem('referralAgentCode')) {
        dataStoreService.session.setValue('referralAgentCode', dataStoreService.getItem('referralAgentCode'));
      }
      if (dataStoreService.getItem('assignedAgent')) {
        dataStoreService.session.setValue('assignedAgent', dataStoreService.getItem('assignedAgent'));
      }
      if (dataStoreService.getOrderItem('aboutYouDetails')) {
        dataStoreService.session.setObject('aboutYouDetails', dataStoreService.getOrderItem('aboutYouDetails'));
      }
      if (dataStoreService.getOrderItem('moreAboutYouDetails')) {
        dataStoreService.session.setObject('moreAboutYouDetails', dataStoreService.getOrderItem('moreAboutYouDetails'));
      }
      if (dataStoreService.getOrderItem('QMAYData')) {
        dataStoreService.session.setObject('QMAYData', dataStoreService.getOrderItem('QMAYData'));
      }
      if (dataStoreService.getOrderItem('QPSData')) {
        dataStoreService.session.setObject('QPSData', dataStoreService.getOrderItem('QPSData'));
      }
      if (dataStoreService.getOrderItem('healthDetails')) {
        dataStoreService.session.setObject('healthDetails', dataStoreService.getOrderItem('healthDetails'));
      }
      if (dataStoreService.getItem('countryInfo')) {
        dataStoreService.session.setObject('countryInfo', dataStoreService.getItem('countryInfo'));
      }
      if (dataStoreService.getItem('basePaymentFrequency')) {
        dataStoreService.session.setObject('basePaymentFrequency', dataStoreService.getItem('basePaymentFrequency'));
      }
      if (dataStoreService.getItem('creditCardEnrollmentEnabled')) {
        dataStoreService.session.setObject('creditCardEnrollmentEnabled', dataStoreService.getItem('creditCardEnrollmentEnabled'));
      }
      if (dataStoreService.getItem('creditCardEnrollmentIpayUrl')) {
        dataStoreService.session.setObject('creditCardEnrollmentIpayUrl', dataStoreService.getItem('creditCardEnrollmentIpayUrl'));
      }
      if (dataStoreService.getItem('creditCardEnrollmentAppId')) {
        dataStoreService.session.setObject('creditCardEnrollmentAppId', dataStoreService.getItem('creditCardEnrollmentAppId'));
      }
      if (dataStoreService.getItem('creditCardEnrollmentPollingCount')) {
        dataStoreService.session.setObject('creditCardEnrollmentPollingCount', dataStoreService.getItem('creditCardEnrollmentPollingCount'));
      }
      if (dataStoreService.getItem('creditCardEnrollmentPollingDelay')) {
        dataStoreService.session.setObject('creditCardEnrollmentPollingDelay', dataStoreService.getItem('creditCardEnrollmentPollingDelay'));
      }

      //getting data from session and putting back to page after MyInfo page reload
      if (dataStoreService.session.getValue('isV2UX')) {
        dataStoreService.setItem('isV2UX', dataStoreService.session.getValue('isV2UX'));
      }
      if (dataStoreService.session.getObject('customer')) {
        dataStoreService.setItem('customer', dataStoreService.session.getObject('customer'));
      }
      if (dataStoreService.session.getValue('loginStatus')) {
        dataStoreService.setItem('loginStatus', dataStoreService.session.getValue('loginStatus'));
      }
      if (dataStoreService.session.getObject('product')) {
        dataStoreService.setOrderItem('product', dataStoreService.session.getObject('product'));
        dataStoreService.setItem('product', dataStoreService.session.getObject('product'));
      }
      if (dataStoreService.session.getValue('summaryStep')) {
        dataStoreService.setItem('summaryStep', dataStoreService.session.getValue('summaryStep'));
      }
      if (dataStoreService.session.getValue('customID')) {
        dataStoreService.setCustomId(dataStoreService.session.getValue('customID'));
      }
      if (dataStoreService.session.getValue('reqType')) {
        dataStoreService.setItem('reqType', dataStoreService.session.getValue('reqType'));
      }
      if (dataStoreService.session.getValue('isExistCustomerDecl')) {
        dataStoreService.setItem('isExistCustomerDecl', dataStoreService.session.getValue('isExistCustomerDecl'));
      }
      if (dataStoreService.session.getValue('clientNumber')) {
        dataStoreService.setItem('clientNumber', dataStoreService.session.getValue('clientNumber'));
      }
      if (dataStoreService.session.getValue('channel')) {
        dataStoreService.setItem('channel', dataStoreService.session.getValue('channel'));
      }
      if (dataStoreService.session.getValue('partnerChannel')) {
        dataStoreService.setItem('partnerChannel', dataStoreService.session.getValue('partnerChannel'));
      }
      if (dataStoreService.session.getValue('isDirectEntryChannelCode')) {
        dataStoreService.setItem('isDirectEntryChannelCode', dataStoreService.session.getValue('isDirectEntryChannelCode'));
      }
      if (dataStoreService.session.getValue('referralAgentCode')) {
        dataStoreService.setItem('referralAgentCode', dataStoreService.session.getValue('referralAgentCode'));
      }
      if (dataStoreService.session.getValue('assignedAgent')) {
        dataStoreService.setItem('assignedAgent', dataStoreService.session.getValue('assignedAgent'));
      }
      if (dataStoreService.session.getObject('aboutYouDetails')) {
        dataStoreService.setItem('aboutYouDetails', dataStoreService.session.getObject('aboutYouDetails'));
        dataStoreService.setOrderItem('aboutYouDetails', dataStoreService.session.getObject('aboutYouDetails'));
      }
      if (dataStoreService.session.getObject('moreAboutYouDetails')) {
        dataStoreService.setItem('moreAboutYouDetails', dataStoreService.session.getObject('moreAboutYouDetails'));
        dataStoreService.setOrderItem('moreAboutYouDetails', dataStoreService.session.getObject('moreAboutYouDetails'));
      }
      if (dataStoreService.session.getObject('QMAYData')) {
        dataStoreService.setItem('QMAYData', dataStoreService.session.getObject('QMAYData'));
        dataStoreService.setOrderItem('QMAYData', dataStoreService.session.getObject('QMAYData'));
      }
      if (dataStoreService.session.getObject('QPSData')) {
        dataStoreService.setItem('QPSData', dataStoreService.session.getObject('QPSData'));
        dataStoreService.setOrderItem('QPSData', dataStoreService.session.getObject('QPSData'));
      }
      if (dataStoreService.session.getObject('healthDetails')) {
        dataStoreService.setItem('healthDetails', dataStoreService.session.getObject('healthDetails'));
        dataStoreService.setOrderItem('healthDetails', dataStoreService.session.getObject('healthDetails'));
      }
      if (dataStoreService.session.getObject('countryInfo')) {
        dataStoreService.setItem('countryInfo', dataStoreService.session.getObject('countryInfo'));
      }
      if (dataStoreService.session.getObject('basePaymentFrequency')) {
        dataStoreService.setItem('basePaymentFrequency', dataStoreService.session.getObject('basePaymentFrequency'));
      }
      if (dataStoreService.session.getObject('creditCardEnrollmentEnabled')) {
        dataStoreService.setItem('creditCardEnrollmentEnabled', dataStoreService.session.getObject('creditCardEnrollmentEnabled'));
      }
      if (dataStoreService.session.getObject('creditCardEnrollmentIpayUrl')) {
        dataStoreService.setItem('creditCardEnrollmentIpayUrl', dataStoreService.session.getObject('creditCardEnrollmentIpayUrl'));
      }
      if (dataStoreService.session.getObject('creditCardEnrollmentAppId')) {
        dataStoreService.setItem('creditCardEnrollmentAppId', dataStoreService.session.getObject('creditCardEnrollmentAppId'));
      }
      if (dataStoreService.session.getObject('creditCardEnrollmentPollingCount')) {
        dataStoreService.setItem('creditCardEnrollmentPollingCount', dataStoreService.session.getObject('creditCardEnrollmentPollingCount'));
      }
      if (dataStoreService.session.getObject('creditCardEnrollmentPollingDelay')) {
        dataStoreService.setItem('creditCardEnrollmentPollingDelay', dataStoreService.session.getObject('creditCardEnrollmentPollingDelay'));
      }
    }
  }

  function handleSubmit() {
    dataStoreService.session.setValue('myInfoSelected', true);
    const url1 = `${vm.authApiUrl}?client_id=${vm.clientId}&attributes=${vm.attributes}&purpose=${vm.purpose}`;
    const url2 = `&state=${vm.state}&redirect_uri=${vm.redirectURL}`;
    const authoriseUrl = url1 + url2;
    window.location.href = authoriseUrl;
  }

  function getMyInfoConfig() {
    apiService.getMyInfoConfig().then((res) => {
      vm.authApiUrl = res.data.authApiUrl;
      vm.clientId = res.data.clientId;
      vm.attributes = res.data.attributes;
      vm.redirectURL = getRedirectURL(res.data.redirectUrl);
      vm.code = res.data.code;
      vm.state = res.data.state;
    });
  }

  // PACSDP-5289 Setting the myinfo redirect link with GA's utm Params
  function getRedirectURL(redirectURL) {
    let redirectURLFinal = redirectURL;
    if (dataStoreService.getItem('utmSource')) {
      redirectURLFinal += '?utm_source=' + dataStoreService.getItem('utmSource')
                  + '&utmMedium' + dataStoreService.getItem('utmMedium')
                  + '&utmContent' + dataStoreService.getItem('utmContent');
    }
    return redirectURLFinal;
  }

  $scope.$on('myInfoButtonClicked', function (e, data) {
    $scope.$broadcast('myInfoButtonSelected', data);
  });

  $scope.$on('myInfoReqisteredAddress', function (event, data) {
    $scope.$broadcast('myInfoRegdAdd', data);
  });

  $scope.$on('disableAddress', function (event, data) {
    $scope.$broadcast('disableAdd', data);
  });

  $scope.$on('showMyInfoErrorMessage', function (event, data) {
    vm.myInfoErrorMessage = data.myInfoErrorMessage;
    vm.myInfoErrorClass = data.myInfoErrorClass;
    vm.showMyInfoBannerError = data.show;
    $scope.$broadcast('myInfoHasError', data.show);
  });

  $scope.$on('hideMyInfoErrorMessage', function (event, data) {
    vm.myInfoErrorMessage = '';
    vm.showMyInfoBannerError = data.hide;
  });

  $scope.$on('hideDocUpload', function (e, data) {
    if (vm.reqType === 'PS') {
      vm.hideDocUpload = data;
      $scope.$broadcast('disableUploadPanel', data);
    }
  });
}
