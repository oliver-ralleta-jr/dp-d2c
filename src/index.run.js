module.exports = runBlock;
/** @ngInject */
// eslint-disable-next-line
function runBlock($rootScope, $window, $transitions, $injector, constants, apiService, utils, dataStoreService, errorsService, $location) {
  $rootScope.contextPath = constants.contextPath;
  $transitions.onSuccess({}, function () {
    $window.scrollTo(0, 0);
  });

  // Add injector to run block
  window.$injector = $injector;

  var cuid = require('cuid');

  // PACSDP-132
  dataStoreService.setItem('session-id', cuid());

  /* meta tag injection for production */
  if (process.env.NODE_ENV === 'production') {
    const httpEquiv = 'Content-Security-Policy';
    const content = `
      script-src 'self' 'unsafe-eval' *.google-analytics.com *.googletagmanager.com *.googleapis.com *.cloudfront.net *.google.com *.google.com.sg *.facebook.net *.serving-sys.com *.webtrends.com *.webtrendslive.com *.googleadservices.com *.g.doubleclick.net data:;
      style-src 'self' 'unsafe-inline' *.prudential.com.sg *.googleapis.com *.google.com *.google.com.sg data: blob:;
      img-src 'self' *.google-analytics.com *.googletagmanager.com maps.googleapis.com *.gstatic.com *.g.doubleclick.net *.google.com *.google.com.sg gtrk.s3.amazonaws.com data:;
    `;
    const newMeta = document.createElement('meta');
    newMeta.setAttribute('http-equiv', httpEquiv);
    newMeta.setAttribute('content', content);
    let lastMetaTag = document.getElementsByTagName('meta');
    lastMetaTag = lastMetaTag[lastMetaTag.length - 1];
    lastMetaTag.insertAdjacentElement('afterend', newMeta);
  }

  if (!_.isEmpty($location.search())) {
    const { channelCode, campaignId, prodCode, type } = $location.search();
    // Dom afflication partner url validation
    if (channelCode) {
      const isEntry = $location.path().includes('_entry');
      const reqType = isEntry && $location.path().replace(/\//g, '').split('_')[0].toUpperCase() || prodCode;
      dataStoreService.setItem('reqType', reqType);
      const reqBody = {
        channelCode,
        campaignId,
        prodCode: reqType
      };
      reqBody.type = type && type.toUpperCase() || constants.mediumType.NML;

      apiService.validateUrl(reqBody)
        .then((res) => {
          if (res.data === false) {
            errorsService.errorHandler({ status: 403 });
          }
        })
        .catch((e) => {
          throw e;
        });
    }
  }

  let entryUrlFlag = true;

  // eslint-disable-next-line
  $transitions.onBefore({}, function (transition) {
    const filter = [
      'cyberpay',
      'otpForm',
      'app.summaryCommon',
    ];
    if (filter.some(route => route === transition.to().name)) {
      return apiService.getLeadGenListStatus()
        // eslint-disable-next-line
        .then(res => {
          const config = utils.leadGenMapper(res.data);
          const reqType = dataStoreService.getItem('reqType') || dataStoreService.session.getValue('reqType');
          dataStoreService.setItem('globalLeadGenStatus', config);
          if (config[reqType]) {
            return transition.router.stateService.target('app.errorPage');
          }
        })
        // eslint-disable-next-line
        .catch(e => transition.router.stateService.target('app.errorPage'));
    }

    // save entry url
    if (entryUrlFlag) {
      entryUrlFlag = false;
      dataStoreService.setItem('entryUrl', $window.location.href);
    }
  });
}
