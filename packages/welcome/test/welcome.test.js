/** @babel */
/* global beforeEach, afterEach, describe, it */

import WelcomePackage from '../lib/welcome-package';
import assert from 'assert';
import { conditionPromise } from './helpers';

describe('Welcome', () => {
  let welcomePackage;

  beforeEach(() => {
    welcomePackage = new WelcomePackage();
    atom.config.set('welcome.showOnStartup', true);
  });

  afterEach(() => {
    atom.reset();
  });

  describe("when `core.telemetryConsent` is 'undecided'", () => {
    beforeEach(async () => {
      atom.config.set('core.telemetryConsent', 'undecided');
      await welcomePackage.activate();
    });

    it('opens the telemetry consent pane and the welcome panes', () => {
      const panes = atom.workspace.getCenter().getPanes();
      assert.equal(panes.length, 2);
      assert.equal(panes[0].getItems()[0].getTitle(), 'Telemetry Consent');
      assert.equal(panes[0].getItems()[1].getTitle(), 'Welcome');
      assert.equal(panes[1].getItems()[0].getTitle(), 'Welcome Guide');
    });
  });

  describe('when `core.telemetryConsent` is not `undecided`', () => {
    beforeEach(async () => {
      atom.config.set('core.telemetryConsent', 'no');
      await welcomePackage.activate();
    });

    describe('when activated for the first time', () =>
      it('shows the welcome panes', () => {
        const panes = atom.workspace.getCenter().getPanes();
        assert.equal(panes.length, 2);
        assert.equal(panes[0].getItems()[0].getTitle(), 'Welcome');
        assert.equal(panes[1].getItems()[0].getTitle(), 'Welcome Guide');
      }));

    describe('the welcome:show command', () => {
      it('shows the welcome buffer', async () => {
        atom.workspace
          .getCenter()
          .getPanes()
          .map(pane => pane.destroy());
        assert(!atom.workspace.getActivePaneItem());

        const workspaceElement = atom.views.getView(atom.workspace);
        atom.commands.dispatch(workspaceElement, 'welcome:show');

        await conditionPromise(() => atom.workspace.getActivePaneItem());

        const panes = atom.workspace.getCenter().getPanes();
        assert.equal(panes.length, 2);
        assert.equal(panes[0].getItems()[0].getTitle(), 'Welcome');
      });
    });

    describe('deserializing the pane items', () => {
      describe('when GuideView is deserialized', () => {
        it('remembers open sections', () => {
          const panes = atom.workspace.getCenter().getPanes();
          const guideView = panes[1].getItems()[0];

          guideView.element
            .querySelector('details[data-section="snippets"]')
            .setAttribute('open', 'open');
          guideView.element
            .querySelector('details[data-section="init-script"]')
            .setAttribute('open', 'open');

          const state = guideView.serialize();

          assert.deepEqual(state.openSections, ['init-script', 'snippets']);

          const newGuideView = welcomePackage.createGuideView(state);
          assert(
            !newGuideView.element
              .querySelector('details[data-section="packages"]')
              .hasAttribute('open')
          );
          assert(
            newGuideView.element
              .querySelector('details[data-section="snippets"]')
              .hasAttribute('open')
          );
          assert(
            newGuideView.element
              .querySelector('details[data-section="init-script"]')
              .hasAttribute('open')
          );
        });
      });
    });
  });
});
