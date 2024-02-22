/** @babel */

import { CompositeDisposable } from 'atom';

let StoryView;

const STORY_URI = 'atom://story';

export default class StoryPackage {
  async activate() {
    this.subscriptions = new CompositeDisposable();

    this.subscriptions.add(
      atom.workspace.addOpener(filePath => {
        if (filePath === STORY_URI) {
          return this.createStoryView({ uri: STORY_URI });
        }
      })
    );

    this.subscriptions.add(
      atom.commands.add('atom-workspace', 'story:show', () =>
        this.showStory()
      )
    );

    if (atom.config.get('story.showOnStartup')) {
      await this.showStory();
    }
  }

  showStory() {
    return Promise.all([
      atom.workspace.open(STORY_URI)
    ]);
  }

  deactivate() {
    this.subscriptions.dispose();
  }

  createStoryView(state) {
    if (StoryView == null) StoryView = require('./story-view');
    return new StoryView(state);
  }
}
