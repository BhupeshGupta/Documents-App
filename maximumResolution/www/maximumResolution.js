module.exports = {
    getMaxHeightWidth: function(successCallback, failureCallback) {
        cordova.exec(successCallback, failureCallback, "maximumResolution", "getMaxHeightWidth", []);
    }
}
