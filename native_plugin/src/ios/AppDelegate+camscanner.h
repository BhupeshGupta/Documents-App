//
//  AppDelegate+camscanner.h
//  Tafs
//
//  Created by Juan Jose Guevara on 5/2/16.
//
//

#import "AppDelegate.h"

@interface AppDelegate(camscanner)
- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(NSString *)sourceApplication annotation:(id)annotation;
@end
