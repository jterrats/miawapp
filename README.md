# MIAW App - Salesforce In-App Messaging

Mobile application with Salesforce In-App Messaging integration for iOS and Android.

## ⚠️ Disclaimer – Proof of Concept Only

**This project is a POC (proof of concept) and is NOT intended for production use.**

If you plan to use this repository as a base for a production application, be aware that:

- **Security:** The app has development-oriented settings enabled (mixed content HTTP/HTTPS, cleartext traffic) that are **not suitable for production** and should be hardened before any public release.
- **Configuration:** Environment URLs, API endpoints, and other settings are tuned for local development and emulators.
- **Scope:** Features and error handling are minimal; production use would require additional hardening, testing, and security review.

Use at your own risk. No production deployment is supported or recommended.

---

## Prerequisites

- Node.js 18+
- Ionic CLI
- Android Studio (for Android development)
- Xcode 14+ (for iOS development)
- CocoaPods (for iOS)

## Quick Start

```bash
# Install dependencies
npm install

# Setup Salesforce configuration (REQUIRED)
# See SALESFORCE_SETUP.md for detailed instructions
cp android/app/src/main/assets/configFile.json.example android/app/src/main/assets/configFile.json
cp ios/App/App/configFile.json.example ios/App/App/configFile.json
# Edit both files with your Salesforce credentials

# Sync with native platforms
npx cap sync

# Run on Android
npx cap run android

# Run on iOS
npx cap run ios
```

## ⚠️ Important: Salesforce Configuration

This app requires Salesforce credentials. See [SALESFORCE_SETUP.md](./SALESFORCE_SETUP.md) for complete setup instructions.

**Required files** (not tracked in git):
- `android/app/src/main/assets/configFile.json`
- `ios/App/App/configFile.json`

## Project Structure

```
miawapp/
├── src/                          # Angular/Ionic source code
│   ├── app/
│   │   ├── plugins/             # Capacitor plugin definitions
│   │   │   └── miaw.plugins.ts  # Salesforce MIAW plugin interface
│   │   └── services/            # Angular services
│   │       └── miaw-chat.service.ts
├── android/                     # Android native code
│   └── app/src/main/assets/
│       └── configFile.json      # Salesforce config (not tracked)
├── ios/                         # iOS native code
│   └── App/App/
│       └── configFile.json      # Salesforce config (not tracked)
└── capacitor-salesforce-miaw/  # Custom Capacitor plugin (sibling repo)
```

## Features

### Salesforce In-App Messaging (MIAW)

- ✅ Real-time chat with Salesforce agents
- ✅ Agent-initiated conversations
- ✅ File attachments support
- ✅ Chat transcripts
- ✅ Pre-chat fields
- ✅ Native UI on both platforms

### Platforms

#### Android
- Uses Salesforce `Messaging-InApp-UI` SDK
- Full native UI from Salesforce
- Automatic message synchronization

#### iOS
- Uses Salesforce `Messaging-InApp-UI` SDK
- Full native UI from Salesforce
- Automatic message synchronization

## Development

### Running locally

```bash
# Start web server
ionic serve

# Android
npx cap run android

# iOS
npx cap open ios  # Then build/run in Xcode
```

### Debugging

#### Android
```bash
# View logs
npx cap run android --livereload --external
```

#### iOS
- Use Xcode Console
- Safari Web Inspector for WebView debugging

## Plugin Development

The custom Capacitor plugin is in a sibling repository:

```
/dev/
  ├── miawapp/                      # This app
  └── capacitor-salesforce-miaw/    # Custom plugin
```

To modify the plugin, see the plugin repository.

## Troubleshooting

### "SDK not initialized" error

Make sure you have created the `configFile.json` files with valid Salesforce credentials. See [SALESFORCE_SETUP.md](./SALESFORCE_SETUP.md).

### iOS build fails

```bash
cd ios/App
pod deintegrate
pod install
```

### Android build fails

```bash
cd android
./gradlew clean
```

## Documentation

- [SALESFORCE_SETUP.md](./SALESFORCE_SETUP.md) - Salesforce configuration setup
- [SALESFORCE_IOS_SDK_BUG_REPORT.md](./SALESFORCE_IOS_SDK_BUG_REPORT.md) - Known iOS SDK issues

## License

Proprietary - A Comer Club

