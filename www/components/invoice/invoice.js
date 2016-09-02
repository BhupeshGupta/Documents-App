'use strict';

angular.module('starter')
  .controller('InvoiceFlowController', function(SettingsFactory, SessionService, $ionicPopup, $ionicModal, $scope, $state, QueueService, $cordovaBarcodeScanner, getInvoiceMetaData, $cordovaCamera, $q, $http, FileFactory, $cordovaFile, InvoiceDocumentCaptureService, DocUpload, FileDataService) {
    //    $scope.invoiceScanCode = function () {
    //        $state.go('invoice.scan');
    //    };
    var vm = this;
    vm.uploadDoc = uploadDoc;
    vm.enqueue = enqueue;
    vm.fromBarCode = false;
    $scope.invoiceEnterMaually = function() {
      $state.go('root.invoice.enter_data_manually');
    };

    console.log("Hi from Invoice Controller");

    $scope.scanBarcode = function() {
      $cordovaBarcodeScanner.scan().then(function(code) {
        alert(code.text);
        vm.fromBarCode = true;
        $scope.getMetedata(JSON.parse(code.text));
      }, function() {
        alert("Unable to scan code. Proceed Manually");
      });
    };

    $scope.user_input = {
      'type': 'Consignment Note',
      'id': ''
    };


    $scope.getMetedata = function(meta) {
      getInvoiceMetaData.get_meta(JSON.stringify(meta)).then(
        function(data) {
          var final_data = [];
          var intermediateData = JSON.parse(data.data.message);
          for (var key in intermediateData) {
            if (key[0] === '$') continue;
            final_data.push({
              "key": key,
              "value": intermediateData[key]
            });
          }
          $scope.metadata_list = final_data;
          console.log(JSON.stringify(final_data));
          pendingDocs(intermediateData['Consignment Name'], intermediateData['$amended_from']);
          $state.go('root.invoice.step2');
        },
        function(error) {
          alert(error);
        });
    };

    $scope.docs = [];

    function pendingDocs(conNumber, amended) {
      if (amended) {
        conNumber = conNumber.substring(0, conNumber.lastIndexOf("-"));
      }
      $http.get(SettingsFactory.getReviewServerBaseUrl() + '/CurrentStat/?sid=' + SessionService.getToken() + '&where={"cno":"' + conNumber + '","status":["0","2"]}')
        .then(function(data) {

          $scope.docs.splice(0, $scope.docs.length);

          data.data.forEach(function(value, index) {
            console.log(value.doctype);
            $scope.docs.push({
              label: value.doctype,
              mandatory: true,
              hasValue: false,
              src: "img/icon-plus.png",
              action: "addSelf",
              conNumber: conNumber
            })
          })

          $scope.docs.push({
            label: "Add",
            mandatory: false,
            src: "img/icon-plus.png",
            action: "addNew"
          });
          $scope.selectedImage = $scope.docs[0];
          $scope.selectedImage.index = 0;
        });
    }


    $scope.showImage = function(index) {
      var object = $scope.docs[index];
      if (object.action == "addNew") {

        $scope.data = {};

        var myPopup = $ionicPopup.show({
          templateUrl: 'templates/invoice-selection-popup.html',
          title: 'Select Documrnt Type',
          scope: $scope,
          buttons: [{
            text: 'Cancel',
            type: 'button-default',
          }, {
            text: '<b>Capture</b>',
            type: 'button-positive',
            onTap: function(e) {
              if (!$scope.data.response) {
                e.preventDefault();
              } else {
                return $scope.data.response;
              }
            }
          }]
        });
        myPopup.then(function(label) {
          if (!label) return;
          $scope.takePic1().then(function(image) {

            InvoiceDocumentCaptureService.addDocument({
              label: label,
              src: image.dir + image.file
            });

          });
        });



      } else if (object.action == "addSelf") {
        $scope.takePic1().then(function(image) {
          InvoiceDocumentCaptureService.updateDocument({
            src: image.dir + image.file,
            file: image.file,
            dir: image.dir,
            action: ''
          }, index);
        });

      } else {
        $scope.selectedImage = $scope.docs[index];
        $scope.selectedImage.index = index;
      }
    };



    InvoiceDocumentCaptureService.setList($scope.docs);




    $scope.showImagesInModel = function() {
      $scope.showModal('templates/image-zoom-view.html');
    };

    $scope.showModal = function(templateUrl) {
      $ionicModal.fromTemplateUrl(templateUrl, {
        scope: $scope
      }).then(function(modal) {
        $scope.modal = modal;
        $scope.modal.show();
      });
    };

    $scope.closeModal = function() {
      $scope.modal.hide();
      $scope.modal.remove();
    };

    $scope.deleteImage = function() {
      var index = $scope.selectedImage.index;
      InvoiceDocumentCaptureService.deleteDocument(index);
      $scope.selectedImage = $scope.docs[index];
      $scope.selectedImage.index = 0;
    };

    $scope.captureAndReview = function() {
      $state.go('root.invoice.step_3');
    };

    $scope.computeMissingDocsAndGo = function() {
      $scope.missingDocs = [];
      angular.forEach($scope.docs, function(doc) {
        if (doc.mandatory && !doc.hasValue)
          $scope.missingDocs.push(doc);
      });
      $state.go('root.invoice.step4');
    };

    $scope.takePic1 = function() {
      var options = {
        quality: 99,
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: Camera.PictureSourceType.CAMERA,
        allowEdit: false,
        encodingType: 1,
        targetWidth: 1200,
        targetHeight: 1600,
        cameraDirection: Camera.Direction.FRONT,
        saveToPhotoAlbum: false,
        correctOrientation: true
      };

      return $cordovaCamera.getPicture(options).then(
        function(imageURI) {
          var image_name = imageURI.substring(imageURI.lastIndexOf('/') + 1);
          return FileFactory.moveFileFromCameraToExtrenalDir(image_name);
        }).then(
        function(fileInfo) {
          $cordovaCamera.cleanup();
          return fileInfo;
        });
    };


    function enqueue() {
      console.log("i was enetered");
      QueueService.enqueue()

    }



    function uploadDoc() {
      var promises = [];
      console.log("upload funcion is called");
      var docs = $scope.docs;
      angular.forEach(docs, function(doc) {
        if (doc.hasValue) {
          console.log(JSON.stringify(doc));
          promises.push(
            DocUpload.createQueueInstance({
              cno: doc.conNumber,
              doctype: doc.label,
              sid: SessionService.getToken()
            }).then(function(data) {

              $cordovaFile
                .readAsDataURL(doc.dir, doc.file).then(function(file_data) {
                  file_data = FileDataService.dataURItoBlob(file_data);
                  var fd = new FormData();
                  fd.append('parenttype', 'Queue');
                  fd.append('parentid', data.data.qid);
                  fd.append('file', file_data, 'upload');
                  var uploadUrl = SettingsFactory.getReviewServerBaseUrl() + "/files/uploadMultipart"
                  return $http.post(uploadUrl, fd, {
                    transformRequest: angular.identity,
                    headers: {
                      'Content-Type': undefined
                    },
                    loading: true
                  }).then(function(res) {
                    console.log(JSON.stringify(res.data));
                    cordova.plugins.notification.local.schedule({
                      id: 1,
                      title: doc.conNumber,
                      text: doc.label + 'Uploaded successfully'
                    });
                    $scope.docs.splice(0, $scope.docs.length);
                    if (vm.fromBarCode == true)
                      $scope.scanBarcode();
                    else
                      $state.go('root.invoice.step1-1');
                  });
                });
            })
          );
        }
      });
    }

  });
