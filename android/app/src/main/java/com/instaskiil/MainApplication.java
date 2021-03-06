package com.instaskiil;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.imagepicker.ImagePickerPackage;
import org.reactnative.camera.RNCameraPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
// import com.imagepicker.ImagePickerPackage;
// import org.reactnative.camera.RNCameraPackage;
import com.brentvatne.react.ReactVideoPackage;
import com.zmxv.RNSound.RNSoundPackage;
import com.rnim.rn.audio.ReactNativeAudioPackage;
import com.hauvo.compress.RNCompressPackage;
import org.reactnative.camera.RNCameraPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new ImagePickerPackage(),
            new RNCameraPackage(),
            new RNFetchBlobPackage(),
            new SplashScreenReactPackage(),
            // new ImagePickerPackage(),
            new RNCameraPackage(),
            new ReactVideoPackage(),
            new RNSoundPackage(),
            new ReactNativeAudioPackage(),
            new RNCompressPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
