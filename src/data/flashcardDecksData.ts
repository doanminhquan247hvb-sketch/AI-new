import { ReviewCard } from '../types';

export interface FlashcardDeck {
  id: string;
  subject: string;
  topic: string;
  title: string;
  description: string;
  badgeColor: string;
  cards: ReviewCard[];
}

export const DEFAULT_FLASHCARD_DECKS: FlashcardDeck[] = [
  {
    id: 'deck-math-pythagoras',
    subject: 'Toán Học',
    topic: 'Định Lý Pytago',
    title: 'Định Lý Pytago & Tam Giác Vuông',
    description: 'Nắm chắc hệ thức bình phương cạnh huyền và bộ ba số Pytago kinh điển.',
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    cards: [
      {
        id: 'fc-m1',
        subject: 'Toán Học',
        topic: 'Định Lý Pytago',
        title: 'Định nghĩa Định lý Pytago thuận',
        question: 'Trong tam giác vuông ABC vuông tại A, hệ thức liên hệ giữa ba cạnh là gì?',
        hint: 'Bình phương cạnh huyền bằng tổng bình phương hai cạnh góc vuông.',
        answer: 'BC² = AB² + AC² (hay c² = a² + b²)',
        formula: 'BC² = AB² + AC²',
        example: 'Tam giác vuông có hai cạnh góc vuông 3cm và 4cm thì cạnh huyền là √(3² + 4²) = 5cm.',
        keyRule: 'Cạnh đối diện góc vuông luôn là cạnh huyền và có độ dài lớn nhất trong tam giác vuông.',
        mastery: 'learning',
        reviewCount: 1,
      },
      {
        id: 'fc-m2',
        subject: 'Toán Học',
        topic: 'Định Lý Pytago',
        title: 'Định lý Pytago đảo',
        question: 'Làm thế nào để chứng minh một tam giác có ba cạnh a, b, c là tam giác vuông?',
        hint: 'So sánh bình phương cạnh lớn nhất với tổng bình phương hai cạnh còn lại.',
        answer: 'Nếu tam giác có bình phương của một cạnh bằng tổng bình phương của hai cạnh kia (c² = a² + b²) thì tam giác đó là tam giác vuông tại góc đối diện với cạnh c.',
        formula: 'Nếu c² = a² + b² ⟹ Tam giác vuông tại góc đối diện cạnh c',
        example: 'Bộ ba số (6, 8, 10) có 6² + 8² = 36 + 64 = 100 = 10² ⟹ Là tam giác vuông.',
        keyRule: 'Luôn kiểm tra bình phương của cạnh lớn nhất trước.',
        mastery: 'need_review',
        reviewCount: 0,
      },
      {
        id: 'fc-m3',
        subject: 'Toán Học',
        topic: 'Định Lý Pytago',
        title: 'Các bộ ba số Pytago nguyên thường gặp',
        question: 'Hãy kể tên ít nhất 3 bộ ba số Pytago nguyên kinh điển thường xuất hiện trong đề thi?',
        hint: 'Bộ ba bắt đầu từ (3, 4, 5)...',
        answer: '1) (3, 4, 5)\n2) (5, 12, 13)\n3) (6, 8, 10)\n4) (8, 15, 17)\n5) (7, 24, 25)',
        formula: '(3k, 4k, 5k) hoặc (5k, 12k, 13k) với k nguyên dương',
        example: 'Nếu hai cạnh góc vuông là 5 và 12, cạnh huyền lập tức bằng 13 mà không cần bấm máy tính.',
        keyRule: 'Nhân cả 3 số của một bộ số Pytago với cùng một số k > 0 ta được bộ số Pytago mới.',
        mastery: 'mastered',
        reviewCount: 2,
      },
      {
        id: 'fc-m4',
        subject: 'Toán Học',
        topic: 'Phương Trình Bậc Nhất',
        title: 'Quy tắc chuyển vế đổi dấu',
        question: 'Khi chuyển một hạng tử từ vế này sang vế kia của phương trình, ta phải làm gì?',
        hint: 'Dấu cộng đổi thành dấu gì, dấu trừ đổi thành dấu gì?',
        answer: 'Ta phải ĐỔI DẤU hạng tử đó: dấu cộng (+) đổi thành dấu trừ (-), dấu trừ (-) đổi thành dấu cộng (+).',
        formula: 'A + B = C  ⟺  A = C - B',
        example: 'x + 5 = 12 ⟺ x = 12 - 5 ⟺ x = 7.',
        keyRule: 'Chỉ đổi dấu hạng tử được chuyển qua dấu bằng (=).',
        mastery: 'learning',
        reviewCount: 1,
      },
    ],
  },
  {
    id: 'deck-physics-ohm',
    subject: 'Vật Lý',
    topic: 'Điện Học & Định Luật Ôm',
    title: 'Định Luật Ôm & Đoạn Mạch Nối Tiếp / Song Song',
    description: 'Cường độ dòng điện, hiệu điện thế, điện trở và công thức ghép điện trở.',
    badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
    cards: [
      {
        id: 'fc-p1',
        subject: 'Vật Lý',
        topic: 'Định Luật Ôm',
        title: 'Phát biểu và công thức Định luật Ôm',
        question: 'Phát biểu định luật Ôm cho đoạn mạch và viết công thức liên hệ giữa I, U, R?',
        hint: 'Cường độ dòng điện tỉ lệ thuận với hiệu điện thế và tỉ lệ nghịch với điện trở.',
        answer: 'Cường độ dòng điện chạy qua dây dẫn tỉ lệ thuận với hiệu điện thế đặt vào hai đầu dây và tỉ lệ nghịch với điện trở của dây.',
        formula: 'I = U / R  (Trong đó: I tính bằng A, U tính bằng V, R tính bằng Ω)',
        example: 'Đặt hiệu điện thế U = 12V vào hai đầu điện trở R = 4Ω thì I = 12 / 4 = 3 (A).',
        keyRule: 'U tăng bao nhiêu lần thì I tăng bấy nhiêu lần (nếu R không đổi).',
        mastery: 'learning',
        reviewCount: 1,
      },
      {
        id: 'fc-p2',
        subject: 'Vật Lý',
        topic: 'Đoạn Mạch Nối Tiếp',
        title: 'Tính chất đoạn mạch mắc nối tiếp',
        question: 'Trong đoạn mạch gồm hai điện trở R1 nối tiếp R2, các đại lượng I, U, R_td tính như thế nào?',
        hint: 'Dòng điện chỉ có 1 đường đi duy nhất.',
        answer: '1) Cường độ dòng điện bằng nhau: I = I1 = I2\n2) Hiệu điện thế tổng: U = U1 + U2\n3) Điện trở tương đương: R_td = R1 + R2',
        formula: 'R_td = R1 + R2 + ... + Rn',
        example: 'R1 = 10Ω nối tiếp R2 = 20Ω ⟹ R_td = 10 + 20 = 30Ω.',
        keyRule: 'Điện trở tương đương của mạch nối tiếp luôn LỚN HƠN từng điện trở thành phần.',
        mastery: 'need_review',
        reviewCount: 0,
      },
      {
        id: 'fc-p3',
        subject: 'Vật Lý',
        topic: 'Đoạn Mạch Song Song',
        title: 'Tính chất đoạn mạch mắc song song',
        question: 'Trong đoạn mạch gồm hai điện trở R1 mắc song song R2, các đại lượng I, U, R_td liên hệ ra sao?',
        hint: 'Hiệu điện thế ở hai nhánh là như nhau.',
        answer: '1) Hiệu điện thế bằng nhau: U = U1 = U2\n2) Cường độ dòng điện phân nhánh: I = I1 + I2\n3) Điện trở tương đương: 1/R_td = 1/R1 + 1/R2  ⟹  R_td = (R1 * R2) / (R1 + R2)',
        formula: 'R_td = (R1 · R2) / (R1 + R2)',
        example: 'R1 = 6Ω song song R2 = 3Ω ⟹ R_td = (6 * 3) / (6 + 3) = 18 / 9 = 2Ω.',
        keyRule: 'Điện trở tương đương của mạch song song luôn NHỎ HƠN từng điện trở thành phần.',
        mastery: 'mastered',
        reviewCount: 3,
      },
    ],
  },
  {
    id: 'deck-chemistry-acids',
    subject: 'Hóa Học',
    topic: 'Axit, Bazơ & Muối',
    title: 'Phân Loại & Tính Chất Hóa Học Cơ Bản',
    description: 'Đổi màu chất chỉ thị, phản ứng trung hòa và điều kiện phản ứng trao đổi.',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    cards: [
      {
        id: 'fc-c1',
        subject: 'Hóa Học',
        topic: 'Chất Chỉ Thị Màu',
        title: 'Màu sắc của Quỳ Tím và Phenolphtalein',
        question: 'Quỳ tím và dung dịch Phenolphtalein đổi màu như thế nào trong môi trường Axit, Bazơ và Trung tính?',
        hint: 'Axit làm quỳ hóa đỏ, Bazơ làm quỳ hóa xanh...',
        answer: '1) Quỳ tím: Gặp Axit ➔ Đỏ/Hồng; Gặp Bazơ (Kiềm) ➔ Xanh; Trung tính ➔ Không đổi màu tím.\n2) Dung dịch Phenolphtalein: Gặp Bazơ (Kiềm) ➔ Hồng đậm/Đỏ; Axit và trung tính ➔ Không màu.',
        formula: 'Axit + Quỳ tím ➔ Đỏ | Bazơ + Quỳ tím ➔ Xanh | Bazơ + Phenolphtalein ➔ Hồng',
        example: 'Nhỏ dung dịch NaOH vào phenolphtalein không màu thấy xuất hiện màu hồng cánh sen.',
        keyRule: 'Chỉ các bazơ TAN (kiềm: NaOH, KOH, Ca(OH)2, Ba(OH)2) mới làm đổi màu chất chỉ thị.',
        mastery: 'learning',
        reviewCount: 1,
      },
      {
        id: 'fc-c2',
        subject: 'Hóa Học',
        topic: 'Phản Ứng Trao Đổi',
        title: 'Điều kiện xảy ra phản ứng trao đổi trong dung dịch',
        question: 'Phản ứng trao đổi giữa hai dung dịch chất điện li chỉ xảy ra khi sản phẩm tạo thành thỏa mãn điều kiện gì?',
        hint: 'Ít nhất 1 trong 3 điều kiện: kết tủa, bay hơi, hoặc chất điện li yếu.',
        answer: 'Phản ứng trao đổi xảy ra khi sản phẩm tạo thành có ít nhất một trong các yếu tố sau:\n1) Có chất KẾT TỦA (không tan)\n2) Có chất BAY HƠI (khí)\n3) Có chất ĐIỆN LI YẾU (như nước H2O)',
        formula: 'AB + CD ➔ AD + CB (kèm ↓ hoặc ↑ hoặc H2O)',
        example: 'BaCl2 + Na2SO4 ➔ BaSO4↓ (trắng) + 2NaCl (thỏa mãn có kết tủa BaSO4).',
        keyRule: 'Nếu không tạo ra kết tủa, khí hoặc nước thì phản ứng KHÔNG xảy ra.',
        mastery: 'mastered',
        reviewCount: 2,
      },
    ],
  },
  {
    id: 'deck-english-conditionals',
    subject: 'Tiếng Anh',
    topic: 'Câu Điều Kiện (Conditionals)',
    title: 'Cấu Trúc Câu Điều Kiện Loại 1 & Loại 2',
    description: 'Phân biệt điều kiện có thể xảy ra ở hiện tại/tương lai và điều kiện giả định trái thực tế.',
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
    cards: [
      {
        id: 'fc-e1',
        subject: 'Tiếng Anh',
        topic: 'Conditionals',
        title: 'Câu điều kiện Loại 1 (First Conditional)',
        question: 'Cấu trúc và cách dùng của câu điều kiện Loại 1 là gì?',
        hint: 'Diễn tả hành động có thật, có thể xảy ra ở hiện tại hoặc tương lai.',
        answer: 'Cấu trúc: If + S + V(s/es) (Hiện tại đơn), S + will / can + V(nguyên thể)\nCách dùng: Diễn tả sự việc hoàn toàn có thể xảy ra trong hiện tại hoặc tương lai nếu điều kiện được thỏa mãn.',
        formula: 'If + S + V (present simple), S + will + V (infinitive)',
        example: 'If it rains tomorrow, we will stay at home. (Nếu ngày mai trời mưa, chúng tôi sẽ ở nhà).',
        keyRule: 'Mệnh đề chứa "If" KHÔNG dùng "will".',
        mastery: 'learning',
        reviewCount: 1,
      },
      {
        id: 'fc-e2',
        subject: 'Tiếng Anh',
        topic: 'Conditionals',
        title: 'Câu điều kiện Loại 2 (Second Conditional)',
        question: 'Cấu trúc và cách dùng của câu điều kiện Loại 2 là gì?',
        hint: 'Diễn tả điều ước/giả định KHÔNG CÓ THẬT ở hiện tại.',
        answer: 'Cấu trúc: If + S + V-ed/V2 (Quá khứ đơn), S + would / could + V(nguyên thể)\nCách dùng: Giả định một tình huống trái ngược với thực tế ở hiện tại hoặc không thể xảy ra.',
        formula: 'If + S + V-past (to be = were), S + would + V-inf',
        example: 'If I were you, I would study harder. (Nếu tôi là bạn, tôi sẽ học chăm hơn).',
        keyRule: 'Động từ "to be" trong mệnh đề If loại 2 thường dùng "were" cho tất cả các ngôi (I, he, she, it...).',
        mastery: 'need_review',
        reviewCount: 0,
      },
    ],
  },
  {
    id: 'deck-history-milestones',
    subject: 'Lịch Sử',
    topic: 'Lịch Sử Việt Nam Hiện Đại',
    title: 'Các Mốc Lịch Sử Vàng Dân Tộc',
    description: 'Những sự kiện bước ngoặt vẻ vang trong lịch sử đấu tranh giữ nước.',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    cards: [
      {
        id: 'fc-h1',
        subject: 'Lịch Sử',
        topic: 'Chiến Dịch Điện Biên Phủ 1954',
        title: 'Ý nghĩa lịch sử Chiến thắng Điện Biên Phủ 1954',
        question: 'Chiến thắng lịch sử Điện Biên Phủ diễn ra vào ngày tháng năm nào và mang ý nghĩa gì?',
        hint: 'Lừng lẫy năm châu, chấn động địa cầu...',
        answer: 'Thời gian: Ngày 07 tháng 05 năm 1954.\nÝ nghĩa: Đập tan hoàn toàn tập đoàn cứ điểm mạnh nhất của thực dân Pháp ở Đông Dương, buộc Pháp phải ký Hiệp định Giơ-ne-vơ công nhận độc lập, chủ quyền của Việt Nam; chấm dứt ách thống trị của Pháp ở miền Bắc.',
        formula: '07/05/1954: "Lừng lẫy năm châu, chấn động địa cầu"',
        example: 'Tướng Đờ Ca-xtơ-ri cùng toàn bộ bộ chỉ huy Pháp bị bắt sống tại hầm chỉ huy.',
        keyRule: 'Chiến thắng quyết định buộc Pháp phải đàm phán tại Hội nghị Giơ-ne-vơ.',
        mastery: 'mastered',
        reviewCount: 3,
      },
    ],
  },
];

const STORAGE_KEY = 'toan_truc_quan_flashcard_decks_v2';

export function getStoredFlashcardDecks(): FlashcardDeck[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return DEFAULT_FLASHCARD_DECKS;
}

export function saveStoredFlashcardDecks(decks: FlashcardDeck[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(decks));
  } catch {}
}
