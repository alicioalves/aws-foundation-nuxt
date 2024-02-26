export const handler = (event) => {
  event.response.autoConfirmUser = true
  event.response.autoVerifyEmail = true
  event.response.autoVerifyPhone = true

  return event
}
