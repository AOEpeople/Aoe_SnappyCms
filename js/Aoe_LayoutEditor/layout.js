jQuery.noConflict();

var AOE_LAYOUTEDITOR = (function ($, _) {

    var templates = {
        blockTemplate: '<div id="<%= id %>" class="block entry-edit">' +
            '<div class="entry-edit-head"><h4><%= title %> (<%= id %>)</h4></div>' +
            '<div class="fieldset"><div class="children"><%= children %></div></div>' +
        '</div>'
    }

    // read current layout xml to initialize the editor
    var layoutFieldValue = $('#page_layout_update_xml').val();
    var xml = $($.parseXML('<layout id="root">' + layoutFieldValue + '</layout>'));

    var createNewBlock = function(parentId) {
        parentId = parentId || 'root';
        xml.find('#'+parentId).append('<block id="' + _.uniqueId('block_') + '"></block>');
        render();
    }

    var renderBlock = function(currentNode) {
        var blockTemplate = _.template(templates.blockTemplate);

        currentNode = $(currentNode);

        return blockTemplate({
            title: 'Hello World',
            id: currentNode.attr('id'),
            children: renderChildren(currentNode.children('block'))
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
        $('#page_layout_update_xml').val(xmlString);
        // $('pre#debug').text(xmlString);
        $('#root').html(renderChildren(xml.find('layout').children('block')));
        init();
    }

    var init = function() {
        $('.action-delete').click(function() {
            var id = $(this).closest('.block').attr('id');
            xml.find('#'+id).remove();
            render();
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

        $('.children').droppable({
            greedy: true,
            drop: function(event, ui) {
                // alert('Dropped');
                var sourceId = ui.draggable.attr('id');
                var targetId = $(this).closest('.block').attr('id');
                console.log('Appending ' + sourceId + ' to ' + targetId);
                xml.find('#'+targetId).append(xml.find('#'+sourceId));
                render();
            },
            over: function(event, ui) {
                $(this).addClass("ui-state-highlight");
            },
            out: function(event, ui) {
                $(this).removeClass("ui-state-highlight");
            }
        });
    }

    return {
        init: init,
        createNewBlock: createNewBlock
    };
}(jQuery, _));

jQuery(function() {
    AOE_LAYOUTEDITOR.init();

    jQuery('#create').click(function() {
        AOE_LAYOUTEDITOR.createNewBlock();
        return false;
    });
})

