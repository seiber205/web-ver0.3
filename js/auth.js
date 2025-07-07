let isLoginMode = true;

document.addEventListener('DOMContentLoaded', () => {
  const currentUser = localStorage.getItem('currentUser');
  const users = JSON.parse(localStorage.getItem('users') || '{}');

  // Kiểm tra xem currentUser có hợp lệ (tồn tại trong users)
  if (currentUser && users[currentUser]) {
    // Người dùng hợp lệ, hiển thị giao diện chính
    document.getElementById('auth-section').style.display = 'none';
    document.getElementById('main-section').style.display = 'block';
    showSection('calculator'); // Mặc định hiển thị calculator
  } else {
    // Xóa currentUser nếu không hợp lệ và hiển thị form đăng nhập
    localStorage.removeItem('currentUser');
    document.getElementById('auth-section').style.display = 'block';
    document.getElementById('main-section').style.display = 'none';
    document.getElementById('auth-title').textContent = 'Đăng nhập';
    document.getElementById('auth-btn').textContent = 'Đăng nhập';
    document.getElementById('toggle-auth').innerHTML =
      'Chưa có tài khoản? <a href="#" onclick="toggleAuth()">Đăng ký</a>';
  }
});

function toggleAuth() {
  isLoginMode = !isLoginMode;
  document.getElementById('auth-title').textContent = isLoginMode ? 'Đăng nhập' : 'Đăng ký';
  document.getElementById('auth-btn').textContent = isLoginMode ? 'Đăng nhập' : 'Đăng ký';
  document.getElementById('toggle-auth').innerHTML = isLoginMode
    ? 'Chưa có tài khoản? <a href="#" onclick="toggleAuth()">Đăng ký</a>'
    : 'Đã có tài khoản? <a href="#" onclick="toggleAuth()">Đăng nhập</a>';
}

document.getElementById('auth-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;

  if (!username || !password) {
    alert('Vui lòng nhập đầy đủ thông tin.');
    return;
  }

  const users = JSON.parse(localStorage.getItem('users') || '{}');

  if (isLoginMode) {
    if (users[username] && users[username].password === password) {
      localStorage.setItem('currentUser', username);
      document.getElementById('auth-section').style.display = 'none';
      document.getElementById('main-section').style.display = 'block';
      showSection('calculator');
    } else {
      alert('Sai tên đăng nhập hoặc mật khẩu!');
    }
  } else {
    if (users[username]) {
      alert('Tên đăng nhập đã tồn tại!');
    } else {
      users[username] = { password };
      localStorage.setItem('users', JSON.stringify(users));
      alert('Đăng ký thành công. Hãy đăng nhập!');
      toggleAuth();
    }
  }
});

function logout() {
  localStorage.removeItem('currentUser');
  document.getElementById('auth-section').style.display = 'block';
  document.getElementById('main-section').style.display = 'none';
  document.getElementById('auth-form').reset();
  toggleAuth(); // Đặt lại về form đăng nhập
}

function showSection(section) {
  document.getElementById('calculator-section').style.display = section === 'calculator' ? 'block' : 'none';
  document.getElementById('schedule-section').style.display = section === 'schedule' ? 'block' : 'none';
  if (section === 'schedule') {
    if (typeof loadSchedule === 'function') {
      loadSchedule();
    } else {
      console.error('loadSchedule function is not defined');
    }
  }
}
