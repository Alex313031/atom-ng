module.exports = ({ reloadByDefault, showZoomButtons, zoomFactor }) => {
   return  `
      <atom-panel id="atombrowser-navbar" class="padded native-key-bindings">

         <!-- back / reload / refresh-on-save -->
         <button title="Go Back" id="atombrowser-btn-back" class="btn"><i class="icon icon-chevron-left"></i></button>
         <button title="Reload" id="atombrowser-btn-reload" class="btn"><i class="icon icon-sync"></i></button>
         <button title="Live Reload" id="atombrowser-btn-livereload" class="btn ${reloadByDefault ? 'active' : ''}"><i class="icon icon-zap"></i></button>

         <!-- addressbar -->
         <input type="text" id="atombrowser-addressbar" class="input-text native-key-bindings" placeholder="Search, File, Url"/>

         <!-- EXPERIMENTAL: ZOOM BAR -->
         <div class="zoom-bar ${showZoomButtons ? "" : "hidden"}">
            <button title="Zoom Out" id="atombrowser-btn-zoom-out" class="btn"><i class="icon icon-dash"></i></button>
            <input title="Zoom Percentage" readonly id="atombrowser-input-zoom" class='input-text' type='text' placeholder='Text' value="${Math.round(zoomFactor * 100)}%" style="width: 4rem; text-align: center;">
            <button title="Zoom In" id="atombrowser-btn-zoom-in" class="btn"><i class="icon icon-plus"></i></button>
         </div>

         <!-- open devtools -->
         <button title="Open DevTools" id="atombrowser-btn-devtools" class="btn"><i class="icon icon-terminal"></i></button>

      </atom-panel>
   `.trim()
}
