jQuery.noConflict();


/**
 * AOE SnappyCms
 *
 * @author Fabrizio Branca
 * @since 2015-02-10
 */
var AOE_SNAPPYCMS = (function ($, _) {


    /**
     * Layout xml object
     */
    var xml;


    /**
     * Templates
     */
    var templates = {
        blockTemplate: '<div name="<%= name %>" class="item <%= tagName %> <%= csstype %> entry-edit">' +
        '<div class="entry-edit-head"><h4><%= typelabel %></h4><div class="actions"><ul></ul></div></div>' +
        '<div class="fieldset">' +
            '<div class="summary">' +
                '<div class="icon"><img src="<%= icon %>" /></div><div class="preview"><%= preview %></div>' +
                '<div class="children-container"><%= children %></div></div>' +
            '</div>' +
        '</div>'
    }


    /**
     * Initialize layout xml object
     */
    var initXml = function () {
        xml = $($.parseXML('<layout name="root">' + getLayoutUpdateXmlFieldContent() + '</layout>'));
    };


    /**
     * Get layout_update_xml field content (or generate skeleton, if empty)
     *
     * @returns {*}
     */
    var getLayoutUpdateXmlFieldContent = function () {
        var content = $('#page_layout_update_xml').val();
        if (!content) {
            $.each(AOE_SNAPPYCMS_PAGEDEFINITION[getPageType()].references, function (key, value) {
                content += '<reference name="' + key + '"></reference>';
            });
        }
        return content;
    }


    var getPageType = function() {
        return $('#page_root_template').val();
    }


    /**
     * Create block
     *
     * @param parentName
     * @param type
     * @param dropzone
     */
    var createNewBlock = function (parentName, type, dropzone) {

        // create new xml representation
        var $blockXml = $('<block />');
        $blockXml.attr('type', type);

        if (dropzone == 'catchall') {
            $blockXml.attr('name', getUniqName());
        } else { // override name
            $blockXml.attr('name', dropzone);
        }
        xml.find("[name='" + parentName + "']").append($blockXml);

        render();
    }


    /**
     * Get uniq name (that's not in use yet)
     *
     * @returns string
     */
    var getUniqName = function () {
        var name;
        do {
            name = _.uniqueId('id_');
        } while (xml.find("[name='" + name + "']").length > 0);
        return name;
    }


    /**
     * Edit block
     */
    var editBlock = function (name) {

        var $blockXml = xml.find("[name='" + name + "']");
        var type = $blockXml.attr('type');

        //var $form = $('<div id="block_form"><div class="fieldset"><div class="hor-scroll"><h3>Edit Block "' + name + '"</h3><table cellspacing="0" class="form-list"><tbody></tbody></table></div></div></div>');
        //var $tbody = $form.find('tbody');
        //
        //$.each(AOE_SNAPPYCMS_BLOCKDEFINITION[type].fields, function (key, value) {
        //    if (value.type == 'textarea') {
        //        $tbody.append('<tr><td class="label"><label for="' + key + '">' + value.label + '</label></td>' +
        //        '<td class="value"><textarea cols="15" rows="2" class="textarea" name="' + key + '"></textarea></td>');
        //    } else if (value.type == 'wysiwyg') {
        //        $tbody.append('<tr><td class="label" colspan="2"><label for="' + key + '">' + value.label + '</label></td></tr>' +
        //        '<tr><td class="value" colspan="2"><textarea cols="15" rows="2" class="textarea" id="' + key + '" name="' + key + '"></textarea></td>');
        //    } else if (value.type == 'input') {
        //        $tbody.append('<tr><td class="label" colspan="2"><label for="' + key + '">' + value.label + '</label></td></tr>' +
        //        '<tr><td class="value" colspan="2"><input id="' + key + '" name="' + key + '"/></td>');
        //    }
        //});
        //$tbody.append('<tr><td class="label"></td><td class="value"><button type="button" class="scalable" id="save-block"><span>Save</span></button></td>');


        if ($('#block_form_dialog') && typeof(Windows) != 'undefined') {
            Windows.close('block_form_dialog');
        }

        var fieldvalues = encodeURIComponent(encode_base64(JSON.stringify(getFieldValues(name))));

        // var dialogWindow = Dialog.info($form.html(), {
        var dialogWindow = Dialog.info(null, {
            // url: AOE_SNAPPYCMS_BLOCKEDITOR + 'blockname/' + name + '/blockkey/' + AOE_SNAPPYCMS_BLOCKDEFINITION[type].key + '/fieldvalues/' + fieldvalues,
            url: AOE_SNAPPYCMS_BLOCKEDITOR + 'blockkey/' + AOE_SNAPPYCMS_BLOCKDEFINITION[type].key + '#' + name,
            closable: true,
            resizable: false,
            draggable: true,
            className: 'magento',
            windowClassName: 'popup-window',
            title: 'Edit block: ' + name,
            top: 15,
            width: 1000,
            height: 800,
            zIndex: 1000,
            recenterAuto: true,
            hideEffect: Element.hide,
            showEffect: Element.show,
            id: 'block_form_dialog',
            onClose: function (param, el) {}
        });
        //
        //// set values
        //$.each(getFieldValues(name), function (key, value) {
        //    console.log('[Setting value for "'+key+'"]: ' + value);
        //    $('#block_form_dialog [name="' + key + '"]').val(value);
        //});
        //
        //var editor = {};
        //$.each(AOE_SNAPPYCMS_BLOCKDEFINITION[type].fields, function (key, value) {
        //    if (value.type == 'wysiwyg') {
        //        console.log('Launching tinyMce');
        //        editor[key] = new tinyMceWysiwygSetup(key, AOE_SNAPPYCMS_WYSIWYG_CONFIG);
        //        editor[key].setup();
        //        editor[key].turnOn();
        //
        //        varienGlobalEvents.attachEventHandler("formSubmit", editorFormValidationHandler);
        //        varienGlobalEvents.attachEventHandler("tinymceBeforeSetContent", editor[key].beforeSetContent.bind(editor[key]));
        //        varienGlobalEvents.attachEventHandler("tinymceSaveContent", editor[key].saveContent.bind(editor[key]));
        //        varienGlobalEvents.clearEventHandlers("open_browser_callback");
        //        varienGlobalEvents.attachEventHandler("open_browser_callback", editor[key].openFileBrowser.bind(editor[key]));
        //    }
        //});
        //
        //$('#save-block').click(function () {
        //    $.each(editor, function (key, value) {
        //        value.onFormValidation();
        //    });
        //    tinyMCE.triggerSave();
        //    $('#block_form_dialog').find('input, textarea').each(function (key, value) {
        //        var field = $(this).attr('name');
        //        console.log(this);
        //        console.log('Writing back field: ' + field);
        //        console.log('Value: ' + $(this).val());
        //        var methodName = 'set' + field.charAt(0).toUpperCase() + field.slice(1);
        //        $blockXml.find('action[method="' + methodName + '"]').remove(); // delete existing node
        //        $blockXml.append('<action method="' + methodName + '"><value><![CDATA[' + $(this).val().trim() + ']]></value></action>')
        //    });
        //    editor = {};
        //    Windows.close('block_form_dialog');
        //    render();
        //    return false;
        //})

    }


    /**
     * Get field values for a given block
     *
     * @param name
     * @returns {{}}
     */
    var getFieldValues = function (name) {
        var $blockXml = xml.find("[name='" + name + "']");
        var type = $blockXml.attr('type');
        var fieldValues = {};
        if (type && typeof AOE_SNAPPYCMS_BLOCKDEFINITION[type].fields != 'undefined') {
            $.each(AOE_SNAPPYCMS_BLOCKDEFINITION[type].fields, function (key, value) {
                var methodName = 'set' + key.charAt(0).toUpperCase() + key.slice(1);
                fieldValues[key] = $blockXml.find('action[method="' + methodName + '"]').text();
            });
        }
        return fieldValues;
    }



    /**
     * Set field values
     * TODO: verify that the field values are allowed
     *
     * @param name
     * @param values
     */
    var setFieldValues = function(name, values) {
        console.log("SETTING FIELD VALUES for: " + name);
        var $blockXml = xml.find("[name='" + name + "']");
        $.each(values, function(field, value) {
            var methodName = 'set' + field.charAt(0).toUpperCase() + field.slice(1);
            $blockXml.find('action[method="' + methodName + '"]').remove(); // delete existing node
            $blockXml.append('<action method="' + methodName + '"><value><![CDATA[' + value.trim() + ']]></value></action>')
        });
        render();
    }



    /**
     * Read item's configuration to detect dropzones and then traverse xml object's children to populate the zones
     *
     * @param currentNode
     * @returns {Array}
     */
    var getDropZones = function (currentNode) {
        var zones = [];
        if (currentNode.prop("tagName") == 'reference') {
            zones.push('<div class="children" data-zone="catchall" data-name="' + currentNode.attr('name') + '">' + renderChildren(currentNode.children('block')) + '</div>');
        } else {
            var type = currentNode.attr('type');
            if (typeof AOE_SNAPPYCMS_BLOCKDEFINITION[type].children != 'undefined') {
                $.each(AOE_SNAPPYCMS_BLOCKDEFINITION[type].children, function (key, value) {
                    if (value.maxCount == '1') {
                        zones.push('<div class="child" data-name="' + currentNode.attr('name') + '" data-zone="' + key + '"><h3 class="dropzone-label">' + key + '</h3>' + renderChildren(currentNode.children("[name='" + key + "']")) + '</div>');
                    } else {
                        zones.push('<div class="children" data-name="' + currentNode.attr('name') + '" data-zone="' + key + '"><h3 class="dropzone-label">' + key + '</h3>' + renderChildren(currentNode.children("block")) + '</div>');
                    }
                })
            }
        }
        return zones;
    }


    /**
     * Turns XML representation into HTML representation
     *
     * @param currentNode
     * @returns {*}
     */
    var renderBlock = function (currentNode) {
        var blockTemplate = _.template(templates.blockTemplate);

        currentNode = $(currentNode);
        var name = currentNode.attr('name');

        // render preview
        var preview = '';
        console.log('Rendering ' + name);
        $.each(getFieldValues(name), function (key, value) {
            preview += '<strong>' + key + ':</strong> ' + value.replace(/(<([^>]+)>)/ig,"") + '</br>';
        });

        var type = xml.find("[name='" + name + "']").attr('type');
        var tagName = currentNode.prop("tagName");
        var typelabel, icon;

        console.log(AOE_SNAPPYCMS_PAGEDEFINITION);

        if (tagName == 'reference') {
            var reference = AOE_SNAPPYCMS_PAGEDEFINITION[getPageType()]['references'][name];
            typelabel = '[' + reference.label + ']';
            icon = reference.icon;
        } else {
            typelabel = AOE_SNAPPYCMS_BLOCKDEFINITION[type].label;
            icon = AOE_SNAPPYCMS_BLOCKDEFINITION[type].icon;
        }

        return blockTemplate({
            typelabel: typelabel,
            icon: icon,
            preview: preview,
            csstype: type ? type.toLowerCase().replace(/[^a-z0-9]/g, '-') : '',
            name: name,
            title: name,
            type: type,
            tagName: tagName,
            children: getDropZones(currentNode).join('')
        });
    }


    /**
     * Render an array of children
     *
     * @param children
     * @returns {string}
     */
    var renderChildren = function (children) {
        var html = '';
        children.each(function (key, blockXml) {
            html += renderBlock(blockXml);
        });
        return html;
    }


    /**
     * Initialize editor
     */
    var init = function () {

        $('#page_content').removeClass('required-entry');

        $('#page_root_template').change(function () {
            $('#page_layout_update_xml').val('');
            initXml();
            render();
        })

        initXml();

        console.log("Reinit");
        $('body').delegate('.block .actions a.remove', 'click', function () {
            console.log($(this));
            var name = $(this).closest('.block').attr('name');
            console.log('Removing ' + name);
            xml.find("[name='" + name + "']").remove();
            render();
            return false;
        });

        $('body').delegate('.block .actions a.edit', 'click', function () {
            console.log($(this));
            var name = $(this).closest('.block').attr('name');
            console.log('Editing ' + name);
            editBlock(name);
            return false;
        });


        render(); // calls reinit()
    }

    /**
     * Render UI
     */
    var render = function () {
        var xmlString = xml.find('layout').html();
        xmlString = xmlString.replace(/\s*xmlns="[^"]*"/g, '');
        xmlString = xmlString.replace(/<([\w\-_]+)((?:[^'">]|'[^']*'|"[^"]*")*)\/\s*>/g, '<$1$2></$1>');

        xmlString = $.format(xmlString);

        xmlString = xmlString.replace(/[^>]*<!\[CDATA\[/g, '<![CDATA[');
        xmlString = xmlString.replace(/\]\]>[^<]*/g, ']]>');

        // setLayoutUpdateXmlFieldContent:
        $('#page_layout_update_xml').val(xmlString);
        // $('pre#debug').text(xmlString);

        $('#root').html(renderChildren(xml.find('layout').children('reference'))); // entry points: <reference> tags

        reinit();
    }



    /**
     * Reinit UI elements after updating
     */
    var reinit = function () {

        $('.block-blueprint').draggable({
            helper: "clone"
        });

        $('.children').sortable({
            items: '.item',
            connectWith: '.children',
            receive: function (event, ui) {
                console.log('Receiving element');
            },
            update: function (event, ui) {
                var parentName = $(this).closest('.item, reference').attr('name');
                var parentXmlNode = xml.find("[name='" + parentName + "']");

                $(this).find('.block').each(function (key, value) {
                    var itemName = $(this).attr('name');
                    var itemXmlNode = xml.find("[name='" + itemName + "']");
                    parentXmlNode.append(itemXmlNode);
                });
                render();
            }
        });

        $('.children, .child').droppable({
            greedy: true,
            accept: function (el) {
                var numChildren = $(this).children('.item').length;
                if ($(this).hasClass('child') && numChildren > 0) {
                    return false;
                } else {
                    return true;
                }
            },
            drop: function (event, ui) {
                var $item = $(this).closest('.item, reference');
                var targetName = $(this).attr('data-name');
                var dropZone = $(this).attr('data-zone');

                if (ui.draggable.hasClass('block-blueprint')) { // create new by dragging item from block picker

                    var type = ui.draggable.attr('data-type');
                    console.log(type);
                    createNewBlock(targetName, type, dropZone);
                    console.log('Creating new block inside ' + targetName);

                } else { // move existing item

                    var sourceName = ui.draggable.attr('name');
                    console.log('Appending ' + sourceName + ' to ' + targetName);
                    xml.find("[name='" + targetName + "']").append(xml.find("[name='" + sourceName + "']"));
                }

                render();
            },
            over: function (event, ui) {
                $(this).addClass("ui-state-highlight");
            },
            out: function (event, ui) {
                $(this).removeClass("ui-state-highlight");
            }
        });

        $('.block .actions ul').append('<li><a class="remove" href="#">Remove</a></li>');
        $('.block .actions ul').append('<li><a class="edit" href="#">Edit</a></li>');
    }


    /**
     * Defining the "public API"
     */
    return {
        init: init,
        createNewBlock: createNewBlock,
        render: render,
        setFieldValues: setFieldValues,
        getFieldValues: getFieldValues
    };


}(jQuery, _)); // importing jQuery and the underscore.js


jQuery(function () {
    AOE_SNAPPYCMS.init();
});


