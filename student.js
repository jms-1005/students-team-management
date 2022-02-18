
//students mock data
var students = [];

$(document).ready(function(){
    getStudentsData();
})

function getStudentsData(){
    $('students').html('loading students data...');
    $.get('https://students-26afb-default-rtdb.firebaseio.com/students.json', function(studentsData){
        console.log(studentsData)
        ids=Object.keys(studentsData);
        console.log(ids);
        ids.forEach(id => {
            console.log(studentsData[id]);
            let _student = {
                name: studentsData[id].name,
                email: studentsData[id].email,
                image: studentsData[id].image,
                id: id,
                admissionStatus: studentsData[id].admissionStatus,
                deleted: studentsData[id].deleted
            }
            students.push(_student);
        })
        displayStudents();
    })
}

function displayStudents(){
    let _student = '';
    $('.students').html('');
    for(let i=0; i<students.length; i++){
       

        _student += `<div class="row student">
            <div class="col-lg-2 image">
                <img src="${students[i].image}">
            </div>
            <div class="col-lg-10">
                <h3 class="name">${ students[i].name }</h3>
                <div class="email">${ students[i].email }</div>
                <div class="id">${ students[i].id }</div>
                <div class="admissionStatus">Admission Status: <input type="checkbox" ></div>
                <div class="deleted">Delete Student: <input type="checkbox"></div>
            </div>
        </div>`
        
        
    }
    $('.students').append(_student);
    return _student;
}

function addNewStudent(){
    _name = $('#newName').val();
    _email = $('#newEmail').val(),
    _image = $('#newImage').val();

    let _student = {
        name: _name,
        email: _email,
        image: _image,
        admissionStatus: false,
        deleted: false
    }

    $.ajax({
        accept: "application/json",
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: "https://students-26afb-default-rtdb.firebaseio.com/students.json",
        data: JSON.stringify(_student),
    }).done(function(res){
        var _newstudent = {
            id: res.name
        }
        $.get('https://students-26afb-default-rtdb.firebaseio.com/students/' + res.name + '.json', function(newstudentData){
            console.log("NEW STUDENT", newstudentData);
            _newstudent.name = newstudentData.name;
            _newstudent.email = newstudentData.email;
            _newstudent.image = newstudentData.image;
            _newstudent.admissionStatus = newstudentData.admissionStatus;
            _newstudent.deleted = newstudentData.deleted;
            console.log(_newstudent);
            students.push(_newstudent);
            displayStudents();
        })
    })   
}