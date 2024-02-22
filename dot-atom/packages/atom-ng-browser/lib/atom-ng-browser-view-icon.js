'use babel';

const ViewIcon = require('./views/Icon')

export default class AtomBrowserViewIcon {
   constructor({ onClick }) {
      const template = document.createElement('template')
      template.innerHTML = ViewIcon()
      this.element = template.content.firstChild

      this.element.addEventListener('click', () => {
         onClick()
      })
   }

   destroy() {
      this.element.remove()
   }
}
