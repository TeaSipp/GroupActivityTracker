var edit = {};
let variable = "";

function appendItem(title, image, priority, type, id){
    console.log(title, image, priority, type, id)
    if(priority == '-Select A Priority'){
        priority = 'High'
    }
    var container = document.getElementById(type+priority);
    var div = document.createElement('div');
    div.setAttribute('class', 'card '+priority);
    div.setAttribute('id', id);
    div.setAttribute('onclick', 'editClick(id)')
    div.innerHTML = '<img src="'+image+'"><div class="card-overlay"><h2>'+title+'</h2></div>';
    container.append(div)
    return true;
}

function createCards(){
    var wrapper = document.getElementById('create-wrapper');
    var popup = document.getElementById('create');
    wrapper.style.display = 'flex'
    setTimeout(function(){
        popup.style.opacity = '1'
        popup.style.transform = 'translateY(0)'

    }, 10);
}

function submitCard(){
    edit.Title = document.getElementById('create-title').value;
    edit.Image = document.getElementById('create-image').value;
    edit.Type = 'Anime'
    var Priority = document.getElementById('create-priority').selectedIndex;
    switch(Priority){
        case 1:
            edit.Priority = 'High';
            break
        case 2:
            edit.Priority = 'Medium';
            break
        case 3:
            edit.Priority = 'Low';
            break
        case 4:
            edit.Priority = 'Completed';
            break
        default:
            edit.Priority = 'Low';
    }
    eel.push_repo(edit, true);
    cancelCreate();
}

function editClick(id){
    console.log('Clicked')
    eel.fetch_edit(id);
}

function editCard(obj){
    edit = obj
    var wrapper = document.getElementById('edit-wrapper');
    var popup = document.getElementById('edit');
    var iTitle = document.getElementById('title');
    var iImage = document.getElementById('image');
    var iPriority = document.getElementById('priority');
    var iType = document.getElementById('type');
    var iId = document.getElementById('id');
    var selected = 0;
    switch(iPriority){
        case 'High':
            selected = 1;
        case 'Medium':
            selected = 2;
        case 'Low':
            selected = 3;
        case 'Completed':
            selected = 4;
        default:
            selected = 0;
    }
    iTitle.value = obj.Title;
    iImage.value = obj.Image;
    iPriority.selectedIndex = selected;
    iType = obj.Type;
    iId = obj.Id;
    wrapper.style.display = 'flex'
    setTimeout(function(){
        popup.style.opacity = '1'
        popup.style.transform = 'translateY(0)'

    }, 10);
}

function cancelCreate(){
    var wrapper = document.getElementById('create-wrapper');
    var popup = document.getElementById('create');
    var iTitle = document.getElementById('create-title');
    var iImage = document.getElementById('create-image');
    var iPriority = document.getElementById('create-priority');
    var iType = document.getElementById('create-type');
    var iId = document.getElementById('create-id');
    iTitle.value = '';
    iImage.value = '';
    iPriority.selectedIndex = 0;
    iType = '';
    iId = '';
    popup.style.opacity = '0';
    popup.style.transform = 'translateY(10px)';
    setTimeout(function(){
        wrapper.style.display = 'none';
    }, 500);
}

function cancelEdit(){
    var wrapper = document.getElementById('edit-wrapper');
    var popup = document.getElementById('edit');
    var iTitle = document.getElementById('title');
    var iImage = document.getElementById('image');
    var iPriority = document.getElementById('priority');
    var iType = document.getElementById('type');
    var iId = document.getElementById('id');
    iTitle.value = '';
    iImage.value = '';
    iPriority.selectedIndex = 0;
    iType = '';
    iId = '';
    popup.style.opacity = '0';
    popup.style.transform = 'translateY(10px)';
    setTimeout(function(){
        wrapper.style.display = 'none';
    }, 500);
}

function updateCard(){
    edit.Title = document.getElementById('title').value;
    edit.Image = document.getElementById('image').value;
    var Priority = document.getElementById('priority').selectedIndex;
    switch(Priority){
        case 1:
            edit.Priority = 'High';
            break
        case 2:
            edit.Priority = 'Medium';
            break
        case 3:
            edit.Priority = 'Low';
            break
        case 4:
            edit.Priority = 'Completed';
            break
        default:
            edit.Priority = 'Low';
    }
    eel.push_repo(edit, false);
    cancelEdit();
}

function debug(error){
    console.log(error);
}

function deleteCard(){
    eel.deleteItem(edit.Id);
    cancelEdit();
}

function getSha(sha){
    variable = sha
}

function removeElement(id){
    document.getElementById(id).remove()
}

function updateElement(object){
    var element = document.getElementById(object.Id);
    if(element == null){
        appendItem(object.Title, object.Image, object.Priority, object.Type, object.Id);
    }
    else{
        element.remove();
        appendItem(object.Title, object.Image, object.Priority, object.Type, object.Id);
    }
}


async function checkVariable() {
    let previousValue = variable;
    while (true) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      variable = await eel.getnewsha()();
      if (variable !== previousValue) {
        console.log("SHA has been changed from:", previousValue, "to", variable);
        eel.find_update()
        previousValue = variable;
      }
    }
  }

checkVariable();

eel.expose(appendItem);
eel.expose(editCard);
eel.expose(debug);
eel.expose(getSha);
eel.expose(updateElement);
eel.expose(removeElement);