angular.module('starter')
    .factory('InvoiceDocumentCaptureService', invoiceDocumentCaptureService);


function invoiceDocumentCaptureService() {
    var documentList = [];
    var defaultDoc = {
        src: 'img/icon-plus.png',
        hasValue: false,
        mandatory: false
    };

    return {
        addDocument: addDocument,
        updateDocument: updateDocument,
        deleteDocument: deleteDocument,
        getDocument: getDocument,
        setList: setList
    };

    function setList(listObject) {
        documentList = listObject;
    }

    function addDocument(document, index) {
        if (!index) index = -1;
        // Copy over to set default values in each document
        var extendedDoc = JSON.parse(JSON.stringify(defaultDoc));
        angular.extend(extendedDoc, document);
        computeProperties(extendedDoc);

        documentList.splice(index, 0, extendedDoc);
        return documentList;
    }

    function updateDocument(document, index) {
        angular.extend(documentList[index], document);
        computeProperties(documentList[index]);
        return documentList[index];
    }

    function deleteDocument(index, force) {
        function del() {
            return documentList.splice(index, 1);
        }

        if (!force) force = false;
        if (getDocument(index).mandatory === true) {
            if (force) return del();
            else updateDocument({
                src: 'img/icon-plus.png',
                hasValue: false
            }, index);
        } else return del();
    }

    function getDocument(index) {
        return documentList[index];
    }

    function computeProperties(document) {
        document.hasValue = document.src && !(document.src == '' || document.src == 'img/icon-plus.png');
    }
}
