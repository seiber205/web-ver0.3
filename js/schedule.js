const defaultShifts = [
  { time: 'Ca 1: 6h-9h', note: '', icon: '' },
  { time: 'Ca 2: 9h-12h', note: '', icon: '' },
  { time: 'Ca 3: 12h-15h', note: '', icon: '' },
  { time: 'Ca 4: 15h-18h', note: '', icon: '' },
  { time: 'Ca 5: 18h-21h', note: '', icon: '' },
  { time: 'Ca 6: 21h-24h', note: '', icon: '' }
];

// Tạo lịch rỗng: 7 ngày x 6 ca
function generateEmptySchedule() {
  return Array.from({ length: 7 }, () => defaultShifts.map(s => ({ ...s })));
}

function getUserSchedule() {
  const username = localStorage.getItem('currentUser');
  console.log('Current User:', username); // Debug
  if (!username) {
    console.error('No user logged in');
    return null;
  }

  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  console.log('User Data:', userData); // Debug
  if (!userData[username]) userData[username] = {};

  if (!Array.isArray(userData[username].schedule)) {
    userData[username].schedule = generateEmptySchedule();
    console.log('Initialized empty schedule:', userData[username].schedule); // Debug
  }

  localStorage.setItem('userData', JSON.stringify(userData));
  return userData[username].schedule;
}

function saveUserSchedule(schedule) {
  const username = localStorage.getItem('currentUser');
  if (!username) {
    console.error('No user logged in, cannot save schedule');
    return;
  }

  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  userData[username] = userData[username] || {};
  userData[username].schedule = schedule;
  localStorage.setItem('userData', JSON.stringify(userData));
  console.log('Schedule saved:', schedule); // Debug
}

function loadSchedule() {
  const schedule = getUserSchedule();
  if (!schedule) {
    console.error('No schedule data available');
    return;
  }

  const tbody = document.getElementById('schedule-body');
  if (!tbody) {
    console.error('Schedule body element not found');
    return;
  }
  tbody.innerHTML = '';

  for (let shiftIndex = 0; shiftIndex < defaultShifts.length; shiftIndex++) {
    const row = document.createElement('tr');
    // Sử dụng schedule[0][shiftIndex].time thay vì defaultShifts để hiển thị giờ ca đã lưu
    row.innerHTML = `<td>${schedule[0][shiftIndex].time}</td>`;

    for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
      const shift = schedule[dayIndex][shiftIndex];
      console.log(`Day ${dayIndex}, Shift ${shiftIndex}:`, shift); // Debug
      const icon = shift.icon ? getIcon(shift.icon) + ' ' : '';
      const note = shift.note || '';
      row.innerHTML += `<td>${icon}${note}</td>`;
    }

    tbody.appendChild(row);
  }

  // Cập nhật dropdown chọn ca
  const shiftSelect = document.getElementById('edit-shift');
  if (shiftSelect) {
    shiftSelect.innerHTML = defaultShifts
      .map((shift, idx) => `<option value="${idx}">${schedule[0][idx].time}</option>`)
      .join('');
  }
}

function getIcon(icon) {
  switch (icon) {
    case 'work': return '🏃';
    case 'study': return '🎓';
    case 'extra': return '📚';
    case 'play': return '🎮';
    case 'other': return '📌';
    default: return '';
  }
}

function editSchedule() {
  document.getElementById('edit-schedule').style.display = 'block';
}

document.getElementById('schedule-form').addEventListener('submit', (e) => {
  e.preventDefault();

  const day = parseInt(document.getElementById('edit-day').value);
  const shift = parseInt(document.getElementById('edit-shift').value);
  const time = document.getElementById('shift-time').value.trim();
  const note = document.getElementById('shift-note').value;
  const icon = document.getElementById('shift-icon').value;

  const schedule = getUserSchedule();
  if (!schedule) return;

  // Cập nhật ca cụ thể
  if (!Array.isArray(schedule[day])) {
    schedule[day] = defaultShifts.map(s => ({ ...s }));
  }

  // Cập nhật tất cả các ngày với giờ ca mới nếu time không rỗng
  if (time) {
    for (let i = 0; i < 7; i++) {
      schedule[i][shift].time = time;
    }
  }

  // Cập nhật ghi chú và icon cho ca cụ thể
  schedule[day][shift].note = note;
  schedule[day][shift].icon = icon;

  saveUserSchedule(schedule);
  document.getElementById('edit-schedule').style.display = 'none';
  loadSchedule();
});

document.addEventListener('DOMContentLoaded', () => {
  // Chỉ gọi loadSchedule nếu schedule-section đang hiển thị
  if (document.getElementById('schedule-section').style.display === 'block') {
    loadSchedule();
  }
});