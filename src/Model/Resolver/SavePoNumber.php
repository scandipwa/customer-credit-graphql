<?php
/**
 * @category  ScandiPWA
 * @package   ScandiPWA_CustomerCreditGraphQl
 * @author    Vitalijs Visnakovs <info@scandiweb.com>
 * @copyright Copyright (c) 2020 Scandiweb, Inc (https://scandiweb.com)
 * @license   http://opensource.org/licenses/OSL-3.0 The Open Software License 3.0 (OSL-3.0)
 */

namespace ScandiPWA\CustomerCreditGraphQl\Model\Resolver;

use Aheadworks\CreditLimit\Api\Data\TransactionEntityInterface;
use Magento\Framework\GraphQl\Config\Element\Field;
use Magento\Framework\GraphQl\Query\ResolverInterface;
use Magento\Framework\GraphQl\Schema\Type\ResolveInfo;
use Magento\Checkout\Model\Session;
use Aheadworks\CreditLimit\Api\TransactionRepositoryInterface;
use Magento\Framework\App\ResourceConnection;
use Magento\Framework\EntityManager\MetadataPool;
use Psr\Log\LoggerInterface;

/**
 * Class SavePoNumber
 *
 * @package ScandiPWA\CustomerCreditGraphQl\Model\Resolver
 */
class SavePoNumber implements ResolverInterface
{
    /**
     * @var Session
     */
    protected $checkoutSession;

    /**
     * @var TransactionRepositoryInterface
     */
    protected $transactionRepository;

    /**
     * @var ResourceConnection
     */
    protected $resourceConnection;

    /**
     * @var MetadataPool
     */
    protected $metadataPool;

    /**
     * @var LoggerInterface
     */
    protected $logger;

    /**
     * @var string
     */
    protected $table;

    /**
     * SavePoNumber constructor.
     *
     * @param Session                        $checkoutSession
     * @param TransactionRepositoryInterface $transactionRepository
     * @param ResourceConnection             $resourceConnection
     * @param MetadataPool                   $metadataPool
     * @param LoggerInterface                $logger
     */
    public function __construct(
        Session $checkoutSession,
        TransactionRepositoryInterface $transactionRepository,
        ResourceConnection $resourceConnection,
        MetadataPool $metadataPool,
        LoggerInterface $logger
    ) {
        $this->checkoutSession = $checkoutSession;
        $this->transactionRepository = $transactionRepository;
        $this->resourceConnection = $resourceConnection;
        $this->metadataPool = $metadataPool;
        $this->logger = $logger;
        $this->table = $this->resourceConnection->getTableName(
            \Aheadworks\CreditLimit\Model\ResourceModel\Transaction::TRANSACTION_ENTITY_TABLE
        );
    }

    /**
     * Set custom purchase order number for transaction
     *
     * @param Field                                                      $field
     * @param \Magento\Framework\GraphQl\Query\Resolver\ContextInterface $context
     * @param ResolveInfo                                                $info
     * @param array|null                                                 $value
     * @param array|null                                                 $args
     *
     * @return \Magento\Framework\GraphQl\Query\Resolver\Value|mixed|void
     */
    public function resolve(Field $field, $context, ResolveInfo $info, array $value = null, array $args = null)
    {
        if ($args['po_number']) {
            $orderIncrementId = $this->checkoutSession->getLastRealOrder()->getIncrementId();
            $entity = $this->getEntityByIncrementId($orderIncrementId);

            if (!empty($entity)) {
                try {
                    $mainEntity = array_shift($entity);
                    $transaction = $this->transactionRepository->get($mainEntity['transaction_id']);
                    $transaction->setPoNumber($args['po_number']);
                    $this->transactionRepository->save($transaction);
                } catch (\Exception $e) {
                    $this->logger->error($e->getMessage());
                }
            }
        }
    }

    /**
     * Retrieve transaction entity by increment ID
     *
     * @param $incrementId
     *
     * @return array
     */
    protected function getEntityByIncrementId($incrementId)
    {
        $connection = $this->getConnection();
        $select = $connection->select()
            ->from($this->table)
            ->where(TransactionEntityInterface::ENTITY_LABEL . ' = :entity_label');

        return $connection->fetchAssoc(
            $select,
            [TransactionEntityInterface::ENTITY_LABEL => $incrementId]
        );
    }

    /**
     * @return \Magento\Framework\DB\Adapter\AdapterInterface
     */
    private function getConnection()
    {
        try {
            return $this->resourceConnection->getConnectionByName(
                $this->metadataPool->getMetadata(\Aheadworks\CreditLimit\Api\Data\TransactionInterface::class)
                    ->getEntityConnectionName()
            );
        } catch (\Exception $e) {
            $this->logger->error($e->getMessage());
        }
    }
}
