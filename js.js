if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}


function ready() {
    var removeCartItemButtons = document.getElementsByClassName('btn-danger')
    for (var i = 0; i < removeCartItemButtons.length; i++) {
        var button = removeCartItemButtons[i]
        button.addEventListener('click', removeCartItem)
    }

    var quantityInputs = document.getElementsByClassName('cart-quantity-input')
    for (var i = 0; i < quantityInputs.length; i++) {
        var input = quantityInputs[i]
        input.addEventListener('change', quantityChanged)
    }

    var addToCartButtons = document.getElementsByClassName('shop-item-button')
    for (var i = 0; i < addToCartButtons.length; i++) {
        var button = addToCartButtons[i]
        button.addEventListener('click', addToCartClicked)
    }

    document.getElementsByClassName('btn-purchase')[0].addEventListener('click', payWithPaystack(e))
}

function removeCartItem(event) {
    var buttonClicked = event.target
    buttonClicked.parentElement.parentElement.remove()
    updateCartTotal()
}

function quantityChanged(event) {
    var input = event.target
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1
    }
    updateCartTotal()
}

function addToCartClicked(event) {
    var button = event.target
    var shopItem = button.parentElement.parentElement
    var title = shopItem.getElementsByClassName('shop-item-title')[0].innerText
    var price = shopItem.getElementsByClassName('shop-item-price')[0].innerText
    addItemToCart(title, price, event)
    updateCartTotal()
}

function addItemToCart(title, price, event) {
    var button = event.target
    var cartRow = document.createElement('div')
    cartRow.classList.add('cart-row')
    var cartItems = document.getElementsByClassName('cart-items')[0]
    var cartItemNames = cartItems.getElementsByClassName('cart-item-title')
    var addBtn = document.getElementsByClassName('add-to-cart-btn')
    var serilNum = 1;
   
            for (var i = 0; i < cartItemNames.length; i++) {
                if (cartItemNames[i].innerText == title) {
                    
                    cartItemNames[i].parentElement.parentElement.remove()
                    changeTxt2(event)
                    return
                }
                // else if(cartItemNames[i].innerText != title){
                //     changeTxt(event)
                // }
                
                if(cartItemNames[i].innerHTML !== title){
                    serilNum = serilNum + 1;
                }
            
            }
            changeTxt(event)
       

    var cartRowContents = `
    
        <div class="cart-item cart-column">
        <span class="sn">${serilNum}</span>
            <span class="cart-item-title">${title}</span>
        </div>
        <span class="cart-price cart-column">${price}</span>
        <div class="cart-quantity cart-column">
            <input class="cart-quantity-input" type="number" value="1">
            <button class="btn btn-danger" type="button">REMOVE</button>
        </div>
        `
    cartRow.innerHTML = cartRowContents
    cartItems.append(cartRow)
    cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem)
    cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged)
    
}

function updateCartTotal() {
    var cartItemContainer = document.getElementsByClassName('cart-items')[0]
    var cartRows = cartItemContainer.getElementsByClassName('cart-row')
    var total = 0
    for (var i = 0; i < cartRows.length; i++) {
        var cartRow = cartRows[i]
        var priceElement = cartRow.getElementsByClassName('cart-price')[0]
        var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
        var price = parseFloat(priceElement.innerText.replace('$', ''))
        var quantity = quantityElement.value
        total = total + (price * quantity)
        
    }
    total = Math.round(total * 100) / 100
    document.getElementsByClassName('cart-total-price')[0].innerText = '$' + total
    document.getElementById('amount').value = total
    document.querySelector('.cartNo span').textContent = cartRows.length;
    
}

// remove and add to cart btn modal
var addToCartBtn = document.getElementsByClassName('add-to-cart-btn')
let removeItemBtn = document.getElementsByClassName('remove-frm-cart-btn')


function changeTxt(event){
    var button = event.target
    button.innerHTML = 'REMOVE ITEM'
    button.style.backgroundColor = '#ffe9dc'
    
}

for (i=0; i<removeItemBtn.length; i++){
    let innerHt = removeItemBtn[i]
    innerHt.addEventListener('click', changeTxt2)
}
function changeTxt2(event){
    var button = event.target
    button.innerHTML = 'ADD TO CART'
    button.style.backgroundColor = '#ff7a00'
}
 

//CART MODAL
var cartModalBtn = document.getElementById('cart-modal');
var cartModalDisplay = document.getElementById('cart-modal-display')
var closeCartBtn = document.getElementById('close-cart-btn');

cartModalBtn.addEventListener('click', openCartModal)

closeCartBtn.addEventListener('click', closeModal)
window.addEventListener('click', clickOutside)


function openCartModal(){
    cartModalDisplay.style.display = 'grid'
    
}

function closeModal (){
    cartModalDisplay.style.display = 'none'
}

function clickOutside(e){
    if(e.target == cartModalDisplay){
        cartModalDisplay.style.display = 'none'
    }
}



 //  PAYSTACK //    

var paymentForm = document.getElementById('paymentForm');
paymentForm.addEventListener('submit', payWithPaystack, false);
function payWithPaystack(e) {
     e.preventDefault();
  var handler = PaystackPop.setup({
    key: 'pk_test_e7c91eb8f88a2338425c23dbc8a6735f367464b9', // Replace with your public key
    email: document.getElementById('email-address').value,
    amount: document.getElementById('amount').value * 100, // the amount value is multiplied by 100 to convert to the lowest currency unit
    currency: 'NGN', // Use GHS for Ghana Cedis or USD for US Dollars
    ref: 'Your_Reference', // Replace with a reference you generated
    callback: function(response) {
      //this happens after the payment is completed successfully
      var reference = response.reference;
      alert('Payment complete! Reference: ' + reference);
      // Make an AJAX call to your server with the reference to verify the transaction

      var cartItems = document.getElementsByClassName('cart-items')[0]
      while (cartItems.hasChildNodes()) {
          cartItems.removeChild(cartItems.firstChild)
      }
      updateCartTotal()

    },
    onClose: function() {
      alert('Transaction was not completed, window closed.');
    },
  });
  handler.openIframe();
}

// +Math.floor((math.random() * 1000000000) + 1),