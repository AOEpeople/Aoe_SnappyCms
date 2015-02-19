<?php

/**
 * Class Aoe_SnappyCms_Block_Cms_Page_Edit_Tab_Snappycms
 *
 * @author Fabrizio Branca
 * @since 2015-02-05
 */
class Aoe_SnappyCms_Block_Cms_Page_Edit_Tab_Snappycms extends Mage_Adminhtml_Block_Widget implements Mage_Adminhtml_Block_Widget_Tab_Interface
{

    protected $_template = 'Aoe_SnappyCms/snappycms.phtml';

    /**
     * Prepare label for tab
     *
     * @return string
     */
    public function getTabLabel()
    {
        return Mage::helper('cms')->__('Layout Editor');
    }

    /**
     * Prepare title for tab
     *
     * @return string
     */
    public function getTabTitle()
    {
        return Mage::helper('cms')->__('Layout Editor');
    }

    /**
     * Returns status flag about this tab can be shown or not
     *
     * @return true
     */
    public function canShowTab()
    {
        return true;
    }

    /**
     * Returns status flag about this tab hidden or not
     *
     * @return true
     */
    public function isHidden()
    {
        return false;
    }

    /**
     * Check permission for passed action
     *
     * @param string $action
     * @return bool
     */
    protected function _isAllowedAction($action)
    {
        return Mage::getSingleton('admin/session')->isAllowed('cms/page/' . $action);
    }


    public function getEditor() {
        $form = new Varien_Data_Form();
        $form->setHtmlIdPrefix('snappycmstmp_');
        Mage::log(Mage::getSingleton('cms/wysiwyg_config')->getConfig());
        $form->addField('contents', 'editor', array(
            'name' => 'contents',
            'config'    => Mage::getSingleton('cms/wysiwyg_config')->getConfig(),
        ));
        return $form->getHtml();
    }
}