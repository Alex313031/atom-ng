// passed into webview preload
;(() => {
   const { ipcRenderer } = require('electron')

   window.atomBrowserConnectEmitter = {
      interval: undefined,
      info: {},

      setup: function(currentIframeInfo) {
         console.log('[ATOM BROWSER] enabling emitter')
         this.info = currentIframeInfo

         this.connect()
         this.load()
      },

      connect: function() {
         clearInterval(this.interval)
         this.interval = setInterval(() => this.send(), 500)
      },

      disconnect: function() {
         console.log('[ATOM BROWSER] disabling emitter')
         clearInterval(this.interval)
      },

      send: function() {
         ipcRenderer.sendToHost(JSON.stringify({
           url: window.location.href,
           scrollY: window.scrollY
        }))
      },

      load: function() {
         if (document.readyState === "complete") this.onload()
         else window.addEventListener('load', () => this.onload())
      },

      onload: function() {
         if (this.info && window.location.href === this.info.url) {
            window.scrollTo(0, this.info.scrollY)
         }
      },
   }
})();
