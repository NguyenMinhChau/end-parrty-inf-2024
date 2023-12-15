// const SLOTS_PER_REEL = 12;
// const REEL_RADIUS = 150;
// let countDraw = 0;
// let numberOne = '';
// let numberTwo = '';
// let numberThree = '';

// $('.action_draw').css('display', 'none');
// $('.action_save').css('display', 'none');
// $('.action_reset').css('display', 'none');
// $('.rotate_container').css('display', 'none');

// function createSlots(ring) {
// 	var slotAngle = 360 / SLOTS_PER_REEL;

// 	var seed = 0;

// 	for (var i = 0; i < SLOTS_PER_REEL; i++) {
// 		var slot = document.createElement('div');

// 		slot.className = 'slot';

// 		// compute and assign the transform for this slot
// 		var transform =
// 			'rotateX(' +
// 			slotAngle * i +
// 			'deg) translateZ(' +
// 			REEL_RADIUS +
// 			'px)';

// 		slot.style.transform = transform;

// 		// setup the number to show inside the slots
// 		// the position is randomized to

// 		var content = $(slot).append('<p>' + ((seed + i) % 10) + '</p>');

// 		// add the poster to the row
// 		ring.append(slot);
// 	}
// }

// function getSeed() {
// 	return Math.floor(Math.random() * 10);
// }

// function spin(timer, ring) {
// 	var oldSeed = -1;
// 	var oldClass = $(ring).attr('class');
// 	if (oldClass.length > 4) {
// 		oldSeed = parseInt(oldClass.slice(10));
// 	}
// 	var seed = getSeed();
// 	while (oldSeed == seed) {
// 		seed = getSeed();
// 	}

// 	if (ring === '#ring2') {
// 		numberOne = (((seed + 4) % SLOTS_PER_REEL) % 10).toString();
// 	} else if (ring === '#ring3') {
// 		numberTwo = (((seed + 4) % SLOTS_PER_REEL) % 10).toString();
// 	} else {
// 		numberThree = (((seed + 4) % SLOTS_PER_REEL) % 10).toString();
// 	}

// 	$(ring)
// 		.css(
// 			'animation',
// 			'back-spin 1s, spin-' + seed + ' ' + (timer + 0.5) + 's',
// 		)
// 		.attr('class', 'ring spin-' + seed);
// }

// $(document).ready(function () {
// 	createSlots($('#ring2'));
// 	createSlots($('#ring3'));
// 	createSlots($('#ring4'));
// 	let audio = new Audio('./spin_audio.mp3');
// 	let audioClaps = new Audio('./claps_audio.mp3');

// 	audio.addEventListener(
// 		'ended',
// 		function () {
// 			this.currentTime = 0;
// 			this.play();
// 		},
// 		false,
// 	);

// 	$.ajax({
// 		url: 'http://1.52.246.101:4000/v1/icdp-backend-mobile/ct-tat-nien/get-prizes',
// 		type: 'GET',
// 		dataType: 'json',
// 		crossDomain: true,
// 		success(response) {
// 			console.log(response);
// 		},
// 		error(jqXHR, status, errorThrown) {},
// 	});

// 	// hook start button
// 	$('.action_draw').on('click', function () {
// 		countDraw++;
// 		if (countDraw <= 3) {
// 			var timer = 3;
// 			$('.action_draw').css('pointer-events', 'none');
// 			$('.action_save').css('pointer-events', 'none');
// 			$('.action_reset').css('pointer-events', 'none');
// 			setTimeout(() => {
// 				$('.action_draw').css('pointer-events', 'auto');
// 				$('.action_save').css('pointer-events', 'auto');
// 				$('.action_reset').css('pointer-events', 'auto');
// 			}, 3000);
// 			if (countDraw === 1) {
// 				spin(timer, '#ring2');
// 				if (audio.paused) {
// 					audio.play();
// 					audio.loop = true;
// 				}
// 				$('.action_draw').text('Quay lần 2');
// 			} else if (countDraw === 2) {
// 				spin(timer, '#ring3');
// 				$('.action_draw').text('Quay lần 3');
// 			} else {
// 				spin(timer, '#ring4');
// 				$('.action_draw').css('display', 'none');
// 				$('.action_save').css('display', 'flex');
// 				$('.action_reset').css('display', 'flex');
// 			}
// 		}
// 	});

