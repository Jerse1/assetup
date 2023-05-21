# Welcome to Asset-Uploader-CLI 👋

> Asset Uploader CLI for Roblox.  
> Written in JavaScript.

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

Asset Uploader CLI is a command-line interface program for Roblox, fully implemented in JavaScript. The purpose of this project and specific details about its functionalities will be updated shortly.

## Features

- **Command-line interface:** Easy-to-use command-line interface that is compatible with most operating systems.
- **Multi-format support:** Supports a wide range of asset formats.
- **Customizable:** You can configure the tool according to your preferences and requirements.

## Prerequisites

Before installing `Asset-Uploader-CLI`, ensure you have the following installed:

- [Node.js](https://nodejs.org/en/)
- [npm](https://www.npmjs.com/)

## Installation

To install the `Asset-Uploader-CLI`, follow the steps below:

1. Clone the repository:

```bash
git clone https://github.com/Jerse1/Asset-Uploader-CLI.git
```

2. Navigate to the project directory:

```bash
    cd Asset-Uploader-CLI
```

3. Install the dependencies:

```bash
    npm install
```

4. Globally link
```bash
    npm link
```

## Usage

To upload images, run the following command:

```bash
    npm run assetup upload [options]
```

Options:

- `--i, --input <path>`: Specifies the directory path containing the PNG image files to be uploaded (default: ./input)
- `--o, --output <file>`: Designates the output file path for storing asset information (default: ./output.txt)
- `--m, --method <value>`: Selects the upload method: 'both', 'image', or 'decal' (default: 'both')

By default, the script will upload PNG image files from the ./input directory, generate an output file ./output.txt, and use the both method to retrieve both asset IDs and image IDs. You can customize these

Example usage:

```bash
    npm run assetup upload --i ./assets --o ./results.json --m image
```

## Configuration

The script uses a configuration file to store the necessary API key and other options. Before running the script, you need to set up the configuration by executing the following command:

```bash
    npm run assetup config
```

Configuration options:

- **Creator**: Specifies the creator type. Valid options are "user" and "group". To change the creator, use the `--creator` or `-c` flag followed by the desired value.
- **API Key**: Specifies the API key used for authentication. To change the API key, use the `--apiKey` or `-k` flag followed by the new key.
- **Group ID**: Specifies the group ID if the creator type is "group". To change the group ID, use the `--groupId` or `-g` flag followed by the new ID.
- **User ID**: Specifies the user ID if the creator type is "user". To change the user ID, use the `--userId` or `-u` flag followed by the new ID.
- **Get Asset ID Retry Count**: Specifies the number of retries for getting the asset ID. To change the retry count, use the `--getAssetIdRetryCount` flag followed by the new count.  (default: 3)
- **Upload Asset Retry Count**: Specifies the number of retries for uploading an asset. To change the retry count, use the `--uploadAssetRetryCount` flag followed by the new count. (default: 3)
- **Get Image ID Retry Count**: Specifies the number of retries for getting the image ID. To change the retry count, use the `--getImageIdRetryCount` flag followed by the new count. (default: 3)

Example usage:

```bash
npm run assetup config --creator group --apiKey OPEN_CLOUD_KEY --groupId GROUP_ID
```

This sets the configuration options to the provided values.

To view the current configuration, you can run the following command:

```bash
    npm run assetup config
```

This will display the current configuration values.

## Contributing

Contributions, issues and feature requests are welcome! Feel free to check [issues page](https://github.com/Jerse1/Asset-Uploader-CLI/issues).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Show your support

Give a ⭐️ if this project helped you!

## Authors

👤 **Jerse1**

- Github: [@Jerse1](https://github.com/Jerse1)