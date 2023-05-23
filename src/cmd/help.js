import chalk from 'chalk';

const menus = {
  main: `
${chalk.greenBright('assetup [command] <options>')}
  ${chalk.blueBright('upload')} ............. uploads images. Use '${chalk.italic('assetup upload')} --help' for more details.
  ${chalk.blueBright('config')} ............. configure the CLI or display current configuration. Use '${chalk.italic('assetup config')} --help' for more details.
  ${chalk.blueBright('version')} ............ shows the version of the CLI or of specific parts. Use '${chalk.italic('assetup version')} --help' for more details.
  ${chalk.blueBright('help')} ............... shows help menu for a command.
`,

  upload: `
${chalk.greenBright('assetup upload <options>')}

This command uploads images. Available options:

  --input, -i ........... specifies the directory path containing the images to be uploaded
  --output, -o .......... specifies the output file path for storing asset information
  --method, -m .......... selects the upload method. Can be 'both', 'image', or 'decal'
`,

  config: `
${chalk.greenBright('assetup config <options>')}

This command allows you to configure the CLI or display current configuration values if no options are provided. Available options:

  --creator, -c, --Creator ........... sets the creator type as either 'user' or 'group'
  --apiKey, -k, --apikey, --api-key, --key ............ sets the API key for authentication
  --groupId, --groupid, --group-id, --group ........... sets the group ID
  --userId, --userid, --user-id, --user ............ sets the user ID
  --getAssetIdRetryCount, --get-asset-id-retry-count, --garc .. sets the number of retries for getting the asset ID (default: 3)
  --uploadAssetRetryCount, --upload-asset-retry-count, --uarc . sets the number of retries for uploading an asset (default: 3)
  --getImageIdRetryCount, --get-image-id-retry-count, --giirc .. sets the number of retries for getting the image ID (default: 3)
`,

  version: `
${chalk.greenBright('assetup version <options>')}
This command shows the version of the CLI
`,
}

export async function help(args) {
  const subCmd = args._[0] === 'help'
    ? args._[1]
    : args._[0]
  console.log(menus[subCmd] || menus.main)
}
