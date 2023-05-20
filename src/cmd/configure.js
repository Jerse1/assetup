import Conf from 'conf';
export const configKey = 'imgup-cli';

export async function configure(args) {
  const config = new Conf();
  let currentConfigObject = config.get(configKey);
  currentConfigObject = currentConfigObject || {};

  if (Object.keys(args).length === 1) {
    console.log('Current configuration:');  
    console.log('Creator: ' + currentConfigObject.creator); 
    console.log('API Key: ' + currentConfigObject.apiKey);  
    console.log('Group ID: ' + currentConfigObject.groupId);
    console.log('User ID: ' + currentConfigObject.userId);

    return;
  }

  let creator = args.creator || args.Creator || args.c;
  if (!creator) {
    creator = currentConfigObject.creator;
  }

  if (!['user', 'group'].includes(creator)) {
    throw new Error('Invalid creator in the configuration');
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

  console.log('Saving configuration...');

  config.set(configKey, { creator: creator, apiKey: apiKey, groupId: groupId, userId: userId });

  console.log('Configuration saved.');
}