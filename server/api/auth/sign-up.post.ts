import type { CognitoIdentityServiceProvider } from 'aws-sdk'

import cognitoServiceProvider from '~/server/aws-services/cognito'
import crypto from 'crypto'

import generateSecretHash from '~/server/utils/hash'

export default defineEventHandler(async (event) => {
  const { name, email, password } = await readBody(event)

  const cognito: CognitoIdentityServiceProvider = cognitoServiceProvider
  const clientId = process.env.COGNITO_CLIENT_ID!
  const clientSecret = process.env.COGNITO_SECRET!

  const encodedAuthentication = generateSecretHash(
    email,
    clientId,
    clientSecret
  )

  const params: CognitoIdentityServiceProvider.Types.SignUpRequest = {
    ClientId: clientId,
    SecretHash: encodedAuthentication,
    Username: email,
    Password: password,
    UserAttributes: [
      {
        Name: 'name',
        Value: name
      },
      {
        Name: 'email',
        Value: email
      }
    ]
  }

  try {
    const data = await cognito.signUp(params).promise()

    return {
      data
    }
  } catch (error: any) {
    throw createError({
      status: error.status,
      message: error.message
    })
  }
})
