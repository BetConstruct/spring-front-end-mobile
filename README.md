# BetConstruct's Reactive Sportsbook 

### Directory structure

* **dev** - main development code
    subdirectories:
    - **actions** - all redux action creators are here (both sync and async)
    - **components** - react components that can be used both in desktop and mobile versions
      - **config** - main(default) config file(s)
      - **constants** - constant definitions
      - **helpers** - helper modules and functions
      - **images** - common images(used both for mobile and desktop)
      - **index** - directory contains application entry point scripts
      - **mixins** - react mixins and HOC(wrapper Higer Order Components)
      - **mobile** 
      subdirectories:
        - **components** - components used in mobile version only
        - **containers** - container components used in mobile version only
        - **fonts** - fonts for mobile version
        - **scss** - common sass styles for mobile version
      - **reducers** - all redux store reducers are here
      - **resources** - font and image resources (not directly used in code, but needed for development)
      - **scss** - common sass styles (both for mobile and desktop versions)
* **scripts** - helper scripts (translation generation, deployment, etc.)
* **skins** - all skin related files(config and mobile/desktop styles) are in subdirectories having corresponding skin names
* **src** - generated sources ready for deployment  
     

### Component structure
Each component is a directory with the following files:
 
 * **index.js** - file containing component definition and main code.
 * **template.js** (optional) - component template(html). If component is small or doesn't have a presentational part this file can be omitted 
 * **style.scss** (optional) - component scss styles
 
 template.js and style.scss are imported to component automatically. See next section for details.

### Build process
We use [Webpack](https://webpack.github.io/) to build and bundle our code.
There are 2 webpack configurations:

 * webpack.vendor.config.js - webpack config for creating the "vendor" bundle (bundle containing all 3rd party libs)
 * webpack.mobile.config.js - webpack config for creating the main mobile code bundle and generating all the files ready for deployment. 
 With help of DllReferencePlugin It uses vendor bundle created using  webpack.vendor.config.js. 
 
 The reason for separating the builds is the better long-term caching (libs code doesn't change often, so it makes sense to keep and cache them separately. In case of application changes only application code bundle will be changed.)
 
 Component templates and styles are imported automatically with help of Webpack's [Baggage loader](https://github.com/deepsweet/baggage-loader) plugin. 
 
### Running tasks 
 npm or yarn can be used to run tasks from package.json
 the following tasks are available:
 
 * **build-vendor** - builds vendor bundle
 * **build-vendor-dev** - builds vendor bundle in development mode
 * **build-mobile** - builds main mobile application bundle (vendor bundle must have been already built)
 * **build-all-mobile** - builds vendor bundle then mobile application bundle
 * **start** - starts development webserver (vendor bundle must have been already built to run application)
 * **download-translations** - downloads skin translation json files from translation tool. 
 * **extract-translations** - scans the whole code for translateable strings and generates eng.po file which can be used in translation tools.

### Reusing components
Components can be reused to build a custom frontend. 
To be able to use them the following dependencies have to be satisfied:

Project must be based on React and Redux (as most components are redux [connect](https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options)ed)
[React-router](https://github.com/ReactTraining/react-router)  must be used for routing to use components which depend on route and <Link/> component.
Webpack with [Baggage loader](https://github.com/deepsweet/baggage-loader) plugin must be used or some other solution to automatically import template and style files into component.

### Internationalization
Translations are loaded from .json files during application bootstrap.
There's a script to extract all translatable strings from the code. It can be run with  npm run extract-translations which just executes scripts/trans/extractTranslations.js and redirects output to file. After extraction a file in [PO](https://www.gnu.org/software/gettext/manual/html_node/PO-Files.html) format is generated. 
It can be then edited with available translation tools(BetConstruct has a web-based one, or [Poedit](https://poedit.net/)). 
If using BetConstruct's translation tool, it will automatically deploy needed .json files to application folder. If using another editor, there's a script in scripts/trans/generateTranslations.js to generate .json files from .po. 
Generated files have to be placed in application root folder.

### Local(development) configuration
When running on development server alternative configuration can be used for development purposes. 
If server's hostname is *localhost*, configuration will be loaded from *src/conf.local.json* file
