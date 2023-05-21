import Conf from 'conf';
import colors from 'colors/safe';

export const configKey = 'imgup-cli';

colors.setTheme({
    title: 'cyan',
    key: 'yellow',
    value: 'green',
    saving: 'blue',
    error: 'red'
});

export async function configure(args) {
  const config = new Conf();
  let currentConfigObject = config.get(configKey);
  currentConfigObject = currentConfigObject || {};

  if (Object.keys(args).length === 1) {
    console.log(colors.title('Current configuration:'));  
    console.log(colors.key('Creator:') + ' ' + colors.value(currentConfigObject.creator)); 
    console.log(colors.key('API Key:') + ' ' + colors.value(currentConfigObject.apiKey));  
    console.log(colors.key('Group ID:') + ' ' + colors.value(currentConfigObject.groupId));
    console.log(colors.key('User ID:') + ' ' + colors.value(currentConfigObject.userId));
    console.log(colors.key('Get Asset ID Retry Count:') + ' ' + colors.value(currentConfigObject.getAssetIdRetryCount));
    console.log(colors.key('Upload Asset Retry Count:') + ' ' + colors.value(currentConfigObject.uploadAssetRetryCount));
    console.log(colors.key('Get Image ID Retry Count:') + ' ' + colors.value(currentConfigObject.getImageIdRetryCount));

    return;
  }

  let creator = args.creator || args.Creator || args.c;
  if (!creator) {
    creator = currentConfigObject.creator;
  }

  if (!['user', 'group'].includes(creator)) {
    throw new Error(colors.error('Invalid creator in the configuration'));
  }

  let apiKey = args.apiKey || args.apikey || args['api-key'] || args.key || args.k;
  if (!apiKey) {
    apiKey = currentConfigObject.apiKey;
  }

  let groupId = args.groupId || args.groupid || args['group-id'] || args.group;
  if (!groupId) {
    groupId = currentConfigObject.groupId;
  }

  let userId = args.userId || args.userid || args['user-id'] || args.user;
  if (!userId) {
    userId = currentConfigObject.userId;
  }

  let getAssetIdRetryCount = args.getAssetIdRetryCount || args['get-asset-id-retry-count'];
  if (!getAssetIdRetryCount) {
    getAssetIdRetryCount = currentConfigObject.getAssetIdRetryCount;
  }

  let uploadAssetRetryCount = args.uploadAssetRetryCount || args['upload-asset-retry-count'];
  if (!uploadAssetRetryCount) {
    uploadAssetRetryCount = currentConfigObject.uploadAssetRetryCount;
  }

  let getImageIdRetryCount = args.getImageIdRetryCount || args['get-image-id-retry-count'];
  if (!getImageIdRetryCount) {
    getImageIdRetryCount = currentConfigObject.getImageIdRetryCount;
  }

  console.log(colors.saving('Saving configuration...'));

  config.set(configKey, {
    creator: creator,
    apiKey: apiKey,
    groupId: groupId,
    userId: userId,
    getAssetIdRetryCount: getAssetIdRetryCount,
    uploadAssetRetryCount: uploadAssetRetryCount,
    getImageIdRetryCount: getImageIdRetryCount,
  });

  console.log(colors.saving('Configuration saved.'));
}
