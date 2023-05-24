import Axios from "axios";
import FormData from "form-data";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import Conf from "conf";
import { promisify } from "util";
import { configKey } from "../cmd/configure";
import colors from "colors/safe";

const ASSETS_INNER_ENDPOINT = "https://apis.roblox.com/assets/v1";
const ASSETS_OUTER_ENDPOINT = `${ASSETS_INNER_ENDPOINT}/assets`;
const ASSET_DELIVERY_ENDPOINT = "https://assetdelivery.roblox.com/v1/asset";

const ASSET_TYPE = "Decal";
const OUTPUT_HEADER = "{\n";
const OUTPUT_FOOTER = "\n}";

colors.setTheme({
    method: ["cyan", "bold"],
    fileOutput: ["cyan", "bold"],
    readingFiles: ["yellow", "bold"],
    noFilesFound: ["red", "bold"],
    fileCount: ["green", "bold"],
    upload: ["green", "italic"],
    counter: ["cyan", "bold"],
    number: ["yellow"],
    file: ["magenta"],
    success: ["green", "italic", "bold"],
    error: ["red", "bold"],
    total: ["bold", "underline"],
});

const sleep = promisify(setTimeout);

function generateDisplayName() {
    const uniqueId = uuidv4();
    return uniqueId;
}

async function checkUserId(userId) {
    try {
        const response = await Axios.get(`https://users.roblox.com/v1/users/${userId}`);
        if (response.status === 200) {
            console.log(colors.success(`User ID ${userId} exists.`));

            return true;
        } else {
            console.log(colors.error(`Failed to check existence of player ID ${userId}.`));

            return false;
        }
    } catch (error) {
        console.log(colors.error(`An error occurred while checking player ID ${userId}:`), error.message);

        return false;
    }
}

async function checkGroupId(groupId) {
    try {
        const response = await Axios.get(`https://groups.roblox.com/v1/groups/${groupId}`);
        if (response.status === 200) {
            console.log(colors.success(`Group ID ${groupId} exists.`));

            return true;
        } else {
            console.log(colors.error(`Failed to check existence of group ID ${groupId}.`));

            return false;
        }
    } catch (error) {
        console.log(colors.error(`An error occurred while checking group ID ${groupId}:`), error.message);

        return false;
    }
}

function getConfig() {
    const config = new Conf().get(configKey);

    if (!config) {
        throw new Error('Config object is undefined');
    }
    if (!config.apiKey) {
        throw new Error('apiKey is missing in the configuration');
    }
    if (!['user', 'group'].includes(config.creator)) {
        throw new Error('Invalid creator in the configuration');
    }

    config.getAssetIdRetryCount = config.getAssetIdRetryCount || 3;
    config.uploadAssetRetryCount = config.uploadAssetRetryCount || 3;
    config.getImageIdRetryCount = config.getImageIdRetryCount || 3;

    return config;
}

async function getCreator(config) {
    switch (config.creator) {
        case 'group':
            const group = await checkGroupId(config.groupId);
            if (!group) {
                throw new Error('Group does not exist');
            }

            return {
                groupId: String(config.groupId),
            };
        case 'user':
            const user = await checkUserId(config.userId);
            if (!user) {
                throw new Error('User does not exist');
            }
            return {
                userId: String(config.userId),
            };
        default:
            throw new Error('Invalid creator in the configuration');
    }
}

async function getImageId(assetId, retryCount) {
    for (let attemptsMade = 0; attemptsMade < retryCount; attemptsMade++) {
        try {
            const response = await Axios.get(
                `${ASSET_DELIVERY_ENDPOINT}?id=${assetId}`,
                {
                    headers: { "Accept-Encoding": "gzip" },
                }
            );

            if (response.status !== 200) {
                throw new Error(JSON.stringify({ error: true, message: response.data }));
            }

            const re = /<Content name="Texture">\s*<url>[^0-9]+(\d+)<\/url>\s*<\/Content>/;
            const match = response.data.match(re);
            if (!match) {
                throw new Error(JSON.stringify({ error: true, message: "Couldn't find decal texture." }));
            }

            return match[1]; // exit loop once we have the match
        } catch (e) {
            // If it's the last attempt, throw the error
            if (attemptsMade === retryCount - 1) {
                console.error(colors.error.bold(`Failed to retrieve image ID for asset ${assetId}:`), e);
                throw e;
            } else {
                // If it's not the last attempt, wait for a while and try again.
                await sleep(2000);
                continue;
            }
        }
    }
}

