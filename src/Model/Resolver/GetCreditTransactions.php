<?php
/**
 * @category  ScandiPWA
 * @package   ScandiPWA_CustomerCreditGraphQl
 * @author    Vitalijs Visnakovs <info@scandiweb.com>
 * @copyright Copyright (c) 2020 Scandiweb, Inc (https://scandiweb.com)
 * @license   http://opensource.org/licenses/OSL-3.0 The Open Software License 3.0 (OSL-3.0)
 */

namespace ScandiPWA\CustomerCreditGraphQl\Model\Resolver;

use Aheadworks\CreditLimit\Model\Source\Transaction\Action;
use Magento\Framework\Exception\LocalizedException;
use Magento\Framework\GraphQl\Config\Element\Field;
use Magento\Framework\GraphQl\Query\Resolver\ContextInterface;
use Magento\Framework\GraphQl\Query\Resolver\Value;
use Magento\Framework\GraphQl\Query\ResolverInterface;
use Magento\Framework\GraphQl\Schema\Type\ResolveInfo;
use Aheadworks\CreditLimit\Model\TransactionRepository;
use Magento\Framework\Api\SearchCriteriaBuilder;
use Magento\Framework\Api\SortOrderBuilder;
use Aheadworks\CreditLimit\ViewModel\Transaction\Formatter;
use Psr\Log\LoggerInterface;

/**
 * Class GetCreditTransactions
 *
 * @package ScandiPWA\CustomerCreditGraphQl\Model\Resolver
 */
class GetCreditTransactions implements ResolverInterface
{
    /**
     * @var TransactionRepository
     */
    protected $transactionRepository;

    /**
     * @var SearchCriteriaBuilder
     */
    protected $searchCriteriaBuilder;

    /**
     * @var Formatter
     */
    protected $formatter;

    /**
     * @var LoggerInterface
     */
    protected $logger;

    /**
     * @var SortOrderBuilder
     */
    protected $sortOrderBuilder;

    /**
     * GetCreditTransactions constructor.
     *
     * @param TransactionRepository $transactionRepository
     * @param SearchCriteriaBuilder $searchCriteriaBuilder
     * @param SortOrderBuilder      $sortOrderBuilder
     * @param Formatter             $formatter
     * @param LoggerInterface       $logger
     */
    public function __construct(
        TransactionRepository $transactionRepository,
        SearchCriteriaBuilder $searchCriteriaBuilder,
        SortOrderBuilder $sortOrderBuilder,
        Formatter $formatter,
        LoggerInterface $logger
    ) {
        $this->transactionRepository = $transactionRepository;
        $this->searchCriteriaBuilder = $searchCriteriaBuilder;
        $this->sortOrderBuilder = $sortOrderBuilder;
        $this->formatter = $formatter;
        $this->logger = $logger;
    }

    /**
     * Get info about customer transaction
     *
     * @param Field            $field
     * @param ContextInterface $context
     * @param ResolveInfo      $info
     * @param array|null       $value
     * @param array|null       $args
     *
     * @return array|Value|mixed
     */
    public function resolve(Field $field, $context, ResolveInfo $info, array $value = null, array $args = null)
    {
        return $this->getTransactionsData($context);
    }

    /**
     * @param ContextInterface $context
     *
     * @return array
     */
    public function getTransactionsData($context)
    {
        $transactions = [];
        $criteria = $this->searchCriteriaBuilder
            ->addFilter('customer_id', $context->getUserId())
            ->setSortOrders(
                [$this->sortOrderBuilder->setField('id')->setDirection('asc')->create()]
            )
            ->create();

        try {
            foreach ($this->transactionRepository->getList($criteria)->getItems() as $transaction) {
                $transactions[] = [
                    'date' => date('M j, Y g:i:s A', strtotime($transaction->getCreatedAt())),
                    'action' => $this->formatter->formatTransactionAction($transaction->getAction())->getText(),
                    'amount' => ($transaction->getAction() !== Action::CREDIT_LIMIT_ASSIGNED) ?
                        $this->formatPrice($transaction->getAmount(), $transaction->getActionCurrency()) : '',
                    'credit_balance' => $this->formatter->formatPrice(
                        $transaction->getCreditBalance(), $transaction->getActionCurrency()
                    ),
                    'available_credit' => $this->formatPrice(
                        $transaction->getCreditAvailable(),
                        $transaction->getActionCurrency()
                    ),
                    'credit_limit' => $this->formatPrice(
                        $transaction->getCreditLimit(),
                        $transaction->getCreditCurrency()
                    ),
                    'purchase_order' => $transaction->getPoNumber(),
                    'comment' => $transaction->getCommentToCustomer()
                ];
            }
        } catch (LocalizedException $e) {
            $this->logger->error($e->getMessage());
        }

        return $transactions;
    }

    /**
     * @param $amount
     * @param $currency
     *
     * @return string
     */
    public function formatPrice($amount, $currency)
    {
        return $this->formatter->formatPrice($amount, $currency);
    }
}
