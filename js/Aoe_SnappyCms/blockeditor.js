function submitBlockEditor() {
    varienGlobalEvents.fireEvent('formSubmit', 'edit_form');
    var fieldValues = $('edit_form').serialize(true);
    var blockname = fieldValues.blockname;
    delete fieldValues['blockname'];
    delete fieldValues['form_key'];
    console.log(fieldValues);
    window.parent.AOE_SNAPPYCMS.setFieldValues(blockname, fieldValues);
    window.parent.Windows.close('block_form_dialog');
    return false;
}

function populateForm() {
    var blockname = location.hash.substr(1);
    console.log(blockname);
    var fieldValues = window.parent.AOE_SNAPPYCMS.getFieldValues(blockname);
    fieldValues.blockname = blockname;
    console.log(fieldValues);
    $H(fieldValues).each(function(pair){
        var field = pair.key;
        var value = pair.value;
        console.log(field + ': ' + value);
        $(field).setValue(value);
    });
}