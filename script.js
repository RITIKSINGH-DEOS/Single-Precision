function decimalToSinglePrecision(decimalNumber) {
    const sign = decimalNumber < 0 ? 1 : 0;
    let absNumber = Math.abs(decimalNumber);
    const integerPart = Math.floor(absNumber);
    let fractionalPart = absNumber - integerPart;

    const integerBinary = integerPart.toString(2);
    let fractionalBinary = '';
    while (fractionalPart > 0 && fractionalBinary.length < 23) {
        fractionalPart *= 2;
        if (fractionalPart >= 1) {
            fractionalBinary += '1';
            fractionalPart -= 1;
        } else {
            fractionalBinary += '0';
        }
    }

    const binary = `${integerBinary}.${fractionalBinary}`;
    let normalizedBinary, unbiasedExponent;
    if (integerPart !== 0) {
        const firstOneIndex = integerBinary.indexOf('1');
        normalizedBinary = binary.slice(firstOneIndex).replace('.', '');
        unbiasedExponent = integerBinary.length - 1;
    } else {
        const firstOneIndex = fractionalBinary.indexOf('1');
        normalizedBinary = fractionalBinary.slice(firstOneIndex + 1);
        unbiasedExponent = -(firstOneIndex + 1);
    }

    const mantissa = normalizedBinary.slice(1);
    const biasedExponent = unbiasedExponent + 127;
    const biasedExponentBits = biasedExponent.toString(2).padStart(8, '0');
    const paddedMantissa = mantissa.padEnd(23, '0');
    const singlePrecisionBinary = `${sign}${biasedExponentBits}${paddedMantissa}`;
    const singlePrecisionHex = parseInt(singlePrecisionBinary, 2).toString(16).toUpperCase().padStart(8, '0');

    return {
        decimal: decimalNumber,
        binaryRepresentation: binary,
        sign,
        unbiasedExponent,
        biasedExponent,
        biasedExponentBinary: biasedExponentBits,
        mantissa,
        paddedMantissa,
        singlePrecisionBinary,
        singlePrecisionHex
    };
}

function convertToBinary() {
    const input = document.getElementById('decimalInput').value;
    const errorMessage = document.getElementById('errorMessage');
    const decimalNumber = parseFloat(input);

    // Clear previous error message
    errorMessage.textContent = '';
    errorMessage.style.display = 'none';

    // Validate input
    if (isNaN(decimalNumber) || input.trim() === '') {
        errorMessage.textContent = 'Please provide a valid numeric value.';
        errorMessage.style.display = 'block';
        return;
    }

    const result = decimalToSinglePrecision(decimalNumber);
    displayResults(result);
}

function toggleSign() {
    const input = document.getElementById('decimalInput');
    const currentValue = input.value;

    if (currentValue.startsWith('-')) {
        input.value = currentValue.slice(1); // Remove the minus sign
    } else {
        input.value = `-${currentValue}`; // Add the minus sign
    }
}

function displayResults(result) {
    const carousel = document.getElementById('carousel');

    const cards = [
        { title: "Input Decimal", value: result.decimal },
        { title: "Binary Representation", value: result.binaryRepresentation },
        { title: "Sign Bit", value: result.sign },
        { title: "Unbiased Exponent", value: result.unbiasedExponent },
        { title: "Biased Exponent", value: result.biasedExponent },
        { title: "Biased Exponent (Binary)", value: result.biasedExponentBinary },
        { title: "Mantissa", value: result.mantissa },
        { title: "Single Precision (Binary)", value: result.singlePrecisionBinary },
        { title: "Single Precision (Hexadecimal)", value: result.singlePrecisionHex }
    ];

    // Clear existing cards
    carousel.innerHTML = '';

    // Add cards to the carousel
    cards.forEach((card) => {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        cardElement.innerHTML = `
            <p><strong>${card.title}:</strong></p>
            <button class="resultbtn" onclick="showResult(this, '${card.value}')">Show Result</button>
            <p class="result"></p>
        `;
        carousel.appendChild(cardElement);
    });

    // Enable/disable arrows
    updateArrows();
}

function showResult(button, result) {
    const resultElement = button.nextElementSibling;
    resultElement.innerText = result;
}

function scrollCarousel(direction) {
    const carousel = document.getElementById('carousel');
    const cardWidth = carousel.clientWidth;
    const currentScroll = carousel.scrollLeft;
    const newScroll = currentScroll + direction * cardWidth;

    carousel.scrollTo({
        left: newScroll,
        behavior: 'smooth'
    });

    // Enable/disable arrows after scrolling
    setTimeout(updateArrows, 300); // Wait for scroll to complete
}

function updateArrows() {
    const carousel = document.getElementById('carousel');
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');
    const cardWidth = carousel.clientWidth;
    const currentScroll = carousel.scrollLeft;

    prevButton.disabled = currentScroll === 0;
    nextButton.disabled = currentScroll >= carousel.scrollWidth - cardWidth;
}

function resetCarousel() {
    document.getElementById('decimalInput').value = '';
    document.getElementById('errorMessage').textContent = '';
    document.getElementById('errorMessage').style.display = 'none';
    document.getElementById('carousel').innerHTML = '';
    updateArrows();
}