async function getAssetId(operationId, apiKey, retryCount) {
    let assetId = null;
    for (let attemptsMade = 0; attemptsMade < retryCount; attemptsMade++) {
        try {
            const response = await Axios.get(`${ASSETS_INNER_ENDPOINT}/${operationId}`, {
                headers: {
                    'x-api-key': apiKey,
                },
            });

            assetId = response.data.response.assetId;
            break; // exit loop once we got the assetId
        } catch (error) {
            // If error is 404, then wait for a while and try again.
            if (error.response.status === 404) {
                await sleep(2000); // wait for 2 seconds
                continue;
            }

            throw error;
        }
    }

    if (assetId === null) {
        throw new Error(`Error: Failed to get assetId after ${retryCount} attempts`);
    }

    return assetId;
}

async function createAsset(filePath, fileName, creator, apiKey, retryCount) {
    for (let attemptsMade = 0; attemptsMade < retryCount; attemptsMade++) {
        const displayName = "Display Name"

        let bodyFormData = new FormData();
        bodyFormData.append(
            "request",
            JSON.stringify({
                assetType: ASSET_TYPE,
                creationContext: {
                    creator,
                },
                description: "Generated via OpenCloud API",
                displayName,
            })
        );

        bodyFormData.append("fileContent", fs.createReadStream(filePath), displayName);

        try {
            const response = await Axios.post(ASSETS_OUTER_ENDPOINT, bodyFormData, {
                headers: {
                    ...bodyFormData.getHeaders(),
                    "x-api-key": apiKey,
                },
            });

            return response.data.path; // exit loop once we have the response
        } catch (err) {
            const retriesLeft = retryCount - attemptsMade - 1;

            console.log(colors.yellow(`[${attemptsMade + 1}/${retryCount}] Retry uploading ${colors.file(fileName)} [${colors.file(displayName)}]. Retries left: ${retriesLeft}`));

            const response = err.response || {};
            const { status, statusText, data } = response;

            console.error(colors.yellow(`[${attemptsMade + 1}/${retryCount}] HTTP status code:`), status);
            console.error(colors.yellow(`[${attemptsMade + 1}/${retryCount}] HTTP status text:`), statusText);

            if (data.code) {
                console.error(colors.yellow(`[${attemptsMade + 1}/${retryCount}] Error code:`), data.code);
            }
            if (data.message) {
                console.error(colors.yellow(`[${attemptsMade + 1}/${retryCount}] Error message:`), data.message);
            }

            if (!data.message && !data.code && data) {
                console.log(colors.yellow(`[${attemptsMade + 1}/${retryCount}] Error data:`), data);
            }

            // If it's the last attempt, throw the error
            if (retriesLeft == 0) {
                throw "Error creating asset"
            } else {
                // Handle network errors separately
                if (err.code === "ECONNRESET") {
                    console.error(colors.error(`[${attemptsMade + 1}/${retryCount}] Network error occurred. Retrying...`));
                    await sleep(2000);
                    continue;
                }

                // For other errors, wait for a while and retry
                await sleep(2000);
                continue;
            }
        }
    }
}

