# Getting Started with React App

Demo : https://drive.google.com/file/d/1fWRo2AwKQoTubTg8G0a_Ve88cQ0gcf3h/view?usp=drive_link

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
Steps to deploy my code on your device : 

## Step 1 

To make sure that npm is installed on your computer. 

## Step 2 

To clone the repo on local and change the working directory to the repo in your terminal.

## Step3 

You will need to install all the dependencies that are mentioned in package.json to run this project. Hence type the following command to download all the packages.

### `npm install` 

## Step 4

To deploy the code on local, type the below command.

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

# Architecture for reference 

## Part 1 :

The Client needs to upload the file to S3. I found an article [Upload To S3 using axios](https://medium.com/@kevinwu/client-side-file-upload-to-s3-using-axios-c9363ec7b530) which provides an overview of using presigned url to perform this task. I created a lambda function and then used the lambda to fetch the presigned url and then return the url to cliend side. This url will grant temporary permission to client to upload file without needing to use any credentials or access keys.

### `Client -------asks for pre-signed url ---->  API Gateway  ------triggers lambda------> Lambda`
### `Client -----uploads file to S3 ---> S3`


## Part 2 : 

To upload an item to DynamoDB, an api gateway will be used just like above. This api gateway will trigger that puts the item to DB.

### `Client -----requests to put an item into a Table ( DynamoDB ) ---->  API Gateway  ------triggers lambda------> Lambda --adds an item to the specified table---> DB`

## Part 3 :

The DB will trigger an event on addition of new item and this event will trigger a Lambda function. The task of the lambda function will be to create an ec2 instance. The EC2 instance will receive the bucket name, key, input text, etc from event that lambda received. I have used `UserData` ([reference to article](https://www.geeksforgeeks.org/create-an-ec2-instance-with-ec2-user-data-script-to-launch-website/)) to send the commands which are going to be executed by the EC2 instance. The commands will contain all the necessary information the ec2 instance needs to perform the task. One of the command will be to download script.py from the bucket which will have the code to create an output file, uploading the content to S3 & DB and to terminate the instance itself. Hence, on running this Python script, it will perform the task and the instance will terminate itself. 

### `DB -----triggers a Lambda to create an ec2 instance-----> Lambda -----triggers the creation of ec2 instance to perform the task-------------> EC2 Instnace ( Puts the ouput item in DB and file to S3 and then terminates itself) `

## Other References 

`https://docs.aws.amazon.com/lambda/latest/dg/nodejs-handler.html`
`https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html`






