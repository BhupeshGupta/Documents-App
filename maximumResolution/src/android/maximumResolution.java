package com.arungas.maximumResolution;

import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CallbackContext;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.List;

import android.hardware.Camera;
import android.hardware.Camera.Size;
import android.hardware.Camera.PictureCallback;
import android.hardware.Camera.ShutterCallback;
import 	java.util.ArrayList;

/**
 * This class echoes a string called from JavaScript.
 */
public class maximumResolution extends CordovaPlugin {

  private Camera camera;
  String resolution = "";
  int largest;

    public boolean execute(String action,  JSONArray args, CallbackContext callbackContext) throws JSONException {
        if (action.equals("getMaxHeightWidth")) {
            camera = Camera.open();
            Camera.Parameters cameraParameters = camera.getParameters();
            List<Camera.Size> listSupportedPictureSizes = cameraParameters.getSupportedPictureSizes();
            List<String> listStrSupportedPictureSizes = new ArrayList<String>();

            for (int i=listSupportedPictureSizes.size() - 1; i >= 0; i--)
            {

            int temp = listSupportedPictureSizes.get(i).height * listSupportedPictureSizes.get(i).width ;
            if (temp > largest && temp < 5039348)
            {
                largest = temp;
                resolution = String.valueOf(listSupportedPictureSizes.get(i).height)
                              + " x "
                                + String.valueOf(listSupportedPictureSizes.get(i).width );
            }
          }
            this.getMaxHeightWidth(resolution, callbackContext);
            return true;
        }
        return false;
    }

    private void getMaxHeightWidth(String resolution, CallbackContext callbackContext) {
        if (true) {
            callbackContext.success(resolution);
        } else {
            callbackContext.error("Height and width cannot be calculated");
        }
    }
}
