'use strict';

angular.module('starter')
    .controller('ChequeController', chequeController);

function chequeController($scope, DocumentService, $cordovaCamera, $http, SettingsFactory, FileFactory) {
    var cq = this;
    cq.captureCameraImage = clickChequePic;
    cq.addImage = addPayinSlipPhoto;


    cq.payslipImages = [];

    cq.user_input = {};
    cq.chequeDataUpload = chequeDataUpload;
    cq.payinSlipData = payinSlipData;

    $scope.company_search = function (query) {
        return DocumentService.search('Company', query, {})
            .then(function (data) {
                return data.results;
            });
    };

    $scope.account_search = function (query, company) {
        return DocumentService.search('Account', query, {
                company: company
            })
            .then(function (data) {
                return data.results;
            });
    };

    $scope.bank_search = function (query, company) {
        return DocumentService.search('Account', query, {
                company: company,
                account_type: 'Bank'
            })
            .then(function (data) {
                return data.results;
            });
    };

    $scope.bank_account_search = function (query, company) {
        return DocumentService.search('Account', query, {
                company: company
            })
            .then(function (data) {
                return data.results;
            });
    };



    $scope.chequeList = {
        selected: [],
        selectable: [
//            {
//                "chequeDate": "2016-05-16T00:00:00.000Z",
//                "bankOfCheque": "jk",
//                "chequeNumber": "1234567",
//                "customerAccount": "Zenith Coaters",
//                "amount": 123698,
//                "id": 3,
//                "createdAt": "2016-05-17T06:11:01.000Z",
//                "updatedAt": "2016-05-19T13:19:19.000Z",
//                "transactionId": null,
//                company: "Arun Logistics"
//            },
//            {
//                "chequeDate": "2016-05-16T00:00:00.000Z",
//                "bankOfCheque": "Bank of baroda ",
//                "chequeNumber": "123456",
//                "customerAccount": "Mansarovar Impex",
//                "amount": 12369900,
//                "id": 1,
//                "createdAt": "2016-05-17T05:37:28.000Z",
//                "updatedAt": "2016-05-17T06:10:01.000Z",
//                "transactionId": null,
//                company: "Mosaic Enterprises Ltd."
//            },
//            {
//                "chequeDate": "2016-05-16T00:00:00.000Z",
//                "bankOfCheque": "Dena Bank",
//                "chequeNumber": "1234567",
//                "customerAccount": "Aarti Steels",
//                "amount": 123698,
//                "id": 3,
//                "createdAt": "2016-05-17T06:11:01.000Z",
//                "updatedAt": "2016-05-19T13:19:19.000Z",
//                "transactionId": null,
//                company: "Arun Logistics"
//            },
//            {
//                "chequeDate": "2016-05-16T00:00:00.000Z",
//                "bankOfCheque": "State Bank Of India ",
//                "chequeNumber": "123456",
//                "customerAccount": "Avon Cycles",
//                "amount": 12369900,
//                "id": 1,
//                "createdAt": "2016-05-17T05:37:28.000Z",
//                "updatedAt": "2016-05-17T06:10:01.000Z",
//                "transactionId": null,
//                company: "Mosaic Enterprises Ltd."
//          }
        ],
        others: [],
        postDated: []
    };

    $scope.selectCheque = function (index) {
        var cheque = $scope.chequeList.selectable.splice(index, 1)[0];
        $scope.chequeList.selected.push(cheque);

        if ($scope.chequeList.others.length === 0) {
            var selectable = _.filter($scope.chequeList.selectable, function (o) {
                return o.company == cheque.company;
            });

            var others = _.filter($scope.chequeList.selectable, function (o) {
                return o.company != cheque.company;
            });

            $scope.chequeList.selectable = selectable;
            $scope.chequeList.others = others;
        }
    };

    $scope.unselectCheque = function (index) {
        var cheque = $scope.chequeList.selected.splice(index, 1)[0];
        $scope.chequeList.selectable.push(cheque);

        if ($scope.chequeList.selected.length === 0) {
            var others = $scope.chequeList.others.splice(0, $scope.chequeList.others.length);
            var selectable = $scope.chequeList.selectable.concat(others);
            $scope.chequeList.selectable = selectable;
        }
    };

    $http({
        url: SettingsFactory.getReviewServerBaseUrl() + "/cheque",
        loading: true,
        method: 'GET',
    }).then(function (data) {
        $scope.chequeList.selectable = data.data;
    });




    // Capture & dump file

    function clickChequePic() {
        var options = {
            quality: 75,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: false,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 480,
            targetHeight: 800,
            cameraDirection: Camera.Direction.FRONT,
            saveToPhotoAlbum: false,
            correctOrientation: true
        };
        return $cordovaCamera.getPicture(options).then(
            function (imageURI) {
                var image_name = imageURI.substring(imageURI.lastIndexOf('/') + 1);
                return FileFactory.moveFileFromCameraToExtrenalDir(image_name);
            }).then(
            function (fileInfo) {
                $cordovaCamera.cleanup();
                $scope.chequeImgURI = fileInfo.dir + fileInfo.file
            });
    }
    $scope.choosePhoto = function () {
        var options = {
            quality: 75,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 300,
            targetHeight: 300,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
        };
    };

    function addPayinSlipPhoto() {
        var options = {
            quality: 75,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 300,
            targetHeight: 300,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false

        };

        $cordovaCamera.getPicture(options).then(function (imageData) {
            cq.payslipImages.push("data:image/jpeg;base64," + imageData);
        }, function (err) {
            // An error occured. Show a message to the user
        });
    }
    $scope.removeImage = function (index) {
        cq.payslipImages.splice(index, 1);
    };


    function chequeDataUpload() {
        return $http({
            url: SettingsFactory.getReviewServerBaseUrl() + "/cheque",
            loading: true,
            method: 'POST',
            data: prepareForErp(cq.user_input),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    function chequeDataUpload() {
        return $http({
            url: SettingsFactory.getReviewServerBaseUrl() + "/cheque",
            loading: true,
            method: 'POST',
            data: prepareForErp(cq.user_input),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    function payinSlipData() {
        return $http({
            url: SettingsFactory.getReviewServerBaseUrl() + "/payinslip",
            loading: true,
            method: 'POST',
            data: prepareForErpPayinslip(cq.user_input),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    function prepareForErp(data) {
        // Create a deep copy
        var transformed_data = JSON.parse(JSON.stringify(data));
        transformed_data.customerAccount = transformed_data.customerAccount.value;
        transformed_data.customerName = transformed_data.customerName.value;
        transformed_data.bankAccount = transformed_data.bankAccount.value;
        transformed_data.transaction_date = moment(transformed_data.transaction_date).format("YYYY-MM-DD");
        transformed_data.chequedate = moment(transformed_data.chequedate).format("YYYY-MM-DD");
        return transformed_data;
    }

    function prepareForErpPayinslip(data) {
        // Create a deep copy
        var transformed_data = JSON.parse(JSON.stringify(data));
        transformed_data.date = moment(transformed_data.date).format("YYYY-MM-DD");
        transformed_data.bankAccount = transformed_data.bankAccount.value;
        transformed_data.cheques = $scope.chequeList.selected.map(function (cheque) {
            return cheque.id;
        });
        return transformed_data;
    }

}
