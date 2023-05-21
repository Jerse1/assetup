# Welcome to Asset-Uploader-CLI 👋

> Asset Uploader CLI for Roblox.  
> Written in JavaScript.

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Prerequisites](#prerequisites)
4. [Installation](#installation)
5. [Usage](#usage)
6. [Contributing](#contributing)
7. [License](#license)

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

## Usage

To upload images, run the following command:

```bash
    npm run imgup upload [options]
```

Options:

- `--i, --input <path>`: Specifies the directory path containing the PNG image files to be uploaded (default: ./input)
- `--o, --output <file>`: Designates the output file path for storing asset information (default: ./output.json)
- `--m, --method <value>`: Selects the upload method: 'both', 'image', or 'decal' (default: 'both')

By default, the script will upload PNG image files from the ./input directory, generate an output file ./output.txt, and use the both method to retrieve both asset IDs and image IDs. You can customize these

Example usage:

```bash
    npm run imgup upload --i ./assets --o ./results.json --m image
```

## Contributing

Contributions, issues and feature requests are welcome! Feel free to check [issues page](https://github.com/Jerse1/Asset-Uploader-CLI/issues).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Show your support

Give a ⭐️ if this project helped you!

## Author

👤 **Jerse1**

- Github: [@Jerse1](https://github.com/Jerse1)