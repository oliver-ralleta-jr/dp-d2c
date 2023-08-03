module.exports = {
  template: require('./gender-select.html'),
  controller: genderSelectController,
  controllerAs: 'vm',
  bindings: {
    aboutYouForm: '<',
    gender: '=',
    dropDownList: '<',
    /** selectMode: selectMode='DETAIL' : for Guest only
                selectMode='EDIT': for Existed User
                selectMode='REVIEW': for Review-Edit */
    selectMode: '<',
    loginStatus: '<',
    profile: '<'
  }
};
/** @ngInject */
function genderSelectController($scope, constants) {
  var vm = this;

  // Edit Button Aciton
  vm.isEditAction = isEditAction;
  vm.selectBlur = selectBlur;

  vm.$onInit = function () {
    vm.isEdit = false;
    vm.showEditButton = false;
    vm.onFocus = false;
    vm.selectMode = vm.selectMode || constants.step.review;
  };

  function selectBlur() {
    vm.isOnBlur = true;
    $scope.$emit('changeAgentChangeFlg', true);
  }

  $scope.$on('editField', () => {
    vm.isEdit = true;
  });

  function isEditAction() {
    vm.isEdit = true;
    $scope.$emit('switchEditStatus');
  }
}
