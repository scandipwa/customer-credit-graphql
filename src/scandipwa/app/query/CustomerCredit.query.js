/**
 * @category  ScandiPWA
 * @package   ScandiPWA_CustomerCreditGraphQl
 * @author    Vitalijs Visnakovs <info@scandiweb.com>
 * @copyright Copyright (c) 2020 Scandiweb, Inc (https://scandiweb.com)
 * @license   http://opensource.org/licenses/OSL-3.0 The Open Software License 3.0 (OSL-3.0)
 */

import { Field } from 'SourceUtil/Query';

/** @namespace ScandiPWA/CustomerCreditGraphQl/Query */
export class CustomerCreditQuery {
    getSavePoNumber(poNumber) {
        return new Field('savePoNumber')
            .addArgument('po_number', 'String', poNumber);
    }

    getAvailableCreditBalanceQuery() {
        return new Field('customer_credit')
            .addFieldList([
                'amount',
                'enough_credit'
            ])
            .setAlias('availableCustomerCredit');
    }

    getCreditTransactionsQuery() {
        return new Field('creditLimit')
            .addFieldList([
                'date',
                'action',
                'amount',
                'credit_balance',
                'available_credit',
                'credit_limit',
                'purchase_order',
                'comment'
            ]);
    }
}

export default new CustomerCreditQuery();
