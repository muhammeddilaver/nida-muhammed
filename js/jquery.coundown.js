// path: js/jquery.countdown.js

(function ($) {
	$.fn.countdown = function (options, callback) {
		var settings = $.extend({
			date: null,
			day: 'Day',
			days: 'Days',
			hour: 'Hour',
			hours: 'Hours',
			minute: 'Minute',
			minutes: 'Minutes',
			second: 'Second',
			seconds: 'Seconds'
		}, options);

		// Throw error if date is not set
		if (!settings.date) {
			$.error('Date is not defined.');
		}

		// Throw error if date is set incorrectly
		if (!Date.parse(settings.date)) {
			$.error('Incorrect date format, it should look like this, 12/24/2012 12:00:00.');
		}

		// Save container
		var container = this;

		/**
		 * Main countdown function that calculates everything
		 */
		function countdown () {
			var target_date = new Date(settings.date), // set target date
				current_date = new Date(); // get current date in visitor's local timezone

			// difference of dates
			var difference = target_date - current_date;

			// if difference is negative than it's past the target date
			if (difference < 0) {
				// stop timer
				clearInterval(interval);

				if (callback && typeof callback === 'function') callback();

				return;
			}

			// basic math variables
			var _second = 1000,
				_minute = _second * 60,
				_hour = _minute * 60,
				_day = _hour * 24;

			// calculate dates
			var days = Math.floor(difference / _day),
				hours = Math.floor((difference % _day) / _hour),
				minutes = Math.floor((difference % _hour) / _minute),
				seconds = Math.floor((difference % _minute) / _second);

			// based on the date change the reference wording
			var text_days = (days === 1) ? settings.day : settings.days,
				text_hours = (hours === 1) ? settings.hour : settings.hours,
				text_minutes = (minutes === 1) ? settings.minute : settings.minutes,
				text_seconds = (seconds === 1) ? settings.second : settings.seconds;

			// fix dates so that it will show two digits
			days = (String(days).length >= 2) ? days : '0' + days;
			hours = (String(hours).length >= 2) ? hours : '0' + hours;
			minutes = (String(minutes).length >= 2) ? minutes : '0' + minutes;
			seconds = (String(seconds).length >= 2) ? seconds : '0' + seconds;

			// set to DOM
			container.find('.days').text(days);
			container.find('.hours').text(hours);
			container.find('.minutes').text(minutes);
			container.find('.seconds').text(seconds);

			container.find('.days_text').text(text_days);
			container.find('.hours_text').text(text_hours);
			container.find('.minutes_text').text(text_minutes);
			container.find('.seconds_text').text(text_seconds);
		}

		// start
		var interval = setInterval(countdown, 1000);
	};

})(jQuery);

