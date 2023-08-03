module.exports = {
  template: require('./select-edit-review.html'),
  controller: selectEditReviewController,
  controllerAs: 'vm',

  // labelName: the title for the filed, e.g. "Nationality", "Country"
  // currentValue: the current value
  // currentValueDesc: the display text for current value
  // dropDownList: the dropdown list for select
  // selectMode: selectMode='DETAIL' : for guest only
  //			  selectMode='EDIT': for login user
  //            selectMode='REVIEW': for review-edit
  bindings: {
    labelName: '<',
    currentValue: '=',
    currentValueDesc: '=',
    dropDownList: '<',
    selectMode: '<',
    dropDownKey: '<',
    currentForm: '<',
    fieldName: '<'
  }
};

/** @ngInject */
function selectEditReviewController($scope) {
  var vm = this;

  // Edit Button Aciton
  vm.isEditAction = isEditAction;

  vm.$onInit = function () {
    vm.canEdit = false;
    vm.editShow = false;
  };

  vm.selectBlur = function () {
    vm.isOnBlur = true;
    if (vm.labelName === 'Nationality') {
      $scope.$emit('changeAgentChangeFlg', true);
    }
  };

  $scope.$on('editField', () => {
    vm.canEdit = true;
  });

  function isEditAction() {
    vm.canEdit = true;
    $scope.$emit('switchEditStatus');
  }
}