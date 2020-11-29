$("form").attr('autocomplete', 'off');
$(document).ready(function () {
    var dn_arr = document.getElementsByClassName('pic_plugin');
    for (var i = 0; i < dn_arr.length; i++) {
        var dname = dn_arr[i].getAttribute("name");
        // console.log(dname)
       // var html = "<label for='file-input'><i class='fa fa-paperclip fa-lg' aria-hidden='true' ><input  class='file-input hide' type='file' name='" + dname + "' onchange='uploadFile(\"" + dname + "\")' /></i></label>";
       var html="<label class ='file-input' for='file-input'></label><input  class='hide' id='file-input' type='file' name='" + dname + "' onchange='uploadFile(\"" + dname + "\")' />";
        //html += "<input  class='file-input hide' type='file' name='" + dname + "' onchange='uploadFile(\"" + dname + "\")' />";
        html += "<span id='" + dname + "_preview_span'></span>" +
            "<input id='" + dname + "_hidden' name='" + dname + "_hidden' type='hidden' />";            
        dn_arr[i].innerHTML = html;
    }
});

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

function uploadFile(name) {
     //console.log('name is:-------------' + name);
     //console.log(document.getElementsByName(name)[0]);
    var file = document.getElementsByName(name)[1].files[0];
    var memory = file.size;
    console.log(memory);
    var extension = file.name.split('.').pop().toLowerCase();
    console.log(extension);
    if (extension == 'jpg' || extension == 'jpeg') {
        if (memory > 2097152) {
            alert('File is too big!')
        } else {
            getBase64(file).then(
                data => {
                    var file_arr = {};
                    // console.log(data);
                    var base64result_arr = data.split(',');
                    var base64result_str = '';
                    for (var i = 1; i < base64result_arr.length; i++) {
                        base64result_str += base64result_arr[i];
                    }
                    file_arr.base64 = base64result_str;
                    file_arr.filetype = file.type;
                    var filedata = { filedata: file_arr };
                    // console.log(filedata);
                    $.post('/uploadfile', { data: filedata }, function (resdata) { 
                        var html = "<img name='" + name + "_preview' width='100px' src="+resdata.savedpath+" />";
                        html += "<input type='button' name='" + name + "_preview_butt' class='btn btn-danger btn-sm' value='Delete' onclick='fileDelete(\"" + name + "\", \""+resdata.savedpath+"\")' />";
                        $("#" + name + "_preview_span").html($("#" + name + "_preview_span").html() + html);
                        var nmaes = $("#" + name + "_hidden").val();
                        nmaes +=  '||'+ resdata.savedpath;
                        var nmaes = $("#" + name + "_hidden").val(nmaes);
                    });
                }
            );
        }
    } else {
        alert('only jpg & jpeg');
    }
     
}

function fileDelete(name, filename) { 
    var prehids = document.getElementsByName(name + "_preview");
    var prehdds = document.getElementsByName(name + "_preview_butt");
    var names_ar = document.getElementById(name + '_hidden').value;
    var na_arr =  names_ar.split('||');
    var new_arr = '';
    
    for(var i=0;i<na_arr.length;i++)
        if(na_arr[i] != filename && na_arr[i] != '')
            new_arr += '||' + na_arr[i]; 
    document.getElementById(name + '_hidden').value = new_arr;
    for(var i=0;i<prehids.length;i++)
        if(prehids[i].getAttribute('src') == filename){
            prehids[i].parentNode.removeChild(prehids[i]);
            prehdds[i].parentNode.removeChild(prehdds[i]);
            break;
        }   

    console.log(prehdds.length)
    console.log(filename);
    $.post('/unlinkfile',{filename:filename},function(){
        console.log('Succesfully Removed');
    });     
}