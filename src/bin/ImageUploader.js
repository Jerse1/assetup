import Axios from "axios";
import FormData from "form-data";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import Conf from "conf";
import { promisify } from "util";
import { configKey } from "../cmd/configure";

const ASSETS_INNER_ENDPOINT = "https://apis.roblox.com/assets/v1";
const ASSETS_OUTER_ENDPOINT = `${ASSETS_INNER_ENDPOINT}/assets`;
const ASSET_DELIVERY_ENDPOINT = "https://assetdelivery.roblox.com/v1/asset";

const ASSET_TYPE = "Decal";
const OUTPUT_HEADER = "{\n";
const OUTPUT_FOOTER = "\n}";

const sleep = promisify(setTimeout);

async function getImageId(assetId) {
    try {
        const response = await Axios.get(
            `${ASSET_DELIVERY_ENDPOINT}?id=${assetId}`,
            {
                headers: { "Accept-Encoding": "gzip" },
            }
        );

        if (response.status !== 200) {
            const error = { error: true, message: response.data };
            console.log(response.status, error);
            throw new Error(JSON.stringify(error));
        }

        const re = /<Content name="Texture">\s*<url>[^0-9]+(\d+)<\/url>\s*<\/Content>/;
        const match = response.data.match(re);
        if (!match) {
            const error = {
                error: true,
                message: "Couldn't find decal texture.",
            };
            console.log(400, error);
            throw new Error(JSON.stringify(error));
        }

        console.log(200, { imageId: match[1] });
        return match[1];
    } catch (e) {
        console.log(500, { error: true, message: e.message });
        throw e;
    }
}

async function createAsset(filePath, fileName, displayName, creator, apiKey) {
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

    try {
        const response = await Axios.post(ASSETS_OUTER_ENDPOINT, bodyFormData, {
            headers: {
                ...bodyFormData.getHeaders(),
                "x-api-key": apiKey,
            },
        });
        return response.data.path;
    } catch (err) {
        const { data, status, statusText } = err.response;
        console.error("Error message:", data.title);
        console.error("HTTP status code:", status);
        console.error("HTTP status text:", statusText);
        console.error("Validation errors:", data.errors);
        console.error("Trace ID:", data.traceId);
        throw err;
    }
}

async function getAssetId(operationId, apiKey) {
    try {
        let assetId = null;
        let attempt = 0;
        while (assetId == null && attempt < 5) { // try 5 times
            attempt++;
            try {
                const response = await Axios.get(`${ASSETS_INNER_ENDPOINT}/${operationId}`, {
                    headers: {
                        'x-api-key': apiKey,
                    },
                });

                assetId = response.data.response.assetId;
            } catch (error) {
                // If error is 404, then wait for a while and try again.
                if (error.response.status === 404) {
                    await sleep(2000); // wait for 2 seconds
                    continue;
                } else {
                    throw error;
                }
            }
        }
        if (assetId === null) {
            throw new Error(`Failed to get assetId after ${attempt} attempts`);
        }
        return assetId;
    } catch (error) {
        console.error(`Error getting asset ID for operation ${operationId}:`, error);
        throw error; // Re-throw the error to be caught higher up
    }
}

function getConfig() {
    const config = new Conf().get(configKey);

    if (!config.apiKey) {
        throw new Error('apiKey is missing in the configuration');
    }
    if (!['user', 'group'].includes(config.creator)) {
        throw new Error('Invalid creator in the configuration');
    }

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
    const files = fs.readdirSync(directoryPath);
    const config = getConfig();

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

    outputStream.write(OUTPUT_HEADER);

    for (const file of files) {
        if (path.extname(file) === ".png") {
            const filePath = path.join(directoryPath, file);

            const currentTime = process.hrtime.bigint();
            const elapsedTimeInSeconds = Number(currentTime - previousTime) / 1e9;
            await sleep(elapsedTimeInSeconds);

            let startTime = Date.now();

            try {
                const operationId = await createAsset(filePath, file, uuidv4(), creator, apiKey);
                const assetId = await getAssetId(operationId, apiKey);

                let imageId;
                if (method === "both" || method === "image") {
                    imageId = await getImageId(assetId);
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

                console.log(`Time taken to upload [${counter}] ${file}: ${uploadTime} seconds`);
            } catch (error) {
                console.error(`Failed to upload file ${file}:`, error);
            }

            previousTime = process.hrtime.bigint();
            counter++;
        }
    }

    outputStream.write(OUTPUT_FOOTER);

    const totalEndTime = Date.now();
    const totalTime = (totalEndTime - totalStartTime) / 1000;
    console.log(`Total time taken: ${totalTime} seconds`);

    outputStream.end();
}
