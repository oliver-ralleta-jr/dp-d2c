module.exports = {
  template: require('./health-common.html'),
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
function HealthCommonController($scope, $rootScope, $uibModal, $state, dataStoreService, apiService, utils, constants) {
  let vm = this;
  vm.questionnaireData = {};
  vm.previousProfile = {};
  vm.healthQuestionnaire = [];
  vm.questionnaireDataList = [];
  vm.redirectToAgentQs = [];
  vm.questionRequest = null;

  vm.validateForm = validateForm;
  vm.checkIfKickout = checkIfKickout;
  vm.openCancelModal = openCancelModal;
  vm.setStep = setStep;
  vm.saveAllWithoutValidation = saveAllWithoutValidation;
  vm.disableUploadPanel = false;
  vm.myInfoSelected = false;

  vm.$onInit = function () {
    vm.loginStatus = dataStoreService.getItem('loginStatus');
    vm.product = dataStoreService.getOrderItem('product');
    vm.channel = dataStoreService.getItem('channel');
    vm.myInfoSelected = dataStoreService.session.getValue('myInfoSelected');
    vm.customId = vm.profile.customID;
    vm.reqType = vm.profile.type;
    vm.redirectToAgentQs = constants.production[vm.profile.type].healthQuestion.redirectToAgentQs;

    vm.healthDetails = dataStoreService.getOrderItem('healthDetails');
    let customer = dataStoreService.getItem('customer');
    if (customer && customer.idNumber) {
      let qChannel = '';
      // PGP & SCB need to pass channel 'SCB' as param
      if (vm.reqType === constants.production.PGP.shortName && vm.channel === constants.channel.SCB) {
        qChannel = angular.copy(vm.channel);
      }
      // call questionnaire API to get health questions
      //PACSDP-4892 Added Encryption for Questionaire parameters
      apiService.encryption().then(function (res) {
        var publicKey = res.data.rsaPublicKey;
        var random = res.data.random;
        // call questionnaire API to get health questions
        vm.questionRequest = {
          cat: constants.production[vm.reqType].healthQuestion.cat,
          categoryList: constants.production[vm.reqType].healthQuestion.catList || [constants.production[vm.reqType].healthQuestion.cat],
          lifeProfile: {
            name: customer.firstName + ' ' + customer.lastName,
            dob: customer.dateOfBirth,
            nric: customer.idNumber,
            age: utils.calculateAge(customer.dateOfBirth) + 1,
            gender: customer.gender,
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
          classOccupation: vm.profile.occupationClass,
          hasAnswer: false,
          channel: qChannel,
          random: random[0]
        };
        var questionRequest = utils.setEncryptionList(vm.questionRequest, publicKey, random, ['lifeProfile'], ['nric']);
        return apiService.getQuestionnaire(questionRequest);
      }).then(function (res) {
        vm.healthQ = angular.copy(res.data.payload);
      });

      // prefill height and weight
      vm.healthDetails = {
        height: customer.height,
        weight: customer.weight
      };
    } else {
      vm.healthDetails = {};
    }
  };

  vm.$onChanges = function (changes) {
    bindingChange(changes);
  };

  function bindingChange(changes) {
    if (changes && changes.detailStep && changes.detailStep.currentValue === constants.section.healthAndLifestyle) {
      vm.aboutYouDetail = dataStoreService.getOrderItem('aboutYouDetails');
      // not refreshing questionnaire if aboutYouDetail is not changed
      if (_.isEqual(vm.previousProfile, vm.aboutYouDetail)) return;
      vm.previousProfile = angular.copy(vm.aboutYouDetail);
      let qChannel = '';
      if (vm.reqType === constants.production.PGP.shortName && vm.channel === constants.channel.SCB) {
        qChannel = angular.copy(vm.channel);
      }
      // New Customer - call questionnaire API to get health questions
      //PACSDP-4892 Added Encryption for Questionaire parameters
      apiService.encryption().then(function (res) {
        var publicKey = res.data.rsaPublicKey;
        var random = res.data.random;

        // New Customer - call questionnaire API to get health questions
        vm.questionRequest = {
          cat: constants.production[vm.profile.type].healthQuestion.cat,
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
        vm.healthQ = angular.copy(res.data.payload);
      });
    }
  }

  $scope.$watch('vm.isCollapsed', function (newValues, oldValues) {
    if (newValues !== oldValues) {
      $scope.$emit('leftContentsHeightChanged', true);
    }
  }, true);

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
      vm.profile = dataStoreService.session.getObject('profile');
      $rootScope.healthAndLifestyle = true;
      if (vm.summaryStep === constants.step.detail) {
        vm.saveRequest = {
          customId: vm.customId,
          qpsQuestionnaires: JSON.stringify(vm.healthQuestionnaire),
          productType: vm.reqType,
          height: vm.healthDetails.height,
          weight: vm.healthDetails.weight
        };
        apiService.saveProductSpecificQuestions(vm.saveRequest).then(function () {
          // PD-2436: Yearly premium not getting updated for all products
          vm.isSmoker = _.find(vm.healthQuestionnaire, function (item) {
            return item.question.code === constants.questionnaireCode.qps005;
          });

          // update smoke status based on questionnaire answer
          if (vm.isSmoker) {
            vm.profile.smoker = vm.isSmoker.answer.value === 'true' ? 1 : 2;
            dataStoreService.session.setObject('profile', vm.profile);
          }
          // check if answer will lead gen
          let kickoutFlagFromdata = dataStoreService.getItem('kickoutFlag');
          let kickoutQDataStore = dataStoreService.getItem('kickoutQ');
          let kickoutQ = [];
          Object.entries(kickoutQDataStore).forEach(([key, value]) => {
            if (value === true) {
              if (vm.reqType !== 'PC' || (vm.reqType === 'PC' && key !== 'QPS')) {
                kickoutQ.push(value);
              }
            }
          });
          if (kickoutFlagFromdata || kickoutQ.length > 0) {
            utils.kickoutSendMail(dataStoreService);
          } else {
            vm.changeDetailStep({
              $event: {
                detailStep: constants.section.uploadDocument
              }
            });
            vm.isCollapsed = true;
          }
        }).catch(function (error) {
          throw error;
        });
      }
      if (vm.disableUploadPanel && $rootScope.aboutYou && $rootScope.moreAboutYou && $rootScope.healthAndLifestyle) {
        $state.go('app.summaryCommon');
      }
    } else {
      if (vm.reqType !== 'PC' && vm.reqType !== 'PAT' && !vm.healthSectionSIO) {
        utils.setFieldsBlurAndInvalid($scope.healthForm, {
          height: !vm.healthDetails.height,
          weight: !vm.healthDetails.weight
        });
      }
      if (vm.summaryStep === constants.step.detail) {
        utils.scrollToFirstInvalidField();
      }
      $rootScope.healthAndLifestyle = false;
    }
  }
  $scope.$emit('getHealthValidation', vm.validateForm);

  $scope.$on('disableUploadPanel', function (event, data) {
    vm.disableUploadPanel = data;
  });

  function saveAllWithoutValidation() {
    if (vm.reqType === constants.production.PA.shortName) return;
    /* check whether health survey is completed*/
    $scope.$broadcast('saveQuestionWithoutValidation', constants.production[vm.reqType].healthQuestion.catList || [constants.production[vm.profile.type].healthQuestion.cat]);
    dataStoreService.setOrderItem('healthDetails', vm.healthDetails);
  }
  $scope.$emit('getHealthTimeOut', vm.saveAllWithoutValidation);

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
          detailStep: constants.section.healthAndLifestyle
        }
      });
    }
  }

  function checkIfKickout(qCode) {
    return (vm.redirectToAgentQs.indexOf(qCode) !== -1);
  }

  // save kickout flag
  $scope.$on('kickout', function (evt, jsonfile) {
    if (vm.questionRequest.cat === jsonfile) {
      let kickoutFlag = true;
      let flagList = dataStoreService.getItem('kickoutQ');
      flagList[jsonfile] = kickoutFlag;
      dataStoreService.setItem('kickoutQ', flagList);
    }
  });
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

  $scope.$on('myInfoButtonSelected', function (event, data) {
    if (data) {
      let changes = {
        detailStep: {
          currentValue: 'healthAndLifestyle',
        }
      };
      bindingChange(changes);
    }
  });
}
