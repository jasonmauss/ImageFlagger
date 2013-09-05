// Jquery flag-image
// Desc: Allows images to be reported as offensive or flagged for whatever reason.

$(document).ready(function () {
    // class name used to denote an image as potentially offensive
    // and "flaggable" is..you guessed it - 'flaggable'
    // change it below if you want to call it something else
    var className = 'flaggable';
    $('.' + className).each(function (index) {
        $(this).on('load', function () {
            var elementID = $(this).attr('id');
            if (elementID === null || typeof elementID === 'undefined') {
                elementID = 'flaggableElement' + index.toString();
                $(this).attr('id', elementID);
            }
            var $reportOverlayBtn;
            var overlayButtonExisted = false;

            if ($('span[data-element-id="' + elementID + '"]').length == 0) {
                $reportOverlayBtn = $('<span class="flag-overlay" data-element-id="' + elementID + '" title="Flag this image as offensive or violating copyrights.">Report Image</span>');
            } else {
                overlayButtonExisted = true;
                $reportOverlayBtn = $('span[data-element-id="' + elementID + '"]');
            }

            // get coordinates and position overlay button
            var overlayTop,
            overlayLeft,
            elementHeight,
            elementWidth,
            offset,
	    padding,
	    buttonHeight,
	    buttonWidth;

            // default overlay button is width x height = 79x25. Change in CSS and here if desired

	    padding = 3;
	    buttonHeight = 25;
	    buttonWidth = 79;

            offset = $(this).offset();
            elementHeight = $(this).height();
            elementWidth = $(this).width()

            overlayTop = offset.top + (elementHeight - (buttonHeight + padding));
            overlayLeft = offset.left + (elementWidth - (buttonWidth + padding));

            if (overlayButtonExisted == false) {
                $(this).after($reportOverlayBtn);

                $reportOverlayBtn.css('top', overlayTop + 'px');
                $reportOverlayBtn.css('left', overlayLeft + 'px');

                $reportOverlayBtn.css('display', 'none');

                $(this).on('mouseover', function () {
                    $reportOverlayBtn.css('display', 'inline');
                });

                $(this).on('mouseout', function () {
                    $reportOverlayBtn.css('display', 'none');
                });

                $reportOverlayBtn.on('mouseover', function () {
                    $reportOverlayBtn.css('display', 'inline');
                });

                $reportOverlayBtn.on('mouseout', function () {
                    $reportOverlayBtn.css('display', 'none');
                });

                $reportOverlayBtn.on('click', function () {
                    var imgElementID = $(this).attr('data-element-id');
                    var $img = $('#' + imgElementID);
                    var imgSource = $img.attr('src');
                    if (imgSource.indexOf('http') != 0) {
                        imgSource = window.location.hostname + imgSource;
                    }

                    if (confirm('Are you sure you want to flag this image for review?') == true) {
                        $.ajax({
                            type: 'POST',
                            url: '/ReportPhoto',
                            data: 'photoUrl=' + encodeURI(imgSource),
                            timeout: 15000,
                            success: reportPhotoSuccess,
                            error: reportPhotoError
                        });
                    }
                });
            }
        });

        var reportPhotoSuccess = function (data, textStatus, jqXHR) {
            // do what you want here in the success event handler
            // perhaps something like: alert('This photo has been flagged and will be reviewed. Thank you.');
        };

        var reportPhotoError = function (jqXHR, textStatus, errorThrown) {
	    // do what you want here to handle the error, perhaps something like:
            //if (textStatus === 'timeout') {
            //    alert('The request to report this image timed out. Please try again in a minute.');
            //}
            //else {
            //    alert('An error occurred on the server. Please try reporting this image again in a minute.');
            //}
        };
    });
});
