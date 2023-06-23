$(document).ready(function() {
    
    let currentOpenedRoom = null;

    Object.keys(rooms).forEach(room => {
        $(`#room${room}`).click(function() {
        if (currentOpenedRoom !== null && currentOpenedRoom !== room) {
            $(`#room${currentOpenedRoom}`).closest('.card').removeClass('active');
            $(`#bookingForm${currentOpenedRoom}`).hide();
            $(`#cancelBtn${currentOpenedRoom}`).hide();
            $(`#confirmBtn${currentOpenedRoom}`).hide();
        }   
            $(this).closest('.card').toggleClass('active');
            $(`#bookingForm${room}`).toggle();
            $(`#roomType${room}`).val(rooms[room].type);
            $(`#roomPrice${room}`).val(rooms[room].price);
            currentOpenedRoom = room;
    });
        $(`#bookingForm${room}`).submit(function(e) {
            e.preventDefault();
            var Name = $(`#Name${room}`).val();
            var Phone = $(`#Phone${room}`).val();
            var checkIn = $(`#checkin${room}`).val();
            var checkOut = $(`#checkout${room}`).val();
            var roomPrice = $(`#roomPrice${room}`).val();
            $(`#room${room}`).closest('.card').addClass('booked');
    
            $(`#room${room}`).html(`
        <div class="booked-info">
            Room ${room}<br> 
            Booked <div style="background-color: red; height: 10px; width: 10px; border-radius: 50%; display: inline-block; margin-left: 5px;"></div><br>
            ${Name} : ${roomPrice}<br>  <!-- Display the name and price here -->
            ${Phone}<br>
            in:${checkIn}<br>
            Out:${checkOut}<br>
        </div> 
    `);
        $(`#bookingForm${room}`).hide();
        $(`#cancelBtn${room}`).show().css({'height': '5px', 'width': '5px'});
        $(`#confirmBtn${room}`).show();
        $('body').click();
        });
    
        $(`#cancelBtn${room}`).click(function() {
            $(`#room${room}`).html(`Room ${room}<br>Booking<div style="background-color: green; height: 10px; width: 10px; border-radius: 50%; display: inline-block; margin-left: 5px;"></div>`);
            $(`#cancelBtn${room}`).hide();
            $(`#confirmBtn${room}`).hide();
            $(`#bookingForm${room}`).show();
        });
    
        $(`#confirmBtn${room}`).click(function() {
            $(`#room${room}`).addClass('payed');
            $(`#confirmBtn${room}`).hide();
            $(`#cancelBtn${room}`).hide();
            $(`#paymentStatus${room}`).text('Payed');
        });
    });
    
    $('body').click(function() {
        if (currentOpenedRoom !== null) {
    $(`#room${currentOpenedRoom}`).closest('.card').removeClass('active');
    $(`#bookingForm${currentOpenedRoom}`).hide();
    $(`#cancelBtn${currentOpenedRoom}`).hide();
        currentOpenedRoom = null;
        }
    });
    
    $('.card').click(function(event) {
        event.stopPropagation();
    });  
});