const OneSignal = require('onesignal-node')

export const client = new OneSignal.Client('9805b45d-00ff-4ee4-b4cb-1da3cfd8a989', 'ZTY4MzMzOTItZjhhNy00OTg0LWI1ZDItMWFiNzkwODFhYzUy')

export const sendMessage = (content, to) => {

  console.log(to)
  console.log(content)
  const notification = {
    contents: { 'en': content },
    include_external_user_ids: [to],
  }

  return client.createNotification(notification)
    .then(response => {
      console.log('Notifiaction envoyée: ', notification)
    })
    .catch(e => {
      console.log(e)
    })
}
