module.exports = {
  template: require('./more-about-you-review.html'),
  controller: MoreAboutYouReviewController,
  controllerAs: 'vm',
  bindings: {
    hideUpload: '=',
    summaryStep: '<',
    detailStep: '<',
    changeDetailStep: '&',
    profile: '<'
  }
};
/** @ngInject */
function MoreAboutYouReviewController($scope, $rootScope, $uibModal, dataStoreService, apiService, constants, utils, $ngRedux) {
  let vm = this;
  vm.questionRequest = null;
  let previous = null;
  let next = null;
  vm.taxQ = {};

  vm.isExistCustomerDecl = dataStoreService.getItem('isExistCustomerDecl');
  vm.setMailingAddress = setMailingAddress;
  vm.checkIfKickout = checkIfKickout;
  vm.validateForm = validateForm;
  vm.saveAllWithoutValidation = saveAllWithoutValidation;
  vm.setUploadList = setUploadList;
  vm.clearMailingAddress = clearMailingAddress;
  vm.apsOptionChange = apsOptionChange;
  vm.section = ['QMAY010'];
  let kickoutFlag = '';

  /* encryption key*/
  vm.encryptKeyList = ['mailingUnitNo', 'mailingStreetName', 'mailingBuildingName', 'mailingBlockNo', 'mailingPostalCode', 'residentialUnitNo',
    'residentialStreetName', 'residentialBuildingName', 'residentialBlockNo', 'residentialPostalCode', 'residentialCountry', 'mailingCountry', 'nationality'
  ];
  vm.encryptionLength = vm.encryptKeyList.length;

  vm.questionnaireData = {};
  vm.residentialData = {};
  vm.mailingData = {};
  vm.sectionQ1 = [];
  vm.sectionQ2 = [];
  vm.sectionQ3 = [];
  vm.sectionQ4 = [];
  vm.showInputResidential = false;
  let moreAboutYouDetails;
  setResidentialAddrData();
  setMailingAddrData();
  getDefaultdata();
  loadData();

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
    vm.loginStatus = dataStoreService.getItem('loginStatus');
    vm.product = dataStoreService.getOrderItem('product');
    vm.channel = dataStoreService.getItem('channel');
    vm.myInfoSelected = dataStoreService.session.getValue('myInfoSelected');
    vm.myInfoHasAdd = dataStoreService.getItem('myInfoHasAdd');
    vm.reqType = vm.profile.type;
    vm.redirectToAgentQs = constants.production[vm.profile.type].moreAboutYouQuestion.redirectToAgentQs;
    vm.customId = vm.profile.customID;
    vm.questionCat = constants.questionnaireCategory.QMAY;
    vm.QMAYData = dataStoreService.getOrderItem('QMAYData');
    vm.residencyOptions = constants.residencyOptions;
    vm.passTypeOptions = (vm.reqType === 'PC' || vm.reqType === 'PAT') ? constants.passTypeOptionsPc : constants.passTypeOptions;
    vm.moreAboutYouQ = utils.questionFormat(vm.QMAYData);
    vm.sectionQ1 = constants.production[vm.reqType].moreAboutYouQuestion.sectionQ1;
    vm.sectionQ2 = constants.production[vm.reqType].moreAboutYouQuestion.sectionQ2;
    // filter payment question from QMAY
    vm.sectionQ3 = _.filter(constants.production[vm.reqType].moreAboutYouQuestion.sectionQ3, function (item) {
      if (constants.production[vm.reqType].moreAboutYouQuestion.paymentQ.length > 0) {
        return constants.production[vm.reqType].moreAboutYouQuestion.paymentQ.indexOf(item) === -1;
      }
      return item;
    });
    vm.sectionQ4 = constants.production[vm.reqType].moreAboutYouQuestion.sectionQ4;

    getAllQuestionaire();
    vm.mask = true;
    if (vm.reqType === constants.production.PA.shortName || vm.reqType === constants.production.PS.shortName || vm.reqType === constants.production.PFC.shortName) {
      setUploadList();
    }
    $scope.$emit('getMoreAboutYouValidationForReview', vm.validateForm);
    $scope.$emit('getMoreAboutYouTimeOut', vm.saveAllWithoutValidation);

    vm.apsOption = {
      isEdit: false,
      value: false
    };
    vm.isAPSRequired = (vm.reqType === constants.production.PS.shortName && vm.profile.residencyCode !== 3);
  };

  vm.editSection = () => {
    $scope.$broadcast('editField');
    vm.apsOption.isEdit = true;
    $scope.$emit('switchEditStatus');
  };

  function setUploadList() {
    /**
      key: {
        vm.showFrontNRIC : need to upload the front of the NRIC;
        vm.showBackNRIC : need to upload the back of the NRIC;
        vm.showBO : need to upload the proof of BO;
        vm.showPEP : need to upload the prof of PEP;
      }
      value : {
        true : need to upload the front of the NRIC;
        false : no need;
        undefined : not in the product upload list
      }
      description: emit the flag which controls the disappearance of upload section
    */
    if (!vm.showFrontNRIC && !vm.showBackNRIC && !vm.showProofOfAddress && !vm.showBO && !vm.showPEP) {
      vm.hideUpload = false;
      $scope.$emit('setShowUpload', vm.hideUpload);
      $rootScope.uploadYourDocumentEt = true;
    } else {
      vm.hideUpload = true;
      $scope.$emit('setShowUpload', vm.hideUpload);
    }
  }

  $scope.$on('showNRIC', function (e, showNRIC) {
    vm.showFrontNRIC = showNRIC === 'true';
    vm.showBackNRIC = showNRIC === 'true';
    vm.showProofOfAddress = showNRIC === 'true';
    if (vm.loginStatus && vm.profile && vm.profile.residencyCode === constants.residencyCode.epOrWpHolder) {
      vm.showFrontNRIC = true;
      vm.showBackNRIC = true;
    }
    vm.setUploadList();
    let showNRICImg = {
      imgIndex: 1,
      show: vm.showFrontNRIC && vm.showBackNRIC
    };
    $scope.$emit('controlShowIDProof', showNRICImg);
    if ((vm.reqType === 'PC' || vm.reqType === 'PAT') && vm.profile.residencyCode === 3) {
      const showProofOfAddressImg = {
        imgIndex: 3,
        show: vm.showProofOfAddress
      };
      $scope.$emit('controlShowIDProof', showProofOfAddressImg);
    }
  });
  $scope.$on('showBO', function (e, showBO) {
    vm.showBO = showBO === 'true';
    vm.setUploadList();
    let showBOImg = {
      imgIndex: 4,
      show: showBO === 'true'
    };
    $scope.$emit('controlShowIDProof', showBOImg);
  });
  $scope.$on('showPEP', function (e, showPEP) {
    vm.showPEP = showPEP === 'true';
    vm.setUploadList();
    let showPEPImg = {
      imgIndex: 5,
      show: showPEP === 'true'
    };
    $scope.$emit('controlShowIDProof', showPEPImg);
  });
  $scope.$on('taxMatch', function (e, data, idd) {
    let aboutYouDetails = dataStoreService.getOrderItem('aboutYouDetails');
    let mailingCountry = typeof vm.mailingCountry === 'object' ? vm.mailingCountry.value : vm.mailingCountry;
    if (idd) {
      aboutYouDetails.idd = idd;
      dataStoreService.setOrderItem('aboutYouDetails', aboutYouDetails);
    }
    let iddDate = aboutYouDetails.idd;
    if (data && data !== 'refreshQuestionaire') {
      vm.taxQ[data.question.code] = data;
    }
    vm.subQ = [
      constants.questionnaireCode.qmay023021,
      constants.questionnaireCode.qmay023022,
      constants.questionnaireCode.qmay023023
    ];
    if (!vm.taxQ.QMAY004 || !vm.taxQ.QMAY023) {
      $scope.$broadcast('isMatch', true);
    } else if (vm.taxQ.QMAY023.answer.value === 'true') {
      if (vm.taxQ.QMAY004.answer.value !== constants.singapore || (vm.isMailingAddress !== 'true' && utils.getCountryCodeByIdd(iddDate) !== mailingCountry)) {
        $scope.$broadcast('isMatch', false);
      } else if (vm.isMailingAddress === 'true' && utils.getCountryCodeByIdd(iddDate) !== constants.singapore) {
        $scope.$broadcast('isMatch', false);
      } else {
        $scope.$broadcast('isMatch', true);
      }
    } else {
      let counter = 0;
      vm.taxCounry = _.filter(vm.taxQ, function (item) {
        if (vm.subQ.indexOf(item.question.code) !== -1 && !item.answer.value) {
          counter++;
        }
        return vm.subQ.indexOf(item.question.code) !== -1;
      });

      // PD-2397 FATCA/CRS question enhancement when phone country and country of residence don’t match
      let countryZeroMatch = true;
      let iddZeroMatch = true;
      let mailingAddressZeroMatch = true;
      for (let i in vm.taxCounry) {
        if (vm.taxCounry[i].answer.value && vm.taxQ.QMAY004.answer.value === vm.taxCounry[i].answer.value) {
          countryZeroMatch = false;
        }
        if (vm.taxCounry[i].answer.value && utils.getCountryCodeByIdd(iddDate) === vm.taxCounry[i].answer.value) {
          iddZeroMatch = false;
        }
        if (vm.isMailingAddress === 'true' || !mailingCountry || (vm.taxCounry[i].answer.value && mailingCountry === vm.taxCounry[i].answer.value)) {
          mailingAddressZeroMatch = false;
        }
      }

      if ((countryZeroMatch || iddZeroMatch || mailingAddressZeroMatch) && counter < 3) {
        $scope.$broadcast('isMatch', false);
      } else {
        $scope.$broadcast('isMatch', true);
      }
    }
  });
  $scope.$on('employmentChange', function (event, data) {
    $scope.$broadcast('industryEmploymentUpdate', data);
  });

  //populate the exisiting address of customer
  function populateCustomerResidentialAddress() {
    vm.residentialPostalCode = moreAboutYouDetails.residentialPostalCode;
    vm.residentialBlockNo = moreAboutYouDetails.residentialBlockNo;
    vm.residentialStreet = moreAboutYouDetails.residentialStreetName;
    vm.residentialBuilding = moreAboutYouDetails.residentialBuildingName;
    vm.residentialUnitNo = moreAboutYouDetails.residentialUnitNo;
  }
  // get default data for summary
  function getDefaultdata() {
    moreAboutYouDetails = dataStoreService.getOrderItem('moreAboutYouDetails');
    if (moreAboutYouDetails) {
      vm.nationality = moreAboutYouDetails.nationality;
      vm.residencyStatus = moreAboutYouDetails.residencyStatus;
      // Populate residential address
      populateCustomerResidentialAddress();
      // Which country do you currently live in?
      vm.residentialCountry = moreAboutYouDetails.residentialCountry;
      vm.residentialCountryCode = moreAboutYouDetails.residentialCountryCode;
      vm.residentialIsSingapore = moreAboutYouDetails.residentialCountry === constants.singaporeName;

      vm.residencyCodeSelected = moreAboutYouDetails.residencyCode;
      vm.passTypeSelected = moreAboutYouDetails.passType;
      // mailing address
      vm.mailingPostalCode = moreAboutYouDetails.mailingPostalCode;
      vm.mailingBlockNo = moreAboutYouDetails.mailingBlockNo;
      vm.mailingStreet = moreAboutYouDetails.mailingStreetName;
      vm.mailingBuilding = moreAboutYouDetails.mailingBuildingName;
      vm.mailingUnitNo = moreAboutYouDetails.mailingUnitNo;
      vm.mailingCountry = moreAboutYouDetails.mailingCountry;
      vm.isMailingAddress = moreAboutYouDetails.isMailingAddress;
      if (vm.isMailingAddress === 'false') {
        vm.mailIsSingapore = moreAboutYouDetails.mailingCountry === constants.singaporeName;
      } else {
        vm.mailIsSingapore = true;
      }
      // salary
      vm.annualIncome = moreAboutYouDetails.annualIncome;
      setSalaryData();
    }
  }

  // load data for dropdown and others
  function loadData() {
    apiService.dropdowns({
      dropDownCodeList: [constants.dropDownCode.pfcopt070, constants.dropDownCode.pfcopt066]
    }).then(function (res) {
      if (res && res.data) {
        // dropdown for nationality
        vm.allNationality = res.data.PFCOPT066;
        vm.nationality = _.find(vm.allNationality, function (item) {
          return item.value === vm.nationality;
        });
        if (vm.nationality && vm.nationality.option) {
          vm.nationalityDesc = vm.nationality.option;
        }
        // dropdown for mailing country
        vm.allresidentialCountry = res.data.PFCOPT070;
        if (vm.reqType === constants.production.PER.shortName || vm.reqType === constants.production.PC.shortName || vm.reqType === constants.production.PAT.shortName) {
          const residencyCode = vm.residencyOptions.find(item => item.value === vm.residencyCodeSelected);
          vm.residencyCode = residencyCode.option;
          const passType = vm.passTypeOptions.find(item => item.value === vm.passTypeSelected);
          vm.passType = passType.option;
        }
      }
    }).catch(function (error) {
      throw error;
    });
  }

  $scope.$on('livingCountry', function (e, country) {
    vm.residentialIsSingapore = country === constants.singaporeName;
    vm.residentialCountry = moreAboutYouDetails.residentialCountry;
    if (vm.residentialIsSingapore && !vm.loginStatus) {
      vm.residentialPostalCode = null;
      vm.residentialStreet = null;
      vm.residentialUnitNo = null;
      vm.residentialBuilding = null;
    }
    if (!vm.residentialIsSingapore) utils.openResidentialModel(constants.crossBorderMsg.foreignResidentialAddress);
    $scope.$broadcast('livingCountryChange', country);
  });

  $scope.$on('livingCountryCode', function (e, country) {
    vm.residentialCountryCode = country;
  });

  $scope.$on('mailCountryChange', function () {
    vm.mailingIsSingapore = vm.mailingCountry === constants.singaporeName;
  });

  $scope.$on('isMailingAddressChange', function () {
    clearMailingAddress();
    vm.isMailingAddress = 'false';
  });

  $scope.$on('setMailingAdrToResAdr', function () {
    vm.mailingPostalCode = vm.residentialPostalCode;
    vm.mailingBlockNo = vm.residentialBlockNo;
    vm.mailingBuilding = vm.residentialBuilding;
    vm.mailingStreet = vm.residentialStreet;
    vm.mailingAddressType = vm.residentialAddressType;
    vm.mailingUnitNo = vm.residentialUnitNo;
    vm.mailingCountry = vm.residentialCountry;
    vm.isMailingAddress = 'true';
  });

  function clearMailingAddress() {
    vm.mailingPostalCode = null;
    vm.mailingBlockNo = null;
    vm.mailingBuilding = null;
    vm.mailingStreet = null;
    vm.mailingAddressType = null;
    vm.mailingUnitNo = null;
    vm.mailingCountry = null;
  }

  function setSalaryData() {
    vm.salaryData = {};
    vm.salaryData.labelValue = 'What is your annual salary?';
    vm.salaryData.inputName = 'annualIncome';
    vm.salaryData.validationType = 'idd-validation';
    vm.salaryData.isSalary = true;
  }

  function setResidentialAddrData() {
    vm.residentialData.labelName = 'Residential address';
    vm.residentialData.addrType = 'residential';
    vm.residentialData.postalCode = {
      id: 'residentialPostalCode',
      label: 'Residential Postcode (per NRIC)',
      labelForeign: 'Postcode'
    };
    vm.residentialData.blockNo = {
      id: 'residentialBlockNo',
      label: 'Residential Block Number',
      labelForeign: 'Block/House Number'
    };
    vm.residentialData.street = {
      id: 'residentialStreet',
      label: 'Residential Street',
      labelForeign: 'Address Line 1'
    };
    vm.residentialData.building = {
      id: 'residentialBuilding',
      label: 'Residential Building Name',
      labelForeign: 'Address Line 2'
    };
    vm.residentialData.unitNo = {
      id: 'residentialUnitNo',
      label: 'Level & Unit',
      labelForeign: 'City / State'
    };
    vm.residentialData.country = {
      id: 'residentialCountry',
      label: 'Country',
      list: null
    };
    var profileloc = dataStoreService.session.getObject('profile') || {};
    var reqTypeloc = dataStoreService.getItem('reqType') || dataStoreService.session.getValue('reqType') || profileloc.type;
    if (reqTypeloc === constants.production.PS.shortName) {
      vm.residentialData.warningMsg = 'The address stated here will be used on this application and updated on all your existing policy(ies).'
        + ' All correspondence will be sent to this residential address unless you specify a mailing address.';
    } else {
      vm.residentialData.warningMsg = 'The address on your NRIC must tally with the residential address you provide.'
        + ' Otherwise, please provide documentary proof '
        + '(e.g. state issued document or bank statement in your own name).';
    }
  }

  function setMailingAddrData() {
    vm.mailingData.labelName = 'Is this also your mailing address?';
    vm.mailingData.addrType = 'mailing';
    vm.mailingData.postalCode = {
      id: 'mailingPostalCode',
      label: 'Mailing Postcode',
      labelForeign: 'Mailing Postal Code'
    };
    vm.mailingData.blockNo = {
      id: 'mailingBlockNo',
      label: 'Mailing Block Number',
      labelForeign: 'Mailing Block / House Number'
    };
    vm.mailingData.street = {
      id: 'mailingStreet',
      label: 'Mailing Street',
      labelForeign: 'Mailing Address Line 1'
    };
    vm.mailingData.building = {
      id: 'mailingBuilding',
      label: 'Mailing Building Name',
      labelForeign: 'Mailing Address Line 2'
    };
    vm.mailingData.unitNo = {
      id: 'mailingUnitNo',
      label: 'Level & Unit',
      labelForeign: 'Mailing City / State'
    };
    vm.mailingData.country = {
      id: 'mailingCountry',
      label: 'Mailing Country',
      list: null
    };

    vm.mailingData.warningMsg = 'The mailing address will apply to this application only. '
      + 'If you wish to change your mailing address for your existing policy(ies), '
      + 'please submit a separate written request.';
  }

  function setMailingAddress(type) {
    if (type === 'residential' && vm.isMailingAddress === 'true') {
      if (!vm.residentialIsSingapore) {
        vm.mailingPostalCode = vm.foreignPostcode;
        vm.mailingStreet = vm.foreignStreet;
        vm.mailingCountry = vm.residentialCountry;
      } else {
        vm.mailingPostalCode = vm.residentialPostalCode;
        vm.mailingBlockNo = vm.residentialBlockNo;
        vm.mailingBuilding = vm.residentialBuilding;
        vm.mailingStreet = vm.residentialStreet;
        vm.mailingAddressType = vm.residentialAddressType;
        vm.mailingUnitNo = vm.residentialUnitNo;
        vm.mailingCountry = vm.residentialCountry;
      }
    }
    $scope.$emit('taxMatch', '', '');
  }

  function checkIfKickout(qCode) {
    return vm.redirectToAgentQs.indexOf(qCode) !== -1;
  }

  function validateForm() {
    vm.surveynotCompleted = false;
    $scope.$broadcast('checkProgression', vm.questionRequest ? vm.questionRequest.cat : '');
    if (vm.isMailingAddress === 'false') {
      utils.setFieldsBlurAndInvalid($scope.moreAboutYouForm, {
        mailingPostalCode: null,
        mailingStreet: null,
        mailingCountry: null,
        mailingBuilding: null,
        mailingBlockNo: null,
        mailingUnitNo: null
      });
    }

    if (vm.profile.identity !== 1) {
      if (!vm.nationality) {
        utils.setFieldsBlurAndInvalid($scope.moreAboutYouForm, {
          nationality: !vm.nationality
        });
      } else if (vm.nationality.value === constants.america) {
        // PD-1608 American nationality is routed to lead gen
        kickoutFlag = true;
        dataStoreService.setItem('kickoutFlag', kickoutFlag);
      }
    }

    // PACSDP-3931 - Foreign Residential address others than Singapore to trigger lead gen
    if (vm.residentialCountry && vm.residentialCountry !== constants.singaporeName) {
      utils.openResidentialModel(constants.crossBorderMsg.foreignResidentialAddress);
      utils.setFieldsBlurAndInvalid($scope.moreAboutYouForm, {
        residentialCountry: !vm.residentialCountry
      });
    }

    // PD-2141: US Mailing Address to trigger lead gen
    if (vm.mailingCountry && vm.mailingCountry.value === constants.america) {
      kickoutFlag = true;
      dataStoreService.setItem('kickoutFlag', kickoutFlag);
    }

    if (vm.residentialAddressType === constants.residentialAddressType.h || vm.residentialAddressType === constants.residentialAddressType.c) {
      utils.setFieldsBlurAndInvalid($scope.moreAboutYouForm, {
        residentialUnitNo: !vm.residentialUnitNo
      });
    }
    if ($scope.moreAboutYouForm.$invalid || vm.surveynotCompleted) {
      utils.setFieldsBlurAndInvalid($scope.moreAboutYouForm, {
        residentialPostalCode: null,
        residentialStreet: null,
        residentialBuilding: null,
        residentialBlockNo: null,
        annualIncome: null,
      });

      $rootScope.moreAboutYou = false;
    } else {
      saveMoreAboutYou();
    }
  }

  function saveMoreAboutYou() {
    let isPruShieldNewCustomer = vm.reqType === 'PS' && vm.isExistCustomerDecl === 'false';
    vm.mayQuestionnaire = utils.fetchQuestionnaireData(vm.questionnaireData);
    // for PER, temporary changes to pass the foreigners pass type
    if (vm.reqType === 'PER' || vm.reqType === 'PC' || vm.reqType === 'PAT') {
      let passQuestion = JSON.parse(`
        {"question":{"after":"","description":"what type of pass are you holding ?","validation":"","cat":"QMAY","parent":"","depend":"","max":0,"type":"toggleAdd","title":"","code":"QMAY_PASSTYPE","details":"","subQuestions":[],"answerArray":null,"questionnaire":"","sequence":"6","required":"","warningText":"","min":0,"order":"6","option":"","answer":null,"level":1,"editMode":true},"answer":{"value":"","label":null},"subs":{},"parent":null}
      `);
      const passType = vm.passTypeOptions.find(item => item.value === vm.passTypeSelected);
      if (vm.profile && vm.profile.identity === 3 && passType) {
        passQuestion = {
          ...passQuestion,
          answer: {
            value: passType.option,
            label: passType.option,
          },
        };
      }
      vm.mayQuestionnaire.push(passQuestion);
    }
    let saveRequest = {
      customId: vm.customId,
      productType: vm.reqType,
      clientNumber: dataStoreService.getItem('clientNumber') || null,
      nationality: vm.nationality ? vm.nationality.value : constants.singapore,
      annualIncome: isPruShieldNewCustomer ? 0 : parseInt(vm.annualIncome.replace(/,/g, ''), 10),
      mailingUnitNo: vm.mailingUnitNo,
      mailingStreetName: vm.mailingStreet,
      mailingBuildingName: vm.mailingBuilding,
      mailingBlockNo: vm.mailingBlockNo,
      mailingPostalCode: vm.mailingPostalCode,
      residentialUnitNo: vm.residentialUnitNo,
      residentialStreetName: vm.residentialStreet,
      residentialBuildingName: vm.residentialBuilding,
      residentialBlockNo: vm.residentialBlockNo,
      residentialPostalCode: vm.residentialPostalCode,
      residencyCode: vm.profile.residencyCode,
      passType: vm.profile.passType,
      mailingCountry: typeof vm.mailingCountry === 'object' ? vm.mailingCountry.option : vm.mailingCountry,
      qmayQuestionnaires: JSON.stringify(vm.mayQuestionnaire)
    };
    let details = {
      nationality: vm.nationality ? vm.nationality.value : constants.singapore,
      annualIncome: isPruShieldNewCustomer ? 0 : parseInt(vm.annualIncome.replace(/,/g, ''), 10),
      mailingUnitNo: vm.mailingUnitNo,
      mailingStreetName: vm.mailingStreet,
      mailingBuildingName: vm.mailingBuilding,
      mailingBlockNo: vm.mailingBlockNo,
      mailingPostalCode: vm.mailingPostalCode,
      residentialUnitNo: vm.residentialUnitNo,
      residentialStreetName: vm.residentialStreet,
      residentialBuildingName: vm.residentialBuilding,
      residentialBlockNo: vm.residentialBlockNo,
      residentialPostalCode: vm.residentialPostalCode,
      mailingCountry: typeof vm.mailingCountry === 'object' ? vm.mailingCountry.option : vm.mailingCountry,
      mailingCountryCode: typeof vm.mailingCountry === 'object' ? vm.mailingCountry.value : '',
      isMailingAddress: String(vm.isMailingAddress),
      residentialCountry: vm.residentialCountry,
      residentialCountryCode: vm.residentialCountryCode,
      residencyCode: vm.residencyCodeSelected || vm.profile.residencyCode,
      passType: vm.passTypeSelected || vm.profile.passType,
      residencyStatus: utils.conventResidencyForQuestionnaire(vm.profile.residencyCode)
    };

    // PD-2045: for PGRP
    if (vm.reqType === constants.production.PGP.shortName || vm.reqType === constants.production.PGRP.shortName) {
      saveRequest.gender = vm.gender;
      details.gender = vm.gender;
    }

    dataStoreService.setOrderItem('moreAboutYouDetails', details);
    dataStoreService.setOrderItem('QMAYData', vm.mayQuestionnaire);
    dataStoreService.session.setObject('QMAYData', vm.mayQuestionnaire);
    $rootScope.moreAboutYou = true;
  }

  function saveAllWithoutValidation() {
    $scope.$broadcast('saveQuestionWithoutValidation', [constants.production[vm.profile.type].moreAboutYouQuestion.cat]);

    vm.moreAboutYouDetails = {
      nationality: vm.nationality ? vm.nationality.value : constants.singapore,
      annualIncome: parseInt(vm.annualIncome.replace(/,/g, ''), 10),
      mailingStreetName: vm.mailingStreet,
      mailingBuildingName: vm.mailingBuilding,
      mailingBlockNo: vm.mailingBlockNo,
      mailingPostalCode: vm.mailingPostalCode,
      residentialUnitNo: vm.residentialUnitNo,
      residentialStreetName: vm.residentialStreet,
      residentialBuildingName: vm.residentialBuilding,
      residentialBlockNo: vm.residentialBlockNo,
      residentialPostalCode: vm.residentialPostalCode,
      mailingCountry: vm.mailingCountry,
      isMailingAddress: String(vm.isMailingAddress),
      residentialCountry: vm.residentialCountry,
      residencyCode: vm.residencyCodeSelected || vm.profile.residencyCode,
      passType: vm.passTypeSelected || vm.profile.passType,
      residencyStatus: utils.conventResidencyForQuestionnaire(vm.profile.residencyCode)
    };

    dataStoreService.setItem('moreAboutYouDetails', vm.moreAboutYouDetails);
    dataStoreService.setOrderItem('moreAboutYouDetails', vm.moreAboutYouDetails);
  }

  function getAllQuestionaire() {
    vm.aboutYouDetail = dataStoreService.getOrderItem('aboutYouDetails');
    vm.moreAboutYouDetails = dataStoreService.getOrderItem('moreAboutYouDetails');
    if (vm.reqType === constants.production.PGP.shortName && vm.profile.currencyCode) {
      vm.reqCurrencyType = vm.reqType + '_' + vm.profile.currencyCode;
    } else {
      vm.reqCurrencyType = angular.copy(vm.reqType);
    }
    if (constants.production[vm.profile.type].moreAboutYouQuestion) {
      let qChannel = '';
      if (vm.reqType === constants.production.PGP.shortName && vm.channel === constants.channel.SCB) {
        qChannel = angular.copy(vm.channel);
      }
      //PACSDP-4892 Added Encryption for Questionaire parameters
      apiService.encryption().then(function (res) {
        var publicKey = res.data.rsaPublicKey;
        var random = res.data.random;
        vm.questionRequest = {
          cat: constants.questionnaireCategory.QMAY,
          categoryList: [constants.questionnaireCategory.QMAY],
          lifeProfile: {
            name: vm.aboutYouDetail.surName + ' ' + vm.aboutYouDetail.givenName,
            dob: vm.profile.dob,
            nric: vm.aboutYouDetail.nricFin,
            age: utils.calculateAge(vm.profile.dob) + 1,
            gender: vm.moreAboutYouDetails.gender || constants.production[vm.reqType].gender || vm.profile.gender,
            clientNumber: dataStoreService.getItem('clientNumber') || '',
            residentStatus: utils.conventResidencyForQuestionnaire(vm.profile.residencyCode),
            existingClient: vm.loginStatus,
            countryOfBirth: '',
            hasMyInfoSelected: vm.myInfoSelected,
            noMyInfoAdd: !vm.myInfoHasAdd
          },
          selectedProducts: {
            docId: vm.product.docId,
            prodCode: vm.product.prodCode,
            components: [{
              compoCode: vm.product.basic.compoCode,
              isBasic: true,
              sumAssured: vm.product.basic.sumAssured || '',
              singlePremium: vm.product.basic.singlePremium || ''
            }]
          },
          policyRequestPayload: {
            clientProfile: {
              clientNumber: dataStoreService.getItem('clientNumber')
            },
            policies: [{
              policyStatus: [constants.defaultPolicyStatus],
              afterIssueDate: constants.defaultIssueDate
            }]
          },
          classOccupation: vm.profile.occupationClass,
          hasAnswer: false,
          channel: qChannel,
          random: random[0]
        };
        var questionRequest = utils.setEncryptionList(vm.questionRequest, publicKey, random, ['lifeProfile'], ['nric']);
        return apiService.getQuestionnaire(questionRequest);
      }).then(function (res) {
        // get empty questionnaire list and add customized questions
        const alterQuestionCode = getAlterQuestionCode();
        vm.qPayload = angular.copy(res.data.payload);
        for (let i = 0; i < vm.qPayload.length; i++) {
          let item = vm.qPayload[i];
          if (item.code === constants.questionnaireCode.qmay010) {
            vm.showInputResidential = true;
            populateCustomerResidentialAddress();
          }
        }
        let repeatQ = [
          constants.questionnaireCode.qmay02301,
          constants.questionnaireCode.qmay02302,
          constants.questionnaireCode.qmay02303,
          constants.questionnaireCode.qmay02304,
          constants.questionnaireCode.qmay0230401
        ];
        let tempQ = []; // 3 blank sub questions

        // delete QMAY023 sub question
        vm.allQuestionaire = _.filter(vm.qPayload, function (item) {
          if (repeatQ.indexOf(item.code) !== -1) {
            tempQ.push(item);
          }
          return repeatQ.indexOf(item.code) === -1;
        });

        // loop 3 times
        for (let j = 0; j < 3; j++) {
          for (let k in tempQ) {
            let item = tempQ[k];
            let newItem = angular.copy(item);
            newItem.optionalNo = j;
            newItem.code += (j + 1);
            if (newItem.code.indexOf(constants.questionnaireCode.qmay0230401) !== -1) {
              newItem.parent += (j + 1);
            }
            if (j > 0 || newItem.code === constants.questionnaireCode.qmay023031 || newItem.code === constants.questionnaireCode.qmay023041) {
              newItem.isOptional = true;
            }
            // QMAY02301 only need loop one time
            if ((newItem.code.indexOf(constants.questionnaireCode.qmay02301) === -1) || newItem.code === constants.questionnaireCode.qmay023011) {
              vm.allQuestionaire.push(newItem);
            }
          }
        }
        // combine empty questionnaire with answers
        for (let i = 0; i < vm.allQuestionaire.length; i++) {
          angular.forEach(vm.moreAboutYouQ, function (itemQ) {
            if (vm.allQuestionaire[i].code === itemQ.code) {
              vm.allQuestionaire[i] = itemQ;
            }
          });
          if (vm.reqType === constants.production.PS.shortName
            && (vm.allQuestionaire[i].code === 'QMAY029' || vm.allQuestionaire[i].code === 'QMAY030')) {
            const clientAcknowledgement = constants.production.PS.clientAcknowledgement;
            vm.allQuestionaire[i].description = clientAcknowledgement[vm.allQuestionaire[i].code];
          }
          if (alterQuestionCode === vm.allQuestionaire[i].code) {
            vm.allQuestionaire[i].code += '_';
          }
        }
      });
    }
  }

  function getAlterQuestionCode() {
    var questionCode = '';
    if (utils.conventResidencyForQuestionnaire(vm.profile.residencyCode) === constants.singaporePR) {
      questionCode = 'QMAY003C';
    } else if (utils.conventResidencyForQuestionnaire(vm.profile.residencyCode) === constants.other) {
      if ((vm.reqType === constants.production.PS.shortName || vm.reqType === constants.production.PER.shortName) && vm.profile.passType < 5
         || ((vm.reqType === constants.production.PC.shortName || vm.reqType === constants.production.PAT.shortName) && vm.profile.passType < 6)) {
        questionCode = 'QMAY003C';
      } else {
        questionCode = 'QMAY003B';
      }
    }
    return questionCode;
  }

  function apsOptionChange() {
    dataStoreService.setItem('shieldAPSOption', vm.apsOption.value);
  }

  $scope.$on('surveyCompleted', function (evt, jsonfile, data) {
    next = jsonfile;
    if (previous !== next) {
      vm.questionnaireData[jsonfile] = {};
    }
    for (let i in data) {
      vm.questionnaireData[jsonfile][i] = data[i];
    }
    previous = next;
  });

  $scope.$on('notCompleted', function () {
    vm.surveynotCompleted = true;
  });

  $scope.$on('kickout', function (evt, jsonfile) {
    if (vm.questionRequest.cat === jsonfile) {
      kickoutFlag = true;
      let flagList = dataStoreService.getItem('kickoutQ');
      flagList[jsonfile] = kickoutFlag;
      dataStoreService.setItem('kickoutQ', flagList);
    }
  });
  /* This is executed on 2 conditions on the review Page when we have the policy incepepted scenario residential address change question
    1) On load of the Radio-pru
    2) On selection of yes/no
  */
  $scope.$on('saveAnswer', function (evt, data) {
    let sendFlag = false;
    if (data.question && data.question.code === constants.questionnaireCode.qmay010 && data.answer) {
      sendFlag = true;
      if (data.answer.value === 'true') {
        vm.showInputResidential = false;
      } else if (data.answer.value === 'false') {
        vm.showInputResidential = true;
      }
      // Broadcast the data in case we have policy incepted address change question
      if (sendFlag) {
        $scope.$broadcast('answerChange', data);
      }
    }
  });
}
