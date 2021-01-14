const notes = localStorage.getItem('notes') ? JSON.parse(localStorage.getItem('notes')) : [];
let addButtonClose = false;
let timeOut = 0;

const editorTitle = document.querySelector('.editor__title');
const editorContent = document.querySelector('.editor__content');

function render(){
    const noteList = document.querySelector('.note-list');
    noteList.innerHTML = notes.map(function(note, id){
        return `
        <li class="note">
            <h2 class="note__title" onclick="editNote(${id})">${note.title}</h2>
            <p class="note__preview">${note.text}</p>
            <div class="note__remove" onclick="removeNote(${id})">&times;</div>
        </li>
        `
    }).join('');
}
function editNote(idx){
    editorTitle.textContent = notes[idx].title;
    editorContent.textContent = notes[idx].text;
    openCloseEditor();
    if(addButtonClose){addEventToInputs(idx)};
}
function removeNote(idx){
    notes.splice(idx, 1);
    localStorage.setItem('notes', JSON.stringify(notes));
    render();
}

function addEventToInputs(idx){
    editorTitle.dataset.idx = idx;
    editorContent.dataset.idx = idx;
    console.log(idx)
    //убираем старые слушатели
    editorTitle.removeEventListener('input', realTimeSaveNote);
    editorContent.removeEventListener('input', realTimeSaveNote);
    //добавляем новые слушатели
    editorTitle.addEventListener('input', realTimeSaveNote)
    editorContent.addEventListener('input', realTimeSaveNote)
}

function realTimeSaveNote(event){
    const index = event.target.dataset.idx;
    clearTimeout(timeOut);
    timeOut = setTimeout(function(){
        console.log(notes)
        notes[index].title = editorTitle.textContent;
        notes[index].text = editorContent.textContent;
        localStorage.setItem('notes', JSON.stringify(notes));
        render();
    }, 500);
}

function openCloseEditor(){
    const editor = document.querySelector('.editor');
    editor.classList.toggle('editor__show');
    document.querySelector('.add').classList.toggle('add_close');
    addButtonClose = !addButtonClose;
}

render();

document.querySelector('.add').onclick = () => {
    openCloseEditor();
    if(addButtonClose){
        editorTitle.textContent = '';
        editorContent.textContent = '';
        notes.push({
            title: '', 
            text: ''
        });
        addEventToInputs(notes.length - 1);
    }
}


