
module.exports = ({ showBackground }) => {
   return  `
      <div class="atombrowser-webview-container">
         <webview
          id="atombrowser-webview"
          preload="file:${__dirname}/../atom-browser-emitter.js"
          class="native-key-bindings ${showBackground ? 'show-background' : ''}"
          src=""
         ></webview>
         <div id="atombrowser-webview-failed-load">
            <i class="icon icon-octoface"></i>
            <h4 class="message">Atom-ng Browser</h4>
         </div>
      </div>
   `.trim()
}
