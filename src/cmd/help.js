import chalk from 'chalk';

const menus = {
  main: `
${chalk.greenBright('assetup [command] <options>')}
  ${chalk.blueBright('upload')}      Uploads images. Use '${chalk.yellow('assetup help upload')}' for more details.
  ${chalk.blueBright('config')}      Configure the CLI or display current configuration. Use '${chalk.yellow('assetup help config')}' for more details.
  ${chalk.blueBright('version')}     Shows the version of the CLI or of specific parts. Use '${chalk.yellow('assetup help version')}' for more details.
  ${chalk.blueBright('help')}        Shows the help menu for a command.
`,

  upload: `
${chalk.greenBright('assetup upload <options>')}

This command uploads images. Available options:

  ${chalk.yellow('--input, -i')}    Specifies the directory path containing the images to be uploaded. Default: ${chalk.yellow('input')}
  ${chalk.yellow('--output, -o')}   Specifies the output file path for storing asset information. Default: ${chalk.yellow('output.txt')}
  ${chalk.yellow('--method, -m')}   Selects the upload method. Can be '${chalk.yellow('image')}', '${chalk.yellow('decal')}', or '${chalk.yellow('both')}'. Default: ${chalk.yellow('image')}

Example:
  ${chalk.yellow('assetup upload --input images --output output.txt --method image')}
`,

  config: `
${chalk.greenBright('assetup config <options>')}

This command allows you to configure the CLI or display current configuration values if no options are provided. Available options:

  ${chalk.yellow('--creator, -c, --Creator')}
    Sets the creator type as either '${chalk.yellow('user')}' or '${chalk.yellow('group')}'. Default: ${chalk.yellow('user')}

  ${chalk.yellow('--apiKey, -k, --apikey, --api-key, --key')}
    Sets the API key for authentication. 
    You can generate an API key by following the instructions in the Roblox API documentation: ${chalk.yellow('https://create.roblox.com/docs/reference/cloud/managing-api-keys')}

  ${chalk.yellow('--groupId, --groupid, --group-id, --group')}
    Sets the group ID

  ${chalk.yellow('--userId, --userid, --user-id, --user')}
    Sets the user ID

  ${chalk.yellow('--getAssetIdRetryCount, --get-asset-id-retry-count, --garc')}
    Sets the number of retries for getting the asset ID. Default: ${chalk.yellow('3')}

  ${chalk.yellow('--uploadAssetRetryCount, --upload-asset-retry-count, --uarc')}
    Sets the number of retries for uploading an asset. Default: ${chalk.yellow('3')}

  ${chalk.yellow('--getImageIdRetryCount, --get-image-id-retry-count, --giirc')}
    Sets the number of retries for getting the image ID. Default: ${chalk.yellow('3')}

Example:
  ${chalk.yellow('assetup config --apiKey KEY_HERE')}
`,

  version: `
${chalk.greenBright('assetup version')}
This command shows the version of the CLI.
`,
}

export async function help(args) {
  const subCmd = args._[0] === 'help'
    ? args._[1]
    : args._[0]
  console.log(menus[subCmd] || menus.main)
}
