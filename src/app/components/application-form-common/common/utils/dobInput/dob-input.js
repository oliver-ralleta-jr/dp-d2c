module.exports = {
  template: require('./dob-input.html'),
  controller: dobInputController,
  controllerAs: 'vm',
  bindings: {
    aboutYouForm: '<',
    dobDate: '=',
    /** selectMode: selectMode='DETAIL' : for Guest only
                selectMode='EDIT': for Existed User
                selectMode='REVIEW': for Review-Edit */
    selectMode: '<',
    loginStatus: '<'
  }
};
/** @ngInject */
function dobInputController($rootScope, $scope, $filter, utils, dataStoreService, constants) {
  var vm = this;

  vm.reqType = dataStoreService.session.getObject('profile') ? dataStoreService.session.getObject('profile').reqType : dataStoreService.session.getObject('profile');
  vm.isEditAction = isEditAction;
  vm.changeProfileDob = changeProfileDob;
  vm.oldAnb = utils.calculateAge($filter('date')(vm.dobDate, constants.dobFilter)) + 1;

  vm.$onInit = function () {
    vm.oldAnb = utils.calculateAge($filter('date')(vm.dobDate, constants.dobFilter)) + 1;
    dataStoreService.setItem('prevDate', vm.dobDate);
    vm.isEdit = false;
    vm.showEditButton = false;
    vm.onFocus = false;
    vm.selectMode = vm.selectMode || 'REVIEW';
    vm.isPAS = (dataStoreService.getItem('reqType') || dataStoreService.session.getValue('reqType')) === constants.production.PAS.shortName;
  };


  $scope.$on('editField', () => {
    vm.isEdit = true;
  });

  function isEditAction() {
    if (vm.reqType === 'PS'
      || vm.reqType === 'PER') return;
    vm.isEdit = true;
    $scope.$emit('switchEditStatus');
  }

  function changeProfileDob() {
    vm.dobDate = $filter('date')(vm.dobDate, constants.dobFilter);
    let newAnb = utils.calculateAge(vm.dobDate) + 1;
    if (vm.isPAS) {
      const prevAnb = dataStoreService.getItem('prevAnb');
      if (!prevAnb) dataStoreService.setItem('prevAnb', vm.oldAnb);
      if (prevAnb) vm.oldAnb = prevAnb;
      dataStoreService.setItem('dobHasBeenChanged', !(newAnb === vm.oldAnb));
    }
    let old = vm.oldAnb;
    vm.oldAnb = newAnb;
    vm.dobChangeValue = {
      dobDate: vm.dobDate,
      old,
      newAnb
    };
    // For PGP, if the age is changed exceeded the threshold value
    if (vm.reqType === constants.production.PGP.shortName && (old < constants.production.PGP.anbRange.threshold19 && newAnb >= constants.production.PGP.anbRange.threshold19) || (old >= constants.production.PGP.anbRange.threshold19 && newAnb < constants.production.PGP.anbRange.threshold19)) {
      $scope.$emit('changeDobValue', vm.dobChangeValue);
    } else if (vm.reqType === constants.production.PGRP.shortName) {
      $scope.$emit('triggleActivate', vm.dobChangeValue);
    }
  }

  // PACSDP-1136 PAS
  $rootScope.$on('rollbackToPrevDob', () => {
    vm.dobDate = dataStoreService.getItem('prevDate');
    dataStoreService.setItem('dobHasBeenChanged', false);
  });
}
