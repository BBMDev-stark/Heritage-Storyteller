const defaultConfig = {
    main_title: "Heritage Storyteller",
    subtitle: "Số hóa câu chuyện làng nghề Việt Nam",
    input_label: "Nhập tên sản phẩm thủ công:",
    button_text: "Khám phá câu chuyện",
    footer_text: "Bảo tồn di sản - Kết nối thế hệ",
    background_color: "#2c1810",
    accent_color: "#daa520",
    text_color: "#fef9f3",
    button_color: "#daa520",
    font_family: "Playfair Display",
    font_size: 16
};

async function onConfigChange(config) {
    const customFont = config.font_family || defaultConfig.font_family;
    const titleFont = `${customFont}, serif`;
    const baseSize = config.font_size || defaultConfig.font_size;

    document.getElementById('mainTitle').textContent = config.main_title || defaultConfig.main_title;
    document.getElementById('mainTitle').style.fontFamily = titleFont;
    document.getElementById('mainTitle').style.fontSize = `${baseSize * 4}px`;

    document.getElementById('subtitle').textContent = config.subtitle || defaultConfig.subtitle;
    document.getElementById('subtitle').style.fontSize = `${baseSize * 1.375}px`;

    document.getElementById('inputLabel').textContent = config.input_label || defaultConfig.input_label;
    document.getElementById('inputLabel').style.fontSize = `${baseSize * 1.125}px`;

    document.getElementById('buttonText').textContent = config.button_text || defaultConfig.button_text;
    document.querySelector('.discover-button').style.fontSize = `${baseSize * 1.25}px`;

    document.getElementById('footerText').textContent = config.footer_text || defaultConfig.footer_text;
    document.getElementById('footerText').style.fontSize = `${baseSize * 1.125}px`;
}

if (window.elementSdk) {
    window.elementSdk.init({
        defaultConfig,
        onConfigChange,
        mapToCapabilities: (config) => ({
            recolorables: [
                {
                    get: () => config.background_color || defaultConfig.background_color,
                    set: (value) => {
                        config.background_color = value;
                        window.elementSdk.setConfig({ background_color: value });
                    }
                },
                {
                    get: () => config.accent_color || defaultConfig.accent_color,
                    set: (value) => {
                        config.accent_color = value;
                        window.elementSdk.setConfig({ accent_color: value });
                    }
                },
                {
                    get: () => config.text_color || defaultConfig.text_color,
                    set: (value) => {
                        config.text_color = value;
                        window.elementSdk.setConfig({ text_color: value });
                    }
                },
                {
                    get: () => config.button_color || defaultConfig.button_color,
                    set: (value) => {
                        config.button_color = value;
                        window.elementSdk.setConfig({ button_color: value });
                    }
                }
            ],
            borderables: [],
            fontEditable: {
                get: () => config.font_family || defaultConfig.font_family,
                set: (value) => {
                    config.font_family = value;
                    window.elementSdk.setConfig({ font_family: value });
                }
            },
            fontSizeable: {
                get: () => config.font_size || defaultConfig.font_size,
                set: (value) => {
                    config.font_size = value;
                    window.elementSdk.setConfig({ font_size: value });
                }
            }
        }),
        mapToEditPanelValues: (config) => new Map([
            ["main_title", config.main_title || defaultConfig.main_title],
            ["subtitle", config.subtitle || defaultConfig.subtitle],
            ["input_label", config.input_label || defaultConfig.input_label],
            ["button_text", config.button_text || defaultConfig.button_text],
            ["footer_text", config.footer_text || defaultConfig.footer_text]
        ])
    });
}

const craftInput = document.getElementById('craftInput');
const discoverButton = document.getElementById('discoverButton');
const buttonText = document.getElementById('buttonText');
const loadingSpinner = document.getElementById('loadingSpinner');
const toastMessage = document.getElementById('toastMessage');
const exampleTags = document.querySelectorAll('.example-tag');
const bookOverlay = document.getElementById('bookOverlay');
const book3d = document.getElementById('book3d');
const bookCover = document.getElementById('bookCover');
const coverTitle = document.getElementById('coverTitle');
const closeBook = document.getElementById('closeBook');
const bookControls = document.getElementById('bookControls');
const backToTop = document.getElementById('backToTop');
const continueExplore = document.getElementById('continueExplore');
const bookTitle = document.getElementById('bookTitle');
const storyContent1 = document.getElementById('storyContent1');
const storyContent2 = document.getElementById('storyContent2');
const storyContent3 = document.getElementById('storyContent3');
const craftImage = document.getElementById('craftImage');
const flippablePage1 = document.getElementById('flippablePage1');
const flippablePage2 = document.getElementById('flippablePage2');
const flippablePage3 = document.getElementById('flippablePage3');

// Toggle page flip on click for all 3 pages
flippablePage1.addEventListener('click', () => {
    flippablePage1.classList.toggle('flipped');
});

flippablePage2.addEventListener('click', () => {
    flippablePage2.classList.toggle('flipped');
});

flippablePage3.addEventListener('click', () => {
    flippablePage3.classList.toggle('flipped');
});

function showToast(message) {
    toastMessage.textContent = message;
    toastMessage.classList.add('show');
    setTimeout(() => {
        toastMessage.classList.remove('show');
    }, 3000);
}

exampleTags.forEach(tag => {
    tag.addEventListener('click', () => {
        craftInput.value = tag.getAttribute('data-craft');
        craftInput.focus();
    });
});

craftInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        discoverButton.click();
    }
});

