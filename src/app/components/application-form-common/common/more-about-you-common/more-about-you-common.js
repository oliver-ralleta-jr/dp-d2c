module.exports = {
  template: require('./more-about-you-common.html'),
  controller: MoreAboutYouCommonController,
  controllerAs: 'vm',
  bindings: {
    hideUpload: '=',
    summaryStep: '<',
    detailStep: '<',
    changeDetailStep: '&',
    isCollapsed: '<',
    profile: '<',
    showResAddChanged: '='
  }
};
/** @ngInject */
function MoreAboutYouCommonController(apiService, $state, $scope, dataStoreService, utils, $timeout, $uibModal, $rootScope, constants, $filter) {
  let vm = this;
  let customer = null;
  let previous = null;
  let next = null;
  vm.questionnaireData = {};
  vm.taxQ = {};
  vm.previousProfile = {};
  vm.section = ['QMAY010']; // question section predefined as Pru quetionnaire API
  vm.encryptSubKeyList = ['mailingUnitNo', 'mailingStreetName', 'mailingBuildingName', 'mailingBlockNo', 'mailingPostalCode', 'residentialUnitNo',
    'residentialStreetName', 'residentialBuildingName', 'residentialBlockNo', 'residentialPostalCode', 'residentialCountry', 'mailingCountry', 'nationality'
  ];
  vm.isExistCustomerDecl = dataStoreService.getItem('isExistCustomerDecl');
  vm.encryptionLength = vm.encryptSubKeyList.length;
  vm.questionRequest = null;
  vm.showFrontNRIC = true;
  vm.showBackNRIC = true;
  vm.showProofOfAddress = false;
  vm.showBO = false;
  vm.showPEP = false;
  vm.showInputResidential = false;
  vm.showUploadSection = false;
  vm.isForeignMailingCountry = false;
  let kickoutFlag = '';

  /* function declaration*/
  vm.generateAddress = generateAddress;
  vm.onPostalCodeChange = onPostalCodeChange;
  vm.validateForm = validateForm;
  vm.setMailingAddress = setMailingAddress;
  vm.clearMailingAddress = clearMailingAddress;
  vm.openCancelModal = openCancelModal;
  vm.setStep = setStep;
  vm.checkIfKickout = checkIfKickout;
  vm.prefillCustomerInfo = prefillCustomerInfo;
  vm.saveAllWithoutValidation = saveAllWithoutValidation;
  vm.setUploadList = setUploadList;
  vm.checkForeignCountry = checkForeignCountry;
  vm.saveMoreAboutYou = saveMoreAboutYou;
  vm.residencyOptions = constants.residencyOptions;
  vm.passTypeOptions = constants.passTypeOptions;
  vm.taxtooltip = constants.production.PER.taxtooltip;
  vm.OecdTaxResidencyLink = constants.production.PER.OecdTaxResidencyLink;
  vm.OecdTaxIdentificationLink = constants.production.PER.OecdTaxIdentificationLink;
  vm.disableAddressFields = false;
  vm.myInfoSelected = false;
  vm.myInfoHasAdd = false;
  vm.disableUploadPanel = false;
  vm.myInfoHasError = false;

  $scope.$watch('vm.residencyCode', function () {
    if (vm.residencyCode && (vm.reqType === 'PER' || vm.reqType === 'PC' || vm.reqType === 'PAT')) {
      dataStoreService.setItem('residencyCode', vm.residencyCode.value);
      const profile = dataStoreService.session.getObject('profile') || {};
      const residencyStatus = typeof vm.residencyCode === 'object' ? vm.residencyCode.value : vm.residencyCode;
      profile.passType = profile.passType ? profile.passType : 1;
      const profileObj = {
        ...profile,
        residencyCode: residencyStatus,
        identity: residencyStatus,
      };
      dataStoreService.session.setObject('profile', profileObj);
      vm.profile = profileObj;
      dataStoreService.setItem('residencyCode', residencyStatus);
      $scope.$emit('updateUploadSection'); // update upload list based on residency code
      resetUploadSection(); // hide the upload section
    }
  });
  // $scope.$watch('vm.passType', function () {
  // });
  vm.handlePassTypeChange = () => {
    if (vm.passType && (vm.reqType === 'PER' || vm.reqType === 'PC' || vm.reqType === 'PAT')) {
      const profile = dataStoreService.session.getObject('profile');
      const currPassType = typeof vm.passType === 'object' ? vm.passType.value : vm.passType;
      dataStoreService.session.setObject('profile', {
        ...profile,
        passType: currPassType,
      });
      vm.profile = {
        ...profile,
        passType: currPassType,
      };
      dataStoreService.setItem('passType', currPassType);
      resetUploadSection();
    }
  };

  function resetUploadSection() {
    updateQuestions();
    $scope.$emit('showNRIC', 'false');
    // $scope.$emit('showBO', 'false');
    // $scope.$emit('showPEP', 'false');
  }
  function handleUploadSection() {
    if (vm.reqType === 'PC' || vm.reqType === 'PAT') {
      vm.showFrontNRIC = true;
      vm.showBackNRIC = true;
      $scope.$emit('showNRIC', 'true');
      if (vm.profile.residencyCode === 3) {
        vm.showProofOfAddress = true;
      }
    }
  }
  function updateQuestions() {
    if (constants.production[vm.profile.type].moreAboutYouQuestion) {
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
        const alterQuestionCode = getAlterQuestionCode();
        let moreAboutYouQ = angular.copy(res.data.payload);
        vm.forceUpload = true;
        for (let i = 0; i < moreAboutYouQ.length; i++) {
          if (vm.reqType === constants.production.PS.shortName
            && (moreAboutYouQ[i].code === 'QMAY029' || moreAboutYouQ[i].code === 'QMAY030')) {
            const clientAcknowledgement = constants.production.PS.clientAcknowledgement;
            moreAboutYouQ[i].description = clientAcknowledgement[moreAboutYouQ[i].code];
          }
          if (alterQuestionCode === moreAboutYouQ[i].code) {
            moreAboutYouQ[i].code += '_';
          }
          if (moreAboutYouQ[i].code === constants.questionnaireCode.qmay010 && vm.isExistCustomerDecl === 'true') {
            dataStoreService.setItem('mandatoryUpload', false);
          }
          if (moreAboutYouQ[i].code === constants.questionnaireCode.qmay010 && ((vm.loginStatus && vm.profile && vm.profile.residencyCode !== constants.residencyCode.epOrWpHolder) || !vm.loginStatus)) {
            vm.forceUpload = false;
          }
        }
        vm.moreAboutYouQ = moreAboutYouQ;
        if (vm.forceUpload) handleUploadSection();
      });
    }
  }

  // check residential address is mailing address
  function setUploadList() {
    /**
      key: {
        vm.showFrontNRIC : need to upload the front of the NRIC;
        vm.showBackNRIC : need to upload the back of the NRIC;
        showProofOfAddress : need to upload the proof of address;
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
      vm.hideUpload = false; // to hide
      $scope.$emit('setShowUpload', vm.hideUpload); // emit to detail page
      $rootScope.uploadYourDocumentEt = true;
    } else {
      vm.hideUpload = true; // to show
      $scope.$emit('setShowUpload', vm.hideUpload); // emit to detail page
    }
  }
  /* start get specific value for some questions on real time, for upload document */
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
    // emit to upload
    $scope.$emit('controlShowIDProof', showNRICImg);
    if (vm.profile && vm.profile.residencyCode === 3) {
      const showProofOfAddressImg = {
        imgIndex: 3,
        show: vm.showProofOfAddress
      };
      $scope.$emit('controlShowIDProof', showProofOfAddressImg);
      $scope.$emit('showProofOfAddress', vm.showProofOfAddress);
    }
  });
  $scope.$on('showBO', function (e, showBO) {
    vm.showBO = showBO === 'true';
    vm.setUploadList();
    let showBOImg = {
      imgIndex: 4,
      show: showBO === 'true'
    };
    // emit to upload
    $scope.$emit('controlShowIDProof', showBOImg);
  });
  $scope.$on('showPEP', function (e, showPEP) {
    vm.showPEP = showPEP === 'true';
    vm.setUploadList();
    let showPEPImg = {
      imgIndex: 5,
      show: showPEP === 'true'
    };
    // emit to upload
    $scope.$emit('controlShowIDProof', showPEPImg);
  });
  $scope.$on('livingCountry', function (e, country) {
    vm.showForeignAddress = country !== constants.singaporeName;
    vm.residentialCountry = country;
    const isModalOpen = document.getElementsByClassName('modal').length > 0;
    if (vm.showForeignAddress && !isModalOpen) utils.openResidentialModel(constants.crossBorderMsg.foreignResidentialAddress);
  });

  $scope.$on('livingCountryCode', function (e, country) {
    vm.residentialCountryCode = country;
  });

  $scope.$on('taxMatch', function (e, data) {
    /* idd, mailing country and residential country need to be check if matching tax residency country*/
    let aboutYouDetails = dataStoreService.getOrderItem('aboutYouDetails');
    let idd;
    if (customer && customer.contact) {
      idd = customer.contact.mobileContactIDD || utils.getIddNumber(customer.contact.mobilePhoneArea);
    } else if (aboutYouDetails) {
      idd = aboutYouDetails.idd;
    } else {
      idd = '';
    }
    let mailingCountry = typeof vm.mailingCountry === 'object' ? vm.mailingCountry.value : vm.mailingCountry;
    let emptyAnswer = {
      label: '',
      value: ''
    };
    // refreshQuestionaire logic only for guest
    if (data && data !== 'refreshQuestionaire') {
      vm.taxQ[data.question.code] = data;
    } else if (data === 'refreshQuestionaire') {
      if (vm.taxQ.QMAY023021) {
        vm.taxQ.QMAY023021.answer = emptyAnswer;
      }
      if (vm.taxQ.QMAY023022) {
        vm.taxQ.QMAY023022.answer = emptyAnswer;
      }
      if (vm.taxQ.QMAY023023) {
        vm.taxQ.QMAY023023.answer = emptyAnswer;
      }
    }
    vm.subQ = [
      constants.questionnaireCode.qmay023021,
      constants.questionnaireCode.qmay023022,
      constants.questionnaireCode.qmay023023
    ];
    if (!vm.taxQ.QMAY004 || !vm.taxQ.QMAY023) {
      $scope.$broadcast('isMatch', true);
    } else if (vm.taxQ.QMAY023.answer.value === 'true') {
      if (vm.taxQ.QMAY004.answer.value !== constants.singapore || (vm.isMailingAddress !== 'true' && utils.getCountryCodeByIdd(idd) !== mailingCountry)) {
        $scope.$broadcast('isMatch', false);
      } else if (vm.isMailingAddress === 'true' && utils.getCountryCodeByIdd(idd) !== constants.singapore) {
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
        if (vm.taxCounry[i].answer.value && utils.getCountryCodeByIdd(idd) === vm.taxCounry[i].answer.value) {
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
  /* start get specific value for some questions on real time */

  vm.$onInit = function () {
    vm.loginStatus = dataStoreService.getItem('loginStatus');
    vm.product = dataStoreService.getOrderItem('product');
    vm.channel = dataStoreService.getItem('channel');
    vm.partnerChannel = dataStoreService.getItem('partnerChannel');
    vm.myInfoSelected = dataStoreService.session.getValue('myInfoSelected');
    //    vm.myInfoHasError = dataStoreService.session.getValue('myInfoHasError');
    vm.reqType = vm.profile.type;
    vm.redirectToAgentQs = constants.production[vm.profile.type].moreAboutYouQuestion.redirectToAgentQs;
    vm.sectionQ1 = constants.production[vm.reqType].moreAboutYouQuestion.sectionQ1;
    vm.sectionQ2 = constants.production[vm.reqType].moreAboutYouQuestion.sectionQ2;
    vm.sectionQ3 = constants.production[vm.reqType].moreAboutYouQuestion.sectionQ3;
    vm.sectionQ4 = constants.production[vm.reqType].moreAboutYouQuestion.sectionQ4;
    vm.passTypeOptions = ((vm.reqType === 'PC' || vm.reqType === 'PAT') ? constants.passTypeOptionsPc : constants.passTypeOptions);
    vm.customId = vm.profile.customID;
    vm.addressChangeMsg = constants.message.addressChangeMsg;
    const initialPassType = vm.profile.passType ? vm.profile.passType : 1;
    vm.passType = vm.passTypeOptions.find(item => item.value === initialPassType);

    // PAS SQS quetionaire filtering if it is not singlePremium.
    if (vm.reqType === constants.production.PAS.shortName && !vm.product.basic.isSinglePremium) {
      vm.sectionQ3 = vm.sectionQ3.filter(types => types !== constants.questionnaireCode.qmay036);
    }

    activate();

    if (typeof (vm.isMailingAddress) === 'undefined') {
      vm.isMailingAddress = 'true';
    }

    if (vm.reqType === constants.production.PS.shortName) {
      vm.residencyStatus = vm.profile.residencyCode || 1;
    }
    if (vm.reqType === constants.production.PER.shortName || vm.reqType === constants.production.PC.shortName || vm.reqType === constants.production.PAT.shortName) {
      const residencyCode = vm.profile.residencyCode ? vm.profile.residencyCode : 1;
      vm.residencyCode = vm.residencyOptions.find(item => item.value === residencyCode);
      vm.residencyStatus = typeof vm.residencyCode === 'object' ? vm.residencyCode.value : vm.residencyCode;
      const profileObj = {
        ...vm.profile,
        residencyCode: vm.residencyStatus,
        passType: initialPassType,
        identity: vm.residencyStatus,
      };
      vm.profile = profileObj;
      dataStoreService.session.setObject('profile', profileObj);
      vm.showFrontNRIC = false;
      vm.showBackNRIC = false;
      vm.showProofOfAddress = false;
    }
    dataStoreService.setItem('mandatoryUpload', vm.isExistCustomerDecl === 'true' && vm.profile && vm.profile.identity === constants.residencyCode.epOrWpHolder);
    vm.setUploadList();
  };
  // change step for guest, onChanges event tracking the varible changes.detailStep
  vm.$onChanges = function (changes) {
    bindingChange(changes);
  };

  function bindingChange(changes) {
    if (changes && changes.detailStep && changes.detailStep.currentValue === constants.section.moreAboutYou) {
      vm.aboutYouDetail = dataStoreService.getOrderItem('aboutYouDetails') || dataStoreService.session.getObject('aboutYouDetails');
      //  not refreshing questionnaire if aboutYouDetail is not changed
      if (_.isEqual(vm.previousProfile, vm.aboutYouDetail)) return;
      vm.previousProfile = angular.copy(vm.aboutYouDetail);
      if (constants.production[vm.profile.type].moreAboutYouQuestion) {
        let qChannel = '';
        if (vm.reqType === constants.production.PGP.shortName && vm.channel === constants.channel.SCB) {
          qChannel = angular.copy(vm.channel);
        }
        //PACSDP-4892 Added Encryption for Questionaire parameters
        apiService.encryption().then(function (res) {
          let publicKey = res.data.rsaPublicKey;
          let random = res.data.random;

          vm.questionRequest = {
            cat: constants.questionnaireCategory.QMAY,
            categoryList: [constants.questionnaireCategory.QMAY],
            lifeProfile: {
              name: vm.aboutYouDetail.surName + ' ' + vm.aboutYouDetail.givenName,
              dob: vm.profile.dob,
              nric: vm.aboutYouDetail.nricFin,
              age: utils.calculateAge(vm.profile.dob) + 1,
              gender: vm.profile.gender || constants.production[vm.reqType].gender,
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
          const alterQuestionCode = getAlterQuestionCode();
          let moreAboutYouQ = angular.copy(res.data.payload);
          vm.forceUpload = true;
          for (let i = 0; i < moreAboutYouQ.length; i++) {
            if (vm.reqType === constants.production.PS.shortName
              && (moreAboutYouQ[i].code === 'QMAY029' || moreAboutYouQ[i].code === 'QMAY030')) {
              const clientAcknowledgement = constants.production.PS.clientAcknowledgement;
              moreAboutYouQ[i].description = clientAcknowledgement[moreAboutYouQ[i].code];
            }
            if (alterQuestionCode === moreAboutYouQ[i].code) {
              moreAboutYouQ[i].code += '_';
            }
            if (moreAboutYouQ[i].code === constants.questionnaireCode.qmay010 && vm.isExistCustomerDecl === 'true') {
              dataStoreService.setItem('mandatoryUpload', false);
            }
            if (moreAboutYouQ[i].code === constants.questionnaireCode.qmay010 && ((vm.loginStatus && vm.profile && vm.profile.residencyCode !== constants.residencyCode.epOrWpHolder) || !vm.loginStatus)) {
              vm.forceUpload = false;
            }
          }
          vm.moreAboutYouQ = moreAboutYouQ;
          if (vm.forceUpload) handleUploadSection();
        });
      }
    }
  }

  $scope.$watch('vm.isCollapsed', function (newValues, oldValues) {
    if (newValues !== oldValues) {
      $scope.$emit('leftContentsHeightChanged', true);
    }
  }, true);

  $scope.$on('employmentChange', function (event, data) {
    $scope.$broadcast('industryEmploymentUpdate', data);
  });

  vm.formatSalary = function () {
    vm.annualIncome = $filter('number')(vm.annualIncome);
  };

  vm.unFormatSalary = function () {
    if (vm.annualIncome) {
      vm.annualIncome = parseInt(vm.annualIncome.replace(/,/g, ''), 10);
    }
  };

  vm.validateLength = function () {
    if (vm.annualIncome && vm.annualIncome.length > 15) {
      vm.annualIncome = vm.annualIncome.slice(0, 15);
    }
  };

  function prefillCustomerInfo() {
    customer = dataStoreService.getItem('customer');
    if (customer && customer.idNumber) {
      if (customer.addresses && customer.addresses.length > 0) {
        for (let i in customer.addresses) {
          if (customer.addresses[i].addressType === constants.addressType.mailingAddress) {
            vm.mailingPostalCode = '';
            vm.mailingBlockNo = '';
            vm.mailingStreet = '';
            vm.mailingBuilding = '';
            vm.mailingUnitNo = '';
          }
        }
        if (customer.addresses.length >= 2) {
          vm.isMailingAddress = String(customer.addresses[0].postalCode === customer.addresses[1].postalCode);
        }
      }
      // call questionnaire api for existing user
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
              name: customer.firstName + ' ' + customer.lastName,
              dob: customer.dateOfBirth,
              nric: customer.idNumber,
              age: utils.calculateAge(customer.dateOfBirth) + 1,
              gender: customer.gender,
              clientNumber: dataStoreService.getItem('clientNumber') || '',
              residentStatus: utils.conventResidencyForQuestionnaire(vm.profile.residencyCode),
              existingClient: vm.loginStatus,
              countryOfBirth: customer.countryOfBirth,
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
                clientNumber: dataStoreService.getItem('clientNumber'),
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
          const alterQuestionCode = getAlterQuestionCode();
          let moreAboutYouQ = angular.copy(res.data.payload);
          vm.forceUpload = true;
          // Bydefault for all customers(New/Exisiting) for whom the question(qmay010) is not valid,new residentail address has to be added
          for (let i = 0; i < moreAboutYouQ.length; i++) {
            let item = moreAboutYouQ[i];
            if (item.code === constants.questionnaireCode.qmay010) {
              vm.showInputResidential = true;
              vm.forceUpload = false;
            }
            if (moreAboutYouQ[i].code === constants.questionnaireCode.qmay010 && vm.isExistCustomerDecl === 'true') {
              dataStoreService.setItem('mandatoryUpload', false);
            }
            if (vm.reqType === constants.production.PS.shortName
              && (moreAboutYouQ[i].code === 'QMAY029' || moreAboutYouQ[i].code === 'QMAY030')) {
              const clientAcknowledgement = constants.production.PS.clientAcknowledgement;
              moreAboutYouQ[i].description = clientAcknowledgement[moreAboutYouQ[i].code];
            }
          }
          for (let i = 0; i < moreAboutYouQ.length; i++) {
            if (alterQuestionCode === moreAboutYouQ[i].code) {
              moreAboutYouQ[i].code += '_';
            }
          }
          vm.moreAboutYouQ = moreAboutYouQ;
          //Populate the existing customer address and show the masked address to user
          if (vm.showInputResidential) populateCustomerResidentialAddress();
          if (vm.forceUpload) handleUploadSection();
        });
      }
    }
    vm.setUploadList();
    return customer;
  }
  function populateCustomerResidentialAddress() {
    if (customer.addresses && customer.addresses.length > 0) {
      for (let i in customer.addresses) {
        if (customer.addresses[i].addressType === constants.addressType.residentialAddress) {
          vm.residentialPostalCode = customer.addresses[i].postalCode || '';
          vm.residentialBlockNo = customer.addresses[i].block || '';
          vm.residentialStreet = customer.addresses[i].streetName || '';
          vm.residentialBuilding = customer.addresses[i].buildingName || '';
          vm.residentialUnitNo = customer.addresses[i].floorUnit || '';
        }
      }
    }
  }
  function activate() {
    // New Customer - get nationality list from DB
    apiService.dropdowns({
      dropDownCodeList: [constants.dropDownCode.pfcopt066, constants.dropDownCode.pfcopt070]
    }).then(function (res) {
      vm.allNationality = res.data.PFCOPT066;
      vm.allresidentialCountry = res.data.PFCOPT070;
      // default residentialCountry
      vm.residentialCountry = {
        code: constants.dropDownCode.pfcopt070,
        option: constants.singaporeName,
        value: constants.singapore
      };
      customer = prefillCustomerInfo();
      const customerInfo = dataStoreService.getItem('customer');
      const defaultNationality = vm.profile.identity !== 1 ? '' : constants.singapore;
      const nationalityValue = customerInfo ? customerInfo.nationality : defaultNationality;
      vm.nationality = vm.allNationality.find(item => item.value === nationalityValue);
      vm.setMailingAddress();
    }).catch(function (error) {
      throw error;
    });
  }

  // retrieve address according to postalcode
  function generateAddress(type, postCode) {
    apiService.postalcode({
      postalCode: postCode
    }).then(function (res) {
      if (type === constants.addressName.residential) {
        vm.residentialBlockNo = res.data.blockNo;
        vm.residentialBuilding = res.data.buildingName;
        vm.residentialStreet = res.data.streetName;
        vm.residentialAddressType = res.data.addressType;
      } else if (type === constants.addressName.mailing) {
        vm.mailingBlockNo = res.data.blockNo;
        vm.mailingBuilding = res.data.buildingName;
        vm.mailingStreet = res.data.streetName;
        vm.mailingAddressType = res.data.addressType;
        vm.mailingCountry = {
          code: constants.dropDownCode.pfcopt070,
          option: constants.singaporeName,
          value: constants.singapore
        };
      }
    }).catch(function (error) {
      throw error;
    });
  }

  function onPostalCodeChange(type, postCode) {
    if (postCode.length === 6) {
      vm.generateAddress(type, postCode);
    } else {
      return false;
    }
  }

  function setMailingAddress() {
    if (vm.isMailingAddress === 'true') {
      vm.mailingPostalCode = vm.residentialPostalCode;
      vm.mailingBlockNo = vm.residentialBlockNo;
      vm.mailingBuilding = vm.residentialBuilding;
      vm.mailingStreet = vm.residentialStreet;
      vm.mailingAddressType = vm.residentialAddressType;
      vm.mailingUnitNo = vm.residentialUnitNo;
      vm.mailingCountry = vm.residentialCountry;
      $scope.$emit('taxMatch', '');
    }
  }

  function clearMailingAddress() {
    if (vm.isMailingAddress === 'false') {
      vm.mailingPostalCode = null;
      vm.mailingBlockNo = null;
      vm.mailingBuilding = null;
      vm.mailingStreet = null;
      vm.mailingAddressType = null;
      vm.mailingUnitNo = null;
      vm.mailingCountry = null;
    }
  }

  function validateForm() {
    vm.surveynotCompleted = false;
    /* 1.start valdiate questionnaire */
    $scope.$broadcast('checkProgression', vm.questionRequest ? vm.questionRequest.cat : '');
    /* 2. mailing address validation */
    if (vm.isMailingAddress === 'false') {
      if (!vm.isForeignMailingCountry) {
        utils.setFieldsBlurAndInvalid($scope.moreAboutYouForm, {
          mailingPostalCode: null,
          mailingStreet: null,
          mailingCountry: null,
          mailingBuilding: null,
          mailingBlockNo: null,
          mailingUnitNo: null
        });
      }
    }
    /* 3. New Customer - check if nationality is legal*/
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

    // PD-2141: US Mailing Address to trigger lead gen
    if (vm.mailingCountry && vm.mailingCountry.value === constants.america) {
      kickoutFlag = true;
      dataStoreService.setItem('kickoutFlag', kickoutFlag);
    }
    // PACSDP-3931 - Foreign Residential address others than Singapore to trigger lead gen
    if (vm.residentialCountry && vm.residentialCountry !== constants.singaporeName) {
      utils.openResidentialModel(constants.crossBorderMsg.foreignResidentialAddress);
      utils.setFieldsBlurAndInvalid($scope.moreAboutYouForm, {
        residentialStreet: !vm.residentialStreet
      });
    }

    if (vm.residentialAddressType === constants.residentialAddressType.h || vm.residentialAddressType === constants.residentialAddressType.c) {
      utils.setFieldsBlurAndInvalid($scope.moreAboutYouForm, {
        residentialUnitNo: !vm.residentialUnitNo
      });
    }

    // PACSDP-952: PAS payment validation
    if (vm.reqType === constants.production.PAS.shortName && vm.product.basic.isSinglePremium) {
      const selectedOption = dataStoreService.getOrderItem('paymentQ');
      selectedOption && dataStoreService.setItem('kickoutFlag', !utils.validatePaymentOption(selectedOption));
    }

    /* 4.reqiured fields validation */
    if ($scope.moreAboutYouForm.$invalid || vm.surveynotCompleted) {
      utils.setFieldsBlurAndInvalid($scope.moreAboutYouForm, {
        residentialPostalCode: null,
        residentialStreet: null,
        residentialBuilding: null,
        residentialBlockNo: null,
        isMailingAddress: null,
        annualIncome: null
      });
      //validate empty field for other nationality
      if (vm.nationality.value === 'OTH' && vm.othNationality === undefined) {
        utils.setFieldsBlurAndInvalid($scope.moreAboutYouForm, {
          othNationality: null
        });
      }
      //validate empty field for other mailingCountry
      if (vm.mailingCountry.value === 'OTH' && vm.othMailingCountry === undefined) {
        utils.setFieldsBlurAndInvalid($scope.moreAboutYouForm, {
          othMailingCountry: null
        });
      }
      if (vm.summaryStep === constants.step.detail) {
        utils.scrollToFirstInvalidField();
      }
      $rootScope.moreAboutYou = false;
    } else {
      vm.setMailingAddress();
      saveMoreAboutYou();
    }
  }

  $scope.$emit('getMoreAboutYouValidation', vm.validateForm);
  $scope.$emit('getMoreAboutYouTimeOut', vm.saveAllWithoutValidation);

  function saveMoreAboutYou() {
    let isPruShieldNewCustomer = vm.reqType === 'PS' && vm.isExistCustomerDecl === 'false';
    vm.questionnaireData.QMAY = {
      ...vm.questionnaireData.QMAY,
      ...dataStoreService.getOrderItem('aboutYouQMay').QMAY
    };
    // restructure questionnaire json to one level
    vm.mayQuestionnaire = utils.fetchQuestionnaireData(vm.questionnaireData);
    // for PER, temporary changes to pass the foreigners pass type
    if (vm.profile && vm.profile.identity === 3 && vm.passType) {
      let passQuestion = constants.questionnairePassType;
      passQuestion = {
        ...passQuestion,
        answer: {
          value: vm.passType.option,
          label: vm.passType.option,
        },
      };
      vm.mayQuestionnaire.push(passQuestion);
    }
    if (vm.myInfoSelected && !vm.myInfoHasError) {
      vm.nationality = vm.allNationality.find(item => item.value === vm.aboutYouDetail.nationality);
    }
    // reset mailing address
    const saveRequest = {
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
      mailingCountry: typeof vm.mailingCountry === 'object' ? vm.mailingCountry.option : vm.mailingCountry,
      residentialCountry: vm.residentialCountry,
      residencyCode: vm.profile.residencyCode,
      passType: vm.profile.passType || vm.passType.value,
      residencyStatus: utils.conventResidencyForQuestionnaire(vm.profile.residencyCode),
      othNationality: vm.nationality.value === 'OTH' ? vm.nationality.option.concat(': ', vm.othNationality) : '',
      othMailingCountry: vm.mailingCountry.value === 'OTH' ? vm.mailingCountry.option.concat(': ', vm.othMailingCountry) : '',
      qmayQuestionnaires: JSON.stringify(vm.mayQuestionnaire)
    };
    const details = {
      nationality: vm.nationality ? vm.nationality.value : constants.singapore,
      annualIncome: isPruShieldNewCustomer ? 0 : parseInt(vm.annualIncome.replace(/,/g, ''), 10), // vm.annualIncome,
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
      residencyCode: vm.profile.residencyCode,
      passType: vm.profile.passType || vm.passType.value,
      residencyStatus: utils.conventResidencyForQuestionnaire(vm.profile.residencyCode),
      othNationality: vm.nationality.value === 'OTH' ? vm.nationality.option.concat(': ', vm.othNationality) : '',
      othMailingCountry: vm.mailingCountry.value === 'OTH' ? vm.mailingCountry.option.concat(': ', vm.othMailingCountry) : ''
    };
    //PruShield New Customer
    if (isPruShieldNewCustomer) {
      vm.mayQuestionnaire.push(...constants.production.PS.newCustomerHideQuestions);
      vm.mayQuestionnaire = _.sortBy(vm.mayQuestionnaire, 'question.code');
      let occupation = {
        occupation: 1,
        occupationCode: 'OTH1',
        occupationDesc: 'Others: Office-based',
      };

      dataStoreService.setItem('occupation', occupation);
      let profile = dataStoreService.session.getObject('profile');
      profile.occupationClass = parseInt(occupation.occupation, 10);
      dataStoreService.session.setObject('profile', profile);
    }
    dataStoreService.session.setObject('profile', vm.profile);
    dataStoreService.setOrderItem('moreAboutYouDetails', details);
    dataStoreService.setOrderItem('QMAYData', vm.mayQuestionnaire);
    dataStoreService.session.setObject('QMAYData', vm.mayQuestionnaire);
    $rootScope.moreAboutYou = true;
    /* start encryption*/
    if (vm.summaryStep === constants.step.detail) {
      let detailsRequestEncrypt = angular.copy(saveRequest);
      apiService.encryption(constants.encryptionRequestText + vm.encryptionLength).then(function (res) {
        let random = res.data.random;
        let publicKey = res.data.rsaPublicKey;
        detailsRequestEncrypt = utils.setEncryptionList(detailsRequestEncrypt, publicKey, random, vm.encryptSubKeyList);
        return apiService.saveMoreAboutYou(detailsRequestEncrypt);
      }).then(function () {
        // PD-2045: for PGRP
        if (vm.reqType === constants.production.PA.shortName
          || vm.reqType === constants.production.PGP.shortName
          || vm.reqType === constants.production.PGRP.shortName
          || vm.reqType === constants.production.PAS.shortName
          || vm.reqType === constants.production.PER.shortName
        ) {
          let kickoutFlagFromdata = dataStoreService.getItem('kickoutFlag');
          let kickoutQ = _.filter(dataStoreService.getItem('kickoutQ'), function (item) {
            return item;
          });
          if (kickoutFlagFromdata || kickoutQ.length > 0) {
            utils.kickoutSendMail(dataStoreService);
          }
          let nextDetailStep;
          if (vm.reqType === constants.production.PER.shortName && vm.partnerChannel !== constants.channel.UOB) {
            nextDetailStep = constants.section.paymentOption;
          } else {
            nextDetailStep = constants.section.uploadDocument;
          }
          vm.changeDetailStep({
            $event: {
              detailStep: nextDetailStep
            }
          });
        } else {
          vm.changeDetailStep({
            $event: {
              detailStep: constants.section.healthAndLifestyle
            }
          });
        }
        vm.isCollapsed = true;
      }).catch(function (error) {
        throw error;
      });
    }
  }

  function saveAllWithoutValidation() {
    $scope.$broadcast('saveQuestionWithoutValidation', [constants.production[vm.profile.type].moreAboutYouQuestion.cat]);
    vm.moreAboutYouDetails = {
      nationality: vm.nationality ? vm.nationality.value : constants.singapore,
      annualIncome: vm.annualIncome ? parseInt(vm.annualIncome.replace(/,/g, ''), 10) : 0,
      isMailingAddress: String(vm.isMailingAddress),
      mailingUnitNo: vm.mailingUnitNo,
      mailingStreetName: vm.mailingStreet,
      mailingBuildingName: vm.mailingBuilding,
      mailingBlockNo: vm.mailingBlockNo,
      mailingPostalCode: vm.mailingPostalCode,
      mailingCountry: vm.mailingCountry,
      residentialUnitNo: vm.residentialUnitNo,
      residentialStreetName: vm.residentialStreet,
      residentialBuildingName: vm.residentialBuilding,
      residentialBlockNo: vm.residentialBlockNo,
      residentialPostalCode: vm.residentialPostalCode,
      residentialCountry: vm.residentialCountry,
      residencyCode: vm.profile.residencyCode,
      passType: vm.profile.passType || vm.passType.value,
      residencyStatus: utils.conventResidencyForQuestionnaire(vm.profile.residencyCode)
    };
    dataStoreService.setItem('moreAboutYouDetails', vm.moreAboutYouDetails);
    dataStoreService.setOrderItem('moreAboutYouDetails', vm.moreAboutYouDetails);
  }

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
          detailStep: constants.section.moreAboutYou
        }
      });
    }
  }

  function checkIfKickout(qCode) {
    return vm.redirectToAgentQs.indexOf(qCode) !== -1;
  }

  function getAlterQuestionCode() {
    var questionCode = '';
    if (utils.conventResidencyForQuestionnaire(vm.profile.residencyCode) === constants.singaporePR) {
      questionCode = 'QMAY003C';
    } else if (utils.conventResidencyForQuestionnaire(vm.profile.residencyCode) === constants.other) {
      // PACSDP-5171 : This will resolve the question to be answered by customer, which will translate to the proposal PDF and 4.02/5.02 will display as NO instead of NA
      if ((vm.reqType === constants.production.PS.shortName || vm.reqType === constants.production.PER.shortName) && (vm.profile.passType < 5 || vm.profile.passType >= 8)
        || (vm.reqType === constants.production.PC.shortName || vm.reqType === constants.production.PAT.shortName) && (vm.profile.passType < 6 || vm.profile.passType >= 8)) {
        if (vm.profile.passType === 8 && (vm.reqType === constants.production.PC.shortName || vm.reqType === constants.production.PS.shortName && vm.channel !== 'UOB' && vm.channel !== 'SCB')) {
          questionCode = 'QMAY003B';
        } else {
          questionCode = 'QMAY003C';
        }
      } else {
        questionCode = 'QMAY003B';
      }
    }
    return questionCode;
  }

  function checkForeignCountry() {
    if (vm.mailingCountry.value === constants.singapore) {
      vm.isForeignMailingCountry = false;
    } else {
      vm.isForeignMailingCountry = true;
    }
    $scope.$emit('taxMatch', '');
  }

  // save kickout flag
  $scope.$on('kickout', function (evt, jsonfile) {
    if (vm.questionRequest.cat === jsonfile) {
      kickoutFlag = true;
      let flagList = dataStoreService.getItem('kickoutQ');
      flagList[jsonfile] = kickoutFlag;
      dataStoreService.setItem('kickoutQ', flagList);
    }
  });
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

  $scope.$on('notCompleted', function () {
    vm.surveynotCompleted = true;
  });
  /*This is executed on 2 conditions on the Details Page when we have the policy incepepted scenario residential address change question
    1) On load of the Radio-pru
    2) On selection of yes/no
  */
  $scope.$on('saveAnswer', function (evt, data) {
    if (data.question && data.question.code === constants.questionnaireCode.qmay010 && data.answer.value === 'true') {
      vm.showInputResidential = false;
    } else if (data.question && data.question.code === constants.questionnaireCode.qmay010 && data.answer.value === 'false') {
      vm.showInputResidential = true;
      populateCustomerResidentialAddress();
    }
  });

  $scope.$on('myInfoRegdAdd', function (event, data) {
    if (validateRegAddr(data)) {
      vm.myInfoHasAdd = true;
      vm.residentialPostalCode = data.postal;
      vm.residentialBlockNo = data.block;
      vm.residentialBuilding = data.building;
      vm.residentialStreet = data.street;
      vm.residentialAddressType = data.type;
      vm.residentialUnitNo = data.unit;
      vm.residentialCountry = typeof data.country === 'object' ? data.country.desc : data.country;
      vm.residentialCountry = vm.residentialCountry.charAt(0).toUpperCase() + vm.residentialCountry.substring(1).toLowerCase();

      if (vm.isMailingAddress === 'true') {
        vm.mailingPostalCode = data.postal;
        vm.mailingBlockNo = data.block;
        vm.mailingBuilding = data.building;
        vm.mailingStreet = data.street;
        vm.mailingAddressType = data.type;
        if (typeof data.unit !== 'undefined' && data.unit.trim() !== '') {
          vm.mailingUnitNo = data.unit;
        }
        vm.mailingCountry = _.find(vm.allresidentialCountry, function (item) {
          return (item.value === data.country.code || item.option.toUpperCase() === data.country.desc.toUpperCase());
        });
      }
    } else {
      vm.myInfoHasAdd = false;
    }
    dataStoreService.setItem('myInfoHasAdd', vm.myInfoHasAdd);
  });

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

  $scope.$on('disableAdd', function (event, data) {
    vm.disableAddressFields = data;
  });

  $scope.$on('disableUploadPanel', function (event, data) {
    vm.disableUploadPanel = data;
  });

  $scope.$on('myInfoButtonSelected', function (event, data) {
    if (data) {
      let changes = {
        detailStep: {
          currentValue: 'moreAboutYou',
        }
      };
      bindingChange(changes);
      vm.moreAboutYouDetails = {
        nationality: vm.nationality ? vm.nationality.value : constants.singapore,
        annualIncome: vm.annualIncome ? parseInt(vm.annualIncome.replace(/,/g, ''), 10) : 0,
        isMailingAddress: String(vm.isMailingAddress),
        mailingUnitNo: vm.mailingUnitNo,
        mailingStreetName: vm.mailingStreet,
        mailingBuildingName: vm.mailingBuilding,
        mailingBlockNo: vm.mailingBlockNo,
        mailingPostalCode: vm.mailingPostalCode,
        mailingCountry: vm.mailingCountry,
        residentialUnitNo: vm.residentialUnitNo,
        residentialStreetName: vm.residentialStreet,
        residentialBuildingName: vm.residentialBuilding,
        residentialBlockNo: vm.residentialBlockNo,
        residentialPostalCode: vm.residentialPostalCode,
        residentialCountry: vm.residentialCountry,
        residencyCode: vm.profile.residencyCode,
        passType: vm.profile.passType || vm.passType.value,
        residencyStatus: utils.conventResidencyForQuestionnaire(vm.profile.residencyCode)
      };
      dataStoreService.setItem('moreAboutYouDetails', vm.moreAboutYouDetails);
      dataStoreService.setOrderItem('moreAboutYouDetails', vm.moreAboutYouDetails);
    }
  });

  $scope.$on('myInfoHasError', function (event, data) {
    vm.myInfoHasError = data;
  });
}
