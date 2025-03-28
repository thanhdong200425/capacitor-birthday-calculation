import { SplashScreen } from "@capacitor/splash-screen";
import { LocalNotifications } from "@capacitor/local-notifications";
import { Share } from "@capacitor/share";

window.customElements.define(
    "birthday-app",
    class extends HTMLElement {
        constructor() {
            super();

            SplashScreen.hide();

            this.requestNotificationPermission();

            this.batteryStatus = {
                level: 0,
                charging: false,
            };

            this.initBatteryMonitoring();

            const root = this.attachShadow({ mode: "open" });

            root.innerHTML = `
        <style>
          :host {
            display: block;
            width: 100%;
            height: 100%;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            color: var(--text-color, #333);
          }
          
          :root {
            --primary-color: #5d2555;
            --secondary-color: #7e57c2;
            --accent-color: #ff4081;
            --text-color: #333;
            --light-bg: #f8f9fa;
            --card-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
            --transition: all 0.3s ease;
          }
          
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            position: relative;
            z-index: 1;
          }
          
          .birthday-card {
            background: white;
            border-radius: 20px;
            padding: 30px;
            box-shadow: var(--card-shadow);
            margin: -40px 0 20px;
            position: relative;
          }
          
          .button {
            display: inline-flex;
            align-items: center;
            justify-content: space-between;
            border-radius: 16px;
            font-weight: 600;
            padding: 18px 24px;
            cursor: pointer;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            text-decoration: none;
            border: none;
            width: 100%;
            font-size: 17px;
            margin-top: 10px;
          }

          .button svg {
            margin-left: 8px;
            transition: transform 0.2s;
          }

          .button:hover svg {
            transform: translateX(4px);
          }

          .button-primary {
            background: linear-gradient(135deg, var(--primary-color) 0%, #7c2c7c 100%);
            color: white;
            box-shadow: 0 10px 20px -5px rgba(93, 37, 85, 0.35);
          }

          .button-primary:hover {
            transform: translateY(-4px) scale(1.02);
            box-shadow: 0 15px 30px rgba(93, 37, 85, 0.4);
          }

          .button-primary:active {
            transform: translateY(-2px) scale(0.98);
          }
          
          .result {
            text-align: center;
            margin-top: 35px;
          }
          
          .fade-in {
            animation: fadeIn 0.6s ease-in-out forwards;
          }
          
          .hidden {
            display: none;
          }
          
          @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
          }
          
          .birthday-input {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
          }
          
          .birthday-input input {
            width: 100%;
            padding: 16px;
            border: 2px solid #eaeaea;
            border-radius: 12px;
            font-size: 18px;
            text-align: center;
            background-color: white;
            transition: all 0.3s ease;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          }
          
          .birthday-input input:focus {
            border-color: var(--secondary-color);
            box-shadow: 0 0 0 3px rgba(126, 87, 194, 0.2);
            outline: none;
          }
          
          .result-container {
            background: linear-gradient(145deg, var(--secondary-color), var(--primary-color));
            border-radius: 16px;
            padding: 25px;
            color: white;
            margin: 30px 0;
            position: relative;
            overflow: hidden;
            box-shadow: 0 15px 30px rgba(93, 37, 85, 0.3);
          }
          
          .result-bubble {
            position: absolute;
            background-color: rgba(255, 255, 255, 0.1);
            border-radius: 50%;
          }
          
          .bubble-1 {
            width: 100px;
            height: 100px;
            top: -30px;
            left: -30px;
          }
          
          .bubble-2 {
            width: 60px;
            height: 60px;
            bottom: 20px;
            right: 40px;
          }
          
          .result-days {
            font-size: 4rem;
            font-weight: 800;
            margin: 15px 0;
            text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
          }
          
          .card-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 20px;
          }
          
          .card-icon {
            font-size: 28px;
            color: var(--primary-color);
          }
          
          .form-title {
            font-size: 1.5rem;
            font-weight: 600;
            color: var(--primary-color);
            margin: 0;
          }
          
          .input-wrapper {
            position: relative;
            margin-bottom: 30px;
            width: 100%;
          }
          
          .input-wrapper label {
            position: absolute;
            left: 15px;
            top: -10px;
            background-color: white;
            padding: 0 8px;
            font-size: 14px;
            color: var(--secondary-color);
            font-weight: 500;
            z-index: 1;
          }
          
          .input-wrapper input {
            width: 100%;
            padding: 18px 20px;
            border: 2px solid #eaeaea;
            border-radius: 16px;
            font-size: 20px;
            transition: var(--transition);
            text-align: center;
            letter-spacing: 2px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            background: linear-gradient(to bottom, #ffffff, #fafafa);
            display: block;
            box-sizing: border-box;
          }
          
          .input-wrapper input:focus {
            border-color: var(--secondary-color);
            outline: none;
            box-shadow: 0 4px 15px rgba(126, 87, 194, 0.25);
            background: white;
          }
          
          .input-wrapper input::placeholder {
            color: #bbb;
            font-weight: 400;
          }
          
          .input-wrapper .input-icon {
            position: absolute;
            right: 20px;
            top: 50%;
            transform: translateY(-50%);
            color: var(--secondary-color);
            opacity: 0.6;
            transition: var(--transition);
          }
          
          .input-wrapper input:focus + .input-icon {
            opacity: 1;
          }
          
          .form-hint {
            display: block;
            margin-top: 8px;
            color: #777;
            font-size: 13px;
            text-align: center;
          }
          
          .confetti {
            position: absolute;
            width: 10px;
            height: 10px;
            opacity: 0;
          }
          
          @keyframes confetti-fall {
            0% {
              transform: translateY(-100px) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translateY(100vh) rotate(720deg);
              opacity: 0;
            }
          }
          
          .header {
            background: var(--primary-color);
            color: white;
            padding: 35px 20px 60px;
            text-align: center;
            position: relative;
            overflow: hidden;
          }
          
          .header-content {
            position: relative;
            z-index: 2;
          }
          
          .header-bg {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, var(--primary-color) 0%, #7c2c7c 100%);
            z-index: 1;
          }
          
          .header-shape {
            position: absolute;
            bottom: -2px;
            left: 0;
            right: 0;
            height: 40px;
            background-color: var(--light-bg);
            clip-path: polygon(0 100%, 100% 100%, 100% 0, 0 100%);
            z-index: 1;
          }
          
          footer {
            background: var(--primary-color);
            color: white;
            padding: 20px 0;
            text-align: center;
            margin-top: auto;
          }

          .footer-text {
            opacity: 0.8;
            font-size: 0.875rem;
          }
          
          .battery-status {
            margin-top: 8px;
            background-color: rgba(255, 255, 255, 0.1);
            padding: 6px 12px;
            border-radius: 20px;
            display: inline-flex;
            align-items: center;
            font-size: 0.875rem;
          }
          
          .battery-icon {
            display: inline-block;
            width: 18px;
            height: 10px;
            background-color: rgba(255, 255, 255, 0.8);
            border-radius: 2px;
            margin-right: 6px;
            position: relative;
          }
          
          .battery-icon:after {
            content: '';
            position: absolute;
            top: 2px;
            right: -3px;
            width: 3px;
            height: 6px;
            background-color: rgba(255, 255, 255, 0.8);
            border-radius: 0 2px 2px 0;
          }
          
          .battery-icon .battery-level {
            position: absolute;
            left: 2px;
            top: 2px;
            bottom: 2px;
            background-color: #4CAF50;
            border-radius: 1px;
            transition: width 0.3s ease;
          }
          
          .battery-icon .charging-indicator {
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 6px;
            color: rgba(0, 0, 0, 0.7);
            z-index: 1;
          }
          
          .battery-low {
            background-color: #FF5252 !important;
          }
          
          .in-app-notification {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%) translateY(-100px);
            background: linear-gradient(135deg, var(--secondary-color) 0%, var(--primary-color) 100%);
            color: white;
            padding: 15px 25px;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            display: flex;
            align-items: center;
            min-width: 300px;
            max-width: 90%;
            transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s ease;
            opacity: 0;
          }

          .in-app-notification.show {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
          }

          .notification-icon {
            font-size: 24px;
            margin-right: 15px;
            flex-shrink: 0;
          }

          .notification-content {
            flex-grow: 1;
          }

          .notification-title {
            font-weight: 600;
            margin: 0 0 5px 0;
            font-size: 1rem;
          }

          .notification-message {
            margin: 0;
            font-size: 0.9rem;
            opacity: 0.9;
          }

          .notification-close {
            background: none;
            border: none;
            color: white;
            width: 24px;
            height: 24px;
            padding: 0;
            cursor: pointer;
            font-size: 18px;
            opacity: 0.7;
            transition: opacity 0.2s;
            margin-left: 10px;
            flex-shrink: 0;
          }
          
          .notification-close:hover {
            opacity: 1;
          }
          
          .hidden {
            display: none;
          }
        </style>
        <div id="app">
          <header class="header">
            <div class="header-bg"></div>
            <div class="header-content container">
              <h1>Birthday Countdown</h1>
            </div>
            <div class="header-shape"></div>
          </header>
          
          <main class="container">
            <div class="birthday-card">
              <div class="card-header">
                <h2 class="form-title">When is your birthday?</h2>
                <div class="card-icon">🎂</div>
              </div>
              
              <div class="input-wrapper">
                <label for="birthdate">Enter your birth date</label>
                <input type="text" id="birthdate" placeholder="DD/MM" maxlength="5">
                <div class="input-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                </div>
                <span class="form-hint">Format: DD/MM (e.g., 15/06 for June 15)</span>
              </div>
              
              <button class="button button-primary" id="calculate-btn">
                <span>Calculate Days</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </button>
              
              <div id="notification-pref" class="notification-option" style="margin-top: 15px; display: flex; align-items: center;">
                <input type="checkbox" id="enable-notification" checked>
                <label for="enable-notification" style="margin-left: 8px; font-size: 14px;">Send a notification with the result</label>
              </div>
              
              <div id="result" class="result hidden">
                <div id="result-container" class="result-container">
                  <div class="result-bubble bubble-1"></div>
                  <div class="result-bubble bubble-2"></div>
                  <p class="result-text">There are</p>
                  <div class="result-days" id="days-count">0</div>
                  <p class="result-text">days until your next birthday</p>
                </div>
                <p class="result-message" id="birthday-message"></p>
                
                <div class="action-buttons">
                  <button class="button share-button" id="share-btn">
                    <span>Share</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="18" cy="5" r="3"></circle>
                      <circle cx="6" cy="12" r="3"></circle>
                      <circle cx="18" cy="19" r="3"></circle>
                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                    </svg>
                  </button>
                </div>
                
                <p id="test-date-info" style="font-size: 12px; margin-top: 15px; opacity: 0.6;">* Using today's date for calculations</p>
              </div>
            </div>
          </main>
          
          <!-- In-app notification component -->
          <div id="in-app-notification" class="in-app-notification">
            <div class="notification-icon">🔔</div>
            <div class="notification-content">
              <h4 class="notification-title">Notification Title</h4>
              <p class="notification-message">Notification message goes here</p>
            </div>
            <button class="notification-close" id="notification-close">×</button>
          </div>
          
          <footer>
            <div class="container">
              <p class="footer-text">© ${new Date().getFullYear()} Birthday Countdown App • Built with Capacitor</p>
              <div class="battery-status" id="battery-status">
                <div class="battery-icon">
                  <div class="battery-level" id="battery-level" style="width: 0%"></div>
                  <div class="charging-indicator" id="charging-indicator"></div>
                </div>
                <span id="battery-text">Battery: Checking...</span>
              </div>
            </div>
          </footer>
        </div>
      `;
        }

        async initBatteryMonitoring() {
            try {
                if ("getBattery" in navigator) {
                    const battery = await navigator.getBattery();

                    this.updateBatteryStatus(battery);

                    battery.addEventListener("levelchange", () => this.updateBatteryStatus(battery));
                    battery.addEventListener("chargingchange", () => this.updateBatteryStatus(battery));

                    console.log("Battery monitoring initialized");
                } else {
                    console.warn("Battery Status API not supported");
                    this.setDefaultBatteryStatus();
                }
            } catch (error) {
                console.error("Error initializing battery monitoring:", error);
                this.setDefaultBatteryStatus();
            }
        }

        updateBatteryStatus(battery) {
            this.batteryStatus = {
                level: battery.level * 100,
                charging: battery.charging,
            };

            this.updateBatteryUI();
        }

        setDefaultBatteryStatus() {
            const batteryText = this.shadowRoot?.querySelector("#battery-text");
            if (batteryText) {
                batteryText.textContent = "Battery: Not available";
            }

            const batteryStatus = this.shadowRoot?.querySelector("#battery-status");
            if (batteryStatus) {
                batteryStatus.style.display = "none";
            }
        }

        updateBatteryUI() {
            const batteryLevel = this.shadowRoot?.querySelector("#battery-level");
            const batteryText = this.shadowRoot?.querySelector("#battery-text");
            const chargingIndicator = this.shadowRoot?.querySelector("#charging-indicator");

            if (!batteryLevel || !batteryText || !chargingIndicator) return;

            const level = Math.round(this.batteryStatus.level);
            batteryLevel.style.width = `${level}%`;

            if (level <= 20) {
                batteryLevel.classList.add("battery-low");
            } else {
                batteryLevel.classList.remove("battery-low");
            }

            if (this.batteryStatus.charging) {
                chargingIndicator.innerHTML = "⚡";
                batteryText.textContent = `Battery: ${level}%, Charging`;
            } else {
                chargingIndicator.innerHTML = "";
                batteryText.textContent = `Battery: ${level}%`;
            }
        }

        showInAppNotification(title, message, icon = "🔔") {
            const notification = this.shadowRoot.querySelector("#in-app-notification");
            const notificationTitle = notification.querySelector(".notification-title");
            const notificationMessage = notification.querySelector(".notification-message");
            const notificationIcon = notification.querySelector(".notification-icon");

            notificationTitle.textContent = title;
            notificationMessage.textContent = message;
            notificationIcon.textContent = icon;

            notification.classList.add("show");

            setTimeout(() => {
                this.hideInAppNotification();
            }, 5000);
        }

        hideInAppNotification() {
            const notification = this.shadowRoot.querySelector("#in-app-notification");
            notification.classList.remove("show");
        }

        async requestNotificationPermission() {
            try {
                const permStatus = await LocalNotifications.checkPermissions();

                if (permStatus.display !== "granted") {
                    await LocalNotifications.requestPermissions();
                }
            } catch (error) {
                console.error("Error requesting notification permission:", error);
            }
        }

        async showBirthdayNotification(daysUntil) {
            try {
                const notificationTitle = daysUntil === 0 ? "Happy Birthday Today! 🎂" : daysUntil === 1 ? "1 day until your birthday!" : `${daysUntil} days until your birthday!`;

                const notificationBody = daysUntil === 0 ? "Have a wonderful day!" : daysUntil <= 7 ? "Your special day is coming soon!" : "Mark your calendar!";

                // Show in-app notification
                const icon = daysUntil === 0 ? "🎂" : daysUntil <= 7 ? "🎉" : "🗓️";
                this.showInAppNotification(notificationTitle, notificationBody, icon);

                // Also send system notification
                await LocalNotifications.schedule({
                    notifications: [
                        {
                            title: notificationTitle,
                            body: notificationBody,
                            id: 1,
                            schedule: { at: new Date(Date.now() + 1000) },
                            sound: "default",
                            attachments: null,
                            actionTypeId: "",
                            extra: null,
                        },
                    ],
                });
            } catch (error) {
                console.error("Error showing notification:", error);
            }
        }

        async shareBirthdayCountdown(daysUntil, birthdateValue) {
            try {
                const [day, month] = birthdateValue.split("/").map(Number);

                const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                const monthName = monthNames[month - 1];

                let shareMessage = "";

                if (daysUntil === 0) {
                    shareMessage = `🎉 Today is my birthday! ${day} ${monthName}! 🎂`;
                } else if (daysUntil === 1) {
                    shareMessage = `🎈 Only 1 day until my birthday on ${day} ${monthName}! 🎈`;
                } else {
                    shareMessage = `🎂 Only ${daysUntil} days until my birthday on ${day} ${monthName}! 🎂`;
                }

                await Share.share({
                    title: "Birthday Countdown",
                    text: shareMessage,
                    dialogTitle: "Share your birthday countdown!",
                });

                console.log("Content shared successfully");
            } catch (error) {
                console.error("Error sharing content:", error);
            }
        }

        connectedCallback() {
            const self = this;
            const calculateBtn = self.shadowRoot.querySelector("#calculate-btn");
            const birthdateInput = self.shadowRoot.querySelector("#birthdate");
            const resultDiv = self.shadowRoot.querySelector("#result");
            const daysCount = self.shadowRoot.querySelector("#days-count");
            const birthdayMessage = self.shadowRoot.querySelector("#birthday-message");
            const resultContainer = self.shadowRoot.querySelector("#result-container");
            const notificationCheckbox = self.shadowRoot.querySelector("#enable-notification");
            const shareBtn = self.shadowRoot.querySelector("#share-btn");
            const notificationCloseBtn = self.shadowRoot.querySelector("#notification-close");

            birthdateInput.addEventListener("input", function (e) {
                let value = e.target.value;

                value = value.replace(/\D/g, "");

                if (value.length > 2) {
                    value = value.substring(0, 2) + "/" + value.substring(2);
                }

                e.target.value = value;
            });

            calculateBtn.addEventListener("click", () => {
                this.calculateDaysUntilBirthday();
            });

            birthdateInput.addEventListener("keyup", (e) => {
                if (e.key === "Enter") {
                    this.calculateDaysUntilBirthday();
                }
            });

            birthdateInput.addEventListener("focus", function () {
                this.parentNode.classList.add("input-focused");
            });

            birthdateInput.addEventListener("blur", function () {
                this.parentNode.classList.remove("input-focused");
            });

            shareBtn.addEventListener("click", () => {
                const daysUntil = parseInt(daysCount.textContent);
                const birthdateValue = birthdateInput.value;
                this.shareBirthdayCountdown(daysUntil, birthdateValue);
            });

            notificationCloseBtn.addEventListener("click", () => {
                this.hideInAppNotification();
            });
        }

        calculateDaysUntilBirthday() {
            const birthdateInput = this.shadowRoot.querySelector("#birthdate");
            const resultDiv = this.shadowRoot.querySelector("#result");
            const daysCount = this.shadowRoot.querySelector("#days-count");
            const birthdayMessage = this.shadowRoot.querySelector("#birthday-message");
            const resultContainer = this.shadowRoot.querySelector("#result-container");
            const notificationCheckbox = this.shadowRoot.querySelector("#enable-notification");
            const shareBtn = this.shadowRoot.querySelector("#share-btn");

            const birthdateValue = birthdateInput.value;

            const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])$/;
            if (!dateRegex.test(birthdateValue)) {
                alert("Please enter a valid date in DD/MM format (e.g., 15/06)");
                return;
            }

            const [day, month] = birthdateValue.split("/").map(Number);

            if (month === 2 && day > 29) {
                alert("February cannot have more than 29 days");
                return;
            }

            if ([4, 6, 9, 11].includes(month) && day > 30) {
                alert("This month cannot have more than 30 days");
                return;
            }

            const today = new Date();
            const testDate = document.getElementById("test-date-info");
            if (testDate) {
                testDate.textContent = "* Using today's date for calculations";
            }

            const nextBirthday = new Date(today.getFullYear(), month - 1, day);

            if (today > nextBirthday) {
                nextBirthday.setFullYear(today.getFullYear() + 1);
            }

            const diffTime = nextBirthday.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            daysCount.textContent = diffDays;

            if (diffDays === 0) {
                birthdayMessage.textContent = "Happy Birthday today! 🎉🎂";
                this.createConfetti();
            } else if (diffDays === 1) {
                birthdayMessage.textContent = "Your birthday is tomorrow! 🎈";
            } else if (diffDays <= 7) {
                birthdayMessage.textContent = "Almost there! Your birthday is coming soon! 🎉";
            } else if (diffDays <= 30) {
                birthdayMessage.textContent = "Not too long now! Get excited! 🎈";
            } else if (diffDays > 300) {
                birthdayMessage.textContent = "You just had your birthday! Next one is in a while. 🎁";
            } else {
                birthdayMessage.textContent = "Plan something special for your big day! 🎁";
            }

            resultDiv.classList.remove("hidden");
            resultDiv.classList.add("fade-in");

            shareBtn.disabled = false;

            console.log(`Today: ${today.toDateString()}`);
            console.log(`Birthday: ${day}/${month}`);
            console.log(`Next birthday: ${nextBirthday.toDateString()}`);
            console.log(`Days until next birthday: ${diffDays}`);

            if (notificationCheckbox && notificationCheckbox.checked) {
                this.showBirthdayNotification(diffDays);
            }
        }

        createConfetti() {
            const resultContainer = this.shadowRoot.querySelector("#result-container");

            for (let i = 0; i < 50; i++) {
                const confetti = document.createElement("div");
                confetti.classList.add("confetti");

                confetti.style.left = Math.random() * 100 + "%";
                confetti.style.backgroundColor = ["#FF4081", "#7E57C2", "#FFEB3B", "#4CAF50"][Math.floor(Math.random() * 4)];
                confetti.style.animation = `confetti-fall ${1 + Math.random() * 3}s ease-out forwards`;
                confetti.style.animationDelay = Math.random() * 5 + "s";

                resultContainer.appendChild(confetti);
            }
        }
    }
);
