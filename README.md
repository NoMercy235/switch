## Switch!

The project is trying to face an issue that I (and perhaps others are, too) am struggling with: being too lazy to switch the phone's profile from sound/vibration (when outside) to silent (when at work or sleeping). 

This will be a test for using Ionic (along with Angular) for developing an application for the Android (maybe it works on iOS as well) platform. The application will use the device motion sensors (such as accelerometer or gyroscope), along with some user defined settings (work/home locations, estimated hours when they are outside, estimated hours of sleep and perhaps even geolocation) to decide if the profile should be switched. The default action will be switching from vibration profile to silent profile, but these two might be able to be customized by the user.

In order to access the functionality for switching the profile to `Silent`, `Vibration` or `Normal` I had to write a `Cordova` plugin to wrap around the `Android` exposed `setRingerMode` and `getRingerMode` methods. The plugin can be found here:

https://github.com/NoMercy235/cordova-plugin-ringermode

### Deployment steps:

Run locally: 
```bash
$ cd /project/path
$ npm install
$ ionic serve
```

To add a platform:

```bash
$ ionic cordova platform add android/ios
$ ionic cordova run android/ios
```

To generate the resource files run:

```bash
ionic cordova resources android
ionic cordova resources android --splash
```

To generate the .apk file run:

```bash
$ ionic cordova build android
```
Add  `--release `  flag for the release version.


