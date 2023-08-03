module.exports = {
  template: require('./policy-details-common.html'),
  controller: PolicyDetailsCommonController,
  controllerAs: 'vm',
  bindings: {
    profile: '<',
    summaryStep: '<'
  }
};

/** @ngInject */
function PolicyDetailsCommonController(dataStoreService, $scope, constants, utils, $filter, $ngRedux, $uibModal) {
  var vm = this;

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
    vm.isCollapsedWhatGet = true;
    vm.isCollapsedHowPay = true;

    vm.isCollapsedWhoFor = true;
    vm.isCollapsedBenefits = true;
    vm.isLoading = true;
    vm.reqType = vm.profile.type;
    vm.proInfo = dataStoreService.getOrderItem(constants.production[vm.reqType].proInfo) || dataStoreService.session.getObject(constants.production[vm.reqType].proInfo);
    vm.hasDiscount = dataStoreService.getItem('hasDiscount') || false;
    vm.discountPercentage = dataStoreService.getItem('discountPercentage');
    vm.channel = dataStoreService.getItem('partnerChannel');
    vm.paymentSelected = dataStoreService.getOrderItem('perPaymentQ');
    vm.paymentGateway = dataStoreService.getOrder().paymentGateway || {};
    // PD-2243: for PGRP
    vm.isCollapsedYouBuying = vm.reqType !== constants.production.PGRP.shortName;

    // PACSDP-791 PAS wording
    const perYear = vm.reqType === constants.production.PAS.shortName ? '/ year' : ' / per year';
    vm.oneTimePay = (vm.reqType === constants.production.PGP.shortName
      || vm.reqType === constants.production.PGRP.shortName
      || (vm.reqType === constants.production.PAS.shortName && vm.proInfo.basic.isSinglePremium)
    )
      ? ''
      : perYear;

    vm.policy = createPolicyInfo(vm.reqType, vm.proInfo);
    vm.policyItemsList = utils.createPolicyItemsList(vm.reqType, vm.proInfo);
    vm.icon = createProductIcon(vm.reqType);

    // PACSDP-664: PAS
    vm.product = dataStoreService.getOrderItem('product') || dataStoreService.session.getObject('product');
    vm.isSinglePremium = vm.product.basic.isSinglePremium || false;
    // PACSDP-952: PAS payment
    if (vm.reqType === constants.production.PAS.shortName) {
      const avaliablePayment = dataStoreService.getItem('avaliablePayment') || [];
      vm.isSRSAllowed = !!avaliablePayment.find(e => e === constants.paymentQMethod.srs);
      vm.isCashAllowed = !!avaliablePayment.find(e => e === constants.paymentQMethod.cash);
    }
    // PACSDP-513
    vm.addCriticalPlanFlg = dataStoreService.getOrderItem('addCriticalPlanFlg');

    getPolicyData();

    switch (vm.profile.currencyCode) {
      case constants.currency.SGD:
        vm.currency = constants.currency.sgdShort;
        break;
      case constants.currency.USD:
        vm.currency = constants.currency.usdShort;
        break;
      default:
        vm.currency = '';
        break;
    }

    utils.listen({
      scope: $scope,
      event: constants.events[vm.profile.type].refreshProduct,
      callback(e, data) {
        vm.proInfo = data;
      }
    }, {
      scope: $scope,
      event: 'updateProduct',
      callback() {
        vm.proInfo = dataStoreService.getOrderItem(constants.production[vm.profile.type].proInfo);
        vm.policy = createPolicyInfo(vm.profile.type, vm.proInfo);
        vm.policyItemsList = utils.createPolicyItemsList(vm.reqType, vm.proInfo);
        vm.isLoading = false;
      }
    }, {
      scope: $scope,
      event: 'onChangeDob',
      callback() {
        vm.$onInit();
        vm.isLoading = false;
      }
    });

    vm.viewPERIllustration = () => {
      $uibModal.open({
        animation: true,
        template: `
          <div class="illustrated-payout-modal">
            <div class="modal-header">
              <button type="button" class="close modal-close"
                ng-click="$close('dismiss')">&times;</button>
              <p class="modal-title">Illustrated Payout</p>
            </div>
            <div class="modal-body">
              <per-illustration product="sc.product"/>
            </div>
          </div>
        `,
        appendTo: angular.element('.v2ux-container'),
        controllerAs: 'sc',
        controller() {
          const sc = this;
          sc.product = vm.proInfo;
        },
        size: 'lg'
      });
    };
  };

  $scope.$watchGroup(['vm.isCollapsedWhatGet', 'vm.isCollapsedHowPay', 'vm.isCollapsedWhoFor', 'vm.isCollapsedBenefits', 'vm.isCollapsedYouBuying'], function (newValues, oldValues) {
    if (newValues !== oldValues) {
      $scope.$emit('policyHeightChanged', true);
    }
  }, true);

  // PD-2243:
  function getPolicyData() {
    if (vm.reqType === constants.production.PGRP.shortName && vm.proInfo && vm.proInfo.basic) {
      vm.selectedReceiveOption = vm.proInfo.basic.selectedReceiveOption.receive ? 'Receive it' : 'Accumulate it';
    }
    // PD-2468
    if (vm.reqType === constants.production.PFC.shortName && vm.proInfo && vm.proInfo.pfcParams) {
      vm.cashBenefitOptionYear = '';
      if (vm.proInfo.pfcParams.yearlyCashBenefit === 'Yearly Cash Benefit') {
        vm.cashBenefitOption = '5% Yearly Cash Benefit';
      } else if (vm.proInfo.pfcParams.yearlyCashBenefit === 'Defer Payout') {
        vm.cashBenefitOption = 'Deferment of Cash Benefit';
        vm.cashBenefitOptionYear = 'Receive deferred payout after ' + vm.proInfo.pfcParams.differedYear + constants.premiumUnit.years;
      } else if (vm.proInfo.pfcParams.yearlyCashBenefit === 'Accumulate') {
        vm.cashBenefitOption = 'Accumulate Cash Benefit';
      }
    }
  }

  function createPolicyInfo(type, info) {
    var tempSumYearlyPremium;
    let tempDiscountedYearlyPremium;
    var policy;
    if (vm.reqType === constants.production.PGP.shortName || vm.reqType === constants.production.PGRP.shortName) {
      tempSumYearlyPremium = info.basic.singlePremium;
    } else {
      tempSumYearlyPremium = info.totalYearlyPremium;
      tempDiscountedYearlyPremium = info.totalDiscountPremium;
    }

    policy = {
      sumYearlyPremium: tempSumYearlyPremium,
      discountedYearlyPremium: tempDiscountedYearlyPremium,
      hasDiscount: info.hasDiscount ? info.hasDiscount : false,
      discountedPremium: info.basic.discountedPremium ? info.basic.discountedPremium : 0,
      planName: constants.production[type].name,
      optDescp: info.basic.optDescp,
      rider: angular.copy(info.rider),
      sumAssured: info.basic.sumAssured,
      guaranteedPayout: info.guaranteedPayout
    };
    switch (type) {
      case constants.production.PTV.shortName:
        for (let i in policy.rider) {
          if (policy.rider[i].compoCode === constants.production[vm.reqType].component.common.componentList[2]) {
            // comment out by PACSDP-513 rider display.
            // policy.rider.splice(i, 1);
            break;
          }
        }
        break;
      case constants.production.PT.shortName:
        policy.planName = 'DIRECT - ' + policy.planName;
        break;
      default:
        break;
    }
    return policy;
  }

  function createProductIcon(type) {
    var iconSrc = null;

    switch (type) {
      case constants.production.PA.shortName:
      case constants.production.PS.shortName:
      case constants.production.PFC.shortName:
      case constants.production.ET.shortName:
        iconSrc = 'assets/images/et/sign-hospital.png';
        break;
      case constants.production.PT.shortName:
      case constants.production.PM.shortName:
        iconSrc = 'assets/images/pm/icon-man.png';
        break;

      case constants.production.PL.shortName:
        iconSrc = 'assets/images/pl/icon-lady.png';
        break;
      case constants.production.PTV.shortName:
        iconSrc = 'assets/images/hospital-shield.png';
        break;
        // PD-2045: for PGRP
      case constants.production.PGP.shortName:
      case constants.production.PGRP.shortName:
      case constants.production.PAS.shortName:
        iconSrc = 'assets/images/coin-receive.png';
        break;
      case constants.production.PLMF.shortName:
        iconSrc = 'assets/images/hospital-shield.png';
        break;
      default:
        break;
    }
    return iconSrc;
  }

  // PD-2787
  vm.parsePremium = function (str) {
    var newStr;
    newStr = $filter('number')(Number(str), '2');
    newStr = (String(newStr)).replace('.00', '');
    return newStr;
  };
}
