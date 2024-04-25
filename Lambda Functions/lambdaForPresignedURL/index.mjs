import AWS from 'aws-sdk';

const s3 = new AWS.S3();

export const handler = async (event) => {
    try {
        console.log(event);
        const { bucketName, fileKey, fileType } = JSON.parse(event.body);
          
        const params = {
            Bucket: bucketName,
            Key: fileKey,
            ContentType: fileType, 
            Expires: 120,
        };
        const uploadUrl = await s3.getSignedUrlPromise('putObject', params);
        
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
            },
            body: { url: uploadUrl },
        };
    } catch (error) {
        console.error('Error generating pre-signed URL:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal server error' }),
        };
    }
};