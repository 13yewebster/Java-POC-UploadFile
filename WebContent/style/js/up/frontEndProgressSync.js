
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

	// File Upload Progress
	function fileUpload() {

		// Remove Disabled Attribute on Button and Show File Informations
		document.getElementById('fileToUpload').addEventListener('change', function() {

			document.getElementById('uploadButton').removeAttribute('disabled');
			fileSelected();

		}, false);

		// Event Handler Type Click
		document.getElementById('uploadButton').addEventListener('click', function() {

			// Set File, Create Form Data, and Create XHR
			var file = document.getElementById('fileToUpload').files[0],
			toDirectory = document.getElementById('toDirectory').value,
				fd = new FormData(),
				xhr = new XMLHttpRequest();

			// Append File to Form Data
			fd.append('file1', file);
			fd.append('toDirectory', toDirectory);

			// XHR Event Handlers with Upload Attribute
			xhr.upload.addEventListener('loadstart', initProgress, false);
			xhr.upload.addEventListener('progress', updateProgress, false);
			xhr.upload.addEventListener('load', transferComplete, false);
			xhr.upload.addEventListener('error', transferFailed, false);

			// Initialize Upload Progress
			function initProgress() {


				console.log('Upload Progress Start : ');
				console.log('Initialize Upload Progress');

				// DOM Manipulations
				$('.forms').css('display', 'none');
				$('.notif').css('display', 'block');
				$('.states').text('Initialize Upload Progress');

			}

			// Upload Progress
			function updateProgress(e) {

				if (e.lengthComputable) {

					var done = e.loaded,
					total = e.total;
					percent = (Math.floor(done/total*100));

					// From Now and On Console Log Only For Debugs
					console.log('Upload Progress: ' + percent + '%');

					// DOM Manipulations
					$('.states').text('Upload Progress');
					$('.progress-bar').css('width', percent + '%');
					$('.progress-bar').text(percent + '%');

				} else {

					console.log('Unable to compute progress information since the total size is unknown');

					// DOM Manipulations
					$('.states').text('Unable to compute progress information since the total size is unknown');

				}

			}

			// Upload Complete
			function transferComplete() {

				console.log('The transfer is complete');

				// DOM Manipulations
				$('.states').text('Patching your file');
				$('.progress-bar').text('Patching');

				}

			// Upload Failed
			function transferFailed() {

				console.log('An error occurred while transferring the file');

				// DOM Manipulations
				$('.states').text('An error occurred while transferring the file');
				$('.progress-bar').text('Failed');

				}


			xhr.onreadystatechange = function(e) {

				if ( 4 == this.readyState ) {

					console.log(['XHR Done', e]);

					// DOM Manipulations
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

			};

			// Here we go open event select method, url, async
			xhr.open('POST', '../UploadServletOne', false);
			xhr.send(fd);

		}, false);

	};

	// Triggers
	$(function() {
		fileUpload();
	});
