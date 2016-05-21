angular.module('starter')
    .factory('FileFactory', fileFactory);


function fileFactory($q, $cordovaFile) {

    return {
        moveFileFromCameraToExtrenalDir: moveFileFromCameraToExtrenalDir
    };

    function moveFileFromCameraToExtrenalDir(fileName) {
        return $cordovaFile.moveFile(
            cordova.file.externalCacheDirectory,
            fileName,
            cordova.file.dataDirectory
        ).then(function () {
            return {
                dir: cordova.file.dataDirectory,
                file: fileName
            };
        });
    }
}



angular.module('starter')
    .factory('FileDataService', fileDataService);

function fileDataService($http, SettingsFactory, $cordovaFile) {
    return {
        uploadFileFromDisk: uploadFileFromDisk,
        uploadFile: uploadFile,
        dataURItoBlob: dataURItoBlob,
        writeToFile: writeToFile
    };

    function uploadFileFromDisk(file, requestId, tags, datauriformat, opts) {
        return $cordovaFile
            .readAsDataURL(file.dir, file.file).then(function (file_data) {
                var file_type;
                if (datauriformat) {
                    file_type = file_data.split(',')[0].split(';')[0].split(':')[1];
                    file_data = dataURItoBlob(file_data);
                }
                return uploadFile({
                    data: file_data,
                    name: 'file',
                    type: file_type === undefined ? '' : file_type
                }, requestId, tags, opts);
            });
    }

    function uploadFile(file, requestId, tags, opts) {
        var opts = opts || {};

        if (!opts.server || opts.server === 'review')
            return uploadToReviewServer(file, requestId, tags);
        else if (opts.server && opts.server === 'erp')
            return uploadToErp(file, requestId, tags, opts);
    }

    function dataURItoBlob(dataURI, imgType) {
        var isSemicolonExist = (dataURI.indexOf(',') >= 0) ? true : false;
        var binary = [];
        if (isSemicolonExist)
            binary = atob(dataURI.split(',')[1]);
        else
            binary = atob(dataURI);
        var array = [];
        for (var i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
        }
        var blob = new Blob([new Uint8Array(array)], {
            type: imgType
        });
        return blob;
    }

    function writeToFile(file, data) {
        $cordovaFile.writeFile(file.dir, file.name, data, true);
    }

    function uploadToReviewServer(file, requestId, tags) {
        // Preserve Order, Node Skipper Plugin expects add feilds before file data
        var fd = new FormData();
        fd.append('requestId', requestId);
        fd.append('tags', JSON.stringify(tags));
        fd.append('file', new Blob([file.data], {
            type: file.type
        }), file.name);

        var uploadUrl = SettingsFactory.getReviewServerBaseUrl() +
            '/files/uploadmultipart/';

        return $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {
                'Content-Type': undefined
            }
        }).then(function (res) {
            console.log(JSON.stringify(res.data));
        });
    }

    function uploadToErp(file, requestId, tags, opts) {
        //doctype: doctype,a
        //docname: voucher_id,
        //file_field: type,
        //filename: filename

        var fd = new FormData();
        var params = $.extend(opts, {
            from_form: '1',
            client: 'app',
            cmd: 'uploadfile',
            _type: 'POST'
        }, {
            filedata: file.data
        });

        for (var key in params) {
            fd.append(key, params[key]);
        }

        return $http.post(SettingsFactory.getERPServerBaseUrl(), fd, {
            transformRequest: angular.identity,
            headers: {
                'Content-Type': undefined
            }
        }).then(function (res) {
            console.log(JSON.stringify(res.data));
        });

        //        return $http.post(SettingsFactory.getERPServerBaseUrl(), $.param(request));

    }

}
