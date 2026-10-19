import { PromptTemplate } from '../types';

export const PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    id: 'material-intake-v1',
    title: 'Screen Nhập Học Liệu Đầu Vào (Text-First, Ảnh & URL)',
    category: 'master',
    level: 'Mọi cấp học (Lớp 1 - 12)',
    summary: 'Prompt tạo screen/component nạp học liệu thân thiện cho học sinh với trải nghiệm text-first, hỗ trợ ảnh chụp trang sách và liên kết bài giảng.',
    tags: ['Học liệu đầu vào', 'Text-First', 'Ảnh chụp SGK', 'URL bài giảng', 'Danh sách nguồn'],
    useCase: 'Tạo màn hình tiếp nhận học liệu đầu vào trước khi đưa vào các mô hình học tập/mô phỏng trực quan.',
    keyFeatures: [
      'Chọn hoặc mở môn/chủ đề đang học',
      'Thêm nguồn dạng text (ưu tiên text-first)',
      'Thêm nguồn dạng hình ảnh kéo thả',
      'Thêm nguồn dạng URL',
      'Hiển thị danh sách nguồn đã thêm trực quan',
      'Ngôn ngữ học tập thân thiện'
    ],
    fullPrompt: `Hãy tạo screen/component cho phần nhập học liệu đầu vào trong app React hiện tại.

Yêu cầu:
- chọn hoặc mở môn/chủ đề đang học
- thêm nguồn dạng text
- thêm nguồn dạng hình ảnh
- thêm nguồn dạng URL
- hiển thị danh sách nguồn đã thêm
- giao diện đơn giản, rõ ràng, dễ dùng cho học sinh
- ưu tiên trải nghiệm text-first
- ngôn ngữ hiển thị thiên về học tập, không thiên về kỹ thuật`
  },
  {
    id: 'master-math-v1',
    title: 'Bản Khung Tổng Quát (Master Framework v.01) - Ứng Dụng Toán Trực Quan',
    category: 'master',
    level: 'Mọi cấp độ (Lớp 1 - 12)',
    summary: 'Prompt chuẩn hoàn chỉnh nhất để tạo một khung ứng dụng/bài giảng Toán học trực quan, giảm tải nhận thức, người học chạm/kéo là hiểu ngay.',
    tags: ['Master Prompt', 'Toàn diện', 'Dễ hiểu', 'Tương tác', 'React/Tailwind'],
    useCase: 'Dùng khi muốn dựng toàn bộ ứng dụng web học Toán hoặc một module bài giảng hoàn chỉnh từ A đến Z.',
    keyFeatures: [
      'Áp dụng mô hình CPA (Cụ thể → Hình ảnh → Trừu tượng)',
      'Thanh trượt tham số phản hồi dưới 50ms',
      'Giải thích bằng ẩn dụ đời sống thường nhật',
      'Giao diện tối giản, không gây xao nhãng'
    ],
    fullPrompt: `Bạn là một Chuyên gia Thiết kế Trải nghiệm Học tập (Learning Experience Designer) và Lập trình viên Front-end cấp cao.

HÃY DỰNG "BẢN KHUNG MÔN TOÁN V.01" VỚI MỤC TIÊU: BIẾN MỌI KHÁI NIỆM TOÁN HỌC TRỞ NÊN CỰC KỲ DỄ HIỂU, TRỰC QUAN VÀ THAO TÁC ĐƯỢC NGAY.

1. NGUYÊN TẮC THIẾT KẾ CỐT LÕI (DỄ HIỂU HÓA):
- Nguyên tắc CPA (Concrete → Pictorial → Abstract): Bắt đầu bằng vật thể đời thực (miếng bánh, bước chân, con lắc), chuyển sang đồ thị/hình khối hình học, rồi mới xuất hiện công thức đại số.
- Không dùng ngôn ngữ hàn lâm khô khan: Dùng ẩn dụ đời sống (Ví dụ: "Hệ số góc $a$ chính là độ dốc của con dốc mà bạn đang đạp xe").
- Phản hồi trực quan tức thì: Người dùng kéo thanh trượt (slider) hoặc chạm vào đâu thì hình ảnh biến đổi ngay lập tức.
- 1 Màn hình = 1 Khái niệm trọng tâm (Không nhồi nhét, giảm tải nhận thức).

2. CẤU TRÚC 4 KHỐI CỦA BẢN KHUNG V.01:
- Khối 1: KHỞI ĐỘNG TRỰC GIÁC (Intuition Anchor): 1 câu hỏi khơi gợi tò mò kèm hình ảnh động trực quan đời thực.
- Khối 2: PHÒNG THÍ NGHIỆM TƯƠNG TÁC (Interactive Playground): 
  + Bộ điều khiển trực quan (Sliders, Toggle buttons, Drag points).
  + Khung vẽ động (SVG/Canvas phản hồi mượt mà theo giá trị thay đổi).
  + Thẻ "Điều gì đang diễn ra?" giải thích biến đổi số học theo thời gian thực.
- Khối 3: CẦU NỐI CÔNG THỨC (Formula Bridge): Kết nối những gì vừa thấy trên hình thành công thức toán học ngắn gọn.
- Khối 4: THỬ THÁCH NHỎ 10 GIÂY (Micro-Challenge): 1 câu đố tương tác nhanh có giải thích động viên nếu chọn sai.

3. YÊU CẦU CÔNG NGHỆ:
- Framework: React (TypeScript) + Tailwind CSS + Lucide Icons + Motion animation.
- Thiết kế responsive tốt trên cả điện thoại và máy tính, màu sắc tươi sáng, tương phản đạt chuẩn WCAG AA.`
  },
  {
    id: 'fractions-visualizer',
    title: 'Bản Khung Phân Số & Tỷ Lệ (Dễ Hiểu Qua Ẩn Dụ Chiếc Bánh & Thanh Chia)',
    category: 'concept',
    level: 'Tiểu học - THCS (Lớp 3 - 6)',
    summary: 'Prompt chuyên biệt để xây dựng khung học phân số, tử số, mẫu số và so sánh phân số thông qua chia cắt hình học tương tác.',
    tags: ['Phân số', 'Tiểu học', 'Ẩn dụ đời thực', 'Cắt lát bánh'],
    useCase: 'Tạo công cụ giúp học sinh không còn sợ phân số bằng cách nhìn thấy trực tiếp "chia đều" và "lấy ra".',
    keyFeatures: [
      'Thanh kéo điều chỉnh Mẫu số (chia mấy phần) và Tử số (lấy mấy phần)',
      'Minh họa đồng thời hình tròn (bánh pizza) và hình chữ nhật (thanh kẹo)',
      'Tự động hiển thị tỷ lệ %, số thập phân tương ứng',
      'So sánh 2 phân số cạnh nhau bằng màu sắc trực quan'
    ],
    fullPrompt: `Hãy lập trình một module học phân số trực quan "Bản Khung Phân Số v.01" bằng React và Tailwind CSS, cực kỳ dễ hiểu cho học sinh lớp 3-6.

MỤC TIÊU SƯ PHẠM:
- Học sinh hiểu bản chất: "Mẫu số là chia chiếc bánh làm mấy phần bằng nhau", "Tử số là ta đã ăn/lấy đi bao nhiêu phần".
- Không bắt học sinh học thuộc lòng quy tắc ngay, mà để các em tự tay kéo thanh trượt để "thấy" phân số lớn lên hay nhỏ đi.

CÁC TÍNH NĂNG CẦN CÓ TRONG BẢN KHUNG:
1. Bộ điều khiển tương tác:
   - Slider 1: Mẫu số (từ 1 đến 12).
   - Slider 2: Tử số (từ 0 đến Mẫu số).
2. Khu vực hiển thị đồ họa SVG:
   - Vẽ hình tròn chia lát (pizza) với các lát được tô màu sống động theo tử số.
   - Vẽ thanh chữ nhật chia ô (chocolate bar) để quan sát tỷ lệ chiều dài.
3. Bảng phân tích dễ hiểu:
   - Hiển thị phân số lớn dạng $\\frac{a}{b}$.
   - Chuyển đổi trực tiếp sang Phần trăm (ví dụ: $3/4 = 75\\%$) và Số thập phân ($0.75$).
   - Nhận xét bằng ngôn ngữ tự nhiên: "Bạn đã lấy hơn một nửa chiếc bánh rồi đấy!"
4. Thử thách tìm phân số tương đương: (Ví dụ kéo sao cho $2/4 = 1/2$).`
  },
  {
    id: 'linear-function-slider',
    title: 'Bản Khung Hàm Số & Đồ Thị $y = ax + b$ (Kéo Hệ Số Xem Độ Dốc Đổi Màu)',
    category: 'concept',
    level: 'THCS - THPT (Lớp 8 - 10)',
    summary: 'Prompt dựng khung trực quan giải thích đồ thị tọa độ Oxy, hệ số góc và tung độ gốc bằng màu sắc và thanh trượt chuyển động.',
    tags: ['Đại số', 'Hàm số bậc nhất', 'Hệ trục Oxy', 'Độ dốc'],
    useCase: 'Dành cho bài giảng hoặc app giúp người học hiểu ý nghĩa hình học của a và b trong y = ax + b.',
    keyFeatures: [
      'Hệ trục tọa độ SVG có lưới kẻ ô rõ ràng',
      'Thanh trượt a (độ dốc) từ âm sang dương, kèm mũi tên hướng dốc',
      'Thanh trượt b (điểm cắt trục tung) nhấp nháy làm nổi bật giao điểm',
      'Hiển thị phương trình toán học đổi màu theo từng tham số'
    ],
    fullPrompt: `Dựng một bản khung tương tác trực quan "Hàm số bậc nhất $y = ax + b$ v.01" bằng React và Tailwind CSS.

YÊU CẦU GIAO DIỆN & TƯƠNG TÁC DỄ HIỂU:
1. Trục tọa độ Oxy trực quan:
   - Lưới tọa độ SVG rõ ràng, có các mốc số nguyên từ -10 đến +10.
   - Đường thẳng $y = ax + b$ vẽ bằng nét đậm với màu sắc nổi bật.
2. Hai thanh trượt tham số (Sliders):
   - Thanh trượt $a$ (Hệ số góc, từ -5 đến 5):
     + Khi $a > 0$: Hiện ghi chú "Đường thẳng đi lên từ trái sang phải (đồng biến - leo dốc)".
     + Khi $a = 0$: Đường thẳng nằm ngang hoàn toàn ($y = b$).
     + Khi $a < 0$: Hiện ghi chú "Đường thẳng đi xuống (nghịch biến - xuống dốc)".
   - Thanh trượt $b$ (Tung độ gốc, từ -5 đến 5):
     + Đánh dấu chấm tròn nổi bật tại tọa độ $(0, b)$ trên trục Oy để người học hiểu ngay $b$ là gì.
3. Tính trực quan đời sống:
   - Minh họa ẩn dụ: Một người trượt ván hoặc leo núi trên đường thẳng để cảm nhận độ dốc.
4. Bảng tính nhanh tọa độ:
   - Cho phép nhập thử giá trị $x$ và thấy chấm tròn chạy đến điểm tương ứng trên đường thẳng.`
  },
  {
    id: 'pythagorean-theorem',
    title: 'Bản Khung Định Lý Pytago (Diện Tích 3 Hình Vuông - Thấy Là Hiểu)',
    category: 'geometry',
    level: 'THCS (Lớp 7 - 9)',
    summary: 'Prompt tạo mô phỏng hình học động chứng minh định lý Pytago $a^2 + b^2 = c^2$ thông qua trực giác bảo toàn diện tích tích hợp.',
    tags: ['Hình học', 'Pytago', 'Tam giác vuông', 'Chứng minh trực quan'],
    useCase: 'Giúp học sinh hiểu tại sao $a^2 + b^2 = c^2$ bằng cách nhìn diện tích thực tế thay vì học vẹt công thức.',
    keyFeatures: [
      'Tam giác vuông động với 2 cạnh góc vuông kéo chỉnh được',
      '3 hình vuông áp vào 3 cạnh tam giác với diện tích ghi rõ bên trong',
      'Hiển thị phương trình số học khớp chính xác: $Diện tích A + Diện tích B = Diện tích C$',
      'Chế độ xem các bộ ba số Pytago đẹp (3-4-5, 5-12-13, 6-8-10)'
    ],
    fullPrompt: `Tạo một bản khung web tương tác "Khám phá Định lý Pytago v.01" bằng React, Tailwind CSS và SVG.

MỤC TIÊU: Chứng minh trực quan định lý $a^2 + b^2 = c^2$ cho học sinh theo cách dễ hiểu nhất lịch sử:
"Bình phương một cạnh không phải là phép toán vô hình, mà chính là DIỆN TÍCH của một hình vuông dựng trên cạnh đó!"

CÁC KHỐI THÀNH PHẦN:
1. Khung vẽ hình học SVG động:
   - Một tam giác vuông $ABC$ vuông tại $A$.
   - Trên cạnh $a$: dựng hình vuông diện tích $a^2$ (tô màu xanh dương).
   - Trên cạnh $b$: dựng hình vuông diện tích $b^2$ (tô màu xanh lá).
   - Trên cạnh huyền $c$: dựng hình vuông diện tích $c^2$ (tô màu cam/vàng).
2. Thanh kéo chỉnh độ dài 2 cạnh góc vuông $a$ và $b$ (từ 3 đến 8).
3. Bảng số liệu tự động cập nhật:
   - $a^2 = \\dots$ (ô màu xanh dương).
   - $b^2 = \\dots$ (ô màu xanh lá).
   - $a^2 + b^2 = \\dots$ (tổng diện tích).
   - $c^2 = \\dots$ và $c = \\sqrt{a^2 + b^2}$.
4. Nút bấm thử nhanh các bộ số nguyên Pytago kinh điển: [3, 4, 5], [5, 12, 13], [6, 8, 10].`
  },
  {
    id: 'step-solver-socratic',
    title: 'Bản Khung Giải Toán Từng Bước Khơi Gợi Tư Duy (Phương Pháp Socrates)',
    category: 'solver',
    level: 'Mọi cấp độ',
    summary: 'Prompt thiết kế giao diện hướng dẫn học sinh tự tìm ra đáp số qua từng câu hỏi gợi mở, không đưa ngay lời giải sẵn.',
    tags: ['Giải từng bước', 'Khơi gợi tư duy', 'Phản hồi thông minh', 'Socrates'],
    useCase: 'Ứng dụng gia sư AI hoặc giáo viên số hỗ trợ học sinh giải toán có tư duy phản biện.',
    keyFeatures: [
      'Chia bài toán phức tạp thành 3-4 bước siêu nhỏ',
      'Học sinh chỉ cần trả lời 1 bước rồi mới mở khóa bước tiếp theo',
      'Gợi ý nhẹ nhàng (Hint) khi học sinh bí, không làm hộ',
      'Tổng kết sơ đồ tư duy sau khi hoàn thành'
    ],
    fullPrompt: `Hãy thiết kế một bản khung "Gia sư giải Toán từng bước v.01" bằng React + Tailwind CSS theo phương pháp gợi mở Socrates.

QUY TẮC SƯ PHẠM:
- Tuyệt đối KHÔNG hiện nguyên văn lời giải dài ngoằng khiến học sinh nản lòng.
- Chia bài toán thành từng nấc thang nhỏ (Micro-steps).
- Mỗi nấc thang yêu cầu học sinh thực hiện một quan sát hoặc tính toán đơn giản.

CẤU TRÚC GIAO DIỆN:
1. Đề bài ngắn gọn + Hình minh họa trực quan.
2. Thanh tiến trình (Step 1 → Step 2 → Step 3 → Hoàn thành).
3. Thẻ bước hiện tại:
   - Câu hỏi gợi ý: "Em hãy quan sát xem trong phương trình $2x + 4 = 10$, số hạng nào tự do cần chuyển vế trước?"
   - Các lựa chọn hoặc ô điền kết quả nhanh.
   - Nút "Xem gợi ý nhỏ" (không lộ đáp số).
4. Phản hồi động viên tức thì kèm giải thích bằng sơ đồ cán cân thăng bằng (Equilibrium Scale).`
  }
];

export const MATH_TOPIC_CONFIGS = [
  { id: 'fractions', name: 'Phân số & Tỷ lệ', grade: 'Tiểu học - THCS', icon: 'PieChart' },
  { id: 'algebra', name: 'Hàm số & Phương trình', grade: 'THCS - THPT', icon: 'TrendingUp' },
  { id: 'geometry', name: 'Hình học & Định lý Pytago', grade: 'THCS', icon: 'Triangle' },
];