// Tarih ve saatleri ziyaretçinin yerel zaman dilimine çeviren fonksiyon
function convertToLocalTimezone() {
	// Edmonton'daki düğün tarihi ve saatleri (Mountain Time)
	const weddingDateTime = new Date('2025-06-01T11:00:00-06:00'); // -06:00 Mountain Time
	const mocktailStartTime = new Date('2025-06-01T14:00:00-06:00'); 
	const mocktailEndTime = new Date('2025-06-01T15:00:00-06:00');
  
	// Kullanıcının zaman dilimini al
	const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
	const isTurkey = userTimezone.includes('Istanbul') || userTimezone.includes('Turkey') || userTimezone === 'Europe/Istanbul';
	
	// Ziyaretçinin yerel zaman dilimindeki gün, tarih ve ay bilgisi
	const localDay = weddingDateTime.toLocaleDateString('en-US', { weekday: 'long' });
	const localDate = weddingDateTime.getDate();
	const localMonth = weddingDateTime.toLocaleDateString('en-US', { month: 'long' });
	const localYear = weddingDateTime.getFullYear();
  
	const timeOptions = { 
	  hour: 'numeric', 
	  minute: 'numeric',
	  hour12: !isTurkey // Türkiye için false (24 saat), diğerleri için true (12 saat)
	};
	
	// Ziyaretçinin yerel zaman dilimindeki saat bilgileri
	const localWeddingTime = weddingDateTime.toLocaleTimeString('en-US', timeOptions);
	const localMocktailStartTime = mocktailStartTime.toLocaleTimeString('en-US', timeOptions);
	const localMocktailEndTime = mocktailEndTime.toLocaleTimeString('en-US', timeOptions);
	
	// Sayfa yüklendiğinde tarih ve saat bilgilerini güncelle
	document.querySelector('.tanggal-hari').textContent = localDay;
	document.querySelector('.tanggal-angka').textContent = localDate;
	document.querySelector('.tanggal-bulan').textContent = `${localMonth} ${localYear}`;
	
	// Hero bölümündeki tarihi de güncelle
	const heroDateElement = document.querySelector('.tempatwaktu');
	if (heroDateElement) {
	  const heroDateHTML = heroDateElement.innerHTML;
	  const updatedHeroDate = heroDateHTML.replace(
		'Sunday, June 1, 2025',
		`${localDay}, ${localMonth} ${localDate}, ${localYear}`
	  );
	  heroDateElement.innerHTML = updatedHeroDate;
	}
	
	// Düğün töreni saatini güncelle
	const weddingTimeElement = document.querySelector('.column:nth-child(2) .waktu strong');
	if (weddingTimeElement) {
	  weddingTimeElement.textContent = localWeddingTime;
	}
	
	// Mocktail partisi saatini güncelle
	const mocktailTimeElement = document.querySelector('.column:nth-child(3) .waktu strong');
	if (mocktailTimeElement) {
	  mocktailTimeElement.textContent = `${localMocktailStartTime} - ${localMocktailEndTime}`;
	}
	
	// Zaman dilimi bilgisini ekle
	const timezoneName = Intl.DateTimeFormat().resolvedOptions().timeZone;
	const timezoneAbbr = getTimezoneAbbreviation();
	const timezoneOffset = new Date().getTimezoneOffset();
	const offsetHours = Math.abs(Math.floor(timezoneOffset / 60));
	const offsetMinutes = Math.abs(timezoneOffset % 60);
	const offsetSign = timezoneOffset < 0 ? '+' : '-';
	const offsetFormatted = `${offsetSign}${String(offsetHours).padStart(2, '0')}:${String(offsetMinutes).padStart(2, '0')}`;
	
	// Zaman dilimi bilgisini ekleyecek elementleri oluştur
	const createTimezoneInfo = (parentSelector) => {
	  const parent = document.querySelector(parentSelector);
	  if (parent) {
		const timezoneInfo = document.createElement('div');
		timezoneInfo.className = 'timezone-info';
		timezoneInfo.style.fontSize = '0.85em';
		timezoneInfo.style.marginTop = '10px';
		timezoneInfo.style.color = '#777';
		timezoneInfo.style.fontStyle = 'italic';
		timezoneInfo.innerHTML = `<div class="columns is-centered" data-aos="fade-up" data-aos-easing="linear">
              <div class="column is-8">
                <div class="timezone-info">
                  Dates/Times shown in your local timezone ${timezoneName} (UTC${offsetFormatted})
                </div>
                <div class="original-time-note">
                  Original event date: June 1, 2025 - 11:00 AM - 03:00 PM (Edmonton, Alberta - Mountain Time)
                </div>
              </div>
            </div>
		
		`;
		parent.appendChild(timezoneInfo);
	  }
	};
	
	// Hero bölümü ve Date bölümü için zaman dilimi bilgisini ekle
	createTimezoneInfo('.hero-body .container');
	createTimezoneInfo('#date .container');
  }
  
  // Zaman dilimi kısaltmasını al
  function getTimezoneAbbreviation() {
	const date = new Date();
	const timezone = date.toLocaleTimeString('en-us', {timeZoneName: 'short'}).split(' ')[2];
	return timezone;
  }
  
  // Sayfa yüklendiğinde fonksiyonu çalıştır
  document.addEventListener('DOMContentLoaded', function() {
	convertToLocalTimezone();
	
	// Geri sayım zamanlayıcısını da güncelle
	const weddingDate = '06/01/2025 11:00:00'; // MM/DD/YYYY format
	$('#hitungmundur').countdown({
	  date: weddingDate,
	  day: 'Day',
	  days: 'Days'
	}, function() {
	  alert('Time is up!');
	});
  });