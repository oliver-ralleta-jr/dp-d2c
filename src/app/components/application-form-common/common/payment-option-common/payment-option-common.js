module.exports = {
  template: require('./payment-option-common.html'),
  controller: PaymentOptionCommonController,
  controllerAs: 'vm',
  bindings: {
    summaryStep: '<',
    profile: '<'
  }
};
/** @ngInject */
function PaymentOptionCommonController(apiService, dataStoreService, utils, $scope, $uibModal, $rootScope, constants) {
  let vm = this;
  vm.surveynotCompleted = false;
  vm.questionnaireData = {};
  let previous = null;
  let next = null;

  vm.checkIfKickout = checkIfKickout;
  vm.validateForm = validateForm;

  vm.$onInit = function () {
    vm.aboutYouDetail = dataStoreService.getOrderItem('aboutYouDetails');
    vm.moreAboutYouDetails = dataStoreService.getOrderItem('moreAboutYouDetails');
    vm.loginStatus = dataStoreService.getItem('loginStatus');
    vm.channel = dataStoreService.getItem('channel');
    vm.product = dataStoreService.getOrderItem('product');
    // get question answer from local service
    vm.QMAYData = dataStoreService.getOrderItem('QMAYData');
    vm.paymentQuestionnaire = dataStoreService.getOrderItem('paymentQuestionnaire');
    if (vm.paymentQuestionnaire) {
      vm.QMAYData = vm.QMAYData.concat(vm.paymentQuestionnaire);
    }
    vm.moreAboutYouQ = utils.questionFormat(vm.QMAYData);

    vm.reqType = vm.profile.reqType;
    vm.customId = vm.profile.customID;
    vm.paymentQ = constants.production[vm.reqType].moreAboutYouQuestion.paymentQ;
    vm.redirectToAgentQs = constants.production[vm.profile.type].moreAboutYouQuestion.redirectToAgentQs;

    $scope.$emit('getPaymentOptionValidationForReview', vm.validateForm);
    if (constants.production[vm.profile.type].moreAboutYouQuestion) {
      if (vm.reqType === constants.production.PGP.shortName && vm.profile.currencyCode) {
        vm.reqCurrencyType = vm.reqType + '_' + vm.profile.currencyCode;
      } else {
        vm.reqCurrencyType = angular.copy(vm.reqType);
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
            gender: vm.moreAboutYouDetails.gender || vm.profile.gender,
            clientNumber: dataStoreService.getItem('clientNumber') || '',
            residentStatus: utils.conventResidencyForQuestionnaire(vm.profile.residencyCode),
            existingClient: vm.loginStatus,
            countryOfBirth: ''
          },
          selectedProducts: {
            docId: vm.product.docId,
            prodCode: vm.product.prodCode,
            components: [
              {
                compoCode: vm.product.basic.compoCode,
                isBasic: true,
                sumAssured: vm.product.basic.sumAssured || '',
                singlePremium: vm.product.basic.singlePremium || ''
              }
            ]
          },
          policyRequestPayload: {
            clientProfile: {
              clientNumber: dataStoreService.getItem('clientNumber')
            },
            policies: [
              {
                policyStatus: [constants.defaultPolicyStatus],
                afterIssueDate: constants.defaultIssueDate
              }
            ]
          },
          classOccupation: vm.profile.occupationClass,
          hasAnswer: false,
          channel: vm.channel === constants.channel.SCB ? vm.channel : '',
          random: random[0]
        };
        var questionRequest = utils.setEncryptionList(vm.questionRequest, publicKey, random, ['lifeProfile'], ['nric']);
        return apiService.getQuestionnaire(questionRequest);
      }).then(function (res) {
        vm.allQuestionaire = angular.copy(res.data.payload);

        for (let i = 0; i < vm.allQuestionaire.length; i++) {
          angular.forEach(vm.moreAboutYouQ, function (itemQ) {
            if (vm.allQuestionaire[i].code === itemQ.code) {
              vm.allQuestionaire[i] = itemQ;
            }
          });
        }
      });
    }
  };

  function validateForm() {
    vm.surveynotCompleted = false;
    $scope.$broadcast('checkProgression', vm.questionRequest.cat);
    if (vm.surveynotCompleted) {
      $rootScope.paymentOption = false;
    } else {
      vm.paymentQuestionnaire = utils.fetchQuestionnaireData(vm.questionnaireData);
      dataStoreService.setOrderItem('paymentQuestionnaire', vm.paymentQuestionnaire);
      $rootScope.paymentOption = true;
    }
  }

  function checkIfKickout(qCode) {
    return vm.redirectToAgentQs.indexOf(qCode) !== -1;
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
      let kickoutFlag = true;
      let flagList = dataStoreService.getItem('kickoutQ');
      flagList[jsonfile] = kickoutFlag;
      dataStoreService.setItem('kickoutQ', flagList);
    }
  });

  utils.listen(
    {
      scope: $scope,
      event: 'onChangeDob',
      callback() {
        vm.surveynotCompleted = false;
        vm.questionnaireData = {};
        vm.checkIfKickout = checkIfKickout;
        vm.validateForm = validateForm;
        vm.$onInit();
      }
    }
  );
}
