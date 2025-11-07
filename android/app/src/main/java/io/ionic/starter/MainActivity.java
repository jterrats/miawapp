package io.ionic.starter;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;

import com.acomerclub.plugins.miaw.SFMiawPlugin;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(SFMiawPlugin.class);

        super.onCreate(savedInstanceState);
    }
}
