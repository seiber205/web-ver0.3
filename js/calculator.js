document.getElementById('calculator-form').addEventListener('submit', (e) => {
    e.preventDefault();

    // Lấy input
    const workDays = parseInt(document.getElementById('work-days').value) || 0;
    const restDays = parseInt(document.getElementById('rest-days').value) || 0;
    const workHours = parseInt(document.getElementById('work-hours').value) || 0;
    const hourlyWage = parseInt(document.getElementById('hourly-wage').value) || 0; // Đơn vị: nghìn (k)
    const expense1 = parseInt(document.getElementById('expense-1').value) || 0;     // Đơn vị: nghìn (k)
    const expense2 = parseInt(document.getElementById('expense-2').value) || 0;
    const expense3 = parseInt(document.getElementById('expense-3').value) || 0;

    // Kiểm tra hợp lệ
    if (workDays + restDays > 7) {
        alert('Tổng số ngày làm và nghỉ không được vượt quá 7 ngày!');
        return;
    }

    const weeksPerMonth = 4;
    const totalHours = workDays * weeksPerMonth * workHours;
    const totalIncome = totalHours * hourlyWage; // đơn vị k
    const totalExpenses = expense1 + expense2 + expense3; // đơn vị k
    const netIncome = totalIncome - totalExpenses; // đơn vị k

    const formattedResult = formatCurrencyK(netIncome);
    document.getElementById('result').textContent = `Số tiền còn lại: ${formattedResult}`;

    // Lưu dữ liệu
    const username = localStorage.getItem('currentUser');
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    userData[username] = userData[username] || {};
    userData[username].calculator = {
        workDays, restDays, workHours, hourlyWage,
        expense1, expense2, expense3, netIncome
    };
    localStorage.setItem('userData', JSON.stringify(userData));
});

// Format theo đơn vị nghìn (k)
function formatCurrencyK(amountK) {
    if (amountK < 1000) return `${amountK}k`;

    const millions = Math.floor(amountK / 1000);
    const thousands = amountK % 1000;

    if (thousands === 0) {
        return `${millions} triệu`;
    } else {
        return `${millions} triệu ${thousands}k`;
    }
}
