// PACSDP-170: dec file name gen for partnerChannel like UOB.
const setPartnerChannelDec = (decType, partnerCH) =>
  partnerCH
    ? `${decType.toLowerCase()}-${partnerCH.toLowerCase()}`
    : decType.toLowerCase();

/** @ngInject */
function yourDeclarationsCommonController($rootScope, $timeout, $http, $interval, $state, dataStoreService, apiService, constants, utils) {
  var vm = this;
  var host = location.href;
  vm.downloadTermConditions = downloadTermConditions;
  vm.$onInit = function () {
    vm.status = 0; // 0 for continue; 1 for accept
    vm.scrollMsg = 'Swipe to read on';
    vm.profile = vm.resolve.profile;
    vm.closeDialog = closeDialog;
    vm.setStatus = setStatus;
    vm.channel = dataStoreService.getItem('channel');
    vm.partnerChannel = dataStoreService.getItem('partnerChannel');
    vm.creditCardEnrollmentEnabled = dataStoreService.getItem('creditCardEnrollmentEnabled');
    vm.disclaimer = [
      'I understand that I have an obligation to provide responses for this application which are correct and complete as of today. I confirm that I have reviewed and where necessary, updated those answers to correctly and completely reflect information which Prudential can rely on for purposes of this application; and',
      `I acknowledge that I have read and understood the cover page, policy illustration and product summary, including any coverage exclusion. I have read, understood, consent to and confirm the contents of the Declarations above. In addition, I understand and agree that (i) any policy issued may not be valid if a
      material fact is not disclosed in my application; (ii)I should disclose a fact if I am in doubt as to whether that fact is material. I confirm that I am fully satisfied with the information declared in this application`
    ];

    let index = host.indexOf('#');
    let length = index === -1 ? host.length : index;
    host = host.substr(0, length) + '#your-declarations';
    location.href = host;

    $timeout(function () {
      initialDeclarationHeight();
      initialMaskDisplay();
      traceWindowResize();
      stopBottomScroll();
    }, 100);

    loadDeclaration();
    getIpayConfig();
  };

  function downloadTermConditions() {
    const fileUrl = 'pdf/Terms_and_Conditions_eContract_eCorrespondence_DP.pdf';
    const fileName = 'Terms_and_Conditions_eContract_eCorrespondence_DP.pdf';
    utils.downloadStaticFile(fileUrl, fileName);
  }

  function traceWindowResize() {
    $(window).resize(function () {
      initialDeclarationHeight();
    });
  }

  // prevent mobile device from sliding the bottom
  function stopBottomScroll() {
    $('#continue-footer').on('touchmove', (e) => {
      e.stopPropagation();
      e.preventDefault();
    }, false);
    $('#consent-footer').on('touchmove', (e) => {
      e.stopPropagation();
      e.preventDefault();
    }, false);
  }

  function loadDeclaration() {
    let decFile = vm.profile.reqType;
    let fallbackDecFile = vm.profile.reqType;
    // PD-2990 : PGP SCB - text changes to T&Cs.
    const isPgpScb = vm.profile.reqType === constants.production.PGP.shortName
      && vm.channel === constants.channel.SCB;
    let boldParagraphs = [3, 15];
    let boldWords = ['Applicable Local Laws', '3rd Party Personal Data', 'Individual'];

    switch (vm.profile.reqType) {
      case constants.production.PA.shortName:
        boldParagraphs = [];
        boldWords = [];
        break;
      case constants.production.PAT.shortName:
        decFile = constants.production.PAT.shortName;
        fallbackDecFile = constants.production.PAT.shortName;
        break;
      case constants.production.PS.shortName:
        boldParagraphs = [3];
        boldWords = [];
        break;
      case constants.production.PL.shortName:
      case constants.production.PM.shortName:
        decFile = constants.production.PM.shortName;
        fallbackDecFile = constants.production.PM.shortName;
        break;
      case constants.production.PAS.shortName:
        decFile = constants.production.PAS.shortName;
        fallbackDecFile = constants.production.PAS.shortName;
        // PACSDP-5169 Update Terms and condition :
        vm.disclaimer.unshift('I understand a life policy is not a savings account or deposit and that buying a life policy is a long-term commitment, an early termination of the policy usually involves high costs and the surrender value, if any, that is payable to you may be zero or less than the total premiums paid. Some of the benefits for the life policy may not be guaranteed and may be adjusted based on future claims experience.');
        break;
      case constants.production.PER.shortName:
        decFile = constants.production.PER.shortName;
        fallbackDecFile = constants.production.PER.shortName;
        break;
      case constants.production.PC.shortName:
        decFile = constants.production.PC.shortName;
        fallbackDecFile = constants.production.PC.shortName;
        break;
      case constants.production.PT.shortName:
        decFile = constants.production.PT.shortName;
        fallbackDecFile = constants.production.PT.shortName;
        break;
      default:
        decFile = constants.production.PFC.shortName;
        fallbackDecFile = constants.production.PFC.shortName;
        break;
    }

    // PACSDP-170: dec file name gen for partnerChannel like UOB.
    decFile = setPartnerChannelDec(decFile, vm.partnerChannel);

    // PD-2990 : PGP SCB - text changes to T&Cs.
    $http.get(`declaration/${isPgpScb ? 'pgp-scb' : decFile}.dec`)
      .then((res) => {
        vm.declaration = formatDeclaration(res.data, boldParagraphs, boldWords);
        $timeout(() => {
          angular.element('.tmcLink').bind('click', function () {
            vm.downloadTermConditions();
          });
        }, 5000);
      })
      .catch(() => {
        // Re-Fetch fallback
        $http.get(`declaration/${fallbackDecFile.toLowerCase()}.dec`)
          .then((res) => {
            vm.declaration = formatDeclaration(res.data, boldParagraphs, boldWords);
            $timeout(() => {
              angular.element('.tmcLink').bind('click', function () {
                vm.downloadTermConditions();
              });
            }, 5000);
          })
          .catch((e) => {
            throw e;
          });
      });
  }

  function formatDeclaration(text, boldParagraphs, boldWords) {
    // add paragraph
    let newText = '<p>' + text.replace(/[\n\r]+/g, '</p><p>') + '</p>';
    // change quotes
    newText = newText.replace(/[“”]/g, '"');
    // add header
    newText = newText.replace(/<p>(\d+\).*?)<\/p>/g, '<h4>$1</h4>');
    // add sub header
    for (let i of boldParagraphs) {
      let reg = new RegExp(`${i}\\).*>${i + 1}\\)`);
      let paragraph = newText.match(reg);
      let newParagraph = paragraph[0].replace(/<p>(\([^i]\).*?)<\/p>/g, '<h5>$1</h5>');
      newText = newText.replace(reg, newParagraph);
    }
    // add bold word
    let boldStr = boldWords.join('|');
    let wordsReg = new RegExp(`"(${boldStr})"`, 'g');
    newText = newText.replace(wordsReg, '"<b>$1</b>"');
    return newText;
  }

  function initialDeclarationHeight() {
    let header = $('.common-box-header');
    let declarationBox = $('.declaration-box');
    let consentBox = $('#your-declarations .consent-box');
    let continueBox = $('.continue-box');
    let bottomBoxHeight = $('#continue-footer').css('display') !== 'none'
      ? parseInt(continueBox.outerHeight(), 10) : 0;
    let dialogMargin = parseInt($('#your-declarations').css('margin-top'), 10);
    let windowHeight = parseInt($('body').innerHeight(), 10);
    let newHeight = windowHeight - bottomBoxHeight - parseInt(header.outerHeight(), 10) - (dialogMargin * 2);

    declarationBox.outerHeight(newHeight + 'px');
    consentBox.outerHeight(newHeight + 'px');
  }

  function initialMaskDisplay() {
    let element = $('.declaration-box');
    element.on('scroll', function () {
      let bottom = element[0].scrollHeight - element[0].clientHeight - 10;
      if (element.scrollTop() > bottom) {
        $('.mask-box').hide();
      } else {
        $('.mask-box').show();
      }
    });
  }

  // 0 for close, 1 for accept
  function closeDialog(status) {
    if (vm.creditCardEnrollmentEnabled && vm.profile.reqType === 'PS' && status === 1) {
      const url = `${vm.ipayUrl}?app_id=${vm.appId}&session_token=${vm.profile.customID}`;
      window.open(url);
      $rootScope.$broadcast('spinner_show');
      dataStoreService.session.setObject('current_process', 'credit_card_enrollment');
      let count = 1;
      var statusChecker = $interval(function () {
        $rootScope.$broadcast('spinner_show');
        apiService.getEnrollmentStatus(vm.profile.customID).then((res) => {
          if (res.data.result === 'YES') {
            vm.close({ $value: status });
            $interval.cancel(statusChecker);
            dataStoreService.session.setObject('current_process', '');
            $rootScope.$broadcast('spinner_hide');
          }
          if (count >= vm.pollingCount) {
            $interval.cancel(statusChecker);
            dataStoreService.session.setObject('current_process', '');
            $rootScope.$broadcast('spinner_hide');
            vm.close({ $value: 0 });
            $state.go('app.psEntry');
          }
        });
      }, vm.pollingDelay, vm.pollingCount);
    } else {
      vm.close({ $value: status });
    }
  }

  function getIpayConfig() {
    vm.ipayUrl = dataStoreService.getItem('creditCardEnrollmentIpayUrl');
    vm.appId = dataStoreService.getItem('creditCardEnrollmentAppId');
    vm.pollingCount = dataStoreService.getItem('creditCardEnrollmentPollingCount');
    vm.pollingDelay = dataStoreService.getItem('creditCardEnrollmentPollingDelay');
  }

  function setStatus(s) {
    let index = host.indexOf('#');
    let length = index === -1 ? host.length : index;

    if (vm.status === 0 && s === 1) {
      vm.status = 1;
      vm.scrollMsg = 'Tap to return to Terms and conditions';
      location.href = host.substr(0, length) + '#mobile-scroll-msg';
    } else if (vm.status === 1 && s === 0) {
      vm.status = 0;
      vm.scrollMsg = 'Swipe to read on';
      location.href = host.substr(0, length) + '#your-declarations';
    }
  }
}

module.exports = {
  template: require('./your-declarations-common.html'),
  controller: yourDeclarationsCommonController,
  controllerAs: 'vm',

  bindings: {
    resolve: '<',
    close: '&'
  },
};
