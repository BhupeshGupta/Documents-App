package com.beelphegor.cordovacamscanner;

import android.content.Context;
import android.content.Intent;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;

public class CordovaCamscanner extends CordovaPlugin {
    CallbackContext _callbackContext;

    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        _callbackContext = callbackContext;

        String path = cordova.getActivity().getExternalCacheDir().getAbsolutePath() + '/';

        try{
            if(action.equals("scan")) {
                String srcUri = args.getString(0).replace("file://", "");
                validateInputs(srcUri);
                Context context = this.cordova.getActivity().getApplicationContext();
                Intent intent = new Intent(context, CamscannerActivity.class);
                intent.putExtra("SRC_URI", srcUri);
                intent.putExtra("PATH", path);
                cordova.setActivityResultCallback (this);
                this.cordova.getActivity().startActivityForResult(intent, 2);
                return true;
            }
        }catch (Exception e){
            callbackContext.error(e.getMessage());
            return false;
        }
        return false;
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data){
        if(requestCode == 2){
            if(data.getStringExtra("RESULT").equals("success")) {
                _callbackContext.success(data.getStringExtra("BASE64_RESULT"));
            }
            if(data.getStringExtra("RESULT").equals("error")) {
                _callbackContext.error(data.getStringExtra("ERROR"));
            }
            if(data.getStringExtra("RESULT").equals("cancel")) {
                _callbackContext.error("canceled");
            }
        }
    }

    public void validateInputs(String srcUri) throws InvalidInputException {
        if(srcUri == null || srcUri.isEmpty()){
            throw new InvalidInputException("invalid value for parameter: srcUri");
        }
    }

}

class InvalidInputException extends Exception {
    public InvalidInputException(String message) {
        super(message);
    }
}
