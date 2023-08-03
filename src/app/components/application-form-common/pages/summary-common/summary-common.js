module.exports = {
  template: require('./summary-common.html'),
  controller: summaryCommonController,
  controllerAs: 'vm'
};
/** @ngInject */
function summaryCommonController($rootScope, $scope, $ngRedux, $window, $timeout, $filter, $state, $uibModal, dataStoreService, apiService, utils, constants, errorsService) {
  let vm = this;
  // Define modalInstance
  let modalInstance = null;
  let aboutYouDetails;
  let moreAboutYouDetails;
  let customer;
  let mailDetails;
  let occupation;
  let docId;
  let computeRandom = null;
  let computePublicKey = null;
  // cybersource signature parms
  let signRequest = null;
  let lifeProfile;
  let productRequest;
  let dummyFirstName = 'xx';

  const monthArray = constants.monthArray;
  vm.selectedCountry = null;
  vm.showUpload = dataStoreService.session.getObject('hideUpload');
  vm.products = [];
  vm.summaryStep = constants.step.review;
  vm.profile = dataStoreService.session.getObject('profile');
  vm.loginStatus = dataStoreService.getItem('loginStatus');
  vm.reqType = vm.profile.type;
  vm.order = dataStoreService.getOrder();
  aboutYouDetails = vm.order.aboutYouDetails;
  moreAboutYouDetails = vm.order.moreAboutYouDetails;
  vm.product = vm.order[constants.production[vm.reqType].proInfo];

  if (vm.reqType === constants.production.PAS.shortName) {
    // PACSDP - 713 PAS
    vm.isSinglePremium = vm.product.basic && vm.product.basic.isSinglePremium;
    // PACSDP-952 PAS payment option displaying
    const avaliablePayment = dataStoreService.getItem('avaliablePayment') || [];
    const isOnlyCashAllowed = avaliablePayment.length === 1
      && avaliablePayment[0] === constants.paymentQMethod.cash;
    vm.hidePaymentOption = vm.isSinglePremium;

    // PACSDP-952
    if (vm.isSinglePremium && isOnlyCashAllowed) {
      vm.product.paymentOption = constants.paymentQMethod.cash;
      dataStoreService.setOrderItem('paymentQ', constants.paymentQMethod.cash);
    }
  }


  customer = dataStoreService.getItem('customer');
  mailDetails = dataStoreService.session.getObject('mailDetails');
  occupation = dataStoreService.getItem('occupation') || {
    occupation: vm.profile.occupationClass,
    occupationCode: vm.profile.occupationCode,
    occupationDesc: vm.profile.occupationDescription
  };

  docId = vm.product.docId;
  vm.erefCode = dataStoreService.getOrderItem('erefCode') || '';
  vm.age = utils.calculateAge(vm.profile.dob);
  vm.path = constants.production[vm.reqType].confirmationPath;
  vm.tempYearlyPremium = null;

  vm.basicComponent = null;
  vm.defaultComponent = null;
  vm.riderComponent = null;

  vm.showIframe = false;

  // Bug 1762: Field validation error message not appearing
  vm.showError = false;

  if (customer && customer.smoker) {
    vm.profile.smoker = customer.smoker;
  }
  vm.encryptComputeKeyList = ['lifeProfiles'];
  vm.encryptComputeSubKeyList = ['name'];
  vm.encryptionComputeLength = vm.encryptComputeSubKeyList.length;

  // PD-1450 Remove the Section "What you are buying" and "Declaration"
  vm.encryptKeyList = ['surName', 'givenName', 'nricFin', 'idd', 'mobilePhone', 'phoneCountryCode', 'phoneIDD', 'nric', 'email', 'mailingUnitNo', 'mailingStreetName', 'mailingBuildingName', 'mailingBlockNo', 'mailingPostalCode', 'residentialUnitNo',
    'residentialStreetName', 'residentialBuildingName', 'residentialBlockNo', 'residentialPostalCode', 'customerEmail', 'residentialCountry', 'mailingCountry', 'nationality'
  ];
  vm.encryptionLength = vm.encryptKeyList.length;
  vm.editField = false;

  // PD-1430 Summary Review Page Layout Change
  vm.isCollapsed = false;


  /* function declaration */
  vm.saveChanges = saveChanges;
  vm.makePayment = makePayment;
  vm.getIframeStyle = getIframeStyle;
  vm.openCancelModal = openCancelModal;
  vm.pfcFinalComputeAll = pfcFinalComputeAll;
  vm.finalQuotation = finalQuotation;
  vm.resetPGRPProduct = resetPGRPProduct;
  vm.setBenefits = setBenefits;
  vm.resetPGPProduct = resetPGPProduct;
  vm.resetPtProduct = resetPtProduct;
  vm.restructureEtRequest = restructureEtRequest;
  vm.resortComponents = resortComponents;
  vm.formatDate = formatDate;
  vm.createPdf = createPdf;
  vm.computePaAndPs = computePaAndPs;
  vm.activate = activate;
  vm.triggerDeclaration = triggerDeclaration;
  // PD-2056 Legal Updates for All Products
  vm.openYourConsentModal = openYourConsentModal;
  // cybersource
  vm.genCybSign = genCybSign;

  vm.showSaveMessage = dataStoreService.getItem('showSaveMessage');
  if (!vm.showSaveMessage) {
    vm.showSaveMessage = false;
  }

  // fix the ET SCB recalculate issue
  if (dataStoreService.getItem('channel') === constants.channel.SCB) {
    vm.clientIndicator = constants.clientIndicator.bth;
  } else {
    vm.clientIndicator = constants.clientIndicator.all;
  }

  lifeProfile = {
    name: (`${aboutYouDetails.givenName || ''} ${aboutYouDetails.surName}`),
    dob: aboutYouDetails.dob,
    age: utils.calculateAge(aboutYouDetails.dob) + 1,
    gender: aboutYouDetails.gender || '',
    smoker: vm.profile.smoker === 1,
    residentStatus: utils.getResidencyStatus() || 'C',
    numberOfLife: 0,
    clientType: constants.clientType,
    // defaulting to SNG since SIO is only for Singapore Residents
    countryCode: vm.reqType === 'PAT' ? 'SNG' : moreAboutYouDetails.nationality,
    occupation: occupation.occupation || '',
    occupationCode: occupation.occupationCode || '',
    occupationDesc: occupation.occupationDesc || '',
    clientIndicator: vm.clientIndicator
  };


  vm.paymentGateway = {
    tmStatus: 'NO',
    tmMcode: '',
    tmRefno: '',
    tmCCNum: '',
    tmDebitAmt: '0',
    tmPaymentType: '',
    tmApprovalCode: '',
    tmBankRespCode: '',
    tmExpiryDate: ''
  };

  // PACSDP-752 DPI product FC question hiding.
  vm.isDPIproduct = dataStoreService.getItem('isDPIproduct');
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
    vm.agentChangeFlg = false;
    vm.customId = vm.profile.customID;
    vm.channel = dataStoreService.getItem('channel');
    const partnerChannel = dataStoreService.getItem('partnerChannel');
    vm.isPERdirectEntry = (vm.reqType === 'PER' && partnerChannel !== constants.channel.UOB);
    vm.isPATSmoker = (vm.reqType === 'PAT' && vm.profile.smoker === 1);
    vm.isPATNonSmoker = (vm.reqType === 'PAT' && vm.profile.smoker === 2);
    vm.creditCardEnrollmentEnabled = dataStoreService.getItem('creditCardEnrollmentEnabled');
    const productCutName = constants.production[vm.reqType].name;
    if (vm.isV2UX) {
      dataStoreService.setItem('appHeaderText', `<strong>${productCutName} Application Summary</strong>`);
    }
    vm.footNote = constants.production[vm.reqType].footNote || '';
    vm.pageTitle = `<span>${vm.reqType === constants.production.PT.shortName ? 'DIRECT - ' : ''}${productCutName.slice(0, 3)}</span>${productCutName.slice(3)} application form`;
    vm.warning = constants.production[vm.reqType].warningText;

    vm.hasPaymentQ = false;
    vm.QMAYData = dataStoreService.getOrderItem('QMAYData') || dataStoreService.session.getObject('QMAYData');
    vm.paymentQuestionnaire = dataStoreService.getOrderItem('paymentQuestionnaire');
    if (vm.paymentQuestionnaire && vm.paymentQuestionnaire.length > 0) {
      vm.QMAYData = vm.QMAYData.concat(vm.paymentQuestionnaire);
      dataStoreService.setOrderItem('QMAYData', vm.QMAYData);
      dataStoreService.session.setObject('QMAYData', vm.QMAYData);
    }
    vm.paymentQuestionnaire = _.filter(vm.QMAYData, function (item) {
      return constants.production[vm.reqType].moreAboutYouQuestion.paymentQ.indexOf(item.question.code) !== -1;
    });

    if (vm.paymentQuestionnaire && vm.paymentQuestionnaire.length > 0) {
      vm.hasPaymentQ = true;
    }
    if (utils.calculateAge(vm.profile.dob) < 18 && ((vm.reqType === constants.production.PGP.shortName && vm.profile.currencyCode === constants.currency.SGD) || vm.reqType === constants.production.PGRP.shortName)) {
      vm.hasPaymentQ = false; // for dob < 18 && PGP with SGD currency || PGRP
    }

    utils.listen({
      scope: $scope,
      event: 'getAboutYouValidationForReview',
      callback: (event, func) => {
        vm.validateAboutYou = func;
      }
    }, {
      scope: $scope,
      event: 'getMoreAboutYouValidationForReview',
      callback: (event, func) => {
        vm.validateMoreAboutYou = func;
      }
    }, {
      scope: $scope,
      event: 'getHealthValidationForReview',
      callback: (event, func) => {
        vm.validateHealth = func;
      }
    }, {
      scope: $scope,
      event: 'uploadDocumentValidationForReview',
      callback: (event, func) => {
        vm.uploadDocumentValidation = func;
      }
    }, {
      scope: $scope,
      event: 'getPaymentOptionValidationForReview',
      callback: (event, func) => {
        vm.getPaymentOptionValidation = func;
      }
    }, {
      scope: $scope,
      event: 'controlShowIDProof',
      callback: (e, onlyShowIDProof) => {
        $scope.$broadcast('setImgAmount', onlyShowIDProof);
      }
    }, {
      scope: $scope,
      event: 'updateUploadSection',
      callback: () => {
        // broadcase to upload
        $scope.$broadcast('resetUploadSection');
      }
    }, {
      scope: $scope,
      event: 'setShowUpload',
      callback: (e, hideupload) => {
        vm.showUpload = hideupload;
      }
    });

    if (!utils.eligibilityValidation(vm.reqType, vm.loginStatus)) {
      const leadGenPage = vm.isV2UX ? 'app.leadGenThankV2' : 'app.leadGenThank';
      $state.go(leadGenPage);
      return;
    }
    activate('');
    if (vm.reqType === constants.production.PS.shortName && vm.profile.loginStatus && utils.getResidencyStatus() === 'C') {
      vm.hideDocUpload = true;
    }

    dataStoreService.setItem('summaryStep', constants.step.review);
  };
  // sticky policy details
  angular.element($window).bind('scroll', function () {
    stickyPolicyDetails();
  });

  function stickyPolicyDetails() {
    let summaryHeader = $('.summary-header');
    let pruHeader = $('#pruHeader');
    let navigate = $('.summary-navbar');
    let contentTitle = $('.content-title-box');
    let headerHeight = summaryHeader.height() + pruHeader.height() + navigate.height() + contentTitle.height();
    utils.stickyPolicy('#applicationSummaryLeftContents', '.application-summary-container .policy-details-container', $window.innerWidth, $(window).scrollTop(), headerHeight);
  }

  // reset policy position when height changed
  $scope.$on('policyHeightChanged', function () {
    // call it here
    var changePolicyTop = setTimeout(function () {
      stickyPolicyDetails();
    }, 500);
    return changePolicyTop;
  });
  // reset policy position when left contents' height changed
  $scope.$on('leftContentsHeightChanged', function () {
    // call it here
    var changePolicyTop = setTimeout(function () { stickyPolicyDetails(); }, 500);
    return changePolicyTop;
  });
  // on mobile country code change
  $scope.$on('countryCodeUpdate', function (event, countryCode) {
    vm.selectedCountry = countryCode;
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

  $scope.$on(constants.events[vm.profile.type].doConsentValidation, function (e, data) {
    vm.doCommonConsentValidation = data;
  });

  $scope.$on('checkMedicalConsent', function (e, func) {
    vm.doMedicalConsentValidation = func;
  });

  $scope.$on('marketingConsent', function (e, data) {
    vm.marketingConsent = data;
    dataStoreService.setOrderItem('marketingConsent', vm.marketingConsent);
  });
  // PS SIO changes to hide health section
  $scope.$on('hideHealthSection', function (e, hideHealthSection) {
    const isSIOCampaignValid = dataStoreService.getItem('SIOCampaign');
    if (vm.reqType === constants.production.PS.shortName && isSIOCampaignValid === 'valid') {
      $scope.$broadcast('hideHealthShieldSection', hideHealthSection);
    }
  });
  // PD-1450 Remove the Section "What you are buying" and "Declaration"
  $scope.$on('switchEditStatus', function () {
    vm.editField = true;
  });
  // PD-2168 Change DOB from anb < 19 to anb >=19
  $scope.$on('changeDobValue', function (e, data) {
    vm.age = utils.calculateAge(data.dobDate);
    if (vm.reqType === constants.production.PGRP.shortName) {
      if (vm.product && vm.product.basic && vm.product.basic.yearlyPremium < 20000) {
        dataStoreService.setItem('kickoutFlag', true);
      } else if ((vm.tempYearlyPremium > 50000 && vm.product.basic.yearlyPremium < 50000) || (vm.product.basic.yearlyPremium > 50000 && vm.tempYearlyPremium < 50000)) {
        vm.profile.dob = data.dobDate;
        vm.profile.anb = utils.calculateAge(data.dobDate) + 1;
        vm.aboutYouDetails = dataStoreService.getOrderItem('aboutYouDetails');
        vm.aboutYouDetails.dob = data.dobDate;
        dataStoreService.session.setObject('profile', vm.profile);
        dataStoreService.setOrderItem('aboutYouDetails', vm.aboutYouDetails);

        $scope.$broadcast('onChangeDob', data.dobDate);
      }
    } else if (((data.old < 19 && data.newAnb >= 19) || (data.old >= 19 && data.newAnb < 19)) && vm.reqType === constants.production.PGP.shortName && vm.profile.currencyCode === constants.currency.SGD) {
      vm.profile.dob = data.dobDate;
      vm.profile.anb = utils.calculateAge(data.dobDate) + 1;
      vm.aboutYouDetails = dataStoreService.getOrderItem('aboutYouDetails');
      vm.aboutYouDetails.dob = data.dobDate;
      dataStoreService.session.setObject('profile', vm.profile);
      dataStoreService.setOrderItem('aboutYouDetails', vm.aboutYouDetails);

      if (vm.age > 17 && vm.reqType === constants.production.PGP.shortName) {
        vm.hasPaymentQ = true;
        dataStoreService.deleteOrderItem('paymentQ');
      } else if (vm.age < 18 && vm.reqType === constants.production.PGP.shortName) {
        vm.hasPaymentQ = false;
        dataStoreService.deleteOrderItem('paymentQ');
      }

      $scope.$broadcast('onChangeDob', data.dobDate);
    }
  });

  $scope.$on('iddCountryMatch', function (e, data, idd) {
    $scope.$broadcast('taxMatch', data, idd);
  });

  $scope.$on('changeAgentChangeFlg', function (e, data) {
    vm.agentChangeFlg = data;
  });

  // PD-2237 [CR] PGRP - Premium below <20,000 not allowed to purchase
  $scope.$on('triggleActivate', function (e, data) {
    lifeProfile.dob = data.dobDate;
    lifeProfile.age = utils.calculateAge(data.dobDate) + 1;
    activate(data);
  });

  productRequest = [lifeProfile];

  function activate(data) {
    if (vm.reqType === constants.production.PA.shortName) {
      finalQuotation();
    } else if (vm.reqType === constants.production.PFC.shortName) {
      pfcFinalComputeAll();
    } else {
      if (vm.reqType === constants.production.PGP.shortName || vm.reqType === constants.production.PGRP.shortName) {
        docId = updateDodId(vm.reqType, docId);
      } else if (vm.reqType === constants.production.PS.shortName) {
        const residentStatus = utils.getResidencyStatus();
        docId = constants.production[vm.reqType].residencyConfig[residentStatus].docId;
        productRequest[0].residentStatus = residentStatus;
      }
      apiService.getProductsByDocId(docId, productRequest).then(function (res) {
        let payload = res.data.payload;
        resortComponents(payload.components);
        if (vm.reqType === constants.production.PT.shortName || vm.reqType === constants.production.PAT.shortName) {
          vm.computeRequest = generateComputeRequest(vm.reqType, true, docId, lifeProfile, payload, vm.product);
        } else if (vm.reqType === constants.production.ET.shortName) {
          vm.computeRequest = generateETComputeRequest(vm.reqType, lifeProfile, payload);
          vm.computeRequest.customId = vm.profile.customID;
        } else if (vm.reqType === constants.production.PGP.shortName) {
          // PD-1530 As a prospective PGP Customer, I'm presented with the Policy Details Panel while I'm on the Application form and Review page
          vm.computeRequest = generateComputeRequest(vm.reqType, false, docId, lifeProfile, payload, vm.product);
        } else if (vm.reqType === constants.production.PGRP.shortName) {
          // PD-2045: for PGRP
          vm.computeRequest = generateComputeRequest(vm.reqType, false, docId, lifeProfile, payload, vm.product);
        } else if (vm.reqType === constants.production.PS.shortName) {
          vm.computeRequest = generateComputeRequest(vm.reqType, true, docId, lifeProfile, payload, vm.product);
        } else if (vm.reqType === constants.production.PFC.shortName) {
          vm.computeRequest = generateComputeRequest(vm.reqType, true, docId, lifeProfile, payload, vm.product);
        } else {
          // MAN & LADY
          vm.computeRequest = generateComputeRequest(vm.reqType, false, docId, lifeProfile, payload, vm.product);
        }
        vm.computeRequest.ccEnrollmentData = {
          mainPaymentMode: dataStoreService.getItem('basePaymentFrequency'),
          riderPaymentMode: dataStoreService.getItem('riderPaymentFrequency'),
          creditCardToken: ''
        };
        return apiService.encryption(`count=${vm.encryptionComputeLength}`);
      }).then(function (res) {
        computeRandom = res.data.random;
        computePublicKey = res.data.rsaPublicKey;
        vm.computeEncryptedReq = utils.setEncryptionList(vm.computeRequest, computePublicKey, computeRandom, vm.encryptComputeKeyList, vm.encryptComputeSubKeyList);
        if (constants.apiProdConfig[vm.reqType] === 1) {
          return apiService.apiComputeCommon(vm.computeEncryptedReq);
        }
        return apiService.computeCommonForSummary(vm.computeEncryptedReq);
      }).then(function (res) {
        // Premium validation failed if any payload attack happened
        if (parseInt(res.data.statusCode, 10) === 417) {
          errorsService.errorHandler(res.data);
          return new Promise().reject();
        }
        let payload = res.data.payload;
        payload.generatePDF = true;
        payload.customId = vm.customId;
        payload.reqType = vm.reqType;
        payload.erefCode = vm.erefCode ? utils.simpleEncrypt(vm.erefCode) : vm.erefCode;

        if (vm.reqType === constants.production.ET.shortName) {
          payload = restructureEtRequest(payload.selectedSQSProducts, vm.product, productRequest);
        } else if (vm.reqType === constants.production.PT.shortName) {
          resetPtProduct(vm.product, payload.selectedSQSProducts[0]);
        } else if (vm.reqType === constants.production.PGP.shortName) {
          resetPGPProduct(vm.product, payload.selectedSQSProducts[0]);
        } else if (vm.reqType === constants.production.PGRP.shortName) {
          const computeData = payload.selectedSQSProducts[0];
          if (computeData.components[0].yearlyPremium !== vm.tempYearlyPremium) {
            vm.tempYearlyPremium = angular.copy(vm.product.basic.yearlyPremium);
          }
          resetPGRPProduct(vm.product, payload.selectedSQSProducts[0]);
        } else if (vm.reqType === constants.production.PS.shortName) {
          resetPsProduct(vm.product, payload.selectedSQSProducts[0]);
        } else if (vm.reqType === constants.production.PM.shortName || vm.reqType === constants.production.PL.shortName) {
          resetPmPlProduct(vm.product, payload.selectedSQSProducts[0]);
        } else if (vm.reqType === constants.production.PFC.shortName) {
          resetPfcProduct(vm.product, payload.selectedSQSProducts[0]);
        } else if (vm.reqType === constants.production.PER.shortName || vm.reqType === constants.production.PAS.shortName) {
          payload.agentChannelCode = 'AD';
        }
        dataStoreService.setOrderItem(constants.production[vm.reqType].proInfo, vm.product);
        $scope.$broadcast('updateProduct');
        payload.selectedSQSProducts[0].paymentMode = dataStoreService.getItem('basePaymentFrequency');
        payload.ccEnrollmentData = {
          mainPaymentMode: dataStoreService.getItem('basePaymentFrequency'),
          riderPaymentMode: dataStoreService.getItem('riderPaymentFrequency'),
          creditCardToken: ''
        };
        const computeAllEncryptedReq = utils.setEncryptionList(payload, computePublicKey, computeRandom, vm.encryptComputeKeyList, vm.encryptComputeSubKeyList);
        if (constants.apiProdConfig[vm.reqType] === 1) {
          return apiService.apiComputeAll(computeAllEncryptedReq);
        }
        return apiService.computeAllForSummary(computeAllEncryptedReq);
      })
        .then(function (res) {
          if (parseInt(res.data.statusCode, 10) === 417) {
            errorsService.errorHandler(res.data);
          } else {
            let payload = res.data.payload;
            if (vm.reqType === constants.production.ET.shortName) {
              payload = restructureEtRequest(payload.selectedSQSProducts, vm.product, productRequest);
            } else if (vm.reqType === constants.production.PT.shortName) {
              resetPtProduct(vm.product, payload.selectedSQSProducts[0]);
            } else if (vm.reqType === constants.production.PGP.shortName) {
              resetPGPProduct(vm.product, payload.selectedSQSProducts[0]);
            } else if (vm.reqType === constants.production.PGRP.shortName) {
              const computeData = payload.selectedSQSProducts[0];
              if (computeData.components[0].yearlyPremium !== vm.tempYearlyPremium) {
                vm.tempYearlyPremium = angular.copy(vm.product.basic.yearlyPremium);
              }
              resetPGRPProduct(vm.product, payload.selectedSQSProducts[0]);
            } else if (vm.reqType === constants.production.PS.shortName) {
              resetPsProduct(vm.product, payload.selectedSQSProducts[0]);
            } else if (vm.reqType === constants.production.PM.shortName || vm.reqType === constants.production.PL.shortName) {
              resetPmPlProduct(vm.product, payload.selectedSQSProducts[0]);
            }
            dataStoreService.setOrderItem(constants.production[vm.reqType].proInfo, vm.product);
            $scope.$broadcast('updateProduct');
            vm.erefCode = res.data.payload.erefCode.length < 100 ? res.data.payload.erefCode : utils.simpleDecrypt(res.data.payload.erefCode);
            mailDetails.erefNo = vm.erefCode;
            dataStoreService.session.setObject('mailDetails', mailDetails);
            dataStoreService.setOrderItem('erefCode', vm.erefCode);
            dataStoreService.session.setObject('biPdfData', res.data.payload.pdfData);
            if (data) {
              $scope.$emit('changeDobValue', data);
            }
          }
        })
        .catch(function (error) {
          throw error;
        });
    }
  }

  function computePaAndPs() {
    occupation = dataStoreService.getItem('occupation') || {};
    const summaryReq = {
      reqType: vm.reqType,
      erefCode: vm.erefCode ? utils.simpleEncrypt(vm.erefCode) : vm.erefCode,
      occupationCode: occupation.occupationCode || '',
      age: utils.calculateAge(aboutYouDetails.dob) + 1,
      gender: aboutYouDetails.gender,
      smoker: vm.profile.smoker || false,
      name: (`${aboutYouDetails.givenName || ''} ${aboutYouDetails.surName}`),
      dob: aboutYouDetails.dob,
      occupation: occupation.occupation || '',
      occupationDesc: occupation.occupationDesc || '',
      totalYearlyPremium: '',
      premiumPA: 0,
      sumAssuredPA: 0,
      sumAssuredRA: 0,
      sumAssuredPAFE: 0,
      isMailingAddressSameAsHomeAddress: moreAboutYouDetails.isMailingAddress,
      homeAddress: {
        houseNo: moreAboutYouDetails.residentialBlockNo ? (`Blk ${moreAboutYouDetails.residentialBlockNo}`) : '',
        street: moreAboutYouDetails.residentialStreetName,
        unitNo: moreAboutYouDetails.residentialUnitNo,
        building: moreAboutYouDetails.residentialBuildingName,
        postcode: moreAboutYouDetails.residentialPostalCode,
        countryCode: moreAboutYouDetails.residentialCountry,
        city: constants.singaporeName
      },
      mailingAddress: {
        houseNo: moreAboutYouDetails.mailingBlockNo ? ('Blk ' + moreAboutYouDetails.mailingBlockNo) : '',
        street: moreAboutYouDetails.mailingStreetName,
        unitNo: moreAboutYouDetails.mailingUnitNo,
        building: moreAboutYouDetails.mailingBuildingName,
        postcode: moreAboutYouDetails.mailingPostalCode,
        countryCode: moreAboutYouDetails.mailingCountry,
        city: constants.singaporeName
      },
      nric: aboutYouDetails.nricFin,
      nationality: moreAboutYouDetails.nationality,
      phoneNo: (aboutYouDetails.idd + aboutYouDetails.mobilePhone).replace(/\+/g, ''),
      selectedCompoPlanOption: {
        optCode: '',
        optDescp: '',
        optValue: '',
        isOptValueEditable: false
      },
      selectedCompoOption: {
        optCode: '',
        optDescp: '',
        optValue: '',
        isOptValueEditable: false
      },
      customId: vm.customId
    };
    summaryReq.totalYearlyPremium = utils.clearCurrencyFormat(vm.product.totalYearlyPremium);
    summaryReq.premiumPA = utils.clearCurrencyFormat(vm.product.basic.yearlyPremium);
    summaryReq.sumAssuredPA = utils.clearCurrencyFormat(vm.product.basic.sumAssured);
    for (let rider of vm.product.rider) {
      switch (rider.compoCode) {
        case constants.production[vm.reqType].component.common.componentList[1]:
          summaryReq.premiumPAFE = utils.clearCurrencyFormat(rider.premium);
          summaryReq.sumAssuredPAFE = utils.clearCurrencyFormat(rider.sumAssured);
          summaryReq.selectedCompoOption.optCode = rider.optCode;
          summaryReq.selectedCompoOption.optDescp = rider.optDescp;
          break;
        case constants.production[vm.reqType].component.common.componentList[2]:
        case constants.production[vm.reqType].component.elder.componentList[2]:
          summaryReq.premiumRA = utils.clearCurrencyFormat(rider.premium);
          summaryReq.sumAssuredRA = utils.clearCurrencyFormat(rider.sumAssured);
          break;
        default:
          break;
      }
    }
    summaryReq.selectedCompoPlanOption.optCode = vm.product.basic.optCode;
    summaryReq.selectedCompoPlanOption.optDescp = vm.product.basic.optDescp;
    summaryReq.planCode = `Plan ${vm.product.basic.optCode}`;
    for (let rider of vm.product.rider) {
      switch (rider.compoCode) {
        case constants.production[vm.reqType].component.common.componentList[1]:
          summaryReq.planFCPA = `Plan ${rider.optCode}`;
          break;
        case constants.production[vm.reqType].component.common.componentList[2]:
        case constants.production[vm.reqType].component.elder.componentList[2]:
          summaryReq.planRA = `Plan ${rider.optCode}`;
          break;
        default:
          break;
      }
    }

    vm.encryptionLength = Object.keys(summaryReq.homeAddress).length + Object.keys(summaryReq.mailingAddress).length + 6 + 6;
    apiService.encryption(constants.encryptionRequestText + vm.encryptionLength).then(function (res) {
      let random = res.data.random;
      let publicKey = res.data.rsaPublicKey;
      let keyList1 = [
        'homeAddress',
        'mailingAddress',
        'name',
        'nric',
        'phoneNo'
      ];
      let subKeyList = [
        'building',
        'city',
        'countryCode',
        'houseNo',
        'postcode',
        'street',
        'unitNo',
        'mobileNumber',
        'businessName',
        'emailAddress'
      ];
      let encryptedSummaryReq = angular.copy(summaryReq);
      encryptedSummaryReq = utils.setEncryptionList(encryptedSummaryReq, publicKey, random, keyList1, subKeyList);
      return apiService.getSummary(encryptedSummaryReq);
    }).then(function (res) {
      // Premium validation failed if any payload attack happened
      if (parseInt(res.data.statusCode, 10) === 417) {
        errorsService.errorHandler(res.data);
        return;
      }
      vm.erefCode = res.data.erefCode.length < 100 ? res.data.erefCode : utils.simpleDecrypt(res.data.erefCode);
      mailDetails.erefNo = vm.erefCode;
      dataStoreService.session.setObject('mailDetails', mailDetails);
      dataStoreService.setOrderItem('erefCode', vm.erefCode);
      res.data.file = res.data.pdfFile;
      res.data.checksum = res.data.pdfMD5 ? res.data.pdfMD5 : res.data.checksum;
      dataStoreService.session.setObject('biPdfData', res.data);

      dataStoreService.setOrderItem('product', vm.product);
      dataStoreService.session.setObject('product', vm.product);
      $scope.$broadcast('updateProduct');
    }).catch(function (error) {
      throw error;
    });
  }

  // PACSDP-922 next btn handler for PAS and else.

  vm.proxyOnClick = proxyOnClick;
  function proxyOnClick() {
    const dobChanged = dataStoreService.getItem('dobHasBeenChanged');
    const isPAS = vm.reqType === constants.production.PAS.shortName;
    if (vm.reqType === constants.production.PS.shortName) {
      const shieldAPS = dataStoreService.getItem('shieldAPSOption');
      if (shieldAPS) {
        $state.go('app.shieldAPS', { type: 'shieldAPS' });
      }
    }
    if (vm.selectedCountry !== '65_SGP') {
      utils.openResidentialModel(constants.crossBorderMsg.foreignContactNumber);
    } else if (isPAS && dobChanged) {
      utils.openRestartWarningModal(vm.customId, isPAS && dobChanged);
    } else {
      vm.makePayment();
    }
  }

  function checkAndRedirectHelpPage() {
    const shieldQ = dataStoreService.getItem('shieldQ');
    let isGoodHealth = true;
    if (!shieldQ) return false;

    const hqMap = dataStoreService.getItem('hqMap');
    const failedQ = [];
    const pushFailedQuestions = (qCode, answer) => {
      const questionObj = hqMap[qCode];
      if (questionObj) {
        const {
          parent: parentQuestionId,
          code: questionnaireId,
          description: question
        } = questionObj;
        const parentQObj = hqMap[parentQuestionId] || {};
        const { description: parentQuestion = '' } = parentQObj;
        failedQ.push({
          customId: vm.profile.customID,
          productCode: vm.product.prodCode,
          parentQuestionId,
          questionnaireId,
          question: question || parentQuestion,
          selectedAnswer: answer || 'true'
        });
      }
    };

    shieldQ.medicalConditions.forEach((mQ) => {
      (mQ.code !== 'HQ00') && mQ.options && mQ.options.forEach((mQOpt) => {
        if (mQOpt.checked) {
          isGoodHealth = false;
          // if (mQOpt.subQuestion && mQOpt.subQuestion.value) {
          //   pushFailedQuestions(mQOpt.subQuestion.code, mQOpt.subQuestion.value);
          // }
          const answer = (mQOpt.subQuestion && mQOpt.subQuestion.value) || undefined;
          pushFailedQuestions(mQOpt.code, answer);
        }
      });
    });

    if (shieldQ.medicalHistory && shieldQ.medicalHistory.length > 0) {
      shieldQ.medicalHistory.forEach((mhQ) => {
        if (mhQ.value) {
          isGoodHealth = false;
          pushFailedQuestions(mhQ.code);
        }
      });
    }
    if (shieldQ.medicalSIOHistory && shieldQ.medicalSIOHistory.length > 0) {
      shieldQ.medicalSIOHistory.forEach((mhQ) => {
        if (mhQ.value) {
          isGoodHealth = false;
          pushFailedQuestions(mhQ.code);
        }
      });
    }
    // shieldQ.otherQuestions.forEach((othQ) => {
    //   if (othQ.value) {
    //     isGoodHealth = false;
    //     pushFailedQuestions(othQ.code);
    //   }
    // });

    if (isGoodHealth) return false;

    apiService.saveFailedQuestionnaire(failedQ);
    if (vm.channel === 'DBS') {
      $state.go('app.redirectGetHelp');
      return true;
    }
    if (!utils.eligibilityValidation(vm.reqType, vm.loginStatus)) {
      const leadGenPage = vm.isV2UX ? 'app.leadGenThankV2' : 'app.leadGenThank';
      $state.go(leadGenPage);
      return true;
    } else {
      dataStoreService.setItem('errorHander', {
        message: 'Since you have an existing health conditions, in order to complete your application we will need additional information'
      });
      // utils.redirectToHelp();
      const leadGenPage = vm.isV2UX ? 'app.leadGenThankV2' : 'app.leadGenThank';
      $state.go(leadGenPage);
      return true;
    }
  }

  function triggerDeclaration() {
    // temp check need clean validation before stage
    if (vm.reqType === constants.production.PS.shortName) {
      const needHelp = checkAndRedirectHelpPage();
      if (needHelp) return;
    }
    // Medical Consent Check validation && kickout check
    if (vm.reqType === constants.production.PC.shortName || vm.reqType === constants.production.PAT.shortName) {
      if (vm.doMedicalConsentValidation && !vm.doMedicalConsentValidation()) {
        utils.scrollToFirstInvalidField();
        vm.showError = true;
        return;
      }
      var kickoutFlag = dataStoreService.getItem('kickoutFlag');
      var kickoutQ = _.filter(dataStoreService.getItem('kickoutQ'), function (item) {
        return item;
      });
      if (kickoutFlag || kickoutQ.length > 0) {
        utils.kickoutSendMail(dataStoreService);
        return;
      }
    }
    modalInstance = $uibModal.open({
      animation: true,
      appendTo: angular.element('.main-container'),
      windowClass: 'your-declaration-common',
      component: 'yourDeclarationsCommon',
      resolve: {
        profile: vm.profile
      },
      size: 'fs'
    });
    modalInstance.result.then(function (status) {
      // 1 for accept
      if (status === 1) {
        if (vm.creditCardEnrollmentEnabled && vm.reqType === 'PS') {
          confirmation();
        } else {
          vm.makePayment();
        }
      }
    });
  }

  function genCybSign() {
    aboutYouDetails = dataStoreService.getOrderItem('aboutYouDetails');
    moreAboutYouDetails = dataStoreService.getOrderItem('moreAboutYouDetails');
    let addLine = moreAboutYouDetails.mailingUnitNo + ' ' + moreAboutYouDetails.mailingBlockNo + ' ' + moreAboutYouDetails.residentialStreetName;
    let country = dataStoreService.getItem('countryInfo').find((element) => {
      let result = element.code === moreAboutYouDetails.residentialCountryCode;
      return result;
    });
    // Remove all the special characters from the names before passing to cybersource, since cybersource
    // will not accept some of the special characters
    const billSurName = aboutYouDetails.surName.replace(/[^a-zA-Z ]/g, '');
    const billGivenName = aboutYouDetails.givenName.replace(/[^a-zA-Z ]/g, '') || dummyFirstName;

    signRequest = {
      access_key: '',
      profile_id: '',
      bill_to_address_line1: addLine,
      bill_to_address_city: constants.singaporeShort,
      bill_to_address_country: country.isoCode,
      bill_to_email: aboutYouDetails.customerEmail,
      bill_to_surname: billSurName,
      bill_to_forename: billGivenName,
      signed_field_names: 'access_key,profile_id,transaction_uuid,signed_field_names,unsigned_field_names,signed_date_time,locale,transaction_type,reference_number,amount,currency,bill_to_address_line1,bill_to_address_city,bill_to_address_country,bill_to_email,bill_to_surname,bill_to_forename',
      transaction_type: 'create_payment_token',
      reference_number: dataStoreService.getOrder().erefCode,
      amount: vm.product.totalYearlyPremium,
      currency: vm.profile.currencyCode || constants.currency.SGD,
      unsigned_field_names: '',
      transaction_uuid: '',
      signed_date_time: '',
      locale: 'en-US',
      customId: vm.customId
    };

    // PRUSHIELD
    if (vm.reqType === constants.production.PS.shortName) {
      const hasDiscount = vm.product.hasDiscount || (vm.product.rider && vm.product.rider.length > 0 && vm.product.rider[0].hasDiscount);
      signRequest.amount = hasDiscount ? parseFloat(vm.product.payableByCreditcardYearlyDiscounted).toFixed(2) : parseFloat(vm.product.payableByCreditcardYearly).toFixed(2);
    }

    // PER & PC
    if (((vm.reqType === constants.production.PER.shortName) && (vm.product.paymentOption === constants.perPaymentQ.card.value))
      || vm.reqType === constants.production.PC.shortName) {
      signRequest.amount = vm.product.hasDiscount ? parseFloat(vm.product.discountedPremium).toFixed(2) : parseFloat(vm.product.yearlyPremium).toFixed(2);
    }

    // PM & PL
    if (vm.reqType === constants.production.PL.shortName || vm.reqType === constants.production.PM.shortName) {
      signRequest.amount = vm.product.hasDiscount ? parseFloat(vm.product.basic.discountedPremium).toFixed(2) : parseFloat(vm.product.basic.yearlyPremium).toFixed(2);
    }
    // PA
    if (vm.reqType === constants.production.PA.shortName) {
      signRequest.amount = vm.product.hasDiscount ? parseFloat(vm.product.totalDiscountPremium).toFixed(2) : parseFloat(vm.product.totalYearlyPremium).toFixed(2);
    }
    if (vm.reqType === constants.production.PAT.shortName) {
      signRequest.amount = vm.product.hasDiscount ? parseFloat(vm.product.discountedPremium).toFixed(2) : parseFloat(vm.product.totalYearlyPremium).toFixed(2);
    }
    return new Promise((resolve, reject) => {
      apiService.encryption().then(function (res) {
        let random = res.data.random;
        let publicKey = res.data.rsaPublicKey;
        let keyList = ['bill_to_address_line1', 'bill_to_address_city', 'bill_to_address_country', 'bill_to_email', 'bill_to_surname', 'bill_to_forename', 'amount', 'currency', 'customId', 'reference_number'];
        let encryptedReq = utils.setEncryptionList(signRequest, publicKey, random, keyList);
        encryptedReq.field_to_decypt = keyList.join();
        resolve(apiService.genCybSign(encryptedReq));
      }).catch(function (e) {
        reject(e);
      });
    });
  }

  function makePayment() {
    // clear invalid fields
    vm.aboutYouDetails = dataStoreService.getOrderItem('aboutYouDetails');
    const { isMedisave, payableByCreditcardYearly, payableByCreditcardYearlyDiscounted, yearlyPremium, discountedPremium, rider } = dataStoreService.getOrderItem(constants.production[vm.reqType].proInfo);
    const partnerChannel = dataStoreService.getItem('partnerChannel');
    if (!vm.editField) {
      // PD-1070,PD-1071,PD-1088,PD-1089,PD-1090,PD-1091,PD-1092 remove confirm read question from all product.
      if (vm.doCommonConsentValidation()) {
        // Generate Proposal PDF
        createPdf().then(function () {
          if (vm.reqType === constants.production.PGP.shortName || vm.reqType === constants.production.PGRP.shortName) {
            // Task 1844: check the amount limitation for PGP product, if exceeded, redirect to lead gen page
            if (vm.reqType === constants.production.PGP.shortName) {
              let channel = dataStoreService.getItem('channel');
              let request = {
                customId: vm.profile.customID,
                currency: vm.profile.currencyCode,
                channel: channel === constants.channel.SCB ? constants.channel.SCB : constants.prudential,
                amount: vm.product.basic.singlePremium,
                erefNo: vm.erefCode
              };
              apiService.getAndsetPgpRemaingBalance(request).then((res) => {
                vm.trancheLimit = res.data.payload;
                let totalYearlyPremium = dataStoreService.getOrderItem(constants.production[vm.profile.type].proInfo).totalYearlyPremium;
                if (vm.trancheLimit < totalYearlyPremium) {
                  $state.go('app.unavailablePGP');
                } else {
                  dataStoreService.setOrderItem('paymentGateway', vm.paymentGateway);
                  dataStoreService.setItem('showSaveMessage', false);
                  $state.go(vm.path);
                }
              });
            } else {
              dataStoreService.setOrderItem('paymentGateway', vm.paymentGateway);
              dataStoreService.setItem('showSaveMessage', false);
              $state.go(vm.path);
            }
          } else if (
            vm.reqType === constants.production.PS.shortName
            && isMedisave
            && (vm.product.hasDiscount ? !payableByCreditcardYearlyDiscounted : !payableByCreditcardYearly)
            && rider.length === 0
          ) {
            dataStoreService.setOrderItem('paymentGateway', vm.paymentGateway);
            dataStoreService.setItem('showSaveMessage', false);
            $state.go(vm.path);
          // PC - Payment Flow
          } else if (
            (vm.reqType === constants.production.PC.shortName || vm.reqType === constants.production.PAT.shortName)
            && (vm.product.hasDiscount ? !discountedPremium : !yearlyPremium)
          ) {
            dataStoreService.setOrderItem('paymentGateway', vm.paymentGateway);
            dataStoreService.setItem('showSaveMessage', false);
            $state.go(vm.path);
          } else if (
            // PER - Credit Card Payment Flow
            vm.reqType === constants.production.PER.shortName
            && (vm.product.hasDiscount ? !discountedPremium : !yearlyPremium)
            && (vm.product.paymentOption === constants.perPaymentQ.card.value)
          ) {
            dataStoreService.setOrderItem('paymentGateway', vm.paymentGateway);
            dataStoreService.setItem('showSaveMessage', false);
            $state.go(vm.path);
          } else if (
            // PER - CASH and UOB Payment Flow
            vm.reqType === constants.production.PER.shortName
            && ((vm.product.paymentOption === constants.perPaymentQ.cash.value) || (partnerChannel === constants.channel.UOB))
          ) {
            $state.go(vm.path);
          } else {
            // PACSDP-664 PAS - SRS or other payment flow
            if (vm.reqType === constants.production.PAS.shortName
              && ((vm.product.basic && vm.product.basic.isSinglePremium) || (vm.product.paymentOption !== constants.paymentQ.card.value))
            ) {
              dataStoreService.setOrderItem('paymentGateway', vm.paymentGateway);
              dataStoreService.setItem('showSaveMessage', false);
              let path = 'app.confirmationPas';
              const paymentMethod = dataStoreService.getOrderItem('paymentQ');
              if (paymentMethod && (paymentMethod.includes(constants.paymentQMethod.intend) || paymentMethod.includes(constants.paymentQMethod.srs))) {
                path = 'app.confirmation';
              }
              return $state.go(path);
            }
            // Generate make payment url
            // temporary hardcode for old payment gateway
            genCybSign().then((res) => {
              signRequest.signature = res.data.signature;
              signRequest.signed_date_time = res.data.signedDateTime;
              signRequest.transaction_uuid = res.data.transactionUuid;
              signRequest.access_key = res.data.accessKey;
              signRequest.profile_id = res.data.profileId;
              signRequest.cybCheckoutUrl = res.data.cybCheckoutUrl;
              dataStoreService.session.setObject('signRequest', signRequest);
              $state.go('cyberpay');
            }, (rej) => {
              throw rej;
            });
          }
        }).catch(function (error) {
          throw error;
        });
      } else {
        vm.showError = true;
        utils.scrollToFirstInvalidField();
      }
    } else {
      saveChanges();
    }
  }

  function confirmation() {
    // clear invalid fields
    vm.aboutYouDetails = dataStoreService.getOrderItem('aboutYouDetails');
    const { isMedisave, payableByCreditcardYearly, payableByCreditcardYearlyDiscounted, yearlyPremium, discountedPremium, rider } = dataStoreService.getOrderItem(constants.production[vm.reqType].proInfo);
    const partnerChannel = dataStoreService.getItem('partnerChannel');
    if (!vm.editField) {
      // PD-1070,PD-1071,PD-1088,PD-1089,PD-1090,PD-1091,PD-1092 remove confirm read question from all product.
      if (vm.doCommonConsentValidation()) {
        // Generate Proposal PDF
        createPdf().then(function () {
          if (vm.reqType === constants.production.PGP.shortName || vm.reqType === constants.production.PGRP.shortName) {
            // Task 1844: check the amount limitation for PGP product, if exceeded, redirect to lead gen page
            if (vm.reqType === constants.production.PGP.shortName) {
              let channel = dataStoreService.getItem('channel');
              let request = {
                customId: vm.profile.customID,
                currency: vm.profile.currencyCode,
                channel: channel === constants.channel.SCB ? constants.channel.SCB : constants.prudential,
                amount: vm.product.basic.singlePremium,
                erefNo: vm.erefCode
              };
              apiService.getAndsetPgpRemaingBalance(request).then((res) => {
                vm.trancheLimit = res.data.payload;
                let totalYearlyPremium = dataStoreService.getOrderItem(constants.production[vm.profile.type].proInfo).totalYearlyPremium;
                if (vm.trancheLimit < totalYearlyPremium) {
                  $state.go('app.unavailablePGP');
                } else {
                  dataStoreService.setOrderItem('paymentGateway', vm.paymentGateway);
                  dataStoreService.setItem('showSaveMessage', false);
                  $state.go(vm.path);
                }
              });
            } else {
              dataStoreService.setOrderItem('paymentGateway', vm.paymentGateway);
              dataStoreService.setItem('showSaveMessage', false);
              $state.go(vm.path);
            }
          } else if (
            vm.reqType === constants.production.PS.shortName
            && isMedisave
            && (vm.product.hasDiscount ? !payableByCreditcardYearlyDiscounted : !payableByCreditcardYearly)
            && rider.length === 0
          ) {
            dataStoreService.setOrderItem('paymentGateway', vm.paymentGateway);
            dataStoreService.setItem('showSaveMessage', false);
            $state.go(vm.path);
          // PC - Payment Flow
          } else if (
            (vm.reqType === constants.production.PC.shortName || vm.reqType === constants.production.PAT.shortName)
            && (vm.product.hasDiscount ? !discountedPremium : !yearlyPremium)
          ) {
            dataStoreService.setOrderItem('paymentGateway', vm.paymentGateway);
            dataStoreService.setItem('showSaveMessage', false);
            $state.go(vm.path);
          } else if (
            // PER - Credit Card Payment Flow
            vm.reqType === constants.production.PER.shortName
            && (vm.product.hasDiscount ? !discountedPremium : !yearlyPremium)
            && (vm.product.paymentOption === constants.perPaymentQ.card.value)
          ) {
            dataStoreService.setOrderItem('paymentGateway', vm.paymentGateway);
            dataStoreService.setItem('showSaveMessage', false);
            $state.go(vm.path);
          } else if (
            // PER - CASH and UOB Payment Flow
            vm.reqType === constants.production.PER.shortName
            && ((vm.product.paymentOption === constants.perPaymentQ.cash.value) || (partnerChannel === constants.channel.UOB))
          ) {
            $state.go(vm.path);
          } else if (vm.reqType === constants.production.PAS.shortName
          && ((vm.product.basic && vm.product.basic.isSinglePremium)
          || (vm.product.paymentOption !== constants.paymentQ.card.value))) {
            dataStoreService.setOrderItem('paymentGateway', vm.paymentGateway);
            dataStoreService.setItem('showSaveMessage', false);
            let path = 'app.confirmationPas';
            path = 'app.confirmation';
            return $state.go(path);
          }
          let path = 'app.confirmation';
          return $state.go(path);
        }).catch(function (error) {
          throw error;
        });
      } else {
        vm.showError = true;
        utils.scrollToFirstInvalidField();
      }
    } else {
      saveChanges();
    }
  }

  // PD-1450 Remove the Section "What you are buying" and "Declaration"
  function saveChanges() {
    // to avoid message delay, reset the flg
    vm.showError = false;
    vm.validateAboutYou();
    vm.validateMoreAboutYou();
    // PD-2045: for PGRP
    if (
      vm.reqType !== constants.production.PA.shortName
      && vm.reqType !== constants.production.PGP.shortName
      && vm.reqType !== constants.production.PGRP.shortName
      && vm.reqType !== constants.production.PAS.shortName
      && vm.reqType !== constants.production.PER.shortName
      && (vm.reqType === constants.production.PAT.shortName && vm.profile.smoker === 1)) {
      vm.validateHealth();
    } else {
      $rootScope.healthAndLifestyle = true;
    }

    if ((vm.reqType === constants.production.PGP.shortName && vm.profile.currencyCode === constants.currency.SGD && vm.age > 17) || (vm.reqType === constants.production.PGRP.shortName && vm.age > 17)) {
      vm.getPaymentOptionValidation();
    } else {
      $rootScope.paymentOption = true;
    }

    if ((vm.isPERdirectEntry)) {
      vm.getPaymentOptionValidation();
    }

    if (vm.showUpload && !vm.hideDocUpload) {
      vm.uploadDocumentValidation();
    }
    $rootScope.assignConsultant = true;
    // PACSDP-952: PAS payment validation
    if (vm.reqType === constants.production.PAS.shortName && vm.product.basic.isSinglePremium) {
      vm.getPaymentOptionValidation();
      const selectedOption = dataStoreService.getOrderItem('paymentQ');
      selectedOption && dataStoreService.setItem('kickoutFlag', !utils.validatePaymentOption(selectedOption));
    }

    $timeout(function () {
      if ($rootScope.aboutYou && $rootScope.moreAboutYou && $rootScope.healthAndLifestyle && $rootScope.assignConsultant && $rootScope.paymentOption && ((vm.showUpload && !vm.hideDocUpload) ? $rootScope.uploadYourDocument : true)) {
        vm.showError = false;
        vm.aboutYouDetails = dataStoreService.getOrderItem('aboutYouDetails');
        vm.moreAboutYouDetails = dataStoreService.getOrderItem('moreAboutYouDetails');
        vm.QMAYData = dataStoreService.getOrderItem('QMAYData');
        vm.QPSData = dataStoreService.getOrderItem('QPSData');
        vm.paymentQuestionnaire = dataStoreService.getOrderItem('paymentQuestionnaire');
        vm.healthDetails = dataStoreService.getOrderItem('healthDetails');
        vm.healthDeclarations = dataStoreService.getOrderItem('healthDeclarations');

        if (!utils.eligibilityValidation(vm.reqType, vm.loginStatus)) {
          const leadGenPage = vm.isV2UX ? 'app.leadGenThankV2' : 'app.leadGenThank';
          $state.go(leadGenPage);
          return;
        }
        // for PER, temporary changes to pass the foreigners pass type
        if (vm.reqType === 'PER' || vm.reqType === 'PC' || vm.reqType === 'PAT') {
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
          title: vm.aboutYouDetails.title,
          surName: vm.aboutYouDetails.surName,
          givenName: vm.aboutYouDetails.givenName,
          nricFin: vm.aboutYouDetails.nricFin,
          idd: vm.aboutYouDetails.idd,
          mobilePhone: vm.aboutYouDetails.idd + '' + vm.aboutYouDetails.mobilePhone, // fix PD-1485:Mobile number country code error
          phoneIDD: vm.aboutYouDetails.phoneIDD,
          phoneCountryCode: vm.aboutYouDetails.phoneCountryCode,
          clientNumber: dataStoreService.getItem('clientNumber') || null,
          gender: vm.aboutYouDetails.gender,
          nationality: vm.moreAboutYouDetails.nationality,
          dob: vm.aboutYouDetails.dob,
          customerEmail: vm.aboutYouDetails.customerEmail,
          mailingUnitNo: vm.moreAboutYouDetails.mailingUnitNo,
          mailingStreetName: vm.moreAboutYouDetails.mailingStreetName,
          mailingBuildingName: vm.moreAboutYouDetails.mailingBuildingName,
          mailingBlockNo: vm.moreAboutYouDetails.mailingBlockNo,
          mailingPostalCode: vm.moreAboutYouDetails.mailingPostalCode,
          residentialUnitNo: vm.moreAboutYouDetails.residentialUnitNo,
          residentialStreetName: vm.moreAboutYouDetails.residentialStreetName,
          residentialBuildingName: vm.moreAboutYouDetails.residentialBuildingName,
          residentialBlockNo: vm.moreAboutYouDetails.residentialBlockNo,
          residentialPostalCode: vm.moreAboutYouDetails.residentialPostalCode,
          residentialCountry: vm.moreAboutYouDetails.residentialCountry,
          residencyStatus: vm.moreAboutYouDetails.residencyStatus,
          mailingCountry: vm.moreAboutYouDetails.mailingCountry,
          annualIncome: vm.moreAboutYouDetails.annualIncome,
          height: vm.healthDetails ? vm.healthDetails.height : 0,
          weight: vm.healthDetails ? vm.healthDetails.weight : 0,
          // combine SRS question to more about you questions
          qmayQuestionnaires: JSON.stringify(vm.paymentQuestionnaire ? vm.QMAYData.concat(vm.paymentQuestionnaire) : vm.QMAYData),
          qpsQuestionnaires: JSON.stringify(vm.QPSData) || '',
          requestFinancialConsultant: vm.aboutYouDetails.requestFinancialConsultant,
          agentChange: vm.agentChangeFlg,
          selectedProducts: {
            docId: vm.product.docId,
            prodCode: vm.product.prodCode,
            components: [{
              compoCode: vm.product.basic.compoCode,
              isBasic: true
            }]
          }
        };
        vm.profile.gender = vm.aboutYouDetails.gender;
        vm.saveEncrptionRequest = angular.copy(vm.saveAllRequest);
        vm.isSmoker = _.find(vm.QPSData, function (item) {
          return item.question.code === 'QPS005';
        });
        if (vm.isSmoker) {
          if (vm.isSmoker.answer.value === 'true') {
            vm.profile.smoker = 1;
          } else {
            vm.profile.smoker = 2;
          }
          // used to be here
          // dataStoreService.session.setObject('profile', vm.profile);
        }
        // move out save profile logoic
        dataStoreService.session.setObject('profile', vm.profile);

        apiService.encryption(constants.encryptionRequestText + vm.encryptionLength).then(function (res) {
          let random = res.data.random;
          let publicKey = res.data.rsaPublicKey;
          vm.saveEncrptionRequest = utils.setEncryptionList(vm.saveEncrptionRequest, publicKey, random, vm.encryptKeyList);
          return apiService.saveAllCustomerInputInfo(vm.saveEncrptionRequest);
        }).then(function () {
          let kickoutFlag = dataStoreService.getItem('kickoutFlag');
          let kickoutQ = _.filter(dataStoreService.getItem('kickoutQ'), function (item) {
            return item;
          });
          if (kickoutFlag || kickoutQ.length > 0) {
            utils.kickoutSendMail(dataStoreService);
          } else {
            dataStoreService.setItem('showSaveMessage', true);
            $state.reload();
          }
        }).catch(function (error) {
          $rootScope.nextDisable = false;
          throw error;
        });
      } else {
        vm.showError = true;
        utils.scrollToFirstInvalidField();
      }
    }, 0);
  }

  function createPdf() {
    vm.dobDate = formatDate();
    let pdfDataRequest = utils.getPdfDataRequest(vm.profile, vm.erefCode, vm.marketingConsent, vm.product, aboutYouDetails.requestFinancialConsultant);
    vm.pdfService = constants.production[vm.reqType].proposalPdf;
    return apiService.generatePdf(pdfDataRequest, vm.pdfService);
  }

  function formatDate() {
    let dobDay = angular.copy(new Date(aboutYouDetails.dob).getDate());
    let dobMonth = monthArray[new Date(aboutYouDetails.dob).getMonth()];
    let dobYear = angular.copy(new Date(aboutYouDetails.dob).getFullYear());
    return dobDay + ' ' + dobMonth + ' ' + dobYear;
  }

  function resortComponents(originalComponents) {
    if (vm.reqType === constants.production.PS.shortName) {
      vm.productRiders = [];
      const {
        basic: {
          compoCode
        },
        rider: [rider]
      } = vm.product;
      originalComponents.forEach((component) => {
        if (component.compoCode === compoCode) {
          vm.basicComponent = {
            ...component,
            isBasic: true
          };
        } else if (rider && rider.compoCode === component.compoCode) {
          vm.productRiders.push({
            ...component
          });
        }
      });
    } else {
      vm.productRiders = [];
      for (let i in originalComponents) {
        if (originalComponents[i].isBasic === true) {
          vm.basicComponent = originalComponents[i];
        } else if (originalComponents[i].isBasic === false && originalComponents[i].isDefault === true) {
          vm.defaultComponent = originalComponents[i];
          vm.productRiders.push(originalComponents[i]);
        } else {
          vm.riderComponent = originalComponents[i];
          vm.productRiders.push(originalComponents[i]);
        }
      }
    }
  }

  function getIframeStyle() {
    return {
      width: $window.innerWidth + 'px',
      height: $window.innerHeight + 'px'
    };
  }

  function openCancelModal() {
    utils.openCancelModal(vm.customId);
  }

  // PD-2056 Legal Updates for All Products
  function openYourConsentModal() {
    modalInstance = $uibModal.open({
      animation: true,
      backdrop: 'static',
      component: 'yourConsentModal',
      resolve: {},
      windowClass: 'your-consent-modal'
    });
    modalInstance.result.then(function () {
      if (modalInstance.result.$$state.value === 'continue') {
        vm.makePayment();
      }
    });
  }

  function restructureEtRequest(itemList, product, lifeProfileParam) {
    let components = [];
    itemList.forEach(function (e) {
      if (e && product.basic.optCode === e.components[0].selectedCompoPlanOption.optCode) {
        components = e;
      }
    });
    if (product.rider && product.rider.length === 0) {
      for (let i = 0; i < components.components.length; i++) {
        if (components.components[i].compoCode.substr(0, 3) === constants.production[vm.reqType].component.prefix) {
          components.components.splice(i, 1);
          i--;
        }
      }
    }
    for (let i = 0; i < components.components.length; i++) {
      let detail = components.components[i];
      if (detail.compoCode[detail.compoCode.length - 1] !== product.basic.compoCode[product.basic.compoCode.length - 1]) {
        components.components.splice(i, 1);
        i--;
      }
    }
    let selectedSQSProductsAll = [components];
    vm.computeRequestAll = {
      customId: vm.customId,
      lifeProfiles: lifeProfileParam,
      generatePDF: true,
      selectedSQSProducts: selectedSQSProductsAll
    };
    if (components.components.length === 1) {
      components.totalPremium = components.components[0].premium;
      components.totalYearlyPremium = components.components[0].yearlyPremium;
      components.totalHalfYearlyPremium = components.components[0].halfYearlyPremium;
      components.totalQuarterlyPremium = components.components[0].quarterlyPremium;
      components.totalMonthlyPremium = components.components[0].monthlyPremium;
    }
    product.basic.premium = components.components[0].premium;
    product.basic.yearlyPremium = components.components[0].yearlyPremium;
    product.totalYearlyPremium = product.basic.yearlyPremium;
    if (components.components.length > 1) {
      product.totalYearlyPremium += components.components[1].yearlyPremium;
    }
    return vm.computeRequestAll;
  }

  function resetPsProduct(product, computeResPayload) {
    product.totalYearlyPremium = computeResPayload.totalYearlyPremium;
    product.basic.compoCode = computeResPayload.components[0].compoCode;
    product.basic.compoName = computeResPayload.components[0].compoDesc;
    product.basic.premium = computeResPayload.components[0].premium;
    product.basic.yearlyPremium = computeResPayload.components[0].yearlyPremium;
    product.basic.halfYearlyPremium = computeResPayload.components[0].halfYearlyPremium;
    product.basic.quarterlyPremium = computeResPayload.components[0].quarterlyPremium;
    product.basic.monthlyPremium = computeResPayload.components[0].monthlyPremium;
    product.basic.term = computeResPayload.components[0].term;
  }

  function resetPtProduct(product, computeResPayload) {
    product.totalYearlyPremium = computeResPayload.totalYearlyPremium;
    for (let i in computeResPayload.components) {
      if (product.basic.compoCode === computeResPayload.components[i].compoCode) {
        product.basic.premium = computeResPayload.components[i].premium;
        product.basic.yearlyPremium = computeResPayload.components[i].yearlyPremium;
        product.basic.halfYearlyPremium = computeResPayload.components[i].halfYearlyPremium;
        product.basic.quarterlyPremium = computeResPayload.components[i].quarterlyPremium;
        product.basic.monthlyPremium = computeResPayload.components[i].monthlyPremium;
      }
      for (let j in product.rider) {
        if (product.rider[j].compoCode === computeResPayload.components[i].compoCode) {
          product.rider[j].premium = computeResPayload.components[i].premium;
          product.rider[j].yearlyPremium = computeResPayload.components[i].yearlyPremium;
          product.rider[j].halfYearlyPremium = computeResPayload.components[i].halfYearlyPremium;
          product.rider[j].quarterlyPremium = computeResPayload.components[i].quarterlyPremium;
          product.rider[j].monthlyPremium = computeResPayload.components[i].monthlyPremium;
        }
      }
    }
  }

  function resetPGPProduct(product, computeResPayload) {
    let currency = vm.profile.currencyCode === constants.currency.SGD ? constants.currency.sgdShort : constants.currency.usdShort;
    let benefitsValue = setBenefits(computeResPayload.tables.MAIN_BENEFIT_TABLE.data);
    product.guaranteedPayout = benefitsValue[0];
    product.basic.compoCode = computeResPayload.components[0].compoCode;
    product.basic.compoName = computeResPayload.components[0].compoDesc;
    product.basic.singlePremium = computeResPayload.components[0].singlePremium;
    product.whatYouBuy.description = [{
      text: `Receive ${currency}$ ${$filter('number')(benefitsValue[0])} upon the maturity of your policy`,
    }, {
      text: `Receive ${currency}$ ${$filter('number')(benefitsValue[1])} in the event of your death during the term of your policy`
    }];
  }

  function resetPGRPProduct(product, computeResPayload) {
    product.totalYearlyPremium = computeResPayload.totalYearlyPremium;
    product.term = computeResPayload.components[0].term;
    product.basic.compoCode = computeResPayload.components[0].compoCode;
    product.basic.compoName = computeResPayload.components[0].compoDesc;
    product.basic.premium = computeResPayload.components[0].premium;
    product.basic.yearlyPremium = computeResPayload.components[0].yearlyPremium;
    product.basic.halfYearlyPremium = computeResPayload.components[0].halfYearlyPremium;
    product.basic.quarterlyPremium = computeResPayload.components[0].quarterlyPremium;
    product.basic.monthlyPremium = computeResPayload.components[0].monthlyPremium;
    product.basic.term = computeResPayload.components[0].term;
    product.basic.singlePremium = computeResPayload.components[0].singlePremium;

    // Update PGRP product info in response Payload for SelectedPolicyOption --- Not returned from Service.
    computeResPayload.selectedPolicyOption = product.basic.selectedPolicyOption;
  }

  function resetPmPlProduct(product, computeResPayload) {
    product.totalYearlyPremium = computeResPayload.totalYearlyPremium;
    product.term = computeResPayload.components[0].term;
    product.basic.premium = computeResPayload.components[0].premium;
    product.basic.yearlyPremium = computeResPayload.components[0].yearlyPremium;
    product.basic.halfYearlyPremium = computeResPayload.components[0].halfYearlyPremium;
    product.basic.quarterlyPremium = computeResPayload.components[0].quarterlyPremium;
    product.basic.monthlyPremium = computeResPayload.components[0].monthlyPremium;
    product.basic.term = computeResPayload.components[0].term;
  }

  function resetPfcProduct(product, computeResPayload) {
    product.totalYearlyPremium = computeResPayload.totalYearlyPremium;
    product.sumAssured = computeResPayload.components[0].sumAssured;
    product.basic.sumAssured = computeResPayload.components[0].sumAssured;
    product.basic.premium = computeResPayload.components[0].yearlyPremium;
    product.basic.yearlyPremium = computeResPayload.components[0].yearlyPremium;
    product.basic.halfYearlyPremium = computeResPayload.components[0].halfYearlyPremium;
    product.basic.quarterlyPremium = computeResPayload.components[0].quarterlyPremium;
    product.basic.monthlyPremium = computeResPayload.components[0].monthlyPremium;
    product.basic.singlePremium = computeResPayload.components[0].singlePremium;
    product.rider[0].sumAssured = computeResPayload.components[1].sumAssured;
    product.rider[0].premium = computeResPayload.components[1].yearlyPremium;
    product.rider[0].yearlyPremium = computeResPayload.components[1].yearlyPremium;
    product.rider[0].halfYearlyPremium = computeResPayload.components[1].halfYearlyPremium;
    product.rider[0].quarterlyPremium = computeResPayload.components[1].quarterlyPremium;
    product.rider[0].monthlyPremium = computeResPayload.components[1].monthlyPremium;
    product.pfcParams.totalDeathBenefit = computeResPayload.totalDeathBenefit;
    product.pfcParams.totalPayout = computeResPayload.totalSV;
    product.whatYouBuy.description = [];
    let benefitDescriptions = utils.genPfcBenefitDescriptions(vm.product.pfcParams.totalPayout, vm.product.pfcParams.totalDeathBenefit);
    benefitDescriptions.forEach(function (item) {
      if (item) {
        product.whatYouBuy.description.push({ text: item.text });
      }
    });
  }

  function setBenefits(benefits) {
    let benefitsValue = [];
    let last = benefits.length - 1;
    benefitsValue[0] = benefits[last][1];
    benefitsValue[1] = benefits[last][0];
    return benefitsValue;
  }

  function finalQuotation() {
    let profiles = angular.copy(vm.profile);
    profiles.occupationCode = profiles.occupationClass;
    profiles.gender = aboutYouDetails.gender;
    profiles.dob = aboutYouDetails.dob;
    profiles.age = utils.calculateAge(profiles.dob);
    profiles.anb = utils.calculateAge(profiles.dob) + 1;
    profiles.age++;
    profiles.planCode = `Plan ${vm.product.basic.optCode}`;
    for (let rider of vm.product.rider) {
      switch (rider.compoCode) {
        case constants.production[vm.reqType].component.common.componentList[1]:
          profiles.planFCPA = `Plan ${rider.optCode}`;
          break;
        case constants.production[vm.reqType].component.common.componentList[2]:
        case constants.production[vm.reqType].component.elder.componentList[2]:
          profiles.planRA = `Plan ${rider.optCode}`;
          break;
        default:
          break;
      }
    }

    apiService.finalQuotation(profiles).then(function (res) {
      if (res && res.data) {
        refreshPremiumForPa(res.data);
      }
      vm.updatedPrice = utils.clearCurrencyFormat(vm.product.totalYearlyPremium);
    }).then(function () {
      computePaAndPs();
    }).catch(function (error) {
      throw error;
    });
  }

  function refreshPremiumForPa(data) {
    vm.product.basic.sumAssured = utils.clearCurrencyFormat(data.sumAssuredPA);
    vm.product.basic.premium = utils.clearCurrencyFormat(data.premiumPA);

    for (let index in vm.product.rider) {
      switch (vm.product.rider[index].compoCode) {
        case constants.production[vm.reqType].component.common.componentList[1]:
          vm.product.rider[index].sumAssured = utils.clearCurrencyFormat(data.sumAssuredPAFE);
          vm.product.rider[index].premium = utils.clearCurrencyFormat(data.premiumPAFE);
          break;
        case constants.production[vm.reqType].component.common.componentList[2]:
        case constants.production[vm.reqType].component.elder.componentList[2]:
          vm.product.rider[index].sumAssured = utils.clearCurrencyFormat(data.sumAssuredRA);
          vm.product.rider[index].premium = utils.clearCurrencyFormat(data.premiumRA);
          break;
        default:
          break;
      }
    }
    vm.product.totalYearlyPremium = utils.clearCurrencyFormat(data.premium);
  }

  function pfcFinalComputeAll() {
    let computeRequest = {
      age: vm.profile.anb,
      gender: vm.profile.gender,
      smoker: vm.profile.smoker === 1,
      monthlyPremium: vm.product.computeRequest.monthlyPremium,
      totalYearlyPremium: vm.product.computeRequest.totalYearlyPremium,
      selectedTerm: vm.product.computeRequest.selectedTerm,
      selectedOptionCode: vm.product.computeRequest.selectedOptionCode,
      selectedOptionVal: vm.product.computeRequest.selectedOptionVal
    };

    let summaryReq = {
      customId: vm.customId,
      reqType: vm.reqType,
      erefCode: vm.erefCode ? utils.simpleEncrypt(vm.erefCode) : vm.erefCode,
      occupationCode: occupation.occupationCode || '',
      age: vm.profile.anb,
      gender: vm.profile.gender,
      smoker: vm.profile.smoker === 1,
      name: (aboutYouDetails.surName + ' ' + aboutYouDetails.givenName),
      dob: vm.profile.dob,
      occupation: occupation.occupation || '',
      occupationDesc: occupation.occupationDesc || '',
      monthlyPremium: vm.product.computeRequest.monthlyPremium,
      totalYearlyPremium: vm.product.computeRequest.totalYearlyPremium,
      sumAssured: 0,
      premiumPA: 0,
      premiumRA: 0,
      premiumPAFE: 0,
      sumAssuredPA: 0,
      sumAssuredRA: 0,
      sumAssuredPAFE: 0,
      isMailingAddressSameAsHomeAddress: moreAboutYouDetails.isMailingAddress,
      homeAddress: {
        houseNo: moreAboutYouDetails.residentialBlockNo ? ('Blk ' + moreAboutYouDetails.residentialBlockNo) : '',
        street: moreAboutYouDetails.residentialStreetName,
        unitNo: moreAboutYouDetails.residentialUnitNo,
        building: moreAboutYouDetails.residentialBuildingName,
        postcode: moreAboutYouDetails.residentialPostalCode,
        countryCode: moreAboutYouDetails.residentialCountry,
        city: constants.singaporeName
      },
      mailingAddress: {
        houseNo: moreAboutYouDetails.mailingBlockNo ? ('Blk ' + moreAboutYouDetails.mailingBlockNo) : '',
        street: moreAboutYouDetails.mailingStreetName,
        unitNo: moreAboutYouDetails.mailingUnitNo,
        building: moreAboutYouDetails.mailingBuildingName,
        postcode: moreAboutYouDetails.mailingPostalCode,
        countryCode: moreAboutYouDetails.mailingCountry,
        city: constants.singaporeName
      },
      nric: aboutYouDetails.nricFin,
      nationality: moreAboutYouDetails.nationality,
      phoneNo: (aboutYouDetails.idd + aboutYouDetails.mobilePhone).replace(/\+/g, ''),
      selectedCompoPlanOption: {
        optCode: '',
        optDescp: '',
        optValue: '',
        isOptValueEditable: false
      },
      selectedCompoOption: {
        optCode: '',
        optDescp: '',
        optValue: '',
        isOptValueEditable: false
      }
    };

    apiService.pfcComputeAll(computeRequest).then(function (res) {
      summaryReq.sumAssured = res.data.sumAssured;
      summaryReq.selectedTerm = vm.product.computeRequest.selectedTerm;
      summaryReq.selectedOptionCode = vm.product.computeRequest.selectedOptionCode;
      summaryReq.selectedOptionVal = vm.product.computeRequest.selectedOptionVal;
      vm.encryptionLength = Object.keys(summaryReq.homeAddress).length + Object.keys(summaryReq.mailingAddress).length + 6 + 6;
      return apiService.encryption(constants.encryptionRequestText + vm.encryptionLength);
    }).then(function (res) {
      let random = res.data.random;
      let publicKey = res.data.rsaPublicKey;
      let keyList1 = [
        'homeAddress',
        'mailingAddress',
        'name',
        'nric',
        'phoneNo'
      ];
      let subKeyList = [
        'building',
        'city',
        'countryCode',
        'houseNo',
        'postcode',
        'street',
        'unitNo',
        'mobileNumber',
        'businessName',
        'emailAddress'
      ];
      summaryReq = utils.setEncryptionList(summaryReq, publicKey, random, keyList1, subKeyList);
      return apiService.getSummary(summaryReq);
    }).then(function (res) {
      vm.product.sumAssured = utils.clearCurrencyFormat(res.data.sumAssured);
      vm.product.totalYearlyPremium = utils.clearCurrencyFormat(res.data.premium);
      vm.product.basic.sumAssured = utils.clearCurrencyFormat(res.data.sumAssured);
      vm.product.basic.premium = utils.clearCurrencyFormat(res.data.enp7Premium);
      vm.product.basic.yearlyPremium = utils.clearCurrencyFormat(res.data.enp7Premium);
      vm.product.basic.monthlyPremium = utils.clearCurrencyFormat(res.data.enp7MonthlyPremium);
      vm.product.rider[0].sumAssured = utils.clearCurrencyFormat(res.data.sumAssured);
      vm.product.rider[0].premium = utils.clearCurrencyFormat(res.data.dan7Premium);
      vm.product.rider[0].yearlyPremium = utils.clearCurrencyFormat(res.data.dan7Premium);
      vm.product.rider[0].monthlyPremium = utils.clearCurrencyFormat(res.data.dan7MonthlyPremium);
      vm.erefCode = res.data.erefCode.length < 100 ? res.data.erefCode : utils.simpleDecrypt(res.data.erefCode);
      mailDetails.erefNo = vm.erefCode;
      dataStoreService.session.setObject('mailDetails', mailDetails);
      dataStoreService.setOrderItem('erefCode', vm.erefCode);
      res.data.file = res.data.pdfFile;
      res.data.checksum = res.data.pdfMD5 ? res.data.pdfMD5 : res.data.checksum;
      dataStoreService.session.setObject('biPdfData', res.data);
      dataStoreService.setOrderItem('product', vm.product);
      $scope.$broadcast('updateProduct');
    })
      .catch(function (error) {
        throw error;
      });
  }

  function updateDodId(reqType, docuId) {
    let newDocId = docuId;
    if (reqType === constants.production.PGRP.shortName) {
      /* Reset retirement age
       if the selected retirement age in estimation page is not allowed after fetch the client's actual age.
       */
      let minRetirementAge = constants.ageExpire.age55;
      if (vm.profile.anb > 51 && vm.profile.anb <= 56) {
        minRetirementAge = constants.ageExpire.age60;
      } else if (vm.profile.anb > 56 && vm.profile.anb <= 61) {
        minRetirementAge = constants.ageExpire.age65;
      } else if (vm.profile.anb > 61) {
        minRetirementAge = constants.ageExpire.age70;
      }
      let selectedRetirementAge = newDocId.substr(newDocId.length - 2);
      selectedRetirementAge = parseInt(selectedRetirementAge, 10) < parseInt(minRetirementAge, 10) ? minRetirementAge : selectedRetirementAge;
      newDocId = newDocId.substr(0, newDocId.length - 2) + selectedRetirementAge;

      /* if SRS -> AM7
       if cash -> AL7 */
      let paymentQ = dataStoreService.getOrderItem('paymentQ');
      // if no SRS question or choose cash in SRS question, to AL7
      if (paymentQ === undefined || paymentQ === constants.paymentQMethod.cash) {
        newDocId = newDocId.replace(constants.production.PGRP.prodCode[1].toLowerCase(), constants.production[reqType].cashProdCode.toLowerCase());
      } else { // to AM7
        newDocId = newDocId.replace(constants.production.PGRP.prodCode[0].toLowerCase(), constants.production[reqType].srsProdCode.toLowerCase());
      }
    } else if (reqType === constants.production.PGP.shortName && vm.profile.currencyCode === constants.currency.SGD) {
      /* if SRS -> IR7 / if cash -> IN7 */
      let paymentQ = dataStoreService.getOrderItem('paymentQ');
      // if no SRS question or choose cash in SRS question, to IN7
      if (paymentQ === undefined || paymentQ === constants.paymentQMethod.cash) {
        newDocId = newDocId.replace(constants.production[reqType].prodCode[2].toLowerCase(), constants.production[reqType].prodCode[0].toLowerCase());
      } else { // to IR7
        newDocId = newDocId.replace(constants.production[reqType].prodCode[0].toLowerCase(), constants.production[reqType].prodCode[2].toLowerCase());
      }
    }
    return newDocId;
  }

  function generateComputeRequest(reqType, existRiderFlg, documentId, lifeProfiles, payload, product) {
    let computeRequest = {
      reqType,
      lifeProfiles: [lifeProfiles],
      generatePDF: false,
      selectedSQSProducts: [{
        docId: documentId,
        prodCode: payload.prodCode,
        paymentMode: dataStoreService.getItem('basePaymentFrequency'),
        currency: payload.currency || undefined,
        paymentTypeIndicator: payload.paymentTypeIndicator || undefined,
        components: [{
          compoCode: vm.basicComponent.compoCode,
          isBasic: vm.basicComponent.isBasic,
          isRequired: vm.basicComponent.isRequired,
          isDefault: vm.basicComponent.isDefault,
          lifeInsuredType: vm.basicComponent.lifeInsuredType,
          term: vm.basicComponent.term,
          benefitTerm: vm.basicComponent.benefitTerm,
          premiumTerm: vm.basicComponent.premiumTerm,
          sumAssured: product.basic.sumAssured || 0,
          premium: product.basic.premium || 0,
          selectedTermOption: product.selectedTermOption || undefined
        }]
      }]
    };
    if (reqType === constants.production.PM.shortName || reqType === constants.production.PL.shortName) {
      if (product.selectedTermOption.optValue === '75') {
        computeRequest.selectedSQSProducts[0].components[0].term += 10;
        computeRequest.selectedSQSProducts[0].components[0].benefitTerm += 10;
        computeRequest.selectedSQSProducts[0].components[0].premiumTerm += 10;
      }
      let productPlanList = payload.components[0].compoPlanOptions;
      let selectedCompoPlanOption = {};
      productPlanList.forEach(function (e, index) {
        if (e.optCode === product.basic.optCode) {
          selectedCompoPlanOption = productPlanList[index];
        }
      });
      computeRequest.selectedSQSProducts[0].components[0].selectedCompoPlanOption = {
        optCode: selectedCompoPlanOption.optCode,
        optDescp: selectedCompoPlanOption.optDescp,
        optDataType: selectedCompoPlanOption.optDataType,
        optValue: selectedCompoPlanOption.optValue,
        isOptValueEditable: selectedCompoPlanOption.isOptValueEditable,
        optDetails: selectedCompoPlanOption.optDetails
      };
      computeRequest.selectedSQSProducts[0].components[0].selectedTermOption = product.selectedTermOption;
    } else if (reqType === constants.production.PGP.shortName) {
      // for pgp compute, request can not contain
      computeRequest.selectedSQSProducts[0].components[0].premium = product.basic.singlePremium;
      delete computeRequest.selectedSQSProducts[0].components[0].sumAssured;
    } else if (reqType === constants.production.PGRP.shortName) {
      computeRequest.selectedSQSProducts[0].components[0].premium = product.basic.singlePremium;
      computeRequest.selectedSQSProducts[0].selectedPolicyOption = product.basic.selectedPolicyOption;
    } else if (reqType === constants.production.PFC.shortName) {
      computeRequest.selectedSQSProducts[0].paymentMode = dataStoreService.getItem('basePaymentFrequency');
      computeRequest.selectedSQSProducts[0].components[0].sumAssured = 0;
      computeRequest.selectedSQSProducts[0].components[0].premium = product.pfcParams.sliderValue;
      computeRequest.selectedSQSProducts[0].selectedPolicyOption = product.pfcParams.selectedPolicyOption;
      delete computeRequest.lifeProfiles[0].clientIndicator;
      delete computeRequest.selectedSQSProducts[0].paymentTypeIndicator;
    } else if (reqType === constants.production.PAS.shortName) {
      computeRequest.selectedSQSProducts[0].components[0].term = product.term;
      computeRequest.selectedSQSProducts[0].components[0].benefitTerm = product.term;
      computeRequest.selectedSQSProducts[0].components[0].premiumTerm = product.basic.premiumTerm;
    } else if (reqType === constants.production.PAT.shortName) {
      computeRequest.selectedSQSProducts[0].components[0].term = product.term;
      computeRequest.selectedSQSProducts[0].components[0].benefitTerm = product.term;
      computeRequest.selectedSQSProducts[0].components[0].premiumTerm = product.premiumTerm;
    }
    if (existRiderFlg) {
      if (reqType === constants.production.PT.shortName) {
        if (vm.defaultComponent) {
          let defaultCompo = {
            compoCode: vm.defaultComponent.compoCode,
            isBasic: vm.defaultComponent.isBasic,
            isRequired: vm.defaultComponent.isRequired,
            isDefault: vm.defaultComponent.isDefault,
            lifeInsuredType: vm.defaultComponent.lifeInsuredType,
            term: vm.defaultComponent.term,
            benefitTerm: vm.defaultComponent.benefitTerm,
            premiumTerm: vm.defaultComponent.premiumTerm,
            sumAssured: product.rider[0].sumAssured,
            premium: 0
          };
          computeRequest.selectedSQSProducts[0].components.push(defaultCompo);
        }
        if (vm.riderComponent && vm.product.rider[1]) {
          let riderCompo = {
            compoCode: vm.riderComponent.compoCode,
            isBasic: vm.riderComponent.isBasic,
            isRequired: vm.riderComponent.isRequired,
            isDefault: vm.riderComponent.isDefault,
            lifeInsuredType: vm.riderComponent.lifeInsuredType,
            term: vm.riderComponent.term,
            benefitTerm: vm.riderComponent.benefitTerm,
            premiumTerm: vm.riderComponent.premiumTerm,
            sumAssured: vm.product.rider[1].sumAssured,
            premium: 0
          };
          computeRequest.selectedSQSProducts[0].components.push(riderCompo);
        }
      } else if (reqType === constants.production.PS.shortName || reqType === constants.production.PAT.shortName) {
        vm.productRiders.forEach((rider) => {
          const riderComponent = {
            ...rider
          };
          computeRequest.selectedSQSProducts[0].components.push(riderComponent);
        });
      } else {
        for (let i in vm.productRiders) {
          // PFC
          if (reqType === constants.production.PFC.shortName && (constants.production.PFC.component.common.componentList.toString().indexOf(vm.productRiders[i].compoCode) > -1)) {
            let rider = {
              compoCode: vm.productRiders[i].compoCode,
              isBasic: vm.productRiders[i].isBasic,
              isRequired: vm.productRiders[i].isRequired,
              isDefault: vm.productRiders[i].isDefault,
              lifeInsuredType: vm.productRiders[i].lifeInsuredType,
              term: vm.productRiders[i].term,
              benefitTerm: vm.productRiders[i].benefitTerm,
              premiumTerm: vm.productRiders[i].premiumTerm,
              sumAssured: 0,
              premium: vm.product.pfcParams.sliderValue
            };
            computeRequest.selectedSQSProducts[0].components.push(rider);
          }
        }
      }
    }
    return computeRequest;
  }

  function generateETComputeRequest(reqType, lifeProf, payload) {
    let componentOne = [];
    let componentTwo = [];
    let selectedSQSProducts = [];
    payload.components.forEach(function (e, index) {
      if (index === 0) {
        componentOne.push(e);
      } else if (e.compoCode.substr(e.compoCode.length - 1, e.compoCode.length - 1) === componentOne[0].compoCode.substr(componentOne[0].compoCode.length - 1, componentOne[0].compoCode.length - 1)) {
        componentOne.push(e);
      } else {
        componentTwo.push(e);
      }
    });
    vm.comLength = 6;
    if (!componentTwo[0]) {
      vm.discountFlg = false;
      vm.comLength = 3;
    }
    if (payload.components.length === 4 || !vm.discountFlg) {
      let j = 0;
      for (let i = 0; i < vm.comLength; i++) {
        let component = componentOne;

        if (i < 3) {
          j = i;
        } else {
          component = componentTwo;
          j = i - 3;
        }
        let detail = {
          prodCode: payload.prodCode,
          paymentMode: dataStoreService.getItem('basePaymentFrequency'),
          components: [{
            compoCode: component[0].compoCode,
            isBasic: component[0].isBasic,
            lifeInsuredType: component[0].lifeInsuredType,
            term: component[0].term,
            benefitTerm: component[0].benefitTerm,
            premiumTerm: component[0].premiumTerm,
            premium: component[0].premium,
            sumAssured: component[0].sumAssured,
            selectedCompoPlanOption: {
              optCode: component[0].compoPlanOptions[j].optCode,
              optDescp: component[0].compoPlanOptions[j].optDescp,
              optDataType: component[0].compoPlanOptions[j].optDataType,
              optValue: component[0].compoPlanOptions[j].optValue,
              isOptValueEditable: component[0].compoPlanOptions[j].isOptValueEditable,
              optDetails: component[0].compoPlanOptions[j].optDetails
            }
          }, {
            compoCode: component[1].compoCode,
            isBasic: component[1].isBasic,
            lifeInsuredType: component[1].lifeInsuredType,
            term: component[1].term,
            benefitTerm: component[1].benefitTerm,
            premiumTerm: component[1].premiumTerm,
            premium: component[1].premium,
            sumAssured: component[1].sumAssured,
            selectedCompoPlanOption: {
              optCode: component[1].compoPlanOptions[j].optCode,
              optDescp: component[1].compoPlanOptions[j].optDescp,
              optDataType: component[1].compoPlanOptions[j].optDataType,
              optValue: component[1].compoPlanOptions[j].optValue,
              isOptValueEditable: component[1].compoPlanOptions[j].isOptValueEditable,
              optDetails: component[1].compoPlanOptions[j].optDetails
            }
          }]
        };
        selectedSQSProducts.push(detail);
      }
    } else {
      vm.etExtraFlag = false;
      let j = 0;
      for (let i = 0; i < vm.comLength; i++) {
        let component = componentOne;
        if (i < 3) {
          j = i;
        } else {
          component = componentTwo;
          j = i - 3;
        }
        let detail = {
          prodCode: payload.prodCode,
          paymentMode: dataStoreService.getItem('basePaymentFrequency'),
          components: [{
            compoCode: component[0].compoCode,
            isBasic: component[0].isBasic,
            lifeInsuredType: component[0].lifeInsuredType,
            term: component[0].term,
            benefitTerm: component[0].benefitTerm,
            premiumTerm: component[0].premiumTerm,
            premium: component[0].premium,
            sumAssured: component[0].sumAssured,
            selectedCompoPlanOption: {
              optCode: component[0].compoPlanOptions[j].optCode,
              optDescp: component[0].compoPlanOptions[j].optDescp,
              optDataType: component[0].compoPlanOptions[j].optDataType,
              optValue: component[0].compoPlanOptions[j].optValue,
              isOptValueEditable: component[0].compoPlanOptions[j].isOptValueEditable,
              optDetails: component[0].compoPlanOptions[j].optDetails
            }
          }]
        };
        selectedSQSProducts.push(detail);
      }
    }
    let computeRequest = {
      reqType,
      lifeProfiles: [lifeProf],
      generatePDF: false,
      errorMessages: [],
      selectedSQSProducts
    };
    return computeRequest;
  }
}
