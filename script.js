'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Hilqia Kenda',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2024-04-01T23:36:17.929Z',
    '2024-04-20T21:31:17.178Z',
    '2024-05-05T07:42:02.383Z',
    '2024-05-25T09:15:04.904Z',
    '2024-06-05T10:17:24.185Z',
    '2024-06-28T14:11:59.604Z',
    '2024-07-01T17:01:17.194Z',
    '2024-07-04T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'es-ES', // de-DE
};

const account2 = {
  owner: 'Visa Kenda',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Rosette Kenda Mbango',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'GBP',
  locale: 'en-GB', // de-DE
};

/*
const account3 = {
  owner: 'Rosette Kenda Mbango',
  movements: [50],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: ['2020-07-26T12:01:20.894Z'],
};
*/

const account4 = {
  owner: 'Bella Kenda',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    '2024-03-20T21:31:17.178Z',
    '2024-05-05T07:42:02.383Z',
    '2024-05-25T09:15:04.904Z',
    '2024-06-05T10:17:24.185Z',
    '2024-06-20T14:11:59.604Z',
    '2024-07-01T17:01:17.194Z',
    '2024-07-03T23:36:17.929Z',
    '2024-07-05T10:51:36.790Z',
  ],

  currency: 'EUR',
  locale: 'fr-FR', // de-DE
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////

const formatMovement = function (date, locale) {
  const calcDayPass = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const dayPassed = calcDayPass(new Date(), date);
  const options = {
    year: 'numeric',
    month: 'short',
    weekday: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  };
  if (dayPassed === 0) return 'Today';
  if (dayPassed === 1) return 'Yesterday';
  if (dayPassed <= 7) return `${dayPassed} days ago`;

  /*
  const day = `${date.getDate()}`.padStart(2, 0);
  const month = `${date.getMonth() + 1}`.padStart(2, 0);
  const year = date.getFullYear();
  */
  return new Intl.DateTimeFormat(locale, options).format(date);
};

const formatedCurrency = function (acco, ...movs) {
  movs = new Intl.NumberFormat(acco.locale, {
    style: 'currency',
    currency: acco.currency,
  }).format(Math.abs(movs));
  return movs;
};

const displayMovement = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, idx) {
    // const formatedCurrency = new Intl.NumberFormat(acc.locale, {
    //   style: 'currency',
    //   currency: acc.currency,
    // }).format(Math.abs(mov));

    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(acc.movementsDates[idx]);
    const dispDate = formatMovement(date, acc.locale);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      idx + 1
    } ${type}</div>
     <div class="movements__date">${dispDate}</div>
    <div class="movements__value">${formatedCurrency(acc, mov)}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acco) {
  acco.balances = acco.movements.reduce((acc, mov) => acc + mov);

  labelBalance.textContent = `${formatedCurrency(acco, acco.balances)}`;
  /*
  labelBalance.textContent = `${new Intl.NumberFormat(
      acco,
      acco.balances
    ).format(acco.balances.toFixed(2))}`;
    */
};

