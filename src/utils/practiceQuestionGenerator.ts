import { PracticeQuestion, PracticeQuestionType, TargetGrade } from '../types';

/**
 * Intelligent generator that creates realistic, curriculum-aligned basic questions
 * for the requested topic and grade level.
 */
export function generateQuestionsForTopic(
  topic: string,
  grade: TargetGrade = 'Lớp 7',
  count: number = 4
): PracticeQuestion[] {
  const normalized = topic.toLowerCase();
  const timestamp = new Date().toLocaleDateString('vi-VN');

  // Topic: Pythagoras
  if (normalized.includes('pytago') || normalized.includes('tam giác vuông')) {
    return [
      {
        id: `gen-py-${Date.now()}-1`,
        topic,
        gradeLevel: grade,
        type: 'true_false',
        prompt: 'Trong tam giác vuông, cạnh huyền luôn luôn là cạnh có độ dài lớn nhất.',
        contextNote: 'Xét góc vuông 90° và quan hệ giữa các cạnh trong tam giác.',
        correctBool: true,
        explanation: 'Vì góc vuông (90°) là góc lớn nhất trong tam giác vuông, cạnh đối diện với góc lớn nhất luôn là cạnh lớn nhất. Do đó cạnh huyền luôn lớn hơn từng cạnh góc vuông. Phát biểu trên là ĐÚNG.',
        curriculumRef: `SGK ${grade} - Quan hệ giữa góc và cạnh đối diện`,
        createdAt: timestamp,
      },
      {
        id: `gen-py-${Date.now()}-2`,
        topic,
        gradeLevel: grade,
        type: 'multiple_choice',
        prompt: 'Bộ ba số nào sau đây tạo thành độ dài ba cạnh của một tam giác vuông?',
        options: ['2, 3, 4', '3, 4, 5', '4, 5, 6', '5, 6, 7'],
        correctOptionIndex: 1,
        explanation: 'Kiểm tra theo định lý Pytago đảo:\n3² + 4² = 9 + 16 = 25 = 5² (Thỏa mãn).\nCác bộ số khác đều không thỏa mãn tổng bình phương hai cạnh nhỏ bằng bình phương cạnh lớn.',
        curriculumRef: `SGK ${grade} - Bộ ba số Pytago`,
        createdAt: timestamp,
      },
      {
        id: `gen-py-${Date.now()}-3`,
        topic,
        gradeLevel: grade,
        type: 'fill_blank',
        prompt: 'Một tam giác vuông có hai cạnh góc vuông là 9 cm và 12 cm. Độ dài cạnh huyền bằng bao nhiêu cm? (Chỉ điền số)',
        blankPlaceholder: 'Nhập số (ví dụ: 15)',
        acceptableAnswers: ['15', '15cm', '15 cm'],
        explanation: 'Theo Pytago: c² = 9² + 12² = 81 + 144 = 225 ➜ c = √225 = 15 cm.',
        curriculumRef: `SGK ${grade} - Tính cạnh huyền`,
        createdAt: timestamp,
      },
      {
        id: `gen-py-${Date.now()}-4`,
        topic,
        gradeLevel: grade,
        type: 'short_answer',
        prompt: 'Viết công thức tính cạnh góc vuông a khi đã biết cạnh huyền c và cạnh góc vuông b trong tam giác vuông.',
        referenceAnswer: 'a = √(c² - b²) hoặc a² = c² - b²',
        keywords: ['c² - b²', 'căn', 'c^2 - b^2'],
        explanation: 'Từ hệ thức a² + b² = c², chuyển vế ta được: a² = c² - b² ➜ a = √(c² - b²). Chú ý c phải lớn hơn b.',
        curriculumRef: `SGK ${grade} - Biến đổi công thức Pytago`,
        createdAt: timestamp,
      },
    ];
  }

  // Topic: Algebra / Equations
  if (normalized.includes('phương trình') || normalized.includes('chuyển vế') || normalized.includes('cân')) {
    return [
      {
        id: `gen-eq-${Date.now()}-1`,
        topic,
        gradeLevel: grade,
        type: 'true_false',
        prompt: 'Phương trình 3x - 6 = 0 có nghiệm duy nhất là x = 2.',
        correctBool: true,
        explanation: 'Chuyển -6 sang vế phải đổi dấu thành +6:\n3x = 6 ➜ x = 6 / 3 = 2. Phát biểu là ĐÚNG.',
        curriculumRef: `SGK ${grade} - Phương trình bậc nhất một ẩn`,
        createdAt: timestamp,
      },
      {
        id: `gen-eq-${Date.now()}-2`,
        topic,
        gradeLevel: grade,
        type: 'multiple_choice',
        prompt: 'Nghiệm của phương trình 5x + 10 = 25 là:',
        options: ['x = 2', 'x = 3', 'x = 5', 'x = 7'],
        correctOptionIndex: 1,
        explanation: 'Các bước giải chi tiết:\n5x = 25 - 10\n5x = 15\nx = 15 / 5 = 3.\nVậy đáp án đúng là x = 3.',
        curriculumRef: `SGK ${grade} - Giải phương trình một ẩn`,
        createdAt: timestamp,
      },
      {
        id: `gen-eq-${Date.now()}-3`,
        topic,
        gradeLevel: grade,
        type: 'fill_blank',
        prompt: 'Tìm x biết: 4x - 8 = 16. Điền giá trị của x:',
        blankPlaceholder: 'Ví dụ: 6',
        acceptableAnswers: ['6', 'x=6', 'x = 6'],
        explanation: '4x = 16 + 8 = 24 ➜ x = 24 / 4 = 6.',
        curriculumRef: `SGK ${grade} - Tìm x trong phương trình`,
        createdAt: timestamp,
      },
      {
        id: `gen-eq-${Date.now()}-4`,
        topic,
        gradeLevel: grade,
        type: 'short_answer',
        prompt: 'Khi nhân hoặc chia cả hai vế của một phương trình với cùng một số, điều kiện của số đó là gì?',
        referenceAnswer: 'Số đó bắt buộc phải khác 0 (không được phép nhân hoặc chia cả hai vế cho 0).',
        keywords: ['khác 0', 'không được bằng 0', '≠ 0'],
        explanation: 'Quy tắc nhân cả hai vế của phương trình: Ta có thể nhân hoặc chia cả hai vế của phương trình với cùng một số KHÁC 0. Nếu nhân với 0 sẽ biến mọi phương trình thành 0 = 0 (mất thông tin), và phép chia cho 0 không xác định.',
        curriculumRef: `SGK ${grade} - Quy tắc nhân với một số`,
        createdAt: timestamp,
      },
    ];
  }

  // Topic: Fractions
  if (normalized.includes('phân số') || normalized.includes('tỉ số') || normalized.includes('tỷ')) {
    return [
      {
        id: `gen-fr-${Date.now()}-1`,
        topic,
        gradeLevel: grade,
        type: 'true_false',
        prompt: 'Hai phân số 2/5 và 4/10 là bằng nhau.',
        correctBool: true,
        explanation: 'Rút gọn phân số 4/10 bằng cách chia cả tử và mẫu cho 2 ta được 2/5. Hoặc nhân chéo: 2 × 10 = 5 × 4 = 20. Do đó hai phân số này bằng nhau. Phát biểu là ĐÚNG.',
        curriculumRef: `SGK ${grade} - Hai phân số bằng nhau`,
        createdAt: timestamp,
      },
      {
        id: `gen-fr-${Date.now()}-2`,
        topic,
        gradeLevel: grade,
        type: 'multiple_choice',
        prompt: 'Kết quả của phép tính 2/3 + 1/6 là:',
        options: ['3/9', '5/6', '3/6', '1/2'],
        correctOptionIndex: 1,
        explanation: 'Quy đồng mẫu số chung là 6:\n2/3 = 4/6\n4/6 + 1/6 = 5/6. Đáp án đúng là 5/6.',
        curriculumRef: `SGK ${grade} - Phép cộng phân số`,
        createdAt: timestamp,
      },
      {
        id: `gen-fr-${Date.now()}-3`,
        topic,
        gradeLevel: grade,
        type: 'fill_blank',
        prompt: 'Tìm phân số tối giản của 15/45. Kết quả là:',
        blankPlaceholder: 'Ví dụ: 1/3',
        acceptableAnswers: ['1/3', '1 / 3'],
        explanation: 'Chia cả tử và mẫu cho ước chung lớn nhất là 15:\n15 : 15 = 1\n45 : 15 = 3\nKết quả là 1/3.',
        curriculumRef: `SGK ${grade} - Rút gọn phân số tối giản`,
        createdAt: timestamp,
      },
      {
        id: `gen-fr-${Date.now()}-4`,
        topic,
        gradeLevel: grade,
        type: 'short_answer',
        prompt: 'Nêu quy tắc thực hiện phép chia hai phân số a/b cho c/d (với b, c, d khác 0).',
        referenceAnswer: 'Muốn chia phân số a/b cho phân số c/d, ta lấy a/b nhân với phân số nghịch đảo của c/d (tức là nhân với d/c).',
        keywords: ['nhân với nghịch đảo', 'nhân đảo ngược', 'a/b nhân d/c'],
        explanation: 'Công thức: (a/b) : (c/d) = (a/b) × (d/c) = (a × d) / (b × c). Phép chia phân số được chuyển thành phép nhân với phân số nghịch đảo.',
        curriculumRef: `SGK ${grade} - Phép chia phân số`,
        createdAt: timestamp,
      },
    ];
  }

  // Topic: Linear Functions / Graphs
  if (normalized.includes('hàm số') || normalized.includes('đồ thị') || normalized.includes('tọa độ')) {
    return [
      {
        id: `gen-fn-${Date.now()}-1`,
        topic,
        gradeLevel: grade,
        type: 'true_false',
        prompt: 'Đồ thị hàm số y = 3x là một đường thẳng đi qua gốc tọa độ O(0, 0).',
        correctBool: true,
        explanation: 'Hàm số dạng y = ax (khi b = 0) luôn đi qua gốc tọa độ O(0, 0) vì khi x = 0 thì y = 3(0) = 0. Phát biểu là ĐÚNG.',
        curriculumRef: `SGK ${grade} - Đồ thị hàm số y = ax`,
        createdAt: timestamp,
      },
      {
        id: `gen-fn-${Date.now()}-2`,
        topic,
        gradeLevel: grade,
        type: 'multiple_choice',
        prompt: 'Điểm nào sau đây thuộc đồ thị hàm số y = 2x + 1?',
        options: ['A(1, 2)', 'B(1, 3)', 'C(2, 4)', 'D(0, 2)'],
        correctOptionIndex: 1,
        explanation: 'Thay tọa độ từng điểm vào hàm số:\nVới B(1, 3): Thay x = 1 ta có y = 2(1) + 1 = 3 (Đúng bằng tung độ của B). Vậy điểm B(1, 3) thuộc đồ thị.',
        curriculumRef: `SGK ${grade} - Nhận biết điểm thuộc đồ thị`,
        createdAt: timestamp,
      },
      {
        id: `gen-fn-${Date.now()}-3`,
        topic,
        gradeLevel: grade,
        type: 'fill_blank',
        prompt: 'Tung độ gốc của đường thẳng y = -4x + 7 là:',
        blankPlaceholder: 'Nhập số (ví dụ: 7)',
        acceptableAnswers: ['7', 'b=7', 'b = 7'],
        explanation: 'Trong phương trình đường thẳng y = ax + b, hệ số tự do b chính là tung độ gốc. Ở đây b = 7.',
        curriculumRef: `SGK ${grade} - Tung độ gốc của hàm số bậc nhất`,
        createdAt: timestamp,
      },
      {
        id: `gen-fn-${Date.now()}-4`,
        topic,
        gradeLevel: grade,
        type: 'short_answer',
        prompt: 'Nếu hệ số góc a của đường thẳng y = ax + b là một số âm (a < 0), thì đồ thị dốc lên hay dốc xuống từ trái qua phải?',
        referenceAnswer: 'Đồ thị dốc xuống từ trái qua phải (hàm số nghịch biến trên tập xác định).',
        keywords: ['dốc xuống', 'nghịch biến', 'đi xuống'],
        explanation: 'Khi a < 0, hàm số là hàm nghịch biến (khi x tăng thì y giảm), do đó đồ thị nghiêng về phía bên trái và dốc xuống từ trái sang phải.',
        curriculumRef: `SGK ${grade} - Chiều biến thiên của hàm số bậc nhất`,
        createdAt: timestamp,
      },
    ];
  }

  // Fallback / General Math Topic for the selected grade
  return [
    {
      id: `gen-gen-${Date.now()}-1`,
      topic,
      gradeLevel: grade,
      type: 'true_false',
      prompt: `Mọi số tự nhiên lớn hơn 1 đều có ít nhất hai ước số là 1 và chính nó.`,
      contextNote: `Nội dung ôn bài môn Toán ${grade}.`,
      correctBool: true,
      explanation: 'Đây là định nghĩa cơ bản về số tự nhiên: mọi số nguyên lớn hơn 1 luôn chia hết cho 1 và chính nó. Phát biểu là ĐÚNG.',
      curriculumRef: `SGK Toán ${grade} - Khái niệm cơ bản`,
      createdAt: timestamp,
    },
    {
      id: `gen-gen-${Date.now()}-2`,
      topic,
      gradeLevel: grade,
      type: 'multiple_choice',
      prompt: `Khi giải bài toán về chủ đề "${topic}", bước đầu tiên học sinh cần làm là gì?`,
      options: [
        'Đọc kỹ đề bài và xác định giả thiết, kết luận cần tìm',
        'Viết ngay kết quả số bất kỳ',
        'Vẽ hình trang trí',
        'Bỏ qua các điều kiện ràng buộc',
      ],
      correctOptionIndex: 0,
      explanation: 'Để giải chính xác mọi bài toán trong chương trình phổ thông, bước đầu tiên bắt buộc là đọc kỹ đề, phân tích dữ kiện cho trước (giả thiết) và yêu cầu bài toán (kết luận).',
      curriculumRef: `SGK Toán ${grade} - Phương pháp giải toán`,
      createdAt: timestamp,
    },
    {
      id: `gen-gen-${Date.now()}-3`,
      topic,
      gradeLevel: grade,
      type: 'fill_blank',
      prompt: `Trong hình chữ nhật có chiều dài 8 cm và chiều rộng 5 cm, chu vi của hình chữ nhật đó là bao nhiêu cm? (Chỉ điền số)`,
      blankPlaceholder: 'Ví dụ: 26',
      acceptableAnswers: ['26', '26cm', '26 cm'],
      explanation: 'Chu vi hình chữ nhật = (chiều dài + chiều rộng) × 2 = (8 + 5) × 2 = 13 × 2 = 26 cm.',
      curriculumRef: `SGK Toán ${grade} - Tính chu vi và diện tích`,
      createdAt: timestamp,
    },
    {
      id: `gen-gen-${Date.now()}-4`,
      topic,
      gradeLevel: grade,
      type: 'short_answer',
      prompt: `Nêu một sai lầm phổ biến nhất của học sinh khi làm bài kiểm tra chủ đề "${topic}" và cách khắc phục.`,
      referenceAnswer: 'Sai lầm phổ biến là quên đặt điều kiện xác định, tính toán nhầm dấu hoặc vội vàng không kiểm tra lại kết quả. Khắc phục bằng cách viết rõ điều kiện và thử lại nghiệm.',
      keywords: ['quên điều kiện', 'nhầm dấu', 'kiểm tra lại', 'thử lại'],
      explanation: 'Trong các bài thi trên lớp, học sinh thường mất điểm do lỗi chuyển vế không đổi dấu hoặc quên đặt điều kiện. Việc dành 1 phút thử lại kết quả sẽ giúp đạt điểm tối đa.',
      curriculumRef: `SGK Toán ${grade} - Kỹ năng làm bài thi`,
      createdAt: timestamp,
    },
  ];
}
