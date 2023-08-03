module.exports = {
  template: require('./your-consent-modal.html'),
  controller: yourConsentModalController,
  controllerAs: 'vm',
  bindings: {
    close: '&',
    resolve: '<'
  }
};

/** @ngInject */
function yourConsentModalController() {
  var vm = this;

  vm.closeModal = function () {
    vm.close({ $value: 'cancel' });
  };

  vm.makePayment = function () {
    vm.close({ $value: 'continue' });
  };
}
