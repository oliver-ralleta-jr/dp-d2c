module.exports = {
  template: require('./upload-your-document-common.html'),
  controller: uploadYourDocumentCommonController,
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
function uploadYourDocumentCommonController($scope, $uibModal, $timeout, $rootScope, $ngRedux, constants, utils, $q, apiService, FileUploader, dataStoreService, $interval, $state, $window, authService) {
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

  vm.residencyCode = dataStoreService.session.getObject('profile').identity;
  var newFileList = [];
  var uploader = vm.uploader = new FileUploader({
    url: apiService.uploadImage()
  });
  authService.setAuthHeader(vm.uploader);
  var loadingTimer;
  var duration = constants.uploadDocDuration;
  vm.showProofOfAddress = false;
  vm.mandatoryUpload = dataStoreService.getItem('mandatoryUpload');
  loadUploadList();
  vm.isV2UXColorOnly = utils.isV2UXColorOnly();
  vm.item = {}; // the uploading file
  // PD-1490 [PRUman/PRUlady]Delete uploaded doc and save changes, it is saved without any warning message.
  vm.uploaderIndex = []; // the uploaded file array
  // vm.current = new Array(11).fill(0);
  vm.disableUpload = false; // disable when uploading
  vm.isCollapsed = false; // page collaps flag
  vm.uploadFailed = false;
  vm.uploadError = false;

  $scope.imageUploadFlag = 0; // controll the mouse events, drop and drag
  $rootScope.uploadYourDocument = true; // status flag for upload container

  vm.getDocumentRequestList = getDocumentRequestList;
  vm.openCancelModal = openCancelModal;

  // file upload, add index property
  vm.uploadImage = $scope.uploadImage = function (item, index) {
    if ($scope.imageUploadFlag === 0) {
      vm.item = item;
      vm.item.index = index;
      item.index = index;
      vm.uploaderIndex.push(index);
    }
  };

  // this function is for PER and PC where residency options is updated in application page
  // upload doc section will be updated based on the residency type selected in the application page
  function updateUploadDocListPER() {
    let customerProfile = dataStoreService.session.getObject('profile');
    // added to handle exiting customer logic from pruaccess
    let dpNewCustomer = customerProfile.loginDetail.username === null;
    vm.existingCustomer = (Object.prototype.hasOwnProperty.call(customerProfile, 'customer') || !dpNewCustomer);
    vm.residencyCode = dataStoreService.session.getObject('profile').identity;
    if (vm.residencyCode === constants.residencyCode.singaporean || vm.residencyCode === constants.residencyCode.singaporePR) {
      vm.itemList[0] = {
        currentImage: false, // flag to check if upload is done
        currentPercent: 0, // upload percentage
        name: 'Front of NRIC',
        subName: 'Front of NRIC:',
        imgIndex: 1, // related to the questionniare mmyyyy question index
        id: 'front-of-NRIC'
      };
      vm.itemList[1] = {
        currentImage: false,
        currentPercent: 0,
        name: 'Back of NRIC',
        subName: 'Back of NRIC:',
        imgIndex: 1,
        id: 'back-of-NRIC'
      };
      vm.itemList = vm.itemList.filter(item => item.id !== 'proof-of-address'); // remove proof of address
      if (!vm.existingCustomer) {
        let index = vm.itemList.findIndex(e => e.imgIndex === 2); // beneficiary/PEP list is added, index might change so finding the index of selfie and then updating
        index = index === -1 ? 2 : index;
        vm.itemList[index] = {
          currentImage: false,
          currentPercent: 0,
          name: 'Selfie with front of NRIC',
          subName: 'Selfie with front of NRIC:',
          imgIndex: 2,
          id: 'selfie-with-front-of-NRIC'
        };
      } else if (vm.existingCustomer && vm.mandatoryUpload) {
        const proofOfAddress = {
          currentImage: false,
          currentPercent: 0,
          name: 'Proof of address',
          subName: 'Proof of address:',
          imgIndex: 3,
          id: 'proof-of-address'
        };
        vm.itemList.push(proofOfAddress);
        vm.showProofOfAddress = true;
      }
      vm.tempItemList = angular.copy(constants.uploadList.singaporean); // perdefined upload document structure in constants
    } else {
      if (vm.showProofOfAddress) {
        vm.itemList = [{
          currentImage: false,
          currentPercent: 0,
          name: 'Proof of address',
          subName: 'Proof of address:',
          imgIndex: 3,
          id: 'proof-of-address'
        }];
      } else {
        vm.itemList[0] = {
          currentImage: false,
          currentPercent: 0,
          name: 'Back of employment/dependant pass',
          subName: 'Back of employment/dependant pass:',
          imgIndex: 1,
          id: 'back-of-pass'
        };
        if (!vm.existingCustomer) {
          let index = vm.itemList.findIndex(e => e.imgIndex === 2);
          index = index === -1 ? 2 : index;
          vm.itemList[index] = {
            currentImage: false,
            currentPercent: 0,
            name: 'Selfie with front of employment /dependent pass',
            subName: 'Selfie with front of employment /dependent pass:',
            imgIndex: 2,
            id: 'selfie-with-front-of-employment-pass'
          };
        } else if (vm.existingCustomer && vm.mandatoryUpload) {
          const proofOfAddress = {
            currentImage: false,
            currentPercent: 0,
            name: 'Proof of address',
            subName: 'Proof of address:',
            imgIndex: 3,
            id: 'proof-of-address'
          };
          vm.itemList.push(proofOfAddress);
          vm.showProofOfAddress = true;
        }
      }
      vm.tempItemList = angular.copy(constants.uploadList.foreign);
    }
  }
  function loadUploadList() {
    // default the uploadlist
    var customerProfile = dataStoreService.session.getObject('profile');
    // added to handle exiting customer logic from pruaccess
    var dpNewCustomer = customerProfile.loginDetail.username === null;
    vm.existingCustomer = (Object.prototype.hasOwnProperty.call(customerProfile, 'customer') || !dpNewCustomer);
    vm.residencyCode = dataStoreService.session.getObject('profile').identity;
    if (vm.residencyCode === constants.residencyCode.singaporean || vm.residencyCode === constants.residencyCode.singaporePR) {
      vm.itemList = [{
        currentImage: false, // flag to check if upload is done
        currentPercent: 0, // upload percentage
        name: 'Front of NRIC',
        subName: 'Front of NRIC:',
        imgIndex: 1, // related to the questionniare mmyyyy question index
        id: 'front-of-NRIC'
      }, {
        currentImage: false,
        currentPercent: 0,
        name: 'Back of NRIC',
        subName: 'Back of NRIC:',
        imgIndex: 1,
        id: 'back-of-NRIC'
      }];
      if (!vm.existingCustomer) {
        const selfiePhoto = {
          currentImage: false,
          currentPercent: 0,
          name: 'Selfie with front of NRIC',
          subName: 'Selfie with front of NRIC:',
          imgIndex: 2,
          id: 'selfie-with-front-of-NRIC'
        };
        vm.itemList.push(selfiePhoto);
      } else if (vm.existingCustomer && vm.mandatoryUpload) {
        const proofOfAddress = {
          currentImage: false,
          currentPercent: 0,
          name: 'Proof of address',
          subName: 'Proof of address:',
          imgIndex: 3,
          id: 'proof-of-address'
        };
        vm.itemList.push(proofOfAddress);
        vm.showProofOfAddress = true;
      }
      vm.tempItemList = angular.copy(constants.uploadList.singaporean); // perdefined upload document structure in constants
    } else {
      if (vm.showProofOfAddress) {
        vm.itemList = [{
          currentImage: false,
          currentPercent: 0,
          name: 'Proof of address',
          subName: 'Proof of address:',
          imgIndex: 3,
          id: 'proof-of-address'
        }];
      } else {
        vm.itemList = [{
          currentImage: false,
          currentPercent: 0,
          name: 'Front of employment/dependant pass',
          subName: 'Front of employment/dependant pass:',
          imgIndex: 1,
          id: 'front-of-pass'
        }, {
          currentImage: false,
          currentPercent: 0,
          name: 'Back of employment/dependant pass',
          subName: 'Back of employment/dependant pass:',
          imgIndex: 1,
          id: 'back-of-pass'
        }];
        if (!vm.existingCustomer) {
          const selfiePhoto = {
            currentImage: false,
            currentPercent: 0,
            name: 'Selfie with front of employment /dependent pass',
            subName: 'Selfie with front of employment /dependent pass:',
            imgIndex: 2,
            id: 'selfie-with-front-of-employment-pass'
          };
          vm.itemList.push(selfiePhoto);
        } else if (vm.existingCustomer && vm.mandatoryUpload) {
          const proofOfAddress = {
            currentImage: false,
            currentPercent: 0,
            name: 'Proof of address',
            subName: 'Proof of address:',
            imgIndex: 3,
            id: 'proof-of-address'
          };
          vm.itemList.push(proofOfAddress);
          vm.showProofOfAddress = true;
        }
      }
      vm.tempItemList = angular.copy(constants.uploadList.foreign);
    }
  }
  vm.$onInit = function () {
    vm.reqType = vm.profile.type;
    vm.customId = vm.profile.customID;
    $scope.$emit('uploadDocumentValidation', vm.continue);
  };
  vm.$onChanges = function (changes) {
    if (changes && changes.detailStep && changes.detailStep.currentValue === 'uploadDocument' && (vm.reqType === 'PC' || vm.reqType === 'PER' || vm.reqType === 'PAT')) {
      updateUploadDocListPER();
    }
  };
  $scope.$on('resetUploadSection', function () {
    updateUploadDocListPER();
  });
  /* drop and drag */
  $window.dropHandler = function dropHandler(id) {
    const index = vm.itemList.findIndex(e => e.id === id);

    if ($scope.imageUploadFlag === 0) {
      vm.item = vm.itemList[index];
      vm.item.index = index;
      vm.uploaderIndex.push(index);
    }
  };

  /* watch the events from related questions and reset the upload list */
  $scope.$on('uploadShowProofOfAddress', function (e, showProofOfAddress) {
    vm.showProofOfAddress = showProofOfAddress;
  });

  /* watch the events from related questions and reset the upload list */
  $scope.$on('setImgAmount', function (e, showImg) {
    vm.residencyCode = dataStoreService.session.getObject('profile').identity;
    if (vm.reqType === 'PER') {
      if (vm.residencyCode === constants.residencyCode.singaporean || vm.residencyCode === constants.residencyCode.singaporePR) {
        vm.tempItemList = angular.copy(constants.uploadList.singaporean);
      } else {
        vm.tempItemList = angular.copy(constants.uploadList.foreign);
      }
    }
    let oldList = vm.itemList;
    let oldUploadQueue = vm.uploader.queue;
    // update itemList for add new and delete
    const obj = utils.setUploadList(oldList, showImg, vm.residencyCode, oldUploadQueue);
    vm.itemList = obj.list;
    vm.uploader.queue = obj.queue;
    // PD-1490 [PRUman/PRUlady]Delete uploaded doc and save changes, it is saved without any warning message.
    let tempUploaderIndex = angular.copy(vm.uploaderIndex);
    vm.uploaderIndex = [];
    tempUploaderIndex.forEach(function (val) {
      uploader.queue.forEach(function (value) {
        if (val === value.index) {
          vm.uploaderIndex.push(val);
          return;
        }
      });
    });
  });

  $scope.$watch('vm.isCollapsed', function (newValues, oldValues) {
    if (newValues !== oldValues) {
      $scope.$emit('leftContentsHeightChanged', true);
    }
  }, true);

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
    vm.disableUpload = true; // disable upload file container
    $rootScope.nextDisable = true; // disable next button
    vm.item.currentPercent++;
    if (vm.item.currentPercent < 100) {
      vm.item.currentPercent++;
    } else {
      $interval.cancel(loadingTimer);
      vm.disableUpload = false;
      $rootScope.nextDisable = false;
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
  // per-defined function: for when upload failed
  uploader.onWhenAddingFileFailed = function () {
    vm.uploadError = true;
  };
  // per-defined function: after upload
  uploader.onAfterAddingFile = function () {
    vm.uploadError = false;
    $timeout(function () {
      $scope.imageUploadFlag = 1;
      vm.item.currentImage = true;
      loadingTimer = $interval(doLoading, duration);
      $scope.imageUploadChange++;
      vm.item.imageName = uploader.queue[uploader.queue.length - 1].file.name; // the uploading file
      // max count for upload files
      // if (uploader.queue.length > 10) {
      //   vm.uploadFailed = true;
      // } else {
      //   vm.uploadFailed = false;
      // }
    }, 10);
  };
  // per-defined function: after upload, used to set index
  uploader.onAfterAddingAll = function (addedFileItems) {
    uploader.queue[uploader.queue.length - 1].index = vm.item.index;
    vm.uploader.uploadItem(addedFileItems[0]);
  };
  // delete upload file
  $scope.deleteImage = function (item, index) {
    // PD-2121 Upload documents (Re-uploading):
    // delete item list
    for (let i in vm.tempItemList) {
      if (vm.tempItemList[i].id === item.id) {
        vm.itemList[index] = angular.copy(vm.tempItemList[i]);
      }
    }

    // PD-1490 [PRUman/PRUlady]Delete uploaded doc and save changes, it is saved without any warning message.
    let tempUploaderIndex = angular.copy(vm.uploaderIndex);
    // delete index
    tempUploaderIndex.forEach(function (val, ind) {
      if (val === index) {
        vm.uploaderIndex.splice(ind, 1);
        return;
      }
    });
    // delete queue
    uploader.queue.forEach(function (e, ind) {
      if (e.index === index) {
        uploader.queue.splice(ind, 1);
        return;
      }
    });
    // delete for esub
    newFileList.forEach(function (e, ind) {
      if (e.index === index) {
        newFileList.splice(ind, 1);
        return;
      }
    });
  };
  // per-defined function: set file list for esub
  uploader.onSuccessItem = function (fileItem, response) {
    newFileList.push(response);
    // added below code to remove the corrupted files.
    if (Object.prototype.hasOwnProperty.call(response, 'success') && response.success === false) {
      uploader.onCompleteAll();
      $timeout(function () {
        $scope.deleteImage(vm.item, vm.item.index);
      }, 10);
    }
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
  // click next button
  vm.continue = function () {
    if (vm.uploader.queue.length < vm.itemList.length) {
      vm.uploadFailed = true;
      vm.isUpload = true;
      $rootScope.uploadYourDocument = false;
      const theTop = utils.getElementTop(document.getElementById('upload-error-box'));
      utils.pushInvalidFields('upload-error-box', theTop);
      return;
    }
    vm.uploadFailed = false;
    vm.isUpload = false; // may be can remove
    $rootScope.uploadYourDocument = true;
    dataStoreService.setItem('imageItemList', vm.itemList); // define the upload structure
    dataStoreService.setItem('uploaderIndex', vm.uploaderIndex); // define file sequence
    dataStoreService.setItem('uploader', vm.uploader); // all upload information

    dataStoreService.setOrderItem('uploadDocumentList', newFileList); // for esub

    let fileRequestList = getDocumentRequestList(newFileList);
    fileRequestList.customId = vm.customId;
    fileRequestList.productType = vm.reqType;
    apiService.saveDocuments(fileRequestList).then(function () {
      if (!vm.uploadFailed && !vm.uploadError && vm.detailStep === constants.section.uploadDocument) {
        $state.go('app.summaryCommon');
      }
    }).catch(function (error) {
      throw error;
    });
  };

  $scope.$on('proofOfAddressOption', function (e, showProofOfAddress) {
    vm.mandatoryUpload = true;
    vm.showProofOfAddress = showProofOfAddress;
    loadUploadList();
  });

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
}