// 	// choose prize click
// 	$('.action_choose_prize').on('click', function () {
// 		$('.modal-prize').css('display', 'flex');
// 	});

// 	// close modal prize click
// 	$('.close_modal_prize_container').on('click', function () {
// 		$('.modal-prize').css('display', 'none');
// 	});

// 	// reset click
// 	$('.action_reset').on('click', function () {
// 		$('.action_draw').text('Quay lần 1');
// 		$('.action_draw').css('display', 'flex');
// 		$('.action_save').css('display', 'none');
// 		$('.action_reset').css('display', 'none');
// 		$('#ring2').attr('class', 'ring');
// 		$('#ring3').attr('class', 'ring');
// 		$('#ring4').attr('class', 'ring');
// 		$('.modal_code_container').empty();
// 		audioClaps.pause();
// 		countDraw = 0;
// 		numberOne = '';
// 		numberTwo = '';
// 		numberThree = '';
// 	});

// 	// save click
// 	$('.action_save').on('click', function () {
// 		audioClaps.play();
// 		$('.modal-loading').css('display', 'flex');
// 		const htmlModalCodeItem = `
// 		<div class="modal_code_item">${numberOne}</div>
// 		<div class="modal_code_item">${numberTwo}</div>
// 		<div class="modal_code_item">${numberThree}</div>
// 		`;
// 		$('.modal_code_container').append(htmlModalCodeItem);
// 		$('.product').text('1 chiếc điện thoại Iphone 15 Pro Max 1TB');
// 		// var data = {
// 		// 	result: result,
// 		// };
// 		// $.ajax({
// 		// 	type: 'POST',
// 		// 	url: '/api/save',
// 		// 	data: data,
// 		// 	success: function (data) {
// 		// 		if (data.status === 'success') {
// 		// 			alert('Lưu thành công');
// 		// 		} else {
// 		// 			alert('Lưu thất bại');
// 		// 		}
// 		// 	},
// 		// 	error: function (data) {
// 		// 		alert('Lưu thất bại');
// 		// 	},
// 		// });
// 		numberOne = '';
// 		numberTwo = '';
// 		numberThree = '';
// 	});

// 	// close modal click
// 	$('.close_modal_container').on('click', function () {
// 		$('.modal-loading').css('display', 'none');
// 		$('.action_draw').text('Quay lần 1');
// 		$('.action_draw').css('display', 'flex');
// 		$('.action_save').css('display', 'none');
// 		$('.action_reset').css('display', 'none');
// 		$('#ring2').attr('class', 'ring');
// 		$('#ring3').attr('class', 'ring');
// 		$('#ring4').attr('class', 'ring');
// 		$('.modal_code_container').empty();
// 		audioClaps.pause();
// 		countDraw = 0;
// 		numberOne = '';
// 		numberTwo = '';
// 		numberThree = '';
// 	});
// });

