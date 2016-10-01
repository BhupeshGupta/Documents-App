#import "CordovaCamscanner.h"
#import <Cordova/CDVPlugin.h>
#import <CamScannerOpenAPIFramework/CamScannerOpenAPIController.h>
#import <AssetsLibrary/AssetsLibrary.h>
#import "ISBlockActionSheet.h"

@implementation CordovaCamscannerStaticService

@synthesize command, plugin;

static CordovaCamscannerStaticService *instance;

+(CordovaCamscannerStaticService*) instance {
    if(instance == nil){
        instance = [CordovaCamscannerStaticService new];
    }
    return instance;
}

@end

@implementation CordovaCamscanner

UIImage *srcImage;
NSString *appKey;

- (void) scan: (CDVInvokedUrlCommand*)mycommand
{
   NSString *srcUri = [mycommand.arguments objectAtIndex:0];
   appKey = [[NSBundle mainBundle] objectForInfoDictionaryKey:@"CamscannerAppKey"];
   NSURL *asseturl = [NSURL URLWithString:srcUri];

    [CordovaCamscannerStaticService instance].command = mycommand;
    [CordovaCamscannerStaticService instance].plugin = self;
    
   ALAssetsLibraryAssetForURLResultBlock resultblock = ^(ALAsset *myasset)
   {
       ALAssetRepresentation *rep = [myasset defaultRepresentation];
       @autoreleasepool {
           CGImageRef iref = [rep fullScreenImage];
           if (iref) {
               srcImage = [UIImage imageWithCGImage:iref];
               [self executeCamscanner];
           }
       }
   };

   ALAssetsLibraryAccessFailureBlock failureblock  = ^(NSError *myerror)
   {
       UIAlertView *alertView = [[UIAlertView alloc] initWithTitle:nil message:@"Can't get image" delegate:nil cancelButtonTitle:@"OK" otherButtonTitles: nil];
       [alertView show];
   };

    if([srcUri hasPrefix:@"file://"]){
        srcImage = [UIImage imageWithData:[NSData dataWithContentsOfURL:[NSURL URLWithString:srcUri]]];
        [self executeCamscanner];
    }else{
        
        ALAssetsLibrary* assetslibrary = [[ALAssetsLibrary alloc] init];
        [assetslibrary assetForURL:asseturl resultBlock:resultblock failureBlock:failureblock];
    }

}
- (void) executeCamscanner{
    NSArray *applications = [CamScannerOpenAPIController availableApplications];
    NSMutableArray *appNames = [[NSMutableArray alloc] init];
    for (NSString *application in applications)
    {
        NSString *appName = [self appName:application];
        if ([appName length] > 0)
        {
            [appNames addObject:appName];
        }
    }
    
    if ([applications count] > 0)
    {
        @try {
            ISBlockActionSheet *actionSheet = [[ISBlockActionSheet alloc] initWithTitle:@"Choose application" cancelButtonTitle:@"Cancel" cancelBlock:^{
                
            } destructiveButtonTitle:nil destructiveBlock:^{
                
            } otherButtonTitles:appNames otherButtonBlock:^(NSInteger index) {
                [CamScannerOpenAPIController sendImage:srcImage toTargetApplication:[applications objectAtIndex:index] appKey:appKey subAppKey:nil];
            }];
            [actionSheet showInView:self.viewController.view];
        } @catch (NSException *exception) {
            UIAlertView *alertView = [[UIAlertView alloc] initWithTitle:nil message:@"Can't get image" delegate:nil cancelButtonTitle:@"OK" otherButtonTitles: nil];
            [alertView show];
        }
    }
    else
    {
        UIAlertView *alertView = [[UIAlertView alloc] initWithTitle:nil message:@"You should install CamScanner First" delegate:nil cancelButtonTitle:@"OK" otherButtonTitles: nil];
        [alertView show];
    }
    
}

- (NSString *) appName:(NSString *) inputName
{
    if ([inputName isEqualToString:CamScannerLite])
    {
        return @"CamScanner Free";
    }
    if ([inputName isEqualToString:CamScanner])
    {
        return @"CamScanner+";
    }
    if ([inputName isEqualToString:CamScannerPro])
    {
        return @"CamScanner Pro";
    }
    if ([inputName isEqualToString:CamScannerHD])
    {
        return @"CamScanner HD";
    }
    if ([inputName isEqualToString:CamScannerHDPro])
    {
        return @"CamScanner HD Pro";
    }
    return nil;
}

@end
