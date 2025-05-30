# activeU

A platform for connecting students with clubs, activities, and volunteer opportunities at activeU.

## Frontend Setup

```bash
# Navigate to frontend directory (or root if not in subfolder)
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`.

## Features

- Club listings and filtering
- Volunteer opportunities
- Student activities and points tracking
- Contests and competitions
- Modern UI with Ant Design components
- Responsive design

## UI/UX Design System

### Colors
- Primary: UFM Blue (#0057a3)
- Background: Light Gray (#f0f2f5)
- Container: White (#ffffff)
- Border: Light Gray (#e8e8e8)

### Typography
- Font Family: System font stack
- Base Size: 14px
- Headings:
  - H1: 24px, 600 weight
  - H2: 20px, 600 weight
  - H3: 16px, 500 weight

### Components
- Cards: 8px border radius, subtle shadow
- Buttons: 6px border radius, hover effects
- Tables: Alternating row colors, hover highlight
- Forms: Consistent spacing, clear focus states

### Accessibility
- WCAG AA compliant color contrast
- Keyboard navigation support
- Focus indicators for interactive elements
- Semantic HTML structure

### Layout
- Fixed header with navigation
- Breadcrumb for wayfinding
- Maximum content width: 1280px
- Consistent spacing (16px/24px)

## Theme

The application uses UFM blue (#0057a3) as its primary color throughout the interface.

## Công nghệ sử dụng

- Next.js
- React
- Ant Design

## Yêu cầu hệ thống

- Node.js 14.x trở lên
- npm 6.x trở lên

## Cài đặt

1. Clone repository:
```bash
git clone [repository-url]
cd ftu2-connect
```

2. Cài đặt dependencies:
```bash
npm install
```

## Chạy ứng dụng

1. Development mode:
```bash
npm run dev
```

2. Build production:
```bash
npm run build
```

3. Start production server:
```bash
npm start
```

## Cấu trúc thư mục

- `/components`: Các component tái sử dụng
- `/data`: Dữ liệu mẫu
- `/pages`: Các trang của ứng dụng
- `/styles`: Global styles và theme configuration

## Tính năng

- Xem danh sách câu lạc bộ
- Tìm kiếm và lọc câu lạc bộ
- Đăng ký tham gia câu lạc bộ
- Xem thông tin cuộc thi
- Xem hoạt động tình nguyện
- Thông tin sinh viên

## License

MIT 
