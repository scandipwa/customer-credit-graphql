/**
 * @category  ScandiPWA
 * @package   ScandiPWA_CustomerCreditGraphQl
 * @author    Vitalijs Visnakovs <info@scandiweb.com>
 * @copyright Copyright (c) 2020 Scandiweb, Inc (https://scandiweb.com)
 * @license   http://opensource.org/licenses/OSL-3.0 The Open Software License 3.0 (OSL-3.0)
 */

import React from 'react';
import PropTypes from 'prop-types';
import './MyAccountCreditLimit.style';
import isMobile from 'SourceUtil/Mobile';

/** @namespace ScandiPWA/CustomerCreditGraphQl/Component/MyAccountCreditLimit/Component */
export class MyAccountCreditLimit extends PureComponent {
    static propTypes = {
        creditLimit: PropTypes.arrayOf(
            PropTypes.shape({
                date: PropTypes.string,
                action: PropTypes.string,
                amount: PropTypes.string,
                credit_balance: PropTypes.string,
                available_credit: PropTypes.string,
                credit_limit: PropTypes.string,
                purchase_order: PropTypes.string,
                comment: PropTypes.string
            })
        ).isRequired
    };

    renderTransactionsList() {
        const { creditLimit } = this.props;

        if (!creditLimit.length) {
            return this.renderNoTransactions();
        }

        return (
            creditLimit.map((data, key) => {
                const {
                    date,
                    action,
                    amount,
                    credit_balance,
                    available_credit,
                    credit_limit,
                    purchase_order,
                    comment
                } = data;

                return (
                    <tr block="MyAccountTransactionTableRow" key={ key }>
                        <td>{ date }</td>
                        <td>{ action }</td>
                        <td className={ amount.startsWith('-') ? 'Negative' : 'Positive' }>{ amount }</td>
                        <td block="hidden-mobile">{ credit_balance }</td>
                        <td block="hidden-mobile">{ available_credit }</td>
                        <td block="hidden-mobile">{ credit_limit }</td>
                        <td block="hidden-mobile">{ purchase_order }</td>
                        <td block="hidden-mobile">{ comment }</td>
                    </tr>
                );
            })
        );
    }

    renderNoTransactions() {
        return (
            <tr block="MyAccountCreditLimit" elem="NoTransactions">
                <td colSpan={ isMobile.any() ? 3 : 8 }>{ __('You have no credits.') }</td>
            </tr>
        );
    }

    renderCreditLimitOverall() {
        const { creditLimit } = this.props;

        if (!creditLimit.length) {
            return;
        }

        return (
            creditLimit.slice(0, 1).map((data, key) => {
                const {
                    credit_balance,
                    available_credit,
                    credit_limit
                } = data;

                return (
                    <div block="MyAccountTransactionOverall" key={ key }>
                        <div className="OverallColumn">
                            <div className="OverallHeading">{ __('Credit Balance:') }</div>
                            <div className="OverallData">{ credit_balance }</div>
                        </div>
                        <div className="OverallColumn">
                            <div className="OverallHeading">{ __('Available Credit:') }</div>
                            <div className="OverallData">{ available_credit }</div>
                        </div>
                        <div className="OverallColumn">
                            <div className="OverallHeading">{ __('Credit Limit:') }</div>
                            <div className="OverallData">{ credit_limit }</div>
                        </div>
                    </div>
                );
            })
        );
    }

    renderTable() {
        return (
            <>
                <div block="MyAccountCreditLimit" className="CreditLimit-Heading">
                    { __('Balance History') }
                </div>
                <table block="MyAccountCreditLimit" elem="Table">
                    <thead>
                    <tr>
                        <th>{ __('Date') }</th>
                        <th>{ __('Action') }</th>
                        <th>{ __('Amount') }</th>
                        <th block="hidden-mobile">{ __('Credit Balance') }</th>
                        <th block="hidden-mobile">{ __('Available Credit') }</th>
                        <th block="hidden-mobile">{ __('Credit Limit') }</th>
                        <th block="hidden-mobile">{ __('Purchase Order') }</th>
                        <th block="hidden-mobile">{ __('Comment') }</th>
                    </tr>
                    </thead>
                    <tbody>
                        { this.renderTransactionsList() }
                    </tbody>
                </table>
            </>
        );
    }

    render() {
        return (
            <div block="MyAccountCreditLimit">
                { this.renderCreditLimitOverall() }
                { this.renderTable() }
            </div>
        );
    }
}

export default MyAccountCreditLimit;
