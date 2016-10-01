//
//  CamScannerOpenAPIController.h
//  Version 1.1.0
//
//  Created by Felix Liu on 11/19/12.
//  Copyright (c) 2012 IntSig. All rights reserved.
//

#import <Foundation/Foundation.h>

extern NSString * const CamScannerLite;
extern NSString * const CamScanner;
extern NSString * const CamScannerPro;
extern NSString * const CamScannerHD;
extern NSString * const CamScannerHDPro;

extern NSString * const kReturnFileType;
extern NSString * const kReturnCode;
extern NSString * const kFileFormatJPG;
extern NSString * const kFileFormatPDF;

typedef enum
{
    CSOpenAPIFileFormatJPEG,
    CSOpenAPIFileFormatPDF
}CSOpenAPIFileFormat;

typedef enum
{
	CSOpenAPIControllerErrorCodeInvalidSourceImage = 4006,//returned when unable to get the source image
	CSOpenAPIControllerErrorCodeUserCanceled = 4008,//returned when user clickes 'back' button
	CSOpenAPIControllerErrorCodeTimeExpired = 5003,//returned when authorization expires
    CSOpenAPIControllerErrorCodeDeviceCapped = 5005,//returned when the limit of device count is reached
    CSOpenAPIControllerErrorCodeEhanceModeNotSupported = 5006,//returned when the enhance mode user selected is not supported
    CSOpenAPIControllerErrorCodeReachedLimitation = 5007,//returned when the limit of image processing count is reached
    CSOpenAPIControllerErrorCodeUnreachable = 5008,//returned when unable to get the authorization info
    CSOpenAPIControllerErrorCodeMustLogin = 5009,//returned when login is required but the user is not logged in
    CSOpenAPIControllerErrorCodeDeviceIDError = 5010,//returned when device ID is not authorized
    CSOpenAPIControllerErrorCodeAppIDError = 5011,//returned when app bundle ID is not authorized
    CSOpenAPIControllerErrorCodeAppKeyError = 5012,//returned when app key is not authorized
    CSOpenAPIReturnSuccess = 6000
}CSOpenAPIReturnCode;

@interface CamScannerOpenAPIController : NSObject


+ (void) sendImage:(UIImage *)image toTargetApplication :(NSString *)targetApp appKey:(NSString *) appKey subAppKey:(NSString *) subAppKey;

/**
 *  Used to get the return data info from CamScanner
 *
 *  Use key 'kReturnFileType' to get the returned file format, the file format may be jpg, pdf, or both of them(only supported in CamScanner 3.6.2 or later)
 *
 *  Use key 'kReturnCode' to get the error code with the enum type 'CSOpenAPIReturnCode'
 */
+ (NSDictionary *) userInfoFromURL:(NSURL *)url andSourceApplication:(NSString *)sourceApp;

/**
 *  Used to get the image data from CamScanner
 *
 *  @param userInfo the userInfo parameter returned by the method userInfoFromURL andSourceApplication:appKey:
 *
 *  @return Image data of JPEG or PDF file data
 */
+ (NSData *) getJPEGDataFromCamScannerWithUserInfo:(NSDictionary *)userInfo;
+ (NSData *) getPDFDataFromCamScannerWithUserInfo:(NSDictionary *)userInfo;

/**
 *  Used to check whether the sourceApplication is CamScanner
 *
 *  @param sourceApplication The sourceApplication your appDelagete received in the method - (BOOL)application:openURL:sourceApplication:annotation:
 *
 *  @return return YES if the it is returned from CamScanner
 */
+ (BOOL) isSourceApplicationCamScanner:(NSString *) sourceApplication;


/**
 *  Returns all avilable CamScanner App ID that installed in the device
 *
 *  @return All CamScanner app id
 */
+ (NSArray *) availableApplications;

/**
 *  Check whether CamScanner Free is installed in this device
 *
 *  @return YES means CamScanner Free is installed in this device, otherwise, returns NO
 */
+ (BOOL) canOpenCamScannerLite;


/**
 *  Check whether CamScanner+ is installed in this device
 *
 *  @return YES means CamScanner+ is installed in this device, otherwise, returns NO
 */
+ (BOOL) canOpenCamScannerPlus;

/**
 *  Check whether CamScanner Pro is installed in this device
 *
 *  @return YES means CamScanner Pro is installed in this device, otherwise, returns NO
 */
+ (BOOL) canOpenCamScannerPro;

/**
 *  Check whether CamScanner HD is installed in this device
 *
 *  @return YES means CamScanner HD is installed in this device, otherwise, returns NO
 */
+ (BOOL) canOpenCamScannerHD;

/**
 *  Check whether CamScanner HD Pro is installed in this device
 *
 *  @return YES means CamScanner HD Pro is installed in this device, otherwise, returns NO
 */
+ (BOOL) canOpenCamScannerHDPro;

/**
 *  Use to get the framework version
 */
+ (NSString *) versionString;

@end
