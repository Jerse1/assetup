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
    upload: 'green',
    counter: 'cyan',
    number: 'yellow',
    file: 'magenta',
})

const sleep = promisify(setTimeout);

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
                console.log(500, { error: true, message: e.message });
                throw e;
            } else {
                // If it's not the last attempt, wait for a while and try again.
                await sleep(2000);
                continue;
            }
        }
    }
}


async function createAsset(filePath, fileName, displayName, creator, apiKey, retryCount) {
    const bodyFormData = new FormData();
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

    bodyFormData.append("fileContent", fs.createReadStream(filePath), fileName);

    for (let attemptsMade = 0; attemptsMade < retryCount; attemptsMade++) {
        try {
            const response = await Axios.post(ASSETS_OUTER_ENDPOINT, bodyFormData, {
                headers: {
                    ...bodyFormData.getHeaders(),
                    "x-api-key": apiKey,
                },
            });
            return response.data.path; // exit loop once we have the response
        } catch (err) {
            // If it's the last attempt, throw the error
            if (attemptsMade === retryCount - 1) {
                const { data, status, statusText } = err.response;
                console.error("Error data:", data);
                console.error("HTTP status code:", status);
                console.error("HTTP status text:", statusText);

                throw "Error creating asset";
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
            break;  // exit loop once we got the assetId
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


function getCreator(config) {
    switch (config.creator) {
        case 'group':
            return {
                groupId: String(config.groupId),
            };
        case 'user':
            return {
                userId: String(config.userId),
            };
        default:
            throw new Error('Invalid creator in the configuration');
    }
}

export async function uploadImages(directoryPath, output, method) {
    const outputStream = fs.createWriteStream(output);
    const config = getConfig();

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
        console.log("No files found in the directory.");
        return;
    }

    const fileCount = files.length;
    const apiKey = config.apiKey;
    const creator = getCreator(config);

    const totalStartTime = Date.now();
    let previousTime = process.hrtime.bigint();
    let counter = 1;
    let successCount = 0;

    outputStream.write(OUTPUT_HEADER);

    for (const file of files) {
        if (path.extname(file) === ".png") {
            const filePath = path.join(directoryPath, file);

            const currentTime = process.hrtime.bigint();
            const elapsedTimeInSeconds = Number(currentTime - previousTime) / 1e9;
            await sleep(elapsedTimeInSeconds);

            let startTime = Date.now();

            try {
                console.log(`[${colors.counter(counter)}] Uploading ${colors.file(file)}...`);

                const operationId = await createAsset(filePath, file, uuidv4(), creator, apiKey, config.uploadAssetRetryCount);
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

                console.log(`[${colors.counter(counter)}]`, colors.upload(`Asset was uploaded successfully`) + `
    File: ${colors.file(file)}
    Id: ${colors.number(assetId)},
    ImageId: ${colors.number(imageId)},
    Time taken: ${colors.number(uploadTime)} seconds`)
            } catch (error) {
                outputStream.write(`[${counter}] = nil`);

                console.error(`Failed to upload file ${file}:`, error);
            }

            previousTime = process.hrtime.bigint();
            counter++;
        }
    }

    outputStream.write(OUTPUT_FOOTER);

    const totalEndTime = Date.now();
    const totalTime = (totalEndTime - totalStartTime) / 1000;
    console.log(colors.upload(`Total time taken:`), 
    colors.number(totalTime), 
    colors.upload(`seconds, (${colors.counter(successCount)}/${colors.counter(fileCount)}) files uploaded successfully`)
    );

    outputStream.end();
}
