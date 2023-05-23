# Welcome to assetup 👋

> "A robust Asset Uploader CLI for Roblox, written in JavaScript."

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Prerequisites](#prerequisites)
4. [Installation](#installation)
5. [Usage](#usage)
6. [Configuration](#configuration)
7. [Contributing](#contributing)
8. [License](#license)
9. [Support](#show-your-support)
10. [Authors](#author)

## Overview

AssetUp is a robust command-line interface program designed specifically for Roblox, written in JavaScript. The primary purpose of this tool is to enable bulk uploading of assets onto Roblox, using nothing but an open cloud key. Currently, AssetUp supports only image uploads, but future iterations will extend this functionality to accommodate a multitude of asset types.

## Features

- **Command-line interface:** Easy-to-use command-line interface that is compatible with most operating systems.
- **Multi-format support:** Supports a wide range of asset formats.
- **Customizable:** You can configure the tool according to your preferences and requirements.

## Prerequisites

Before installing `assetup`, make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/en/)
- [npm](https://www.npmjs.com/)

## Installation

To install `assetup`, simply run the following command:

```bash
npm install assetup -g
```

This command installs `assetup` globally on your machine, allowing you to run it from any location. Alternatively, you can use `npx` if you don't want to install it globally.

## Usage

**Upload Images**:

Use the `upload` command to upload images.

```bash
    assetup upload [options]
```
This command uploads images to Roblox from a specified directory and provides you with asset IDs. Available options allow you to customize the input and output directories, and the upload method.

Options:

- `--i, --input <path>`: Specifies the directory path containing the PNG image files to be uploaded (default: ./input)
- `--o, --output <file>`: Specifies the output file path for storing asset information (default: ./output.txt)
- `--m, --method <value>`: Selects the upload method: 'both', 'image', or 'decal' (default: 'both')

By default, the script will upload PNG image files from the ./input directory, generate an output file ./output.txt, and use the 'both' method to retrieve both asset IDs and image IDs. You can customize these settings according to your needs.

Example usage:

```bash
    assetup upload --i ./assets --o ./results.json --m image
```

**Help**:

Use the `help` command to view the help menu.

```bash
    assetup help [command]
```

This command provides information about the available commands and their options. If you use it with a specific command, it gives you detailed information about that command. If no command is provided, it displays the general help menu.

**Version**:

Use the `version` command to display the version information.

```bash
    assetup version [options]
```

This command shows the version of the CLI.

## Configuration

assetup uses a configuration file to store the necessary API key and other options. Before running the script, you need to set up the configuration by executing the following command:

```bash
    assetup config --creator [user/group] --apiKey [apiKey] --groupId [groupId] --userId [userId] --getAssetIdRetryCount [number] --uploadAssetRetryCount [number] --getImageIdRetryCount [number]
```

Configuration options:

- **Creator**: Set the creator type. Default is `'user'`.
  - Accepts: `'user'`, `'group'`
  - Keys: `--creator`, `-c`, `--Creator`
- **API Key**: Set the API key for authentication.
  - Keys: `--apiKey`, `-k`, `--apikey`, `--api-key`, `--key`
- **Group ID**: Set the group ID if the creator type is 'group'. Default is `empty`.
  - Keys: `--groupId`, `--groupid`, `--group-id`, `--group`
- **User ID**: Set the user ID if the creator type is 'user'. Default is `empty`.
  - Keys: `--userId`, `--userid`, `--user-id`, `--user`
- **Get Asset ID Retry Count**: Set the number of retries for getting the asset ID. Default is `3`.
  - Keys: `--getAssetIdRetryCount`, `--get-asset-id-retry-count`, `--garc`
- **Upload Asset Retry Count**: Set the number of retries for uploading an asset. Default is `3`.
  - Keys: `--uploadAssetRetryCount`, `--upload-asset-retry-count`, `--uarc`
- **Get Image ID Retry Count**: Set the number of retries for getting the image ID. Default is `3`.
  - Keys: `--getImageIdRetryCount`, `--get-image-id-retry-count`, `--giirc`

Example usage:

```bash
assetup config --creator group --apiKey OPEN_CLOUD_KEY --groupId GROUP_ID
```

This sets the configuration options to the provided values.

To view the current configuration, you can run the following command:

```bash
    assetup config
```

This will display the current configuration values.

## Contributing

We welcome contributions, issues, and feature requests! Feel free to check the [issues page](https://github.com/Jerse1/assetup/issues) and contribute.

## License

This project is licensed under the GNU License - see the [LICENSE](LICENSE) file for details.

## Show your support

Give a ⭐️ if this project helped you!

## Authors

👤 **Jerse1**

- Github: [@Jerse1](https://github.com/Jerse1)
