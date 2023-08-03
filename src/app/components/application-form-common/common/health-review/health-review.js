module.exports = {
  template: require('./health-review.html'),
  controller: HealthCommonController,
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
function HealthCommonController($rootScope, $scope, constants, dataStoreService, apiService, utils, $ngRedux) {
  let vm = this;
  vm.questionnaireData = {};
  vm.healthQuestionnaire = [];
  vm.questionnaireDataList = [];
  vm.redirectToAgentQs = [];
  vm.questionRequest = null;
  vm.inputHeight = {
    labelValue: 'Height(cm)',
    inputName: 'height',
    maxlength: 3
  };
  vm.inputWeight = {
    labelValue: 'Weight(kg)',
    inputName: 'weight',
    maxlength: 3
  };
  let kickoutFlag = '';

  vm.validateForm = validateForm;
  vm.checkIfKickout = checkIfKickout;
  vm.saveAllWithoutValidation = saveAllWithoutValidation;
  vm.getAllQuestionaire = getAllQuestionaire;

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
    vm.customId = vm.profile.customID;
    vm.reqType = vm.profile.type;
    vm.redirectToAgentQs = constants.production[vm.profile.type].healthQuestion.redirectToAgentQs;
    vm.questionCat = constants.questionnaireCategory.QPS;
    // get previous questions and format it
    vm.healthDetails = dataStoreService.getOrderItem('healthDetails');
    vm.QPSData = dataStoreService.getOrderItem('QPSData');
    vm.healthQ = utils.questionFormat(vm.QPSData);

    getAllQuestionaire();
  };

  vm.editSection = () => {
    $scope.$broadcast('editField');
    $scope.$emit('switchEditStatus');
  };

  function validateForm() {
    vm.surveynotCompleted = false;
    $scope.$broadcast('checkProgression', vm.questionRequest.cat);
    if (!vm.surveynotCompleted && !$scope.healthForm.$invalid) {
      // change structure for saving DB
      vm.healthQuestionnaire = utils.fetchQuestionnaireData(vm.questionnaireData);
      // save data for review summary prefill
      dataStoreService.setOrderItem('QPSData', vm.healthQuestionnaire);
      dataStoreService.session.setObject('QPSData', vm.healthQuestionnaire);
      dataStoreService.setOrderItem('healthDetails', vm.healthDetails);
      $rootScope.healthAndLifestyle = true;
    } else {
      if (vm.reqType !== 'PC' && vm.reqType !== 'PAT' && !vm.healthSectionSIO) {
        utils.setFieldsBlurAndInvalid($scope.healthForm, {
          height: !vm.healthDetails.height,
          weight: !vm.healthDetails.weight
        });
      }
      $rootScope.healthAndLifestyle = false;
    }
  }
  $scope.$emit('getHealthValidationForReview', vm.validateForm);

  function saveAllWithoutValidation() {
    if (vm.reqType === constants.production.PA.shortName) return;
    /* check whether health survey is completed*/
    $scope.$broadcast('saveQuestionWithoutValidation', constants.production[vm.reqType].healthQuestion.catList || [constants.production[vm.profile.type].healthQuestion.cat]);
    vm.questionnaireDataList = [];
    vm.healthQuestionnaire = [];
    if (constants.production[vm.reqType].healthQuestion.catList) {
      for (let category in constants.production[vm.reqType].healthQuestion.catList) {
        vm.questionnaireDataList.push(vm.questionnaireData[category.toString()]);
      }
    } else {
      vm.questionnaireDataList.push(vm.questionnaireData[constants.production[vm.profile.type].healthQuestion.cat.toString()]);
    }
    utils.fetchQuestionnaireData(vm.healthQuestionnaire, vm.questionnaireDataList);
    vm.healthQBackup = utils.setQuestionnaireDBFormat(vm.healthQuestionnaire);
    dataStoreService.setOrderItem('healthDetails', vm.healthDetails);
  }
  $scope.$emit('getHealthTimeOut', vm.saveAllWithoutValidation);

  function checkIfKickout(qCode) {
    return vm.redirectToAgentQs.indexOf(qCode) !== -1;
  }

  function getAllQuestionaire() {
    vm.aboutYouDetail = dataStoreService.getOrderItem('aboutYouDetails');
    if (constants.production[vm.profile.type].moreAboutYouQuestion) {
      let qChannel = '';
      if (vm.reqType === constants.production.PGP.shortName && vm.channel === constants.channel.SCB) {
        qChannel = angular.copy(vm.channel);
      }
      // 1. get questionnaire from api
      //PACSDP-4892 Added Encryption for Questionaire parameters
      apiService.encryption().then(function (res) {
        var publicKey = res.data.rsaPublicKey;
        var random = res.data.random;
        // 1. get questionnaire from api
        vm.questionRequest = {
          cat: constants.questionnaireCategory.QPS,
          categoryList: constants.production[vm.reqType].healthQuestion.catList || [constants.production[vm.profile.type].healthQuestion.cat],
          lifeProfile: {
            name: vm.aboutYouDetail.surName + ' ' + vm.aboutYouDetail.givenName,
            dob: vm.profile.dob,
            nric: vm.aboutYouDetail.nricFin,
            age: utils.calculateAge(vm.profile.dob) + 1,
            gender: constants.production[vm.reqType].gender,
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
          classOccupation: vm.profile.occupationClass,
          channel: qChannel,
          random: random[0]
        };
        var questionRequest = utils.setEncryptionList(vm.questionRequest, publicKey, random, ['lifeProfile'], ['nric']);
        return apiService.getQuestionnaire(questionRequest);
      }).then(function (res) {
        vm.qPayload = angular.copy(res.data.payload);
        // 2. list special questions
        let repeatQ = [
          constants.questionnaireCode.qps00301,
          constants.questionnaireCode.qps00302,
          constants.questionnaireCode.qps00303,
          constants.questionnaireCode.qps0030301,
          constants.questionnaireCode.qps0030101
        ];
        // 3. create 3 sets of sub questions for particular questions
        let tempQ = []; // 3 blank sub questions
        vm.allQuestionaire = _.filter(vm.qPayload, function (item) {
          if (repeatQ.indexOf(item.code) !== -1) {
            tempQ.push(item);
          }
          return repeatQ.indexOf(item.code) === -1;
        });

        for (let j = 0; j < 3; j++) {
          for (let k in tempQ) {
            let item = tempQ[k];
            let newItem = angular.copy(item);
            newItem.optionalNo = j;
            newItem.code += (j + 1);
            // create other field 3 times to prefill
            if (newItem.code.indexOf(constants.questionnaireCode.qps0030301) !== -1 || newItem.code.indexOf(constants.questionnaireCode.qps0030101) !== -1) {
              newItem.parent += (j + 1);
            }
            if (j > 0) {
              newItem.isOptional = true;
            }
            vm.allQuestionaire.push(newItem);
          }
        }
        // 4. combine blank questions with answers user filled in detail page
        for (let i = 0; i < vm.allQuestionaire.length; i++) {
          angular.forEach(vm.healthQ, function (itemQ) {
            if (vm.allQuestionaire[i].code === itemQ.code) {
              vm.allQuestionaire[i] = itemQ;
            }
          });
        }
      });
    }
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
  // show/hide health section -  PS SIO changes
  $scope.$on('hideHealthShieldSection', function (e, hideHealthSection) {
    vm.healthSectionSIO = hideHealthSection;
  });
  // save all answers of questionnaire when passing validation
  $scope.$on('surveyCompleted', function (evt, jsonfile, data) {
    vm.questionnaireData[jsonfile] = data;
  });
  // set false when not passing validation
  $scope.$on('notCompleted', function () {
    vm.surveynotCompleted = true;
  });
}
