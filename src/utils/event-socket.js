// import { reactive } from 'vue'
import { io } from 'socket.io-client'

// export const state = reactive({
//   connected: false,
//   fooEvents: [],
//   barEvents: []
// })

export function setupIO(key) {
  return io('/event_management', {
    extraHeaders: {
      'Event-Key': key
    }
  })
}

// socket.on('connect', () => {
//   state.connected = true
// })

// socket.on('message', (data) => {
//   console.log(data)
// })

// socket.on('disconnect', () => {
//   state.connected = false
// })

// socket.on('foo', (...args) => {
//   state.fooEvents.push(args)
// })

// socket.on('bar', (...args) => {
//   state.barEvents.push(args)
// })
