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
import MyAccountCreditLimit from './MyAccountCreditLimit.component';
import CustomerCreditQuery from '../../query/CustomerCredit.query';
import { fetchQuery } from 'SourceUtil/Request';

class MyAccountCreditLimitContainer extends DataContainer {
    state = {
        creditLimit: []
    };

    componentDidMount() {
        fetchQuery(CustomerCreditQuery.getCreditTransactionsQuery()).then(
            ({ creditLimit }) => this.setState({ creditLimit })
        );
    }

    render() {
        return (
            <MyAccountCreditLimit
                { ...this.state }
            />
        )
    }
}

export default connect(null, null)(
    middleware (MyAccountCreditLimitContainer, 'BNF/CustomerCreditGraphQl/Component/MyAccountCreditLimit/Container')
);
