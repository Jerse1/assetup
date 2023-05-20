import Conf from 'conf';
export const configKey = 'imgup-cli';

export async function configure(args) {
  const config = new Conf();
  let currentConfigObject = config.get(configKey);
  currentConfigObject = currentConfigObject || {};

  let creator = args.creator || args.Creator || args.c;
  if (!creator) {
    creator = currentConfigObject.creator;
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

  config.set(configKey, { creator: creator, apiKey: apiKey, groupId: groupId, userId: userId });
}