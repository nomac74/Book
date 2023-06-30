$(document).ready(function() {
    let currentOpenedRoom = null;

    function getBookingData(Room) {
        const name = $(`#Name${Room}`).val();
        const phone = $(`#Phone${Room}`).val();
        const roomPrice = rooms[Room].price;
        const checkIn = $(`#checkin${Room}`).val();
        const checkOut = $(`#checkout${Room}`).val();

        return { name, phone, roomPrice, checkIn, checkOut };
    }

    function setBookingData(Room, data) {
        $(`#Name${Room}`).val(data.name);
        $(`#Phone${Room}`).val(data.phone);
        $(`#roomPrice${Room}`).val(data.roomPrice);
        $(`#checkin${Room}`).val(data.checkIn);
        $(`#checkout${Room}`).val(data.checkOut);
    }

    $(".card").on({
        dragstart: function(e) {
            const draggedRoom = $(this).attr('id');
            e.originalEvent.dataTransfer.setData('text/plain', draggedRoom);
            const data = getBookingData(draggedRoom);
            localStorage.setItem('draggedData', JSON.stringify(data));
        },
        dragend: function(e) {
            const draggedRoom = $(this).attr('id');
            $(`#room${draggedRoom}`).removeClass('booked');
            $(`#room${draggedRoom}`).html(`Room ${draggedRoom}<br>re_open`);
            localStorage.removeItem('draggedData');
        }
    });

    $(".card:not(.booked)").on({
        dragover: function(e) {
            e.preventDefault();
        },
        drop: function(e) {
            e.preventDefault();
            const draggedRoom = e.originalEvent.dataTransfer.getData('text/plain');
            const droppedRoom = this.id.replace('room', '');
            const data = JSON.parse(localStorage.getItem('draggedData'));

            setBookingData(droppedRoom, data);

            // Set the dropped room as booked
            $(`#room${droppedRoom}`).addClass('booked');
            $(`#room${droppedRoom}`).html(`
                <div class="booked-info" draggable="true">
                    <h6>Room ${droppedRoom}</h6>
                    period: ${data.checkIn} - ${data.checkOut}<br>
                    Booked <div style="background-color: blue; height: 10px; width: 10px; border-radius: 50%; display: inline-block; margin-left: 5px;"></div><br>
                    ${data.name}: ${data.roomPrice}<br>
                    ${data.phone}<br>
                </div>
            `);

            localStorage.removeItem('draggedData');
        }
    });

    Object.keys(rooms).forEach(room => {
        $(`#room${room}`).on('click', function() {
            if (currentOpenedRoom !== null && currentOpenedRoom !== room) {
                $(`#room${currentOpenedRoom}`).closest('.card').removeClass('active');
                $(`#bookingForm${currentOpenedRoom}`).hide();
                hideButtons(currentOpenedRoom);
            }

            $(this).closest('.card').toggleClass('active');

            if ($(this).closest('.card').hasClass('active')) {
                $(`#bookingForm${room}`).show();
                $(`#roomType${room}`).val(rooms[room].type);
                $(`#roomPrice${room}`).val(rooms[room].price);
                showButtons(room);
            } else {
                $(`#bookingForm${room}`).hide();
                hideButtons(room);
            }

            currentOpenedRoom = room;
        });

        $(`#bookingForm${room}`).on('submit', function(e) {
            e.preventDefault();

            var Name = $(`#Name${room}`).val();
            var Phone = $(`#Phone${room}`).val();
            var checkIn = $(`#checkin${room}`).val();
            var checkOut = $(`#checkout${room}`).val();
            var roomPrice = $(`#roomPrice${room}`).val();

            // 숙박일수 계산
            var checkInDate = new Date(checkIn);
            var checkOutDate = new Date(checkOut);
            var timeDifference = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
            var nightStay = Math.ceil(timeDifference / (1000 * 3600 * 24));

            // 숙박일수에 따른 색상 변경
            if (nightStay === 1) {
                $(`#room${room}`).closest('.card').removeClass('consecutive_nights').addClass('one_night');
            } else if (nightStay > 1) {
                $(`#room${room}`).closest('.card').removeClass('one_night').addClass('consecutive_nights');
            }

            // 현재 날짜와 체크아웃 날짜 사이의 차이 계산
            var currentDate = new Date();
            var period = Math.ceil(Math.abs(checkOutDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24));

            // 체크아웃 지연 확인
            var checkoutDelay = Math.floor((currentDate.getTime() - checkOutDate.getTime()) / (1000 * 60)); // 분 단위로 계산
            var checkoutDelayText = (checkoutDelay > 30) ? `(${checkoutDelay})` : ''; // 120분(2시간) 이상 초과 시 붉은색 표

            $(`#room${room}`).closest('.card').addClass('booked');
            $(`#room${room}`).html(`
            <div class="booked-info" draggable="true">
                <h6>Room ${room}</h6>
                period: ${period} nights<br>
                Booked <div style="background-color: blue; height: 10px; width: 10px; border-radius: 50%; display: inline-block; margin-left: 5px;"></div><br>
                ${Name}: ${roomPrice}<br>
                ${Phone}<br>
                in:${checkIn}<br>
                ot:${checkOut} <span class="checkout-delay">${checkoutDelayText}</span><br>
            </div>
            `);


            $(`#room${room}`).closest('.card').removeClass('active');
            $(`#bookingForm${room}`).hide();
            hideButtons(room);
        });

        $(`#actionBtnCancel${room}`).on('click', function() {
            // 객실 정보 초기화
            let $roomCard = $(`#room${room}`).closest('.card');
            $roomCard.removeClass('booked consecutive_nights one_night');

            $(`#room${room}`).html(`Room ${room}<br>re_open<div style="background-color: coral; height: 10px; width: 10px; border-radius: 50%; display: inline-block; margin-left: 5px;"></div>`);

            // 폼 내용 초기화
            $(`#Name${room}`).val('');
            $(`#Phone${room}`).val('');
            $(`#checkin${room}`).val('');
            $(`#checkout${room}`).val('');

            // 룸 타입과 가격 다시 채우기
            $(`#roomType${room}`).val(rooms[room].type);
            $(`#roomPrice${room}`).val(rooms[room].price);

            // 폼 및 버튼 숨김
            $(`#bookingForm${room}`).hide();
            hideButtons(room);

            // 카드의 'active' 클래스 제거
            $(`#room${room}`).closest('.card').removeClass('active');

            // 현재 열려있는 객실 초기화
            if (currentOpenedRoom === room) {
                currentOpenedRoom = null;
            }
        });

        const hideButtons = room => {
            $(`#actionBtnBook${room}`).hide();
            $(`#actionBtnCancel${room}`).hide();
        }

        const showButtons = room => {
            $(`#actionBtnBook${room}`).show();
            $(`#actionBtnCancel${room}`).show();
        }
    });

    $('body').click(function() {
        if (currentOpenedRoom !== null) {
            $(`#room${currentOpenedRoom}`).closest('.card').removeClass('active');
            $(`#bookingForm${currentOpenedRoom}`).hide();
            hideButtons(currentOpenedRoom);
            currentOpenedRoom = null;
        }
    });

    $('.card').click(function(event) {
        event.stopPropagation();
    });
});
