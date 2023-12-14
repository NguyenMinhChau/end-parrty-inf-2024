const SLOTS_PER_REEL = 12;
const REEL_RADIUS = 150;
let countDraw = 0;
let numberOne = '';
let numberTwo = '';
let numberThree = '';

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

function spin(timer, ring) {
	var oldSeed = -1;
	var oldClass = $(ring).attr('class');
	if (oldClass.length > 4) {
		oldSeed = parseInt(oldClass.slice(10));
	}
	var seed = getSeed();
	while (oldSeed == seed) {
		seed = getSeed();
	}

	if (ring === '#ring2') {
		numberOne = (((seed + 4) % SLOTS_PER_REEL) % 10).toString();
	} else if (ring === '#ring3') {
		numberTwo = (((seed + 4) % SLOTS_PER_REEL) % 10).toString();
	} else {
		numberThree = (((seed + 4) % SLOTS_PER_REEL) % 10).toString();
	}

	$(ring)
		.css(
			'animation',
			'back-spin 1s, spin-' + seed + ' ' + (timer + 0.5) + 's',
		)
		.attr('class', 'ring spin-' + seed);
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
			$('.action_draw').css('pointer-events', 'none');
			$('.action_save').css('pointer-events', 'none');
			$('.action_reset').css('pointer-events', 'none');
			setTimeout(() => {
				$('.action_draw').css('pointer-events', 'auto');
				$('.action_save').css('pointer-events', 'auto');
				$('.action_reset').css('pointer-events', 'auto');
			}, 3000);
			if (countDraw === 1) {
				spin(timer, '#ring2');
				if (audio.paused) {
					audio.play();
					audio.loop = true;
				}
				$('.action_draw').text('Quay lần 2');
			} else if (countDraw === 2) {
				spin(timer, '#ring3');
				$('.action_draw').text('Quay lần 3');
			} else {
				spin(timer, '#ring4');
				$('.action_draw').css('display', 'none');
				$('.action_save').css('display', 'flex');
				$('.action_reset').css('display', 'flex');
			}
		}
	});

	// reset click
	$('.action_reset').on('click', function () {
		$('.action_draw').text('Quay lần 1');
		$('.action_draw').css('display', 'flex');
		$('.action_save').css('display', 'none');
		$('.action_reset').css('display', 'none');
		$('#ring2').attr('class', 'ring');
		$('#ring3').attr('class', 'ring');
		$('#ring4').attr('class', 'ring');
		$('.modal_code_container').empty();
		audioClaps.pause();
		countDraw = 0;
		numberOne = '';
		numberTwo = '';
		numberThree = '';
	});

	// save click
	$('.action_save').on('click', function () {
		audioClaps.play();
		$('.modal-loading').css('display', 'flex');
		const htmlModalCodeItem = `
		<div class="modal_code_item">${numberOne}</div>
		<div class="modal_code_item">${numberTwo}</div>
		<div class="modal_code_item">${numberThree}</div>
		`;
		$('.modal_code_container').append(htmlModalCodeItem);
		$('.product').text('1 chiếc điện thoại Iphone 15 Pro Max 1TB');
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
		numberOne = '';
		numberTwo = '';
		numberThree = '';
	});

	// close modal click
	$('.close_modal_container').on('click', function () {
		$('.modal-loading').css('display', 'none');
		$('.action_draw').text('Quay lần 1');
		$('.action_draw').css('display', 'flex');
		$('.action_save').css('display', 'none');
		$('.action_reset').css('display', 'none');
		$('#ring2').attr('class', 'ring');
		$('#ring3').attr('class', 'ring');
		$('#ring4').attr('class', 'ring');
		$('.modal_code_container').empty();
		audioClaps.pause();
		countDraw = 0;
		numberOne = '';
		numberTwo = '';
		numberThree = '';
	});
});
