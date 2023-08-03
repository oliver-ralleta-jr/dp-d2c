module.exports = {
  template: require('./input-review.html'),
  controller: inputReviewController,
  controllerAs: 'vm',
  bindings: {
    aboutYouForm: '<',
    inputDetails: '<',
    inputValue: '=',
    validateInput: '&',
    /** selectMode: selectMode='DETAIL' : for Guest only
                selectMode='EDIT': for Existed User
                selectMode='REVIEW': for Review-Edit */
    selectMode: '<',
    loginStatus: '<',
    withDollar: '<'
  }
};
/** @ngInject */
function inputReviewController($scope, $filter, constants) {
  var vm = this;

  // Edit Button Aciton
  vm.isEditAction = isEditAction;

  vm.$onInit = function () {
    vm.isEdit = false;
    vm.showEditButton = false;
    vm.onFocus = false;
    if (vm.inputDetails && vm.inputDetails.inputName) {
      vm.inputId = 'txt' + vm.inputDetails.inputName.substring(0, 1).toUpperCase() + vm.inputDetails.inputName.substring(1);
    }
    vm.selectMode = vm.selectMode || constants.step.review;

    // PD-2104: change format for salary
    if (vm.inputDetails && vm.inputDetails.isSalary) {
      vm.inputValue = $filter('number')(vm.inputValue);
    }
  };

  $scope.$on('editField', () => {
    vm.isEdit = true;
  });

  function isEditAction() {
    vm.isEdit = true;
    $scope.$emit('switchEditStatus');
  }

  vm.formatSalary = function () {
    if (vm.inputDetails && vm.inputDetails.isSalary && vm.inputValue) {
      vm.inputValue = $filter('number')(vm.inputValue);
    }
  };

  vm.unFormatSalary = function () {
    if (vm.inputDetails && vm.inputDetails.isSalary && vm.inputValue) {
      vm.inputValue = parseInt(vm.inputValue.replace(/,/g, ''), 10);
    }
  };

  vm.validateLength = function () {
    if (vm.inputDetails && vm.inputDetails.isSalary && vm.inputValue && vm.inputValue.length > 15) {
      vm.inputValue = vm.inputValue.slice(0, 15);
    }
  };
}