async function generateImage(craftName) {
    const encodedQuery = encodeURIComponent(`${craftName} Vietnam traditional craft handicraft`);
    return `https://source.unsplash.com/800x600/?${encodedQuery}`;
}

function animateTextAppear() {
    const allParagraphs = [
        ...storyContent1.querySelectorAll('p'),
        ...storyContent2.querySelectorAll('p'),
        ...storyContent3.querySelectorAll('p')
    ];
    allParagraphs.forEach((p, index) => {
        setTimeout(() => {
            p.classList.add('appear');
        }, index * 120);  // Giảm delay xuống 120ms → nhanh hơn nhưng vẫn mượt
    });
}

closeBook.addEventListener('click', () => {
    book3d.classList.remove('zoom-in', 'open');
    bookControls.classList.remove('show');
    setTimeout(() => {
        bookOverlay.classList.remove('show');
        document.body.style.overflow = 'auto';
    }, 500);
});

backToTop.addEventListener('click', () => {
    document.querySelectorAll('.page-front').forEach(page => {
        page.scrollTop = 0;
    });
});

continueExplore.addEventListener('click', () => {
    book3d.classList.remove('zoom-in', 'open');
    bookControls.classList.remove('show');
    setTimeout(() => {
        bookOverlay.classList.remove('show');
        document.body.style.overflow = 'auto';
        craftInput.value = '';
        craftInput.focus();
    }, 500);
});

// === HÀM GỌI BACKEND GOOGLE APPS SCRIPT (an toàn, không lộ key) ===
async function generateStory(craftName) {
    const prompt = `Hãy viết một câu chuyện lịch sử hấp dẫn và chi tiết về "${craftName}" - một sản phẩm thủ công truyền thống của Việt Nam.

Câu chuyện cần bao gồm:
1. Nguồn gốc và lịch sử hình thành (khi nào, ở đâu, bối cảnh ra đời)
2. Quy trình chế tác truyền thống và những kỹ thuật đặc biệt
3. Ý nghĩa văn hóa và tinh thần trong đời sống người Việt
4. Giá trị nghệ thuật và thẩm mỹ độc đáo
5. Tình trạng bảo tồn hiện nay và tầm quan trọng đối với du lịch văn hóa

Hãy viết bằng giọng văn truyện sinh động, dễ hiểu, thu hút. Độ dài khoảng 400-500 từ. Chia thành 4-5 đoạn văn rõ ràng.`;

    // Thay bằng URL Apps Script thực tế của bạn
    const BACKEND_URL = "https://script.google.com/macros/s/AKfycbxRSCQ_gimWAp2PHgQW0LE7FE3z-2V_dWuUukpXMuxTOkOzDaet6wTnLenovre4-oq5ug/exec";

    const url = `${BACKEND_URL}?prompt=${encodeURIComponent(prompt)}`;

    const response = await fetch(url, {
        method: 'GET',
        mode: 'cors'
    });

    if (!response.ok) {
        throw new Error(`Lỗi kết nối backend: ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
        console.error('Backend error:', data);
        throw new Error(data.error || 'Lỗi từ server');
    }

    if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
        throw new Error('Phản hồi từ Gemini không hợp lệ');
    }

    return data.candidates[0].content.parts[0].text;
}

discoverButton.addEventListener('click', async () => {
    const craftName = craftInput.value.trim();

    if (!craftName) {
        showToast('Vui lòng nhập tên sản phẩm thủ công!');
        return;
    }

    discoverButton.disabled = true;
    buttonText.style.display = 'none';
    loadingSpinner.style.display = 'block';

    try {
        const [story, imageUrl] = await Promise.all([
            generateStory(craftName),
            generateImage(craftName)
        ]);

        coverTitle.textContent = craftName;
        bookTitle.textContent = craftName;

        const paragraphs = story.split('\n\n').filter(p => p.trim() !== '');

        // Chia đều nội dung thành 3 trang
        const totalParagraphs = paragraphs.length;
        const paragraphsPerPage = Math.ceil(totalParagraphs / 3);

        const page1Content = paragraphs.slice(0, paragraphsPerPage);
        const page2Content = paragraphs.slice(paragraphsPerPage, paragraphsPerPage * 2);
        const page3Content = paragraphs.slice(paragraphsPerPage * 2);

        storyContent1.innerHTML = page1Content.map(p => `<p>${p.trim()}</p>`).join('');
        storyContent2.innerHTML = page2Content.map(p => `<p>${p.trim()}</p>`).join('');
        storyContent3.innerHTML = page3Content.map(p => `<p>${p.trim()}</p>`).join('');

        craftImage.src = imageUrl;
        craftImage.alt = craftName;

        craftImage.onerror = function() {
            this.src = '';
            this.style.display = 'none';
        };

        document.body.style.overflow = 'hidden';
        bookOverlay.classList.add('show');

        // Animation nhanh hơn: zoom ngay → mở sách → hiện text nhanh
        setTimeout(() => {
            book3d.classList.add('zoom-in');
        }, 100);

        setTimeout(() => {
            book3d.classList.add('open');
        }, 1200);

        setTimeout(() => {
            animateTextAppear();
            bookControls.classList.add('show');
        }, 2200);  // Tổng chỉ ~2.2s → nội dung hiện nhanh hơn nhiều

    } catch (error) {
        console.error('Error:', error);
        showToast('Đã xảy ra lỗi khi tạo câu chuyện. Vui lòng thử lại!');
    } finally {
        discoverButton.disabled = false;
        buttonText.style.display = 'inline';
        loadingSpinner.style.display = 'none';
    }
});

onConfigChange(defaultConfig);