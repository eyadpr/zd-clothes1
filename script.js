/* =========================================
   ZD CLOTHES
   COMPLETE FRONTEND JAVASCRIPT
========================================= */

"use strict";

/* =========================
   CART
========================= */

let cart = [];


/* =========================
   LOADER
========================= */

window.addEventListener("load", () => {

    setTimeout(() => {

        const loader = document.getElementById("loader");

        if(loader){
            loader.classList.add("hide");
        }

    }, 1000);

});


/* =========================
   MOBILE MENU
========================= */

function toggleMenu(){

    const nav = document.getElementById("nav");

    if(nav){
        nav.classList.toggle("active");
    }

}


/* =========================
   CLOSE MOBILE MENU
========================= */

document.querySelectorAll("#nav a").forEach(link => {

    link.addEventListener("click", () => {

        document
            .getElementById("nav")
            ?.classList.remove("active");

    });

});


/* =========================
   FILTERS
========================= */

const filters =
    document.querySelectorAll(".filter");

const products =
    document.querySelectorAll(".product");


filters.forEach(filter => {

    filter.addEventListener("click", () => {

        filters.forEach(btn => {
            btn.classList.remove("active");
        });

        filter.classList.add("active");

        const category =
            filter.dataset.filter;

        products.forEach(product => {

            const match =
                category === "all" ||
                product.dataset.category === category;

            if(match){

                product.style.display = "block";

                requestAnimationFrame(() => {
                    product.classList.add("show");
                });

            }else{

                product.classList.remove("show");

                setTimeout(() => {

                    if(!product.classList.contains("show")){
                        product.style.display = "none";
                    }

                }, 500);

            }

        });

    });

});


/* =========================
   PRODUCT ANIMATION
========================= */

if("IntersectionObserver" in window){

    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if(entry.isIntersecting){

                        entry.target.classList.add("show");

                    }

                });

            },
            {
                threshold:.1
            }
        );

    products.forEach(product => {
        observer.observe(product);
    });

}else{

    products.forEach(product => {
        product.classList.add("show");
    });

}


/* =========================
   ADD TO CART
========================= */

function addToCart(name, price){

    const existing =
        cart.find(item => item.name === name);

    if(existing){

        existing.quantity++;

    }else{

        cart.push({
            name:name,
            price:Number(price),
            quantity:1
        });

    }

    updateCart();

    openCart();

}


/* =========================
   UPDATE CART
========================= */

function updateCart(){

    const cartItems =
        document.getElementById("cartItems");

    const cartCount =
        document.getElementById("cartCount");

    const cartTotal =
        document.getElementById("cartTotal");


    const count =
        cart.reduce(
            (sum,item) =>
                sum + item.quantity,
            0
        );


    const total =
        cart.reduce(
            (sum,item) =>
                sum +
                item.price * item.quantity,
            0
        );


    if(cartCount){

        cartCount.textContent = count;

    }


    if(cartTotal){

        cartTotal.textContent =
            `${total.toLocaleString("en-US")} EGP`;

    }


    if(!cartItems) return;


    if(cart.length === 0){

        cartItems.innerHTML = `

            <div class="empty-cart">

                <i class="fa-solid fa-shirt"></i>

                <p>
                    السلة فاضية
                </p>

            </div>

        `;

        return;

    }


    cartItems.innerHTML = "";


    cart.forEach((item,index) => {

        const div =
            document.createElement("div");

        div.className = "cart-item";


        div.innerHTML = `

            <div class="cart-item-img">
                ZD
            </div>

            <div class="cart-item-info">

                <h4>
                    ${escapeHtml(item.name)}
                </h4>

                <span>
                    ${item.price.toLocaleString("en-US")} EGP
                </span>

                <div class="qty">

                    <button
                        type="button"
                        onclick="changeQuantity(${index}, -1)"
                    >
                        −
                    </button>

                    <strong>
                        ${item.quantity}
                    </strong>

                    <button
                        type="button"
                        onclick="changeQuantity(${index}, 1)"
                    >
                        +
                    </button>

                </div>

            </div>

            <button
                type="button"
                class="remove"
                onclick="removeItem(${index})"
                aria-label="حذف المنتج"
            >

                <i class="fa-solid fa-trash"></i>

            </button>

        `;


        cartItems.appendChild(div);

    });

}


