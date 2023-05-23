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

  const arg_len = Object.keys(args).length;

  let creator = args.creator || args.Creator || args.c || currentConfigObject.creator;
  if (!['user', 'group'].includes(creator) && arg_len > 1) {
    throw new Error(colors.error('Invalid creator in the configuration'));
  }

  let apiKey = args.apiKey || args.apikey || args['api-key'] || args.key || args.k || currentConfigObject.apiKey;
  let groupId = args.groupId || args.groupid || args['group-id'] || args.group || currentConfigObject.groupId;
  let userId = args.userId || args.userid || args['user-id'] || args.user || currentConfigObject.userId;
  let getAssetIdRetryCount = args.getAssetIdRetryCount 
                          || args['get-asset-id-retry-count'] 
                          || args.garc  // shorthand key
                          || currentConfigObject.getAssetIdRetryCount 
                          || 3;

let uploadAssetRetryCount = args.uploadAssetRetryCount 
                           || args['upload-asset-retry-count']
                           || args.uarc  // shorthand key
                           || currentConfigObject.uploadAssetRetryCount 
                           || 3;

let getImageIdRetryCount = args.getImageIdRetryCount 
                          || args['get-image-id-retry-count']
                          || args.giirc  // shorthand key
                          || currentConfigObject.getImageIdRetryCount 
                          || 3;
                          
  const updatedConfig = {
    ...currentConfigObject,
    creator: creator,
    apiKey: apiKey,
    groupId: groupId,
    userId: userId,
    getAssetIdRetryCount: getAssetIdRetryCount,
    uploadAssetRetryCount: uploadAssetRetryCount,
    getImageIdRetryCount: getImageIdRetryCount,
  };

  if (JSON.stringify(currentConfigObject) !== JSON.stringify(updatedConfig)) {
    console.log(colors.saving('Saving configuration...'));
    config.set(configKey, updatedConfig);
    console.log(colors.saving('Configuration saved.'));
  } else {
    console.log(colors.saving('No changes made to the configuration.'));
  }

  if (arg_len === 1) {
    console.log(colors.title('Current configuration:'));
    console.log(colors.key('Creator:') + ' ' + colors.value(updatedConfig.creator));
    console.log(colors.key('API Key:') + ' ' + colors.value(updatedConfig.apiKey));
    console.log(colors.key('Group ID:') + ' ' + colors.value(updatedConfig.groupId));
    console.log(colors.key('User ID:') + ' ' + colors.value(updatedConfig.userId));
    console.log(colors.key('Get Asset ID Retry Count:') + ' ' + colors.value(updatedConfig.getAssetIdRetryCount));
    console.log(colors.key('Upload Asset Retry Count:') + ' ' + colors.value(updatedConfig.uploadAssetRetryCount));
    console.log(colors.key('Get Image ID Retry Count:') + ' ' + colors.value(updatedConfig.getImageIdRetryCount));
  }
}


