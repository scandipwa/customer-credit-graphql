# For people who learn from this extension

> **Note** that you still need the `scandipwa/index.js` file that is mentioned in the documentation. It can get lost (as in this extension) since the NEXT release, which at the moment (11 AUG 2020) is not released.

# Aheadworks Customer Credit extension support for ScandiPWA

> **Note:** To use this functionality you must have the corresponding AheadWorks extension.

### Steps to install:
1. Get, install and configure the AheadWorks "B2B Company Credit - Magento 2" following the guidelines [on the official website](https://aheadworks.atlassian.net/wiki/spaces/EUDOC/pages/1554677774/B2B+Company+Credit+-+Magento+2)
2. Clone this repository into your Magento 2 `app/code` directory
3. Reference this extension from your theme's `scandipwa.json` as `"CustomerCredit": "app/code/customer-credit-graphql"`
4. Compile the theme
