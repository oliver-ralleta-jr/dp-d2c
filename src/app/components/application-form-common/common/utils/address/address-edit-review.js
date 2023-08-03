module.exports = {
  template: require('./address-edit-review.html'),
  controller: addressEditReviewController,
  controllerAs: 'vm',

  // selectMode: selectMode='DETAIL' : for guest only
  //            selectMode='EDIT': for login user
  //            selectMode='REVIEW': for review-edit
  bindings: {
    selectMode: '<',
    addressData: '=',
    postalCode: '=',
    blockNo: '=',
    mask: '<',
    streetName: '=',
    buildingName: '=',
    unitNo: '=',
    countryName: '=',
    isMailingAddress: '=',
    currentForm: '<',
    isSingapore: '=',
    setMailingAddress: '&',
    loginStatus: '<',
    setUploadList: '&',
    changeResidentialAddress: '='
  }
};

/** @ngInject */
function addressEditReviewController($scope, apiService, constants, dataStoreService) {
  var vm = this;
  let customer = null;
  vm.questionPresent = false;
  vm.allowEdit = true;


  /* function declaration*/
  vm.generateAddress = generateAddress;
  vm.isEditAction = isEditAction;
  vm.mailCountryChange = mailCountryChange;
  vm.changeIsMailing = changeIsMailing;
  vm.$onInit = function () {
    let myInfoSelected = dataStoreService.session.getValue('myInfoSelected');
    let summaryStep = dataStoreService.getItem('summaryStep');
    vm.editShow = false;
    vm.isSingapore = (!vm.countryName || vm.countryName === constants.singaporeName);
    apiService.dropdowns({
      dropDownCode: constants.dropDownCode.pfcopt070
    }).then(function (res) {
      if (res && res.data) {
        // dropdown for mailing country
        vm.addressData.country.list = res.data;

        if (vm.addressData.addrType === 'mailing' && vm.addressData.country && vm.addressData.country.list) {
          vm.countryName = _.find(vm.addressData.country.list, function (item) {
            return item.option === vm.countryName;
          });
        }
      }
    }).catch(function (error) {
      throw error;
    });

    if (myInfoSelected && summaryStep === constants.step.review) {
      vm.allowEdit = false;
    }
  };

  function populateResidentialAddressInfo() {
    customer = dataStoreService.getItem('customer');
    if (customer.addresses && customer.addresses.length > 0) {
      for (let i in customer.addresses) {
        vm.postalCode = customer.addresses[i].postalCode || '';
        vm.blockNo = customer.addresses[i].block || '';
        vm.streetName = customer.addresses[i].streetName || '';
        vm.buildingName = customer.addresses[i].buildingName || '';
        vm.unitNo = customer.addresses[i].floorUnit || '';
        vm.addressType = customer.addresses[i].addressType;
      }
    }
  }
  function generateAddress(type, postCode) {
    apiService.postalcode({
      postalCode: postCode
    }).then(function (res) {
      vm.blockNo = res.data.blockNo;
      vm.buildingName = res.data.buildingName;
      vm.streetName = res.data.streetName;
      vm.addressType = res.data.addressType;
      // Bug 1580: when click 'retrieve button prefill the country'
      let country = _.find(vm.addressData.country.list, function (item) {
        return item.option === constants.singaporeName;
      });
      vm.countryName = country.option;
    }).catch(function (error) {
      throw error;
    });
  }

  $scope.$on('editField', () => {
    vm.canEdit = true;
  });

  function isEditAction() {
    vm.canEdit = true;
    $scope.$emit('switchEditStatus');
  }

  function mailCountryChange() {
    $scope.$emit('mailCountryChange');
    if (!vm.countryName) {
      vm.isSingapore = true;
    } else if (vm.countryName && vm.countryName.option === constants.singaporeName) {
      vm.isSingapore = true;
    } else {
      vm.isSingapore = false;
    }
  }

  function changeIsMailing() {
    if (!vm.countryName) {
      vm.isSingapore = true;
    } else if (vm.countryName && vm.countryName.option === constants.singaporeName) {
      vm.isSingapore = true;
    } else {
      vm.isSingapore = false;
    }
    if (vm.isMailingAddress === 'false') {
      vm.isSingapore = true;
      $scope.$emit('isMailingAddressChange');
    } else {
      $scope.$emit('setMailingAdrToResAdr');
      $scope.$emit('taxMatch', '', '');
    }
  }

  $scope.$on('livingCountryChange', function (evt, country) {
    if (vm.addressData.addrType === 'residential' && !vm.loginStatus) {
      vm.blockNo = null;
      vm.buildingName = null;
      vm.streetName = null;
      vm.postalCode = null;
      vm.unitNo = null;
      vm.isSingapore = (!country || country === constants.singaporeName);
      vm.canEdit = true;
    }
  });
  // This is broadcasted from the review Page
  $scope.$on('answerChange', function (evt, data) {
    vm.questionPresent = true;
    // Applying the changed only in case of Edit Mode
    if (data.question.editMode) {
      if (data.answer && data.answer.value === 'true') {
        isEditAction();
      } else if (data.answer && data.answer.value === 'false') {
        vm.canEdit = false;
        // if (vm.addressData.addrType === 'residential') {
        //populate existing residential address
        populateResidentialAddressInfo();
        // }
      }
    }
  });
}