/* =========================
   CHANGE QUANTITY
========================= */

function changeQuantity(index, amount){

    if(!cart[index]) return;

    cart[index].quantity += amount;

    if(cart[index].quantity <= 0){

        cart.splice(index,1);

    }

    updateCart();

    updateOrderPreview();

}


/* =========================
   REMOVE ITEM
========================= */

function removeItem(index){

    if(!cart[index]) return;

    cart.splice(index,1);

    updateCart();

    updateOrderPreview();

}


/* =========================
   OPEN CART
========================= */

function openCart(){

    document
        .getElementById("cart")
        ?.classList.add("active");

    document
        .getElementById("cartOverlay")
        ?.classList.add("active");

}


/* =========================
   CLOSE CART
========================= */

function closeCart(){

    document
        .getElementById("cart")
        ?.classList.remove("active");

    document
        .getElementById("cartOverlay")
        ?.classList.remove("active");

}


/* =========================
   CHATBOT
========================= */

function toggleChatbot(){

    document
        .getElementById("chatbotPanel")
        ?.classList.toggle("active");

}


/* =========================
   ORDER MODAL
========================= */

function openOrderForm(){

    if(cart.length === 0){

        alert("ضيف منتج للسلة الأول 🛒");

        return;

    }


    updateOrderPreview();

    closeCart();

    const modal =
        document.getElementById("orderModal");

    if(modal){
        modal.classList.add("active");
    }


    const formContent =
        document.getElementById("orderFormContent");

    const success =
        document.getElementById("orderSuccess");


    if(formContent){
        formContent.style.display = "block";
    }

    if(success){
        success.classList.remove("active");
    }

}


/* =========================
   CLOSE ORDER
========================= */

function closeOrderForm(){

    document
        .getElementById("orderModal")
        ?.classList.remove("active");

}


/* =========================
   ORDER PREVIEW
========================= */

function updateOrderPreview(){

    const itemsElement =
        document.getElementById("orderItems");

    const totalElement =
        document.getElementById("orderTotal");


    if(!itemsElement || !totalElement){
        return;
    }


    if(cart.length === 0){

        itemsElement.textContent = "-";
        totalElement.textContent = "0 EGP";

        return;

    }


    const names =
        cart.map(item => {

            if(item.quantity > 1){

                return `${item.name} × ${item.quantity}`;

            }

            return item.name;

        });


    const total =
        cart.reduce(
            (sum,item) =>
                sum +
                item.price *
                item.quantity,
            0
        );


    itemsElement.textContent =
        names.join(" + ");


    totalElement.textContent =
        `${total.toLocaleString("en-US")} EGP`;

}


/* =========================
   ORDER CODE
========================= */

function generateOrderCode(){

    const random =
        Math.floor(
            100000 +
            Math.random() * 900000
        );

    return `ZD-${random}`;

}


/* =========================
   PHONE VALIDATION
========================= */

function isValidEgyptianPhone(phone){

    const clean =
        phone.replace(/\s+/g,"");

    return /^01[0125]\d{8}$/.test(clean);

}


/* =========================
   ORDER SUBMIT
========================= */

const orderForm =
    document.getElementById("orderForm");


