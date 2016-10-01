//
//  AppDelegate+camscanner.m
//  Tafs
//
//  Created by Juan Jose Guevara on 5/2/16.
//
//

#import <Foundation/Foundation.h>
#import "AppDelegate+camscanner.h"
#import "CordovaCamscanner.h"
#import <CamScannerOpenAPIFramework/CamScannerOpenAPIController.h>

@implementation AppDelegate(camscanner)

- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(NSString *)sourceApplication annotation:(id)annotation
{
   if ([CamScannerOpenAPIController isSourceApplicationCamScanner:sourceApplication])
   {
       NSDictionary *userInfo = [CamScannerOpenAPIController userInfoFromURL:url andSourceApplication:sourceApplication];
       NSData *data = [CamScannerOpenAPIController getJPEGDataFromCamScannerWithUserInfo:userInfo];
       NSString *encodedString = [data base64EncodedStringWithOptions:0];
       NSString *returnCode = [userInfo objectForKey:kReturnCode];
       if (![returnCode isEqualToString:@"6000"])
       {
           UIAlertView *alert;
           if([returnCode isEqualToString:@"5009"])
           {
               alert = [[UIAlertView alloc] initWithTitle:@"Error" message:@"Code: 5009: login is required, please log in on your camscanner app" delegate:nil cancelButtonTitle:@"OK" otherButtonTitles:nil];
               [alert show];
           } 
           else if([returnCode isEqualToString:@"4008"])
           {
               alert = [[UIAlertView alloc] initWithTitle:@"Canceled" message:@"You have canceled the scan" delegate:nil cancelButtonTitle:@"OK" otherButtonTitles:nil];
               [alert show];
           }
           else 
           {
               alert = [[UIAlertView alloc] initWithTitle:@"Error" message:[NSString stringWithFormat:@"Code:%@", returnCode] delegate:nil cancelButtonTitle:@"OK" otherButtonTitles:nil];
               [alert show];
           }
       }
       CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:encodedString];
       [[CordovaCamscannerStaticService instance].plugin.commandDelegate sendPluginResult:pluginResult callbackId:[CordovaCamscannerStaticService instance].command.callbackId];
   }
   return YES;
}

@end
