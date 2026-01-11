const defaultConfig = {
      site_name: 'VietCraft Heritage',
      promo_text: 'MIỄN PHÍ VẬN CHUYỂN đơn hàng từ 500K • ĐỔI TRẢ MIỄN PHÍ 30 NGÀY'
    };

    let currentPage = 1;

    function changePage(pageNum) {
      currentPage = pageNum;
      
      document.querySelectorAll('.page-nav-btn').forEach(btn => {
        btn.classList.remove('active');
        if (parseInt(btn.dataset.page) === pageNum) {
          btn.classList.add('active');
        }
      });
      
      const sections = ['categories-section', 'products-section', 'collection-section', 'stories-section'];
      sections.forEach(id => {
        const section = document.getElementById(id);
        if (section) section.classList.add('hidden');
      });
      
      if (pageNum === 1) {
        document.getElementById('categories-section').classList.remove('hidden');
        document.getElementById('products-section').classList.remove('hidden');
      } else if (pageNum === 2) {
        document.getElementById('collection-section').classList.remove('hidden');
        renderCollection();
      } else if (pageNum === 3) {
        document.getElementById('stories-section').classList.remove('hidden');
        renderStories();
      }
      
      const appElement = document.getElementById('app');
      if (appElement) {
        appElement.scrollTop = 0;
      }
    }

    let searchQuery = '';

    function performSearch() {
      const input = document.getElementById('search-input');
      searchQuery = input.value.trim().toLowerCase();
      currentProductPage = 1;
      applyFilters();
    }

    // ============================================
    // HƯỚNG DẪN THAY ĐỔI HÌNH ẢNH SẢN PHẨM
    // ============================================
    // 
    // Để thay đổi hình ảnh cho từng sản phẩm:
    // 1. Tìm tên sản phẩm bên dưới (ví dụ: 'non-la', 'ao-dai')
    // 2. Thay URL hình ảnh bằng link hình ảnh của bạn
    // 3. Hình ảnh phải là link https:// (ví dụ từ Unsplash, Imgur, hoặc server của bạn)
    //
    // VÍ DỤ:
    // 'non-la': 'https://example.com/hinh-non-la-cua-toi.jpg',
    // 
    // MỖI SẢN PHẨM TƯƠNG ỨNG VỚI 1 HÌNH ẢNH:
    // ============================================

    const productImages = {
      // 1. NÓN LÁ HUẾ - Thay link này để đổi hình nón lá
      'non-la': 'https://file.qdnd.vn/data/images/4/2017/03/12/tvtuongvy/dsc_4358.jpg?w=500',
      
      // 2. ÁO DÀI - Thay link này để đổi hình áo dài
      'ao-dai': 'https://aodainini.vn/wp-content/uploads/2024/05/z5380479199205_247cb79af5ecd9fae69f7fba7281eb12.jpg',
      
      // 3. LỤA VẠN PHÚC - Thay link này để đổi hình lụa
      'lua-van-phuc': 'https://mtcs.1cdn.vn/2025/01/23/lua.jpg',
      
      // 4. TRỐNG ĐỒNG - Thay link này để đổi hình trống đồng
      'trong-dong': 'https://ducphatgold.com/wp-content/uploads/2025/04/y-nghia-cac-hoa-tiet-tren-mat-trong-dong-dong-son-7.jpg',
      
      // 5. TRANH ĐÔNG HỒ - Thay link này để đổi hình tranh
      'tranh-dong-ho': 'https://bizweb.dktcdn.net/100/438/304/files/tranh-dong-ho-khi-don-xuan-khung30x40.jpg?v=1690822434263',
      
      // 6. ĐÈN LỒNG HỘI AN - Thay link này để đổi hình đèn lồng
      'den-long': 'https://hoiancreativecity.com/uploads/images/l%E1%BB%93ng%20%C4%91%C3%A8n%20ph%E1%BB%91.png',
      
      // 7. ĐÀN BẦU - Thay link này để đổi hình đàn bầu
      'dan-bau': 'https://nhaccudantoc.com.vn/wp-content/uploads/2021/11/dan-bau-den-kham-ky.jpg',
      
      // 8. GỐM BÁT TRÀNG - Thay link này để đổi hình gốm
      'gom-bat-trang': 'https://imgcdn.tapchicongthuong.vn/thumb/w_1000/tcct-media/20/8/11/bat_trang_1.jpg',
      
      // 9. TÚI THỔ CẨM - Thay link này để đổi hình túi thổ cẩm
      'tui-tho-cam': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReKwY24O_xrJc7Kik_5_5fAjD1W2WnxRkSRw&s',
      
      // 10. CHẠM KHẮC GỖ - Thay link này để đổi hình chạm khắc
      'cham-khac-go': 'https://tl.cdnchinhphu.vn/344445545208135680/2022/8/4/img20220804102634-16595893660741733357411.jpg',
      
      // 11. THÊU TAY - Thay link này để đổi hình thêu
      'theu-tay': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRY0Gjnhx3Li0Ie0-39WDg8TA_vqfgd1FESvQ&s',
      
      // 12. SƠN MÀI - Thay link này để đổi hình sơn mài
      'son-mai': 'https://canocxacu.com/upload/son-mai-la-gi2-04-12-2017-13-01-06.jpg',
      
      // 13. ĐÀN NGUYỆT - Thay link này để đổi hình đàn nguyệt
      'dan-nguyet': 'https://nhaccuphongvan.vn/dan-nguyet-go-mun-den-cao-cap/z3320000255349_0b762dd46c9726fb3074360ab8a52736/',
      
      // 14. KHĂN RẰNG NAM BỘ - Thay link này để đổi hình khăn rằn
      'khan-ran': 'https://khankm0.com/media/uploads/KH%C4%82N%20R%E1%BA%B0N%202023/khan-ran-ri-ben-tre%20(1).jpg',
      
      // 15. GUỐC MỘC - Thay link này để đổi hình guốc mộc
      'guoc-moc': 'https://product.hstatic.net/1000360703/product/guoc_5f_b184__4__d887dd5118724ad681d2fcb83723b9c9_master.jpg',
      
      // 16. MÀNH TRE - Thay link này để đổi hình mành tre
      'manh-tre': 'https://bizweb.dktcdn.net/100/424/988/products/manh-tre-vang-ff64953a-4dab-45a3-aab9-a17ab9f9f214.jpg?v=1760441266947'
    };

    function formatPrice(price) {
      return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
    }

    function renderStars(rating) {
      const fullStars = Math.floor(rating);
      const hasHalf = rating % 1 >= 0.5;
      let stars = '';
      for (let i = 0; i < fullStars; i++) {
        stars += '<svg class="w-3 h-3 rating-star fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>';
      }
      if (hasHalf) {
        stars += '<svg class="w-3 h-3 rating-star fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" opacity="0.5"/></svg>';
      }
      return stars;
    }

    // Tạo 72 sản phẩm với hình ảnh và tên khớp nhau
    const products = [];
    const badges = ['Bán chạy', 'Premium', 'Di sản', 'Hot', 'Độc đáo', 'Thủ công', 'Cao cấp', '-20%', 'Mới', 'Phổ biến'];
    const badgeColors = ['bg-red-500', 'bg-amber-500', 'bg-green-500', 'bg-orange-500', 'bg-purple-500', 'bg-teal-500', 'bg-blue-500', 'bg-pink-500', 'bg-indigo-500', 'bg-cyan-500'];
    
    const productList = [
      { name: 'Nón Lá Huế Truyền Thống', image: 'non-la', category: 'accessories' },
      { name: 'Áo Dài Lụa Hà Nội', image: 'ao-dai', category: 'clothing' },
      { name: 'Lụa Tơ Tằm Vạn Phúc', image: 'lua-van-phuc', category: 'clothing' },
      { name: 'Trống Đồng Ngọc Lũ', image: 'trong-dong', category: 'decor' },
      { name: 'Tranh Đông Hồ Bắc Ninh', image: 'tranh-dong-ho', category: 'art' },
      { name: 'Đèn Lồng Hội An', image: 'den-long', category: 'decor' },
      { name: 'Đàn Bầu Truyền Thống', image: 'dan-bau', category: 'instrument' },
      { name: 'Gốm Sứ Bát Tràng', image: 'gom-bat-trang', category: 'decor' },
      { name: 'Túi Thổ Cẩm Tây Nguyên', image: 'tui-tho-cam', category: 'accessories' },
      { name: 'Chạm Khắc Gỗ Mỹ Nghệ', image: 'cham-khac-go', category: 'art' },
      { name: 'Thêu Tay Xứ Huế', image: 'theu-tay', category: 'art' },
      { name: 'Tranh Sơn Mài Hà Nội', image: 'son-mai', category: 'art' },
      { name: 'Đàn Nguyệt Cổ Truyền', image: 'dan-nguyet', category: 'instrument' },
      { name: 'Khăn Rằn Nam Bộ', image: 'khan-ran', category: 'accessories' },
      { name: 'Guốc Mộc Thủ Công', image: 'guoc-moc', category: 'accessories' },
      { name: 'Mành Tre Đan Tay', image: 'manh-tre', category: 'decor' }
    ];

    for (let i = 0; i < 72; i++) {
      const product = productList[i % productList.length];
      const variant = Math.floor(i / productList.length) + 1;
      const basePrice = Math.floor(Math.random() * 3000000) + 100000;
      const discount = 0.7 + Math.random() * 0.25;
      
      products.push({
        id: i + 1,
        name: variant > 1 ? `${product.name} Phiên Bản ${variant}` : product.name,
        price: Math.floor(basePrice * discount),
        originalPrice: basePrice,
        category: product.category,
        rating: 4.3 + Math.random() * 0.7,
        reviews: Math.floor(Math.random() * 3000) + 100,
        sold: Math.floor(Math.random() * 8000) + 100,
        image: product.image,
        badge: badges[Math.floor(Math.random() * badges.length)],
        badgeColor: badgeColors[Math.floor(Math.random() * badgeColors.length)],
        history: {
          story: `Câu chuyện về ${product.name}\n\nNgày xưa, vào một buổi sớm mai trên vùng đất Việt Nam, khi mặt trời vừa ló dạng sau những ngọn núi xa xa, có một nghệ nhân tài ba ngồi dưới gốc cây đa cổ thụ. Ông nhìn ra cánh đồng lúa chín vàng, nghe tiếng chim hót véo von, và trong lòng nảy sinh một ý tưởng tuyệt vời.\n\nÔng nghĩ rằng: "Tại sao ta không tạo ra một món đồ vừa đẹp mắt, vừa hữu ích, để con cháu mai sau có thể nhớ về văn hóa và truyền thống của tổ tiên?"\n\nVà thế là, ông bắt tay vào công việc. Từng ngày, từng tháng trôi qua, ông miệt mài với những vật liệu đơn giản nhưng chứa đựng cả tâm hồn: tre, gỗ, lụa, đất sét... Mỗi đường nét, mỗi họa tiết đều được khắc họa tỉ mỉ, như thể ông đang kể lại câu chuyện về quê hương, về đất nước, về những con người lam lũ nhưng luôn kiên cường.\n\nKhi sản phẩm hoàn thành, cả làng đều tập trung lại để chiêm ngưỡng. Họ thán phục trước sự tinh xảo, trước vẻ đẹp thuần khiết mang đậm bản sắc dân tộc. Từ đó, nghề thủ công này được truyền từ thế hệ này sang thế hệ khác, trở thành niềm tự hào của cả vùng đất.\n\nNgười ta kể rằng, mỗi khi cầm trên tay món đồ này, bạn không chỉ sở hữu một sản phẩm, mà còn nắm giữ cả một phần lịch sử, một phần văn hóa ngàn năm của dân tộc Việt Nam. Đó là tình yêu quê hương, là sự cần cù, là nét đẹp truyền thống mà tổ tiên ta đã gửi gắm qua bao thế hệ.\n\nVà câu chuyện này, vẫn tiếp tục được lưu truyền cho đến ngày hôm nay...`
        }
      });
    }

    let currentCategory = 'all';
    let currentPriceRange = 'all';
    let currentSort = 'popular';
    let currentProductPage = 1;
    const productsPerPage = 24;
    let filteredProducts = [];
    let cart = [];
    let wishlist = [];
    let compareList = [];
    let recentlyViewed = [];

    function updateCompareUI() {
      const count = compareList.length;
      const compareBtn = document.getElementById('compare-btn');
      const compareCount = document.getElementById('compare-count');
      
      if (count > 0) {
        compareCount.textContent = count;
        compareCount.classList.remove('hidden');
      } else {
        compareCount.classList.add('hidden');
      }
    }

    function toggleCompare(productId) {
      const index = compareList.findIndex(id => id === productId);
      if (index > -1) {
        compareList.splice(index, 1);
        showToast('Đã xóa khỏi danh sách so sánh', 'info');
      } else {
        if (compareList.length >= 4) {
          showToast('Chỉ có thể so sánh tối đa 4 sản phẩm', 'error');
          return;
        }
        compareList.push(productId);
        showToast('Đã thêm vào danh sách so sánh', 'success');
      }
      updateCompareUI();
    }

    function openCompare() {
      if (compareList.length < 2) {
        showToast('Vui lòng chọn ít nhất 2 sản phẩm để so sánh', 'error');
        return;
      }
      
      const compareProducts = products.filter(p => compareList.includes(p.id));
      const modal = document.getElementById('compare-modal');
      const content = document.getElementById('compare-content');
      
      content.innerHTML = `
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-gray-900">So sánh sản phẩm (${compareProducts.length})</h2>
            <button onclick="closeCompare()" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b-2">
                  <th class="text-left py-4 px-3 font-semibold text-gray-700 sticky left-0 bg-white z-10">Thông tin</th>
                  ${compareProducts.map(p => `
                    <th class="py-4 px-3 min-w-[200px]">
                      <div class="flex flex-col items-center gap-3">
                        <div class="w-24 h-24 bg-gray-50 rounded-lg overflow-hidden">
                          <img src="${productImages[p.image]}" alt="${p.name}" class="w-full h-full object-cover" onerror="this.src=''; this.alt='Ảnh không tải được';">
                        </div>
                        <button onclick="toggleCompare(${p.id}); openCompare();" class="text-red-500 text-xs hover:underline">Xóa</button>
                      </div>
                    </th>
                  `).join('')}
                </tr>
              </thead>
              <tbody class="divide-y">
                <tr>
                  <td class="py-4 px-3 font-medium text-gray-700 sticky left-0 bg-white">Tên sản phẩm</td>
                  ${compareProducts.map(p => `<td class="py-4 px-3 text-center"><span class="font-medium text-gray-900">${p.name}</span></td>`).join('')}
                </tr>
                <tr class="bg-gray-50">
                  <td class="py-4 px-3 font-medium text-gray-700 sticky left-0 bg-gray-50">Giá</td>
                  ${compareProducts.map(p => `<td class="py-4 px-3 text-center"><span class="text-xl font-bold text-red-600">${formatPrice(p.price)}</span></td>`).join('')}
                </tr>
                <tr>
                  <td class="py-4 px-3 font-medium text-gray-700 sticky left-0 bg-white">Giá gốc</td>
                  ${compareProducts.map(p => `<td class="py-4 px-3 text-center"><span class="text-gray-400 line-through">${formatPrice(p.originalPrice)}</span></td>`).join('')}
                </tr>
                <tr class="bg-gray-50">
                  <td class="py-4 px-3 font-medium text-gray-700 sticky left-0 bg-gray-50">Đánh giá</td>
                  ${compareProducts.map(p => `
                    <td class="py-4 px-3">
                      <div class="flex flex-col items-center gap-1">
                        <div class="flex">${renderStars(p.rating)}</div>
                        <span class="text-sm text-gray-600">${p.rating.toFixed(1)}/5</span>
                      </div>
                    </td>
                  `).join('')}
                </tr>
                <tr>
                  <td class="py-4 px-3 font-medium text-gray-700 sticky left-0 bg-white">Lượt đánh giá</td>
                  ${compareProducts.map(p => `<td class="py-4 px-3 text-center"><span class="text-gray-600">${p.reviews.toLocaleString()}</span></td>`).join('')}
                </tr>
                <tr class="bg-gray-50">
                  <td class="py-4 px-3 font-medium text-gray-700 sticky left-0 bg-gray-50">Đã bán</td>
                  ${compareProducts.map(p => `<td class="py-4 px-3 text-center"><span class="text-gray-600">${p.sold.toLocaleString()}</span></td>`).join('')}
                </tr>
                <tr>
                  <td class="py-4 px-3 font-medium text-gray-700 sticky left-0 bg-white">Danh mục</td>
                  ${compareProducts.map(p => `<td class="py-4 px-3 text-center"><span class="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">${getCategoryName(p.category)}</span></td>`).join('')}
                </tr>
                <tr class="bg-gray-50">
                  <td class="py-4 px-3 font-medium text-gray-700 sticky left-0 bg-gray-50">Thao tác</td>
                  ${compareProducts.map(p => `
                    <td class="py-4 px-3">
                      <div class="flex flex-col gap-2">
                        <button onclick="closeCompare(); openModal(${p.id});" class="btn-primary text-white py-2 px-4 rounded-lg text-sm font-medium">Xem chi tiết</button>
                        <button onclick="closeCompare(); addToCart(${p.id}, 1);" class="btn-secondary border-2 border-red-500 text-red-500 py-2 px-4 rounded-lg text-sm font-medium">Thêm giỏ hàng</button>
                      </div>
                    </td>
                  `).join('')}
                </tr>
              </tbody>
            </table>
          </div>
          
          <div class="mt-6 text-center">
            <button onclick="closeCompare()" class="btn-primary text-white py-3 px-8 rounded-xl font-semibold">Đóng</button>
          </div>
        </div>
      `;
      
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }

    function closeCompare() {
      document.getElementById('compare-modal').classList.add('hidden');
      document.body.style.overflow = '';
    }

    function getCategoryName(category) {
      const names = {
        'clothing': 'Trang phục',
        'accessories': 'Phụ kiện',
        'decor': 'Trang trí',
        'art': 'Nghệ thuật',
        'instrument': 'Nhạc cụ'
      };
      return names[category] || category;
    }

    function addToRecentlyViewed(productId) {
      recentlyViewed = recentlyViewed.filter(id => id !== productId);
      recentlyViewed.unshift(productId);
      if (recentlyViewed.length > 10) {
        recentlyViewed = recentlyViewed.slice(0, 10);
      }
      localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
    }

    function loadRecentlyViewed() {
      const saved = localStorage.getItem('recentlyViewed');
      if (saved) {
        recentlyViewed = JSON.parse(saved);
      }
    }

    function updateWishlistUI() {
      const count = wishlist.length;
      const countElement = document.getElementById('wishlist-count');
      const icon = document.getElementById('wishlist-icon');
      
      if (count > 0) {
        countElement.textContent = count;
        countElement.classList.remove('hidden');
        icon.setAttribute('fill', 'currentColor');
      } else {
        countElement.classList.add('hidden');
        icon.setAttribute('fill', 'none');
      }
    }

    function toggleWishlist() {
      showToast('Chức năng yêu thích đang được phát triển', 'info');
    }

    function startCountdown() {
      let hours = 2;
      let minutes = 34;
      let seconds = 56;
      
      setInterval(() => {
        seconds--;
        if (seconds < 0) {
          seconds = 59;
          minutes--;
          if (minutes < 0) {
            minutes = 59;
            hours--;
            if (hours < 0) {
              hours = 2;
              minutes = 34;
              seconds = 56;
            }
          }
        }
        
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
      }, 1000);
    }

    function renderProducts(products = []) {
      filteredProducts = products;
      const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
      const startIndex = (currentProductPage - 1) * productsPerPage;
      const endIndex = startIndex + productsPerPage;
      const productsToShow = filteredProducts.slice(startIndex, endIndex);
      
      const grid = document.getElementById('products-grid');
      const countElement = document.getElementById('product-count');
      
      if (countElement) {
        countElement.textContent = `(${filteredProducts.length} sản phẩm)`;
      }
      
      grid.innerHTML = productsToShow.map(product => `
        <div class="product-card bg-white rounded-xl overflow-hidden cursor-pointer shadow-sm border border-gray-100 group">
          <div class="relative aspect-square overflow-hidden bg-gray-50" onclick="openModal(${product.id})">
            <img src="${productImages[product.image]}" alt="${product.name}" class="product-image w-full h-full object-cover" onerror="this.src=''; this.alt='Ảnh không tải được'; this.style.display='none';">
            <span class="absolute top-2 left-2 ${product.badgeColor} text-white text-xs font-semibold px-2 py-1 rounded-md">
              ${product.badge}
            </span>
            <button onclick="event.stopPropagation(); toggleCompare(${product.id})" 
                    class="absolute top-2 right-2 w-8 h-8 ${compareList.includes(product.id) ? 'bg-purple-500 text-white' : 'bg-white/90 text-gray-600 hover:bg-purple-500 hover:text-white'} rounded-lg flex items-center justify-center transition-all shadow-md"
                    title="So sánh sản phẩm">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
            </button>
          </div>
          <div class="p-3 md:p-4" onclick="openModal(${product.id})">
            <h3 class="font-medium text-gray-900 text-sm md:text-base line-clamp-2 mb-2 min-h-[2.5rem]">${product.name}</h3>
            <div class="flex items-center gap-1 mb-2">
              <div class="flex">${renderStars(product.rating)}</div>
              <span class="text-xs text-gray-500">(${product.reviews.toLocaleString()})</span>
            </div>
            <div class="flex items-baseline gap-2 mb-2">
              <span class="text-lg md:text-xl font-bold text-red-600">${formatPrice(product.price)}</span>
              <span class="text-xs text-gray-400 line-through">${formatPrice(product.originalPrice)}</span>
            </div>
            <div class="flex items-center justify-between text-xs text-gray-500">
              <span>Đã bán ${product.sold >= 1000 ? (product.sold / 1000).toFixed(1) + 'k' : product.sold}</span>
              <span class="flex items-center gap-1">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                </svg>
                Việt Nam
              </span>
            </div>
          </div>
        </div>
      `).join('');
      
      renderPagination(totalPages);
    }

    function renderPagination(totalPages) {
      const pagination = document.getElementById('pagination');
      if (!pagination || totalPages <= 1) {
        pagination.innerHTML = '';
        return;
      }
      
      let buttons = [];
      
      buttons.push(`
        <button onclick="changeProductPage(${currentProductPage - 1})" 
                class="w-10 h-10 flex items-center justify-center rounded-lg border-2 transition-all ${currentProductPage === 1 ? 'border-gray-200 text-gray-300 cursor-not-allowed' : 'border-gray-300 text-gray-600 hover:border-red-500 hover:text-red-500'}"
                ${currentProductPage === 1 ? 'disabled' : ''}>
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
      `);
      
      const maxVisiblePages = 7;
      let startPage = Math.max(1, currentProductPage - Math.floor(maxVisiblePages / 2));
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
      
      if (startPage > 1) {
        buttons.push(`<button onclick="changeProductPage(1)" class="w-10 h-10 flex items-center justify-center rounded-lg border-2 border-gray-300 text-gray-600 hover:border-red-500 hover:text-red-500 transition-all font-medium">1</button>`);
        if (startPage > 2) {
          buttons.push(`<span class="text-gray-400 px-2">...</span>`);
        }
      }
      
      for (let i = startPage; i <= endPage; i++) {
        buttons.push(`
          <button onclick="changeProductPage(${i})" 
                  class="w-10 h-10 flex items-center justify-center rounded-lg border-2 transition-all font-medium ${i === currentProductPage ? 'bg-gradient-to-br from-red-500 to-red-600 border-red-500 text-white shadow-lg scale-110' : 'border-gray-300 text-gray-600 hover:border-red-500 hover:text-red-500'}">
            ${i}
          </button>
        `);
      }
      
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          buttons.push(`<span class="text-gray-400 px-2">...</span>`);
        }
        buttons.push(`<button onclick="changeProductPage(${totalPages})" class="w-10 h-10 flex items-center justify-center rounded-lg border-2 border-gray-300 text-gray-600 hover:border-red-500 hover:text-red-500 transition-all font-medium">${totalPages}</button>`);
      }
      
      buttons.push(`
        <button onclick="changeProductPage(${currentProductPage + 1})" 
                class="w-10 h-10 flex items-center justify-center rounded-lg border-2 transition-all ${currentProductPage === totalPages ? 'border-gray-200 text-gray-300 cursor-not-allowed' : 'border-gray-300 text-gray-600 hover:border-red-500 hover:text-red-500'}"
                ${currentProductPage === totalPages ? 'disabled' : ''}>
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </button>
      `);
      
      pagination.innerHTML = buttons.join('');
    }

    function changeProductPage(page) {
      const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
      if (page < 1 || page > totalPages) return;
      
      currentProductPage = page;
      renderProducts(filteredProducts);
      
      const productsSection = document.getElementById('products-section');
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    function filterCategory(category) {
      currentCategory = category;
      currentProductPage = 1;
      document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.category === category) btn.classList.add('active');
      });
      applyFilters();
    }

    function applyFilters() {
      currentProductPage = 1;
      let filtered = products;
      
      if (searchQuery) {
        filtered = filtered.filter(p => 
          p.name.toLowerCase().includes(searchQuery)
        );
      }
      
      if (currentCategory !== 'all') {
        filtered = filtered.filter(p => p.category === currentCategory);
      }
      
      const priceRange = document.getElementById('price-filter')?.value || currentPriceRange;
      currentPriceRange = priceRange;
      
      if (priceRange !== 'all') {
        filtered = filtered.filter(p => {
          const price = p.price;
          switch(priceRange) {
            case '0-500k': return price < 500000;
            case '500k-1m': return price >= 500000 && price < 1000000;
            case '1m-3m': return price >= 1000000 && price < 3000000;
            case '3m+': return price >= 3000000;
            default: return true;
          }
        });
      }
      
      const sortType = document.getElementById('sort-filter')?.value || currentSort;
      currentSort = sortType;
      
      switch(sortType) {
        case 'price-asc':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          filtered.sort((a, b) => b.price - a.price);
          break;
        case 'newest':
          filtered.sort((a, b) => b.id - a.id);
          break;
        case 'rating':
          filtered.sort((a, b) => b.rating - a.rating);
          break;
        case 'popular':
        default:
          filtered.sort((a, b) => b.sold - a.sold);
          break;
      }
      
      renderProducts(filtered);
    }

    let currentProduct = null;
    let showHistory = false;
    let quantity = 1;

    function openModal(productId) {
      currentProduct = products.find(p => p.id === productId);
      showHistory = false;
      quantity = 1;
      addToRecentlyViewed(productId);
      renderRecentlyViewed();
      renderModal();
      document.getElementById('product-modal').classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }

    function renderRecentlyViewed() {
      if (recentlyViewed.length === 0) {
        document.getElementById('recently-viewed-section').classList.add('hidden');
        return;
      }
      
      document.getElementById('recently-viewed-section').classList.remove('hidden');
      const viewedProducts = products.filter(p => recentlyViewed.includes(p.id));
      const grid = document.getElementById('recently-viewed-grid');
      
      grid.innerHTML = viewedProducts.slice(0, 6).map(product => `
        <div class="bg-white rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-all border border-gray-100" onclick="openModal(${product.id})">
          <div class="relative aspect-square bg-gray-50">
            <img src="${productImages[product.image]}" alt="${product.name}" class="w-full h-full object-cover" onerror="this.src=''; this.alt='Ảnh không tải được'; this.style.display='none';">
          </div>
          <div class="p-2">
            <h4 class="text-xs font-medium text-gray-900 line-clamp-2 mb-1">${product.name}</h4>
            <p class="text-sm font-bold text-red-600">${formatPrice(product.price)}</p>
          </div>
        </div>
      `).join('');
    }

    function clearRecentlyViewed() {
      recentlyViewed = [];
      localStorage.removeItem('recentlyViewed');
      renderRecentlyViewed();
      showToast('Đã xóa lịch sử xem sản phẩm', 'success');
    }

    function closeModal() {
      document.getElementById('product-modal').classList.add('hidden');
      document.body.style.overflow = '';
    }

    function toggleHistory() {
      showHistory = !showHistory;
      renderModal();
    }

    function updateQuantity(delta) {
      quantity = Math.max(1, Math.min(99, quantity + delta));
      renderModal();
    }

    function renderModal() {
      if (!currentProduct) return;
      const p = currentProduct;
      const discount = Math.round((1 - p.price / p.originalPrice) * 100);
      
      document.getElementById('modal-content').innerHTML = `
        <div class="relative">
          <button onclick="closeModal()" class="absolute top-4 right-4 z-10 w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors">
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
          
          <div class="grid md:grid-cols-2">
            <div class="relative bg-gray-50 p-8 md:p-12">
              <span class="${p.badgeColor} text-white text-sm font-semibold px-3 py-1.5 rounded-lg absolute top-4 left-4">
                ${p.badge}
              </span>
              <div class="aspect-square">
                <img src="${productImages[p.image]}" alt="${p.name}" class="w-full h-full object-cover rounded-lg" onerror="this.src=''; this.alt='Ảnh không tải được'; this.style.display='none';">
              </div>
            </div>
            
            <div class="p-6 md:p-8 overflow-y-auto max-h-[80vh]">
              ${!showHistory ? `
                <div class="space-y-4">
                  <div>
                    <h2 class="font-display text-2xl md:text-3xl font-bold text-gray-900 mb-2">${p.name}</h2>
                    <div class="flex items-center gap-4 text-sm">
                      <div class="flex items-center gap-1">
                        <div class="flex">${renderStars(p.rating)}</div>
                        <span class="font-medium text-gray-900">${p.rating.toFixed(1)}</span>
                        <span class="text-gray-500">(${p.reviews.toLocaleString()} đánh giá)</span>
                      </div>
                      <span class="text-gray-300">|</span>
                      <span class="text-gray-500">${p.sold.toLocaleString()} đã bán</span>
                    </div>
                  </div>
                  
                  <div class="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-4">
                    <div class="flex items-baseline gap-3">
                      <span class="text-3xl md:text-4xl font-bold text-red-600">${formatPrice(p.price)}</span>
                      <span class="text-lg text-gray-400 line-through">${formatPrice(p.originalPrice)}</span>
                      <span class="bg-red-500 text-white text-sm font-semibold px-2 py-0.5 rounded">-${discount}%</span>
                    </div>
                  </div>
                  
                  <button onclick="toggleHistory()" class="history-tab w-full text-white py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-all hover:opacity-90">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                    </svg>
                    Khám phá Nguồn gốc & Lịch sử
                  </button>
                  
                  <div class="space-y-3 pt-2">
                    <div class="flex items-center justify-between py-2 border-b border-gray-100">
                      <span class="text-gray-500">Chất liệu</span>
                      <span class="font-medium text-gray-900">Thủ công truyền thống</span>
                    </div>
                    <div class="flex items-center justify-between py-2 border-b border-gray-100">
                      <span class="text-gray-500">Vận chuyển</span>
                      <span class="font-medium text-green-600">Miễn phí toàn quốc</span>
                    </div>
                    <div class="flex items-center justify-between py-2 border-b border-gray-100">
                      <span class="text-gray-500">Bảo hành</span>
                      <span class="font-medium text-gray-900">12 tháng</span>
                    </div>
                    <div class="flex items-center justify-between py-2 border-b border-gray-100">
                      <span class="text-gray-500">Đổi trả</span>
                      <span class="font-medium text-blue-600">Miễn phí 30 ngày</span>
                    </div>
                  </div>
                  
                  <div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4">
                    <div class="flex items-start gap-3">
                      <svg class="w-6 h-6 text-amber-600 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                      <div class="text-sm">
                        <p class="font-semibold text-amber-900 mb-1">Sản phẩm thủ công chính hãng</p>
                        <p class="text-amber-800">Được làm bởi nghệ nhân lành nghề với hơn 20 năm kinh nghiệm. Cam kết 100% hàng thật.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div class="pt-4">
                    <h4 class="font-semibold text-gray-900 mb-3">Đánh giá từ khách hàng</h4>
                    <div class="space-y-3">
                      <div class="bg-gray-50 rounded-lg p-4">
                        <div class="flex items-center gap-2 mb-2">
                          <div class="flex">${renderStars(5)}</div>
                          <span class="font-medium text-sm">Nguyễn Thu H.</span>
                          <span class="text-xs text-gray-500">• 2 ngày trước</span>
                        </div>
                        <p class="text-sm text-gray-700">Sản phẩm đẹp, chất lượng tốt. Đúng như mô tả. Giao hàng nhanh!</p>
                      </div>
                      <div class="bg-gray-50 rounded-lg p-4">
                        <div class="flex items-center gap-2 mb-2">
                          <div class="flex">${renderStars(5)}</div>
                          <span class="font-medium text-sm">Trần Minh T.</span>
                          <span class="text-xs text-gray-500">• 5 ngày trước</span>
                        </div>
                        <p class="text-sm text-gray-700">Rất hài lòng với sản phẩm. Đóng gói cẩn thận, shop tư vấn nhiệt tình.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div class="flex items-center gap-4">
                    <span class="text-gray-600">Số lượng:</span>
                    <div class="flex items-center border border-gray-200 rounded-lg">
                      <button onclick="updateQuantity(-1)" class="quantity-btn w-10 h-10 flex items-center justify-center text-gray-600 hover:text-white rounded-l-lg">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>
                        </svg>
                      </button>
                      <span class="w-12 text-center font-medium">${quantity}</span>
                      <button onclick="updateQuantity(1)" class="quantity-btn w-10 h-10 flex items-center justify-center text-gray-600 hover:text-white rounded-r-lg">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <div class="flex gap-3 pt-2">
                    <button onclick="addToCart(${p.id}, ${quantity})" class="flex-1 btn-secondary border-2 border-red-500 text-red-500 py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                      </svg>
                      Thêm vào giỏ
                    </button>
                    <button onclick="buyNow(${p.id}, ${quantity})" class="flex-1 btn-primary text-white py-3.5 rounded-xl font-semibold">
                      Mua ngay
                    </button>
                  </div>
                </div>
              ` : `
                <div class="space-y-5">
                  <button onclick="toggleHistory()" class="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                    </svg>
                    Quay lại thông tin sản phẩm
                  </button>
                  
                  <div class="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-100">
                    <h3 class="font-display text-xl font-bold text-amber-800 mb-1">Nguồn gốc & Lịch sử</h3>
                    <p class="text-amber-700 text-sm">${p.name}</p>
                  </div>
                  
                  <div class="prose prose-gray max-w-none">
                    ${p.history.story.split('\n\n').map(para => `<p class="text-gray-700 leading-relaxed mb-4 text-justify">${para}</p>`).join('')}
                  </div>
                  
                  <button onclick="toggleHistory()" class="w-full btn-primary text-white py-3.5 rounded-xl font-semibold mt-4">
                    Quay lại mua hàng
                  </button>
                </div>
              `}
            </div>
          </div>
        </div>
      `;
    }

    function addToCart(productId, qty = 1) {
      const product = products.find(p => p.id === productId);
      const existingItem = cart.find(item => item.id === productId);
      
      if (existingItem) {
        existingItem.quantity += qty;
      } else {
        cart.push({ ...product, quantity: qty });
      }
      
      updateCartUI();
      closeModal();
      openCart();
    }

    function buyNow(productId, qty = 1) {
      addToCart(productId, qty);
    }

    function removeFromCart(productId) {
      cart = cart.filter(item => item.id !== productId);
      updateCartUI();
    }

    function updateCartItemQty(productId, delta) {
      const item = cart.find(i => i.id === productId);
      if (item) {
        item.quantity = Math.max(1, Math.min(99, item.quantity + delta));
        updateCartUI();
      }
    }

    function updateCartUI() {
      const count = cart.reduce((sum, item) => sum + item.quantity, 0);
      const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      document.getElementById('cart-count').textContent = count;
      document.getElementById('cart-total').textContent = formatPrice(total);
      document.getElementById('checkout-btn').disabled = cart.length === 0;
      
      const cartItems = document.getElementById('cart-items');
      if (cart.length === 0) {
        cartItems.innerHTML = `
          <div class="flex flex-col items-center justify-center h-full text-center">
            <svg class="w-20 h-20 text-gray-200 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
            <p class="text-gray-500 mb-2">Giỏ hàng của bạn đang trống</p>
            <button onclick="closeCart()" class="text-red-500 font-medium hover:underline">Tiếp tục mua sắm</button>
          </div>
        `;
      } else {
        cartItems.innerHTML = cart.map(item => `
          <div class="flex gap-4 py-4 border-b border-gray-100">
            <div class="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
              <img src="${productImages[item.image]}" alt="${item.name}" class="w-full h-full object-cover" onerror="this.src=''; this.alt='Ảnh không tải được'; this.style.display='none';">
            </div>
            <div class="flex-1 min-w-0">
              <h4 class="font-medium text-gray-900 truncate">${item.name}</h4>
              <p class="text-red-600 font-semibold mt-1">${formatPrice(item.price)}</p>
              <div class="flex items-center justify-between mt-2">
                <div class="flex items-center border border-gray-200 rounded">
                  <button onclick="updateCartItemQty(${item.id}, -1)" class="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-100">-</button>
                  <span class="w-8 text-center text-sm">${item.quantity}</span>
                  <button onclick="updateCartItemQty(${item.id}, 1)" class="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-100">+</button>
                </div>
                <button onclick="removeFromCart(${item.id})" class="text-gray-400 hover:text-red-500 transition-colors">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        `).join('');
      }
    }

    function openCart() {
      document.getElementById('cart-sidebar').classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }

    function closeCart() {
      document.getElementById('cart-sidebar').classList.add('hidden');
      document.body.style.overflow = '';
    }

    let checkoutStep = 1;
    let orderInfo = {
      name: '',
      phone: '',
      address: '',
      paymentMethod: 'cod'
    };

    function startCheckout() {
      if (cart.length === 0) return;
      checkoutStep = 1;
      closeCart();
      document.getElementById('checkout-modal').classList.remove('hidden');
      renderCheckout();
    }

    function closeCheckout() {
      document.getElementById('checkout-modal').classList.add('hidden');
      document.body.style.overflow = '';
    }

    function nextStep() {
      if (checkoutStep === 1) {
        const name = document.getElementById('customer-name')?.value.trim();
        const phone = document.getElementById('customer-phone')?.value.trim();
        const address = document.getElementById('customer-address')?.value.trim();
        
        if (!name || !phone || !address) {
          showToast('Vui lòng điền đầy đủ thông tin giao hàng', 'error');
          return;
        }
        
        orderInfo.name = name;
        orderInfo.phone = phone;
        orderInfo.address = address;
        checkoutStep = 2;
      } else if (checkoutStep === 2) {
        const selected = document.querySelector('input[name="payment"]:checked');
        if (!selected) {
          showToast('Vui lòng chọn phương thức thanh toán', 'error');
          return;
        }
        orderInfo.paymentMethod = selected.value;
        checkoutStep = 3;
      } else if (checkoutStep === 3) {
        processOrder();
        return;
      }
      renderCheckout();
    }

    function prevStep() {
      if (checkoutStep > 1) {
        checkoutStep--;
        renderCheckout();
      }
    }

    function processOrder() {
      checkoutStep = 4;
      renderCheckout();
      
      setTimeout(() => {
        checkoutStep = 5;
        renderCheckout();
      }, 2000);
      
      setTimeout(() => {
        const orderNumber = 'VH' + Date.now().toString().slice(-8);
        checkoutStep = 6;
        renderCheckout(orderNumber);
        cart = [];
        updateCartUI();
      }, 4000);
    }

    function renderCheckout(orderNumber = '') {
      const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const shipping = total >= 500000 ? 0 : 30000;
      const finalTotal = total + shipping;
      
      const content = document.getElementById('checkout-content');
      
      if (checkoutStep === 1) {
        content.innerHTML = `
          <div class="p-8">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl font-bold text-gray-900">Thông tin giao hàng</h2>
              <button onclick="closeCheckout()" class="p-2 hover:bg-gray-100 rounded-lg">
                <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            
            <div class="mb-6">
              <div class="flex items-center gap-2 mb-4">
                <div class="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center font-semibold">1</div>
                <span class="font-medium text-gray-900">Thông tin</span>
                <div class="flex-1 h-px bg-gray-300"></div>
                <div class="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-semibold">2</div>
                <span class="text-gray-500">Thanh toán</span>
                <div class="flex-1 h-px bg-gray-300"></div>
                <div class="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-semibold">3</div>
                <span class="text-gray-500">Xác nhận</span>
              </div>
            </div>
            
            <form onsubmit="event.preventDefault(); nextStep();" class="space-y-4">
              <div>
                <label for="customer-name" class="block text-sm font-medium text-gray-700 mb-2">Họ và tên</label>
                <input type="text" id="customer-name" value="${orderInfo.name}" placeholder="Nguyễn Văn A" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" required>
              </div>
              
              <div>
                <label for="customer-phone" class="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
                <input type="tel" id="customer-phone" value="${orderInfo.phone}" placeholder="0912345678" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" required>
              </div>
              
              <div>
                <label for="customer-address" class="block text-sm font-medium text-gray-700 mb-2">Địa chỉ giao hàng</label>
                <textarea id="customer-address" rows="3" placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" required>${orderInfo.address}</textarea>
              </div>
              
              <div class="bg-gray-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-900 mb-3">Đơn hàng (${cart.length} sản phẩm)</h3>
                <div class="space-y-2 max-h-40 overflow-auto">
                  ${cart.map(item => `
                    <div class="flex justify-between text-sm">
                      <span class="text-gray-600">${item.name} x${item.quantity}</span>
                      <span class="font-medium">${formatPrice(item.price * item.quantity)}</span>
                    </div>
                  `).join('')}
                </div>
                <div class="border-t mt-3 pt-3 space-y-1">
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Tạm tính</span>
                    <span class="font-medium">${formatPrice(total)}</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Phí vận chuyển</span>
                    <span class="font-medium ${shipping === 0 ? 'text-green-600' : ''}">${shipping === 0 ? 'Miễn phí' : formatPrice(shipping)}</span>
                  </div>
                  <div class="flex justify-between text-lg font-bold pt-2 border-t">
                    <span>Tổng cộng</span>
                    <span class="text-red-600">${formatPrice(finalTotal)}</span>
                  </div>
                </div>
              </div>
              
              <button type="submit" class="w-full btn-primary text-white py-4 rounded-xl font-semibold text-lg">
                Tiếp tục
              </button>
            </form>
          </div>
        `;
      } else if (checkoutStep === 2) {
        content.innerHTML = `
          <div class="p-8">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl font-bold text-gray-900">Phương thức thanh toán</h2>
              <button onclick="closeCheckout()" class="p-2 hover:bg-gray-100 rounded-lg">
                <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            
            <div class="mb-6">
              <div class="flex items-center gap-2 mb-4">
                <div class="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <span class="text-gray-500">Thông tin</span>
                <div class="flex-1 h-px bg-gray-300"></div>
                <div class="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center font-semibold">2</div>
                <span class="font-medium text-gray-900">Thanh toán</span>
                <div class="flex-1 h-px bg-gray-300"></div>
                <div class="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-semibold">3</div>
                <span class="text-gray-500">Xác nhận</span>
              </div>
            </div>
            
            <div class="space-y-4">
              <label class="flex items-start gap-4 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-red-500 transition-colors">
                <input type="radio" name="payment" value="cod" ${orderInfo.paymentMethod === 'cod' ? 'checked' : ''} class="mt-1">
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-1">
                    <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/>
                    </svg>
                    <span class="font-semibold text-gray-900">Thanh toán khi nhận hàng (COD)</span>
                  </div>
                  <p class="text-sm text-gray-600">Thanh toán bằng tiền mặt khi nhận hàng</p>
                </div>
              </label>
              
              <label class="flex items-start gap-4 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-red-500 transition-colors">
                <input type="radio" name="payment" value="bank" ${orderInfo.paymentMethod === 'bank' ? 'checked' : ''} class="mt-1">
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-1">
                    <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                    </svg>
                    <span class="font-semibold text-gray-900">Chuyển khoản ngân hàng</span>
                  </div>
                  <p class="text-sm text-gray-600">Chuyển khoản qua ngân hàng hoặc ví điện tử</p>
                </div>
              </label>
              
              <label class="flex items-start gap-4 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-red-500 transition-colors">
                <input type="radio" name="payment" value="momo" ${orderInfo.paymentMethod === 'momo' ? 'checked' : ''} class="mt-1">
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-1">
                    <svg class="w-6 h-6 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10"/>
                    </svg>
                    <span class="font-semibold text-gray-900">Ví MoMo</span>
                  </div>
                  <p class="text-sm text-gray-600">Thanh toán qua ví điện tử MoMo</p>
                </div>
              </label>
            </div>
            
            <div class="flex gap-3 mt-6">
              <button onclick="prevStep()" class="flex-1 btn-secondary border-2 border-gray-300 text-gray-700 py-3.5 rounded-xl font-semibold">
                Quay lại
              </button>
              <button onclick="nextStep()" class="flex-1 btn-primary text-white py-3.5 rounded-xl font-semibold">
                Tiếp tục
              </button>
            </div>
          </div>
        `;
      } else if (checkoutStep === 3) {
        const paymentNames = {
          cod: 'Thanh toán khi nhận hàng (COD)',
          bank: 'Chuyển khoản ngân hàng',
          momo: 'Ví MoMo'
        };
        
        content.innerHTML = `
          <div class="p-8">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl font-bold text-gray-900">Xác nhận đơn hàng</h2>
              <button onclick="closeCheckout()" class="p-2 hover:bg-gray-100 rounded-lg">
                <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            
            <div class="mb-6">
              <div class="flex items-center gap-2 mb-4">
                <div class="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <span class="text-gray-500">Thông tin</span>
                <div class="flex-1 h-px bg-gray-300"></div>
                <div class="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <span class="text-gray-500">Thanh toán</span>
                <div class="flex-1 h-px bg-gray-300"></div>
                <div class="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center font-semibold">3</div>
                <span class="font-medium text-gray-900">Xác nhận</span>
              </div>
            </div>
            
            <div class="space-y-6">
              <div class="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h3 class="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  </svg>
                  Thông tin giao hàng
                </h3>
                <div class="space-y-1 text-sm text-gray-700">
                  <p><strong>Người nhận:</strong> ${orderInfo.name}</p>
                  <p><strong>Số điện thoại:</strong> ${orderInfo.phone}</p>
                  <p><strong>Địa chỉ:</strong> ${orderInfo.address}</p>
                </div>
              </div>
              
              <div class="bg-green-50 border border-green-200 rounded-xl p-4">
                <h3 class="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                  </svg>
                  Phương thức thanh toán
                </h3>
                <p class="text-sm text-gray-700">${paymentNames[orderInfo.paymentMethod]}</p>
              </div>
              
              <div class="bg-gray-50 rounded-xl p-4">
                <h3 class="font-semibold text-gray-900 mb-3">Chi tiết đơn hàng</h3>
                <div class="space-y-2 max-h-48 overflow-auto">
                  ${cart.map(item => `
                    <div class="flex gap-3">
                      <div class="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0">
                        <img src="${productImages[item.image]}" alt="${item.name}" class="w-full h-full object-cover" onerror="this.src=''; this.alt='Ảnh không tải được'; this.style.display='none';">
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-gray-900 truncate">${item.name}</p>
                        <p class="text-xs text-gray-500">Số lượng: ${item.quantity}</p>
                        <p class="text-sm font-semibold text-red-600">${formatPrice(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  `).join('')}
                </div>
                <div class="border-t mt-4 pt-4 space-y-2">
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Tạm tính</span>
                    <span class="font-medium">${formatPrice(total)}</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Phí vận chuyển</span>
                    <span class="font-medium ${shipping === 0 ? 'text-green-600' : ''}">${shipping === 0 ? 'Miễn phí' : formatPrice(shipping)}</span>
                  </div>
                  <div class="flex justify-between text-xl font-bold pt-2 border-t">
                    <span>Tổng thanh toán</span>
                    <span class="text-red-600">${formatPrice(finalTotal)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="flex gap-3 mt-6">
              <button onclick="prevStep()" class="flex-1 btn-secondary border-2 border-gray-300 text-gray-700 py-3.5 rounded-xl font-semibold">
                Quay lại
              </button>
              <button onclick="nextStep()" class="flex-1 btn-primary text-white py-3.5 rounded-xl font-semibold">
                Đặt hàng
              </button>
            </div>
          </div>
        `;
      } else if (checkoutStep === 4) {
        content.innerHTML = `
          <div class="p-8 text-center">
            <div class="mb-6">
              <div class="inline-block animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-red-500"></div>
            </div>
            <h2 class="text-2xl font-bold text-gray-900 mb-2">Đang xử lý đơn hàng...</h2>
            <p class="text-gray-600">Vui lòng chờ trong giây lát</p>
          </div>
        `;
      } else if (checkoutStep === 5) {
        content.innerHTML = `
          <div class="p-8 text-center">
            <div class="mb-6">
              <div class="inline-block animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-green-500"></div>
            </div>
            <h2 class="text-2xl font-bold text-gray-900 mb-2">Đang xác nhận thanh toán...</h2>
            <p class="text-gray-600">Hệ thống đang kiểm tra thông tin</p>
          </div>
        `;
      } else if (checkoutStep === 6) {
        content.innerHTML = `
          <div class="p-8 text-center">
            <div class="mb-6">
              <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mx-auto">
                <svg class="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
            </div>
            
            <h2 class="text-3xl font-bold text-gray-900 mb-2">Đặt hàng thành công! 🎉</h2>
            <p class="text-gray-600 mb-6">Cảm ơn bạn đã mua hàng tại VietCraft Heritage</p>
            
            <div class="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-6 mb-6">
              <p class="text-sm text-gray-600 mb-2">Mã đơn hàng của bạn</p>
              <p class="text-3xl font-bold text-red-600">${orderNumber}</p>
            </div>
            
            <div class="bg-gray-50 rounded-xl p-6 mb-6 text-left">
              <h3 class="font-semibold text-gray-900 mb-4">Thông tin đơn hàng</h3>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-600">Người nhận:</span>
                  <span class="font-medium">${orderInfo.name}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Số điện thoại:</span>
                  <span class="font-medium">${orderInfo.phone}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Tổng tiền:</span>
                  <span class="font-bold text-red-600">${formatPrice(finalTotal)}</span>
                </div>
              </div>
            </div>
            
            <div class="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-left">
              <div class="flex gap-3">
                <svg class="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <div class="text-sm text-gray-700">
                  <p class="font-semibold mb-1">Đơn hàng sẽ được giao trong 3-5 ngày</p>
                  <p>Chúng tôi sẽ liên hệ với bạn để xác nhận đơn hàng trong thời gian sớm nhất.</p>
                </div>
              </div>
            </div>
            
            <button onclick="closeCheckout()" class="w-full btn-primary text-white py-4 rounded-xl font-semibold text-lg">
              Tiếp tục mua sắm
            </button>
          </div>
        `;
      }
    }

    function showToast(message, type = 'info') {
      const toast = document.createElement('div');
      const bgColor = type === 'error' ? 'bg-red-500' : type === 'success' ? 'bg-green-500' : 'bg-blue-500';
      toast.className = `fixed top-20 left-1/2 -translate-x-1/2 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-[100]`;
      toast.style.animation = 'slideDown 0.3s ease';
      toast.textContent = message;
      document.body.appendChild(toast);
      setTimeout(() => {
        toast.style.animation = 'fadeIn 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
      }, 2700);
    }

    function renderCollection() {
      const featured = products.slice(0, 9);
      const grid = document.getElementById('collection-grid');
      
      grid.innerHTML = featured.map(product => `
        <div class="story-card bg-white rounded-2xl overflow-hidden shadow-lg cursor-pointer" onclick="openModal(${product.id})">
          <div class="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 p-8">
            <img src="${productImages[product.image]}" alt="${product.name}" class="w-full h-full object-cover" onerror="this.src=''; this.alt='Ảnh không tải được'; this.style.display='none';">
            <span class="${product.badgeColor} text-white text-sm font-semibold px-3 py-2 rounded-lg absolute top-4 left-4">
              ${product.badge}
            </span>
          </div>
          <div class="p-6">
            <h3 class="font-display text-2xl font-bold text-gray-900 mb-2">${product.name}</h3>
            <div class="flex items-center justify-between">
              <div>
                <span class="text-2xl font-bold text-red-600">${formatPrice(product.price)}</span>
                <div class="flex items-center gap-1 mt-1">
                  <div class="flex">${renderStars(product.rating)}</div>
                  <span class="text-xs text-gray-500">(${product.reviews})</span>
                </div>
              </div>
              <button class="btn-primary text-white px-6 py-2.5 rounded-lg font-medium">
                Xem chi tiết
              </button>
            </div>
          </div>
        </div>
      `).join('');
    }

    function renderStories() {
      const stories = products.slice(0, 6);
      
      document.getElementById('stories-content').innerHTML = stories.map((story, index) => `
        <article class="story-card bg-white rounded-2xl shadow-lg overflow-hidden">
          <div class="grid md:grid-cols-2 gap-8">
            <div class="relative ${index % 2 === 0 ? 'md:order-1' : 'md:order-2'}">
              <div class="aspect-square bg-gradient-to-br from-amber-50 to-orange-50 p-12">
                <img src="${productImages[story.image]}" alt="${story.name}" class="w-full h-full object-cover rounded-lg" onerror="this.src=''; this.alt='Ảnh không tải được'; this.style.display='none';">
              </div>
            </div>
            <div class="p-8 flex flex-col justify-center ${index % 2 === 0 ? 'md:order-2' : 'md:order-1'}">
              <h3 class="font-display text-3xl font-bold text-gray-900 mb-4">${story.name}</h3>
              <div class="prose prose-gray">
                ${story.history.story.split('\n\n').slice(0, 3).map(para => `<p class="text-gray-600 leading-relaxed mb-4">${para}</p>`).join('')}
              </div>
              <button onclick="openModal(${story.id})" class="mt-4 text-red-600 font-semibold hover:underline">Đọc thêm →</button>
            </div>
          </div>
        </article>
      `).join('');
    }

    async function onConfigChange(config) {
      document.getElementById('site-name').textContent = config.site_name || defaultConfig.site_name;
      document.getElementById('promo-text').textContent = config.promo_text || defaultConfig.promo_text;
    }

    document.getElementById('cart-btn').addEventListener('click', openCart);
    
    loadRecentlyViewed();
    applyFilters();
    updateCartUI();
    updateWishlistUI();
    updateCompareUI();
    renderRecentlyViewed();
    startCountdown();
    
    document.querySelector('.page-nav-btn[data-page="1"]').classList.add('active');

    if (window.elementSdk) {
      window.elementSdk.init({
        defaultConfig,
        onConfigChange,
        mapToCapabilities: (config) => ({
          recolorables: [],
          borderables: [],
          fontEditable: undefined,
          fontSizeable: undefined
        }),
        mapToEditPanelValues: (config) => new Map([
          ['site_name', config.site_name || defaultConfig.site_name],
          ['promo_text', config.promo_text || defaultConfig.promo_text]
        ])
      });
    } else {
      onConfigChange(defaultConfig);
    }