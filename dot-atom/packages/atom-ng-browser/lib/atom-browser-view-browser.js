'use babel';
import { CompositeDisposable, Disposable } from 'atom'
const { remote } = require('electron')
const fs = require('fs')
const ViewNavbar = require('./views/Navbar')
const ViewWebview = require('./views/Webview')

import {
   CONFIG_AUTO_DEVTOOLS,
   CONFIG_AUTO_PREFIX,
   CONFIG_EMITTER_ENABLED,
   CONFIG_RELOAD_DELAY,
   CONFIG_URL_OVERWRITE,
   CONFIG_ZOOM_FACTOR,
} from './atom-browser-confignames'

export default class AtomBrowserViewBrowser {
   constructor({
      defaultLocation,
      showBackground,
      showZoomButtons,
      initialUrl,
      reloadByDefault,
      zoomFactor
   }) {
      this.subscriptions = new CompositeDisposable()
      this.showBackground = showBackground
      this.location = defaultLocation
      this.reloading = false
      this.initialUrl = initialUrl
      this.iframeInfo = {}
      this.uri = 'atom://atom-webview' + Math.random()
      this.openedDevTools = false
      this.zoomFactor = zoomFactor

      this.element = document.createElement('div')
      this.element.setAttribute('id', 'atombrowser-view')
      this.element.innerHTML += ViewNavbar({ reloadByDefault, showZoomButtons, zoomFactor })
      this.element.innerHTML += ViewWebview({ showBackground })

      this.getTitle = () => 'Atom-ng Browser'
      this.getURI = () => this.uri
      this.getDefaultLocation = () => this.location
      this.getAllowedLocations = () => ['bottom', 'right']

      // wait for the html to be appended
      this.html = this.selectHtml()
      this.setListeners()
      this.setURL(this.initialUrl)
   }

   selectHtml() {
      return {
         webview: this.element.querySelector('#atombrowser-webview'),
         webviewError: this.element.querySelector('#atombrowser-webview-failed-load'),
         webviewErrorMessage: this.element.querySelector('#atombrowser-webview-failed-load .message'),
         webviewErrorIcon: this.element.querySelector('#atombrowser-webview-failed-load i'),
         addressbar: this.element.querySelector('#atombrowser-addressbar'),
         zoomBar: this.element.querySelector('.zoom-bar'),
         btnZoomOut: this.element.querySelector('#atombrowser-btn-zoom-out'),
         inputZoom: this.element.querySelector('#atombrowser-input-zoom'),
         btnZoomIn: this.element.querySelector('#atombrowser-btn-zoom-in'),
         btn: {
            reload: this.element.querySelector('#atombrowser-btn-reload'),
            back: this.element.querySelector('#atombrowser-btn-back'),
            devtools: this.element.querySelector('#atombrowser-btn-devtools'),
            livereload: this.element.querySelector('#atombrowser-btn-livereload'),
            tabs: this.element.querySelector('#atombrowser-btn-tabs')
         }
      }
   }

   setListeners() {
      this.subscriptions.add(
         atom.commands.add('atom-workspace', {
            'atom-browser:reload': () => this.reload(),
            'atom-browser:devtools': () => this.devtools()
         }),
      )

      this.html.webview.addEventListener('dom-ready', () => {
         if (!this.openedDevTools && atom.config.get(CONFIG_AUTO_DEVTOOLS)) {
            this.openedDevTools = true
            this.devtoolsShow()
         }
      })

      this.html.webview.addEventListener('did-start-loading', () => {
         this.html.webviewError.style.display = 'none'
         this.html.btn.reload.classList.add('loading')
      })

      this.html.webview.addEventListener('did-stop-loading', () => {
         this.html.btn.reload.classList.remove('loading')
         this.html.addressbar.value = this.html.webview.getURL()
         this.zoomUpdate()
         this.ipcConnect()
      })

      this.html.webview.addEventListener('did-fail-load', (error) => {
         const ERROR_CODE_ABORTED = -3

         if (error.errorCode === ERROR_CODE_ABORTED) return

         this.html.webviewErrorMessage.innerHTML = error.errorDescription
         this.html.webviewErrorMessage.style.textAlign = 'center'
         this.html.webviewErrorIcon.setAttribute('class', 'icon icon-alert')
         this.html.webviewError.style.display = 'block'
      })

      this.html.webview.addEventListener('ipc-message', (event) => {
         // console.log('[ATOM BROWSER] received data', event.channel)
         this.iframeInfo = JSON.parse(event.channel)
      })

      this.html.webview.addEventListener('new-window', async (e) => {
         this.setURL(e.url);
      })

      // url bar
      var lastCall = Date.now()
      this.html.addressbar.addEventListener('paste', (e) => {
         if (Date.now() - lastCall < 100) e.preventDefault()
         lastCall = Date.now()
      })

      this.html.addressbar.addEventListener('keyup', (e) => {
         if (e.key == 'Enter') this.setURL(this.html.addressbar.value)
      })

      // button events Back/Reload/Tools
      this.html.btn.reload.addEventListener('click', () => this.reload())
      this.html.btn.back.addEventListener('click', () => this.back())
      this.html.btn.devtools.addEventListener('click', () => this.devtools())
      this.html.btn.livereload.addEventListener('click', () => {
         var active = !this.html.btn.livereload.classList.contains('active')
         this.html.btn.livereload.classList.toggle('active', active)
      })

      // zoombar
      this.html.btnZoomOut.addEventListener('click', () => this.zoomOut())
      this.html.btnZoomIn.addEventListener('click', () => this.zoomIn())
   }

