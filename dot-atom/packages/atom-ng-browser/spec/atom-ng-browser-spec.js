'use babel';

import {
   CONFIG_WEBVIEW_BACKGROUND,
   CONFIG_DEFAULT_LOCATION,
   CONFIG_INITIAL_URL,
   CONFIG_SHOW_ICON,
} from '../lib/atom-browser-confignames'

var element

describe("atom browser tests", function() {
   beforeEach(function() {
      waitsForPromise(() => atom.packages.activatePackage('atom-ng-browser'))
      waitsForPromise(() => atom.commands.dispatch(
         atom.views.getView(atom.workspace),
         'atom-ng-browser:show'
      ))

      waitsFor(() => {
         element = atom.workspace.element.querySelector('#atombrowser-view')
         return element
      })
   })

   afterEach(function() {
      atom.packages.disablePackage('atom-ng-browser')
   })

   it("atom browser exists", function() {
      expect(element).toBeDefined()
   })

   it("changing location config moves dock", function() {
      atom.config.set(CONFIG_DEFAULT_LOCATION, 'bottom')
      expect(whatDockIsAtomBrowserActuallyIn()).toBe('bottom')

      atom.config.set(CONFIG_DEFAULT_LOCATION, 'right')
      expect(whatDockIsAtomBrowserActuallyIn()).toBe('right')
   })
})

function whatDockIsAtomBrowserActuallyIn() {
   for (var item of atom.workspace.getPaneItems()) {
      if (item.constructor.name === 'AtomBrowserViewBrowser') {
         return atom.workspace.paneForItem(item).parent.location
      }
   }

   return false
}
