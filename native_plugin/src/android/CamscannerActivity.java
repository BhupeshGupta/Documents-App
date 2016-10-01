package com.beelphegor.cordovacamscanner;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Bitmap;
import android.os.Bundle;
import android.os.Environment;
import android.util.Base64;
import java.io.File;

import com.intsig.csopen.sdk.CSOpenAPI;
import com.intsig.csopen.sdk.CSOpenAPIParam;
import com.intsig.csopen.sdk.CSOpenApiFactory;
import com.intsig.csopen.sdk.CSOpenApiHandler;

import java.io.ByteArrayOutputStream;
import java.text.SimpleDateFormat;

public class CamscannerActivity extends Activity {
    CSOpenAPI api;
    String _scannedFileUri;
    String _destPath;
    String fileName;
    private final int REQ_CODE_CALL_CAMSCANNER = 2;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Intent intent = this.getIntent();
        String srcUri =  intent.getStringExtra("SRC_URI");
        _destPath = intent.getStringExtra("PATH");
        int appResId = this.getResources().getIdentifier("camscanner_app_key", "string", this.getPackageName());
        String appKey = this.getString(appResId);
        api = CSOpenApiFactory.createCSOpenApi(this.getApplicationContext(), appKey, null);
        fileName = new SimpleDateFormat("yyyyMMdd_HHmmss").format(new java.util.Date());
        _scannedFileUri = _destPath + "/" + fileName;
        CSOpenAPIParam openApiParam = new CSOpenAPIParam(
                srcUri,
                _scannedFileUri + ".jpg",
                _scannedFileUri + ".pdf",
                _scannedFileUri + "_org.jpg",
                1.0f);
        boolean res = api.scanImage(this, 2, openApiParam);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
      if(resultCode != RESULT_CANCELED) {
          if(requestCode == REQ_CODE_CALL_CAMSCANNER) {
            api.handleResult(requestCode, resultCode, data, new CSOpenApiHandler() {
                @Override
                public void onSuccess() {
                    Intent databackIntent = new Intent();
                    databackIntent.putExtra("RESULT", "success");

                    File from = new File( _scannedFileUri + ".jpg");
                    File to = new File(_destPath + fileName + ".jpg");
                    from.renameTo(to);
                    databackIntent.putExtra("BASE64_RESULT", _destPath + fileName + ".jpg");
                    setResult(Activity.RESULT_OK, databackIntent);
                    finish();
                }

                @Override
                public void onError(int errorCode) {
                    Intent databackIntent = new Intent();
                    databackIntent.putExtra("RESULT", "error");
                    databackIntent.putExtra("ERROR", "There was an error creating the image. Error Code: " + errorCode);
                    setResult(Activity.RESULT_OK, databackIntent);
                    finish();
                }

                @Override
                public void onCancel() {
                    Intent databackIntent = new Intent();
                    databackIntent.putExtra("RESULT", "cancel");
                    setResult(Activity.RESULT_OK, databackIntent);
                    finish();
                }
            });
          }
      }
      else {
        Intent databackIntent = new Intent();
        databackIntent.putExtra("RESULT", "cancel");
        setResult(Activity.RESULT_OK, databackIntent);
        finish();
      }
    }
}
