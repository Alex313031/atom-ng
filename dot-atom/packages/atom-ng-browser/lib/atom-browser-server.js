const express = require('express')

class AtomBrowserServer {
   start(path, then) {
      if (this.server) this.tearDown()
      this.app = express()

      this.app.use(express.static(path))
      
      this.server = this.app.listen(7654, () => {
         console.log('Atom-ng Browser Server started on: ', 7654)
         then('http://localhost:7654')
      })
   }
   
   tearDown() {
      if (!this.server) return
      
      console.log('Atom-ng Browser Server closed')
      this.server.close()
      this.server = undefined
   }
}

module.exports = AtomBrowserServer
