module.exports = {
  template: require('./radio-edit-review.html'),
  controller: radioEditReviewController,
  controllerAs: 'vm',
  bindings: {
    radioLabel: '<',
    radioChoices: '<',
    editMode: '<',
    currentValue: '=',
    radioName: '<'
  }
};
/** @ngInject */
function radioEditReviewController($scope) {
  var vm = this;
  vm.it = {};
  vm.answer = {};
  vm.errorMessage = null;

  vm.mark = mark;
  vm.isMarked = isMarked;
  vm.isEditAction = isEditAction;

  vm.$onInit = function () {
    // set default choice
    vm.radioChoices = vm.radioChoices || [{
      value: 'true',
      label: 'Yes'
    },
    {
      value: 'false',
      label: 'No'
    }
    ];
    // prefill value
    if (vm.currentValue) {
      vm.answer = _.find(vm.radioChoices, function (item) {
        return vm.currentValue === item.value;
      });
      // check if answer existing in option
      if (vm.answer) {
        vm.mark(vm.answer);
        vm.isMarked(vm.answer);
      } else {
        vm.answer = {};
      }
    }
  };


  function mark(it) {
    vm.it = it;
    vm.currentValue = it.value;
    vm.errorMessage = null;
  }

  function isMarked(it) {
    return it.value === vm.it.value;
  }

  $scope.$on('editField', () => {
    vm.editMode = true;
  });

  function isEditAction() {
    vm.editMode = true;
    $scope.$emit('switchEditStatus');
  }
}