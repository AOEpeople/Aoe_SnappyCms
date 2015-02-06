<?php

class Aoe_LayoutEditor_Block_Picker_TabContainer extends Mage_Adminhtml_Block_Widget_Tabs
{
    public function __construct()
    {
        parent::__construct();
        $this->setId('blockpicker_tab');
        $this->setDestElementId('blockpicker_tab_content');
        $this->setTemplate('widget/tabshoriz.phtml');
    }

    protected function _prepareLayout()
    {
        $this->addTab('containers', array(
            'label'     => $this->__('Containers'),
            'content'   => $this->getLayout()->createBlock('Aoe_LayoutEditor/Picker_Tab')->toHtml(),
            'active'    => true
        ));

        $this->addTab('basics', array(
            'label'     => $this->__('Basics'),
            'content'   => $this->getLayout()->createBlock('Aoe_LayoutEditor/Picker_Tab')->toHtml(),
        ));
        return parent::_prepareLayout();
    }

}