const calcDisplaySummary = function (account) {
  const income = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${formatedCurrency(account, income)}`;

  // labelSumIn.textContent = `${new Intl.NumberFormat(account.locale).format(
  //   Math.abs(income).toFixed(2)
  // )}€`;

  const totaltOutEur = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${formatedCurrency(account, totaltOutEur)}`;
  /*
    labelSumOut.textContent = `${new Intl.NumberFormat(account.locale).format(
    Math.abs(totaltOutEur).toFixed(2)
  )}€`;
  */

  const interest = account.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * account.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int);
  labelSumInterest.textContent = `${formatedCurrency(account, interest)}`;

  /*   labelSumInterest.textContent = `${new Intl.NumberFormat(
     account.locale
 ).format(Math.abs(interest).toFixed(2))}€`;
  */
};

// const user = 'Rosette Kenda Mbango'; // rkm
const createUser = function (accountsUser) {
  accountsUser.forEach(function (account) {
    // console.log(account);

    account.username = account.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');

    // console.log(account.username);
  });
};

// Craete Movemevts Date
// const createDate = function (accountDate) {
//   accountDate = function (movDates) {
//     movDates.movementsDates2 = [];
//   };
//   console.log(movDates.movementsDates2);
// };
// createDate();

createUser(accounts);
const UpdateTtheUI = function (currentAcc) {
  // Display Balance
  calcDisplayBalance(currentAcc);

  // labelBalance.textContent = `${calcDisplayBalance(movements)}€`;

  // Display Movement
  displayMovement(currentAcc);

  // Display summary
  calcDisplaySummary(currentAcc);
};

//////////////////////////////////
// event handler for the login btn
let currentAccount, timer;

// Fake alway logged in
/*
currentAccount = account1;
UpdateTtheUI(currentAccount);
containerApp.style.opacity = 100;
*/
//Call the timer every second

const logOutTimer = function () {
  let time = 300;
  // let time = 10;
  const resetCountDown = function () {
    let minute = String(Math.trunc(time / 60)).padStart(2, 0);
    let second = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${minute}:${second}`;

    if (time === 0) {
      clearInterval(timer);

      labelWelcome.textContent = 'Log in  again to get started';
      containerApp.style.opacity = 0;
    }
    time--;
  };
  resetCountDown();
  timer = setInterval(resetCountDown, 1000);
  return timer;
};

const resetTimer = function () {
  if (timer) clearInterval(timer);
  timer = logOutTimer();
};

btnLogin.addEventListener('click', function (e) {
  //prevent fromsubmiting
  // Invoking this method prevents event from reaching any registered event listeners after the current one finishes running
  e.preventDefault();

  currentAccount = accounts.find(
    account => account.username === inputLoginUsername.value
  );
  // console.log(currentAccount);

  if (currentAccount.pin === +inputLoginPin.value) {
    // Displaye welcome message

    labelWelcome.textContent = `Welcome ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;

    // Date an Time
    const date = new Date();
    // const localFormat = navigator.language; // to define localy time and Date in a local format
    const options = {
      year: 'numeric',
      month: 'short',
      weekday: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    };
    labelDate.textContent = Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(date);

    /*
    const now = new Date();
    const day = `${now.getDate()}`.padStart(2, 0);
    const month = `${now.getMonth() + 1}`.padStart(2, 0);
    const year = now.getFullYear();
    const hour = `${now.getHours()}`.padStart(2, 0);
    const minute = `${now.getMinutes()}`.padStart(2, 0);

    labelDate.textContent = now;
    labelDate.textContent = `${day}/${month}/${year},  ${hour}:${minute}`;
    */

    // Clear the input field
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginUsername.blur();
    inputLoginPin.blur();

    // Timer
    resetTimer();

    // Update the UI
    UpdateTtheUI(currentAccount);

    // Display timer
    /*
    labelTimer.value = setTimeout(function () {
      containerApp.style.opacity = 0;
      labelWelcome.textContent = 'Log in to get started';
    }, 10 * 1000);
*/
  }
  // console.log(
  //   currentAccount?.pin === Number(inputLoginPin.value) ? 'LOGIN' : 'Error'
  // );
});

// Working on transfert
btnTransfer.addEventListener('click', function (event) {
  event.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  if (
    amount > 0 &&
    receiverAcc?.username &&
    currentAccount.balances >= amount &&
    receiverAcc.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Add a Transfert Date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update the UI
    UpdateTtheUI(currentAccount);
  }

  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferAmount.blur();
  inputTransferTo.blur();

  resetTimer();
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(+inputLoanAmount.value);
  setTimeout(function () {
    if (
      amount > 0 &&
      currentAccount.movements.some(loan => loan >= amount / 0.1)
    ) {
      currentAccount.movements.push(amount);

      // Add a Loan date
      currentAccount.movementsDates.push(new Date().toISOString());

      // update the UI
      UpdateTtheUI(currentAccount);
    }
  }, 5 * 1000);
  inputLoanAmount.value = '';
  inputLoanAmount.blur();

  resetTimer();
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === +inputClosePin.value
  ) {
    console.log('Deleted');

    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );

    // Delet Account

    accounts.splice(index, 1);
    // containerApp.style.opacity = 0;
  }

  inputClosePin.value = inputCloseUsername.value = '';
  inputClosePin.blur();
  inputCloseUsername.blur();

  resetTimer();
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovement(currentAccount, !sorted);
  sorted = !sorted;

  resetTimer();
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

/*
console.log(23 === 23.0);

console.log(0.1 + 0.2 === 0.2);
console.log(0.1 + 0.2);

// Conversion
// Js does an automatic type coercion because of the operator
console.log(+'23');
console.log(+'23');

// Parsing
console.log(Number.parseInt('30px', 10));
console.log(Number.parseInt('e20', 10));

console.log(Number.parseFloat('2.5rem', 10));

// Check if value is Not a Number(NaN)
console.log(Number.isNaN(20));
console.log(Number.isNaN('20'));
console.log(Number.isNaN(+'20px'));
console.log(Number.isNaN(23 / 0));

// Check if value is a Number
console.log(Number.isFinite(20));
console.log(Number.isFinite('20'));
console.log(Number.isFinite(+'20X'));
console.log(Number.isFinite(23 / 0));

console.log(Number.isInteger(23));
console.log(Number.isInteger(23.0));
console.log(Number.isInteger(23 / 0));

console.log(Math.sqrt(25));
console.log(25 ** (1 / 2));
console.log(8 ** (1 / 3));

console.log(Math.max(5, 18, 23, 2));
console.log(Math.max(5, 18, '23', 2));
console.log(Math.max(5, 18, '23px', 2));

console.log(Math.min(5, 18, 23, 2));
console.log(Math.min(5, 18, '23', 2));

console.log(Math.PI * Number.parseFloat('10px') ** 2);
console.log(Math.trunc(Math.random() * 6) + 1);

const randomInt = (min, max) =>
  Math.trunc(Math.random() * (max - min) + 1) + min;
// 0...1 -> 0...(max - min) -> min...max
console.log(randomInt(10, 20));

// Roundong int
console.log(Math.trunc(23.3));
console.log(Math.round(23.9));

console.log(Math.ceil(23.3));
console.log(Math.ceil(23.9));

console.log(Math.floor(23.9));
console.log(Math.floor(23.9));

// Rounding Decimal Value
console.log((2.7).toFixed());
console.log((2.7).toFixed(3));
console.log(+(2.345).toFixed(2));

// ------- Remainder Operator------------
console.log(5 % 2);
console.log(5 / 2); // 5 = 2 * 2 + 1

console.log(8 % 3);
console.log(8 / 3); // 8 = 2 * 3 + 2

console.log(6 % 2);
console.log(6 / 2); // 6 = 2 * 2 + 2

console.log(7 % 2);
console.log(7 / 2);
const isEven = n => n % 2 === 0;
console.log(isEven(8));
console.log(isEven(23));
console.log(isEven(514));

labelBalance.addEventListener('click', function () {
  [...document.querySelectorAll('.movements__row')].forEach(function (row, i) {
    // 0 , 2, 4, 6
    if (i % 2 === 0) row.style.backgroundColor = 'orangered';

    // 0, 3, 6, 9
    if (i % 3 === 0) row.style.backgroundColor = 'blue';
  });
});

// ---------- BigInt(n) --------------

console.log(2 ** 53 - 1);
console.log(Number.MAX_SAFE_INTEGER);
console.log(2 ** 53 + 1);
console.log(2 ** 53 + 2);
console.log(2 ** 53 + 3);

console.log(54125454245875248752473574274534n);
console.log(BigInt(54125454245875248752473574274534));

// Operator
console.log(10000n + 10000n);
console.log(25454524542452445n * 100000000n);
const huge = 2324551453414454n;
const num = 23;
console.log(huge * BigInt(num));
// console.log(Math.sqrt(16n)); // Maths operation does not wok with bigInt

// Exception
console.log(20n > 15);
console.log(20n === 20);
console.log(typeof 20n);
console.log(20n == 20); // Her wit == Js does a type coercion so bigInt is transform to a regular number and the result will be True

// Concat with a trsing transform a bigInt to a string
console.log(huge + ' Is Really Huge!!!');

// Divison
console.log(10n / 3n);
console.log(10 / 3);

// ------------ Date and Time ------------
const now = new Date();
console.log(now);
console.log(new Date('Jul 05 2024 07:11:32'));
console.log(new Date('Dec 24, 2015'));
console.log(new Date(account1.movementsDates[0]));

console.log(new Date(2037, 10, 19, 15, 23, 5));
console.log(new Date(2037, 10, 31));
console.log(new Date(2037, 10, 33));

console.log(new Date(0));
console.log(new Date(3 * 24 * 60 * 60 * 1000));

// WOrking with Dates
const future = new Date(2037, 10, 19, 15, 23);
console.log(future.getFullYear());
console.log(future.getMonth());
console.log(future.getDay());
console.log(future.getDate());
console.log(future.getHours());
console.log(future.getMinutes());
console.log(future.getSeconds());
console.log(future.getMilliseconds());
console.log(future.getTimezoneOffset());
console.log(future.getUTCDate());
console.log(future.getUTCFullYear());

console.log(future.toISOString());
console.log(future.getTime());
console.log(new Date(259200000));

console.log(Date.now());
future.setFullYear(2050);
console.log(future);

// -------- Operation with Date ----------
const future = new Date(2037, 10, 19, 15, 23);
+future;
// console.log(+future);
const calcDayPass = (date1, date2) => (date2 - date1) / 1000 / 60 / 60 / 24;
// const calcDayPass = (date1, date2) => (date2 - date1) / (1000 * 60 * 60 * 24);

const days1 = calcDayPass(new Date(2037, 3, 14), new Date(2037, 3, 24));
// console.log(days1);

//-------  internationalization API ---------
  const date = new Date();
  // const localFormat = navigator.language; // to define localy time and Date in a local format
  const options = {
    year: 'numeric',
    month: 'short',
    weekday: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  };
  labelDate.textContent = Intl.DateTimeFormat(
    currentAccount.locale,
    options
  ).format(date);

const num = 21131135.12;
const option = {
  style: 'currency',
  currency: 'EUR',
};
console.log('US: ', new Intl.NumberFormat('en-US', option).format(num));

// --------- Timer ----------
const ingredients = ['olives', 'spinash'];
const pizzaTimer = setTimeout(
  ingredients => console.log(`Here is your pizza🍕; with: ${ingredients}`),
  3 * 1000,
  ...ingredients
);

if (ingredients.includes('spinash')) clearTimeout(pizzaTimer);
else console.log(pizzaTimer);

// SetInterval

const intervalSet = setInterval(function () {
  const now = new Date();
  console.log(now);
}clearInterva);

const now = new Date();
const hour = `${now.getHours()}`.padStart(2, 0);
const minute = `${now.getMinutes()}`.padStart(2, 0);
const second = `${now.getSeconds()}`.padStart(2, 0);
setInterval(
  (hour, minute, second) => {
    console.log(`${hour}:${minute}:${second}`);
  },
  1000000,
  hour,
  minute
);
*/
