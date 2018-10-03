/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <Fabric/Fabric.h>
#import <CoreSpotlight/CoreSpotlight.h>
#import <Crashlytics/Crashlytics.h>
#import "RNSplashScreen.h"
#import "RNFIRMessaging.h"

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  NSURL *jsCodeLocation;

  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];

  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"golden"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  [Fabric with:@[[Crashlytics class]]];
  [RNSplashScreen show];
  [FIRApp configure];
  [[UNUserNotificationCenter currentNotificationCenter] setDelegate:self];
  [self spotlightSearch];
  application.applicationIconBadgeNumber = 0;
  return YES;
}

-(void)spotlightSearch{

  CSSearchableItemAttributeSet *searchableItemAttributeSet = [[CSSearchableItemAttributeSet alloc] initWithItemContentType:@"io.goldenwallet"];
  searchableItemAttributeSet.contentDescription = @"Golden";
  searchableItemAttributeSet.title = @"Golden";
  searchableItemAttributeSet.displayName = @"Golden";
  searchableItemAttributeSet.keywords = @[@"wallet", @"ethereum", @"golden wallet ", @"bitcoin", @"golden", @"crypto"];
  //    UIImage *thumbnail = [UIImage imageNamed:@"starwars_icon"];
  //    searchableItemAttributeSet.thumbnailData = UIImageJPEGRepresentation(thumbnail, 0.7);

  CSSearchableItem *searchableItem = [[CSSearchableItem alloc] initWithUniqueIdentifier:@"io.goldenwallet" domainIdentifier:@"io.goldenwallet" attributeSet:searchableItemAttributeSet];

  CSSearchableIndex *defaultSearchableIndex = [CSSearchableIndex defaultSearchableIndex];
  [defaultSearchableIndex indexSearchableItems:@[searchableItem] completionHandler:^(NSError * _Nullable error) {
  }];
}


- (void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions))completionHandler
{
  [RNFIRMessaging willPresentNotification:notification withCompletionHandler:completionHandler];
}

#if defined(__IPHONE_11_0)
- (void)userNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void (^)(void))completionHandler
{
  UIApplication.sharedApplication.applicationIconBadgeNumber = 0;
  [RNFIRMessaging didReceiveNotificationResponse:response withCompletionHandler:completionHandler];
}
#else
- (void)userNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void(^)())completionHandler
{
  UIApplication.sharedApplication.applicationIconBadgeNumber = 0;
  [RNFIRMessaging didReceiveNotificationResponse:response withCompletionHandler:completionHandler];
}
#endif

//You can skip this method if you don't want to use local notification
-(void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification {
  [RNFIRMessaging didReceiveLocalNotification:notification];
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(nonnull NSDictionary *)userInfo fetchCompletionHandler:(nonnull void (^)(UIBackgroundFetchResult))completionHandler{
  [RNFIRMessaging didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
}
@end
