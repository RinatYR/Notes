const notes = localStorage.getItem('notes') ? JSON.parse(localStorage.getItem('notes')) : [];
let addButtonClose = false;
let timeOut = 0;

const editorTitle = $('.editor__title');
const editorContent = $('.editor__content');

function render(){
    const noteList = notes.map(function(note, id){
        return `
        <li class="note">
            <h2 class="note__title" onclick="editNote(${id})">${note.title}</h2>
            <p class="note__preview">${note.text}</p>
            <div class="note__remove" onclick="removeNote(${id})">&times;</div>
        </li>
        `
    }).join('');
    $('.note-list').html(noteList);
}

function editNote(idx){
    editorTitle.text(notes[idx].title);
    editorContent.text(notes[idx].text);
    openCloseEditor();
    if(addButtonClose){addEventToInputs(idx)};
}
function removeNote(idx){
    notes.splice(idx, 1);
    localStorage.setItem('notes', JSON.stringify(notes));
    render();
}

function addEventToInputs(idx){
    editorTitle.data('idx', idx);
    editorContent.data('idx', idx);
    //убираем старые слушатели
    editorTitle.off('input');
    editorContent.off('input');
    //добавляем новые слушатели
    editorTitle.on('input', realTimeSaveNote);
    editorContent.on('input', realTimeSaveNote);
}

function realTimeSaveNote(){
    const index = $(this).data('idx');
    clearTimeout(timeOut);
    timeOut = setTimeout(function(){
        console.log(notes)
        notes[index].title = editorTitle.text();
        notes[index].text = editorContent.text();
        localStorage.setItem('notes', JSON.stringify(notes));
        render();
    }, 500);
}

function openCloseEditor(){
    $('.editor').toggleClass('editor__show');
    $('.add').toggleClass('add_close');
    addButtonClose = !addButtonClose;
}

render();

$('.add').click(() => {
    openCloseEditor();
    if(addButtonClose){
        editorTitle.text('');
        editorContent.text('');
        notes.push({
            title: '', 
            text: ''
        });
        addEventToInputs(notes.length - 1);
    }
});