   isInDom() {
      return document.body.contains(this.element)
   }

   handleDidSave() {
      if (this.isInDom() && this.html.btn.livereload.classList.contains('active')) {
         if (this.reloading) return
         this.reloading = true

         setTimeout(() => {
            this.reload()
            this.reloading = false
         }, atom.config.get(CONFIG_RELOAD_DELAY))
         this.reloading = false
      }
   }

   /*------------------------------------------------------------------------*/
   /*----------------------------| button actions |--------------------------*/
   /*------------------------------------------------------------------------*/
   devtools() {
      if (!this.getWebContents()) return

      this.html.webview.isDevToolsOpened()
         ? this.devtoolsHide()
         : this.devtoolsShow()
   }

   devtoolsShow() {
      this.html.webview.openDevTools()
   }

   devtoolsHide() {
      this.html.webview.closeDevTools()
   }
   /*------------------------------------------------------------------------*/
   /*--------------------------| webview functions |-------------------------*/
   /*------------------------------------------------------------------------*/
   setURL(url) {
      if (url.length === 0) return

      // URL Overrides defined in config
      try {
         const urlOverwrites = JSON.parse(atom.config.get(CONFIG_URL_OVERWRITE))
         for (const overwrite of urlOverwrites) {
            url = url.replace(overwrite.replace, overwrite.with);
         }

      } catch(e) {
         console.error('ATOM-BROWSER: url overwrite error', e)
         atom.notifications.addError('The package `atom-browser` could not parse the setting URL Overwrites. Check to make sure this is valid JSON', {
            dismissable: true,
            buttons: [
               {
                  text: 'Go to settings',
                  onDidClick: () => atom.workspace.open("atom://config/packages/atom-browser")
               }
            ]
         })
      }


      // search google
      if (!url.includes('://') && !url.startsWith('localhost'))
         if (url.indexOf(' ') >= 0 || !url.includes(' ') && !url.includes('.'))
            url = 'https://duckduckgo.com/?q=' + url + '&ie=UTF-8'

      // add http://
      if (!url.includes('://'))
         if (!url.includes('https://') && !url.includes('file://'))
            url = atom.config.get(CONFIG_AUTO_PREFIX) + "://" + url

      this.html.webview.src = ''
      this.html.webview.src = url
      this.html.addressbar.value = url
   }

   reload() {
      if (this.isInDom() && this.getWebContents()) {
         this.ipcDisconnect()
         this.html.webview.reloadIgnoringCache()
      }
   }

   ipcToggle() {
      if (atom.config.get(CONFIG_EMITTER_ENABLED)) {
         this.iframeInfo = {}
         this.ipcConnect()
      } else {
         this.ipcDisconnect()
      }
   }

   ipcConnect() {
      if (atom.config.get(CONFIG_EMITTER_ENABLED)) {
         this.html.webview.executeJavaScript(`
            window.atomBrowserConnectEmitter.setup(
               ${JSON.stringify(this.iframeInfo)}
            )`
         );
      }
   }

   ipcDisconnect() {
      if (atom.config.get(CONFIG_EMITTER_ENABLED)) {
         this.html.webview.executeJavaScript(`
            window.atomBrowserConnectEmitter.disconnect(
               ${JSON.stringify(this.iframeInfo)}
            )`
         );
      }
   }

   back() {
      if (this.getWebContents() && this.html.webview.canGoBack())
         this.html.webview.goBack()
   }

   // zoom
   zoomOut() {
      this.zoomFactor -= 0.1
      this.zoomUpdate()
   }

   zoomIn() {
      this.zoomFactor += 0.1
      this.zoomUpdate()
   }

   zoomSet(zoomFactor) {
      this.zoomFactor = zoomFactor
      this.zoomUpdate()
   }

   zoomUpdate() {
      this.zoomFactor = Math.round(this.zoomFactor * 100)/100
      atom.config.set(CONFIG_ZOOM_FACTOR, this.zoomFactor)
      this.html.inputZoom.value = Math.round(this.zoomFactor * 100) + '%'
      if (this.getWebContents()) {
         this.html.webview.setZoomFactor(this.zoomFactor)
      }
   }

   zoomToggle(showZoomButtons) {
      this.html.zoomBar.classList.toggle('hidden', !showZoomButtons)
   }

   applySettingViewBackground(show) {
      this.showBackground = show
      this.html.webview.classList.toggle('show-background', this.showBackground)
   }

   getWebContents() {
      return this.html.webview && remote.webContents.fromId(this.html.webview.getWebContentsId())
   }

   destroy() {
      this.element.remove()
      this.subscriptions.dispose()
      this.listener && this.listener.destroy()
   }
}
