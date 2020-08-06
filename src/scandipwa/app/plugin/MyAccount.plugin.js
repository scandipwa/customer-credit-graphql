/**
 * @category  Budo
 * @package   Budo_CustomerCreditGraphQl
 * @author    Vitalijs Visnakovs <info@scandiweb.com>
 * @copyright Copyright (c) 2020 Scandiweb, Inc (https://scandiweb.com)
 * @license   http://opensource.org/licenses/OSL-3.0 The Open Software License 3.0 (OSL-3.0)
 */

import PropTypes from 'prop-types';
import MyAccountCreditLimit from '../component/MyAccountCreditLimit'
export const CREDIT_LIMIT = 'credit-limit';

export class MyAccountComponentPlugin extends ExtensibleClass {
    renderMap = originalMember => ({
        ...originalMember,
        [CREDIT_LIMIT]: MyAccountCreditLimit
    });

    propTypes = originalMember => ({
        ...originalMember,
        activeTab: PropTypes.oneOfType([
            originalMember.activeTab,
            PropTypes.oneOf([CREDIT_LIMIT])
        ])
    });
}

export class MyAccountContainerPlugin extends ExtensibleClass {
    tabMap = originalMember => ({
        ...originalMember,
        [CREDIT_LIMIT]: {
            url: '/credit-limit',
            name: __('Credit Limit')
        }
    });
}

const { renderMap, propTypes } = new MyAccountComponentPlugin();
const { tabMap } = new MyAccountContainerPlugin();

export default {
    'Route/MyAccount/Component': {
        'member-property': {
            renderMap: [
                {
                    position: 100,
                    implementation: renderMap
                }
            ]
        },
        'static-property': { // After update to newer PWA version (beta >4) it should be static-member
            propTypes: [
                {
                    position: 100,
                    implementation: propTypes
                }
            ]
        }
    },
    'Component/MyAccountTabList/Component': {
        'static-property': { // After update to newer PWA version (beta >4) it should be static-member
            propTypes: [
                {
                    position: 100,
                    implementation: propTypes
                }
            ]
        }
    },
    'Route/MyAccount/Container': {
        'member-property': {
            tabMap: [
                {
                    position: 100,
                    implementation: tabMap
                }
            ]
        }
    }
};
