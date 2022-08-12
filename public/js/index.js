$(document).on('click', '.seat-vertical, .seat-horizontal', function () { 
    //----- Set hidden Key from attribute
    var grup     = $(this).attr('grup');
    var position = $(this).attr('position');
    var seatId   = $(this).attr('id');
    var parking  = $(this).attr('parking-name');
    
    $("#parking-form").trigger("reset");

    $("#parking-grup").val(grup);
    $("#parking-position").val(position);
    $("#seat-id").val(seatId);
    $("#parking-name").val(parking);
    
    $("#addModal").modal('show');

    $.ajax({
        type: "POST",
        url: "/parkir/get_detail",
        data: {
            grup : grup,
            posisi : position
        },
        dataType: "json",
        success: function (response) {
            if(response.code === 200){
                const label = ['parking-id','parking-license-plate', 'parking-model', 'parking-other', 'parking-status', 'parking-job'];
                const field = ['id','license_plate', 'model_code', 'others', 'status', 'category'];

                const detail = response.data;
                if(detail != null){
                    $("#parking-id").prop('disabled', false);
                    $(".btn-delete").removeClass('d-none');
                    label.forEach((element,index) => {
                        $(`#${element}`).val(detail[field[index]]);
                    });
                }
            } else {
                $("#parking-id").prop('disabled', true);
                $(".btn-delete").addClass('d-none');
            }
        }
    });
})

$(document).on('click', '.btn-delete', function (event) { 
    var posisi = $("#parking-position").val();
    var grup   = $("#parking-grup").val();
    var seatId = $("#seat-id").val();

    if(confirm("Yakin Hapus Data Ini ?")){

        var button = $(this);
        button.html('Please Wait <div class="spinner-border spinner-border-sm" role="status"><span class="visually-hidden">Mohon Tunggu</span></div>');
        button.prop('disabled', true);

        $.ajax({
            type: "POST",
            url: "/parkir/delete",
            data: {
                posisi : posisi,
                grup  : grup
            },
            dataType: "json",
            success: function (response) {
                if(response.code === 200){
                    $("#addModal").modal('hide');
                    $(`#${seatId}`).html('');
                } else {
                    alert('Sistem Error');
                    location.reload();
                }
                button.html('Hapus <span class="material-icons">remove_circle</span>');
                button.prop('disabled', false);
            }, error: function(){
                location.reload();
            }
        });
    }
})

$(document).ready(function () {
    $('#parking-form').submit(function (e) { 
        e.preventDefault();
        var form        = $(this);
        var actionUrl   = form.attr('action');
        var seatId      = $("#seat-id").val();

        var button      = $(".btn-submit");
        button.html('Please Wait <div class="spinner-border spinner-border-sm" role="status"><span class="visually-hidden">Mohon Tunggu</span></div>');
        button.prop('disabled', true);

        $.ajax({
            type: "POST",
            url: actionUrl,
            data: form.serialize(),
            dataType: "json",
            success: function (response) {
                if(response.code == 200){
                    var data = response.data;
                    var html = `${data.model_code} | ${data.license_plate} <br> ${data.category}`;

                    $("#addModal").modal('hide');
                    $(`#${seatId}`).html(html);
                }
                button.html('Hapus <span class="material-icons">save</span>');
                button.prop('disabled', false);
            }
        });

    });
});


$(document).on('change', '#parking-model', function (e) { 
    let model = $(this).val();
    if(model === "OT" || model === "MRL"){
        $("#other-wrap").removeClass("d-none");
    } else {
        $("#other-wrap").addClass("d-none");
        $("#parking-other").val('');
    }
});