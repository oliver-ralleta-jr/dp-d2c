module.exports = {
  template: require('./payment-option-review.html'),
  controller: PaymentOptionReviewController,
  controllerAs: 'vm',
  bindings: {
    summaryStep: '<',
    profile: '<'
  }
};
/** @ngInject */
function PaymentOptionReviewController($scope, $rootScope, $uibModal, dataStoreService, apiService, constants, utils, $ngRedux) {
  let vm = this;
  let perPaymentQ = dataStoreService.getOrderItem('perPaymentQ');
  const reqType = dataStoreService.getItem('reqType') || dataStoreService.session.getValue('reqType');
  const partnerChannel = dataStoreService.getItem('partnerChannel') || 'NML';

  vm.editMode = false;
  vm.isPerDirectEntry = (reqType === 'PER' && partnerChannel !== constants.channel.UOB);
  vm.product = dataStoreService.getOrderItem('product');
  vm.perPaymentConfig = [
    {
      label: constants.perPaymentQ.card.label,
      value: constants.perPaymentQ.card.value,
      details: '',
    },
    {
      label: constants.perPaymentQ.cash.label,
      value: constants.perPaymentQ.cash.value,
      details: '',
    }
  ];

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
    vm.answer = vm.perPaymentConfig.find(payment => payment.value === perPaymentQ);

    $scope.$emit('getPaymentOptionValidationForReview', validateForm);
    $scope.$emit('getPaymentOptionTimeOut', saveAllWithoutValidation);
  };

  function validateForm() {
    dataStoreService.setOrderItem('perPaymentQ', perPaymentQ);
  }

  function saveAllWithoutValidation() {
    dataStoreService.setOrderItem('perPaymentQ', perPaymentQ);
  }

  vm.onChangeHandler = (e) => {
    if (vm.product) {
      vm.product.paymentOption = e;
      dataStoreService.setOrderItem('product', vm.product);
    }

    vm.answer = vm.perPaymentConfig.find(payment => payment.value === e);

    // 'paymentQ' handling
    // 'paymentQ' is for displaying payment-way in confirmation
    // base on the conditions - cash, srs, intend.
    if (reqType === 'PER' && vm.isPerDirectEntry) {
      const keys = Object.keys(constants.perPaymentQ);
      for (const key of keys) {
        if (constants.perPaymentQ[key].value === e) {
          perPaymentQ = key.toUpperCase();
        }
      }
      dataStoreService.setOrderItem('perPaymentQ', perPaymentQ);
    }
  };

  vm.editSection = () => {
    vm.editMode = true;
    $scope.$emit('switchEditStatus');
  };
}
