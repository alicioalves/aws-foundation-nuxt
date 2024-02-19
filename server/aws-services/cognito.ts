import AWS from 'aws-sdk'

AWS.config.update({
  region: process.env.COGNITO_REGION
})

const cognitoServiceProvider = new AWS.CognitoIdentityServiceProvider({
  apiVersion: '2016-04-18',
  region: process.env.COGNITO_REGION
})

export default cognitoServiceProvider
