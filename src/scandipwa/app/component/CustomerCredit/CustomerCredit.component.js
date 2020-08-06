/**
 * @category  Budo
 * @package   Budo_CustomerCreditGraphQl
 * @author    Vitalijs Visnakovs <info@scandiweb.com>
 * @copyright Copyright (c) 2020 Scandiweb, Inc (https://scandiweb.com)
 * @license   http://opensource.org/licenses/OSL-3.0 The Open Software License 3.0 (OSL-3.0)
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import './CustomerCredit.style';
import { formatCurrency } from 'SourceUtil/Price';
import Field from 'SourceComponent/Field';

class CustomerCredit extends PureComponent {
    static propTypes = {
        cartTotals: PropTypes.shape({}).isRequired,
        availableCustomerCredit: PropTypes.shape({
            amount: PropTypes.number,
            enough_credit: PropTypes.bool
        }).isRequired,
        poNumber: PropTypes.string,
        onChange: PropTypes.func.isRequired
    };

    renderNotEnoughFunds() {
        return (
            <div block="CustomerCredit" className="NotEnoughBalance">
                { __('Insufficient credit funds') }
            </div>
        );
    }

    render() {
        const { availableCustomerCredit, cartTotals, poNumber, onChange } = this.props;
        const { amount, enough_credit } = availableCustomerCredit;

        return (
            <div block="CustomerCredit">
                <div block="CustomerCredit" elem="Form" className="CustomerCreditInfo">
                    { __('Purchase Order Number') }
                </div>
                <Field
                    type="text"
                    name="po_number"
                    id="po_number"
                    placeholder={ __('Purchase Order Number') }
                    value={poNumber}
                    onChange={onChange}
                />
                <div block="CustomerCredit" className="AvailableCreditBalance">
                    { __('Available Credit Balance:') }
                    { ` ${formatCurrency(cartTotals.quote_currency_code)}${amount}` }
                </div>
                { !enough_credit ? this.renderNotEnoughFunds() : '' }
            </div>
        );
    }
}

export default middleware(CustomerCredit, 'Component/CustomerCredit/Component');
