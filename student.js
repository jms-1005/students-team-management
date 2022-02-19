
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
       console.log(students[i].deleted)
        if(students[i].deleted !== true){
            _student += `<div class="row student" id="s${students[i].id}">
                <div class="col-lg-2 image">
                    <img src="${students[i].image}">
                </div>
                <div class="col-lg-10">
                    <h3 class="name">${ students[i].name }</h3>
                    <div class="email">Email: <a href="mailto:${ students[i].email }">${ students[i].email }</a></div>
                    <div class="id">ID: ${ students[i].id }</div>

                    <div class="form-check form-switch admissionStatus">
                        <label class="form-check-label" for="check${ students[i].id }">
                            Admission Status: <span id="c-status${ students[i].id }">
                                                ${ (students[i].admissionStatus)? 'Admitted' : 'Not Admitted' }
                                            </span>
                        </label>
                        <input class="form-check-input" type="checkbox" id="check${ students[i].id }"
                            onclick="setAdmissionStatus('${ students[i].id }')"
                            ${ (students[i].admissionStatus)? 'checked' : '' }
                        >
                    </div>

                    <div class="deleted">
                        <button class="btn btn-danger" onclick="removeStudent('${students[i].id}')">Remove Student</button>
                    </div>
                </div>
            </div>`
        }
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

function setAdmissionStatus(id){
    $.ajax({
        accept: "application/json",
        type: "PUT",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: "https://students-26afb-default-rtdb.firebaseio.com/students/" + id + "/admissionStatus.json",
        data: JSON.stringify($('#check'+id).prop('checked'))
    }).done(res => { 
        $('#check'+id).prop('checked', res);
        $('#c-status'+id).html(`${ (res)? 'Admitted' : 'Not Admitted' }`);
    })
}

function removeStudent(id){
    $.ajax({
        accept: "application/json",
        type: "PUT",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: "https://students-26afb-default-rtdb.firebaseio.com/students/" + id + "/deleted.json",
        data: JSON.stringify(true)
    }).done(res => { 
        _index = students.map( (i) => { return i.id }).indexOf(id);
        students[_index].deleted = true;
        console.log('removing...');
        $('#s'+id).fadeOut(1500)
    })
}

function deleteStudent(id){
    $.ajax({
        accept: "application/json",
        type: "DELETE",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: "https://students-26afb-default-rtdb.firebaseio.com/students/" + id + ".json",
        data: JSON.stringify(true)
    }).done(res => { 
        console.log(res);
    })
}