'use strict';

receipt_module.controller('MainController', mainController);


function mainController(
    $scope, $state, SettingsFactory, $ionicPopup, $translate, $rootScope,
    $cordovaGeolocation, $timeout, UploadService, AppVersion,
    $localStorage, SessionService
) {

    var vm = this;
    vm.selectedLangage = SettingsFactory.get().language;
    vm.triggerUpload = triggerUpload;
    vm.pendingUploadCount = 'N/a';
    vm.appVersion = AppVersion;
    vm.SessionService = SessionService;

    // Mantain UI state
    vm.uploading = false;

    getNumberOfPendingFilesCount();

    function triggerUpload() {
        vm.uploading = true;
        UploadService.upload();
    }

    function getNumberOfPendingFilesCount() {
        UploadService.count().then(function (count) {
            vm.pendingUploadCount = count;
            if (count == 0) {
                vm.uploading = false;
            }
        });
    }

    $rootScope.$on('uploadService:update', function () {
        getNumberOfPendingFilesCount();
    });

    $scope.open_developer_pane = function () {
        $ionicPopup.prompt({
            title: 'Developer Password',
            template: 'Enter developer password',
            inputType: 'password',
            inputPlaceholder: 'Password'
        }).then(function (res) {
            if (res == '123124')
                $state.go('root.developer');
        });
    };

    $scope.switchLanguage = function (language) {
        console.log("Switching language to " + language);
        $translate.use(language);

        // Save settings
        var settings = SettingsFactory.get();
        settings.language = language;
        SettingsFactory.set(settings);

        vm.selectedLangage = language;
    };

    // Set language pref while loading
    $translate.use(SettingsFactory.get().language);

    $scope.location_lock = 0;

    // Endless loop to get location
    document.addEventListener('deviceready', function () {
        function getDelay() {
            return parseInt(SettingsFactory.get().gpsStartupDelay || 2 * 60 * 1000);
        }

        function getRetryInterval() {
            return parseInt(SettingsFactory.get().gpsGoodsReceiptDelay || 2 * 60 * 1000);
        }

        var myPopup = null;
        var total_wait = 0;

        var get_location = function () {

            var posOptions = {
                timeout: getRetryInterval(),
                enableHighAccuracy: true
            };

            $cordovaGeolocation.getCurrentPosition(posOptions)
                .then(function (position) {
                    console.log(position);
                    $scope.location_lock = 1;
                    console.log("Location Locked");
                    console.log(myPopup);
                    if (myPopup)
                        myPopup.close();
                }, function (err) {
                    CheckGPS.check(function win() {
                            var wait_limit = getDelay();
                            total_wait += posOptions.timeout;
                            var pending_time = wait_limit - total_wait;
                            if (pending_time < 0 && myPopup) {
                                myPopup.close();
                            }

                            $scope.gprTimer = (pending_time / 1000).toString() + ' Sec';

                            $scope.location_lock = 2;
                            get_location();
                            if (!myPopup) {
                                myPopup = $ionicPopup.show({
                                    template: '<p>Wating for location ({{gprTimer}})</p>',
                                    title: 'Wait',
                                    scope: $scope,
                                    buttons: []
                                });
                            }
                        },
                        function fail() {
                            $ionicPopup.show({
                                template: '<p>Enable GPS and restart app to continue.</p>',
                                title: 'Error',
                            });
                        });
                });
        };
//        get_location();
    });

}
