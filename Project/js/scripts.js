
var apiUrl = 'http://localhost:8038/WebappRest_war_exploded/cs?action=';

var grid, dialog, genderDropdown, dateOfBirth;

function Edit(e) {
    $('#ID').val(e.data.id);
    $('#Name').val(e.data.record.vorName);
    $('#Surname').val(e.data.record.nachName);
    genderDropdown.val(e.data.record.geschlecht);
    titelDropdown.val(e.data.record.titel);
    dateOfBirth.value(gj.core.parseDate(e.data.record.geburtsDatum, 'dd-mm-yyyy'));
    dialog.open('Edit');
}

function Save() {
    var record = {
        ID: $('#ID').val(),
        vorName: $('#Name').val(),
        nachName: $('#Surname').val(),
        geschlecht: genderDropdown.val(),
        titel: titelDropdown.val(),
        geburtsDatum: dateOfBirth.value(),
    };

    var jsonData = JSON.stringify(record);

    $.ajax({
        url: apiUrl + 'addKunden',
        contentType: "application/json; charset=utf-8",
        data: jsonData,
        method: 'POST',
        complete: function() {
            dialog.close();
            grid.reload();
        }
    });
    
}

function Update() {

    var id = $('#ID').val()-1; //index starts from 0, but grid starts from 1

    var record = {
        ID: id,
        vorName: $('#Name').val(),
        nachName: $('#Surname').val(),
        geschlecht: genderDropdown.val(),
        titel: titelDropdown.val(),
        geburtsDatum: dateOfBirth.value(),
    };

    var jsonData = JSON.stringify(record);

    $.ajax({
        url: apiUrl + 'updateKunden&id='+id,
        contentType: 'application/json',
        data: jsonData,
        method: 'POST',
        complete: function() {
            dialog.close();
            grid.reload();
        }
    });
}

function Delete(e) {
    if (confirm('Are you sure?')) {
        $.ajax({
            url: apiUrl + 'delete&id='+(e.data.id-1), //index starts from 0, but grid starts from 1
            method: 'POST',
            complete: function() {
                dialog.close();
                grid.reload();
            }
        });
    }
}

$(document).ready(function () {
    grid = $('#grid').grid({
        dataSource: apiUrl + "getAllKunden",
        columns: [
            { field: 'vorName', title: 'Name' },
            { field: 'nachName', title: 'Surname'},
            { field: 'geburtsDatum', title: 'BirthDate'},
            { field: 'geschlecht', title: 'Gender'},
            { field: 'titel', title: 'Titel'},
            { width: 64, tmpl: '<span class="material-icons gj-cursor-pointer">edit</span>', align: 'center', events: { 'click': Edit } },
            { width: 64, tmpl: '<span class="material-icons gj-cursor-pointer">delete</span>', align: 'center', events: { 'click': Delete } }
        ]
    });
    dialog = $('#dialog').dialog({
        autoOpen: false,
        resizable: false,
        modal: true,
        width: 360
    });

    genderDropdown = $('#Gender').dropdown();
    titelDropdown = $('#Titel').dropdown();

    dateOfBirth = $('#DateOfBirth').datepicker({ format: 'dd-mm-yyyy' });

    $('#btnAdd').on('click', function () {
        $('#ID').val('');
        $('#Name').val('');
        $('#Surname').val('');
        genderDropdown.val('');
        titelDropdown.val('');
        dateOfBirth.val('');
        dialog.open('Add');
    });

    $('#btnSave').on('click', function(){
        var id = $('#ID').val();
        if (id == ''){
            Save();
        } else {
            Update();
        }
    });

    $('#btnCancel').on('click', function () {
        dialog.close();
    });
    
});