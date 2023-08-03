module.exports = {
  template: require('./about-you-review.html'),
  controller: AboutYouReviewController,
  controllerAs: 'vm',
  bindings: {
    summaryStep: '<',
    profile: '<',
    dob: '='
  }
};
/** @ngInject */
function AboutYouReviewController(apiService, dataStoreService, utils, $scope, $uibModal, $rootScope, $state, constants, $ngRedux) {
  let vm = this;
  vm.saveRequest = {};
  vm.details = {};
  vm.encryptKeyList = ['surName', 'givenName', 'nricFin', 'idd', 'mobilePhone', 'phoneIDD', 'phoneCountryCode', 'customerEmail'];
  vm.inputDetails = [
    {
      // PD-2442: Display only "Name" in Application form if First Name missing in LA
      labelValue: 'Surname',
      inputName: 'lastName',
      validationType: ''
    },
    {
      labelValue: 'Given name(s)',
      inputName: 'firstName',
      validationType: '',
      isNotRequired: true
    },
    {
      labelValue: 'NRIC/FIN',
      inputName: 'nric',
      validationType: ''
    },
    {
      labelValue: 'Email address',
      inputName: 'email',
      validationType: ''
    }];
  vm.genders = {
    M: constants.gender.male,
    F: constants.gender.female
  };
  vm.encryptionLength = vm.encryptKeyList.length;
  vm.loginStatus = dataStoreService.getItem('loginStatus');

  // Function For About You
  vm.validateInput = validateInput;
  vm.validateForm = validateForm;
  vm.saveAllWithoutValidation = saveAllWithoutValidation;
  vm.formatDate = formatDate;
  vm.validateAge = validateAge;
  vm.initialField = initialField;
  vm.isExistCustomerDecl = dataStoreService.getItem('isExistCustomerDecl');

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
    vm.reqType = vm.profile.type;
    vm.aboutYouQuestions = constants.production[vm.reqType].aboutYouQuestion ? constants.production[vm.reqType].aboutYouQuestion.questions : [];
    vm.questionnaireCat = constants.production[vm.reqType].aboutYouQuestion ? constants.production[vm.reqType].aboutYouQuestion.cat : '';
    vm.aboutYouDetails = dataStoreService.getOrderItem('aboutYouDetails');
    vm.moreAboutYouDetails = dataStoreService.getOrderItem('moreAboutYouDetails');
    vm.myInfoSelected = dataStoreService.session.getValue('myInfoSelected');
    //    vm.myInfoHasError = dataStoreService.session.getValue('myInfoHasError');
    initialField('productName', 'gender', 'title');
    vm.channel = dataStoreService.getItem('channel');
    vm.customId = vm.profile.customID;
    vm.isPAS = dataStoreService.getItem('reqType') === constants.production.PAS.shortName;
    vm.product = dataStoreService.getOrderItem('product');
    vm.showMediSave = false;
    if (vm.profile.residencyCode < 3 && vm.reqType === 'PS') {
      vm.showMediSave = true;
    }
    // prefill information from detail summary page
    vm.principalName = vm.aboutYouDetails.principalName;
    vm.title = vm.aboutYouDetails.title;
    vm.firstName = vm.aboutYouDetails.givenName;
    vm.lastName = vm.aboutYouDetails.surName;
    vm.inputDetails[0].labelValue = !vm.firstName && vm.lastName && vm.loginStatus ? 'Name' : 'Surname';
    vm.nric = vm.aboutYouDetails.nricFin;
    vm.idd = vm.aboutYouDetails.idd;
    vm.number = vm.aboutYouDetails.mobilePhone;
    vm.email = vm.aboutYouDetails.customerEmail;
    vm.phoneCountryCode = vm.aboutYouDetails.phoneCountryCode;

    if (vm.aboutYouDetails.dob) {
      vm.dob = vm.aboutYouDetails.dob;
    }
    $scope.$on('countryCodeChange', function (event, countryCode) {
      vm.selectedCountry = countryCode;
      vm.phoneIDD = vm.selectedCountry.split('_')[0];
      vm.phoneCountryCode = vm.selectedCountry.split('_')[1];
      $scope.$emit('countryCodeUpdate', countryCode);
    });

    getQuestionnaires();
    if (vm.myInfoSelected) {
      vm.passType = vm.aboutYouDetails.passType;

      const passType = _.find(constants.passTypeOptions, function (item) {
        return (item.value === vm.passType);
      });

      vm.passTypeDesc = typeof (passType) === 'object' ? passType.option : passType;

      vm.passStatus = vm.aboutYouDetails.passStatus;
      vm.passExpiryDate = vm.aboutYouDetails.passExpiryDate;
      vm.residentialStatus = vm.aboutYouDetails.residentialStatus;
      if (vm.residentialStatus === 'C') {
        vm.residentialStatusDesc = 'Citizen';
      } else if (vm.residentialStatus === 'P') {
        vm.residentialStatusDesc = 'PR';
      } else if (vm.residentialStatus === 'U') {
        vm.residentialStatusDesc = 'Unknown';
      } else if (vm.residentialStatus === 'N') {
        vm.residentialStatusDesc = 'N/A';
      } else {
        vm.residentialStatusDesc = 'FIN';
      }

      if (vm.myInfoSelected === true || vm.myInfoSelected === 'true') {
        vm.nationality = vm.aboutYouDetails.nationality;
        vm.nationalityDesc = vm.aboutYouDetails.nationalityDesc;
        if (typeof (vm.nationalityDesc) === 'undefined' || vm.nationalityDesc.trim() === '') {
          let aboutYouDetails = dataStoreService.session.getObject('aboutYouDetails');
          vm.nationalityDesc = aboutYouDetails.nationalityDesc;
        }
      } else {
        vm.nationality = vm.moreAboutYouDetails.nationality;
      }
      loadData();
    }

    // emit to parent page for validation and timeout
    $scope.$emit('getAboutYouValidationForReview', vm.validateForm);
    $scope.$emit('getAboutYouTimeOut', vm.saveAllWithoutValidation);
  };

  vm.editSection = () => {
    $scope.$broadcast('editField');
    $scope.$emit('switchEditStatus');
  };

  function getQuestionnaires() {
    let qChannel = '';
    let customer = dataStoreService.getItem('customer') || vm.profile.customer || {};
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
  function initialField(...args) {
    for (let i in args) {
      if (args[i] === 'productName') {
        vm.productName = constants.production[vm.reqType].name;
      } else if (args[i] === 'gender') {
        vm.gender = vm.aboutYouDetails.gender || vm.moreAboutYouDetails.gender || vm.profile.gender;
      } else if (args[i] === 'title') {
        if (vm.gender === constants.gender.femaleShortName) {
          vm.title = constants.title.lady;
        } else if (vm.gender === constants.gender.maleShortName) {
          vm.title = constants.title.man;
        }
      }
    }
  }

  function validateInput(type, str, prerequisite) {
    if (type === constants.inputType.nric) {
      $scope.aboutYouForm.nric.$invalid = !utils.validateNRIC(str);
      if (!vm.loginStatus) {
        $scope.$emit('changeAgentChangeFlg', true);
      }
    } else if (type === constants.inputType.idd) {
      $scope.aboutYouForm.number.$setValidity('number', utils.validateMobile(str, prerequisite));
      vm.mobileValidError = !utils.validateMobile(vm.number, str);
    } else if (type === constants.inputType.email) {
      // fix the email vaildation in edit mode
      $scope.aboutYouForm.email.$setValidity('required', utils.validateEmail(str));
    } else if (type === 'mobile' && str) {
      vm.mobileValidError = !utils.validateMobile(str, prerequisite);
      $scope.aboutYouForm.number.$setValidity('number', utils.validateMobile(str, prerequisite));
    } else if (type === 'firstName') {
      $scope.aboutYouForm.firstName.$setValidity(type, validateName(str));
    } else if (type === 'lastName') {
      $scope.aboutYouForm.lastName.$setValidity(type, validateName(str));
    }
  }

  function validateName(str) {
    const target = str.toString(str);
    const reg = /^(['&quot;+a-zA-Z0-9()#.@,%&/-])+(\s['&quot;+a-zA-Z0-9()#.@,%&/-]+)*['&quot;+a-zA-Z0-9()#.@,%&/-\s]{0,1}$/;
    return reg.test(target);
  }

  function validateAge() {
    if (vm.dob) {
      vm.age = utils.calculateAge(vm.dob);
    } else if (vm.channel === constants.channel.PRUACCESS) {
      let customer = dataStoreService.getItem('customer');
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

  function validateForm() {
    /* 1.age validation
       2.check if exists lead gen answer
       3.save user input detail */
    if (!$scope.aboutYouForm.$invalid && utils.validateNRIC(vm.nric) && !vm.IDD) {
      vm.ageValid = validateAge();
      if (!vm.ageValid) {
        dataStoreService.setItem('kickoutFlag', true);
      } else {
        vm.saveRequest = {
          customId: vm.customId,
          productType: vm.reqType,
          title: vm.title,
          surName: vm.lastName,
          givenName: vm.firstName,
          nricFin: vm.nric,
          idd: vm.idd,
          phoneIDD: vm.idd || constants.singaporeIDD,
          phoneCountryCode: vm.phoneCountryCode || 'SGP',
          mobilePhone: vm.idd + '' + vm.number, // fix PD-1485:Mobile number country code error
          clientNumber: dataStoreService.getItem('clientNumber') || null,
          customerEmail: vm.email
        };
        vm.details = {
          customId: vm.customId,
          productType: vm.reqType,
          title: vm.title,
          surName: vm.lastName,
          givenName: vm.firstName,
          nricFin: vm.nric,
          idd: vm.idd,
          mobilePhone: vm.number,
          phoneIDD: vm.idd || constants.singaporeIDD,
          phoneCountryCode: vm.phoneCountryCode || 'SGP',
          gender: vm.gender,
          dob: formatDate(vm.dob),
          customerEmail: vm.email
        };
        dataStoreService.setItem('aboutYouDetails', vm.details);
        dataStoreService.setOrderItem('aboutYouDetails', vm.details);
        $rootScope.aboutYou = true;
        if (utils.isAmerican(vm.idd)) {
          dataStoreService.setItem('kickoutFlag', true);
        }
      }
    } else {
      // show error message if not passing validation
      utils.setFieldsBlurAndInvalid($scope.aboutYouForm, {
        lastName: !vm.lastName,
        firstName: !vm.firstName,
        nric: !vm.nric || !utils.validateNRIC(vm.nric),
        number: !vm.number || !utils.validateMobile(vm.number, vm.idd),
        email: !vm.email || !utils.validateEmail(vm.email)
      });
      $rootScope.aboutYou = false;
    }
  }

  function saveAllWithoutValidation() {
    vm.details = {
      customId: vm.customId,
      productType: vm.reqType,
      title: vm.title,
      surName: vm.lastName,
      givenName: vm.firstName,
      nricFin: vm.nric,
      idd: vm.idd,
      mobilePhone: vm.number,
      phoneIDD: vm.idd || constants.singaporeIDD,
      phoneCountryCode: vm.phoneCountryCode || 'SGP',
      gender: vm.gender,
      customerEmail: vm.email,
      dob: formatDate(vm.dob)
    };
    dataStoreService.setItem('aboutYouDetails', vm.details);
    dataStoreService.setOrderItem('aboutYouDetails', vm.details);
  }

  function formatDate(date) {
    if (typeof date !== 'string') {
      let dobDay = angular.copy(new Date(date).getDate());
      let dobMonth = angular.copy(new Date(date).getMonth() + 1);
      let dobYear = angular.copy(new Date(date).getFullYear());
      return dobDay + '/' + dobMonth + '/' + dobYear;
    }
    return date;
  }

  function loadData() {
    apiService.dropdowns({
      dropDownCodeList: [constants.dropDownCode.pfcopt066]
    }).then(function (res) {
      if (res && res.data) {
        // dropdown for nationality
        vm.allNationality = res.data.PFCOPT066;
        vm.nationality = _.find(vm.allNationality, function (item) {
          return (item.value === vm.nationality);
        });
        if (typeof (vm.nationalityDesc) === 'undefined' || vm.nationalityDesc.trim() === '') {
          vm.nationalityDesc = vm.nationality.option;
        }
      }
    }).catch(function (error) {
      throw error;
    });
  }
}
