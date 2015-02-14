<?php

class Aoe_LayoutEditor_Block_BlockPicker extends Mage_Adminhtml_Block_Template
{
    protected $_template = 'Aoe_LayoutEditor/blockpicker.phtml';

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
        $config = Mage::getModel('Aoe_LayoutEditor/Config'); /* @var $config Aoe_LayoutEditor_Model_Config */
        $blocks = $config->getNode('aoe_layouteditor/blocks')->children();
        $results = array();
        foreach ($blocks as $key => $block) { /* @var $block Mage_Core_Model_Config_Element */
            $results[(string)$block->type] = $block->asArray();
        }
        return $results;
    }

    public function getAllPages() {
        $config = Mage::getModel('Aoe_LayoutEditor/Config'); /* @var $config Aoe_LayoutEditor_Model_Config */
        $pages = $config->getNode('aoe_layouteditor/pages');
        return $pages->asArray();
    }


}
