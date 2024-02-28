const { Disposable } = require('atom');
const etch = require('etch');
const { shell } = require('electron');
const AtomLogo = require('./atom-logo');
const EtchComponent = require('../etch-component');
const UpdateView = require('./update-view');

const $ = etch.dom;

module.exports = class AboutView extends EtchComponent {
  handleAtomVersionClick(e) {
    e.preventDefault();
    atom.clipboard.write(this.props.currentAtomVersion);
  }

  handleElectronVersionClick(e) {
    e.preventDefault();
    atom.clipboard.write(this.props.currentElectronVersion);
  }

  handleChromeVersionClick(e) {
    e.preventDefault();
    atom.clipboard.write(this.props.currentChromeVersion);
  }

  handleNodeVersionClick(e) {
    e.preventDefault();
    atom.clipboard.write(this.props.currentNodeVersion);
  }

  handleV8VersionClick(e) {
    e.preventDefault();
    atom.clipboard.write(this.props.currentV8Version);
  }

  handleUserDataDirClick(e) {
    e.preventDefault();
    atom.clipboard.write(this.props.userDataDir);
  }

  handleAtomHomeClick(e) {
    e.preventDefault();
    atom.clipboard.write(this.props.atomHome);
  }

  handleReleaseNotesClick(e) {
    e.preventDefault();
    shell.openExternal(
      this.props.updateManager.getReleaseNotesURLForAvailableVersion()
    );
  }

  handleLicenseClick(e) {
    e.preventDefault();
    atom.commands.dispatch(
      atom.views.getView(atom.workspace),
      'application:open-license'
    );
  }

  handleTermsOfUseClick(e) {
    e.preventDefault();
    shell.openExternal('https://docs.github.com/articles/github-terms-of-service');
  }

  handleHowToUpdateClick(e) {
    e.preventDefault();
    shell.openExternal(
      'https://flight-manual-atom-io.github.io/getting-started/sections/installing-atom/'
    );
  }

  handleShowMoreClick(e) {
    e.preventDefault();
    var showMoreDiv = document.querySelector('.show-more');
    var showMoreText = document.querySelector('.about-more-expand');
    switch (showMoreText.textContent) {
      case 'Show more':
        showMoreDiv.classList.toggle('hidden');
        showMoreText.textContent = 'Hide';
        break;
      case 'Hide':
        showMoreDiv.classList.toggle('hidden');
        showMoreText.textContent = 'Show more';
        break;
    }
  }

  handleShowOctocatClick(e) {
    e.preventDefault();
    var showOctocatDiv = document.querySelector('.show-octocat');
    var showOctocatText = document.querySelector('.about-octocat-expand');
    switch (showOctocatText.textContent) {
      case 'Show Octocat!':
        showOctocatDiv.classList.toggle('hide');
        showOctocatText.textContent = 'Hide Octocat';
        break;
      case 'Hide Octocat':
        showOctocatDiv.classList.toggle('hide');
        showOctocatText.textContent = 'Show Octocat!';
        break;
    }
  }

  render() {
    return $.div(
      { className: 'pane-item native-key-bindings about' },
      $.div(
        { className: 'about-container' },
        $.header(
          { className: 'about-header' },
          $.a(
            { className: 'about-atom-io', title: 'Atom-ng Banner (Click to go to Atom-ng\'s Homepage)', href: 'https://thorium.rocks/atom-ng/' },
            $(AtomLogo)
          ),
          $.div(
            { className: 'about-header-info' },
            $.span(
              {
                className: 'about-version-container inline-block atom',
                onclick: this.handleAtomVersionClick.bind(this)
              },
              $.span(
                { className: 'about-version', title: 'Atom-ng Version' },
                `${this.props.currentAtomVersion} ${process.arch}`
              ),
              $.span({ className: 'icon icon-clippy about-copy-version' })
            ),
            $.a(
              {
                className: 'about-header-release-notes',
                onclick: this.handleReleaseNotesClick.bind(this)
              },
              'Release Notes'
            )
          ),
          $.span(
            {
              className:
                'about-version-container inline-block show-more-expand',
              onclick: this.handleShowMoreClick.bind(this)
            },
            $.span({ className: 'about-more-expand' }, 'Show more')
          ),
          $.div(
            { className: 'show-more hidden about-more-info' },
            $.div(
              { className: 'about-more-info' },
              $.span(
                {
                  className: 'about-version-container inline-block electron',
                  onclick: this.handleElectronVersionClick.bind(this)
                },
                $.span(
                  { className: 'about-more-version' },
                  `Electron: ${this.props.currentElectronVersion} `
                ),
                $.span({ className: 'icon icon-clippy about-copy-version', title: 'Copy Electron Version' })
              )
            ),
            $.div(
              { className: 'about-more-info' },
              $.span(
                {
                  className: 'about-version-container inline-block chrome',
                  onclick: this.handleChromeVersionClick.bind(this)
                },
                $.span(
                  { className: 'about-more-version' },
                  `Chromium: ${this.props.currentChromeVersion} `
                ),
                $.span({ className: 'icon icon-clippy about-copy-version', title: 'Copy Chromium Version' })
              )
            ),
            $.div(
              { className: 'about-more-info' },
              $.span(
                {
                  className: 'about-version-container inline-block node',
                  onclick: this.handleNodeVersionClick.bind(this)
                },
                $.span(
                  { className: 'about-more-version' },
                  `Node: ${this.props.currentNodeVersion} `
                ),
                $.span({ className: 'icon icon-clippy about-copy-version', title: 'Copy NodeJS Version' })
              )
            ),
            $.div(
              { className: 'about-more-info' },
              $.span(
                {
                  className: 'about-version-container inline-block v8',
                  onclick: this.handleV8VersionClick.bind(this)
                },
                $.span(
                  { className: 'about-more-version' },
                  `V8: ${this.props.currentV8Version} `
                ),
                $.span({ className: 'icon icon-clippy about-copy-version', title: 'Copy V8 Version' })
              )
            ),
            $.div(
              { className: 'about-more-info' },
              $.span(
                {
                  className: 'about-version-container inline-block userdatadir',
                  onclick: this.handleUserDataDirClick.bind(this)
                },
                $.span(
                  { className: 'about-more-version' },
                  `Electron User Data Dir: ${this.props.userDataDir} `
                ),
                $.span({ className: 'icon icon-clippy about-copy-version', title: 'Copy Electron User Data Dir' })
              )
            ),
            $.div(
              { className: 'about-more-info' },
              $.span(
                {
                  className: 'about-version-container inline-block atomhome',
                  onclick: this.handleAtomHomeClick.bind(this)
                },
                $.span(
                  { className: 'about-more-version' },
                  `Atom Config Dir: ${this.props.atomHome} `
                ),
                $.span({ className: 'icon icon-clippy about-copy-version', title: 'Copy Atom Config Dir' })
              )
            )
          )
        )
      ),

      $(UpdateView, {
        updateManager: this.props.updateManager,
        availableVersion: this.props.availableVersion,
        viewUpdateReleaseNotes: this.handleReleaseNotesClick.bind(this),
        viewUpdateInstructions: this.handleHowToUpdateClick.bind(this)
      }),

      $.div(
        { className: 'about-actions group-item' },
        $.div(
          { className: 'btn-group' },
          $.button(
            {
              className: 'btn view-license',
              onclick: this.handleLicenseClick.bind(this)
            },
            'License'
          ),
          $.button(
            {
              className: 'btn terms-of-use',
              onclick: this.handleTermsOfUseClick.bind(this)
            },
            'Terms of Use'
          )
        )
      ),

      $.div(
        { className: 'about-love group-start' },
        $.span({ className: 'icon icon-code' }),
        $.span({ className: 'inline' }, ' with '),
        $.span({ className: 'icon icon-heart' }),
        $.span({ className: 'inline' }, ' by '),
        $.a(
          { className: 'author', title: 'Author', href: 'https://github.com/Alex313031/' },
          'Alex313031'
        )
      ),

      $.div(
        { className: 'about-credits group-item group-item-end' },
        $.span({ className: 'inline' }, 'And with care by '),
        $.a(
          { className: 'author', title: 'GitHub', href: 'https://github.com/' },
          'GitHub'
        )
      ),

      $.div(
        { className: 'about-octocat group-item-octocat' },
        $.span({ className: 'inline about-octocat-expand', onclick: this.handleShowOctocatClick.bind(this) }, 'Show Octocat!'),
        $.div({ className: 'octocat hide show-octocat', title: "Octocat" })
      )      
    );
  }

  serialize() {
    return {
      deserializer: this.constructor.name,
      uri: this.props.uri
    };
  }

  onDidChangeTitle() {
    return new Disposable();
  }

  onDidChangeModified() {
    return new Disposable();
  }

  getTitle() {
    return 'About';
  }

  getIconName() {
    return 'info';
  }
};
