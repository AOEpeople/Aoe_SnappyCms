<?php

class Aoe_SnappyCms_Block_BlockPicker extends Mage_Adminhtml_Block_Template
{
    protected $_template = 'Aoe_SnappyCms/blockpicker.phtml';

    public function getCategories() {
        $categories = array();
        foreach ($this->getAllBlocks() as $block) {
            if (isset($block['categories']) && is_array($block['categories'])) {
                foreach (array_keys($block['categories']) as $category) {
                    if (!in_array($category, $categories)) {
                        $categories[] = $category;
                    }
                }
            }
        }
        return $categories;
    }

    public function getElementsForCategory($category) {
        $result = array();
        foreach ($this->getAllBlocks() as $type => $conf) {
            if (array_key_exists($category, $conf['categories'])) {
                $result[$type] = $conf;
            }
        }
        return $result;
    }


    public function getAllBlocks() {
        $config = Mage::getModel('Aoe_SnappyCms/Config'); /* @var $config Aoe_SnappyCms_Model_Config */
        $blocks = $config->getNode('aoe_snappycms/blocks')->children();
        $results = array();
        foreach ($blocks as $key => $block) { /* @var $block Mage_Core_Model_Config_Element */
            $type = (string)$block->type;
            $results[$type] = $block->asArray();
            $results[$type]['key'] = $key;
            $results[$type]['icon'] = $this->getSkinUrl((string)$block->icon);
        }
        return $results;
    }

    public function getAllPages() {
        $config = Mage::getModel('Aoe_SnappyCms/Config'); /* @var $config Aoe_SnappyCms_Model_Config */
        $pages = $config->getNode('aoe_snappycms/pages');
        $results = array();
        foreach ($pages->children() as $key => $page) { /* @var $block Mage_Core_Model_Config_Element */
            $results[$key] = $page->asArray();
            $results[$key]['references'] = array();
            foreach($page->references->children() as $rkey => $reference) {
                $results[$key]['references'][$rkey] = $reference->asArray();
                $results[$key]['references'][$rkey]['icon'] = $this->getSkinUrl((string)$reference->icon);
            }

        }
        return $results;
    }

}
