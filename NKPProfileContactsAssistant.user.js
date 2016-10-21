// ==UserScript==
// @name         NKPProfileContactsAssistant
// @author       tim4fun6
// @version      0.1
// @updateURL    https://openuserjs.org/meta/tim4fun6/NKPProfileContactsAssistant.meta.js
// @description  Adds buttons for easy opening, reviewing, and selecting of profiles on NKP Contacts pages.
// @copyright    Copyright 2016 tim4fun6, https://github.com/tim4fun6/
// @license      BSD-3-Clause
// @homepageURL  https://github.com/tim4fun6/userscripts/
// @supportURL   https://github.com/tim4fun6/userscripts/wiki
// @include      https://*.nastykinkpigs.com/contacts.php?*
// @include      https://www.nastykinkpigs.com/contacts.php?*
// @require      https://code.jquery.com/jquery-3.1.0.slim.min.js#sha256=cRpWjoSOw5KcyIOaZNo4i6fZ9tKPhYYb6i5T9RSVJG8=
// @grant        GM_openInTab
// @run-at       document-end
// ==/UserScript==

$(document).ready(function() {

    $.nkp_profiles = function(){
        return $('.result_row_even, .result_row_odd');
    };

    $.fn.extend({
        nkp_checked: function(){
            return $(this).has('input[type=checkbox]');
        },
        nkp_not_checked: function(){
            return $(this).has('input[type=checkbox]:not(:checked)');
        },
        nkp_open: function(){
            return $(this).each(function(){
                GM_openInTab($(this).find('.res_nick a').attr('href'));
            });
        },
        nkp_select: function(){
            $(this).find('input[type=checkbox]').click();
            return this;
        }
    });

    var profileCount = null;
    var DEFAULT_PROFCOUNT = 10;

    var buttonCode = ['<br/>',
                      '<button type="button" class="showProf">Open &amp; Select Oldest ' + DEFAULT_PROFCOUNT + '</button>',
                      '<button type="button" class="selProf">Just Select Oldest ' + DEFAULT_PROFCOUNT + '</button>',
                      '<input type="text" value="' + DEFAULT_PROFCOUNT + '" size="4" maxlength="4" class="nkp-profileCount">'
                     ].join('\n');

    var updateCount = function(newCount) {
        if (typeof newCount === 'string') {
            var nc = parseInt(newCount, 10);
            updateCount(isNaN(nc) ? profileCount : nc);
        }
        else if (typeof newCount === 'number') {
            profileCount = newCount;
            $('.nkp-profilesCount').val(profileCount);
            $('.showProf').html('Open &amp;Select Oldest ' + profileCount);
            $('.selProf').html('Just Select Oldest ' + profileCount);
        }
    };

    $('input[type=submit]').after($(buttonCode));

    $('.nkp-profileCount').on('change', function(){
        updateCount($(this).val());
    });

    $('.showProf').on('click', function(){
        $.nkp_profiles().nkp_not_checked().slice(0-profileCount).nkp_select().nkp_open();
    });

    $('.selProf').on('click', function(){
        $.nkp_profiles().nkp_not_checked().slice(0-profileCount).nkp_select();
    });
    
    updateCount(DEFAULT_PROFCOUNT);

});


