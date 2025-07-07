const defaultShifts = [
  { time: 'Ca 1: 6h-8h', note: '', icon: '' },
  { time: 'Ca 2: 8h-10h', note: '', icon: '' },
  { time: 'Ca 3: 10h-12h', note: '', icon: '' },
  { time: 'Ca 4: 12h-14h', note: '', icon: '' },
  { time: 'Ca 5: 14h-16h', note: '', icon: '' },
  { time: 'Ca 6: 16h-18h', note: '', icon: '' },
  { time: 'Ca 7: 18h-20h', note: '', icon: '' },
  { time: 'Ca 8: 20h-22h', note: '', icon: '' },
  { time: 'Ca 9: 20h-22h', note: '', icon: '' },
  { time: 'Ca 10: 20h-22h', note: '', icon: '' },
  { time: 'Ca 11: 20h-22h', note: '', icon: '' },
  { time: 'Ca 12: 20h-22h', note: '', icon: '' },
  { time: 'Ca 13: 20h-22h', note: '', icon: '' },
];

// Tạo lịch rỗng: 7 ngày x 7 ca
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

  if (!Array.isArray(userData[username].schedule) || userData[username].schedule[0].length !== defaultShifts.length) {
    userData[username].schedule = generateEmptySchedule();
    console.log('Initialized new schedule with updated shifts:', userData[username].schedule); // Debug
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

  if (!Array.isArray(schedule[day])) {
    schedule[day] = defaultShifts.map(s => ({ ...s }));
  }

  if (time) {
    for (let i = 0; i < 7; i++) {
      schedule[i][shift].time = time;
    }
  }

  schedule[day][shift].note = note;
  schedule[day][shift].icon = icon;

  saveUserSchedule(schedule);
  document.getElementById('edit-schedule').style.display = 'none';
  loadSchedule();
});

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('schedule-section').style.display === 'block') {
    loadSchedule();
  }
});
