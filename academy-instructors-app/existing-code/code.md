eas build --profile development --platform android

eas build --profile development --platform ios

eas build --profile preview --platform all

eas build -p android --profile preview

eas build --platform ios
eas build --platform android

eas submit -p ios --latest
eas submit -p android --latest

eas update