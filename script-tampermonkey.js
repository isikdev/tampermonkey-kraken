// ==UserScript==
// @name         Автозаполнение фасовок и адресов для городов
// @namespace    http://tampermonkey.net/
// @version      6.1
// @description  Автоматическое добавление фасовок и адресов для городов на сайте kraken18.at с поэтапной задержкой и визуальным отслеживанием текущего элемента и прокруткой страницы к текущему элементу.
// @author       Alex
// @match        https://kraken18.at/cabinet/packages/instant/*
// @match        https://kraken18.at/cabinet/addresses/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const packagingData = {
        amount: "100.0",
        unit: "2", // г
        price: "1000.00",
        netCost: "500.00",
        payout: "100.00"
    };

    const addressData = {
        location: "0f0ce546-1948-4d01-828f-acb62dd506c3", // В черте города
        type: "6", // Магнит
        miner: "ccef353d-c09d-4a3b-b9c0-2d10d5792cf3", // senator9056
        description: "test"
    };

    const baseUrl = 'https://kraken18.at/cabinet/packages/instant/461e2158-716c-4aa7-b4ac-21b024ecf5b5/94d7f220-ed15-4962-b511-00023095a896/';
    let currentCityIndex = parseInt(localStorage.getItem('currentCityIndex')) || 0;

    function simulateClick(element) {
        const rect = element.getBoundingClientRect();
        const x = rect.left + (rect.width / 2);
        const y = rect.top + (rect.height / 2);

        const clickEvent = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true,
            clientX: x,
            clientY: y
        });

        element.dispatchEvent(clickEvent);
    }

    function scrollToElement(element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function highlightElement(element) {
        element.style.border = '2px solid red';
    }

    function log(message) {
        console.log(message);
    }

    function getRandomDelay(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    function countdown(seconds, callback) {
        log(`Ожидание: ${seconds} секунд...`);
        let counter = seconds;
        const interval = setInterval(() => {
            counter--;
            log(`Ожидание: ${counter} секунд...`);
            if (counter <= 0) {
                clearInterval(interval);
                callback();
            }
        }, 1000);
    }

    function saveCityToLocalStorage(cityName, type) {
        const now = new Date().getTime();
        const expiry = now + 3 * 24 * 60 * 60 * 1000; // 3 days in milliseconds
        const cityData = { cityName, expiry, type };
        localStorage.setItem(`city_${cityName}`, JSON.stringify(cityData));
    }

    function isCityInLocalStorage(cityName, type) {
        const cityData = JSON.parse(localStorage.getItem(`city_${cityName}`));
        if (cityData && cityData.type === type) {
            const now = new Date().getTime();
            if (now < cityData.expiry) {
                return true;
            } else {
                localStorage.removeItem(`city_${cityName}`);
            }
        }
        return false;
    }

    function addPackagingStepByStep(cityName) {
        const amountField = document.querySelector('input[name="amount"]');
        const unitField = document.querySelector('select[name="unit_id"]');
        const priceField = document.querySelector('input[name="price"]');
        const netCostField = document.querySelector('input[name="net_cost"]');
        const payoutField = document.querySelector('input[name="delivery_cost"]');
        const saveButton = document.querySelector('button[type="submit"]');

        if (amountField) {
            log("Заполнение количества фасовки");
            highlightElement(amountField);
            scrollToElement(amountField);
            countdown(getRandomDelay(1, 2), () => {
                amountField.value = packagingData.amount;
                if (unitField) {
                    log("Выбор единицы измерения");
                    highlightElement(unitField);
                    scrollToElement(unitField);
                    countdown(getRandomDelay(1, 2), () => {
                        unitField.value = packagingData.unit;
                        if (priceField) {
                            log("Заполнение цены");
                            highlightElement(priceField);
                            scrollToElement(priceField);
                            countdown(getRandomDelay(1, 2), () => {
                                priceField.value = packagingData.price;
                                if (netCostField) {
                                    log("Заполнение себестоимости");
                                    highlightElement(netCostField);
                                    scrollToElement(netCostField);
                                    countdown(getRandomDelay(1, 2), () => {
                                        netCostField.value = packagingData.netCost;
                                        if (payoutField) {
                                            log("Заполнение выплаты сотруднику");
                                            highlightElement(payoutField);
                                            scrollToElement(payoutField);
                                            countdown(getRandomDelay(1, 2), () => {
                                                payoutField.value = packagingData.payout;
                                                if (saveButton) {
                                                    log("Сохранение фасовки");
                                                    highlightElement(saveButton);
                                                    scrollToElement(saveButton);
                                                    countdown(getRandomDelay(1, 2), () => {
                                                        simulateClick(saveButton);
                                                        saveCityToLocalStorage(cityName, 'packaging');
                                                        countdown(getRandomDelay(1, 2), () => {
                                                            log("Возвращение на главную страницу");
                                                            window.location.href = baseUrl;
                                                        });
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        } else {
            log("Не удалось найти одно из полей для добавления фасовки.");
        }
    }

    function addAddressStepByStep(cityName) {
        const locationField = document.querySelector('#region_uuid-0');
        const subwayField = document.querySelector('#subway_uuid-0');
        const customLocationField = document.querySelector('#custom_location_uuid-0');
        const typeField = document.querySelector('#order_kind_id-0');
        const descriptionField = document.querySelector('#description-0');
        const saveButton = document.querySelector('button.submit');

        if (locationField) {
            log("Выбор Локации");
            highlightElement(locationField);
            scrollToElement(locationField);
            countdown(getRandomDelay(1, 2), () => {
                locationField.value = addressData.location;
                if (subwayField) {
                    log("Выбор Метро");
                    highlightElement(subwayField);
                    scrollToElement(subwayField);
                    countdown(getRandomDelay(1, 2), () => {
                        if (subwayField.options.length > 1) {
                            subwayField.value = subwayField.options[1].value;
                        } else {
                            subwayField.value = '';
                        }
                        if (customLocationField) {
                            log("Выбор Кастомной Локации");
                            highlightElement(customLocationField);
                            scrollToElement(customLocationField);
                            countdown(getRandomDelay(1, 2), () => {
                                if (customLocationField.options.length > 1) {
                                    customLocationField.value = customLocationField.options[1].value;
                                } else {
                                    customLocationField.value = '';
                                }
                                if (typeField) {
                                    log("Выбор Типа Клада");
                                    highlightElement(typeField);
                                    scrollToElement(typeField);
                                    countdown(getRandomDelay(1, 2), () => {
                                        typeField.value = addressData.type;
                                        if (descriptionField) {
                                            log("Заполнение Текста Клада");
                                            highlightElement(descriptionField);
                                            scrollToElement(descriptionField);
                                            countdown(getRandomDelay(1, 2), () => {
                                                descriptionField.value = addressData.description;
                                                if (saveButton) {
                                                    log("Сохранение Адреса");
                                                    highlightElement(saveButton);
                                                    scrollToElement(saveButton);
                                                    countdown(getRandomDelay(1, 2), () => {
                                                        log("Клик по кнопке Сохранить адрес");
                                                        simulateClick(saveButton);
                                                        saveCityToLocalStorage(cityName, 'address');
                                                        countdown(getRandomDelay(1, 2), () => {
                                                            log("Возвращение на главную страницу");
                                                            window.location.href = baseUrl;
                                                        });
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        } else {
            log("Не удалось найти одно из полей для добавления адреса.");
        }
    }

    function navigateToNextCity() {
        const cityContainers = document.querySelectorAll('.lk_preorder_table.lk_preorder_table_3');
        let cities = [];

        cityContainers.forEach(container => {
            const cityNameElement = container.querySelector('.lk_table_xl_title');
            const emptyRow = container.querySelector('.lk_table_item .empty-row');
            const packagingLink = container.querySelector('.lk_table_bottom a[href*="/edit?city="]');
            const addressLink = container.querySelector('.lk_table_btn a.text_link[href*="/addresses/"]:nth-child(2)');
            if (cityNameElement && emptyRow && packagingLink) {
                cities.push({
                    name: cityNameElement.innerText.trim(),
                    link: packagingLink,
                    hasPackaging: false
                });
            } else if (cityNameElement && addressLink) {
                cities.push({
                    name: cityNameElement.innerText.trim(),
                    link: addressLink,
                    hasPackaging: true
                });
            }
        });

        if (cities.length === 0) {
            log('Не найдено ни одного города.');
            return;
        }

        if (currentCityIndex < cities.length) {
            const city = cities[currentCityIndex];
            if (isCityInLocalStorage(city.name, 'address')) {
                log(`Город ${city.name} уже обработан. Переход к следующему городу.`);
                currentCityIndex++;
                localStorage.setItem('currentCityIndex', currentCityIndex);
                navigateToNextCity();
                return;
            }

            localStorage.setItem('currentCityIndex', currentCityIndex);
            localStorage.setItem('currentCityName', city.name);

            highlightElement(cityContainers[currentCityIndex]);
            scrollToElement(cityContainers[currentCityIndex]);
            countdown(getRandomDelay(1, 2), () => {
                highlightElement(city.link);
                if (city.hasPackaging) {
                    if (!isCityInLocalStorage(city.name, 'address')) {
                        log(`Переход к добавлению адресов для города: ${city.name}`);
                        simulateClick(city.link);
                    } else {
                        log(`Фасовка для города ${city.name} уже обработана. Переход к следующему городу.`);
                        currentCityIndex++;
                        localStorage.setItem('currentCityIndex', currentCityIndex);
                        navigateToNextCity();
                    }
                } else {
                    if (!isCityInLocalStorage(city.name, 'packaging')) {
                        log(`Переход к добавлению фасовок для города: ${city.name}`);
                        simulateClick(city.link);
                    } else {
                        log(`Фасовка для города ${city.name} уже добавлена. Переход к добавлению адресов.`);
                        window.location.href = baseUrl;
                    }
                }
            });
        } else {
            localStorage.removeItem('currentCityIndex');
            localStorage.removeItem('currentCityName');
            log('Все города обработаны!');
        }
    }

    function navigateToAddAddressPage() {
        const addAddressButton = document.querySelector('a.instant_btn[href*="/edit"]');
        if (addAddressButton) {
            highlightElement(addAddressButton);
            scrollToElement(addAddressButton);
            countdown(getRandomDelay(1, 2), () => {
                log("Клик по кнопке Добавить адрес");
                simulateClick(addAddressButton);
            });
        } else {
            log("Не удалось найти кнопку для добавления адреса.");
        }
    }

    if (window.location.href.includes('/edit?city=')) {
        // На странице добавления фасовки
        window.addEventListener('load', function() {
            const cityName = localStorage.getItem('currentCityName');
            countdown(getRandomDelay(1, 2), () => {
                addPackagingStepByStep(cityName);
            });
        });
    } else if (window.location.href.includes('/edit')) {
        // На странице добавления адреса
        window.addEventListener('load', function() {
            const cityName = localStorage.getItem('currentCityName');
            countdown(getRandomDelay(1, 2), () => {
                addAddressStepByStep(cityName);
            });
        });
    } else if (window.location.href.includes('/cabinet/addresses/')) {
        // На странице списка адресов
        window.addEventListener('load', function() {
            countdown(getRandomDelay(1, 2), () => {
                navigateToAddAddressPage();
            });
        });
    } else {
        // На исходной странице
        window.addEventListener('load', function() {
            countdown(getRandomDelay(1, 2), () => {
                navigateToNextCity();
            });
        });
    }
})();
