import { SubjectItem, StudyMaterial } from '../types';

export const DEFAULT_SUBJECTS: SubjectItem[] = [
  {
    id: 'toan',
    name: 'Toán Học',
    iconName: 'Calculator',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    topics: [
      'Phân số & Tỷ số',
      'Phương trình & Cân thăng bằng',
      'Đồ thị hàm số y = ax + b',
      'Định lý Pytago & Tam giác vuông',
      'Hình học không gian',
      'Số học & Tỉ lệ thức',
      'Xác suất & Thống kê trực quan',
    ],
  },
];

export const INITIAL_STUDY_MATERIALS: StudyMaterial[] = [
  {
    id: 'mat-1',
    title: 'Ghi chép: Bí quyết nhớ nhanh định lý Pytago bằng hình vẽ',
    type: 'text',
    subject: 'Toán Học',
    topic: 'Định lý Pytago & Tam giác vuông',
    content:
      'Trong tam giác vuông, bình phương cạnh huyền bằng tổng bình phương hai cạnh góc vuông: a² + b² = c².\n\nCách nhớ bằng hình ảnh: Dựng 3 hình vuông trên 3 cạnh của tam giác vuông. Tổng diện tích của hai hình vuông nhỏ (dựng trên hai cạnh góc vuông) luôn bằng đúng diện tích hình vuông lớn nhất (dựng trên cạnh huyền).\n\nVí dụ kinh điển: Tam giác có 2 cạnh góc vuông là 3cm và 4cm thì cạnh huyền bằng √(3² + 4²) = √(9 + 16) = √25 = 5cm.',
    previewNote: 'Ghi chú bài giảng hình học lớp 7',
    wordCount: 88,
    createdAt: 'Hôm nay, 10:15',
    isPinned: true,
    summary:
      'Định lý Pytago là mối quan hệ diện tích kinh điển trong tam giác vuông: diện tích hình vuông dựng trên cạnh huyền luôn bằng tổng diện tích hai hình vuông dựng trên hai cạnh góc vuông (a² + b² = c²). Định lý giúp tính nhanh độ dài cạnh thứ ba khi đã biết hai cạnh còn lại.',
    keyPoints: [
      '📌 Bản chất trực quan: Ghép diện tích 2 hình vuông nhỏ dựng trên 2 cạnh góc vuông sẽ vừa khít diện tích hình vuông lớn nhất dựng trên cạnh huyền.',
      '📐 Công thức vàng: c = √(a² + b²) (tính cạnh huyền) hoặc a = √(c² - b²) (tính cạnh góc vuông).',
      '🧱 Bộ ba số Pytago nguyên kinh điển: (3, 4, 5) và (5, 12, 13) cùng các bội số nhân đôi (6, 8, 10).',
      '⚠️ Bẫy sai lầm: Định lý chỉ áp dụng duy nhất cho tam giác vuông; cạnh huyền c luôn luôn là cạnh dài nhất nằm đối diện góc vuông 90°.',
    ],
    summarizedAt: 'Hôm nay, 10:20',
  },
  {
    id: 'mat-2',
    title: 'Đề bài tập: Giải phương trình 2x + 4 = 10 bằng chiếc cân đòn',
    type: 'text',
    subject: 'Toán Học',
    topic: 'Phương trình & Cân thăng bằng',
    content:
      'Đề bài: Giải phương trình 2x + 4 = 10 và giải thích quy tắc chuyển vế đổi dấu bằng chiếc cân thăng bằng.\n\nÝ tưởng giải thích của em:\n- Đĩa cân bên trái có: 2 chiếc hộp bí mật chứa x viên bi và 4 viên bi rời.\n- Đĩa cân bên phải có: 10 viên bi rời.\n- Bước 1: Bốc bớt 4 viên bi ở cả hai đĩa cân (tương ứng trừ 4 ở hai vế: 2x = 10 - 4 = 6).\n- Bước 2: Chia đôi số bi ở mỗi bên để tìm số bi trong 1 chiếc hộp x (tương ứng chia 2 ở hai vế: x = 6 / 2 = 3).',
    previewNote: 'Bài tập về nhà môn Đại số',
    wordCount: 112,
    createdAt: 'Hôm nay, 09:30',
    isPinned: true,
    summary:
      'Phương trình bậc nhất một ẩn (2x + 4 = 10) tương đương một chiếc cân đòn đang thăng bằng. Muốn tìm số lượng trong chiếc hộp x, ta bớt cùng một lượng 4 viên bi ở cả hai đĩa cân (2x = 6) rồi chia đều cho 2 hộp (x = 3).',
    keyPoints: [
      '📌 Bản chất chiếc cân: Dấu bằng (=) đại diện cho đòn cân thăng bằng; mọi thao tác làm với vế trái bắt buộc phải làm y hệt với vế phải.',
      '⚖️ Quy tắc chuyển vế đổi dấu: Chuyển +4 sang vế phải thành -4 tương đương bốc bớt 4 viên bi ở cả hai đĩa cân.',
      '🔢 Hai bước chuẩn mực: Bước 1 trừ bớt hằng số tự do; Bước 2 chia cả hai vế cho hệ số của x để tìm 1x.',
      '⚠️ Bẫy sai lầm: Khi chia cả 2 vế cho hệ số âm (ví dụ -2x = 6), nhớ đổi dấu: x = 6 / (-2) = -3.',
    ],
    summarizedAt: 'Hôm nay, 09:35',
  },
  {
    id: 'mat-3',
    title: 'Ảnh chụp bài tập: Sơ đồ tư duy 3 dạng phân số thường gặp',
    type: 'image',
    subject: 'Toán Học',
    topic: 'Phân số & Tỷ số',
    content:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="340" viewBox="0 0 600 340"><rect width="100%" height="100%" fill="%23f8fafc" rx="16"/><rect x="20" y="20" width="560" height="300" rx="12" fill="%23ffffff" stroke="%23cbd5e1" stroke-width="2"/><text x="300" y="55" font-family="sans-serif" font-size="20" font-weight="bold" fill="%231e293b" text-anchor="middle">SƠ ĐỒ TRỰC QUAN: PHÂN SỐ LÀ GÌ?</text><circle cx="120" cy="160" r="60" fill="%23fef3c7" stroke="%23f59e0b" stroke-width="3"/><path d="M 120 160 L 120 100 A 60 60 0 0 1 180 160 Z" fill="%23f59e0b"/><text x="120" y="255" font-family="sans-serif" font-size="14" font-weight="bold" fill="%2392400e" text-anchor="middle">1/4 Bánh Pizza</text><rect x="240" y="125" width="130" height="60" rx="6" fill="%23e0e7ff" stroke="%236366f1" stroke-width="2"/><rect x="240" y="125" width="65" height="60" rx="4" fill="%236366f1"/><text x="305" y="255" font-family="sans-serif" font-size="14" font-weight="bold" fill="%233730a3" text-anchor="middle">1/2 Thanh Socola</text><line x1="430" y1="160" x2="550" y2="160" stroke="%2394a3b8" stroke-width="4"/><circle cx="430" cy="160" r="5" fill="%230f172a"/><circle cx="520" cy="160" r="7" fill="%2310b981"/><circle cx="550" cy="160" r="5" fill="%230f172a"/><text x="430" y="185" font-size="12" fill="%2364748b" text-anchor="middle">0</text><text x="520" y="185" font-size="12" font-weight="bold" fill="%23047857" text-anchor="middle">3/4</text><text x="550" y="185" font-size="12" fill="%2364748b" text-anchor="middle">1</text><text x="490" y="255" font-family="sans-serif" font-size="14" font-weight="bold" fill="%23065f46" text-anchor="middle">3/4 Trục Số</text></svg>',
    imageFileName: 'so-do-phan-so-sgk.png',
    imageSize: '185 KB',
    previewNote: 'Ảnh chụp từ sổ tay tóm tắt bài học',
    createdAt: 'Hôm qua, 16:40',
    isPinned: false,
    summary:
      'Phân số a/b (b ≠ 0) biểu thị mối quan hệ giữa phần được chọn (tử số a) và tổng số phần bằng nhau được chia đều từ một chỉnh thể đơn vị (mẫu số b). Hình ảnh chiếc bánh pizza, thanh socola và trục số giúp trực quan hóa rõ nét giá trị phân số.',
    keyPoints: [
      '📌 Bản chất tử và mẫu: Mẫu số b cho biết chia làm bao nhiêu phần bằng nhau; Tử số a cho biết ta lấy hoặc quan tâm bao nhiêu phần.',
      '🍕 Tính chất tương đương: Nhân hoặc chia cả tử và mẫu với cùng số khác 0 thì giá trị phân số không đổi (1/2 = 2/4 = 4/8).',
      '➕ Phép cộng trừ: Bắt buộc quy đồng đưa về cùng mẫu số trước khi cộng hoặc trừ các tử số với nhau.',
      '⚠️ Bẫy sai lầm: Mẫu số luôn luôn phải khác 0; tuyệt đối không cộng tử với tử, mẫu với mẫu (1/2 + 1/3 ≠ 2/5).',
    ],
    summarizedAt: 'Hôm qua, 16:45',
  },
  {
    id: 'mat-4',
    title: 'Bài giảng video: Vì sao hàm số y = ax + b có đồ thị là đường thẳng?',
    type: 'url',
    subject: 'Toán Học',
    topic: 'Đồ thị hàm số y = ax + b',
    content: 'https://vi.khanacademy.org/math/algebra/linear-equations-graphs',
    urlDomain: 'vi.khanacademy.org',
    previewNote: 'Khóa học trực quan về hệ số góc a và tung độ gốc b',
    createdAt: 'Hôm qua, 14:15',
    isPinned: false,
    summary:
      'Hàm số bậc nhất y = ax + b (a ≠ 0) có đồ thị là một đường thẳng liên tục trên mặt phẳng toạ độ Oxy. Trong đó hệ số góc a quyết định chiều dốc và độ nghiêng, còn tung độ gốc b xác định vị trí đường thẳng cắt trục tung Oy.',
    keyPoints: [
      '📈 Ý nghĩa hệ số góc a: a > 0 đồ thị dốc lên từ trái qua phải (đồng biến); a < 0 đồ thị dốc xuống (nghịch biến); |a| càng lớn đường thẳng càng dựng đứng.',
      '🎯 Điểm cắt trục tung Oy: Luôn là điểm (0, b), biểu diễn trạng thái ban đầu khi x = 0.',
      '📐 Giao điểm trục hoành Ox: Điểm (-b/a, 0) tìm được khi giải phương trình ax + b = 0.',
      '⚠️ Bẫy sai lầm: Nhầm lẫn giữa trục tung Oy (thẳng đứng) và trục hoành Ox (nằm ngang).',
    ],
    summarizedAt: 'Hôm qua, 14:20',
  },
];
