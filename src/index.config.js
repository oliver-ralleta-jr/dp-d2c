module.exports = commonConfig;

/** @ngInject */
function commonConfig($provide, $compileProvider, $httpProvider, IdleProvider, KeepaliveProvider, datetimePlaceholder, constants) {
  $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|file|blob|mailto|javascript|tel):/);
  $provide.decorator('$exceptionHandler', extendExceptionHandler);
  $httpProvider.interceptors.push('httpInteceptor');
  IdleProvider.idle(constants.timeout.page); // default 40 mins => 2400 seconds
  IdleProvider.timeout(constants.timeout.popup); // default 5 mins => 300 seconds

  $httpProvider.defaults.cache = false;
  if (!$httpProvider.defaults.headers.get) {
    $httpProvider.defaults.headers.get = {};
  }

  angular.extend(datetimePlaceholder, {
    year: 'YYYY',
    month: 'MM',
    date: 'DD'
  });

  function extendExceptionHandler($delegate, $injector) {
    // PACSDP-313: reporting uncaught errors.
    window.onerror = function (message, source, lineno, colno, error) {
      $injector.get('errorsService').errorReporter(error);
    };
    return function (exception, cause) {
      $delegate(exception, cause);
      // PACSDP-313: reporting angular errors.
      $injector.get('errorsService').errorReporter(exception);
    };
  }
}