if(orderForm){

    orderForm.addEventListener(
        "submit",
        function(event){

            event.preventDefault();


            if(cart.length === 0){

                alert("السلة فاضية 🛒");

                return;

            }


            const name =
                document
                    .getElementById("customerName")
                    ?.value
                    .trim();


            const governorate =
                document
                    .getElementById("customerGovernorate")
                    ?.value
                    .trim();


            const area =
                document
                    .getElementById("customerArea")
                    ?.value
                    .trim();


            const phone =
                document
                    .getElementById("customerPhone")
                    ?.value
                    .trim();


            const phone2 =
                document
                    .getElementById("customerPhone2")
                    ?.value
                    .trim();


            const address =
                document
                    .getElementById("customerAddress")
                    ?.value
                    .trim();


            if(
                !name ||
                !governorate ||
                !area ||
                !phone ||
                !address
            ){

                alert(
                    "من فضلك اكتب كل البيانات المطلوبة"
                );

                return;

            }


            if(!isValidEgyptianPhone(phone)){

                alert(
                    "من فضلك اكتب رقم هاتف مصري صحيح"
                );

                return;

            }


            if(
                phone2 &&
                !isValidEgyptianPhone(phone2)
            ){

                alert(
                    "رقم الهاتف الإضافي غير صحيح"
                );

                return;

            }


            const total =
                cart.reduce(
                    (sum,item) =>
                        sum +
                        item.price *
                        item.quantity,
                    0
                );


            const orderCode =
                generateOrderCode();


            const itemsText =
                cart.map(item => {

                    return `• ${item.name} × ${item.quantity} — ${item.price} EGP`;

                }).join("\n");


            /*
                رقم Vodafone Cash
            */

            const vodafoneCash =
                "01025922053";


            /*
                رسالة WhatsApp
            */

            const whatsappMessage = `

🖤💛 ZD CLOTHES

📦 طلب جديد

🔐 كود الطلب:
${orderCode}

━━━━━━━━━━━━━━

👤 اسم العميل:
${name}

📍 المحافظة:
${governorate}

🏘️ المنطقة:
${area}

📱 رقم الهاتف:
${phone}

📱 رقم إضافي:
${phone2 || "لا يوجد"}

🏠 العنوان بالتفصيل:
${address}

━━━━━━━━━━━━━━

👕 المنتجات:

${itemsText}

━━━━━━━━━━━━━━

💰 الإجمالي:
${total.toLocaleString("en-US")} EGP

━━━━━━━━━━━━━━

💳 طريقة الدفع:
Vodafone Cash

📲 رقم Vodafone Cash:
${vodafoneCash}

━━━━━━━━━━━━━━

شكراً لاختيارك ZD CLOTHES 🖤💛

`;


            const whatsappURL =
                "https://wa.me/201037393529?text=" +
                encodeURIComponent(
                    whatsappMessage
                );


            /*
                إظهار شاشة النجاح
            */

            const formContent =
                document.getElementById(
                    "orderFormContent"
                );


            const success =
                document.getElementById(
                    "orderSuccess"
                );


            const code =
                document.getElementById(
                    "orderCode"
                );


            if(formContent){
                formContent.style.display = "none";
            }


            if(success){
                success.classList.add("active");
            }


            if(code){
                code.textContent = orderCode;
            }


            /*
                فتح WhatsApp
            */

            window.open(
                whatsappURL,
                "_blank",
                "noopener,noreferrer"
            );


            /*
                تفريغ السلة
            */

            cart = [];

            updateCart();

        }
    );

}


/* =========================
   ESC KEY
========================= */

document.addEventListener(
    "keydown",
    event => {

        if(event.key === "Escape"){

            closeCart();

            closeOrderForm();

            document
                .getElementById("chatbotPanel")
                ?.classList.remove("active");

        }

    }
);


/* =========================
   CLICK OUTSIDE ORDER
========================= */

document
    .getElementById("orderModal")
    ?.addEventListener(
        "click",
        function(event){

            if(event.target === this){

                closeOrderForm();

            }

        }
    );


/* =========================
   HTML SECURITY
========================= */

function escapeHtml(text){

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


/* =========================
   INITIALIZE
========================= */

updateCart();