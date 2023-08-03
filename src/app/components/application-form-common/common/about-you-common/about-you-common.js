import { compose, toUpperCase } from '../../../../utils/functional-utils';

module.exports = {
  template: require('./about-you-common.html'),
  controller: AboutYouCommonController,
  controllerAs: 'vm',
  bindings: {
    summaryStep: '<',
    detailStep: '<',
    changeDetailStep: '&',
    isCollapsed: '<',
    profile: '<'
  }
};
/** @ngInject */
function AboutYouCommonController(apiService, dataStoreService, utils, $scope, $uibModal, $rootScope, $state, constants) {
  let vm = this;
  let customer = null;
  let occupation = null;
  let previous = null;
  let next = null;
  vm.questionnaireData = {};
  // let defaultValue = '+';
  vm.saveRequest = {};
  vm.details = {};
  vm.encryptKeyList = ['aboutYou', 'moreAboutYou', 'lifeProfile', 'customerEmail', 'givenName', 'surName', 'mobilePhone', 'phoneIDD', 'phoneCountryCode', 'nricFin', 'clientNumber'];
  vm.encryptSubKeyList = ['surName', 'givenName', 'nricFin', 'idd', 'mobilePhone', 'nric', 'customerEmail'];
  vm.encryptionLength = vm.encryptSubKeyList.length;
  vm.isExistCustomerDecl = dataStoreService.getItem('isExistCustomerDecl');
  vm.loginStatus = dataStoreService.getItem('loginStatus');

  /* function declaration */
  vm.validateInput = validateInput;
  vm.validateForm = validateForm;
  vm.openCancelModal = openCancelModal;
  vm.setStep = setStep;
  vm.howCollectDataModal = howCollectDataModal;
  vm.prefillCustomerInfo = prefillCustomerInfo;
  vm.saveAllWithoutValidation = saveAllWithoutValidation;
  vm.consultantAndSaveAndMail = consultantAndSaveAndMail;
  vm.validateAge = validateAge;
  vm.activate = activate;
  vm.initialFields = initialFields;
  vm.validateNRIC = validateNRIC;

  vm.hasDetailsChanged = null;
  vm.principalName = '';
  vm.authCodeAndState = '';
  vm.myInfoSelected = false;
  vm.myInfoHasError = false;
  vm.isSurnameEmpty = false;
  vm.isGivenNameEmpty = false;
  vm.isValidMobileNo = true;
  vm.isValidEmail = true;

  vm.retrieveMyInfo = retrieveMyInfo;
  vm.retrieveMyInfoEvent = retrieveMyInfoEvent;

  vm.$onInit = function () {
    window.addEventListener('load', retrieveMyInfoEvent);
    vm.surnameDropdown = false;
    vm.reqType = vm.profile.type;
    vm.aboutYouQuestions = constants.production[vm.reqType].aboutYouQuestion ? constants.production[vm.reqType].aboutYouQuestion.questions : [];
    vm.questionnaireCat = constants.production[vm.reqType].aboutYouQuestion ? constants.production[vm.reqType].aboutYouQuestion.cat : '';
    initialFields('productName', 'gender', 'title');
    // PACSDP-752 DPI product FC question hiding.
    vm.isDPIproduct = constants.DPIproduct[vm.reqType];
    vm.isAssignConsultant = 'true';
    vm.showMediSave = false;
    if (vm.profile.residencyCode < 3 && vm.reqType === 'PS') {
      vm.showMediSave = true;
    }
    dataStoreService.setItem('isDPIproduct', vm.isDPIproduct);
    vm.channel = dataStoreService.getItem('channel');
    vm.partnerChannel = dataStoreService.getItem('partnerChannel');
    vm.customId = vm.profile.customID;
    vm.product = dataStoreService.getOrderItem('product');
    vm.nric = vm.profile.newCustomerNric || vm.profile.loginDetail.username || '';
    vm.fcmobile = vm.profile.preferredFcMobile;
    occupation = dataStoreService.getItem('occupation') || utils.getOccupationFromProfile(vm.profile) || '';
    vm.iddEmpty = false;
    activate();
    $scope.$emit('getAboutYouValidation', vm.validateForm);
    $scope.$emit('getAboutYouTimeOut', vm.saveAllWithoutValidation);
    // country code changes update
    $scope.$on('hasIDDError', function (e, isEmpty) {
      vm.iddEmpty = isEmpty;
    });

    if (vm.profile.channel === 'DBS' && vm.profile.customer) {
      const contact = vm.profile.customer.contact;
      let nonSGHomeContact = contact.homeContactIDD && contact.homePhoneArea && (contact.homeContactIDD !== '65' || contact.homePhoneArea !== 'SGP');
      let nonSGMobileContact = contact.mobileContactIDD && contact.mobilePhoneArea && (contact.mobileContactIDD !== '65' || contact.mobilePhoneArea !== 'SGP');
      if (nonSGHomeContact || nonSGMobileContact) {
        $state.go('app.redirectGetHelp');
      }
      const addresses = vm.profile.customer.addresses;
      const lastAddress = addresses[addresses.length - 1];
      if (lastAddress.country !== 'SNG' && lastAddress.country !== 'SG') {
        $state.go('app.redirectGetHelp');
      }
    }

    getQuestionnaires();
    loadData();
  };
  $scope.$on('countryCodeChange', function (event, countryCode) {
    vm.selectedCountry = countryCode;
    vm.idd = vm.selectedCountry.split('_')[0];
    vm.mobileCountryCode = vm.selectedCountry.split('_')[1];
  });

  $scope.$watch('vm.isCollapsed', function (newValues, oldValues) {
    if (newValues !== oldValues) {
      $scope.$emit('leftContentsHeightChanged', true);
    }
  }, true);

  function getQuestionnaires() {
    let qChannel = '';
    customer = dataStoreService.getItem('customer') || vm.profile.customer || {};
    const surName = (vm.aboutYouDetail && vm.aboutYouDetail.surName) || customer.lastName;
    const givenName = (vm.aboutYouDetail && vm.aboutYouDetail.surName) || customer.firstName;
    const customerGender = (vm.aboutYouDetail && vm.aboutYouDetail.gender) || customer.gender;

    //PACSDP-4892 Added Encryption for Questionaire parameters
    apiService.encryption().then(function (res) {
      var publicKey = res.data.rsaPublicKey;
      var random = res.data.random;
      vm.questionRequest = {
        cat: constants.questionnaireCategory.QMAY,
        categoryList: [constants.questionnaireCategory.QMAY],
        lifeProfile: {
          name: surName + ' ' + givenName,
          dob: vm.profile.dob,
          nric: customer.idNumber,
          age: utils.calculateAge(vm.profile.dob) + 1,
          gender: customerGender,
          clientNumber: dataStoreService.getItem('clientNumber') || '',
          residentStatus: utils.conventResidencyForQuestionnaire(vm.profile.residencyCode),
          existingClient: vm.loginStatus,
          countryOfBirth: ''
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
            clientNumber: dataStoreService.getItem('clientNumber'),
          },
          policies: [{
            policyStatus: [constants.defaultPolicyStatus],
            afterIssueDate: constants.defaultIssueDate
          }]
        },
        classOccupation: vm.profile.occupationClass,
        hasAnswer: false, // flag for questionnaire prefill
        channel: qChannel,
        random: random[0]
      };
      var questionRequest = utils.setEncryptionList(vm.questionRequest, publicKey, random, ['lifeProfile'], ['nric']);
      return apiService.getQuestionnaire(questionRequest);
    }).then(function (res) {
      vm.aboutYouQ = angular.copy(res.data.payload);
    });
  }

  // get user info from iFrame
  function initialFields(...args) {
    for (let i in args) {
      if (args[i] === 'productName') {
        vm.productName = constants.production[vm.reqType].name;
      } else if (args[i] === 'gender') {
        vm.gender = constants.production[vm.reqType].gender || vm.profile.gender;
      } else if (args[i] === 'title') {
        if (vm.gender === constants.gender.femaleShortName) {
          vm.title = constants.title.lady;
        } else if (vm.gender === constants.gender.maleShortName) {
          vm.title = constants.title.man;
        }
      }
    }
  }

  function prefillCustomerInfo() {
    vm.customer = dataStoreService.getItem('customer');
    customer = vm.customer;
    // vm.idd = defaultValue;
    if (customer && customer.idNumber) {
      vm.email = customer.contact.email || '';
      if (customer.contact && customer.contact.mobilePhone && customer.contact.mobilePhone !== constants.singapore2) {
        let iddAndNumber = customer.contact.mobilePhone.split('-');
        if (iddAndNumber.length === 2) {
          vm.idd = iddAndNumber[0] || customer.contact.mobileContactIDD || utils.getIddNumber(customer.contact.mobilePhoneArea) || constants.singaporeIDD;
          vm.number = iddAndNumber[1] || '';
        } else {
          vm.idd = customer.contact.mobileContactIDD || utils.getIddNumber(customer.contact.mobilePhoneArea);
          vm.number = customer.contact.mobilePhone;
        }
      }
      vm.title = utils.titleCase(customer.salutation);
      vm.lastName = customer.lastName || '';
      vm.firstName = customer.firstName || '';
      vm.gender = customer.gender || '';
      vm.profile.dob = customer.dateOfBirth;
      vm.dob = vm.profile.dob;
      dataStoreService.session.setObject('profile', vm.profile);
      vm.nationality = customer.nationality || '';
    } else if (vm.profile.dob) {
      vm.dob = vm.profile.dob;
      if (parseInt(vm.profile.residencyCode, 10) === 1) {
        vm.nationality = constants.singapore;
      }
    }
    return customer;
  }

  function activate() {
    customer = prefillCustomerInfo();
  }

  function validateNRIC(nric) {
    return (nric ? utils.validateNRIC(nric) : false);
  }

  function validateInput(type, str, prerequisite) {
    if (type === constants.inputType.idd) {
      // if (!vm.idd || defaultValue !== vm.idd.substring(0, 1)) {
      //   vm.idd = defaultValue;
      // }
      vm.IDD = vm.iddEmpty;
    } else if (type === constants.inputType.email && str) {
      // fix the email vaildation in edit mode
      $scope.aboutYouForm.email.$setValidity(constants.inputType.email, utils.validateEmail(str));
    } else if (type === 'mobile' && str) {
      vm.mobileValidError = !utils.validateMobile(str, prerequisite);
      $scope.aboutYouForm.number.$setValidity('number', utils.validateMobile(str, prerequisite));
    }
  }

  function validateAge() {
    if (vm.dob) {
      vm.age = utils.calculateAge(vm.dob);
    } else if (vm.channel === constants.channel.PRUACCESS) {
      customer = dataStoreService.getItem('customer');
      vm.age = utils.calculateAge(customer.dateOfBirth);
    } else {
      vm.age = utils.calculateAge(vm.profile.dob);
    }
    vm.anb = vm.age + 1;
    let proInfo = dataStoreService.getOrderItem(constants.production[vm.profile.type].proInfo);
    return utils.ageValidation(vm.anb, {
      type: vm.reqType,
      channel: vm.channel,
      prodCode: proInfo.prodCode
    });
  }

  function validNRIClogin() {
    let customerRequest = {
      nric: vm.nric ? vm.nric.toUpperCase() : '',
      ...dataStoreService.session.getObject('profile'),
      loginDetail: null
    };

    /* Get encryption key */
    apiService.encryption().then(function (res) {
      var publicKey = res.data.rsaPublicKey;
      var random = res.data.random;
      customerRequest = utils.setEncryptionList(customerRequest, publicKey, random, ['nric', 'lifeProfiles', 'newCustomerNric'], ['clientID', 'nric']);
      customerRequest.random = random[0];
      /* check NRIC available */
      return apiService.validateClient(customerRequest);
    }).then(function (res) {
      // If payload is blank, means not a existing client
      if (!res.data.payload || (!res.data.payload.clientName && !res.data.payload.mobile)) {
        vm.profile.newCustomerNric = vm.nric.toUpperCase();
        vm.existingCustomer = false;
        var allowCustomerFlg = res.data.payload.allowNewCustomer;
        dataStoreService.setItem('allowCustomerFlg', allowCustomerFlg);
        if (allowCustomerFlg) {
          dataStoreService.session.setObject('profile', vm.profile);
          dataStoreService.setItem('notReloaded', true);
        } else {
          utils.redirectToHelp();
        }
        return new Promise().reject();
      } else if (res.data.payload && !res.data.payload.mobileValid) {
        $state.go('app.redirectToAgent', { type: 'incorrectData' });
        return new Promise().reject();
      }
      vm.existingCustomer = true;
      dataStoreService.setItem('nricValidationError', true);
      return $state.go('app.login');
    }).catch(function () { });
  }

  function validateForm() {
    if (vm.myInfoSelected && !vm.myInfoHasError) {
      if (typeof (vm.surName) === 'undefined' || vm.surName.trim() === '') {
        vm.isSurnameEmpty = true;
      } else {
        vm.isSurnameEmpty = false;
      }
      if (typeof (vm.givenName) === 'undefined' || vm.givenName.trim() === '') {
        vm.isGivenNameEmpty = true;
        vm.givenName = '';
      } else {
        vm.isGivenNameEmpty = false;
        vm.firstName = vm.givenName;
      }

      if (vm.isSurnameEmpty || vm.isGivenNameEmpty) {
        return;
      }
    }

    if (vm.selectedCountry !== '65_SGP' || vm.idd !== '65' || vm.mobileCountryCode !== 'SGP') {
      $state.go('app.redirectGetHelp');
    }

    $scope.$broadcast('saveQuestionWithoutValidation', [constants.production[vm.profile.type].aboutYouQuestion && constants.production[vm.profile.type].aboutYouQuestion.cat]);
    let isGenderValid = true;

    /* 1.nric validation
       when customer declare as new customer and entered valid nric
       */
    var validNRIC = true;
    validNRIC = vm.validateNRIC(vm.nric);
    dataStoreService.setOrderItem('aboutYouQMay', vm.questionnaireData);
    if (!validNRIC && $scope.aboutYouForm.nric.$valid) {
      utils.openResidentialModel(constants.crossBorderMsg.foreignIdentification);
    } else if (vm.selectedCountry !== '65_SGP') {
      utils.openResidentialModel(constants.crossBorderMsg.foreignContactNumber);
    }

    if (typeof (vm.isExistCustomerDecl) !== 'undefined' && vm.isExistCustomerDecl === 'false' && validNRIC) {
      validNRIClogin();
    }
    /* 1.email validation
       (only singapore new customer) mobile validation
       2.idd and dob validation
       3.age validation
       4.check if exists lead gen answer
       5.save user input detail */
    vm.validateInput('email', vm.email);
    vm.validateInput('mobile', vm.number, vm.idd);

    // countryCode Dropdown validation
    const validCountryCode = vm.iddEmpty;
    if (vm.reqType === constants.production.PGP.shortName || vm.reqType === constants.production.PGRP.shortName || vm.reqType === constants.production.PAS.shortName) {
      if (!vm.gender) {
        isGenderValid = false;
      }
    }
    if (!$scope.aboutYouForm.$invalid && !vm.invalidDate && isGenderValid && validNRIC && !validCountryCode && vm.selectedCountry === '65_SGP') {
      vm.ageValid = validateAge();
      if (!vm.ageValid) {
        $state.go('app.redirectToAgent');
      } else {
        vm.saveRequest = {
          customId: vm.customId,
          productType: vm.reqType,
          title: vm.title,
          surName: vm.lastName,
          givenName: vm.firstName,
          nricFin: vm.nric,
          idd: vm.idd.replace('+', ''),
          phoneIDD: vm.idd || constants.singaporeIDD,
          phoneCountryCode: vm.mobileCountryCode || 'SGP',
          mobilePhone: vm.idd + '' + vm.number, // fix PD-1485:Mobile number country code error
          clientNumber: dataStoreService.getItem('clientNumber') || null,
          customerEmail: vm.email,
          gender: vm.profile.gender || vm.gender || '',
          dob: vm.profile.dob,
          requestFinancialConsultant: vm.isAssignConsultant === 'true',
          preferredAgentMobile: vm.fcmobile ? (constants.iddNumber.sgIddWithHyphen + vm.fcmobile) : '',
          assignedAgent: dataStoreService.getItem('assignedAgent') || null
        };
        vm.details = {
          customId: vm.customId,
          productType: vm.reqType,
          title: vm.title,
          surName: vm.lastName,
          givenName: vm.firstName,
          nricFin: vm.nric,
          idd: vm.idd.replace('+', ''),
          passType: vm.passType,
          passStatus: vm.passStatus,
          passExpiryDate: vm.passExpiryDate,
          residentialStatus: vm.residentialStatus,
          nationality: vm.nationality,
          phoneIDD: vm.idd || constants.singaporeIDD,
          phoneCountryCode: vm.mobileCountryCode || 'SGP',
          mobilePhone: vm.number,
          gender: vm.profile.gender || vm.gender || '',
          customerEmail: vm.email,
          dob: vm.profile.dob,
          requestFinancialConsultant: vm.isAssignConsultant
        };
        if (vm.reqType === constants.production.PGP.shortName || vm.reqType === constants.production.PGRP.shortName) {
          vm.profile.gender = vm.gender;
          dataStoreService.session.setObject('profile', vm.profile);
        }
        if (vm.profile.gender === null && vm.gender !== null && vm.gender !== '') {
          vm.profile.gender = vm.gender;
          dataStoreService.session.setObject('profile', vm.profile);
        }
        dataStoreService.setOrderItem('aboutYouDetails', vm.details);
        dataStoreService.setItem('aboutYouDetails', vm.details);
        $rootScope.aboutYou = true;
        if (utils.isAmerican(vm.idd)) {
          dataStoreService.setItem('kickoutFlag', true);
        }
        // new client - save about you
        if (vm.summaryStep === constants.step.detail) {
          let closeEmailReq = {
            mailType: constants.mailType.closeBrowser,
            customId: vm.profile.customID,
            givenName: vm.firstName,
            surName: vm.lastName,
            mobilePhone: (vm.idd || constants.singaporeIDD) + (vm.number || ''),
            phoneIDD: vm.idd || constants.singaporeIDD,
            phoneCountryCode: vm.mobileCountryCode || 'SGP',
            stage: '',
            productName: constants.production[vm.profile.type].name,
            age: utils.calculateAge(vm.profile.dob),
            occupation: occupation ? occupation.occupationDesc : '',
            nationality: customer ? customer.nationality : '',
            erefNo: '',
            nricFin: vm.nric,
            gender: vm.gender || '',
            dob: vm.profile.dob,
            customerEmail: customer && customer.contact ? customer.contact.email || '' : '',
            isExistingClient: false,
            selectedProducts: {
              docId: vm.product.docId,
              prodCode: vm.product.prodCode,
              components: [{
                compoCode: vm.product.basic.compoCode,
                isBasic: true
              }]
            },
            referralAgentCode: dataStoreService.getItem('referralAgentCode') || '',
            preferredAgentMobile: vm.fcmobile ? (constants.iddNumber.sgIddWithHyphen + vm.fcmobile) : '',
            assignedAgent: dataStoreService.getItem('assignedAgent') || null
          };
          if (vm.reqType === constants.production.PAS.shortName) {
            closeEmailReq.selectedProducts.components[0].premiumTerm = vm.product.basic.premiumTerm;
          }

          consultantAndSaveAndMail(vm.saveRequest, closeEmailReq);
          // startListener: the flag for if the api can call agent API to get the agent detail to send mail or not
          dataStoreService.session.setObject('startListener', true);
          $scope.$emit('hideMyInfoErrorMessage', { hide: true });
        }
      }
    } else {
      // show error message if not passing validation
      let validateFileds = {
        lastName: !vm.lastName,
        firstName: !vm.firstName,
        number: !vm.number || !utils.validateMobile(vm.number, vm.idd),
        email: !vm.email || !utils.validateEmail(vm.email),
        gender: !vm.gender,
        isAssignConsultant: vm.isAssignConsultant
      };
      if (vm.isExistCustomerDecl === 'false' && vm.summaryStep === 'DETAIL') {
        validateFileds.nric = !vm.nric || !utils.validateNRIC(vm.nric);
      }
      if (vm.summaryStep === constants.step.detail) {
        validateFileds.isAssignConsultant = !vm.isAssignConsultant;
      }
      // PACSDP-902 invalid mobile of existing customer
      if (vm.summaryStep === constants.step.edit
        && vm.loginStatus
        && (!utils.validateMobile(vm.number, vm.idd)
          || $scope.aboutYouForm.firstName.$error.pattern
          || $scope.aboutYouForm.lastName.$error.pattern)
      ) {
        window.console.error('Error: the information of the existing customer is invalid. (Name or Mobile)');
        utils.redirectToHelp();
      }
      utils.setFieldsBlurAndInvalid($scope.aboutYouForm, validateFileds);
      if (vm.summaryStep === constants.step.detail) {
        utils.scrollToFirstInvalidField();
      }
      $rootScope.aboutYou = false;
    }

    //    if (vm.myInfoHasError) {
    //      $scope.$emit('showMyInfoErrorMessage', false);
    //    }
  }

  function saveAllWithoutValidation() {
    vm.dob = vm.profile.dob;
    vm.details = {
      customId: vm.customId,
      productType: vm.reqType,
      title: vm.title,
      surName: vm.lastName,
      givenName: vm.firstName,
      nricFin: vm.nric,
      idd: vm.idd.replace('+', ''),
      phoneIDD: vm.idd || constants.singaporeIDD,
      mobilePhone: vm.number,
      phoneCountryCode: vm.mobileCountryCode || 'SGP',
      gender: vm.profile.gender || vm.gender || '',
      customerEmail: vm.email,
      dob: vm.dob
    };
    dataStoreService.setItem('aboutYouDetails', vm.details);
    dataStoreService.setOrderItem('aboutYouDetails', vm.details);
  }

  /* save all answers of questionnaire when passing validation
     jsonfile => category
     collect all questions with answer for every category*/
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

  function openCancelModal() {
    $uibModal.open({
      animation: true,
      backdrop: 'static',
      component: 'cancelModal',
      size: 'lg',
      resolve: {
        customId() {
          return vm.customId;
        }
      }
    });
  }

  function setStep() {
    vm.isCollapsed = !vm.isCollapsed;
    if (!vm.isCollapsed && vm.summaryStep === constants.step.detail) {
      vm.changeDetailStep({
        $event: {
          detailStep: constants.section.aboutYou
        }
      });
    }
  }

  function consultantAndSaveAndMail(saveReq, emailReq) {
    let publicKey = null;
    let random = null;
    let encryptedContent = null;
    apiService.encryption().then(function (res) {
      publicKey = res.data.rsaPublicKey;
      random = res.data.random;
      encryptedContent = utils.setEncryptionList(saveReq, publicKey, random, vm.encryptKeyList);
      /* 1. save about you*/
      return apiService.saveAllAboutYou(encryptedContent);
    }).then(function () {
      encryptedContent = utils.setEncryptionList(emailReq, publicKey, random, vm.encryptKeyList);
      // change to more about you section
      vm.changeDetailStep({
        $event: {
          detailStep: constants.section.moreAboutYou
        }
      });
      vm.isCollapsed = true;
      /* 2. send close browser mail*/
      return apiService.addmail(encryptedContent, function () {
        $scope.$emit('getAgentInfo', true);
      });
    })
      .catch(function (error) {
        throw error;
      });
  }

  function howCollectDataModal() {
    $uibModal.open({
      animation: true,
      component: 'howCollectData',
      backdrop: 'static',
      size: 'lg'
    });
  }

  function retrieveMyInfo() {
    apiService.getMyInfoDetails(vm.authCodeAndState).then((res) => {
      vm.myInfoSelected = dataStoreService.session.getValue('myInfoSelected');
      if (res.data && res.data.message) {
        let errorMessage = '';
        let errorClass = '';
        vm.myInfoHasError = true;
        vm.myInfoSelected = false;
        dataStoreService.session.setValue('myInfoSelected', vm.myInfoSelected);
        dataStoreService.session.setValue('myInfoHasError', vm.myInfoHasError);

        if (res.data.code === 'INVALID_FIELDS') {
          let fields = res.data.message.split(',');
          errorMessage = '<strong>Insufficient Information</strong><br/>We are unable to proceed with MyInfo as the below information is either missing or incorrect.<br/>';
          fields.forEach(function (item, index) {
            if (item.trim().length > 0) {
              errorMessage += (index + 1) + '. ' + item + '<br/>';
            }
          });
          errorMessage += 'Please update your MyInfo data.';
          errorClass = 'my-info-error-align-left';
        } else {
          errorMessage = '<strong>Myinfo</strong> is temporarily unavailable. Please try again later.';
        }

        $scope.$emit('showMyInfoErrorMessage', { show: vm.myInfoHasError, myInfoErrorMessage: errorMessage, myInfoErrorClass: errorClass });
      } else {
        if (validateRegAddr(res.data.regAdd)) {
          $scope.$emit('myInfoReqisteredAddress', res.data.regAdd);
          if ((vm.profile.residencyCode === 1 || vm.profile.residencyCode === 2 || vm.profile.residencyCode === 3)
          && vm.profile.loginStatus && vm.profile.newCustomerNric !== '') {
            vm.showResAddChanged = false;
          }
          if (vm.profile.residencyCode === 1 || vm.profile.residencyCode === 2 || vm.profile.residencyCode === 3) {
            $scope.$emit('disableAddress', true);
          }
        } else if (validateRegAddr(res.data.regAdd) && (vm.profile.residencyCode === 1 || vm.profile.residencyCode === 2)) {
          $scope.$emit('disableAddress', true);
        } else if (validateRegAddr(res.data.regAdd)) {
          if (vm.profile.residencyCode === 3 && !vm.profile.loginStatus && vm.profile.newCustomerNric === '') {
            vm.showResAddChanged = true;
          }
        }

        vm.customer = dataStoreService.getItem('customer');
        if (!vm.customer) {
          vm.customer = {};
          vm.nric = res.data.uinfin;
        }
        vm.customer.nationality = res.data.nationality.code;

        const channel = dataStoreService.getItem('partnerChannel') || dataStoreService.session.getValue('partnerChannel');

        if (vm.profile.loginStatus && vm.customer.gender !== res.data.sex.code) {
          dataStoreService.setItem('genderValidationError', true);
          if (channel) {
            const code = compose(toUpperCase, btoa)(channel);
            return $state.go('app.psEntry', { channelCode: code });
          } else {
            return $state.go('app.psEntry');
          }
        }

        let myInfoDob = formatDate(res.data.dob);
        if (vm.profile.dob !== myInfoDob) {
          dataStoreService.setItem('dobValidationError', true);
          if (channel) {
            const code = compose(toUpperCase, btoa)(channel);
            return $state.go('app.psEntry', { channelCode: code });
          } else {
            return $state.go('app.psEntry');
          }
        }

        if ((vm.profile.residencyCode === 1 && res.data.residentialStatus.code !== 'C')
            || (vm.profile.residencyCode === 2 && res.data.residentialStatus.code !== 'P')
            || (vm.profile.residencyCode === 3 && (typeof (res.data.residentialStatus.code) !== 'undefined'
            && res.data.residentialStatus.code.trim() !== ''))) {
          dataStoreService.setItem('residencyStatusValidationError', true);
          if (channel) {
            const code = compose(toUpperCase, btoa)(channel);
            return $state.go('app.psEntry', { channelCode: code });
          } else {
            return $state.go('app.psEntry');
          }
        }

        vm.residentialStatus = res.data.residentialStatus.code;
        vm.residentialStatusDesc = res.data.residentialStatus.desc;
        if (vm.residentialStatus === 'C') {
          vm.residentialStatusDesc = res.data.residentialStatus.desc || 'CITIZEN';
        } else if (vm.residentialStatus === 'P') {
          vm.residentialStatusDesc = res.data.residentialStatus.desc || 'PR';
        } else {
          vm.residentialStatusDesc = 'FIN';
        }

        vm.surnameDropdown = true;
        $scope.surnameValues = res.data.namePermutations;
        $scope.copyselectedType = $scope.surnameValues[1];

        if (((typeof (res.data.residentialStatus.code) !== 'undefined'
          && res.data.residentialStatus.code.trim() !== '')
          || ((typeof (res.data.residentialStatus.code) === 'undefined'
          || res.data.residentialStatus.code.trim() === '')))
          && validateRegAddr(res.data.regAdd)) {
          $rootScope.$broadcast('hideDocUpload', true);
        } else {
          $rootScope.$broadcast('proofOfAddressOption', true);
        }

        vm.customer.gender = res.data.sex.code;
        vm.gender = res.data.sex.code;
        vm.principalName = res.data.name;
        vm.dob = formatDate(res.data.dob);

        let passType = '';

        if (res.data.passType && res.data.passType.code && res.data.passType.code.trim() !== '') {
          passType = _.find(constants.passTypeOptions, function (item) {
            return (item.value === parseInt(res.data.passType.code, 10));
          });
        }

        const nationality = _.find(vm.allNationality, function (item) {
          return (item.value === res.data.nationality.code);
        });

        vm.nationality = typeof (nationality) === 'object' ? nationality.value : nationality;
        vm.nationalityDesc = typeof (nationality) === 'object' ? res.data.nationality.desc : nationality;
        vm.passType = typeof (passType) === 'object' ? passType.value : passType;
        vm.passTypeDesc = typeof (passType) === 'object' ? passType.option : passType;
        vm.passStatus = res.data.passStatus;
        vm.passExpiryDate = formatDate(res.data.passExpiryDate);

        let contact = typeof (vm.customer) !== 'undefined' && typeof (vm.customer.contact) !== 'undefined' ? vm.customer.contact : {};
        if (typeof (res.data.mobileNo) !== 'undefined'
        && typeof (res.data.mobileNo.nbr) !== 'undefined'
        && res.data.mobileNo.nbr.trim() !== '') {
          contact.mobilePhone = res.data.mobileNo.nbr;
          vm.number = res.data.mobileNo.bnr;
          if (typeof (res.data.mobileNo.areaCode) !== 'undefined'
          && typeof (res.data.mobileNo.areaCode) !== 'undefined'
          && res.data.mobileNo.areaCode.trim() !== '') {
            vm.idd = res.data.mobileNo.areaCode.replace('0', '');
          }
        } else if (typeof (vm.customer) !== 'undefined'
        && typeof (vm.customer.contact) !== 'undefined'
        && typeof (vm.customer.contact.mobilePhone) !== 'undefined'
        && vm.customer.contact.mobilePhone.trim() !== '') {
          contact.mobilePhone = vm.customer.contact.mobilePhone;
          contact.mobileContactIDD = vm.customer.contact.mobileContactIDD;
          vm.number = vm.customer.contact.mobilePhone;
          vm.idd = vm.customer.contact.mobileContactIDD;
        } else {
          vm.isValidMobileNo = false;
        }

        if (typeof (res.data.email) !== 'undefined'
        && res.data.email.trim() !== '') {
          contact.email = res.data.email;
          vm.email = res.data.email;
        } else if (typeof (vm.customer) !== 'undefined'
        && typeof (vm.customer.contact) !== 'undefined'
        && typeof (vm.customer.contact.email) !== 'undefined'
        && vm.customer.contact.email.trim() !== '') {
          contact.email = vm.customer.contact.email;
          vm.email = vm.customer.contact.email;
        } else {
          vm.isValidEmail = false;
        }

        vm.customer.contact = contact;
        customer = vm.customer;
        vm.title = utils.titleCase(customer.salutation);

        if (customer.contact && customer.contact.mobilePhone && customer.contact.mobilePhone !== constants.singapore2) {
          let iddAndNumber = customer.contact.mobilePhone.split('-');
          if (iddAndNumber.length === 2) {
            vm.idd = iddAndNumber[0] || customer.contact.mobileContactIDD || utils.getIddNumber(customer.contact.mobilePhoneArea) || constants.singaporeIDD;
            vm.number = iddAndNumber[1] || '';
          } else {
            vm.idd = customer.contact.mobileContactIDD || utils.getIddNumber(customer.contact.mobilePhoneArea);
            vm.number = customer.contact.mobilePhone;
          }
        }

        vm.idd = vm.idd.replace('+', '');
        vm.details = {
          customId: vm.customId,
          productType: vm.reqType,
          title: vm.title,
          surName: vm.lastName,
          givenName: vm.firstName,
          principalName: vm.principalName,
          nricFin: vm.nric,
          passType: vm.passType,
          passStatus: vm.passStatus,
          passExpiryDate: vm.passExpiryDate,
          residentialStatus: vm.residentialStatus,
          nationality: vm.nationality,
          nationalityDesc: vm.nationalityDesc,
          idd: vm.idd,
          phoneIDD: vm.idd || constants.singaporeIDD,
          phoneCountryCode: vm.mobileCountryCode || 'SGP',
          mobilePhone: vm.number,
          gender: vm.gender || '',
          customerEmail: vm.email,
          dob: myInfoDob || vm.profile.dob,
          requestFinancialConsultant: vm.isAssignConsultant
        };
        dataStoreService.setItem('aboutYouDetails', vm.details);
        dataStoreService.setOrderItem('aboutYouDetails', vm.details);
        dataStoreService.session.setObject('aboutYouDetails', vm.details);
        $scope.$emit('myInfoButtonClicked', true);
        vm.myInfoHasError = false;
        dataStoreService.session.setValue('myInfoHasError', vm.myInfoHasError);
      }
    }).catch(function (error) {
      throw error;
    });
  }

  $scope.onSurnameDropdownChange = function () {
    let surnameValue = $('#surnameValue').find(':selected').text();
    let string = vm.principalName;
    let result = '';
    string = string.split(' ');
    const stringArray = [];
    for (let i = 0; i < string.length; i++) {
      if (!surnameValue.includes(string[i])) {
        stringArray.push(string[i]);
        result += string[i] + ' ';
      }
    }
    vm.givenName = result.replace(/^\s+/g, ' ').trim();
    vm.surName = surnameValue;
    vm.customer.firstName = vm.givenName;
    vm.customer.lastName = vm.surName;
    vm.firstName = vm.givenName;
    vm.lastName = vm.surName;

    let details = dataStoreService.getItem('aboutYouDetails')
    || dataStoreService.getOrderItem('aboutYouDetails')
    || dataStoreService.session.getObject('aboutYouDetails');

    details.givenName = vm.givenName;
    details.surName = vm.surName;

    dataStoreService.setItem('aboutYouDetails', vm.details);
    dataStoreService.setOrderItem('aboutYouDetails', vm.details);
    dataStoreService.session.setObject('aboutYouDetails', vm.details);
  };

  function retrieveMyInfoEvent() {
    const url = new URL(this.location.href);
    if (this.location.href.includes('code')) {
      const code = url.searchParams.get('code');
      const state = url.searchParams.get('state');
      vm.authCodeAndState = code + '_' + state;
      retrieveMyInfo();
    }
  }

  function validateRegAddr(regAddr) {
    if (regAddr) {
      if (regAddr.postal && regAddr.postal.trim() !== ''
          && regAddr.block && regAddr.block.trim() !== ''
          && regAddr.street && regAddr.street.trim() !== '') {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  function formatDate(date) {
    if (date && date.trim() !== '') {
      let splitDate = date.split('-');
      return splitDate[2] + '/' + splitDate[1] + '/' + splitDate[0];
    } else {
      return '';
    }
  }

  function loadData() {
    apiService.dropdowns({
      dropDownCodeList: [constants.dropDownCode.pfcopt066]
    }).then(function (res) {
      if (res && res.data) {
        vm.allNationality = res.data.PFCOPT066;
      }
    }).catch(function (error) {
      throw error;
    });
  }
}
