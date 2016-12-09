// ==UserScript==
// @name         GMVCbizAlertOnGuysInChatroom
// @author .     tim4fun6
// @version .    0.1
// @updateURL    https://openuserjs.org/meta/tim4fun6/GMVCbizAlertOnGuysInChatroom.meta.js
// @description  Alerts when there is someone in the GMVC.biz chatroom. Use with an auto-reloader.
// @copyright    Copyright 2016 tim4fun6, https://github.com/tim4fun6/
// @license      BSD-3-Clause
// @homepageURL  https://github.com/tim4fun6/userscripts/
// @supportURL   https://github.com/tim4fun6/userscripts/wiki
// @require      https://code.jquery.com/jquery-3.1.0.slim.min.js#sha256=cRpWjoSOw5KcyIOaZNo4i6fZ9tKPhYYb6i5T9RSVJG8=
// @match        https://gmvc.biz/joomla/index.php?option=com_avchat3&view=avchat3&Itemid=765&lang=en
// @grant        GM_notification 
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// ==/UserScript==


(function() {
    'use strict';

    function fetchStatus () {
        // There are 1 users and 0 guests connected and 4 available rooms.
        var regex = /There are (\d+) users and (\d+) guests connected and (\d+) available rooms/;
        var info = $('p:contains(guests connected)').text();
        var result = regex.exec(info);
        var status = {};

        if (result) {
            status.users = result[1];
            status.guests = result[2];
            status.rooms = result[3];

            if (status.users > 0) {
                var usersDiv = $('h3:contains(Connected users)').next();
                status.usernames = usersDiv.children().map(function(){ return jQuery(this).text(); }).get();
            }
        } else {
            status.error = 'Could not parse page';
        }

        status.timestamp = (new Date()).getTime();
        return status;
    }

    function arr2str (arr) {
        if (!Array.isArray(arr)) {
            return 'not an array';
        } else {
            return arr.sort().join(';');
        }
    }


    function statusChanged(first, second){
        return first && second && first.users != second.users || arr2str(first.usernames) !== arr2str(second.usernames);
    }

    var emptyInfo = { users: 0, guests: 0, rooms: 0, usernames: [], timestamp: 0 };
    var priorStatus = GM_getValue('gmvc-roominfo', emptyInfo); 

    var status = fetchStatus();

    if (statusChanged(priorStatus, status)) {
        if (status.users > 0) {
            GM_notification({ text: 'There are ' + status.users + ' users in the GMVC chat room: ' + status.usernames.join(', '),
                             title: 'People in GMVC chat room',
                             highlight: true,
                             timeout: 15 });
        }
    }

    GM_setValue('gmvc-roominfo', status);

})();



