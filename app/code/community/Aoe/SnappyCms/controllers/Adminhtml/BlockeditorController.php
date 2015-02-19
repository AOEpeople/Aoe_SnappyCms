<?php

class Aoe_SnappyCms_Adminhtml_BlockeditorController extends Mage_Adminhtml_Controller_Action
{

    public function indexAction()
    {
        $this->loadLayout();

        $block = $this->getLayout()->createBlock('Aoe_SnappyCms/Adminhtml_Form_Container', 'block_form');

        $this->getLayout()->getBlock('head')->setCanLoadTinyMce(true);
        $this->getLayout()->getBlock('content')->append($block);


        $block = $this->getLayout()->createBlock('core/text', 'js_snippet');
        $block->setText('<script>populateForm()</script>');
        $this->getLayout()->getBlock('content')->append($block);

        $this->renderLayout();
    }

}
