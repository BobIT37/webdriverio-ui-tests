### Requirements
> **Mandatory**
>  - [Node.js](https://nodejs.org/en/) (v16 or higher)

> **Optional**
> - [Chrome](https://www.google.com/chrome/downloads/)
> - [Edge](https://www.microsoft.com/en-us/edge)
> - [Firefox](https://www.mozilla.org/en-US/firefox/products/)
> - [Safari](https://support.apple.com/downloads/safari)
> - [Docker](https://www.docker.com/products/docker-desktop/)
> - [Docker Compose](https://docs.docker.com/compose/install/)

### Installation
After all requirements are satisfied:
- Open up your terminal.
- Clone this repository to your local machine with `git clone git@gitlab.com:ownbackup.git` in your terminal command.
- Change your directory to the cloned project via `cd ds-qa-tests`
- Type `npm install yarn -g` to your terminal and hit enter.
- Type `yarn install` to your terminal and hit enter.

  - Create `screenshots`, `report` folders in the root directory of the project if it is not exist.

All of the required modules and dependecies have been installed by doing above steps.

### Running Tests

- ##### Normal Mode
  Normal mode requires browser installation which browser you want to run its tests. In normal mode, automated tests will be visible to user (you) in user's screen.
- ##### Safari Automation 
  - Preferences > Advanced > Enable `Show Develop menu in menu bar`
  - Develop > `Enable Remote Automation`

- **Available commands:**
  - yarn visible `<chrome | edge | safari | firefox>`
    **Examples:**
    - yarn visible chrome
    - yarn visible edge
    - yarn visible safari

- ##### Headless mode
  This mode does not require browser installation.
  > Safari does not support headless mode.

  **Available commands:**
  - yarn headless `<chrome | edge | firefox>`
    **Examples:**
    - yarn headless chrome
    - yarn headless edge
    - yarn headless firefox

- ##### Multibrowser mode
  This mode may require browser installation depending on visibility.

  **Available commands:**
    **Examples:**
    - yarn headless chrome edge firefox
    - yarn visible chrome edge safari

- ##### Docker mode
  This mode requires Docker and optionally Docker Compose. You can find the relevant links above. To run the project in docker do the followings:

  ### Run with M1 Mac
    To run project with M1 mac, you need to enable some features in docker.
      - Docker > Settings > General
        - Check "Use Virtualization framework" option
      - Docker > Settings > Features in development
        - Check "Use Rosetta for x86/amd64 emulation on Apple Silicon" option
      Apply and restart Docker

  - Open up your terminal.
  - Change your current directory to this project's directory.
  - There are two options:
    - Type `docker compose up -d` and hit enter and tests will be running.