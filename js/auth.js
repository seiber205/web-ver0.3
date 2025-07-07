let isLoginMode = true;

document.addEventListener('DOMContentLoaded', () => {
  console.log('auth.js loaded'); // Debug
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      console.log('User logged in:', user.email); // Debug
      localStorage.setItem('currentUser', user.uid); // Lưu UID để dùng trong schedule.js
      document.getElementById('auth-section').style.display = 'none';
      document.getElementById('main-section').style.display = 'block';
      showSection('calculator');
    } else {
      console.log('No user logged in'); // Debug
      localStorage.removeItem('currentUser');
      document.getElementById('auth-section').style.display = 'block';
      document.getElementById('main-section').style.display = 'none';
      document.getElementById('auth-title').textContent = 'Đăng nhập';
      document.getElementById('auth-btn').textContent = 'Đăng nhập';
      const toggleAuthElement = document.getElementById('toggle-auth');
      if (toggleAuthElement) {
        toggleAuthElement.innerHTML =
          'Chưa có tài khoản? <a href="#" onclick="toggleAuth()">Đăng ký</a>';
      } else {
        console.error('toggle-auth element not found');
      }
    }
  });
});

function toggleAuth() {
  isLoginMode = !isLoginMode;
  document.getElementById('auth-title').textContent = isLoginMode ? 'Đăng nhập' : 'Đăng ký';
  document.getElementById('auth-btn').textContent = isLoginMode ? 'Đăng nhập' : 'Đăng ký';
  const toggleAuthElement = document.getElementById('toggle-auth');
  if (toggleAuthElement) {
    toggleAuthElement.innerHTML = isLoginMode
      ? 'Chưa có tài khoản? <a href="#" onclick="toggleAuth()">Đăng ký</a>'
      : 'Đã có tài khoản? <a href="#" onclick="toggleAuth()">Đăng nhập</a>';
  }
}

const authForm = document.getElementById('auth-form');
if (authForm) {
  authForm.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('Form submitted'); // Debug
    const email = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    if (!email || !password) {
      alert('Vui lòng nhập đầy đủ thông tin.');
      return;
    }

    if (isLoginMode) {
      firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
          console.log('Login successful:', userCredential.user.email);
        })
        .catch((error) => {
          console.error('Login error:', error.message);
          alert('Sai email hoặc mật khẩu!');
        });
    } else {
      firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
          console.log('Signup successful:', userCredential.user.email);
          alert('Đăng ký thành công. Hãy đăng nhập!');
          toggleAuth();
        })
        .catch((error) => {
          console.error('Signup error:', error.message);
          alert('Đăng ký thất bại: ' + error.message);
        });
    }
  });
} else {
  console.error('auth-form element not found');
}

function logout() {
  firebase.auth().signOut().then(() => {
    localStorage.removeItem('currentUser');
    document.getElementById('auth-section').style.display = 'block';
    document.getElementById('main-section').style.display = 'none';
    document.getElementById('auth-form').reset();
    toggleAuth();
  });
}

function showSection(section) {
  document.getElementById('calculator-section').style.display = section === 'calculator' ? 'block' : 'none';
  document.getElementById('schedule-section').style.display = section === 'schedule' ? 'block' : 'none';
  if (section === 'schedule' && typeof loadSchedule === 'function') {
    loadSchedule();
  } else if (section === 'schedule') {
    console.error('loadSchedule function not defined');
  }
}
