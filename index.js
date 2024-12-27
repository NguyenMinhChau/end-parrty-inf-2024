const host_be = 'https://icdpmobile.fpt.net'; // http://1.52.246.101:4000
(function () {
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
	fetch(`${host_be}/v1/icdp-backend-mobile/ct-tat-nien/get-users`, {
		method: 'GET',
	})
		.then((res) => {
			return res.json();
		})
		.then((res) => {
			function extractUniqueDigits(data) {
				const uniqueDigits = new Set(); // Sử dụng Set để đảm bảo không có số nào trùng lặp

				data.forEach((item) => {
					if (item?.code) {
						// Trích xuất số từ trường "code"
						item?.code?.split('')?.forEach((digit) => uniqueDigits?.add(digit));
					}

					// ! CHANGE QUANTITY NUMBER
					// Trích xuất số từ các trường con của "digits"
					['nghin', 'tram', 'chuc', 'donVi'].forEach((key) => {
						if (item?.digits[key]) {
							item?.digits[key]
								?.split('')
								?.forEach((digit) => uniqueDigits?.add(digit));
						}
					});
				});

				return Array.from(uniqueDigits); // Chuyển Set thành mảng và trả về
			}

			let prize = null;
			let codeGetAPI = null;
			let prizeData = null;
			let isSubmitPrize = false;
			let audio = new Audio('./ring_audio.mp3');
			let audioRing = new Audio('./ring_audio.mp3');
			let audioClaps = new Audio('./Win.mp3');
			const LIST_USER = res.payload?.map((item, index) => {
				if (item?.status === 'CHECKED_IN' && item?.status !== 'PRIZED') {
					return item;
				}
			});
			const LIST_NUMBER_ONE = extractUniqueDigits(LIST_USER);
			const LIST_CODE = LIST_USER?.map((item) => item?.code);
			const LIST_USER_PRIZE = res.payload
				?.map((item, index) => {
					if (item?.status === 'PRIZED') {
						return item;
					}
				})
				.sort((a, b) => {
					return (
						a?.prize?.block - b?.prize?.block ||
						`${a?.prize?.prizeName}`.localeCompare(`${b?.prize?.prizeName}`)
					);
				});

			const randomCode = LIST_CODE?.filter((x) => x)?.[
				Math.floor(Math.random() * LIST_CODE?.filter((x) => x)?.length)
			];

			audio.addEventListener(
				'ended',
				function () {
					this.currentTime = 0;
					this.play();
				},
				false,
			);

			// console.log(
			// 	'LIST_USER_PRIZE: ',
			// 	LIST_USER_PRIZE.filter((x) => x),
			// );

			document.querySelector('#reseter').style.display = 'none';
			document.querySelector('.save_result').style.display = 'none';

			const doors = document.querySelectorAll('.door');

			document.querySelector('.save_result').addEventListener('click', save);
			document.querySelector('#spinner').addEventListener('click', spin);
			document.querySelector('#reseter').addEventListener('click', () => {
				init();
				handleReset();
			});
			document.querySelector('.award').addEventListener('click', openAward);
			document.querySelector('.trophy').addEventListener('click', openListUser);
			document
				.querySelector('.close_modal.prize')
				.addEventListener('click', closeModalPrize);
			document
				.querySelector('.close_modal.user')
				.addEventListener('click', closeModalUser);
			document
				.querySelector('.close_modal_notifi')
				.addEventListener('click', closeModalNotification);
			document
				.querySelector('.action_submit_prize')
				.addEventListener('click', submitPrize);

			document
				.querySelector('.modal_overlay.notification')
				.addEventListener('click', (e) => {
					e.stopPropagation();
					closeModalNotification();
				});
			document
				.querySelector('.modal_overlay.prize')
				.addEventListener('click', (e) => {
					e.stopPropagation();
					closeModalPrize();
				});
			document
				.querySelector('.modal_overlay.user')
				.addEventListener('click', (e) => {
					e.stopPropagation();
					closeModalUser();
				});

			document
				.querySelector('.modal_container_notification')
				.addEventListener('click', (e) => {
					e.stopPropagation();
					document
						.querySelector('.modal_overlay.notification')
						.classList.add('show');
				});
			document
				.querySelector('.modal_container.prize')
				.addEventListener('click', (e) => {
					e.stopPropagation();
					// document
					// 	.querySelector('.modal_overlay.prize')
					// 	.classList.add('show');
					var elements = document.querySelector(
						'.modal_container.prize',
					).children;
					for (var i = 0; i < elements.length; i++) {
						if (!elements[i].classList.contains('action_submit_prize')) {
							elements[i].classList.add('show');
						}
					}
				});
			document
				.querySelector('.modal_container.user')
				.addEventListener('click', (e) => {
					e.stopPropagation();
					document.querySelector('.modal_overlay.user').classList.add('show');
				});

			document
				.querySelector('.close_modal_notifi')
				.addEventListener('click', (e) => {
					e.stopPropagation();
					closeModalNotification();
				});
			document
				.querySelector('.close_modal.prize')
				.addEventListener('click', (e) => {
					e.stopPropagation();
					closeModalPrize();
				});
			document
				.querySelector('.close_modal.user')
				.addEventListener('click', (e) => {
					e.stopPropagation();
					closeModalUser();
				});

			// GET LIST PRIZE
			fetchAPI({
				url: `${host_be}/v1/icdp-backend-mobile/ct-tat-nien/get-prizes`,
				method: 'GET',
				onSuccess: (res) => {
					const htmlTableBody = res.payload
						.map((item, _idx) => {
							const { prizeName, prizeCode, _id, block } = { ...item };
							return `
									<tr style="text-align: center">
												<td style="padding: 12px">${block}</td>
												<td style="padding: 12px">
													${prizeName}
												</td>
												<td style="padding: 12px">
													<input
														type="radio"
                                                        class="prize"
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
					document.querySelector('.table tbody.prize').innerHTML =
						res?.payload?.length > 0
							? htmlTableBody
							: `<tr style="text-align: center">
                                                <td style="padding: 12px" colspan="4">Không có dữ liệu</td>
                                            </tr>`;
					const inputRadioElements = document.querySelectorAll(
						'input[type="radio"].prize',
					);
					inputRadioElements.forEach((inputRadioElement) => {
						inputRadioElement.addEventListener('change', function (e) {
							prize = e.target.value;
							fetchAPI({
								method: 'GET',
								url: `${host_be}/v1/icdp-backend-mobile/ct-tat-nien/random-code-by-prize?prizeId=${prize}`,
								onSuccess: (res) => {
									if (res?.success) {
										prizeData = {
											prizeName: e.target.dataset.prizeName,
											prizeCode: e.target.dataset.prizeCode,
										};
										document.querySelector(
											'.action_submit_prize',
										).style.display = 'block';
										// codeGetAPI =
										// 	res?.payload?.code ||
										// 	randomCode;
									} else {
										isSubmitPrize = false;
										prize = null;
										prizeData = null;
										document.querySelector(
											'.action_submit_prize',
										).style.display = 'none';
										document
											.querySelector('.modal_overlay.notification')
											.classList.add('show');
										const htmlTextNotification = `<p style="text-align: center;">${
											res?.errors?.[0]?.message ||
											res?.errors?.message ||
											'Vui lòng thử lại sau'
										}</p>`;
										document.querySelector('.model_content_text').innerHTML =
											htmlTextNotification;
									}
								},
								onError: (err) => {
									isSubmitPrize = false;
									prize = null;
									prizeData = null;
									console.log(err);
								},
							});
						});
					});
				},
			});

			// RENDER TABLE USER
			const htmlTableBodyUser = LIST_USER_PRIZE?.filter((x) => x)
				.map((item, _idx) => {
					const {
						fullName,
						email,
						phongBan,
						code,
						prize,
						status,
						timeCheckIn,
					} = { ...item };
					const { prizeName, block } = { ...prize };
					return `
									<tr style="text-align: center">
												<td style="padding: 12px">${block || '-'}</td>
												<td style="padding: 12px">${fullName}</td>
												<td style="padding: 12px">${email}</td>
												<td style="padding: 12px">${phongBan}</td>
												<td style="padding: 12px">
													${code}
												</td>
												<td style="padding: 12px">
													${prizeName}
												</td>
											</tr>
								`;
				})
				.join('');
			document.querySelector('.table tbody.user').innerHTML =
				LIST_USER_PRIZE?.filter((x) => x)?.length > 0
					? htmlTableBodyUser
					: `<tr style="text-align: center">
                                                <td style="padding: 12px" colspan="6">Không có dữ liệu</td>
                                            </tr>`;

			function init(firstInit = true, groups = 1, duration = 1) {
				for (const door of doors) {
					// if (firstInit) {
					// 	door.dataset.spinned = '0';
					// } else if (door.dataset.spinned === '1') {
					// 	return;
					// }

					const boxes = door.querySelector('.boxes');
					const boxesClone = boxes.cloneNode(false);
					const pool = ['❓'];

					if (!firstInit) {
						const arr = [];
						for (let n = 0; n < (groups > 0 ? groups : 1); n++) {
							arr.push(...LIST_NUMBER_ONE);
						}
						pool.push(...shuffle(arr));

						boxesClone.addEventListener(
							'transitionstart',
							function () {
								door.dataset.spinned = '1';
								this.querySelectorAll('.box').forEach((box) => {
									box.style.filter = 'blur(1px)';
								});
							},
							{ once: true },
						);

						boxesClone.addEventListener(
							'transitionend',
							function () {
								this.querySelectorAll('.box').forEach((box, index) => {
									box.style.filter = 'blur(0)';
									if (index > 0) this.removeChild(box);
								});
							},
							{ once: true },
						);
					}

					for (let i = pool.length - 1; i >= 0; i--) {
						const box = document.createElement('div');
						box.classList.add('box');
						box.style.width = door.clientWidth + 'px';
						box.style.height = door.clientHeight + 'px';
						box.textContent = pool[i];
						boxesClone.appendChild(box);
					}
					boxesClone.style.transitionDuration = `${
						duration > 0 ? duration : 1
					}s`;
					boxesClone.style.transform = `translateY(-${
						door.clientHeight * (pool.length - 1)
					}px)`;
					door.replaceChild(boxesClone, boxes);
				}
			}

			function handleReset() {
				if (prizeData) {
					prize = null;
					prizeData = null;
					document.querySelector('.name_prize').innerHTML = '';
					document.querySelector('.name_text').innerHTML = ``;
					document.querySelector('.email_text').innerHTML = ``;
					document.querySelector('#reseter').style.display = 'none';
					document.querySelector('.save_result').style.display = 'none';
					document.querySelector('.award').style.display = 'block';
					document.querySelector('.phao_giay').classList.remove('show');
					audioClaps.pause();
				}
			}

			async function spin() {
				// console.log({ codeGetAPI });
				document.querySelector('.email_text').innerHTML = '';
				document.querySelector('.save_result').style.display = 'none';

				// reCall API random CODE
				if (prizeData) {
					fetchAPI({
						method: 'GET',
						url: `${host_be}/v1/icdp-backend-mobile/ct-tat-nien/random-code-by-prize?prizeId=${prize}`,
						onSuccess: (res) => {
							if (res?.success) {
								isSubmitPrize = true;
								document.querySelector('.action_submit_prize').style.display =
									'block';
								codeGetAPI = res?.payload?.code || randomCode;
							} else {
								isSubmitPrize = false;
								prize = null;
								prizeData = null;
								document
									.querySelector('.modal_overlay.prize')
									.classList.add('show');
								document
									.querySelector('.modal_overlay.notification')
									.classList.add('show');
								const htmlTextNotification = `<p style="text-align: center;">${
									res?.errors?.[0]?.message ||
									res?.errors?.message ||
									'Vui lòng thử lại sau'
								}</p>`;
								document.querySelector('.model_content_text').innerHTML =
									htmlTextNotification;
								document.querySelector('.name_prize').innerHTML = '';
								for (const [index, door] of doors?.entries()) {
									const boxes = door.querySelector('.boxes');

									for (const [_idx, box] of boxes
										?.querySelectorAll('.box')
										?.entries()) {
										if (_idx === 0) {
											box.textContent = '❓';
										}
									}
								}
							}
						},
						onError: (err) => {
							isSubmitPrize = false;
							prize = null;
							prizeData = null;
							console.log(err);
						},
					});
				}

				if (isSubmitPrize) {
					document.querySelector('#spinner').style.display = 'none';
				}

				if (LIST_NUMBER_ONE?.length > 0) {
					if (audio.paused) {
						audio.play();
						audio.loop = true;
					}
					// document.querySelector('.award').style.display = 'none';
					document.querySelector('.phao_giay').classList.remove('show');
					if (prizeData && isSubmitPrize) {
						init(false, 25, 15);

						let result = '';

						for (const [index, door] of doors?.entries()) {
							const boxes = door.querySelector('.boxes');
							const duration = parseInt(boxes.style.transitionDuration);
							boxes.style.transform = 'translateY(0)';
							await new Promise((resolve) =>
								setTimeout(resolve, duration * 100),
							);
							const box = boxes.querySelector('.box');
							if (box.textContent === '❓') {
								return;
							}
							result += box.textContent;

							for (const [_idx, box] of boxes
								?.querySelectorAll('.box')
								?.entries()) {
								if (_idx === 0) {
									box.textContent = codeGetAPI?.[index];
								}
							}
						}
						setTimeout(() => {
							const user = LIST_USER.find((item) => {
								if (`${item?.code}`.toString() === `${codeGetAPI}`.toString()) {
									return item;
								}
							});
							// document.querySelector('.award').style.display =
							// 	'none';
							document.querySelector('#spinner').style.display = 'block';

							if (user) {
								// document.querySelector(
								// 	'.name_text',
								// ).innerHTML = `<span class="full_name">Nguyễn Minh Châu</span> -
								// <span class="deparment">INF HO</span>`;
								audioClaps.play();
								document.querySelector(
									'.email_text',
								).innerHTML = `<span class="email_user" style="font-size: 25px;">${
									user?.fullName || 'N/A'
								}</span> - <span class="department" style="font-size: 25px;">${
									user?.phongBan || 'N/A'
								}</span>`;
								document.querySelector('.save_result').style.display = 'block';
								document.querySelector('.phao_giay').classList.add('show');
								document.querySelector('.save_result').style.display = 'block';
							} else {
								document.querySelector(
									'.name_text',
								).innerHTML = `<span class="full_name">Không tìm thấy người trúng thưởng!</span>`;
								document.querySelector('.email_text').innerHTML = ``;
								document.querySelector('.save_result').style.display = 'none';
							}
						}, 13000);
					} else {
						document
							.querySelector('.modal_overlay.prize')
							.classList.add('show');
						document.querySelector('.award').style.display = 'block';
					}
				} else {
					document
						.querySelector('.modal_overlay.notification')
						.classList.add('show');
					const htmlTextNotification =
						'<p style="text-align: center;">Chưa có nhân sự CHECK IN, vui lòng chờ thêm, xin cảm ơn!</p>';
					document.querySelector('.model_content_text').innerHTML =
						htmlTextNotification;
				}
			}

			async function save() {
				let result = '';
				for (const door of doors) {
					const boxes = door.querySelector('.boxes');
					const box = boxes.querySelector('.box');
					if (box.textContent === '❓') {
						return;
					}
					result += box.textContent;
				}

				fetchAPI({
					url: `${host_be}/v1/icdp-backend-mobile/ct-tat-nien/set-prize?prizeId=${prize}&code=${codeGetAPI}`,
					method: 'POST',
					body: {},
					onSuccess: (res) => {
						if (res?.success) {
							document
								.querySelector('.modal_overlay.notification')
								.classList.add('show');
							const htmlTextNotification =
								'<p style="text-align: center;">Lưu kết quả thành công!</p>';
							document.querySelector('.model_content_text').innerHTML =
								htmlTextNotification;
							document.querySelector('.save_result').style.display = 'none';
							isSubmitPrize = false;
						} else {
							document
								.querySelector('.modal_overlay.notification')
								.classList.add('show');
							const htmlTextNotification = `<p style="text-align: center;">${
								res?.errors?.[0]?.message ||
								res?.errors?.message ||
								'Vui lòng thử lại sau'
							}</p>`;
							document.querySelector('.model_content_text').innerHTML =
								htmlTextNotification;
							document.querySelector('.save_result').style.display = 'block';
						}
					},
					onError: (err) => {
						console.log(err);
					},
				});
				updateUserPrize();
				updateUserPrize();
			}

			function shuffle([...arr]) {
				let m = arr.length;
				while (m) {
					const i = Math.floor(Math.random() * m--);
					[arr[m], arr[i]] = [arr[i], arr[m]];
				}
				return arr;
			}

			function openAward() {
				isSubmitPrize = false;
				document.querySelector('.modal_overlay.prize').classList.add('show');
			}

			function openListUser() {
				document.querySelector('.modal_overlay.user').classList.add('show');
			}

			function closeModalPrize() {
				document.querySelector('.modal_overlay.prize').classList.remove('show');
			}

			function closeModalUser() {
				document.querySelector('.modal_overlay.user').classList.remove('show');
			}

			function closeModalNotification() {
				document
					.querySelector('.modal_overlay.notification')
					.classList.remove('show');
			}

			function submitPrize() {
				if (prizeData) {
					// document.querySelector('#reseter').style.display = 'block';
					document.querySelector(
						'.name_prize',
					).innerHTML = `${prizeData.prizeName}`;
					// document.querySelector('.name_prize').innerHTML = 'GIẢI SUPPER VIP';
					closeModalPrize();
					isSubmitPrize = true;
				} else {
					isSubmitPrize = false;
					document
						.querySelector('.modal_overlay.notification')
						.classList.add('show');
					const htmlTextNotification =
						'<p style="text-align: center;">Vui lòng chọn phần thưởng trước khi xác nhận phần thưởng. Xin cảm ơn!</p>';
					document.querySelector('.model_content_text').innerHTML =
						htmlTextNotification;
				}
			}

			init();
		});
})();

