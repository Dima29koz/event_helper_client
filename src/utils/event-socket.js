import { io } from 'socket.io-client'

export function setupIO(key) {
  return io('/event_management', {
    extraHeaders: {
      'Event-Key': key
    }
  })
}
