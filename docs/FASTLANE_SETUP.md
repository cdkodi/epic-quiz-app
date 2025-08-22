# Fastlane Setup Guide - Epic Quiz App

Complete guide for setting up Fastlane to automate iOS build, testing, and App Store submission processes for the Epic Quiz App.

## Table of Contents

1. [Overview](#overview)
2. [Installation](#installation)
3. [Initial Setup](#initial-setup)
4. [Configuration Files](#configuration-files)
5. [Lane Definitions](#lane-definitions)
6. [Code Signing with Match](#code-signing-with-match)
7. [App Store Connect Integration](#app-store-connect-integration)
8. [Automation Workflows](#automation-workflows)
9. [Troubleshooting](#troubleshooting)

## Overview

Fastlane automates tedious tasks for iOS and Android development, including:
- **Building and signing** apps
- **Running tests** and generating reports
- **Managing certificates** and provisioning profiles
- **Uploading to App Store Connect**
- **Submitting for review** automatically
- **Generating screenshots** for App Store

### Benefits for Epic Quiz App
- **Consistent builds** across team members
- **Automated testing** before submission
- **Streamlined deployment** to App Store
- **Reduced human error** in release process
- **Cultural content validation** workflow integration

## Installation

### Prerequisites
```bash
# macOS with Xcode installed
xcode-select --install

# Ruby 2.6+ (comes with macOS)
ruby --version

# Bundler for dependency management
sudo gem install bundler
```

### Install Fastlane
```bash
# Option 1: Using Bundler (Recommended)
cd /path/to/EpicQuizApp
echo "gem 'fastlane'" > Gemfile
bundle install

# Option 2: Using Homebrew
brew install fastlane

# Option 3: Using RubyGems
sudo gem install fastlane
```

### Verify Installation
```bash
fastlane --version
# Should output: fastlane 2.x.x
```

## Initial Setup

### Initialize Fastlane
```bash
cd EpicQuizApp
fastlane init

# Select option 4: "Manual setup"
# This creates the basic fastlane directory structure
```

### Project Structure After Setup
```
EpicQuizApp/
├── fastlane/
│   ├── Appfile              # App metadata and credentials
│   ├── Fastfile             # Lane definitions
│   ├── Deliverfile          # App Store metadata
│   ├── Matchfile            # Code signing configuration
│   ├── Snapfile             # Screenshot configuration
│   └── Pluginfile           # Fastlane plugins
├── Gemfile                  # Ruby dependencies
└── Gemfile.lock            # Locked dependency versions
```

## Configuration Files

### 1. Appfile
```ruby
# fastlane/Appfile

# Apple ID for App Store Connect
apple_id("your-apple-id@email.com")

# Bundle identifier
app_identifier("com.yourcompany.epicquizapp")

# Apple Developer Team ID
team_id("XXXXXXXXXX")

# App Store Connect Team ID (if different)
itc_team_id("XXXXXXXXXX")

# For different environments
for_platform :ios do
  # iTunes Connect Team ID (if applicable)
  itc_team_id("XXXXXXXXXX")
  
  # Team name (alternative to team_id)
  # team_name("Your Company Name")
end
```

### 2. Deliverfile
```ruby
# fastlane/Deliverfile

# App metadata for App Store Connect
app_identifier("com.yourcompany.epicquizapp")
username("your-apple-id@email.com")

# App Store metadata
app_name("Epic Quiz App")
subtitle("Classical Literature Learning")
description("
Discover the timeless wisdom of classical epics through interactive quizzes. 
Start your journey with the Ramayana and explore the rich cultural heritage 
of ancient literature.

Features:
• Comprehensive quiz system covering all Kandas
• Detailed explanations with cultural context
• Progress tracking and achievements
• Offline learning capability
• Respectful treatment of cultural content

Perfect for students, educators, and anyone interested in classical literature 
and cultural studies.
")

keywords("education, literature, ramayana, quiz, culture, mythology, learning")

# Pricing and availability
price_tier(0) # Free app

# Age rating
content_rating({
  "CARTOON_FANTASY_VIOLENCE" => 0,
  "REALISTIC_VIOLENCE" => 0,
  "SEXUAL_CONTENT_OR_NUDITY" => 0,
  "PROFANITY_OR_CRUDE_HUMOR" => 0,
  "ALCOHOL_TOBACCO_OR_DRUG_USE_OR_REFERENCES" => 0,
  "MATURE_OR_SUGGESTIVE_THEMES" => 0,
  "HORROR_OR_FEAR_THEMES" => 0,
  "MEDICAL_OR_TREATMENT_INFORMATION" => 0,
  "GAMBLING_OR_CONTESTS" => 0,
  "UNRESTRICTED_WEB_ACCESS" => 0,
  "GAMBLING_AND_CONTESTS" => 0
})

# App Store categories
primary_category("Education")
secondary_category("Games")

# Screenshots directory
screenshots_path("./fastlane/screenshots")

# App icon
app_icon("./fastlane/metadata/app_icon.png")

# Release notes
release_notes("
Initial release of Epic Quiz App!

✨ Features:
• Interactive quizzes on the Ramayana
• Cultural context and detailed explanations
• Progress tracking across all Kandas
• Offline learning capability
• Beautiful, respectful user interface

🙏 Cultural Sensitivity:
This app was developed with deep respect for Hindu traditions and culture, 
with content reviewed by cultural experts and scholars.

Start your journey through classical literature today!
")

# Automatic release after approval
automatic_release(false) # Manual release for more control

# Skip uploading metadata if not changed
skip_metadata(false)

# Skip uploading screenshots if not changed
skip_screenshots(false)

# Submit for review automatically
submit_for_review(false) # Manual submission initially

# Review information
app_review_information({
  first_name: "Epic Quiz",
  last_name: "Support Team",
  phone_number: "+1-555-123-4567",
  email_address: "support@epicquizapp.com",
  demo_account_name: "", # Not required for our app
  demo_account_password: "", # Not required for our app
  notes: "
Epic Quiz App is an educational application focused on classical literature, 
specifically the Ramayana. The app has been developed with cultural sensitivity 
and reviewed by subject matter experts.

Key points for review:
• Educational content only - no objectionable material
• Cultural content treated with respect and accuracy
• No user-generated content or social features
• Offline-first design with optional online features
• Appropriate for all ages (4+ rating)

The app aims to make classical literature accessible to a global audience 
while maintaining cultural authenticity and respect.
  "
})
```

### 3. Matchfile
```ruby
# fastlane/Matchfile

# Git repository for storing certificates
git_url("https://github.com/yourcompany/epic-quiz-certificates")

# App identifier
app_identifier("com.yourcompany.epicquizapp")

# Apple ID
username("your-apple-id@email.com")

# Team ID
team_id("XXXXXXXXXX")

# Default platform
type("appstore") # Can be: appstore, adhoc, development, enterprise

# Storage mode
storage_mode("git") # Can be: git, google_cloud, s3

# Clone branch
git_branch("main")

# Optional: Git private key path
# git_private_key("/path/to/private/key")

# Skip confirmation for automation
readonly(false)

# Keychain settings
keychain_name("fastlane_tmp_keychain")
keychain_password("temp_password_for_ci")

# Skip docs
skip_docs(false)

# Force for new devices (useful for ad hoc profiles)
force_for_new_devices(false)
```

### 4. Snapfile
```ruby
# fastlane/Snapfile

# Devices to generate screenshots for
devices([
  "iPhone 15 Pro Max",
  "iPhone 15 Pro",
  "iPhone 15",
  "iPhone 14 Pro Max", 
  "iPhone 14 Pro",
  "iPhone 8 Plus",
  "iPad Pro (12.9-inch) (6th generation)",
  "iPad Pro (11-inch) (4th generation)"
])

# Languages to generate screenshots for
languages([
  "en-US",
  "hi", # Hindi for Indian market
  # "es-ES", # Spanish (future)
  # "fr-FR"  # French (future)
])

# Scheme to use for UI tests
scheme("EpicQuizAppUITests")

# Configuration
configuration("Release")

# Test target
test_without_building(false)

# Clear previous screenshots
clear_previous_screenshots(true)

# Override status bar
override_status_bar(true)

# Launch arguments
launch_arguments([
  "-UIAnimationSpeed", "0.1", # Speed up animations
  "-UITestMode", "1"          # Enable test mode
])

# Output directory
output_directory("./fastlane/screenshots")

# Skip open summary
skip_open_summary(false)

# Number of retries for flaky tests
number_of_retries(3)

# Concurrent simulators
concurrent_simulators(true)
```

## Lane Definitions

### Main Fastfile
```ruby
# fastlane/Fastfile

# Update fastlane automatically
update_fastlane

default_platform(:ios)

platform :ios do
  
  before_all do
    # Ensure we're in the right directory
    ensure_git_status_clean
    
    # Update dependencies
    sh("cd .. && npm install")
    
    # Setup temporary keychain for CI
    setup_ci if ENV["CI"]
  end

  # DEVELOPMENT LANES
  
  desc "Install development certificates and provisioning profiles"
  lane :certificates_dev do
    match(type: "development")
    match(type: "adhoc") # For TestFlight builds
  end

  desc "Run tests"
  lane :test do
    scan(
      scheme: "EpicQuizApp",
      device: "iPhone 15 Pro",
      clean: true,
      code_coverage: true,
      output_directory: "./test_output"
    )
  end

  desc "Build app for testing"
  lane :build_debug do
    certificates_dev
    
    gym(
      scheme: "EpicQuizApp",
      configuration: "Debug",
      clean: true,
      export_method: "development",
      output_directory: "./build",
      output_name: "EpicQuizApp-Debug.ipa"
    )
  end

  # BETA TESTING LANES
  
  desc "Build and upload to TestFlight"
  lane :beta do
    # Get certificates
    match(type: "appstore")
    
    # Increment build number
    increment_build_number(xcodeproj: "ios/EpicQuizApp.xcodeproj")
    
    # Build app
    gym(
      scheme: "EpicQuizApp",
      configuration: "Release",
      clean: true,
      export_method: "app-store",
      output_directory: "./build"
    )
    
    # Upload to TestFlight
    upload_to_testflight(
      skip_waiting_for_build_processing: false,
      skip_submission: true, # Don't auto-submit for external testing
      notify_external_testers: false,
      changelog: "Bug fixes and improvements for Epic Quiz App."
    )
    
    # Notify team
    slack(
      message: "Epic Quiz App Beta uploaded to TestFlight! 🚀",
      channel: "#development",
      username: "Fastlane"
    ) if ENV["SLACK_URL"]
  end

  # PRODUCTION LANES
  
  desc "Build and upload to App Store Connect"
  lane :release do
    # Ensure main branch
    ensure_git_branch(branch: "main")
    
    # Get certificates
    match(type: "appstore")
    
    # Run tests first
    test
    
    # Content validation (custom action)
    validate_cultural_content
    
    # Build app
    gym(
      scheme: "EpicQuizApp",
      configuration: "Release",
      clean: true,
      export_method: "app-store",
      output_directory: "./build"
    )
    
    # Pre-check for common issues
    precheck(
      app_identifier: "com.yourcompany.epicquizapp",
      username: "your-apple-id@email.com"
    )
    
    # Upload to App Store Connect
    deliver(
      force: true,
      submit_for_review: false, # Manual submission initially
      automatic_release: false,
      skip_screenshots: false,
      skip_metadata: false
    )
    
    # Tag the release
    add_git_tag(
      tag: "v#{get_version_number(xcodeproj: 'ios/EpicQuizApp.xcodeproj')}"
    )
    
    # Push tag
    push_git_tags
    
    # Notify team
    slack(
      message: "Epic Quiz App uploaded to App Store Connect! Ready for review. 📱",
      channel: "#releases",
      username: "Fastlane"
    ) if ENV["SLACK_URL"]
  end

  desc "Submit for App Store review"
  lane :submit_review do
    deliver(
      submit_for_review: true,
      automatic_release: false,
      submission_information: {
        add_id_info_limits_tracking: true,
        add_id_info_serves_ads: false,
        add_id_info_tracks_action: false,
        add_id_info_tracks_install: false,
        add_id_info_uses_idfa: false,
        content_rights_has_rights: true,
        content_rights_contains_third_party_content: false,
        export_compliance_platform: "ios",
        export_compliance_compliance_required: false,
        export_compliance_encryption_updated: false,
        export_compliance_app_type: nil,
        export_compliance_uses_encryption: false,
        export_compliance_is_exempt: false,
        export_compliance_contains_third_party_cryptography: false,
        export_compliance_contains_proprietary_cryptography: false,
        export_compliance_available_on_french_store: false
      }
    )
  end

  # SCREENSHOT GENERATION
  
  desc "Generate screenshots for App Store"
  lane :screenshots do
    # Build for testing
    build_for_testing(
      scheme: "EpicQuizApp",
      configuration: "Release"
    )
    
    # Capture screenshots
    capture_screenshots
    
    # Frame screenshots (optional)
    frameit if File.exist?("./fastlane/screenshots/Framefile")
  end

  # UTILITY LANES
  
  desc "Update app version"
  lane :version_bump do |options|
    type = options[:type] || "patch" # major, minor, patch
    
    increment_version_number(
      xcodeproj: "ios/EpicQuizApp.xcodeproj",
      bump_type: type
    )
    
    increment_build_number(xcodeproj: "ios/EpicQuizApp.xcodeproj")
  end

  desc "Reset certificates and provisioning profiles"
  lane :reset_certificates do
    match_nuke(type: "development")
    match_nuke(type: "appstore")
    certificates_dev
    match(type: "appstore")
  end

  # CUSTOM ACTIONS
  
  desc "Validate cultural content meets our standards"
  private_lane :validate_cultural_content do
    # Custom validation logic for Epic Quiz App
    UI.message("🕉️ Validating cultural content sensitivity...")
    
    # Check if content review files exist
    content_review_file = "../docs/content_review_checklist.json"
    unless File.exist?(content_review_file)
      UI.user_error!("Cultural content review checklist not found!")
    end
    
    # Validate quiz content structure
    quiz_content_dir = "../src/data"
    unless Dir.exist?(quiz_content_dir)
      UI.user_error!("Quiz content directory not found!")
    end
    
    UI.success("✅ Cultural content validation passed")
  end

  # ERROR HANDLING
  
  error do |lane, exception|
    slack(
      message: "Epic Quiz App build failed in lane '#{lane}': #{exception}",
      channel: "#development",
      username: "Fastlane",
      success: false
    ) if ENV["SLACK_URL"]
  end

  after_all do |lane|
    # Clean up temporary files
    clean_build_artifacts
    
    # Notify success
    UI.success("✅ Lane '#{lane}' completed successfully!")
  end
end

# ANDROID PLATFORM (Future)
# platform :android do
#   # Android-specific lanes
# end
```

## Code Signing with Match

### Initial Match Setup
```bash
# Create private repository for certificates
# (Do this on GitHub/GitLab)
git clone https://github.com/yourcompany/epic-quiz-certificates.git
cd epic-quiz-certificates
git checkout -b main
echo "# Epic Quiz App Certificates" > README.md
git add . && git commit -m "Initial commit"
git push origin main

# Initialize match
cd ../EpicQuizApp
fastlane match init

# Generate new certificates
fastlane match appstore
fastlane match development
```

### Match Usage
```bash
# For development
fastlane match development

# For App Store
fastlane match appstore

# Readonly mode (for CI)
fastlane match appstore --readonly

# Force new certificates
fastlane match appstore --force

# Nuke all certificates (careful!)
fastlane match nuke appstore
```

## App Store Connect Integration

### API Key Setup
```bash
# Download API key from App Store Connect
# Store in fastlane/AuthKey_XXXXXXXXXX.p8

# Add to Appfile
api_key_path("./fastlane/AuthKey_XXXXXXXXXX.p8")
api_key({
  key_id: "XXXXXXXXXX",
  issuer_id: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  key_filepath: "./fastlane/AuthKey_XXXXXXXXXX.p8"
})
```

### Environment Variables
```bash
# Add to .env or CI/CD system
export FASTLANE_APPLE_ID="your-apple-id@email.com"
export FASTLANE_TEAM_ID="XXXXXXXXXX"
export FASTLANE_ITC_TEAM_ID="XXXXXXXXXX"
export MATCH_PASSWORD="your-match-password"
export SLACK_URL="https://hooks.slack.com/services/..."

# For CI/CD
export FASTLANE_SKIP_UPDATE_CHECK="1"
export FASTLANE_HIDE_CHANGELOG="1"
export CI="true"
```

## Automation Workflows

### GitHub Actions Integration
```yaml
# .github/workflows/ios.yml
name: iOS Build and Deploy

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: macos-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm install
    
    - name: Setup Ruby
      uses: ruby/setup-ruby@v1
      with:
        ruby-version: '3.0'
        bundler-cache: true
    
    - name: Run tests
      run: bundle exec fastlane test
    
  deploy:
    runs-on: macos-latest
    needs: test
    if: github.ref == 'refs/heads/main'
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm install
    
    - name: Setup Ruby
      uses: ruby/setup-ruby@v1
      with:
        ruby-version: '3.0'
        bundler-cache: true
    
    - name: Deploy to TestFlight
      run: bundle exec fastlane beta
      env:
        MATCH_PASSWORD: ${{ secrets.MATCH_PASSWORD }}
        FASTLANE_APPLE_ID: ${{ secrets.FASTLANE_APPLE_ID }}
        FASTLANE_TEAM_ID: ${{ secrets.FASTLANE_TEAM_ID }}
        SLACK_URL: ${{ secrets.SLACK_URL }}
```

### Local Development Workflow
```bash
# Daily development workflow
fastlane test                    # Run tests
fastlane build_debug            # Build for testing
fastlane beta                   # Upload to TestFlight

# Release workflow  
fastlane version_bump           # Bump version
fastlane screenshots           # Generate screenshots
fastlane release               # Build and upload
fastlane submit_review         # Submit for review
```

## Troubleshooting

### Common Issues and Solutions

#### Code Signing Issues
```bash
# Error: "No matching provisioning profiles found"
fastlane match appstore --force

# Error: "Certificate not found"
fastlane match nuke appstore
fastlane match appstore

# Error: "Multiple teams found"
# Add team_id to Appfile
```

#### Build Issues
```bash
# Error: "Xcode project not found"
# Ensure you're in the correct directory
cd EpicQuizApp

# Error: "Scheme not found"
# Check scheme name in Xcode
fastlane gym --scheme "YourActualSchemeName"

# Error: "Archive failed"
# Clean build folder
fastlane gym --clean
```

#### App Store Connect Issues
```bash
# Error: "Invalid API key"
# Verify API key file exists and has correct permissions
ls -la fastlane/AuthKey_*.p8

# Error: "App not found"
# Verify app identifier in Appfile
grep app_identifier fastlane/Appfile

# Error: "Metadata upload failed"
# Check metadata in Deliverfile
fastlane deliver --skip_binary_upload
```

### Debug Commands
```bash
# Verbose output
fastlane beta --verbose

# Debug mode
fastlane beta --debug

# Capture logs
fastlane beta 2>&1 | tee fastlane.log
```

### Support Resources
- [Fastlane Documentation](https://docs.fastlane.tools/)
- [Fastlane GitHub Issues](https://github.com/fastlane/fastlane/issues)
- [Apple Developer Forums](https://developer.apple.com/forums/)
- [React Native Community](https://reactnative.dev/community/overview)

---

**Last Updated**: [Current Date]
**Version**: 1.0

> **Note**: Always test fastlane configurations with development builds before using for production releases.