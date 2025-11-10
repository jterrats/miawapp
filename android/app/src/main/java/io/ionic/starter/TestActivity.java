package io.ionic.starter;

import android.app.Activity;
import android.os.Bundle;
import android.widget.TextView;
import android.graphics.Color;

public class TestActivity extends Activity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        TextView tv = new TextView(this);
        tv.setText("Hola, soy TestActivity 😺");
        tv.setTextSize(24f);
        tv.setTextColor(Color.WHITE);
        tv.setBackgroundColor(Color.DKGRAY);
        tv.setPadding(50, 200, 50, 50);

        setContentView(tv);
    }
}