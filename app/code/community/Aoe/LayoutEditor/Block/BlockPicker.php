<?php

class Aoe_LayoutEditor_Block_BlockPicker extends Mage_Adminhtml_Block_Template
{
    protected $_template = 'Aoe_LayoutEditor/blockpicker.phtml';

    public function getCategories() {
        return array(
            array('id' => 'containers', 'label' => 'Containers'),
            array('id' => 'basics', 'label' => 'Basics'),
        );
    }

    public function getElementsForCategory($category) {
        $result = array();
        foreach ($this->getAllElements() as $type => $conf) {
            if (in_array($category, Mage::helper('Aoe_LayoutEditor')->tags2Array($conf->categories))) {
                $result[$type] = $conf;
            }
        }
        return $result;
    }

    public function getJsonConfig() {

    }

    public function getAllElements() {
        $config = Mage::getModel('Aoe_LayoutEditor/Config'); /* @var $config Aoe_LayoutEditor_Model_Config */
        $blocks = $config->getNode('aoe_layouteditor/blocks')->children();
        $results = array();
        foreach ($blocks as $key => $block) { /* @var $block Mage_Core_Model_Config_Element */
            $results[(string)$block->type] = $block->asArray();
        }
        var_dump($results);
        return $results;


        return array(
            'core/text_list' => array(
                'id' => 'core_text_list',
                'label' => 'Container',
                'icon' => 'Aoe_LayoutEditor/img/icons/textlist.png',
                'categories' => array('containers'),
                'children' => array(
                    'catchall' => array(
                        'minCount' => 0,
                        'maxCount' => '*',
                        'allowedTypes' => array(
                            'Mage_Core_Block_Abstract'
                        )
                    )
                )
            ),
            'Aoe_LayoutEditor/Element_Container_Two5050' => array(
                'id' => 'columns_50_50',
                'label' => '2 Columns [50/50]',
                'icon' => 'Aoe_LayoutEditor/img/icons/50_50.png',
                'categories' => array('containers'),
                'children' => array(
                    'col-left' => array(
                        'minCount' => 0,
                        'maxCount' => 1,
                        'allowedTypes' => array(
                            'Mage_Core_Block_Abstract'
                        )
                    ),
                    'col-right' => array(
                        'minCount' => 0,
                        'maxCount' => 1,
                        'allowedTypes' => array(
                            'Mage_Core_Block_Abstract'
                        )
                    )
                )
            ),
            'Aoe_LayoutEditor/Element_Container_Three333333' => array(
                'id' => 'columns_33_33_33',
                'label' => '3 Columns [33/33/33]',
                'icon' => 'Aoe_LayoutEditor/img/icons/33_33_33.png',
                'categories' => array('containers'),
                'children' => array(
                    'col-left' => array(
                        'minCount' => 0,
                        'maxCount' => 1,
                        'allowedTypes' => array(
                            'Mage_Core_Block_Abstract'
                        )
                    ),
                    'col-center' => array(
                        'minCount' => 0,
                        'maxCount' => 1,
                        'allowedTypes' => array(
                            'Mage_Core_Block_Abstract'
                        )
                    ),
                    'col-right' => array(
                        'minCount' => 0,
                        'maxCount' => 1,
                        'allowedTypes' => array(
                            'Mage_Core_Block_Abstract'
                        )
                    )
                )
            ),
            'Aoe_LayoutEditor/Basic_Text' => array(
                'id' => 'basic_text',
                'label' => 'Text',
                'icon' => 'Aoe_LayoutEditor/img/icons/text.png',
                'categories' => array('basics'),
                'children' => array(),
                'fields' => array(
                    'text' => array(
                        'label' => 'Text',
                        'type' => 'textarea'
                    )
                )
            ),
            'Aoe_LayoutEditor/Basic_Picture' => array(
                'id' => 'basic_picture',
                'label' => 'Picture',
                'icon' => 'Aoe_LayoutEditor/img/icons/pic.png',
                'categories' => array('basics'),
                'children' => array(),
                'fields' => array(
                    'picture' => array(
                        'label' => 'Picture',
                        'type' => 'input'
                    )
                )
            ),
        );
    }

}
