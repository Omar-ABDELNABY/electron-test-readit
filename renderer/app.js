// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const { remote, ipcRenderer } = require('electron');
const items = require('./items');

let showModal = document.getElementById('show-modal'); 
let closeModal = document.getElementById('close-modal'); 
let modal = document.getElementById('modal'); 
let addItem = document.getElementById('add-item'); 
let itemUrl = document.getElementById('url'); 
let search = document.getElementById('search');


document.addEventListener('keyup', e => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown'){
        items.changeSelection(e.key);
    }
});

search.addEventListener('keyup', e => {
    Array.from(document.getElementsByClassName('read-item')).forEach(item => {
        let hasMatch = item.innerText.toLowerCase().includes(search.value);
        item.style.display = hasMatch ? 'flex' : 'none';
    });
});

toggleModalButtons = () => {
    if (addItem.disabled === true){
        addItem.disabled = false;
        addItem.style.opacity = 1;
        addItem.innerText = 'Add Item';
        closeModal.style.display = 'inline';
    } else {
        addItem.disabled = true;
        addItem.style.opacity = 0.5;
        addItem.innerText = 'Adding...';
        closeModal.style.display = 'none';
    }
}

showModal.addEventListener('click', e => {
    modal.style.display = 'flex';
    itemUrl.focus();
});

closeModal.addEventListener('click', e => {
    modal.style.display = 'none';
});

addItem.addEventListener('click', e => {
    if (itemUrl.value){

        //send item url to the main process on 'new-item' channel
        ipcRenderer.send('new-item', itemUrl.value);

        //Disable Buttons
        toggleModalButtons();
    }
});

ipcRenderer.on('new-item-success', (e, newItem) => {
    items.addItem(newItem, true);

    //Enable Buttons
    toggleModalButtons();

    //Hide Modal
    modal.style.display = 'none';
    itemUrl.value = '';
});

itemUrl.addEventListener('keyup', e => {
    if (e.key === 'Enter'){
        addItem.click();
    }
});
