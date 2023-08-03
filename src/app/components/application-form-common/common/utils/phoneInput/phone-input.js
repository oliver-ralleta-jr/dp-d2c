module.exports = {
  template: require('./phone-input.html'),
  controller: phoneInputController,
  controllerAs: 'vm',
  bindings: {
    aboutYouForm: '<',
    idd: '=',
    number: '=',
    mobileValidError: '=',
    iddValidError: '=',
    validateInput: '&',
    /** selectMode: selectMode='DETAIL' : for Guest only
                selectMode='EDIT': for Existed User
                selectMode='REVIEW': for Review-Edit */
    selectMode: '<',
    loginStatus: '<'
  }
};
/** @ngInject */
function phoneInputController($scope, constants) {
  var vm = this;

  // Edit Button Aciton
  vm.isEditAction = isEditAction;
  vm.iddChange = iddChange;

  vm.$onInit = function () {
    vm.isEdit = false;
    vm.showEditButton = false;
    vm.selectMode = vm.selectMode || constants.step.review;
  };

  $scope.$on('editField', () => {
    vm.isEdit = true;
  });

  function isEditAction() {
    vm.isEdit = true;
    $scope.$emit('switchEditStatus');
  }

  function iddChange() {
    $scope.$emit('iddCountryMatch', '', vm.idd);
  }
  // country code changes update
  $scope.$on('hasIDDError', function (e, isEmpty) {
    vm.iddEmpty = isEmpty;
    vm.iddValidError = isEmpty;
  });
  $scope.$on('countryCodeChange', function (event, countryCode) {
    vm.selectedCountry = countryCode;
    vm.idd = vm.selectedCountry.split('_')[0];
    vm.mobileCountryCode = vm.selectedCountry.split('_')[1];
    $scope.$emit('iddCountryMatch', '', vm.idd);
  });
}
