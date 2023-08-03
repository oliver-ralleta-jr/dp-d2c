module.exports = {
  template: require('./your-consent-common.html'),
  controller: yourConsentCommonController,
  controllerAs: 'vm',
  bindings: {
    profile: '<',
    showCollapse: '<',
    medicalReport: '<'
  }
};

/** @ngInject */
function yourConsentCommonController($scope, utils, $uibModal, dataStoreService, constants) {
  var vm = this;
  vm.comeFromEDM = dataStoreService.getItem('channel') === constants.channel.EDM;
  vm.isCollapsed = false;
  vm.marketingConsent = 'N';
  vm.showMedicalError = false;
  vm.medicalReportValue = false;
  vm.doConsentValidation = doConsentValidation;
  vm.doMedicalConsentValidation = doMedicalConsentValidation;

  vm.$onInit = function () {
    $scope.$emit(constants.events[vm.profile.type].doConsentValidation, vm.doConsentValidation);
    if (vm.profile.type === constants.production.PC.shortName && vm.medicalReport) {
      $scope.$emit('checkMedicalConsent', vm.doMedicalConsentValidation);
    }
  };

  $scope.$watch('vm.isCollapsed', function (newValues, oldValues) {
    if (newValues !== oldValues) {
      $scope.$emit('leftContentsHeightChanged', true);
    }
  }, true);

  function doConsentValidation() {
    if (vm.comeFromEDM) {
      vm.marketingConsent = '';
    }
    dataStoreService.setOrderItem('marketingConsent', vm.marketingConsent);
    $scope.$emit('marketingConsent', vm.marketingConsent);
    return true;
  }

  function doMedicalConsentValidation() {
    vm.showMedicalError = !vm.medicalReportValue;
    if (!vm.medicalReportValue) {
      let invalidFields = dataStoreService.session.getObject('invalidFields');
      if (!invalidFields) {
        invalidFields = [];
      }
      let theTop = utils.getElementTop(document.getElementById('medicalReportConsentBox'));
      invalidFields.push({
        id: 'medicalReportConsentBox',
        top: theTop
      });
      dataStoreService.session.setObject('invalidFields', invalidFields);
    }
    return vm.medicalReportValue;
  }
}
