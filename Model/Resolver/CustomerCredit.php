<?php
/**
 * @category  Budo
 * @package   Budo_CustomerCreditGraphQl
 * @author    Vitalijs Visnakovs <info@scandiweb.com>
 * @copyright Copyright (c) 2020 Scandiweb, Inc (https://scandiweb.com)
 * @license   http://opensource.org/licenses/OSL-3.0 The Open Software License 3.0 (OSL-3.0)
 */

namespace BNF\CustomerCreditGraphQl\Model\Resolver;

use Magento\Framework\GraphQl\Config\Element\Field;
use Magento\Framework\GraphQl\Query\Resolver\ContextInterface;
use Magento\Framework\GraphQl\Query\Resolver\Value;
use Magento\Framework\GraphQl\Query\ResolverInterface;
use Magento\Framework\GraphQl\Schema\Type\ResolveInfo;
use Aheadworks\CreditLimit\Api\CustomerManagementInterface;
use Magento\Framework\App\RequestInterface;
use Magento\Quote\Api\CartRepositoryInterface;
use Psr\Log\LoggerInterface;

/**
 * Class CustomerCredit
 *
 * @package BNF\CustomerCreditGraphQl\Model\Resolver
 */
class CustomerCredit implements ResolverInterface
{
    /**
     * @var CustomerManagementInterface
     */
    protected $customerManagement;

    /**
     * @var RequestInterface
     */
    protected $request;

    /**
     * @var CartRepositoryInterface
     */
    protected $quoteRepository;

    /**
     * @var LoggerInterface
     */
    protected $logger;

    /**
     * CustomerCredit constructor.
     *
     * @param CustomerManagementInterface $customerManagement
     * @param RequestInterface            $request
     * @param CartRepositoryInterface     $quoteRepository
     * @param LoggerInterface             $logger
     */
    public function __construct(
        CustomerManagementInterface $customerManagement,
        RequestInterface $request,
        CartRepositoryInterface $quoteRepository,
        LoggerInterface $logger
    ) {
        $this->customerManagement = $customerManagement;
        $this->request = $request;
        $this->quoteRepository = $quoteRepository;
        $this->logger = $logger;
    }

    /**
     * @param Field            $field
     * @param ContextInterface $context
     * @param ResolveInfo      $info
     * @param array|null       $value
     * @param array|null       $args
     *
     * @return float|Value|mixed|null
     */
    public function resolve(Field $field, $context, ResolveInfo $info, array $value = null, array $args = null)
    {
        try {
            $isEnoughBalance = true;
            $quote = $this->quoteRepository->getActiveForCustomer($context->getUserId());
            $amount = null;

            if ($quote && $quote->getCustomerId()) {
                $amount = $this->customerManagement->getCreditAvailableAmount(
                    $quote->getCustomerId(),
                    $quote->getQuoteCurrencyCode()
                );

                if ($quote->getGrandTotal() > $amount) {
                    $isEnoughBalance = false;
                }
            }

            return [
                'amount' => $amount,
                'enough_credit' => $isEnoughBalance
            ];
        } catch (\Magento\Framework\Exception\NoSuchEntityException $e) {
            $this->logger->error($e->getMessage());
        }
    }
}
