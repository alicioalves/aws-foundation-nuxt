import { randomBytes } from 'crypto'

import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'

const sesClient = new SESClient()

export const handler = async (event) => {
  let secretLoginCode

  if (!event.request.session || !event.request.session.length) {
    /**
     * This is a new auth session
     * Generate a new secret login code and mail it to the user
     */
    secretLoginCode = generateOTP(6)
    await sendEmail(event.request.userAttributes.email, secretLoginCode)
  } else {
    /**
     * There's an existing session. Instead of generating a new code,
     * we re-use the one from the previous session.
     */
    const previousChallenge = event.request.session.slice(-1)[0]
    secretLoginCode = previousChallenge.challengeMetadata.match(/CODE-(\d*)/)[1]
  }

  // Send this to the client app
  event.response.publicChallengeParameters = {
    email: event.request.userAttributes.email
  }

  /**
   * Add the secret login code (OTP) to the private challenge
   * parameters, allowing it to be verified by the
   * "Verify Auth Challenge" trigger.
   */
  event.response.privateChallengeParameters = { secretLoginCode }

  /**
   * Add the secret code to the session so it's available
   * in a next invocation of this trigger.
   */
  event.response.challengeMetadata = `CODE-${secretLoginCode}`

  return event
}

function generateOTP(length) {
  const digits = '0123456789'
  let code = ''

  for (let i = 0; i < length; i++) {
    const index = randomBytes(1)[0] % 10 // Get a random index for the digits string
    code += digits[index]
  }

  return code
}

async function sendEmail(emailAddress, secretLoginCode) {
  const params = {
    Destination: {
      ToAddresses: [emailAddress]
    },

    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: `<html><body><p>This is your secret login code:</p>
                            <h3>${secretLoginCode}</h3></body></html>`
        },

        Text: {
          Charset: 'UTF-8',
          Data: `Your secret login code: ${secretLoginCode}`
        }
      },

      Subject: {
        Charset: 'UTF-8',
        Data: 'Your secret login code'
      }
    },

    Source: process.env.SES_FROM_ADDRESS
  }

  await sesClient.send(new SendEmailCommand(params))
}
