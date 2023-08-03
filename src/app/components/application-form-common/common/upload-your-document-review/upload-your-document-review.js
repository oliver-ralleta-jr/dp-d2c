module.exports = {
  template: require('./upload-your-document-review.html'),
  controller: uploadYourDocumentReviewController,
  controllerAs: 'vm',
  bindings: {
    summaryStep: '<',
    detailStep: '<',
    changeDetailStep: '&',
    isCollapsed: '<',
    profile: '<'
  }
};
/** @ngInject */
function uploadYourDocumentReviewController($scope, $uibModal, $timeout, $window, $rootScope, $ngRedux, constants, utils, $q, apiService, FileUploader, dataStoreService, $interval, $state) {
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

  var uploader = vm.uploader = dataStoreService.getItem('uploader') || new FileUploader({
    url: apiService.uploadImage()
  });
  vm.residencyCode = dataStoreService.session.getObject('profile').identity;
  var newFileList = dataStoreService.getOrder().uploadDocumentList || [];
  var loadingTimer;
  var duration = constants.uploadDocDuration;

  vm.summaryEdit = constants.step.review; // flag of review mode
  vm.itemList = dataStoreService.getItem('imageItemList') || [];
  vm.isV2UXColorOnly = utils.isV2UXColorOnly();
  if (vm.residencyCode === constants.residencyCode.singaporean || vm.residencyCode === constants.residencyCode.singaporePR) {
    vm.tempItemList = angular.copy(constants.uploadList.singaporean);
  } else {
    vm.tempItemList = angular.copy(constants.uploadList.foreign);
  }

  var customerProfile = dataStoreService.session.getObject('profile');
  // added to handle exiting customer logic from pruaccess
  var dpNewCustomer = customerProfile.loginDetail.username === null;
  vm.existingCustomer = (Object.prototype.hasOwnProperty.call(customerProfile, 'customer') || !dpNewCustomer);

  vm.isV2UXColorOnly = utils.isV2UXColorOnly();
  vm.item = {}; // the uploading file
  // PD-1490 [PRUman/PRUlady]Delete uploaded doc and save changes, it is saved without any warning message.
  vm.uploaderIndex = dataStoreService.getItem('uploaderIndex') || [];
  // vm.current = new Array(11).fill(0);
  vm.disableUpload = false;
  vm.isCollapsed = false;
  vm.uploadFailed = false;
  vm.uploadError = false;

  $scope.imageUploadFlag = 0; // controll the mouse  events
  $rootScope.uploadYourDocument = true;

  vm.getDocumentRequestList = getDocumentRequestList;
  vm.openCancelModal = openCancelModal;
  vm.edit = edit;


  // file upload
  vm.uploadImage = $scope.uploadImage = function (item, index) {
    if (vm.summaryEdit === constants.step.edit) {
      if ($scope.imageUploadFlag === 0) {
        vm.item = item;
        vm.item.index = index;
        item.index = index;
        vm.uploaderIndex.push(index);
      }
    } else {
      return;
    }
  };

  vm.$onInit = function () {
    vm.reqType = vm.profile.type;
    vm.customId = vm.profile.customID;

    $scope.$emit('uploadDocumentValidationForReview', vm.continue);
  };

  /* drop and drag */
  $window.dropHandler = function dropHandler(id) {
    let index = vm.itemList.findIndex(e => e.id === id);

    if ($scope.imageUploadFlag === 0) {
      vm.item = vm.itemList[index];
      vm.item.index = index;
      vm.uploaderIndex.push(index);
    }
  };

  /* watch the events from related questions and reset the upload list */
  $scope.$on('setImgAmount', function (e, showImg) {
    vm.residencyCode = dataStoreService.session.getObject('profile').identity;
    let oldList = vm.itemList;
    let oldUploadQueue = vm.uploader.queue;
    let obj = utils.setUploadList(oldList, showImg, vm.residencyCode, oldUploadQueue);
    vm.itemList = obj.list;
    vm.uploader.queue = obj.queue;
    dataStoreService.setItem('uploader', vm.uploader);
    // PD-1490 [PRUman/PRUlady]Delete uploaded doc and save changes, it is saved without any warning message.
    let tempUploaderIndex = vm.uploaderIndex.length > 0 ? angular.copy(vm.uploaderIndex) : [];
    vm.uploaderIndex = [];
    tempUploaderIndex.forEach(function (val) {
      uploader.queue.forEach(function (value) {
        if (val === value.index) {
          vm.uploaderIndex.push(val);
          return;
        }
      });
    });
    /* if any related question is updated, make upload container to edit mode
     only required for when require more upload files
    */
    if (vm.itemList.length > vm.uploader.queue.length) {
      vm.summaryEdit = constants.step.edit;
    }
  });

  /* set the image filter |jpg|png|gif|jpeg| */
  uploader.filters.push({
    name: 'imageFilter',
    fn(item /* {File|FileLikeObject}*/) {
      var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
      return constants.uploadDocFileTypes.indexOf(type) !== -1;
    }
  });

  /* set the size filter between 0 and 4Mb */
  uploader.filters.push({
    name: 'sizeFilter',
    fn(item /* {File|FileLikeObject}*/) {
      var filesize = item.size / 1024 / 1024;
      return filesize < 4;
    }
  });
  uploader.filters.push({
    name: 'sizeFilter',
    fn(item /* {File|FileLikeObject}*/) {
      var filesize = item.size / 1024 / 1024;
      return filesize > 0;
    }
  });
  /* set the size filter between 0 and 4Mb */

  // control loading style
  function doLoading() {
    vm.disableUpload = true;
    $rootScope.nextDisable = true;
    vm.item.currentPercent++;
    if (vm.item.currentPercent < 100) {
      vm.item.currentPercent++;
    } else {
      $interval.cancel(loadingTimer);
      $rootScope.nextDisable = false;
      vm.disableUpload = false;
      $scope.imageUploadFlag = 0;
    }
  }

  // get md5 checksum
  function getDocumentRequestList(list) {
    var requestList = {};
    for (let i in list) {
      requestList['file' + (Number(i) + 1)] = list[i].file;
      requestList['md5' + (Number(i) + 1)] = list[i].checksum;
    }
    return requestList;
  }

  uploader.onWhenAddingFileFailed = function () {
    vm.uploadError = true;
  };
  uploader.onAfterAddingFile = function () {
    vm.uploadError = false;
    $timeout(function () {
      $scope.imageUploadFlag = 1;
      vm.item.currentImage = true;
      loadingTimer = $interval(doLoading, duration);
      $scope.imageUploadChange++;
      vm.item.imageName = uploader.queue[uploader.queue.length - 1].file.name;
      if (uploader.queue.length > 10) {
        vm.uploadFailed = true;
      } else {
        vm.uploadFailed = false;
      }
    }, 10);
  };
  uploader.onAfterAddingAll = function (addedFileItems) {
    uploader.queue[uploader.queue.length - 1].index = vm.item.index;
    vm.uploader.uploadItem(addedFileItems[0]);
  };
  uploader.onSuccessItem = function (fileItem, response) {
    newFileList.push(response);
  };

  $scope.deleteImage = function (item, index) {
    // PD-2121 Upload documents (Re-uploading)
    for (let i in vm.tempItemList) {
      if (vm.tempItemList[i].id === item.id) {
        vm.itemList[index] = angular.copy(vm.tempItemList[i]);
      }
    }

    // PD-1490 [PRUman/PRUlady]Delete uploaded doc and save changes, it is saved without any warning message.
    let tempUploaderIndex = angular.copy(vm.uploaderIndex);
    tempUploaderIndex.forEach(function (val, ind) {
      if (val === index) {
        vm.uploaderIndex.splice(ind, 1);
        return;
      }
    });
    uploader.queue.forEach(function (e, ind) {
      if (e.index === index) {
        uploader.queue.splice(ind, 1);
        return;
      }
    });

    newFileList.forEach(function (e, ind) {
      if (e.index === index) {
        newFileList.splice(ind, 1);
        return;
      }
    });
  };

  uploader.onCompleteAll = function () {
    // PD-1490 [PRUman/PRUlady]Delete uploaded doc and save changes, it is saved without any warning message.
    vm.uploader.queue.forEach(function (val, ind) {
      val.index = vm.uploaderIndex[ind];
    });
    dataStoreService.setItem('uploader', vm.uploader);

    newFileList.forEach(function (val, ind) {
      val.index = vm.uploaderIndex[ind];
    });
  };

  vm.continue = function () {
    if (vm.uploader.queue.length < vm.itemList.length) {
      vm.uploadFailed = true;
      vm.isUpload = true;
      $rootScope.uploadYourDocument = false;
      return;
    }
    vm.uploadFailed = false;
    vm.isUpload = false;
    $rootScope.uploadYourDocument = true;
    dataStoreService.setItem('imageItemList', vm.itemList);
    dataStoreService.setItem('uploader', vm.uploader);
    dataStoreService.setItem('uploaderIndex', vm.uploaderIndex);

    dataStoreService.setOrderItem('uploadDocumentList', newFileList);

    let fileRequestList = getDocumentRequestList(newFileList);
    fileRequestList.customId = vm.customId;
    fileRequestList.productType = vm.reqType;

    apiService.saveDocuments(fileRequestList).then(function () {
      if (!vm.uploadFailed && !vm.uploadError) {
        if (vm.detailStep === constants.section.uploadDocument) {
          $state.go('app.summaryCommon');
        }
      }
    }).catch(function (error) {
      throw error;
    });
  };

  function openCancelModal() {
    $uibModal.open({
      animation: true,
      backdrop: 'static',
      component: 'cancelModal',
      size: 'lg',
      resolve: {
        customId() {
          return vm.customId;
        }
      }
    });
  }

  $scope.$on('editField', () => {
    vm.summaryEdit = constants.step.edit;
  });

  function edit() {
    vm.summaryEdit = constants.step.edit;
    $scope.$emit('switchEditStatus');
  }
}
