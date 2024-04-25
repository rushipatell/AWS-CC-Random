import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { nanoid } from "nanoid";

const dynamodbClient = new DynamoDBClient({ region: "your-region" });

export const handler = async (event) => {
    const { bucketName, fileKey, inputText } = JSON.parse(event.body);

    const params = {
        TableName: 'fovusTextTable',
        Item: {
            id: { S: nanoid() }, 
            input_text: { S: inputText },
            input_file_path: { S: `${bucketName}/${fileKey}` },
        }
    };

    const putItemCommand = new PutItemCommand(params);

    try {
        await dynamodbClient.send(putItemCommand);
        return { statusCode: 200, body: 'Item added successfully' };
    } catch (error) {
        console.error('Unable to add item to DynamoDB', error);
        return { statusCode: 500, body: 'Error adding item to DynamoDB' };
    }
};
