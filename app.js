const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port = 3000; // Chọn port bạn muốn sử dụng

app.use(cors()); // Sử dụng middleware CORS để cho phép truy cập từ mọi domain (hoặc cấu hình cụ thể hơn)

// Hàm giả lập dữ liệu doanh thu và lợi nhuận theo tháng cho type=năm
function generateYearData(zone) {
    const months = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];
    return months.map(month => ({
        period: month,
        revenue: Math.floor(Math.random() * (300000000 - 100000000 + 1) + 100000000), // Doanh thu từ 100tr đến 300tr
        profit: Math.floor(Math.random() * (70000000 - 20000000 + 1) + 20000000)   // Lợi nhuận từ 20tr đến 70tr
    }));
}

// Hàm giả lập dữ liệu doanh thu và lợi nhuận theo ngày cho type=tháng
function generateMonthData(zone, month) {
    const daysInMonth = new Date(2024, month, 0).getDate(); // Lấy số ngày trong tháng (năm 2024)
    const days = Array.from({ length: daysInMonth }, (_, i) => `Ngày ${i + 1}`);
    return days.map(day => ({
        period: day,
        revenue: Math.floor(Math.random() * (15000000 - 3000000 + 1) + 3000000), // Doanh thu từ 3tr đến 15tr
        profit: Math.floor(Math.random() * (4000000 - 800000 + 1) + 800000)    // Lợi nhuận từ 800k đến 4tr
    }));
}

// Hàm giả lập dữ liệu doanh thu và lợi nhuận theo thứ trong tuần cho type=tuần
function generateWeekData(zone) {
    const weekdays = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ Nhật"];
    return weekdays.map(weekday => ({
        period: weekday,
        revenue: Math.floor(Math.random() * (6000000 - 2000000 + 1) + 2000000), // Doanh thu từ 2tr đến 6tr
        profit: Math.floor(Math.random() * (1600000 - 500000 + 1) + 500000)    // Lợi nhuận từ 500k đến 1.6tr
    }));
}


// API endpoint để trả về dữ liệu dashboard
app.get('/dashboard-data', (req, res) => {
    const type = req.query.type; // Lấy giá trị của query parameter 'type' (năm, tháng, tuần)
    const zone = req.query.zone || "Toàn quốc"; // Lấy zone, mặc định là "Toàn quốc" nếu không có

    let data = [];
    let driver_registrations = Math.floor(Math.random() * (2000 - 100 + 1) + 100); // Giả lập số lượng tài xế đăng ký
    let store_registrations = Math.floor(Math.random() * (500 - 50 + 1) + 50);   // Giả lập số lượng cửa hàng đăng ký

    switch (type) {
        case 'năm':
            data = generateYearData(zone);
            break;
        case 'tháng':
            const month = parseInt(req.query.month) || new Date().getMonth() + 1; // Lấy tháng từ query param, mặc định là tháng hiện tại
            data = generateMonthData(zone, month);
            break;
        case 'tuần':
            data = generateWeekData(zone);
            break;
        default:
            return res.status(400).json({ error: "Tham số 'type' không hợp lệ. Vui lòng chọn 'năm', 'tháng' hoặc 'tuần'." });
    }

    const responseJson = {
        zone: zone,
        type: type,
        driver_registrations: driver_registrations,
        store_registrations: store_registrations,
        data: data
    };

    res.json(responseJson); // Trả về dữ liệu JSON
});

app.get('/', (req, res) => {
    res.send('API Dashboard đang hoạt động!');
});

app.listen(port, () => {
    console.log(`Server đang lắng nghe tại http://localhost:${port}`);
});