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
	var LIST_TEST = [];

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

	function removeDuplicates(array) {
		const result = array.filter((a, b) => array.indexOf(a) === b);
		return result;
	}

	// fetch data user
	fetch(
		'http://1.52.246.101:4000/v1/icdp-backend-mobile/ct-tat-nien/get-users',
		{
			method: 'GET',
		},
	)
		.then((res) => {
			return res.json();
		})
		.then((res) => {
			var LIST_NUMBER_HUNDRED = removeDuplicates(
				res.payload.map((item) => {
					return parseInt(item.code / 100);
				}),
			);
			var LIST_NUMBER_TEN = removeDuplicates(
				res.payload.map((item) => {
					return parseInt((item.code % 100) / 10);
				}),
			);
			var LIST_NUMBER_UNIT = removeDuplicates(
				res.payload.map((item) => {
					return parseInt(item.code % 10);
				}),
			);
			var LIST_NUMBER_HUNDRED_NO_FILL = removeDuplicates(
				res.payload.map((item) => {
					return parseInt(item.code / 100);
				}),
			);
			var LIST_NUMBER_TEN_NO_FILL = removeDuplicates(
				res.payload.map((item) => {
					return parseInt((item.code % 100) / 10);
				}),
			);
			var LIST_NUMBER_UNIT_NO_FILL = removeDuplicates(
				res.payload.map((item) => {
					return parseInt(item.code % 10);
				}),
			);

			const fillArray = (arr) => {
				while (arr.length < SLOTS_PER_REEL) {
					arr = arr.concat(arr);
				}
				return arr;
			};

			LIST_NUMBER_HUNDRED = fillArray(LIST_NUMBER_HUNDRED);

			LIST_NUMBER_TEN = fillArray(LIST_NUMBER_TEN);
			LIST_NUMBER_UNIT = fillArray(LIST_NUMBER_UNIT);

			// console.log('LIST_NUMBER_HUNDRED: ', LIST_NUMBER_HUNDRED);
			// console.log('LIST_NUMBER_TEN: ', LIST_NUMBER_TEN);
			// console.log('LIST_NUMBER_UNIT: ', LIST_NUMBER_UNIT);

			function createSlots(ring, list) {
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
					content.textContent = list[i] % 10;
					slot.appendChild(content);

					// add the poster to the row
					ring.appendChild(slot);
				}
			}

			function getSeed(listNoFill) {
				return Math.floor(Math.random() * listNoFill.length);
			}

			function getTextContentP(ringElement) {
				const spinClass = ringElement.className;
				const seedTextContent = parseInt(spinClass.slice(10)) + 4;
				const slots = ringElement.querySelectorAll('.slot');
				// console.log('seedTextContent: ', seedTextContent);
				// console.log('slots: ', slots);
				// console.log('slots[seedTextContent]: ', slots[seedTextContent]);
				const textContentP = slots[seedTextContent].querySelector('p');
				// console.log('textContentP: ', textContentP?.textContent);
				return textContentP?.textContent?.toString();
			}

			function spin(timer, ring, list, listNoFill) {
				var oldSeed = -1;
				var oldClass = document.querySelector(ring).className;
				if (oldClass.length > 4) {
					oldSeed = parseInt(oldClass.slice(10));
				}
				var seed = getSeed(listNoFill);
				while (oldSeed == seed) {
					seed = getSeed(listNoFill);
				}

				var ringElement = document.querySelector(ring);
				ringElement.style.animation =
					'back-spin 1s, spin-' + seed + ' ' + (timer + 0.5) + 's';
				ringElement.className = 'ring spin-' + seed;

				if (ring === '#ring2') {
					numberOne = getTextContentP(ring2Element);
				} else if (ring === '#ring3') {
					numberTwo = getTextContentP(ring3Element);
				} else {
					numberThree = getTextContentP(ring4Element);
				}
			}

			createSlots(ring2Element, LIST_NUMBER_HUNDRED);
			createSlots(ring3Element, LIST_NUMBER_TEN);
			createSlots(ring4Element, LIST_NUMBER_UNIT);

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
						spin(
							timer,
							'#ring2',
							LIST_NUMBER_HUNDRED,
							LIST_NUMBER_HUNDRED_NO_FILL,
						);
						actionDraw.textContent = 'Quay lần 2';
					} else if (countDraw === 2) {
						spin(
							timer,
							'#ring3',
							LIST_NUMBER_TEN,
							LIST_NUMBER_TEN_NO_FILL,
						);
						actionDraw.textContent = 'Quay lần 3';
					} else {
						spin(
							timer,
							'#ring4',
							LIST_NUMBER_UNIT,
							LIST_NUMBER_UNIT_NO_FILL,
						);
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
						inputRadioElement.addEventListener(
							'change',
							function (e) {
								prizeData = {
									prizeName: e.target.dataset.prizeName,
									prizeCode: e.target.dataset.prizeCode,
								};
								prize = e.target.value;
							},
						);
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
							alert(
								res?.errors?.[0]?.message ||
									res?.errors?.message,
							);
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
});
