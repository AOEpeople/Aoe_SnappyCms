<?php

class Aoe_SnappyCms_Block_Adminhtml_Form_Edit_Form extends Mage_Adminhtml_Block_Widget_Form
{

    protected function getBlockKey() {
        return $this->getRequest()->getParam('blockkey');
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
            'action' => '#',
            'method' => 'post',
            'onsubmit' => 'submitBlockEditor()'
        ));

        $form->setUseContainer(true);
        $this->setForm($form);

        $fieldset = $form->addFieldset('display', array(
            'legend' => $this->__('Edit Block'),
            'class' => 'fieldset-wide'
        ));

        $config = Mage::getModel('Aoe_SnappyCms/Config'); /* @var $config Aoe_SnappyCms_Model_Config */
        $fields = $config->getNode('aoe_snappycms/blocks/'.$this->getBlockKey().'/fields');

        if ($fields) {

            $fieldset->addField('blockname', 'hidden', array(
                'name' => 'blockname',
            ));

            foreach ($fields->children() as $name => $field) {

                $type = (string)$field->type;

                if ($type == 'img') {
                    $field = $fieldset->addField($name, 'editor', array(
                        'name' => $name,
                        'label' => $this->__((string)$field->label),
                        'title' => $this->__((string)$field->label),
                        'required' => false
                    ));
                    $field->setConfig(Mage::getSingleton('cms/wysiwyg_config')->getConfig());
                    $field->setStyle('height:2em;');
                } else {
                    $field = $fieldset->addField($name, $type, array(
                        'name' => $name,
                        'label' => $this->__((string)$field->label),
                        'title' => $this->__((string)$field->label),
                        'required' => false
                    ));

                    if ($type == 'editor') {
                        $field->setConfig(Mage::getSingleton('cms/wysiwyg_config')->getConfig());
                        $field->setStyle('height:38em;');
                    }
                }
            }
        }

        return parent::_prepareForm();
    }
}