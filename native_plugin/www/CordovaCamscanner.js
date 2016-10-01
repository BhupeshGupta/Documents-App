module.exports = {
  scan: function(srcUri, destPath, successCallback, failureCallback) {
    cordova.exec(successCallback, failureCallback, "CordovaCamscanner", "scan", [srcUri]);
  }
}
