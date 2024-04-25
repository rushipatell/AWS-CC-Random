import { EC2Client, RunInstancesCommand } from "@aws-sdk/client-ec2";

const ec2 = new EC2Client();

const makeUserDataScript = (bucketName, fileKey, inputText) => {
  const userDataScript = "#!/bin/bash \n" +"cd /home/ubuntu \n"+  "sudo apt update -y \n" + "sudo apt install python3 -y \n" + "sudo apt install awscli -y \n"
 + "sudo apt install python3-pip -y \n" + "pip3 install boto3 \n" + "pip3 install nanoid \n" + `aws s3 cp s3://${bucketName}/script.py script.py \n` + 
 `python3 script.py --bucketName ${bucketName} --fileKey ${fileKey} --inputText ${inputText}`;

  console.log(userDataScript);
  const userDataEncoded = Buffer.from(userDataScript).toString("base64");
    console.log(userDataEncoded);
  return userDataEncoded;
};

export const handler = async (event, context) => {
  const latestRecord = event.Records[0].dynamodb.NewImage;
  const path = latestRecord.input_file_path.S;
  const partsOfPath = path.split("/");
  const bucketName = partsOfPath[0];
  const fileKey = partsOfPath[1];
  const inputText = latestRecord.input_text.S;
  const userDataScript = makeUserDataScript(bucketName, fileKey, inputText);

  const instanceParams = {
      SecurityGroupIds: ["sg-00e360fd13fb01bde"],
    ImageId: "ami-080e1f13689e07408",
    InstanceType: "t2.micro",
    KeyName: "rushi_sample",
    MinCount: 1,
    MaxCount: 1,
    UserData: userDataScript,
    IamInstanceProfile: {
      Arn: "ARN_FROM_ROLES",
    },
  };
  
  console.log(instanceParams)

  try {
    const command = new RunInstancesCommand(instanceParams);
    const response = await ec2.send(command);
    console.log(response);
  } catch (error) {
    console.error("ERROR --> ", error);
  }
};
