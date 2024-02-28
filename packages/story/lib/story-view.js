/** @babel */
/** @jsx etch.dom **/

          /** <footer className="story-footer">
          <section className="story-panel">
            <label>
              <input
                className="input-checkbox"
                type="checkbox"
                checked={atom.config.get('story.showOnStartup')}
                onchange={this.didChangeShowOnStartup}
              />
              Show Story View when opening Atom-ng
            </label>
          </section>
          </footer> **/

import etch from 'etch';

const STORY_URL = 'atom://story/';
const path = require('path');

export default class StoryView {
  constructor(props) {
    this.props = props;
    
    this.didClickImage1 = this.didClickImage1.bind(this);
    this.didClickImage2 = this.didClickImage2.bind(this);
    this.didClickImage3 = this.didClickImage3.bind(this);
    this.didClickImage4 = this.didClickImage4.bind(this);
    this.didClickImage5 = this.didClickImage5.bind(this);
    
    etch.initialize(this);
  }

  didChangeShowOnStartup() {
    atom.config.set('story.showOnStartup', this.checked);
  }

  update() {}

  serialize() {
    return {
      deserializer: 'StoryView',
      uri: this.props.uri
    };
  }

  render() {
    return (
      <div className="story">
        <div className="story-container">
          <header className="story-header">
              <h1 className="story-title">
                Atom&#39;s History
              </h1>
          <div className="story-option">
          <section className="story-panel">
            <label className="label2">
              <input
                className="input-checkbox"
                type="checkbox"
                checked={atom.config.get('story.showOnStartup')}
                onchange={this.didChangeShowOnStartup}
              />
              Show Atom&#39;s History when opening Atom-ng
            </label>
          </section>
          </div>
              <figure class="fig">Celebrating Atom&#39;s 1.0 release</figure>
              <a name="1"><img class="story-image" onclick={this.didClickImage1} title="Atom 1.0!" src="atom://story/assets/atom_1.0.png"></img></a>
              <figure class="fig">Major Atom milestones</figure>
              <a name="2"><img class="story-image" onclick={this.didClickImage2} title="Atom History" src="atom://story/assets/atom_history.png"></img></a>
              <figure class="fig">Atom Nightly is born</figure>
              <a name="3"><img class="story-image" onclick={this.didClickImage3} title="Atom Nightly" src="atom://story/assets/Atom_Nightly.jpeg"></img></a>
              <figure class="fig">Atom integrates with GitHub</figure>
              <a name="4"><img class="story-image" onclick={this.didClickImage4} title="GitHub for Atom" src="atom://story/assets/GitHub_for_Atom.png"></img></a>
              <figure class="fig">OctoCat Rocket!</figure>
              <a name="5"><img class="story-image story-image-smaller" onclick={this.didClickImage5} title="OctoCat Rocket" src="atom://story/assets/Octocat_Rocket.png"></img></a>
          </header>
        </div>
      </div>
    );
  }

  getURI() {
    return this.props.uri;
  }

  getTitle() {
    return "Atom's History";
  }

  isEqual(other) {
    return other instanceof StoryView;
  }

  getIconName() {
    return 'star';
  }

  didClickImage1(e) {
	e.preventDefault();
    atom.workspace.open(path.join(process.resourcesPath, 'app.asar', 'node_modules', 'story', 'assets', 'atom_1.0.png'));
  }
  didClickImage2(e) {
	e.preventDefault();
    atom.workspace.open(path.join(process.resourcesPath, 'app.asar', 'node_modules', 'story', 'assets', 'atom_history.png'));
  }
  didClickImage3(e) {
	e.preventDefault();
    atom.workspace.open(path.join(process.resourcesPath, 'app.asar', 'node_modules', 'story', 'assets', 'Atom_Nightly.jpeg'));
  }
  didClickImage4(e) {
	e.preventDefault();
    atom.workspace.open(path.join(process.resourcesPath, 'app.asar', 'node_modules', 'story', 'assets', 'GitHub_for_Atom.png'));
  }
  didClickImage5(e) {
	e.preventDefault();
    atom.workspace.open(path.join(process.resourcesPath, 'app.asar', 'node_modules', 'story', 'assets', 'Octocat_Rocket.png'));
  }
};