const updateUserPrize = () => {
	return fetch(`${host_be}/v1/icdp-backend-mobile/ct-tat-nien/get-users`, {
		method: 'GET',
	})
		.then((res) => {
			return res.json();
		})
		.then((res) => {
			const LIST_USER_PRIZE = res.payload
				?.map((item, index) => {
					if (item?.status === 'PRIZED') {
						return item;
					}
				})
				.sort((a, b) => {
					return (
						a?.prize?.block - b?.prize?.block ||
						`${a?.prize?.prizeName}`.localeCompare(`${b?.prize?.prizeName}`)
					);
				});
			const htmlTableBodyUser = LIST_USER_PRIZE?.filter((x) => x)
				.map((item, _idx) => {
					const {
						fullName,
						email,
						phongBan,
						code,
						prize,
						status,
						timeCheckIn,
					} = { ...item };
					const { prizeName, block } = { ...prize };
					return `
									<tr style="text-align: center">
												<td style="padding: 12px">${block || '-'}</td>
												<td style="padding: 12px">${fullName}</td>
												<td style="padding: 12px">${email}</td>
												<td style="padding: 12px">${phongBan}</td>
												<td style="padding: 12px">
													${code}
												</td>
												<td style="padding: 12px">
													${prizeName}
												</td>
											</tr>
								`;
				})
				.join('');
			document.querySelector('.table tbody.user').innerHTML =
				LIST_USER_PRIZE?.filter((x) => x)?.length > 0
					? htmlTableBodyUser
					: `<tr style="text-align: center">
                                                <td style="padding: 12px" colspan="6">Không có dữ liệu</td>
                                            </tr>`;
		});
};