export async function uploadImages(directoryPath, output, method) {
    console.log(colors.readingFiles("Retrieving configuration..."));

    const config = getConfig();

    console.log(colors.success("Successfully retrieved configuration."));

    const apiKey = config.apiKey;
    if (!apiKey) {
        console.log(colors.error("API key is missing in the configuration."));
        return;
    }

    var creator;
    try {
        creator = await getCreator(config);
    }
    catch (error) {
        console.error(colors.error(`Failed to get creator: `), error);

        return;
    }

    const outputStream = fs.createWriteStream(output);

    console.log(colors.method(`Method: ${method}`));
    console.log(colors.fileOutput(`File output: ${output}`));
    console.log(colors.readingFiles(`Reading files from ${directoryPath}`));

    const files = fs.readdirSync(directoryPath)
        .filter(file => path.extname(file) === ".png") // Only process .png files
        .sort((a, b) => {
            const numA = Number(a.split('.png')[0]); // Assuming files are named like '123.png'
            const numB = Number(b.split('.png')[0]);

            if (isNaN(numA) || isNaN(numB)) {
                return a.localeCompare(b); // if names are not numbers, sort them as strings
            }

            return numA - numB; // This will sort numerically
        });

    if (!files || files.length === 0) {
        console.log(colors.noFilesFound("No files found in the directory."));
        return;
    }

    const fileCount = files.length;
    const filesVerb = fileCount === 1 ? "file" : "files";
    console.log(colors.fileCount(`Found ${colors.number(fileCount)} ${filesVerb} in the directory.`));

    console.log(colors.upload(`Uploading ${colors.number(fileCount)} ${filesVerb}...`));

    const totalStartTime = Date.now();
    let previousTime = process.hrtime.bigint();
    let counter = 1;
    let successCount = 0;
    let failureCount = 0;

    outputStream.write(OUTPUT_HEADER);

    for (const file of files) {
        if (path.extname(file) === ".png") {
            const filePath = path.join(directoryPath, file);

            const currentTime = process.hrtime.bigint();
            const elapsedTimeInSeconds = Number(currentTime - previousTime) / 1e9;
            await sleep(elapsedTimeInSeconds);

            let startTime = Date.now();

            try {
                console.log(`[${colors.counter(counter)}] ${colors.upload(`Uploading ${colors.file(file)}...`)}`);

                const operationId = await createAsset(filePath, file, creator, apiKey, config.uploadAssetRetryCount);
                const assetId = await getAssetId(operationId, apiKey, config.getAssetIdRetryCount);

                let imageId;
                if (method === "both" || method === "image") {
                    imageId = await getImageId(assetId, config.getImageIdRetryCount);
                }

                const comma = counter !== fileCount ? ',\n' : '';

                switch (method) {
                    case "both":
                        outputStream.write(`[${counter}] = {${assetId}, ${imageId}}${comma}`);
                        break;
                    case "image":
                        outputStream.write(`[${counter}] = ${imageId}${comma}`);
                        break;
                    case "decal":
                        outputStream.write(`[${counter}] = ${assetId}${comma}`);
                        break;
                    default:
                        throw new Error("Error: method is not valid!");
                }

                const endTime = Date.now();
                const uploadTime = (endTime - startTime) / 1000;

                successCount++;

                console.log(`[${colors.counter(counter)}] ${colors.success("Asset was uploaded successfully")}`);
                console.log(`    File: ${colors.file(file)}`);
                console.log(`    Id: ${colors.number(assetId)}`);
                console.log(`    ImageId: ${colors.number(imageId)}`);
                console.log(`    Time taken: ${colors.number(uploadTime)} seconds`);
            } catch (error) {
                outputStream.write(`[${counter}] = nil`);

                console.log()
                console.error(colors.error(`Failed to upload file ${file}:`), error);

                failureCount++;
            }

            previousTime = process.hrtime.bigint();
            counter++;
        }
    }

    outputStream.write(OUTPUT_FOOTER);
    outputStream.end();

    const totalEndTime = Date.now();
    const totalTime = (totalEndTime - totalStartTime) / 1000;

    let totalOutput = `Total time taken: ${colors.number(totalTime)} seconds, (${colors.counter(successCount)}/${colors.counter(fileCount)}) files uploaded successfully to ${colors.file(output)}`;

    if (failureCount > 0) {
        totalOutput = colors.error(totalOutput);
    } else if (successCount < fileCount) {
        totalOutput = colors.yellow(totalOutput);
    } else {
        totalOutput = colors.green(totalOutput);
    }

    console.log(colors.total(totalOutput));
}
