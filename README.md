# owin-landing

Trang công khai của cửa hàng **Hoanganhowin**. Project độc lập, build riêng,
deploy riêng — không phải một phần của công cụ báo giá.

## Quan hệ với `owin-quote-tool`

Phép tính tiền **không** được chép sang đây. Project này phụ thuộc vào package
`@owin/quote-engine` nằm trong repo `owin-quote-tool`:

```
owin-landing/package.json
  └── "@owin/quote-engine": "file:../owin-quote-tool/packages/quote-engine"
```

Vì là đường dẫn tương đối, **hai thư mục phải nằm cạnh nhau**:

```
work_place/
├── owin-quote-tool/     ← repo công cụ, chứa packages/quote-engine
└── owin-landing/        ← repo này
```

`npm install` sẽ tự chạy `prepare` của package để build nó. Sửa công thức giá
thì sửa trong package rồi cài lại ở đây.

## Chạy

```
npm install
npm run dev
npm test
npm run build
```

## Nguyên tắc

- Trang này **chỉ đọc**. Không ghi gì xuống database.
- Cửa hàng được phục vụ lấy từ `VITE_STORE_ID` của bản deploy, **không bao giờ**
  từ phiên đăng nhập — trang này không có đăng nhập.
- Không tự nghĩ ra nội dung tiếp thị. Chưa có nội dung thật từ chủ cửa hàng thì
  để trống hoặc ẩn phần đó.
