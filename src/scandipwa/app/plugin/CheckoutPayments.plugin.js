/**
 * @category  Budo
 * @package   Budo_CustomerCreditGraphQl
 * @author    Vitalijs Visnakovs <info@scandiweb.com>
 * @copyright Copyright (c) 2020 Scandiweb, Inc (https://scandiweb.com)
 * @license   http://opensource.org/licenses/OSL-3.0 The Open Software License 3.0 (OSL-3.0)
 */

import CustomerCredit from '../component/CustomerCredit';
export const AW_CREDIT_LIMIT = 'aw_credit_limit';

class CheckoutPaymentsPlugin {
    renderCustomerCredit() {
        const {
            selectedPaymentCode,
            setLoading,
            setDetailsStep
        } = this.props;

        return (
            <CustomerCredit
                setLoading={ setLoading }
                setDetailsStep={ setDetailsStep }
                selectedPaymentCode={ selectedPaymentCode }
            />
        );
    }

    aroundPaymentRenderMap = (originalMember, instance) => {
        return {
            ...originalMember,
            [AW_CREDIT_LIMIT]: this.renderCustomerCredit.bind(instance)
        }
    }
}

const {
    aroundPaymentRenderMap
} = new CheckoutPaymentsPlugin();

const config = {
    'Component/CheckoutPayments/Component': {
        'member-property': {
            'paymentRenderMap': [
                {
                    position: 100,
                    implementation: aroundPaymentRenderMap
                }
            ]
        }
    }
};

export default config;
