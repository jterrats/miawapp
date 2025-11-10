# Salesforce MIAW Configuration Setup

This application requires Salesforce In-App Messaging configuration files.

## Setup Instructions

### 1. Obtain Configuration from Salesforce

1. Log into your Salesforce org
2. Go to **Setup** → **Embedded Service Deployments**
3. Select your deployment (e.g., "SC_AComerClubMobile")
4. Click **Download** to get the configuration file

### 2. Create Configuration Files

The downloaded file will contain these values:
- `Url`: Your Salesforce org URL
- `OrganizationId`: Your Salesforce org ID (starts with "00D")
- `DeveloperName`: Your deployment name

#### For Android:

Copy `android/app/src/main/assets/configFile.json.example` to `configFile.json` and replace with your values:

```bash
cd android/app/src/main/assets/
cp configFile.json.example configFile.json
# Edit configFile.json with your credentials
```

#### For iOS:

Copy `ios/App/App/configFile.json.example` to `configFile.json` and replace with your values:

```bash
cd ios/App/App/
cp configFile.json.example configFile.json
# Edit configFile.json with your credentials
```

### 3. Configuration Format

```json
{
  "Url": "https://your-org--sandbox.sandbox.my.salesforce-scrt.com",
  "OrganizationId": "00DXXXXXXXXXXXXXXXXX",
  "DeveloperName": "Your_Deployment_Name"
}
```

### 4. Security

⚠️ **IMPORTANT**: The `configFile.json` files contain sensitive credentials and are excluded from git.

- ✅ `configFile.json.example` - Tracked in git (template)
- ❌ `configFile.json` - NOT tracked (contains real credentials)

### 5. Team Setup

When a new developer joins:

1. Clone the repository
2. Copy `.example` files to actual config files
3. Ask team lead for Salesforce credentials
4. Update both config files with real values

## Troubleshooting

### "SDK not initialized" error

Make sure:
- ✅ `configFile.json` exists in both Android and iOS folders
- ✅ Values are correct (no placeholder values)
- ✅ JSON format is valid
- ✅ File is in the correct location

### Where to get credentials?

Contact your Salesforce administrator or team lead for:
- Organization URL
- Organization ID
- Deployment Name

