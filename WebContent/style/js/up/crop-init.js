
// Set Form data and Datas send by AJAX
function datasSend() {

	var data        = new FormData(),
		toDirectory = document.getElementById('toDirectory').value,
		fileName    = document.getElementById('fileName').value,
		fileData    = document.getElementById('fileData').value;

	data.append('toDirectory', toDirectory);
	data.append('fileName', fileName);
	data.append('imageDatas', fileData);

	$.ajax({

		type : 'POST',
		url : '../UploadServletFour',
		data : data,
		cache : false,
		contentType : false,
		processData : false,
		success : function() {
			console.log(data);
		}

	});

};

// File Sent Server Event
function fileSSE() {

	// Call a Function
	datasSend();

	// Set File, Create Form Data, and Create XHR
	var file = document.getElementById('fileToUpload').files[0],
		sses = new EventSource('../ProgressServletFour');

	// Server Sent Events
	sses.addEventListener('open', openSSE, false);
	sses.addEventListener('message', messageSSE, false);
	// sses.addEventListener('error', errorSSE, false);

	// Initialize Upload Progress
	function openSSE() {

		console.log('Open Connection To Server');

		// DOM Manipulations
		$('.forms').css('display', 'none');
		$('.notif').css('display', 'block');
		$('.states').text('Initializing');

	}

	// Upload Progress
	function messageSSE(event) {

		if (event.type == 'message') {

			// Get Data Form The Server
			var data = JSON.parse(event.data);

			if (data.complete) {

				sses.close();
				console.log('The transfer is complete');

				// DOM Manipulations
				$('.states').text('Your file has been uploaded');
				$('.progress-bar').text('Complete');

				setTimeout(function() {

					$('.fileToUpload').val('');
					$('.uploadButton').prop('disabled', true);
					$('.notif').css('display', 'none');
					$('.forms').css('display', 'block');
					$('.progress-bar').removeAttr('style');

				}, 3000);

			} else {

				var pct = data.current;

				// From Now and On Console Log Only For Debugs
				console.log('Upload Progress: ' + pct + '%');

				// DOM Manipulations
				$('.states').text('Upload Progress');
				$('.progress-bar').css('width', pct + '%');
				$('.progress-bar').text(pct + '%');

			}

		}

	}

	// Upload Failed
	function errorSSE(event) {

		console.log('An error occurred while transferring the file', event);

		// DOM Manipulations
		$('.states').text('An error occurred while transferring the file');
		$('.progress-bar').text('Failed');

		// Close Connection
		sses.close();

	}

};

// Create Custom
// var parWid = $('.example').width();
// $('.default .cropMain').css({'width' : parWid, 'height' : parWid});

// Start
function loadImageFile() {
	if (document.getElementById('fileToUpload').files.length === 0)
		return;
	var e = document.getElementById('fileToUpload').files[0];
	if (!rFilter.test(e.type)) {
		return
	}
	document.getElementById('fileName').value = e.name,
	oFReader.readAsDataURL(e)
}

// Rotator
var angleRot = 0, imgRot = $('.cropMain');
$('.rotator').click(function() {
  imgRot.removeClass('rotate'+angleRot);
  angleRot = (angleRot+90)%360;
  imgRot.addClass('rotate'+angleRot);
});

// Cropper
var one = new CROP;
one.init('.default');
one.loadImg('../style/img/example.jpg');
$('body').on('click', '.cropper', function() {
	$('canvas').remove();
	$('.output').remove();
	$('.default').after('<canvas width="240" height="240" id="canvas"/>');
	var v = document.getElementById("canvas");
	var e = v.getContext('2d'), t = new Image, n = coordinates(one).w, r = coordinates(one).h, i = coordinates(one).x, s = coordinates(one).y, o = 240, u = 240;
	t.src = coordinates(one).image;
	t.onload = function() {
		e.clearRect(0,0,canvas.width,canvas.height);
		e.drawImage(t, i, s, n, r, 0, 0, o, u);
		// $('canvas').addClass('output').show().delay('4000').fadeOut('slow');
		// e.drawImage(t,v.width/2-t.width/2,v.height/2-t.width/2);
		e.save();
		e.translate(v.width/2,v.height/2);
		e.rotate(angleRot*Math.PI/180);
		e.drawImage(v,-v.width/2,-v.width/2);
		e.restore();
		dataUrl  = document.getElementById('canvas').toDataURL(),

		// Convert Canvas To Base64
		dataHolder = document.getElementById('fileData');
		dataHolder.value = dataUrl;

		imgOutput = document.createElement('img');
		imgOutput.className = 'output';
		imgOutput.src = dataUrl;
		// $('.default').after(imgOutput);

		// Call a Function
		fileSSE();

		// document.getElementById('UploadServlet').submit();
		// event.preventDefault();
	}
});

$('.fileToUpload').change(function() {
	loadImageFile();
	$('.fileToUpload').wrap('<form>').closest('form').get(0).reset();
	$('.fileToUpload').unwrap()
});

oFReader = new FileReader, rFilter = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i;
oFReader.onload = function(e) {
	$('.example').html('<div class="default"><div class="cropMain"></div><div class="cropSlider"></div></div>'); // <button class="cropButton">Crop</button>
	// $('.default .cropMain').css({'width' : parWid, 'height' : parWid});
	one = new CROP;
	one.init(".default");
	one.loadImg(e.target.result);
	// Set Angle To Zero
	angleRot = 0;
	imgRot = $('.cropMain');
}
