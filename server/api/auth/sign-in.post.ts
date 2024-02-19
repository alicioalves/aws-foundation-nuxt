import cognitoServiceProvider from '~/server/aws-services/cognito'
import generateSecretHash from '~/server/utils/hash'

import type { CognitoIdentityServiceProvider } from 'aws-sdk'

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event)

  const cognito: CognitoIdentityServiceProvider = cognitoServiceProvider
  const clientId = process.env.COGNITO_CLIENT_ID!
  const clientSecret = process.env.COGNITO_SECRET!

  const secretHash = generateSecretHash(email, clientId, clientSecret)

  const params: CognitoIdentityServiceProvider.Types.InitiateAuthRequest = {
    AuthFlow: 'USER_PASSWORD_AUTH',
    ClientId: process.env.COGNITO_CLIENT_ID!,
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password,
      SECRET_HASH: secretHash
    }
  }

  try {
    const data = await cognito.initiateAuth(params).promise()

    return {
      data: data.AuthenticationResult
    }
  } catch (error: any) {
    throw createError({
      status: error.status,
      message: error.message
    })
  }
})
