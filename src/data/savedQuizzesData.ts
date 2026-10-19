import { SavedQuizPackage } from '../types';

export const STORAGE_KEY_SAVED_QUIZZES = 'toan_truc_quan_saved_quizzes_v1';

export const DEFAULT_SAVED_QUIZZES: SavedQuizPackage[] = [
  {
    id: 'quiz-pkg-pythagoras',
    title: 'Định Lý Pytago & Tam Giác Vuông',
    description: 'Bộ câu hỏi kiểm tra kiến thức về định lý Pytago thuận, định lý đảo và bộ ba số Pytago kinh điển.',
    topic: 'Định lý Pytago & Tam giác vuông',
    subject: 'Toán Học',
    createdAt: '2026-10-05',
    questions: [
      {
        id: 'pyt-q1',
        topic: 'Định lý Pytago & Tam giác vuông',
        type: 'multiple_choice',
        question: 'Trong tam giác ABC vuông tại A, khẳng định nào sau đây là ĐÚNG theo định lý Pytago?',
        options: [
          'BC² = AB² + AC²',
          'AB² = BC² + AC²',
          'AC² = AB² + BC²',
          'BC = AB + AC',
        ],
        correctIndex: 0,
        explanation: 'Tam giác ABC vuông tại A nên BC là cạnh huyền (đối diện góc vuông A). Theo định lý Pytago: Bình phương cạnh huyền bằng tổng bình phương hai cạnh góc vuông (BC² = AB² + AC²).',
        tip: 'Luôn xác định góc vuông ở đỉnh nào để biết chính xác đâu là cạnh huyền!',
      },
      {
        id: 'pyt-q2',
        topic: 'Định lý Pytago & Tam giác vuông',
        type: 'true_false',
        question: 'Tam giác có ba cạnh dài 3cm, 4cm, 5cm là tam giác vuông. Khẳng định này Đúng hay Sai?',
        correctBool: true,
        explanation: 'ĐÚNG! Ta có: 3² + 4² = 9 + 16 = 25. Cạnh lớn nhất là 5 có 5² = 25. Vì 3² + 4² = 5² nên theo định lý Pytago đảo, đây là tam giác vuông.',
        tip: 'Bộ ba số (3, 4, 5) là bộ ba số Pytago nguyên kinh điển nhất.',
      },
      {
        id: 'pyt-q3',
        topic: 'Định lý Pytago & Tam giác vuông',
        type: 'multiple_choice',
        question: 'Một tam giác vuông có hai cạnh góc vuông lần lượt là 6cm và 8cm. Độ dài cạnh huyền bằng bao nhiêu?',
        options: ['14 cm', '10 cm', '12 cm', '48 cm'],
        correctIndex: 1,
        explanation: 'Gọi độ dài cạnh huyền là c. Ta có: c² = 6² + 8² = 36 + 64 = 100. Suy ra c = √100 = 10 (cm).',
        tip: 'Bộ (6, 8, 10) chính là bộ (3, 4, 5) được nhân đôi cả 3 cạnh.',
      },
      {
        id: 'pyt-q4',
        topic: 'Định lý Pytago & Tam giác vuông',
        type: 'fill_blank',
        question: 'Một tam giác vuông có cạnh huyền bằng 13cm và một cạnh góc vuông bằng 5cm. Độ dài cạnh góc vuông còn lại là bao nhiêu cm? (Chỉ điền số)',
        acceptableAnswers: ['12', '12cm', '12 cm'],
        explanation: 'Gọi cạnh cần tìm là b. Theo Pytago: b² = c² - a² = 13² - 5² = 169 - 25 = 144. Do đó b = √144 = 12 (cm).',
        tip: 'Khi tìm cạnh góc vuông, nhớ lấy bình phương cạnh huyền TRỪ bình phương cạnh đã biết.',
      },
      {
        id: 'pyt-q5',
        topic: 'Định lý Pytago & Tam giác vuông',
        type: 'true_false',
        question: 'Định lý Pytago có thể áp dụng cho mọi loại tam giác (kể cả tam giác nhọn hoặc tam giác tù). Đúng hay Sai?',
        correctBool: false,
        explanation: 'SAI! Định lý Pytago CHỈ áp dụng riêng cho tam giác vuông (có 1 góc bằng 90°). Với tam giác thường phải dùng định lý hàm số cô-sin.',
        tip: 'Đây là cái bẫy đề thi hay gặp nhất của học sinh.',
      },
    ],
  },
  {
    id: 'quiz-pkg-equations',
    title: 'Phương Trình Bậc Nhất & Cân Thăng Bằng',
    description: 'Bộ câu hỏi rèn luyện kỹ năng giải phương trình, hiểu bản chất chuyển vế đổi dấu qua mô hình cân đĩa.',
    topic: 'Phương trình & Cân thăng bằng',
    subject: 'Toán Học',
    createdAt: '2026-10-05',
    questions: [
      {
        id: 'eq-q1',
        topic: 'Phương trình & Cân thăng bằng',
        type: 'multiple_choice',
        question: 'Nghiệm của phương trình 2x + 6 = 14 là:',
        options: ['x = 4', 'x = 10', 'x = 3', 'x = 8'],
        correctIndex: 0,
        explanation: 'Chuyển +6 sang vế phải thành -6: 2x = 14 - 6 = 8. Chia cả hai vế cho 2: x = 8 / 2 = 4.',
        tip: 'Thứ tự ưu tiên: Chuyển vế hằng số trước, sau đó mới chia cho hệ số của x.',
      },
      {
        id: 'eq-q2',
        topic: 'Phương trình & Cân thăng bằng',
        type: 'true_false',
        question: 'Khi chuyển một số hạng từ vế này sang vế kia của một phương trình, ta phải đổi dấu số hạng đó. Đúng hay Sai?',
        correctBool: true,
        explanation: 'ĐÚNG! Đây là quy tắc chuyển vế: Dấu (+) chuyển thành dấu (-), và dấu (-) chuyển thành dấu (+).',
        tip: 'Quy tắc này tương ứng việc bớt hoặc thêm cùng một lượng ở 2 đĩa cân để giữ thăng bằng.',
      },
      {
        id: 'eq-q3',
        topic: 'Phương trình & Cân thăng bằng',
        type: 'fill_blank',
        question: 'Giải phương trình: 5x - 7 = 18. Giá trị của x bằng bao nhiêu? (Chỉ điền số)',
        acceptableAnswers: ['5'],
        explanation: 'Chuyển -7 sang vế phải: 5x = 18 + 7 = 25. Chia cả hai vế cho 5: x = 25 / 5 = 5.',
        tip: 'Lưu ý: -7 khi chuyển vế sẽ đổi thành +7.',
      },
      {
        id: 'eq-q4',
        topic: 'Phương trình & Cân thăng bằng',
        type: 'multiple_choice',
        question: 'Trên đĩa cân bên trái có 3 hộp quà x và 4 viên bi 1g. Đĩa cân bên phải có 19 viên bi 1g. Cân đang thăng bằng. Khối lượng mỗi hộp quà x là:',
        options: ['5g', '4g', '6g', '7g'],
        correctIndex: 0,
        explanation: 'Phương trình cân: 3x + 4 = 19. Bớt 4 viên ở cả hai đĩa: 3x = 15. Chia đều cho 3 hộp: x = 5g.',
        tip: 'Tập hình dung thao tác bốc bi trên đĩa cân thực tế.',
      },
      {
        id: 'eq-q5',
        topic: 'Phương trình & Cân thăng bằng',
        type: 'multiple_choice',
        question: 'Phương trình nào dưới đây tương đương với phương trình x - 3 = 5?',
        options: ['x = 8', 'x = 2', '2x = 8', 'x + 3 = 5'],
        correctIndex: 0,
        explanation: 'Từ x - 3 = 5, chuyển -3 sang vế phải ta được x = 5 + 3 = 8.',
        tip: 'Hai phương trình tương đương là hai phương trình có cùng tập nghiệm.',
      },
    ],
  },
  {
    id: 'quiz-pkg-linear',
    title: 'Hàm Số Bậc Nhất & Đồ Thị y = ax + b',
    description: 'Bộ câu hỏi kiểm tra nhận biết hệ số góc a, tung độ gốc b, tính đồng biến/nghịch biến và điểm cắt trên hệ toạ độ.',
    topic: 'Đồ thị hàm số y = ax + b',
    subject: 'Toán Học',
    createdAt: '2026-10-05',
    questions: [
      {
        id: 'lin-q1',
        topic: 'Đồ thị hàm số y = ax + b',
        type: 'multiple_choice',
        question: 'Đường thẳng y = 3x - 4 cắt trục tung Oy tại điểm nào?',
        options: ['(0, -4)', '(0, 3)', '(-4, 0)', '(4/3, 0)'],
        correctIndex: 0,
        explanation: 'Khi cắt trục tung Oy thì x = 0. Thay x = 0 vào hàm số: y = 3(0) - 4 = -4. Vậy điểm cắt trục tung là (0, -4).',
        tip: 'Tung độ gốc b chính là tọa độ giao điểm với trục tung (0, b).',
      },
      {
        id: 'lin-q2',
        topic: 'Đồ thị hàm số y = ax + b',
        type: 'true_false',
        question: 'Hàm số bậc nhất y = -2x + 1 là hàm số đồng biến trên R. Đúng hay Sai?',
        correctBool: false,
        explanation: 'SAI! Vì hệ số a = -2 < 0 nên hàm số nghịch biến trên R (đồ thị có hướng đi xuống từ trái sang phải).',
        tip: 'Quy tắc: a > 0 là đồng biến (leo dốc), a < 0 là nghịch biến (xuống dốc).',
      },
      {
        id: 'lin-q3',
        topic: 'Đồ thị hàm số y = ax + b',
        type: 'multiple_choice',
        question: 'Hai đường thẳng (d1): y = 2x + 1 và (d2): y = 2x - 5 có vị trí tương đối như thế nào với nhau?',
        options: [
          'Song song với nhau',
          'Cắt nhau tại gốc toạ độ',
          'Trùng nhau',
          'Vuông góc với nhau',
        ],
        correctIndex: 0,
        explanation: 'Hai đường thẳng có cùng hệ số a = 2 và hệ số b khác nhau (b1 = 1 ≠ b2 = -5) nên chúng song song với nhau.',
        tip: 'Cùng hệ số góc a và khác tung độ gốc b ➜ Song song.',
      },
      {
        id: 'lin-q4',
        topic: 'Đồ thị hàm số y = ax + b',
        type: 'fill_blank',
        question: 'Đường thẳng y = ax + 3 đi qua điểm A(1, 7). Giá trị của hệ số a là bao nhiêu? (Chỉ điền số)',
        acceptableAnswers: ['4'],
        explanation: 'Vì đường thẳng đi qua A(1, 7) nên thay x = 1, y = 7 vào hàm số: 7 = a(1) + 3 ⟺ a = 7 - 3 = 4.',
        tip: 'Điểm thuộc đồ thị nghĩa là tọa độ của điểm đó phải thỏa mãn phương trình hàm số.',
      },
    ],
  },
  {
    id: 'quiz-pkg-fractions',
    title: 'Phân Số & Tỷ Số Thực Tế',
    description: 'Bộ câu hỏi về phân số, quy đồng mẫu, rút gọn và giải quyết bài toán chia bánh pizza thực tế.',
    topic: 'Phân số & Tỷ số',
    subject: 'Toán Học',
    createdAt: '2026-10-05',
    questions: [
      {
        id: 'frac-q1',
        topic: 'Phân số & Tỷ số',
        type: 'multiple_choice',
        question: 'Kết quả của phép tính 1/3 + 1/6 sau khi rút gọn tối giản là:',
        options: ['1/2', '2/9', '3/6', '2/6'],
        correctIndex: 0,
        explanation: 'Quy đồng mẫu số chung là 6: 1/3 = 2/6. Ta có 2/6 + 1/6 = 3/6. Rút gọn chia cả tử và mẫu cho 3 được 1/2.',
        tip: 'Luôn rút gọn phân số về dạng tối giản sau khi thực hiện phép tính!',
      },
      {
        id: 'frac-q2',
        topic: 'Phân số & Tỷ số',
        type: 'true_false',
        question: 'Khi cộng hai phân số cùng mẫu số, ta cộng tử số với tử số và cộng mẫu số với mẫu số. Đúng hay Sai?',
        correctBool: false,
        explanation: 'SAI! Quy tắc đúng: Ta cộng tử số với tử số và GIỮ NGUYÊN mẫu số. (Ví dụ: 1/5 + 2/5 = 3/5, chứ không phải 3/10).',
        tip: 'Mẫu số thể hiện kích thước miếng bánh, khi cộng miếng bánh không bị chia nhỏ thêm.',
      },
      {
        id: 'frac-q3',
        topic: 'Phân số & Tỷ số',
        type: 'fill_blank',
        question: 'Một lớp học có 40 học sinh, trong đó có 24 học sinh nữ. Phân số tối giản chỉ số học sinh nam trong lớp là a/b. Tử số a là bao nhiêu?',
        acceptableAnswers: ['2', '2/5'],
        explanation: 'Số học sinh nam là 40 - 24 = 16 học sinh. Phân số chỉ học sinh nam là 16/40 = (16:8)/(40:8) = 2/5. Tử số a = 2.',
        tip: 'Tìm số học sinh nam trước, sau đó lập phân số và rút gọn cho ước chung lớn nhất là 8.',
      },
      {
        id: 'frac-q4',
        topic: 'Phân số & Tỷ số',
        type: 'multiple_choice',
        question: 'Một chiếc bánh chia đều 8 phần. An ăn 2 phần, Bình ăn 3 phần. Phân số chỉ phần bánh CÒN LẠI là:',
        options: ['3/8', '5/8', '2/8', '1/8'],
        correctIndex: 0,
        explanation: 'Tổng phần An và Bình ăn là: 2/8 + 3/8 = 5/8 cái bánh. Phần bánh còn lại là 1 - 5/8 = 8/8 - 5/8 = 3/8 cái bánh.',
        tip: 'Một chiếc bánh nguyên vẹn tương ứng với phân số 1 = 8/8.',
      },
    ],
  },
];

export function getSavedQuizzes(): SavedQuizPackage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SAVED_QUIZZES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Could not read saved quizzes from localStorage:', e);
  }
  return DEFAULT_SAVED_QUIZZES;
}

export function saveQuizPackages(packages: SavedQuizPackage[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_SAVED_QUIZZES, JSON.stringify(packages));
  } catch (e) {
    console.warn('Could not write saved quizzes to localStorage:', e);
  }
}
