<?php

class Aoe_SnappyCms_Model_Config extends Mage_Core_Model_Config_Base {

    /**
     * Key name for storage of cache data
     *
     * @var string
     */
    const CACHE_ID = 'aoe_snappycms_cache';

    /**
     * Tag name for cache type, used in mass cache cleaning
     *
     * @var string
     */
    const CACHE_TAG = 'config';

    /**
     * Filename that will be collected from different modules
     *
     * @var string
     */
    const CONFIGURATION_FILENAME = 'aoe_snappycms.xml';

    /**
     * Initial configuration file template, then merged in one file
     *
     * @var string
     */
    const CONFIGURATION_TEMPLATE = '<?xml version="1.0"?><config></config>';

    /**
     * Class constructor
     * load cache configuration
     *
     * @param string $sourceData
     */
    public function __construct($sourceData = null) {
        $tags = array(self::CACHE_TAG);
        $useCache = Mage::app()->useCache('config');
        $this->setCacheId(self::CACHE_ID);
        $this->setCacheTags($tags);
        if ($useCache && ($cache = Mage::app()->loadCache(self::CACHE_ID))) {
            parent::__construct($cache);
        } else {
            parent::__construct(self::CONFIGURATION_TEMPLATE);
            Mage::getConfig()->loadModulesConfiguration(self::CONFIGURATION_FILENAME, $this);
            if ($useCache) {
                $xmlString = $this->getXmlString();
                Mage::app()->saveCache($xmlString, self::CACHE_ID, $tags);
            }
        }
    }


}