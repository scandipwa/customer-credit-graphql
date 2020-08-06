/**
 * @category  Budo
 * @package   Budo_CustomerCreditGraphQl
 * @author    Vitalijs Visnakovs <info@scandiweb.com>
 * @copyright Copyright (c) 2020 Scandiweb, Inc (https://scandiweb.com)
 * @license   http://opensource.org/licenses/OSL-3.0 The Open Software License 3.0 (OSL-3.0)
 */

import React from 'react';
import { connect } from 'react-redux';
import DataContainer from 'SourceUtil/Request/DataContainer';
import { fetchMutation, fetchQuery } from 'SourceUtil/Request';
import PropTypes from 'prop-types';
import CustomerCreditQuery from '../../query/CustomerCredit.query';
import CustomerCredit from './CustomerCredit.component';

/** @namespace BNF/CustomerCreditGraphQl/Component/CustomerCredit/Container/mapStateToProps */
export const mapStateToProps = state => ({
    cartTotals: state.CartReducer.cartTotals,
    orderID: PropTypes.string.isRequired
});

/** @namespace BNF/CustomerCreditGraphQl/Component/CustomerCredit/Container */
export class CustomerCreditContainer extends DataContainer {
    state = {
        availableCustomerCredit: {},
        poNumber: ''
    };

    containerFunctions = {
        onChange: this.onChange.bind(this)
    };

    onChange(value) {
        const {
            poNumber
        } = this.state;

        this.setState({ poNumber: value });
    }

    componentDidMount() {
        this.requestAvailableCustomerCredit();
    }

    componentWillUnmount() {
        const {
            poNumber
        } = this.state;

        fetchMutation(CustomerCreditQuery.getSavePoNumber(poNumber));
    }

    requestAvailableCustomerCredit() {
        fetchQuery(
            [CustomerCreditQuery.getAvailableCreditBalanceQuery()]
        ).then(
            /** @namespace BNF/CustomerCreditGraphQl/Component/CustomerCredit/Container/fetchQueryThen */
            ({ availableCustomerCredit }) => this.setState({ availableCustomerCredit })
        );
    }

    render() {
        const { availableCustomerCredit } = this.state;

        return (
            <CustomerCredit
              availableCustomerCredit={ availableCustomerCredit }
              { ...this.containerFunctions }
              { ...this.props }
              { ...this.state }
            />
        );
    }
}

export default connect(
    mapStateToProps
)(
    CustomerCreditContainer
);
