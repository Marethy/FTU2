import os
from PIL import Image, ImageOps, ImageDraw

# Đường dẫn tới file LOGO.jpg và thư mục đích
input_path = "public/LOGO.jpg"
output_path = "public/favicon.png"

# Mở hình ảnh
img = Image.open(input_path)

# Tạo mặt nạ tròn
mask = Image.new('L', img.size, 0)
draw = ImageDraw.Draw(mask)
draw.ellipse((0, 0) + img.size, fill=255)

# Cắt ảnh theo mặt nạ tròn
result = ImageOps.fit(img, mask.size, centering=(0.5, 0.5))
result.putalpha(mask)

# Lưu kết quả
result.save(output_path, format="PNG")

print(f"Đã tạo favicon tròn tại {output_path}")
