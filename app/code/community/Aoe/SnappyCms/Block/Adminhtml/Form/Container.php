<?php

class Aoe_SnappyCms_Block_Adminhtml_Form_Container extends Mage_Adminhtml_Block_Widget_Form_Container
{
    /**
     * Constructor
     */
    public function __construct() {
        parent::__construct();
        $this->_blockGroup = 'Aoe_SnappyCms';
        $this->_controller = 'adminhtml_form';
        $this->_headerText = $this->__('Edit Form');

        $this->removeButton('save');
        $this->removeButton('reset');
        $this->removeButton('back');

        $this->_addButton('save', array(
            'label' => Mage::helper('adminhtml')->__('Save'),
            'onclick' => 'submitBlockEditor();',
            'class' => 'save',
        ), 1);
    }

    /**
     * Preparing form
     *
     * @return Mage_Adminhtml_Block_Widget_Form
     */
    protected function _prepareForm()
    {
        $form = new Varien_Data_Form(array(
            'id' => 'edit_form',
            'action' => $this->getUrl('*/*/save'),
            'method' => 'post',
            'onsubmit' => 'submitBlockEditor();'
        ));

        $form->setUseContainer(true);
        $this->setForm($form);

        $fieldset = $form->addFieldset('display', array(
            'legend' => $this->__('Display Settings'),
            'class' => 'fieldset-wide'
        ));

        $fieldset->addField('label', 'text', array(
            'name' => 'label',
            'label' => $this->__('Label'),
        ));

        return parent::_prepareForm();
    }

    public function getCacheKey() {
        $blockKey = $this->getRequest()->getParam('blockkey');
        return 'aoe_snappycms_' . $blockKey;
    }

    public function getCacheLifetime() {
        return 2 * 60 * 60; // 2h
    }
}