jQuery.noConflict();


/**
 * AOE LayoutEditor
 *
 * @author Fabrizio Branca
 * @since 2015-02-10
 */
var AOE_LAYOUTEDITOR = (function ($, _) {



    /**
     * Layout xml object
     */
    var xml;



    /**
     * Templates
     */
    var templates = {
        blockTemplate: '<div name="<%= name %>" class="item <%= tagName %> <%= csstype %> entry-edit">' +
            '<div class="entry-edit-head"><h4><%= title %></h4><div class="actions"><ul></ul></div></div>' +
            '<div class="fieldset"><div class="preview"><%= preview %></div><div class="children-container"><%= children %></div></div>' +
        '</div>'
    }



    /**
     * Initialize layout xml object
     */
    var initXml = function() {
        xml = $($.parseXML('<layout name="root">' + getLayoutUpdateXmlFieldContent() + '</layout>'));
    };



    /**
     * Get layout_update_xml field content (or generate skeleton, if empty)
     *
     * @returns {*}
     */
    var getLayoutUpdateXmlFieldContent = function() {
        var content = $('#page_layout_update_xml').val();
        if (!content) {
            var t = $('#page_root_template').val();
            $.each(PAGE_CONTAINERS[t], function(key, value) {
                content += '<reference name="'+key+'"></reference>';
            });
        }
        return content;
    }



    /**
     * Create block
     *
     * @param parentName
     * @param type
     * @param dropzone
     */
    var createNewBlock = function(parentName, type, dropzone) {

        // create new xml representation
        var $blockXml = $('<block />');
        $blockXml.attr('type', type);

        if (dropzone == 'catchall') {
            $blockXml.attr('name', getUniqName());
        } else { // override name
            $blockXml.attr('name', dropzone);
        }
        xml.find("[name='"+parentName+"']").append($blockXml);

        render();
    }


    /**
     * Get uniq name (that's not in use yet)
     *
     * @returns string
     */
    var getUniqName = function() {
        var name;
        do {
            name = _.uniqueId('id_');
        } while (xml.find("[name='"+name+"']").length > 0);
        return name;
    }



    /**
     * Edit block
     */
    var editBlock = function(name) {

        var $blockXml = xml.find("[name='"+name+"']");
        var type = $blockXml.attr('type');

        var $form = $('<div id="block_form"><div class="fieldset"><div class="hor-scroll"><h3>Edit Block "'+name+'"</h3><table cellspacing="0" class="form-list"><tbody></tbody></table></div></div></div>');
        var $tbody = $form.find('tbody');


        // <input type="text" class="required-entry input-text required-entry" value="Pending Import" name="label" id="label">

        $.each(AOE_LAYOUTEDITOR_BLOCKDEFINITION[type].fields, function(key, value) {
            console.log(value);
            if (value.type == 'textarea') {
                $tbody.append('<tr><td class="label"><label for="' + key + '">' + value.label + '</label></td>' +
                '<td class="value"><textarea cols="15" rows="2" class="textarea" name="' + key + '"></textarea></td>');
            }
        });
        $tbody.append('<tr><td class="label"></td><td class="value"><button type="button" class="scalable" id="save-block"><span>Save</span></button></td>');

        if ($('#block_form_dialog') && typeof(Windows) != 'undefined') {
            Windows.close('block_form_dialog');
        }

        var dialogWindow = Dialog.info($form.html(), {
            closable: true,
            resizable: false,
            draggable: true,
            className: 'magento',
            windowClassName: 'popup-window',
            title: 'Edit block: ' + name,
            top: 50,
            width: 700,
            height: 500,
            zIndex: 1000,
            recenterAuto: false,
            hideEffect: Element.hide,
            showEffect: Element.show,
            id: 'block_form_dialog',
            onClose: function (param, el) {}
        });

        // set values
        $.each(getFieldValues(name), function(key, value) {
            $('#block_form_dialog [name="'+key+'"]').val(value);
        });

        $('#save-block').click(function() {
            // write values to xml object
            $('#block_form_dialog').find('input, textarea').each(function(key, value) {
                var field = $(this).attr('name');
                var methodName = 'set' + field.charAt(0).toUpperCase() + field.slice(1);
                $blockXml.find('action[method="'+methodName+'"]').remove(); // delete existing node
                $blockXml.append('<action method="'+methodName+'"><value><![CDATA['+ $(this).val()+']]></value></action>')
            });
            Windows.close('block_form_dialog');
            render();
            return false;
        })
    }


    /**
     * Get field values for a given block
     *
     * @param name
     * @returns {{}}
     */
    var getFieldValues = function(name) {
        var $blockXml = xml.find("[name='"+name+"']");
        var type = $blockXml.attr('type');
        var fieldValues = {};
        if (type && typeof AOE_LAYOUTEDITOR_BLOCKDEFINITION[type].fields != 'undefined') {
            $.each(AOE_LAYOUTEDITOR_BLOCKDEFINITION[type].fields, function (key, value) {
                var methodName = 'set' + key.charAt(0).toUpperCase() + key.slice(1);
                fieldValues[key] = $blockXml.find('action[method="' + methodName + '"]').text();
            });
        }
        return fieldValues;
    }



    /**
     * Read item's configuration to detect dropzones and then traverse xml object's children to populate the zones
     *
     * @param currentNode
     * @returns {Array}
     */
    var getDropZones = function(currentNode) {
        var zones = [];
        if (currentNode.prop("tagName") == 'reference') {
            zones.push('<div class="children" data-zone="catchall" data-name="'+currentNode.attr('name')+'">'+ renderChildren(currentNode.children('block'))+'</div>');
        } else {
            var type = currentNode.attr('type');
            $.each(AOE_LAYOUTEDITOR_BLOCKDEFINITION[type].children, function(key, value) {
                if (value.maxCount == '1') {
                    zones.push('<div class="child" data-name="'+currentNode.attr('name')+'" data-zone="' + key + '"><h3>' + key + '</h3>' + renderChildren(currentNode.children("[name='" + key + "']")) + '</div>');
                } else {
                    zones.push('<div class="children" data-name="'+currentNode.attr('name')+'" data-zone="' + key + '"><h3>' + key + '</h3>' + renderChildren(currentNode.children("block")) + '</div>');
                }
            })
        }
        return zones;
    }



    /**
     * Turns XML representation into HTML representation
     *
     * @param currentNode
     * @returns {*}
     */
    var renderBlock = function(currentNode) {
        var blockTemplate = _.template(templates.blockTemplate);

        currentNode = $(currentNode);
        var name = currentNode.attr('name');

        // render preview
        var preview = '';
        console.log('Rendering ' + name);
        $.each(getFieldValues(name), function(key, value) {
            preview += '<strong>'+key+':</strong> ' + value + '</br>';
        });

        var type = xml.find("[name='"+name+"']").attr('type');

        return blockTemplate({
            preview: preview,
            csstype: type ? type.toLowerCase().replace(/[^a-z0-9]/g, '-') : '',
            name: name,
            title: name,
            tagName: currentNode.prop("tagName"),
            children: getDropZones(currentNode).join('')
        });
    }



    /**
     * Render an array of children
     *
     * @param children
     * @returns {string}
     */
    var renderChildren = function(children) {
        var html = '';
        children.each(function(key, blockXml) {
            html += renderBlock(blockXml);
        });
        return html;
    }



    /**
     * Initialize editor
     */
    var init = function() {

        $('#page_content').removeClass('required-entry');

        initXml();

        console.log("Reinit");
        $('body').delegate('.block .actions a.remove', 'click', function() {
            console.log($(this));
            var name = $(this).closest('.block').attr('name');
            console.log('Removing ' + name);
            xml.find("[name='"+name+"']").remove();
            render();
            return false;
        });

        $('body').delegate('.block .actions a.edit', 'click', function() {
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
    var render = function() {
        var xmlString = $.format(xml.find('layout').html());

        // setLayoutUpdateXmlFieldContent:
        $('#page_layout_update_xml').val(xmlString);
        $('pre#debug').text(xmlString);

        $('#root').html(renderChildren(xml.find('layout').children('reference'))); // entry points: <reference> tags

        reinit();
    }



    /**
     * Reinit UI elements after updating
     */
    var reinit = function() {

        $('.block-blueprint').draggable({
            helper: "clone"
        });

        $('#root, .block').sortable({
            items: '.block',
            connectWith: '.children',
            receive: function(event, ui) {
                console.log('Receiving element');
            },
            update: function(event, ui) {
                var parentId = $(this).parent().attr('id');
                var $parentNode = xml.find('#'+parentId)
                $(this).children().each(function(key, value) {
                    var id = $(value).attr('id');
                    console.log(id);
                    var $blockNode = xml.find('#'+id);
                    $parentNode.append($blockNode);
                });
                console.log('Changed');
                render();
            }
        });

        $('.children, .child').droppable({
            greedy: true,
            accept: function(el) {
                var numChildren = $(this).children('.item').length;
                if ($(this).hasClass('child') && numChildren > 0) {
                    return false;
                } else {
                    return true;
                }
            },
            drop: function(event, ui) {
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
                    xml.find("[name='"+targetName+"']").append(xml.find("[name='"+sourceName+"']"));
                }

                render();
            },
            over: function(event, ui) { $(this).addClass("ui-state-highlight"); },
            out: function(event, ui) { $(this).removeClass("ui-state-highlight"); }
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
        render: render
    };



}(jQuery, _)); // importing jQuery and the underscore.js



jQuery(function() {
    AOE_LAYOUTEDITOR.init();
});


