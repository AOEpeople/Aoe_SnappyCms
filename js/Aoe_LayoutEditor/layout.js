jQuery.noConflict();

var blockLibrary = [{
    name: 'Columns [50/50]',
    type: 'aoe_layouteditor/columns5050',
    groups: [ 'containers' ]
}, {
    name: 'Columns [33/33/33]',
    type: 'aoe_layouteditor/columns333333',
    groups: [ 'containers' ]
}, {
    name: 'Wysiwyg',
    type: 'aoe_layouteditor/wysiwyg',
    groups: [ 'basics' ]
}, {
    name: 'Image',
    type: 'aoe_layouteditor/image',
    groups: [ 'basics' ]
}];

var AOE_LAYOUTEDITOR = (function ($, _) {

    var templates = {
        blockTemplate: '<div name="<%= name %>" class="item <%= tagName %> entry-edit">' +
            '<div class="entry-edit-head"><h4><%= title %></h4></div>' +
            '<div class="fieldset"><div class="children-container"><%= children %></div></div>' +
        '</div>'
    }

    // read current layout xml to initialize the editor
    var layoutFieldValue = $('#page_layout_update_xml').val() || '';
    var xml = $($.parseXML('<layout name="root">' + layoutFieldValue + '</layout>'));

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
            $blockXml.attr('name', _.uniqueId('id_'));
        } else { // override name
            $blockXml.attr('name', dropzone);
        }
        xml.find("[name='"+parentName+"']").append($blockXml);

        render();
    }

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
            console.log(currentNode.attr('type'));
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

        return blockTemplate({
            title: $(currentNode).attr('name'),
            id: currentNode.attr('id'),
            tagName: currentNode.prop("tagName"),
            // children: renderChildren(currentNode.children('block'))
            children: getDropZones(currentNode).join('')
        });
    }

    var renderChildren = function(children) {
        var html = '';
        children.each(function(key, blockXml) {
            html += renderBlock(blockXml);
        });
        return html;
    }

    var render = function() {
        var xmlString = $.format(xml.find('layout').html());

        // setLayoutUpdateXmlFieldContent:
        $('#page_layout_update_xml').val(xmlString);
        $('pre#debug').text(xmlString);

        $('#root').html(renderChildren(xml.find('layout').children('reference'))); // entry points: <reference> tags

        init();
    }

    var init = function() {

        initXml();

        $('.action-delete').click(function() {
            var id = $(this).closest('.block').attr('id');
            xml.find('#'+id).remove();
            render();
        });

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

    }

    return {
        init: init,
        createNewBlock: createNewBlock,
        render: render
    };
}(jQuery, _));

jQuery(function() {
    AOE_LAYOUTEDITOR.init();
    AOE_LAYOUTEDITOR.render();
})


