<?php
/**
 * Class Aoe_SnappyCms_Helper_Data
 *
 * @author Fabrizio Branca
 * @since 2015-02-11
 */
class Aoe_SnappyCms_Helper_Data extends Mage_Core_Helper_Abstract {



    public function tags2Array($xml) {
        $array = array();
        foreach ($xml->children() as $key => $value) {
            $array[] = $key;
        }
        return array_values(array_unique($array));
    }

}