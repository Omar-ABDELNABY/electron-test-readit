let items = document.getElementById('items'); 

exports.storage = JSON.parse(localStorage.getItem('readit-items')) || [];

exports.save = () => {
    localStorage.setItem('readit-items', JSON.stringify(this.storage));
}

exports.select = e => {
    document.getElementsByClassName('read-item selected')[0].classList.remove('selected');
    e.currentTarget.classList.add('selected');
}

exports.changeSelection = direction => {
    let currentItem = document.getElementsByClassName('read-item selected')[0];
    if(direction === 'ArrowUp' && currentItem.previousSibling){
        currentItem.classList.remove('selected');
        currentItem.previousSibling.classList.add('selected');
    }
    if(direction === 'ArrowDown' && currentItem.nextSibling){
        currentItem.classList.remove('selected');
        currentItem.nextSibling.classList.add('selected');
    }
}

exports.open = () => {
    if (! this.storage.length){
        return;
    }
    let selectedItem = document.getElementsByClassName('read-item selected')[0];
    let contentUrl = selectedItem.dataset.url;

    let readerWin = window.open(contentUrl, '');
};

exports.addItem = (newItem, isNew = false) => {
    let itemNode = document.createElement('div');
    itemNode.classList.add('read-item');
    itemNode.innerHTML = `<img src="${newItem.screenshot}"><h2>${newItem.title}</h2>`;
    items.appendChild(itemNode);

    //add data attribute
    itemNode.setAttribute('data-url', newItem.url);

    // attach click handler to select
    itemNode.addEventListener('click', this.select);

    itemNode.addEventListener('dblclick', this.open);

    if (document.getElementsByClassName('read-item').length === 1){
        itemNode.classList.add('selected');
    }

    if (isNew){
        this.storage.push(newItem);
        this.save();
    }
}

this.storage.forEach(item => {
    this.addItem(item, false)
});



