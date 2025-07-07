const defaultShifts = [
  { time: 'Ca 1: 6h-7h30', note: '', icon: '' },
  { time: 'Ca 2: 7h30-9h', note: '', icon: '' },
  { time: 'Ca 3: 9h-10h30', note: '', icon: '' },
  { time: 'Ca 4: 10h30-12h', note: '', icon: '' },
  { time: 'Ca 5: 12h-13h30', note: '', icon: '' },
  { time: 'Ca 6: 13h30-15h', note: '', icon: '' },
  { time: 'Ca 7: 15h-16h30', note: '', icon: '' },
  { time: 'Ca 8: 16h30-18h', note: '', icon: '' },
  { time: 'Ca 9: 18h-19h30', note: '', icon: '' },
  { time: 'Ca 10: 19h30-21h', note: '', icon: '' },
  { time: 'Ca 11: 21h-22h30', note: '', icon: '' },
  { time: 'Ca 12: 22h30-0h', note: '', icon: '' },
  { time: 'Ca 13: 0h-1h30', note: '', icon: '' }
];

// ✅ schedule là object có key từ "0" đến "6"
function generateEmptySchedule() {
  const schedule = {};
  for (let i = 0; i < 7; i++) {
    schedule[i] = defaultShifts.map(s => ({ ...s }));
  }
  return schedule;
}

async function getUserSchedule() {
  const userId = localStorage.getItem('currentUser');
  if (!userId) {
    console.error('No user logged in');
    return null;
  }

  const db = firebase.firestore();
  const userDoc = await db.collection('users').doc(userId).get();

  let schedule = userDoc.data()?.schedule;
  let reset = false;

  if (!schedule || typeof schedule !== 'object') {
    reset = true;
  } else {
    for (let i = 0; i < 7; i++) {
      if (!Array.isArray(schedule[i]) || schedule[i].length !== defaultShifts.length) {
        reset = true;
        break;
      }
    }
  }

  if (reset) {
    schedule = generateEmptySchedule();
    await db.collection('users').doc(userId).set({ schedule }, { merge: true });
  }

  return schedule;
}

async function saveUserSchedule(schedule) {
  const userId = localStorage.getItem('currentUser');
  if (!userId) {
    console.error('No user logged in');
    return;
  }

  const db = firebase.firestore();
  await db.collection('users').doc(userId).set({ schedule }, { merge: true });
}

async function loadSchedule() {
  const schedule = await getUserSchedule();
  if (!schedule) return;

  const tbody = document.getElementById('schedule-body');
  if (!tbody) return;
  tbody.innerHTML = '';

  for (let shiftIndex = 0; shiftIndex < defaultShifts.length; shiftIndex++) {
    const row = document.createElement('tr');
    const shiftTime = schedule[0]?.[shiftIndex]?.time || defaultShifts[shiftIndex].time;
    row.innerHTML = `<td>${shiftTime}</td>`;

    for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
      const dayKey = String(dayIndex);
      const shift = schedule[dayKey]?.[shiftIndex] || { icon: '', note: '' };
      const icon = shift.icon ? getIcon(shift.icon) + ' ' : '';
      const note = shift.note || '';
      row.innerHTML += `<td>${icon}${note}</td>`;
    }

    tbody.appendChild(row);
  }

  const shiftSelect = document.getElementById('edit-shift');
  if (shiftSelect) {
    shiftSelect.innerHTML = defaultShifts
      .map((shift, idx) => `<option value="${idx}">${shift.time}</option>`)
      .join('');
  }
}

function getIcon(icon) {
  switch (icon) {
    case 'work': return '🔴🏃';
    case 'study': return '🟠🎓';
    case 'extra': return '🟣📚';
    case 'play': return '🟢🎮';
    case 'other': return '⭕📌';
    default: return '';
  }
}

function editSchedule() {
  document.getElementById('edit-schedule').style.display = 'block';
}

document.getElementById('schedule-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const day = document.getElementById('edit-day').value;
  const shift = parseInt(document.getElementById('edit-shift').value);
  const time = document.getElementById('shift-time').value.trim();
  const note = document.getElementById('shift-note').value;
  const icon = document.getElementById('shift-icon').value;

  const schedule = await getUserSchedule();
  if (!schedule) return;

  if (!Array.isArray(schedule[day])) {
    schedule[day] = defaultShifts.map(s => ({ ...s }));
  }

  // ✅ Sửa lỗi không cập nhật giờ cho tất cả các ngày
  if (time) {
    for (let i = 0; i < 7; i++) {
      const dayKey = String(i);
      if (Array.isArray(schedule[dayKey]) && schedule[dayKey][shift]) {
        schedule[dayKey][shift].time = time;
      }
    }
  }

  schedule[day][shift].note = note;
  schedule[day][shift].icon = icon;

  await saveUserSchedule(schedule);
  document.getElementById('edit-schedule').style.display = 'none';
  await loadSchedule();
});

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('schedule-section').style.display === 'block') {
    loadSchedule();
  }
});
