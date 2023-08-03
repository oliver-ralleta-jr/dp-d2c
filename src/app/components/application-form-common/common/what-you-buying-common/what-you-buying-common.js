module.exports = {
  template: require('./what-you-buying-common.html'),
  controller: WhatYouBuyingCommonController,
  controllerAs: 'vm',
  bindings: {
    profile: '<'
  }
};

/** @ngInject */
function WhatYouBuyingCommonController($scope, utils, $uibModal, $timeout, $ngRedux, dataStoreService, apiService, constants) {
  var vm = this;
  vm.isCollapsed = false;
  vm.formSrc = 'pdfcontainer';
  vm.openPdf = openPdf;
  vm.downloadPDF = downloadPDF;
  vm.downloadDynamicFile = downloadDynamicFile;
  vm.encryptAndDownloadDynamicFile = encryptAndDownloadDynamicFile;
  vm.pruaccess = constants.pruaccess || {};
  vm.insuranceGuide = constants.insuranceGuide;
  vm.isPulse = dataStoreService.getItem('partnerChannel') && dataStoreService.getItem('partnerChannel').toUpperCase() === constants.directEntryChannelCode.PULSE;

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
    vm.profile = dataStoreService.session.getObject('profile');
    vm.reqType = vm.profile.type;
    vm.pdfList = angular.copy(constants.production[vm.reqType].pdfList);
    vm.product = angular.copy(dataStoreService.getOrderItem(constants.production[vm.reqType].proInfo));
    dataStoreService.session.setObject('product', vm.product);
    if (vm.reqType === constants.production.PT.shortName) {
      if (vm.product.docId === (constants.docPrefix + constants.entries.numYears4pt[0].id.toLowerCase())) { // term 5: id_prod_rb1
        vm.pdfList.splice(2, 1);
      } else { // term others
        vm.pdfList.splice(1, 1);
      }
    } else if (vm.reqType === constants.production.PGP.shortName) {
      switch (vm.profile.currencyCode) {
        case constants.currency.USD:
          vm.pdfList.splice(2, 1);
          break;
        case constants.currency.SGD:
          vm.pdfList.splice(1, 1);
          break;
        default:
          break;
      }
    } else if (vm.reqType === constants.production.PS.shortName) {
      const { pdfList, policyContractPdf } = constants.production.PS;
      const {
        prodName,
        basic,
        rider
      } = vm.product;
      if (rider.length === 0) {
        pdfList[0].name = `${prodName} ${basic.displayName}`;
        vm.pdfList = [
          pdfList[0],
          policyContractPdf[0],
          pdfList[1]
        ];
      } else if (['PMB5', 'PMB4', 'PAB4', 'PAB5', 'PMB7', 'PAB7'].indexOf(rider[0].compoCode) > -1) {
        pdfList[0].name = `${prodName} PRU${rider[0].displayName}`;
        vm.pdfList = [
          pdfList[0],
          policyContractPdf[1],
          pdfList[1]
        ];
      } else if (['PMB6', 'PAB6'].indexOf(rider[0].compoCode) > -1) {
        pdfList[0].name = `${prodName} PRU${rider[0].displayName}`;
        vm.pdfList = [
          pdfList[0],
          policyContractPdf[2],
          pdfList[1]
        ];
      } else if (['PMB8', 'PAB8'].indexOf(rider[0].compoCode) > -1) {
        pdfList[0].name = `${prodName} PRU${rider[0].displayName}`;
        vm.pdfList = [
          pdfList[0],
          policyContractPdf[2],
          pdfList[1]
        ];
      }

      // PACSDP-4434 Update policy naming for PRUShield
      if (rider.length === 0) {
        vm.pdfList[1].displayName = `${constants.production.PS.name} ${basic.displayName} Policy Contract`;
        vm.pdfList[1].fileName = `${constants.production.PS.name}_${basic.displayName}_Policy_Contract`;
      } else {
        vm.pdfList[1].displayName = `${constants.production.PS.name} ${basic.displayName} PRU${rider[0].displayName} Policy Contract`;
        vm.pdfList[1].fileName = `${constants.production.PS.name}_${basic.displayName}_PRU${rider[0].displayName.replaceAll(' ', '_')}_Policy_Contract`;
      }

      // PACSDP-4596
      // Change dynamic pdf to static for PULSE PS
      if (vm.isPulse && vm.reqType === 'PS' && vm.product && vm.product.productName) {
        if (rider.length === 0) {
          if (vm.product.productName === 'standard') {
            vm.pdfList[0] = constants.production.PS.productSummaryPdf[0];
          } else {
            vm.pdfList[0] = constants.production.PS.productSummaryPdf[1];
          }
        } else if (vm.product.productName === 'plus') {
          vm.pdfList[0] = constants.production.PS.productSummaryPdf[2];
        } else if (vm.product.productName === 'premier') {
          vm.pdfList[0] = constants.production.PS.productSummaryPdf[3];
        }
        vm.pdfList[0].displayName = prodName + ' ' + vm.product.productName.split('')[0].toUpperCase() + vm.product.productName.split('').slice(1).join('') + ' Product Summary';
        vm.pdfList[0].fileName = vm.pdfList[0].displayName;
      }
    }
    vm.whatYouAreBuying = whatYouAreBuying();
    vm.channel = dataStoreService.getItem('channel');
    vm.aboutYouDetails = dataStoreService.getOrderItem('aboutYouDetails');
    dataStoreService.session.setObject('aboutYouDetails', vm.aboutYouDetails);
    vm.customerName = vm.aboutYouDetails.givenName && vm.aboutYouDetails.givenName !== 'undefined' ? vm.aboutYouDetails.givenName + ' ' + vm.aboutYouDetails.surName : vm.aboutYouDetails.surName;
    vm.isIE = constants.browserName === 'ie';
    vm.isSupported = constants.browserName !== 'safari' && constants.browserName !== 'ios';
    vm.isSafari = !!navigator.userAgent.match(/Version\/[d.]+.*Safari/);
    vm.iosChrome = !!navigator.userAgent.match('CriOS');
    vm.isiOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && typeof navigator.standalone !== 'undefined');
    dataStoreService.session.setObject('isV2UX', vm.isV2UX);
  };

  $scope.$watch('vm.isCollapsed', function (newValues, oldValues) {
    if (newValues !== oldValues) {
      $scope.$emit('leftContentsHeightChanged', true);
    }
  }, true);

  function openPdf(pro) {
    vm.pdfData = dataStoreService.session.getObject('biPdfData');
    $uibModal.open({
      animation: true,
      backdrop: 'static',
      component: 'pdfModal',
      size: 'lg',
      resolve: {
        product() {
          return pro;
        },
        pdf() {
          return vm.pdfData.file;
        }
      }
    });
  }

  function downloadDynamicFile(pdf, name) {
    var currentBlob = utils.base64ToBlob(pdf);
    if (navigator.appVersion.toString().indexOf('.NET') >= 0) {
      vm.downloadUrl = 'javascript:;';
      window.navigator.msSaveBlob(currentBlob, name);
    } else if (vm.iosChrome) { // iOS Chrome
      const reader = new FileReader();
      reader.onloadend = () => {
        window.open(reader.result, '_blank');
      };
      reader.readAsDataURL(currentBlob);
    } else {
      let blobUrl = URL.createObjectURL(currentBlob);
      vm.downloadUrl = blobUrl;
      // trigger download - Add a new 'a' and explicitly call its click() event.
      var downloadLink = document.createElement('a');
      downloadLink.setAttribute('href', blobUrl);
      document.body.appendChild(downloadLink);
      downloadLink.setAttribute('download', name);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  }
  function encryptAndDownloadDynamicFile(pdf, name, category) {
    let encryptPdfRequest = {
      requestType: vm.reqType,
      customId: vm.profile.customID,
      docName: name,
      docCategory: category
    };

    apiService.encryptPdfForDownload(encryptPdfRequest).then(function (res) {
      downloadDynamicFile(res.data.encryptedPdfFile, name);
    }).catch(function (error) {
      throw error;
    });
  }

  function downloadPDF(pro, index) {
    if (index && index === 0 && vm.isiOS && vm.isSafari) {
      return false;
    }
    vm.pdfData = dataStoreService.session.getObject('biPdfData');
    vm.downloadUrl = 'javascript:;';
    if (pro.fileName) {
      vm.downloadName = pro.fileName + '.pdf';
    } else if (vm.isV2UX) {
      vm.downloadName = pro.displayName(pro.name, vm.customerName, vm.reqType);
    } else {
      vm.downloadName = `${constants.production[vm.reqType].name} Benefit ${vm.customerName}.pdf`;
    }
    if (pro.cat === 'BI') {
      encryptAndDownloadDynamicFile(vm.pdfData, vm.downloadName, pro.cat);
    } else if (vm.reqType === 'PS') {
      utils.downloadStaticFile(pro.fileUrlNoWatermark, pro.fileName);
    } else {
      utils.downloadStaticFile(pro.fileUrl, pro.fileName);
    }
  }

  function whatYouAreBuying() {
    let selector = '';
    switch (vm.reqType) {
      case constants.production.PA.shortName:
      case constants.production.PL.shortName:
      case constants.production.PM.shortName:
      case constants.production.PS.shortName:
      case constants.production.PER.shortName:
      case constants.production.PC.shortName:
      case constants.production.PAT.shortName:
        selector = 'Product Summary, and Policy Contract';
        break;
      case constants.production.PT.shortName:
        selector = 'Policy Illustration, Product Summary, Policy Contract and Direct Purchase Product Fact Sheet';
        break;
      default:
        selector = 'Policy Illustration, Product Summary, and Policy Contract';
        break;
    }
    return `Please review your ${selector}, including any coverage exclusion, before proceeding as the values, financial information and benefits have been updated based on the specific responses you have provided in your application. These may vary from the initial quotation provided to you before you commenced the online application.`;
  }
  vm.termAndConditionDocument = () => {
    const termAndCondition = constants.termAndConditionPdf[0];
    const {
      fileUrl,
      fileName
    } = termAndCondition;
    utils.downloadStaticFile(fileUrl, fileName);
  };
}
