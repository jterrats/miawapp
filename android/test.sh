ARR="~/.gradle/caches/modules-2/files-2.1/com.salesforce.service/messaging-inapp-ui/2.10.1/44cfe82d57ab2147eec408d12713d90d10847cdf/messaging-inapp-ui-1.10.1.aar"

jar tf "$AAR" | grep -E 'com/salesforce/android/smi/(core|ui)/' | sed 's!/!.!g;s!.class$!!' | sort -u | head -n 50
