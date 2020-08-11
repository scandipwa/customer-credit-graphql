# For people who learn from this extension

> **Note** that you still need the `scandipwa/index.js` file that is mentioned in the documentation. It can get lost (as in this extension) since the NEXT release, which at the moment (11 AUG 2020) is not released.

Steps to transform:
1. Initialise the composer repo - composer init + populate the `composer.json`
2. Setup eslint - install eslint, take .eslintrc from THIS REPOSITORY
3. Transform the code with the eslint plugin - `npm run eslint:fix`, remember to validate all the automated changes during this step. Manually fix all issues that eslint notices and is unable to fix automatically.
4. Change every BNF mention to ScandiPWA: namespaces, licence comments, PHP code, XML files, etc.
5. Refactor BE-related code: move to src/ directory corresponding to ScandiPWA guidelines. Provide the `autoload` section in order for files to be discoverable.
6. Make sure all your code is ScandiPWA coding style-compliant. No imports from Source* etc.
7. Rename the extension if this is necessary
8. Write a comprehensive installation guide in `README`.

See the commit history to find out more about each step, with live examples.

# Aheadworks Customer Credit extension support for ScandiPWA

> **Note:** To use this functionality you must have the corresponding AheadWorks extension.

### Steps to install:
1. Get, install and configure the AheadWorks "B2B Company Credit - Magento 2" following the guidelines [on the official website](https://aheadworks.atlassian.net/wiki/spaces/EUDOC/pages/1554677774/B2B+Company+Credit+-+Magento+2)
2. Clone this repository into your Magento 2 `app/code` directory
3. Reference this extension from your theme's `scandipwa.json` as `"CustomerCredit": "app/code/customer-credit-graphql"`
4. Compile the theme