document.addEventListener('DOMContentLoaded', function () {
	const actionDraw = document.querySelector('.action_draw');
	const actionSave = document.querySelector('.action_save');
	const actionReset = document.querySelector('.action_reset');
	const actionChoosePrize = document.querySelector('.action_choose_prize');
	const actionSubmitPrize = document.querySelector('.action_submit_prize');
	const actionReChoosePrize = document.querySelector(
		'.action_re_choose_prize',
	);

	const ring2Element = document.querySelector('#ring2');
	const ring3Element = document.querySelector('#ring3');
	const ring4Element = document.querySelector('#ring4');

	const modalLoading = document.querySelector('.modal-loading');
	const modalPrize = document.querySelector('.modal-prize');
	const rotatedContainer = document.querySelector('.rotate_container');
	const modalCodeContainer = document.querySelector('.modal_code_container');

	const closeModalElement = document.querySelector('.close_modal_container');
	const closeModalPrizeElement = document.querySelector(
		'.close_modal_prize_container',
	);
	const productElement = document.querySelector('.product');
	const tableBodyElement = document.querySelector('.table tbody');
	const prizeNameElement = document.querySelector('.prize_name');

	const SLOTS_PER_REEL = 12;
	const REEL_RADIUS = 150;
	let prize = null;
	let prizeData = null;
	let countDraw = 0;
	let numberOne = '';
	let numberTwo = '';
	let numberThree = '';

	actionDraw.style.display = 'none';
	actionSave.style.display = 'none';
	actionReset.style.display = 'none';
	rotatedContainer.style.display = 'none';
	actionReChoosePrize.style.display = 'none';

	//! Call API get data info
	const fetchAPI = async ({
		method = 'POST',
		url,
		body,
		onSuccess = () => {},
		onError = () => {},
	}) => {
		return await fetch(url, {
			method: method,
			body: JSON.stringify(body),
		})
			.then((res) => res.json())
			.then((res) => {
				onSuccess(res);
			})
			.catch((err) => {
				onError(err);
			});
	};

	function createSlots(ring) {
		var slotAngle = 360 / SLOTS_PER_REEL;

		for (var i = 0; i < SLOTS_PER_REEL; i++) {
			var slot = document.createElement('div');

			slot.className = 'slot';

			var transform =
				'rotateX(' +
				slotAngle * i +
				'deg) translateZ(' +
				REEL_RADIUS +
				'px)';

			slot.style.transform = transform;

			var seed = 0;
			var content = document.createElement('p');
			content.textContent = (seed + i) % 10;
			slot.appendChild(content);

			// add the poster to the row
			ring.appendChild(slot);
		}
	}

	function getSeed() {
		return Math.floor(Math.random() * 10);
	}

	function spin(timer, ring) {
		var oldSeed = -1;
		var oldClass = document.querySelector(ring).className;
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

		var ringElement = document.querySelector(ring);
		ringElement.style.animation =
			'back-spin 1s, spin-' + seed + ' ' + (timer + 0.5) + 's';
		ringElement.className = 'ring spin-' + seed;
	}

	createSlots(ring2Element);
	createSlots(ring3Element);
	createSlots(ring4Element);

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

	actionDraw.addEventListener('click', function () {
		countDraw++;
		if (countDraw <= 3) {
			var timer = 3;
			actionDraw.style.pointerEvents = 'none';
			actionSave.style.pointerEvents = 'none';
			actionReset.style.pointerEvents = 'none';
			setTimeout(() => {
				actionDraw.style.pointerEvents = 'auto';
				actionSave.style.pointerEvents = 'auto';
				actionReset.style.pointerEvents = 'auto';
			}, 3000);
			if (countDraw === 1) {
				spin(timer, '#ring2');
				actionDraw.textContent = 'Quay lần 2';
			} else if (countDraw === 2) {
				spin(timer, '#ring3');
				actionDraw.textContent = 'Quay lần 3';
			} else {
				spin(timer, '#ring4');
				actionDraw.style.display = 'none';
				actionSave.style.display = 'flex';
				actionReset.style.display = 'flex';
			}
		}
	});

	// GET LIST PRIZE
	fetchAPI({
		url: 'http://1.52.246.101:4000/v1/icdp-backend-mobile/ct-tat-nien/get-prizes',
		method: 'GET',
		onSuccess: (res) => {
			const htmlTableBody = res.payload
				.map((item, _idx) => {
					const { prizeName, prizeCode, _id } = { ...item };
					return `
					<tr style="text-align: center">
								<td style="padding: 12px">${_idx + 1}</td>
								<td style="padding: 12px">
									${prizeName}
								</td>
								<td style="padding: 12px">${prizeCode}</td>
								<td style="padding: 12px">
									<input
										type="radio"
										name="prize"
										value=${_id}
										data-prize-name="${prizeName}"
            							data-prize-code="${prizeCode}"
									/>
								</td>
							</tr>
				`;
				})
				.join('');
			tableBodyElement.innerHTML = htmlTableBody;
			const inputRadioElements = document.querySelectorAll(
				'input[type="radio"]',
			);
			inputRadioElements.forEach((inputRadioElement) => {
				inputRadioElement.addEventListener('change', function (e) {
					prizeData = {
						prizeName: e.target.dataset.prizeName,
						prizeCode: e.target.dataset.prizeCode,
					};
					prize = e.target.value;
				});
			});
		},
	});

	actionSubmitPrize.addEventListener('click', function () {
		if (prize) {
			rotatedContainer.style.display = 'flex';
			modalPrize.style.display = 'none';
			actionChoosePrize.style.display = 'none';
			actionDraw.style.display = 'flex';
			actionReChoosePrize.style.display = 'flex';
			prizeNameElement.textContent = prizeData?.prizeName;
			if (numberOne && numberTwo && numberThree) {
				actionDraw.style.display = 'none';
				actionSave.style.display = 'flex';
				actionReset.style.display = 'flex';
			}
		} else {
			alert('Vui lòng chọn giải thưởng');
		}
	});

	actionReChoosePrize.addEventListener('click', function () {
		modalPrize.style.display = 'flex';
		actionDraw.style.display = 'none';
		actionReChoosePrize.style.display = 'none';
	});

	actionChoosePrize.addEventListener('click', function () {
		if (audio.paused) {
			audio.play();
			audio.loop = true;
		}
		modalPrize.style.display = 'flex';
	});

	closeModalPrizeElement.addEventListener('click', function () {
		modalPrize.style.display = 'none';
	});

	actionReset.addEventListener('click', function () {
		actionDraw.textContent = 'Quay lần 1';
		actionDraw.style.display = 'flex';
		actionSave.style.display = 'none';
		actionReset.style.display = 'none';
		ring2Element.className = 'ring';
		ring3Element.className = 'ring';
		ring4Element.className = 'ring';
		modalCodeContainer.innerHTML = '';
		audioClaps.pause();
		countDraw = 0;
		numberOne = '';
		numberTwo = '';
		numberThree = '';
	});

	actionSave.addEventListener('click', function () {
		fetchAPI({
			url: 'http://1.52.246.101:4000/v1/icdp-backend-mobile/ct-tat-nien/set-prize',
			method: 'POST',
			body: {
				prizeId: prize,
				code: `${numberOne}${numberTwo}${numberThree}`,
			},
			onSuccess: (res) => {
				console.log(res);
				if (res?.success) {
					audioClaps.play();
					modalLoading.style.display = 'flex';
					const htmlModalCodeItem = `
					<div class="modal_code_item">${numberOne}</div>
					<div class="modal_code_item">${numberTwo}</div>
					<div class="modal_code_item">${numberThree}</div>
				`;
					modalCodeContainer.innerHTML = htmlModalCodeItem;
					productElement.textContent = prizeData?.prizeName;
				} else {
					alert(res?.errors?.[0]?.message || res?.errors?.message);
				}
			},
			onError: (err) => {
				console.log(err);
			},
		});
	});

	closeModalElement.addEventListener('click', function () {
		actionChoosePrize.style.display = 'flex';
		rotatedContainer.style.display = 'none';
		actionReChoosePrize.style.display = 'none';
		modalLoading.style.display = 'none';
		actionDraw.textContent = 'Quay lần 1';
		actionDraw.style.display = 'none';
		actionSave.style.display = 'none';
		actionReset.style.display = 'none';
		ring2Element.className = 'ring';
		ring3Element.className = 'ring';
		ring4Element.className = 'ring';
		modalCodeContainer.innerHTML = '';
		const inputRadioElements = document.querySelectorAll(
			'input[type="radio"]',
		);
		inputRadioElements.forEach((inputRadioElement) => {
			inputRadioElement.checked = false;
		});
		audioClaps.pause();
		countDraw = 0;
		numberOne = '';
		numberTwo = '';
		numberThree = '';
	});
});
