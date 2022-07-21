function convertTo12Hr(currentHour){
    let hourFormat = currentHour;
    let amPm = 'am'; // default setting
    if(hourFormat > 12){
        currentHour = hourFormat - 12;
        amPm = 'pm';
    }else{
        return{
            'currentHour' : hourFormat,
            'amPm' : amPm   
        }
    }
}
function changeTimeFormat(hourFormat){
    let time_format = localStorage.getItem('time_format')
    if(time_format == null || time_format == undefined){
        //do nothing
    }else{
        time_format = JSON.parse(time_format);
        let hourFormat = time_format['hourFormat'];
        let clockInfo = document.getElementById('timeInfo');
        if(hourFormat == 12){
            time_format['hourFormat'] = 24;
            time_format['info'] = '24Hours';
            clockInfo.style.display = 'inline';
        }
        if(hourFormat == 24){
            time_format['hourFormat'] = 12;
            time_format['info'] = 12;
            clockInfo.innerHTML = 'time currently in 12 hours';
        }
        time_format = JSON.stringify(time_format)
        localStorage.setItem('time_format', time_format)
    }
}

function getTime(){
    let currentDate = new Date();
    let currentHour = currentDate.getHours();
    let currentMinutes = currentDate.getMinutes();
    let currentSeconds = currentDate.getSeconds();
    let time_format = localStorage.getItem('time_format');
    let setHour = currentHour;
    let hourFormat = 24; //default time set
    let amPm = "";
    if(time_format == null || time_format == undefined){
        //save to 12 hour
        time_format = JSON.parse(time_format);
        time_format = localStorage.setItem('time_format', time_format);
        if(currentHour > 12){
            setHour = setHour - 12;
        }
        time_format = {
            'hourFormat' : 12,
            'info' : '12Hours'
        }
        time_format = JSON.stringify(time_format);
        localStorage.setItem('time_format', time_format);
    }else{
        time_format = JSON.parse(time_format);
        hourFormat = time_format['hourFormat'];
        if(hourFormat == 24){
            setHour = currentHour;
        }
        if(hourFormat == 12){
            if(currentHour > 12){
                setHour = currentHour - 12;
            }else{
                setHour = currentHour;
            }
            time_format = convertTo12Hr(currentHour);
           // amPm = time_format['amPm'];
        }
        let min_string = JSON.stringify(currentMinutes);
        if(min_string.length === 1){
            currentMinutes = '0' + min_string;
        }
        let sec_string = JSON.stringify(currentSeconds);
        if(sec_string.length === 1){
            currentSeconds = '0' + sec_string;
        }
    }
    let clockId = document.getElementById('inner_clock_id');

    let clockCode = `<div id='inner_clock_div'>
                           <span id='clock_display'>${setHour}:${currentMinutes}:${currentSeconds}<small style='font-size:15px'>${amPm}</small></span>
                           <div>
                              <button id='inner_settings_id'>Toggle</button>
                           </div>
                     </div>`

                     clockId.innerHTML = clockCode; 

                     document.getElementById('inner_clock_div').addEventListener('mouseover', function(){
                         document.getElementById('inner_settings_id').style.display = 'inline';
                     })
                     document.getElementById('inner_settings_id').addEventListener('click', function(){
                         changeTimeFormat(hourFormat);
                         let clockInfo = document.getElementById('timeInfo');
                         clockInfo.style.display = 'inline';
                     })
}


getTime();

setInterval(getTime, 1000);





/**
 * Additions
 * Getting the Notes
 */

window.onload = function(){

    let notes = localStorage.getItem("notes");

    if(notes == null ||  notes == undefined){

        document.getElementById("note_info_id").innerHTML = "<h3>You have no note at the moment</h3>";

    }else{

        notes = JSON.parse(notes);

        let notes_count = notes.length;

        document.getElementById("note_info_id").innerHTML = `<h3>You have ${notes_count} notes </h3> <br>`;


        let note_item = document.getElementsByClassName("note_item")[0];


        //display the notes..
        let note_code = "";
        for(let i = 0; i < notes_count; i++){
            note = JSON.parse(notes[i]);
            note_code += `<h3>${note['title']}</h3>`;

            note_code += `<p class="paragraph">
                           ${note['content']}
                        </p>`;

             note_code += `<div class="buttons">
                        <button type='button' onclick='updateNote(${note['date_created']})'>Update</button>
                        <button type='button' onclick='deleteNote(${note['date_created']})'>Delete</button>
                        </div> `

        }

        note_item.innerHTML = note_code;

    }



}


function updateNote(timestamp){

    let notes = localStorage.getItem("notes");

    notes = JSON.parse(notes);

    for(let i = 0; i < notes.length; i++){

            note = JSON.parse(notes[i]);

            if(note['date_created'] == timestamp){
                //this is the note..
                 
                 let edit_code = ` <form class='update_form_class'>
                              <div class="form-group">
                                <label>Update Note Title</label><br>
                                <input type="text" placeholder="Title" id='new_note_title_id' value='${note['title']}'>
                              </div>
                              <div class="form-group">
                                <label>Update Note Content</label><br>
                                <textarea cols="73" rows="20" placeholder="Enter Note Content" id='new_note_content_id'>${note['content']}</textarea>
                              </div>
                               <div class="form-group">
                                <button type='button' class='save_button' id='update_button_id_${timestamp}'>Update Note</button>
                                <span id='update_note_info_id_${timestamp}'></span>
                              </div>
                           </form> <hr>`;

                  document.querySelector("#update_info_id").innerHTML = edit_code;
                

            }


    }


    document.querySelector("#update_button_id_"+timestamp).addEventListener("click", function(){

        let new_title = document.getElementById("new_note_title_id").value;
        let new_content = document.getElementById("new_note_content_id").value;

        new_title = new_title.trim();
        new_content = new_content.trim();

        if(new_title.length == 0 || new_content.length == 0){
            //nothing was entered
        }else{

              const date = new Date();

              const date_updated = date.getTime();

              let notes = localStorage.getItem("notes");

              notes = JSON.parse(notes);

              for(let i = 0; i < notes.length; i++){

                  note = JSON.parse(notes[i]);

                  //if(note)
                  if(note['date_created'] == timestamp){
                      //this is the note..
                      //
                      //1. change the date updated
                      note['date_updated'] = date_updated;

                      //2. change the  note title
                      note['title'] = new_title;

                      //3. change the note content
                      note['content'] = new_content;

                      note = JSON.stringify(note);

                      notes[i] = note;

                      notes = JSON.stringify(notes);

                      localStorage.setItem("notes", notes);

                      //inform the user of the update
                      location.reload();


                  }


              }


        }


    })



}



function deleteNote(timestamp){

    //get this note from localStorage and delete..
    let notes = localStorage.getItem("notes");

    notes = JSON.parse(notes);

    for(let i = 0; i < notes.length; i++){

            note = JSON.parse(notes[i]);

            if(note['date_created'] == timestamp){
                //this is the note..
                 
                notes.splice(i, 1);

                //save notes back to the localStorage..
                notes = JSON.stringify(notes);

                localStorage.setItem("notes", notes);

                //reloads the page
                location.reload();

            }


    }


}
