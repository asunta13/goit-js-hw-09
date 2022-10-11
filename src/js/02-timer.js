import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const startBtnRef = document.querySelector('[data-start]');
const timerRef = document.querySelector('.timer');
const inputRef = document.querySelector('#datetime-picker');

startBtnRef.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const delta = selectedDates[0].getTime() - Date.now();

    if (delta <= 0) {
      Notify.failure('Вибраний час у минулому, виберіть дату у майбутньому!', {
        position: 'center-center',
        backOverlay: true,
        clickToClose: true,
        closeButton: true,
      });
      return;
    } else {
      Notify.success('Натисніть Start, і відлік почнеться!', {
        position: 'center-center',
        backOverlay: true,
        clickToClose: true,
        closeButton: true,
      });
      startBtnRef.removeAttribute('disabled');
      startBtnRef.addEventListener('click', onStartBtnClick);
    }

    function onStartBtnClick() {
      timer.start(timerRef, selectedDates[0]);
    }
  },
};

flatpickr('#datetime-picker', options);

const timer = {
  intervalId: null,
  refs: {},
  start(rootSelector, deadline) {
    if (!deadline) {
      return;
    }
    startBtnRef.setAttribute('disabled', '');
    inputRef.setAttribute('disabled', '');

    const delta = deadline.getTime() - Date.now();

    function convertMs(ms) {
      const second = 1000;
      const minute = second * 60;
      const hour = minute * 60;
      const day = hour * 24;

      const days = Math.floor(ms / day);
      const hours = Math.floor((ms % day) / hour);
      const minutes = Math.floor(((ms % day) % hour) / minute);
      const seconds = Math.floor((((ms % day) % hour) % minute) / second);

      return { days, hours, minutes, seconds };
    }

    this.getRefs(rootSelector);

    this.intervalId = setInterval(() => {
      const diff = deadline.getTime() - Date.now();
      if (diff <= 1000) {
        clearInterval(this.intervalId);
        Notify.success('Дедлайн настав!', {
          position: 'center-center',
          backOverlay: true,
          clickToClose: true,
          closeButton: true,
        });
      }
      const data = convertMs(diff);

      console.log(data);

      Object.entries(data).forEach(([name, value]) => {
        this.refs[name].textContent = this.zeroAdd(value);
      });
    }, 1000);
  },
  getRefs(rootSelector) {
    this.refs.days = rootSelector.querySelector('[data-days]');
    this.refs.hours = rootSelector.querySelector('[data-hours]');
    this.refs.minutes = rootSelector.querySelector('[data-minutes]');
    this.refs.seconds = rootSelector.querySelector('[data-seconds]');
  },
  zeroAdd(value) {
    return String(value).padStart(2, '0');
  },
};
