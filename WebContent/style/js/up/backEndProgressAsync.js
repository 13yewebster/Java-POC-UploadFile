
	// Information File
	function fileSelected() {
		var file = document.getElementById('fileToUpload').files[0];
		if (file) {
			var fileSize;
			if (file.size > 1024 * 1024)
			fileSize = (Math.round(file.size * 100 / (1024 * 1024)) / 100).toString() + 'MB';
			else
			fileSize = (Math.round(file.size * 100 / 1024) / 100).toString() + 'KB';

			console.log('File Info : ');
			console.log('Name: ' + file.name);
			console.log('Size: ' + fileSize);
			console.log('Type: ' + file.type);
			console.log('Last Modified: ' + file.lastModifiedDate ? file.lastModifiedDate.toLocaleDateString() : 'n/a');
		}
	}

	// Remove Disabled from Button
	document.getElementById('fileToUpload').addEventListener('change', function() {
		document.getElementById('uploadButton').removeAttribute('disabled');
	}, false);


	// Upload Async
	function uploadAsync() {

		var data = new FormData();
		var toDirectory = document.getElementById('toDirectory').value;
		var file = document.getElementById('fileToUpload').files[0];
		data.append('toDirectory', toDirectory);
		data.append('file', file);

		$.ajax({
			type : 'POST',
			url : '../UploadServletTwo',
			data : data,
			cache : false,
			contentType : false,
			processData : false,
			success : function() {
				console.log(data);
			}
		});

	};


	function startTask() {

		uploadAsync();

		// DOM Manipulations
		$('.forms').css('display', 'none');
		$('.notif').css('display', 'block');
		$('.states').text('Initialize Upload Progress');

		var percent = 0;

		/* Create The Event Source */
		var source = new EventSource('../ProgressServletTwo');

		/* Handle Incoming Messages */
		source.onmessage = function(event) {
			if (event.type == 'message') {

				// Expected Data in JSON Format, So Parse */
				var data = JSON.parse(event.data);

				// Server Sends Complete:true On Completion
				if (data.complete) {

					// Close The Connection So Browser Does Not Keep Connecting
					source.close();

					// Update The UI Now That Task is Complete
					$('.states').text('Your file has been uploaded');
					$('.progress-bar').text('Complete');
					$('.agains').slideDown('slow');

					$('.agains').click(function() {

						$('.fileToUpload').val('');
						$('.uploadButton').prop('disabled', true);
						$('.notif, .agains').css('display', 'none');
						$('.forms').css('display', 'block');
						$('.progress-bar').removeAttr('style');

					});
				}

				// Otherwise, It's a Progress Update So Just Update Progress Bar
				else {

					//var percent = 100.0 * data.current / data.total;
					percent = data.current;

					// From Now and On Console Log Only For Debugs
					console.log('Upload Progress: ' + percent + '%');

					// DOM Manipulations
					$('.states').text('Upload Progress');
					$('.progress-bar').css('width', percent + '%');
					$('.progress-bar').text(percent + '%');

				}
			}
		};

		source.onerror = function(event) {

			// console.log('Failed to Start EventSource: ', event);

			// DOM Manipulations
			// $('.states').text('Unable Connect To The Server');

		};

	}
