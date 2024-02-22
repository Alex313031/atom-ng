'use babel';
import { CompositeDisposable } from 'atom'
import AtomBrowserViewBrowser from './atom-browser-view-browser'
import AtomBrowserViewIcon from './atom-browser-view-icon'
import AtomBrowserServer from './atom-browser-server'

import {
   CONFIG_DEFAULT_LOCATION,
   CONFIG_EMITTER_ENABLED,
   CONFIG_INITIAL_URL,
   CONFIG_RELOAD_BY_DEFAULT,
   CONFIG_SHOW_ICON,
   CONFIG_SHOW_ZOOM,
   CONFIG_STATIC_SERVE,
   CONFIG_WEBVIEW_BACKGROUND,
   CONFIG_ZOOM_FACTOR,
} from './atom-browser-confignames'

export default {
   activate() {
      this.subscriptions = null
      this.dockLocation = atom.config.get(CONFIG_DEFAULT_LOCATION)
      this.showBackground = atom.config.get(CONFIG_WEBVIEW_BACKGROUND)
      this.showZoomButtons = atom.config.get(CONFIG_SHOW_ZOOM)
      this.zoomFactor = atom.config.get(CONFIG_ZOOM_FACTOR)
      this.initialUrl = atom.config.get(CONFIG_INITIAL_URL)
      this.reloadByDefault = atom.config.get(CONFIG_RELOAD_BY_DEFAULT)
      this.showIcon = true
      this.view = undefined
      this.server = new AtomBrowserServer

      this.addSubscriptions()
      this.listenForSave()
   },

   consumeStatusBar(statusBar) {
      this.statusBar = statusBar
      this.toggleIcon()
   },

   deactivate() {
      this.subscriptions.dispose()
      this.icon && this.icon.destroy()
      this.view && this.view.destroy()
      var pane = this.getPane()
      var item = this.getItem()
      if (pane && item) {
         pane.destroyItem(item)
      }
   },

   /*------------------------------------------------------------------------*/
   /*---------------------------| subscriptions |----------------------------*/
   /*------------------------------------------------------------------------*/
   addSubscriptions() {
      this.subscriptions = new CompositeDisposable();
      this.subscriptions.add(
         atom.commands.add('atom-workspace', {
            'atom-ng-browser:preview': () => this.onPreview(),
            'atom-ng-browser:show': () => this.show(),
            'atom-ng-browser:hide': () => this.hide(),
            'atom-ng-browser:showHide': () => this.toggle(),
         }),
         atom.config.onDidChange(CONFIG_DEFAULT_LOCATION, () => this.changeConfigDefaultLocation()),
         atom.config.onDidChange(CONFIG_WEBVIEW_BACKGROUND, () => this.changeConfigWebviewBackground()),
         atom.config.onDidChange(CONFIG_SHOW_ICON, () => this.changeConfigShowIcon()),
         atom.config.onDidChange(CONFIG_EMITTER_ENABLED, () => this.changeConfigEmitter()),
         atom.config.onDidChange(CONFIG_SHOW_ZOOM, () => this.changeShowZoom()),
         atom.config.onDidChange(CONFIG_RELOAD_BY_DEFAULT, () => this.changeReloadByDefault()),
         atom.config.onDidChange(CONFIG_ZOOM_FACTOR, () => this.changeZoomFactor()),
         atom.workspace.getRightDock().getPanes()[0].onWillDestroyItem((e) => this.onDestroyItem(e)),
         atom.workspace.getBottomDock().getPanes()[0].onWillDestroyItem((e) => this.onDestroyItem(e)),
         atom.workspace.getRightDock().getPanes()[0].onDidAddItem((e) => this.onDidMoveItem(e, 'right')),
         atom.workspace.getBottomDock().getPanes()[0].onDidAddItem((e) => this.onDidMoveItem(e, 'bottom')),
      )
   },

   listenForSave() {
      atom.workspace.observeTextEditors((editor) => {
         editor.onDidSave(() => {
            this.view && this.view.handleDidSave()
         })
      })
   },


   onPreview() {
      this.show()

      // get the selected path
      var selected = document.querySelector('.atom-dock-inner .selected .name')
      if (!selected) return
      var selectedPath = selected.getAttribute('data-path')


      var projectPath = undefined
      var pointer = selected
      var tried = 1000 // just in case :]
      while (!projectPath && tried--) {
         if (pointer.classList.contains('project-root')) {
            projectPath = pointer.querySelector('.project-root-header span.name.icon').dataset.path
         }

         var pointer = pointer.parentElement
      }


      const selectedFile = selectedPath.replace(projectPath, '')

      if (atom.config.get(CONFIG_STATIC_SERVE)) {
         this.server.start(projectPath, (serverUrl) => {
            this.view.setURL(serverUrl + selectedFile)
         })
      } else {
         const fileURL = 'file://' + selectedPath
         this.view.setURL(fileURL)
      }
   },

   /*------------------------------------------------------------------------*/
   /*---------------------------------| views |------------------------------*/
   /*------------------------------------------------------------------------*/
   toggleIcon() {
      this.showIcon = atom.config.get(CONFIG_SHOW_ICON)

      if (this.showIcon) {
         this.icon = new AtomBrowserViewIcon({ onClick: this.toggle.bind(this) })
         this.statusBar.addRightTile({
            item: this.icon.element,
            priority: -999
         })
      } else {
         if (this.icon) {
            this.icon.destroy()
            this.icon = undefined
         }
      }
   },

   initializeView() {
      this.view = new AtomBrowserViewBrowser({
         defaultLocation: this.dockLocation,
         showBackground: this.showBackground,
         reloadByDefault: this.reloadByDefault,
         initialUrl: this.initialUrl,
         showZoomButtons: this.showZoomButtons,
         zoomFactor: this.zoomFactor,
      })

      atom.workspace.open(this.view)
      this.changeConfigDefaultLocation()
   },

   /*------------------------------------------------------------------------*/
   /*--------------------------------| config |------------------------------*/
   /*------------------------------------------------------------------------*/
   changeConfigDefaultLocation() {
      var wasVisibleBeforeMoving = this.isOpened()
      var oldLocation = this.dockLocation
      var newLocation = atom.config.get(CONFIG_DEFAULT_LOCATION)

      if (oldLocation === newLocation) return

      this.dockLocation = newLocation
      var newDock = this.getDock()

      atom.workspace.getPaneItems().forEach(item => {
         if (item instanceof AtomBrowserViewBrowser) {

            var oldPane = atom.workspace.paneForItem(item)
            var newPane = newDock.getPanes()[0]
            oldPane.moveItemToPane(item, newPane, 0)
            newPane.activateItem(item)

            if (wasVisibleBeforeMoving) this.getDock().show()
         }
      })
   },

   changeConfigWebviewBackground() {
      const showBackground = atom.config.get(CONFIG_WEBVIEW_BACKGROUND)
      this.showBackground = showBackground
      this.view && this.view.applySettingViewBackground(showBackground)
   },

   changeConfigInitialUrl() {
      this.initialUrl = atom.config.get(CONFIG_INITIAL_URL)
   },

   changeConfigShowIcon() {
      this.toggleIcon()
   },

   changeConfigEmitter() {
      this.view && this.view.ipcToggle()
   },

   changeReloadByDefault() {
      this.reloadByDefault = atom.config.get(CONFIG_RELOAD_BY_DEFAULT)
   },

   changeShowZoom() {
      this.showZoomButtons = atom.config.get(CONFIG_SHOW_ZOOM)
      this.view && this.view.zoomToggle(this.showZoomButtons)
   },

   changeZoomFactor() {
      this.zoomFactor = atom.config.get(CONFIG_ZOOM_FACTOR)
      this.view && this.view.zoomSet(this.zoomFactor)
   },

   /*------------------------------------------------------------------------*/
   /*----------------------------| dock control |----------------------------*/
   /*------------------------------------------------------------------------*/
   toggle() {
      this.isOpened() ? this.hide() : this.show()
   },

   show() {
      if (!this.view || !this.view.isInDom()) {
         this.initializeView()
      }

      var dock = this.getDock()
      dock.show()
   },

   hide() {
      var dock = this.getDock()
      dock.hide()
   },

   reset() {
      if (this.view) {
         const pane = this.getPane()
         const item = this.getItem()
         pane.destroyItem(item)
         this.initializeView()
      }
   },

   getDock() {
      if (this.dockLocation === 'right') return atom.workspace.getRightDock()
      if (this.dockLocation === 'bottom') return atom.workspace.getBottomDock()
   },

   getPane() {
      return this.getDock().getPanes()[0]
      return pane
   },

   getItem() {
      return this.getPane().items.find((item) => {
         return (item instanceof AtomBrowserViewBrowser) ? true : false
      })
   },

   isOpened() {
      return (
         this.getDock().state.visible
         && this.view
         && this.view.isInDom()
      ) ? true : false
   },

   onDestroyItem({ item }) {
      this.server.tearDown()
      if (item instanceof AtomBrowserViewBrowser) {
         this.view = undefined
      }
   },

   onDidMoveItem({ item }, location) {
      if (item instanceof AtomBrowserViewBrowser) {
         this.dockLocation = location
         atom.config.set(CONFIG_DEFAULT_LOCATION, location)
      }
   },
}
