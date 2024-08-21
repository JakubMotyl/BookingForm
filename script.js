const placeEl = document.getElementById('place');
const checkInEl = document.getElementById('checkIn');
const checkOutEl = document.getElementById('checkOut');
const roomsEl = document.getElementById('rooms');
const adultsEl = document.getElementById('adults');
const childrenEl = document.getElementById('children');
const priceBtnEl = document.getElementById('priceBtn');
const priceEl = document.getElementById('price');

document.addEventListener('DOMContentLoaded', function() {
  const today = new Date();
  const todayYear = today.getFullYear();
  const todayMonth = (today.getMonth() + 1).toString().padStart(2, '0');
  const todayDay = today.getDate().toString().padStart(2, '0');
  const formattedTodayDate = `${todayYear}-${todayMonth}-${todayDay}`;

  checkInEl.min = formattedTodayDate;
});

checkInEl.addEventListener('change', function() {
  const today = new Date();
  const todayYear = today.getFullYear();
  const todayMonth = (today.getMonth() + 1).toString().padStart(2, '0');
  const todayDay = today.getDate().toString().padStart(2, '0');
  const formattedTodayDate = `${todayYear}-${todayMonth}-${todayDay}`;

  checkInEl.min = formattedTodayDate;

  const checkInDate = new Date(checkInEl.value);

  const checkOutDateObj = new Date(checkInDate);
  checkOutDateObj.setDate(checkOutDateObj.getDate() + 1);

  const year = checkOutDateObj.getFullYear();
  const month = (checkOutDateObj.getMonth() + 1).toString().padStart(2, '0');
  const day = checkOutDateObj.getDate().toString().padStart(2, '0');

  const checkOutDate = `${year}-${month}-${day}`;

  checkOutEl.min = checkOutDate;
  checkOutEl.value = checkOutDate;
});

function getUserInputs() {
  const place = placeEl.value.toUpperCase();
  const checkIn = checkInEl.value;
  const checkOut = checkOutEl.value;
  const rooms = roomsEl.value;
  const adults = adultsEl.value;
  const children = childrenEl.value; 
  const accomodationInput = document.querySelector(`input[name="accomodation"]:checked`);
  const accomodation = accomodationInput ? accomodationInput.value : null;

  return {
    place,
    checkIn,
    checkOut,
    rooms,
    adults,
    children,
    accomodation
  };
}

function validateInputs({ place, checkIn, checkOut, rooms, adults, children, accomodation }) {
  if (!place || !checkIn || !checkOut || !rooms || !adults || !children || !accomodation) {
    alert('Please fill in all the fields.');
    return false;
  }
  return true;
}

priceBtnEl.addEventListener('click', e=>{
  e.preventDefault();
  const userInputs = getUserInputs();
  if(validateInputs(userInputs)) {
    priceEl.classList.add('price-show');
    generateCost(userInputs);
  }
  
});


function generateCost({ place, checkIn, checkOut, rooms, adults, children, accomodation }) {
  const days = (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24);

  function priceCalculator() {
    let minDaysPrice, maxDaysPrice;

    switch (accomodation) {
      case 'Hotels':
        minDaysPrice = 50 * days;
        maxDaysPrice = 100 * days;
      case 'Homes & Apartments':
        minDaysPrice = 20 * days;
        maxDaysPrice = 50 * days
      case 'All Properties':
      default:
        minDaysPrice = 20 * days;
        maxDaysPrice = 100 * days;
        break;
    }

    minDaysPrice = minDaysPrice * rooms + 30 * adults + 10 * children;
    maxDaysPrice = maxDaysPrice * rooms + 30 * adults + 10 * children;

    return {
      minPrice: `${minDaysPrice}$`,
      maxPrice: `${maxDaysPrice}$`
    }
  }

  const {minPrice, maxPrice} = priceCalculator();

  let roomText = `${rooms} room${rooms > 1 ? 's' : ''}`;
  let adultText = adults > 0 ? `${adults} adult${adults > 1 ? 's' : ''}` : '';
  let childText = children > 0 ? `${children} child${children > 1 ? 'ren' : ''}` : '';

  let description = [roomText, adultText, childText].filter(Boolean).join(', ');

  priceEl.innerHTML = `

      <div class="price-location">
        <div class="price-location-title">
          <span>Location:</span>
        </div>
        <div class="price-location-desc">
          <span id="priceLocation">${place}</span>
        </div>
      </div>
      <div class="price-info">
        <div class="price-info-title"><span>Price for:</span></div>
        <div class="price-info-desc">
          <span id="finalAcc">${description} <span id="finalAccType">in ${accomodation}</span></span> on 
          <span id="finalDays">${days} day${days > 1 ? 's' : ''}</span> between
          <span id="finalDate">${checkIn}&nbsp;to&nbsp;${checkOut}</span>
        </div>
      </div>
      <div class="final-price">
        <div class="final-price-title">
          <span>Final price range:</span>
        </div>
        <div class="final-price-desc">
          <span id="finalPrice">${minPrice} - ${maxPrice}</span>
        </div>
      </div>
  `;
}

