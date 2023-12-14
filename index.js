$(document).ready(function () {
	const SLOTS_PER_REEL = 12;
	const REEL_RADIUS = 150;
	let countDraw = 0;
	let numberFinal = '';

	$('.action_save').css('display', 'none');
	$('.action_reset').css('display', 'none');

	function createSlots(ring) {
		var slotAngle = 360 / SLOTS_PER_REEL;

		var seed = 0;

		for (var i = 0; i < SLOTS_PER_REEL; i++) {
			var slot = document.createElement('div');

			slot.className = 'slot';

			// compute and assign the transform for this slot
			var transform =
				'rotateX(' +
				slotAngle * i +
				'deg) translateZ(' +
				REEL_RADIUS +
				'px)';

			slot.style.transform = transform;

			// setup the number to show inside the slots
			// the position is randomized to

			var content = $(slot).append('<p>' + ((seed + i) % 10) + '</p>');

			// add the poster to the row
			ring.append(slot);
		}
	}

	function getSeed() {
		return Math.floor(Math.random() * 10);
	}

	function spin(timer) {
		var result = '';
		for (var i = 2; i < 5; i++) {
			var oldSeed = -1;
			/*
            checking that the old seed from the previous iteration is not the same as the current iteration;
            if this happens then the reel will not spin at all
            */
			var oldClass = $('#ring' + i).attr('class');
			if (oldClass.length > 4) {
				oldSeed = parseInt(oldClass.slice(10));
			}
			var seed = getSeed();
			if (i == 2) {
				seed = getSeed();
			}
			while (oldSeed == seed) {
				if (i == 2) {
					seed = getSeed();
				} else {
					seed = getSeed();
				}
			}

			result += ((seed + 4) % SLOTS_PER_REEL) % 10;

			// $('#ring' + i)
			// 	.css(
			// 		'animation',
			// 		'back-spin 1s, spin-' + seed + ' ' + (timer + i * 1) + 's',
			// 	)
			// 	.attr('class', 'ring spin-' + seed);
			if (countDraw == 1) {
				$('#ring2')
					.css(
						'animation',
						'back-spin 1s, spin-' +
							seed +
							' ' +
							(timer + i * 1) +
							's',
					)
					.attr('class', 'ring spin-' + seed);
			} else if (countDraw == 2) {
				$('#ring3')
					.css(
						'animation',
						'back-spin 1s, spin-' +
							seed +
							' ' +
							(timer + i * 1) +
							's',
					)
					.attr('class', 'ring spin-' + seed);
			} else {
				$('#ring4')
					.css(
						'animation',
						'back-spin 1s, spin-' +
							seed +
							' ' +
							(timer + i * 1) +
							's',
					)
					.attr('class', 'ring spin-' + seed);
			}
		}
		numberFinal += result[2]?.toString();
	}

	$(document).ready(function () {
		createSlots($('#ring2'));
		createSlots($('#ring3'));
		createSlots($('#ring4'));
		let audio = new Audio('./spin_audio.mp3');
		let audioClaps = new Audio('./claps_audio.mp3');

		audio.addEventListener(
			'ended',
			function () {
				this.currentTime = 0;
				this.play();
			},
			false,
		);

		// hook start button
		$('.action_draw').on('click', function () {
			countDraw++;
			if (countDraw <= 3) {
				var timer = 3;
				spin(timer);
				$('.action_draw').css('pointer-events', 'none');
				$('.action_save').css('pointer-events', 'none');
				$('.action_reset').css('pointer-events', 'none');
				setTimeout(() => {
					$('.action_draw').css('pointer-events', 'auto');
					$('.action_save').css('pointer-events', 'auto');
					$('.action_reset').css('pointer-events', 'auto');
				}, 7000);
				if (countDraw === 1) {
					if (audio.paused) {
						audio.play();
						audio.loop = true;
					}
					$('.action_draw').text('Quay lần 2');
				} else if (countDraw === 2) {
					$('.action_draw').text('Quay lần 3');
				} else {
					$('.action_draw').css('display', 'none');
					$('.action_save').css('display', 'flex');
					$('.action_reset').css('display', 'flex');
				}
			}
		});

		// reset click
		$('.action_reset').on('click', function () {
			audioClaps.pause();
			countDraw = 0;
			$('.action_draw').text('Quay lần 1');
			$('.action_draw').css('display', 'flex');
			$('.action_save').css('display', 'none');
			$('.action_reset').css('display', 'none');
			$('#ring2').attr('class', 'ring');
			$('#ring3').attr('class', 'ring');
			$('#ring4').attr('class', 'ring');
			numberFinal = '';
		});

		// save click
		$('.action_save').on('click', function () {
			if (numberFinal?.length === 3) {
				audioClaps.play();
				$('.modal-loading').css('display', 'flex');
				const htmlModalCodeItem = numberFinal
					?.split('')
					.map((item) => {
						return `<div class="modal_code_item">${item}</div>`;
					})
					.join('');
				$('.modal_code_container').append(htmlModalCodeItem);
				$('.product').text('1 chiếc điện thoại Iphone 15 Pro Max 1TB');
				numberFinal = '';
				// var data = {
				// 	result: result,
				// };
				// $.ajax({
				// 	type: 'POST',
				// 	url: '/api/save',
				// 	data: data,
				// 	success: function (data) {
				// 		if (data.status === 'success') {
				// 			alert('Lưu thành công');
				// 		} else {
				// 			alert('Lưu thất bại');
				// 		}
				// 	},
				// 	error: function (data) {
				// 		alert('Lưu thất bại');
				// 	},
				// });
			}
		});

		// close modal click
		$('.close_modal_container').on('click', function () {
			audioClaps.pause();
			countDraw = 0;
			$('.modal-loading').css('display', 'none');
			$('.action_draw').text('Quay lần 1');
			$('.action_draw').css('display', 'flex');
			$('.action_save').css('display', 'none');
			$('.action_reset').css('display', 'none');
			$('#ring2').attr('class', 'ring');
			$('#ring3').attr('class', 'ring');
			$('#ring4').attr('class', 'ring');
			numberFinal = '';
		});
	});
});
