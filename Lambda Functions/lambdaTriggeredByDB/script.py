import boto3
import argparse
import os
import nanoid
import requests



s3 = boto3.client('s3')
dynamodb = boto3.resource('dynamodb', region_name = 'us-east-1')

def main(bucketName, fileKey, inputText): 
    s3.download_file(bucketName, fileKey, fileKey)

    with open(fileKey, 'r') as file:
        original_content = file.read()

    appended_content = original_content + ": " + inputText
    file_paths =  os.path.splitext(fileKey)
    file_name = file_paths[0]
    extension = file_paths[1]
    output_file_key = file_name + "_output" + extension

    with open(output_file_key, 'w') as file:
        file.write(appended_content)
    try: 
        s3.upload_file(output_file_key, bucketName, output_file_key)
    except Exception as e:
        print("Error adding to S3:", e)
    
    table = dynamodb.Table("fovus_output_table")

    item = {
        "id" : nanoid.generate(),
        "output_file_path" : bucketName + "/" + output_file_key,
    }

    try:
        response = table.put_item(Item=item)
        print("Item added to DynamoDB table:", response)
    
    except Exception as e:
        print("Error adding item to DynamoDB table:", e)

    ec2 = boto3.client('ec2', region_name = 'us-east-1')
    instance_id = get_instance_id()
    ec2.terminate_instances(InstanceIds=[instance_id])

def get_instance_id():
    instance_id_url = "http://169.254.169.254/latest/meta-data/instance-id"
    response = requests.get(instance_id_url)
    return response.text


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Upload images')
    parser.add_argument('--bucketName', type=str)
    parser.add_argument('--fileKey', type=str)
    parser.add_argument('--inputText', type=str)

    args = parser.parse_args()

    bucketName = args.bucketName
    fileKey   = args.fileKey
    inputText = args.inputText
    main(bucketName, fileKey, inputText)

