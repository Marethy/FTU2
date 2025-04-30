export const questions = [
  {
    id: 1,
    question: 'Bạn thích hoạt động nào nhất?',
    type: 'radio',
    options: [
      { value: 'A', label: 'Giao tiếp và thuyết trình', points: 3 },
      { value: 'B', label: 'Lập kế hoạch và tổ chức', points: 2 },
      { value: 'C', label: 'Sáng tạo và thiết kế', points: 4 },
      { value: 'D', label: 'Phân tích và giải quyết vấn đề', points: 5 }
    ]
  },
  {
    id: 2,
    question: 'Bạn muốn phát triển kỹ năng nào?',
    type: 'checkbox',
    options: [
      { value: 'A', label: 'Kỹ năng lãnh đạo', points: 3 },
      { value: 'B', label: 'Kỹ năng giao tiếp', points: 2 },
      { value: 'C', label: 'Kỹ năng làm việc nhóm', points: 4 },
      { value: 'D', label: 'Kỹ năng quản lý thời gian', points: 5 }
    ]
  },
  {
    id: 3,
    question: 'Bạn có bao nhiêu thời gian tham gia CLB mỗi tuần?',
    type: 'radio',
    options: [
      { value: 'A', label: 'Dưới 5 giờ', points: 2 },
      { value: 'B', label: '5-10 giờ', points: 3 },
      { value: 'C', label: '10-15 giờ', points: 4 },
      { value: 'D', label: 'Trên 15 giờ', points: 5 }
    ]
  },
  {
    id: 4,
    question: 'Bạn quan tâm đến lĩnh vực nào?',
    type: 'checkbox',
    options: [
      { value: 'A', label: 'Kinh doanh', points: 3 },
      { value: 'B', label: 'Công nghệ', points: 4 },
      { value: 'C', label: 'Văn hóa - Nghệ thuật', points: 2 },
      { value: 'D', label: 'Thể thao', points: 5 }
    ]
  },
  {
    id: 5,
    question: 'Mục tiêu của bạn khi tham gia CLB là gì?',
    type: 'radio',
    options: [
      { value: 'A', label: 'Phát triển kỹ năng mềm', points: 3 },
      { value: 'B', label: 'Mở rộng mối quan hệ', points: 4 },
      { value: 'C', label: 'Học hỏi kiến thức mới', points: 5 },
      { value: 'D', label: 'Tham gia hoạt động cộng đồng', points: 2 }
    ]
  }
]; 