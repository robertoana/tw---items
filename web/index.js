async function load() {
    document.getElementsByTagName('input')[0].onkeyup = addItem;
    const response = await fetch('/items');
    if (response.status === 200) {
        const body = await response.json();
        body.forEach(({id, text}) => appendItem(id, text));
    }
}

async function addItem(event) {
    const text = event.target.value.trim();
    if (event.key === 'Enter' && text.length > 0) {
        const response = await fetch('/items', {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain'
            },
            body: text
        });
        if (response.status === 201) {
            const body = await response.text();
            appendItem(body, text);
        }
        event.target.value = '';
    }
}

function appendItem(id, text) {
    const listItem = document.createElement('li');
    listItem.data = id;
    const input = document.createElement('input');
    input.type = 'text';
    input.value = text;
    input.onkeyup = function(event) {
        if (event.key === 'Enter' && input.value.trim() !== '') {
            changeItem(event, listItem);
        }
    };
    listItem.appendChild(input);
    const removeLink = document.createElement('a');
    removeLink.href = 'javascript:void(0)';
    removeLink.onclick = function() {
        removeItem(id);
    };
    removeLink.onclick = () => removeItem(listItem);
    removeLink.innerText = 'Remove';
    listItem.appendChild(removeLink);
    document.getElementsByTagName('ul')[0].appendChild(listItem);
}

async function changeItem(event, listItem) {
    const text = event.target.value.trim();
    if (event.key === 'Enter' && text.length > 0) {
        const response = await fetch(`/items/${listItem.data}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'text/plain'
            },
            body: text
        });

        if (response.status === 200 || response.status === 204) {
            listItem.getElementsByTagName('input')[0].value = text; 
        } else {
            alert('Item could not be modified.');
        }
    }
}



async function removeItem(listItem) {
    const response = await fetch(`/items/${listItem.data}`, {
        method: 'DELETE'
    });
    if (response.status === 204) {
        listItem.parentNode.removeChild(listItem);
    } else {
        alert('Item could not be removed.');
    }
}