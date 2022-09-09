"use strict";

const db = new Dexie('GroceryApp')

db.version(1).stores({
    items: '++id,name,price,isPurchased'
})

const itemInput = document.getElementById('itemInput')
const newItemsDiv = document.getElementById('newItemsDiv')
const totalPriceDiv = document.getElementById('totalPriceDiv')
const createNewListDiv = document.getElementById('createNewListDiv')

const poplateNewItemsDiv = async () => {
    const allItems = await db.items.reverse().toArray()

    newItemsDiv.innerHTML = allItems.map(item => `
    <div class="item ${item.isPurchased && 'purchased'}">
      <input
        type="checkbox"
        class="checkbox"
        onchange="toggleItemStatus(event, ${item.id})"
        ${item.isPurchased && 'checked'}
      />
      <div class="itemInfo">
        <p>${item.name}</p>
        <p>₹${item.price} x ${item.qty}</p>
      </div>

      ${!item.isPurchased ? `<div class="itemChange">
        <button onclick="deleteItem(${item.id})" class="deleteButton">
        <span class="deleteSign">&#9747</span>
        </button>
      </div>`: ``}
    </div>
  `).join('')

  const arrayOfPrices = allItems.map(i => i.price * item.qty)
  const totalPrice = arrayOfPrices.reduce((a, b) => a + b, 0)
  totalPriceDiv.innerHTML = `Total Price: ₹ ${totalPrice}`
}

// add toggle item status
const toggleItemStatus = async (e, id) => {
  await db.items.update(id, {isPurchased: !!e.target.checked})
  await poplateNewItemsDiv()
} 

// delete items from db
const deleteItem = async id => {
  await db.items.delete(id)
  await poplateNewItemsDiv()
  // defaultView(true)
}

// delete all item from database
const deleteAllItems = () => {
  db.items.clear()
  poplateNewItemsDiv()
  // defaultView(true)
}

itemInput.onsubmit = async (e) => {
    e.preventDefault()
    const name = document.getElementById('nameInput').value
    const qty = document.getElementById('qtyInput').value
    const price = document.getElementById('priceInput').value

    await db.items.add({
        name,
        qty,
        price
    })

    await poplateNewItemsDiv()
    itemInput.reset()

    Toastify({
        text: `${name} Added`,
        duration: 3000,
        newWindow: true,
        close: true,
        gravity: "bottom", // `top` or `bottom`
        position: "center", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
        onClick: function () {} // Callback after click
    }).showToast();
}

window.onload = poplateNewItemsDiv