export const handler = (event) => {
  const expectAnswer = event.request.privateChallengeParameters.secretLoginCode
  if (event.request.challengeAnswer === expectAnswer) {
    event.response.answerCorrect = true
  } else {
    event.response.answerCorrect = false
  }

  return event
}
