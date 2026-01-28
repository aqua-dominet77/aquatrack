// ========================================
// AQUATRACK - 3D FUTURISTIC JAVASCRIPT
// ========================================

// ========== PARTICLE ANIMATION ==========
class ParticleSystem {
  constructor() {
    this.canvas = document.getElementById('particles');
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.resize();
    this.init();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  init() {
    for (let i = 0; i < 80; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2
      });
    }
    this.animate();
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(0, 212, 255, ${p.opacity})`;
      this.ctx.fill();

      // Draw connections
      this.particles.slice(i + 1).forEach(p2 => {
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.strokeStyle = `rgba(0, 212, 255, ${0.15 * (1 - dist / 120)})`;
          this.ctx.lineWidth = 1;
          this.ctx.stroke();
        }
      });
    });

    requestAnimationFrame(() => this.animate());
  }
}

// ========== SMOOTH NAVIGATION ==========
class Navigation {
  constructor() {
    this.links = document.querySelectorAll('.nav-link');
    this.sections = document.querySelectorAll('main > section');
    this.init();
  }

  init() {
    // Show home section by default
    this.showSection('home');

    this.links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = link.getAttribute('href').substring(1); // Remove #
        
        // Update active state on nav links
        this.links.forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        // Show the selected section
        this.showSection(target);

        // Scroll to top smoothly
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });
  }

  showSection(sectionId) {
    // Hide all sections
    this.sections.forEach(section => {
      section.classList.remove('active');
    });

    // Show the target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
      targetSection.classList.add('active');
    }
  }

  updateActiveLink() {
    // Not needed for tab-based navigation
  }
}

// ========== AI CHATBOT ==========
class AIChatbot {
  constructor() {
    this.messages = document.getElementById('chatMessages');
    this.input = document.getElementById('chatInput');
    this.sendBtn = document.getElementById('chatSend');
    this.init();
  }

  init() {
    this.sendBtn.addEventListener('click', () => this.sendMessage());
    this.input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.sendMessage();
    });
  }

  sendMessage() {
    const text = this.input.value.trim();
    if (!text) return;

    // Add user message
    this.addMessage(text, 'user');
    this.input.value = '';

    // Simulate AI response
    setTimeout(() => {
      const response = this.generateResponse(text);
      this.addMessage(response, 'bot');
    }, 1000);
  }

  addMessage(text, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;

    if (type === 'bot') {
      messageDiv.innerHTML = `
        <div class="message-avatar"><i class="fas fa-robot"></i></div>
        <div class="message-bubble">${text}</div>
      `;
    } else {
      messageDiv.innerHTML = `
        <div class="message-bubble" style="margin-left: auto; background: rgba(0,212,255,0.3);">${text}</div>
      `;
    }

    this.messages.appendChild(messageDiv);
    this.messages.scrollTop = this.messages.scrollHeight;
  }

  generateResponse(input) {
    const lower = input.toLowerCase();

    // Time logging
    if (lower.match(/\d+:\d+/) || lower.includes('time')) {
      return "Great! I've logged your time. Based on your recent performance, I recommend focusing on interval training to improve your pace. Try 8×100m at 85% effort with 20s rest.";
    }

    // Freestyle questions
    if (lower.includes('freestyle')) {
      return "For freestyle improvement, focus on: 1) High elbow catch 2) Body rotation (45°) 3) Bilateral breathing. Your last 100m pace suggests you can drop 2-3 seconds with better technique.";
    }

    // Butterfly questions
    if (lower.includes('butterfly')) {
      return "Butterfly technique tips: 1) Two-beat dolphin kick per arm cycle 2) Press chest down to lift hips 3) Recover arms relaxed. Start with 4×25m drills to build muscle memory.";
    }

    // Training plan
    if (lower.includes('training') || lower.includes('workout')) {
      return "I recommend the 60-minute Performance plan for you. It includes endurance building with 12×100m sets. This aligns well with your current fitness level and goals.";
    }

    // Progress questions
    if (lower.includes('progress') || lower.includes('improve')) {
      return "Your progress is excellent! You've improved your average pace by 8% this month. Keep up the consistency. Next milestone: breaking the 1:30/100m barrier.";
    }

    // Breathing
    if (lower.includes('breath')) {
      return "Breathing technique: Exhale gradually underwater, turn head (not lift), quick inhale. Try breathing every 3 strokes (bilateral) to improve balance and oxygen efficiency.";
    }

    // Default response
    return "I'm here to help with training plans, technique analysis, and performance tracking. Ask me about your times, stroke improvements, or workout recommendations!";
  }
}

// ========== PERFORMANCE CHART ==========
class PerformanceChart {
  constructor() {
    this.canvas = document.getElementById('performanceChart');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.data = this.generateMockData();
    this.draw();
  }

  generateMockData() {
    return {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      previousValues: [95, 92, 93, 88, 90, 87, 85], // previous pace in seconds per 100m
      newValues: [92, 88, 90, 85, 87, 83, 82] // new pace in seconds per 100m
    };
  }

  draw() {
    // Combine both datasets to determine min/max for scaling
    const allValues = [...this.data.previousValues, ...this.data.newValues];
    const padding = 60;
    const width = this.canvas.width - padding * 2;
    const height = this.canvas.height - padding * 2;
    const min = Math.min(...allValues) - 5;
    const max = Math.max(...allValues) + 5;
    const range = max - min;

    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw grid
    this.ctx.strokeStyle = 'rgba(0, 212, 255, 0.1)';
    this.ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = padding + (height / 5) * i;
      this.ctx.beginPath();
      this.ctx.moveTo(padding, y);
      this.ctx.lineTo(padding + width, y);
      this.ctx.stroke();
    }

    // Draw previous values line chart
    this.ctx.strokeStyle = '#ff6b6b'; // Red color for previous values
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();

    this.data.previousValues.forEach((value, i) => {
      const x = padding + (width / (this.data.previousValues.length - 1)) * i;
      const y = padding + height - ((value - min) / range) * height;
      
      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    });

    this.ctx.stroke();

    // Draw new values line chart
    this.ctx.strokeStyle = '#00d4ff'; // Blue color for new values
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();

    this.data.newValues.forEach((value, i) => {
      const x = padding + (width / (this.data.newValues.length - 1)) * i;
      const y = padding + height - ((value - min) / range) * height;
      
      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    });

    this.ctx.stroke();

    // Draw previous values points
    this.data.previousValues.forEach((value, i) => {
      const x = padding + (width / (this.data.previousValues.length - 1)) * i;
      const y = padding + height - ((value - min) / range) * height;

      // Glow effect
      this.ctx.shadowBlur = 15;
      this.ctx.shadowColor = '#ff6b6b';
      this.ctx.fillStyle = '#ff6b6b';
      this.ctx.beginPath();
      this.ctx.arc(x, y, 6, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.shadowBlur = 0;

      // Value label
      this.ctx.fillStyle = '#ffffff';
      this.ctx.font = '12px Rajdhani';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(`${value}s`, x, y - 15);
    });

    // Draw new values points
    this.data.newValues.forEach((value, i) => {
      const x = padding + (width / (this.data.newValues.length - 1)) * i;
      const y = padding + height - ((value - min) / range) * height;

      // Glow effect
      this.ctx.shadowBlur = 15;
      this.ctx.shadowColor = '#00d4ff';
      this.ctx.fillStyle = '#00d4ff';
      this.ctx.beginPath();
      this.ctx.arc(x, y, 6, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.shadowBlur = 0;

      // Value label
      this.ctx.fillStyle = '#ffffff';
      this.ctx.font = '12px Rajdhani';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(`${value}s`, x, y - 15);
    });

    // Draw labels
    this.ctx.fillStyle = '#a8d4ff';
    this.ctx.font = '14px Rajdhani';
    this.data.labels.forEach((label, i) => {
      const x = padding + (width / (this.data.previousValues.length - 1)) * i;
      this.ctx.textAlign = 'center';
      this.ctx.fillText(label, x, this.canvas.height - 30);
    });

    // Y-axis labels
    for (let i = 0; i <= 5; i++) {
      const value = Math.round(max - (range / 5) * i);
      const y = padding + (height / 5) * i;
      this.ctx.textAlign = 'right';
      this.ctx.fillText(`${value}s`, padding - 10, y + 5);
    }

    // Legend
    this.ctx.fillStyle = '#ff6b6b';
    this.ctx.beginPath();
    this.ctx.arc(padding, this.canvas.height - 80, 6, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.fillStyle = '#a8d4ff';
    this.ctx.font = '14px Rajdhani';
    this.ctx.textAlign = 'left';
    this.ctx.fillText('Previous Pace', padding + 15, this.canvas.height - 75);
    
    this.ctx.fillStyle = '#00d4ff';
    this.ctx.beginPath();
    this.ctx.arc(padding + 150, this.canvas.height - 80, 6, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.fillStyle = '#a8d4ff';
    this.ctx.fillText('Current Pace', padding + 165, this.canvas.height - 75);

    // Title
    this.ctx.fillStyle = '#001a33';
    this.ctx.font = '16px Rajdhani';
    this.ctx.textAlign = 'left';
    this.ctx.fillText('Pace Comparison: Previous vs Current', padding, 20);
  }
}

// ========== SESSION LOGGER ==========
class SessionLogger {
  constructor() {
    this.form = document.getElementById('sessionForm');
    this.tbody = document.getElementById('sessionsBody');
    this.clearBtn = document.getElementById('clearSessions');
    this.sessions = this.loadSessions();
    this.init();
  }

  init() {
    if (!this.form) return;

    // Set today's date as default
    document.getElementById('sessionDate').valueAsDate = new Date();

    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.addSession();
    });

    this.clearBtn.addEventListener('click', () => {
      if (confirm('Delete all sessions? This cannot be undone.')) {
        this.sessions = [];
        this.saveSessions();
        this.renderTable();
      }
    });

    this.renderTable();
  }

  loadSessions() {
    try {
      return JSON.parse(localStorage.getItem('aquatrack_sessions')) || [];
    } catch {
      return [];
    }
  }

  saveSessions() {
    localStorage.setItem('aquatrack_sessions', JSON.stringify(this.sessions));
  }

  addSession() {
    const date = document.getElementById('sessionDate').value;
    const stroke = document.getElementById('sessionStroke').value;
    const distance = parseInt(document.getElementById('sessionDistance').value);
    const timeStr = document.getElementById('sessionTime').value;

    // Validate time format
    if (!/^\d{1,2}:\d{2}$/.test(timeStr)) {
      alert('Please enter time in mm:ss format (e.g., 01:30)');
      return;
    }

    const [minutes, seconds] = timeStr.split(':').map(Number);
    const totalSeconds = minutes * 60 + seconds;

    const session = {
      id: Date.now(),
      date,
      stroke,
      distance,
      time: totalSeconds,
      timeFormatted: timeStr
    };

    this.sessions.unshift(session);
    this.saveSessions();
    this.renderTable();
    this.form.reset();
    document.getElementById('sessionDate').valueAsDate = new Date();

    // Success feedback
    const btn = this.form.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> Session Saved!';
    btn.style.background = '#00ff88';
    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.style.background = '';
    }, 2000);
  }

  calculatePace(distance, seconds) {
    const paceSeconds = (seconds / distance) * 100;
    const min = Math.floor(paceSeconds / 60);
    const sec = Math.round(paceSeconds % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
  }

  formatStroke(stroke) {
    return stroke.charAt(0).toUpperCase() + stroke.slice(1);
  }

  deleteSession(id) {
    this.sessions = this.sessions.filter(s => s.id !== id);
    this.saveSessions();
    this.renderTable();
  }

  renderTable() {
    if (!this.tbody) return;

    if (this.sessions.length === 0) {
      this.tbody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; padding: 32px; color: rgba(0,26,51,0.5); font-style: italic;">
            No sessions logged yet. Add your first swim above!
          </td>
        </tr>
      `;
      return;
    }

    this.tbody.innerHTML = this.sessions.map(session => `
      <tr>
        <td>${session.date}</td>
        <td>${this.formatStroke(session.stroke)}</td>
        <td>${session.distance}m</td>
        <td>${session.timeFormatted}</td>
        <td>${this.calculatePace(session.distance, session.time)}</td>
        <td>
          <button class="delete-session" onclick="sessionLogger.deleteSession(${session.id})">
            <i class="fas fa-times"></i>
          </button>
        </td>
      </tr>
    `).join('');
  }
}

// ========== USER AUTHENTICATION ==========
class Authentication {
  constructor() {
    this.currentUser = null;
    this.users = this.loadUsers();
    this.init();
  }

  init() {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('aquatrack_current_user');
    if (savedUser) {
      this.currentUser = JSON.parse(savedUser);
      this.updateUI();
    }
  }

  loadUsers() {
    try {
      return JSON.parse(localStorage.getItem('aquatrack_users')) || [];
    } catch {
      return [];
    }
  }

  saveUsers() {
    localStorage.setItem('aquatrack_users', JSON.stringify(this.users));
  }

  signup(name, email, password) {
    // Validate inputs
    if (!name || !email || !password) {
      return { success: false, message: 'All fields are required.' };
    }

    if (password.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters.' };
    }

    // Check if email already exists
    if (this.users.find(u => u.email === email)) {
      return { success: false, message: 'Email already registered. Please login instead.' };
    }

    // Create new user
    const newUser = {
      id: Date.now(),
      name,
      email,
      password, // In production, this should be hashed!
      createdAt: new Date().toISOString()
    };

    this.users.push(newUser);
    this.saveUsers();

    // Auto-login after signup
    this.currentUser = { id: newUser.id, name: newUser.name, email: newUser.email };
    localStorage.setItem('aquatrack_current_user', JSON.stringify(this.currentUser));
    this.updateUI();

    return { success: true, message: 'Account created successfully!' };
  }

  login(email, password) {
    // Validate inputs
    if (!email || !password) {
      return { success: false, message: 'Email and password are required.' };
    }

    // Find user
    const user = this.users.find(u => u.email === email);
    
    if (!user) {
      return { success: false, message: 'Account not found. Please sign up first.' };
    }

    if (user.password !== password) {
      return { success: false, message: 'Incorrect password. Please try again.' };
    }

    // Login successful
    this.currentUser = { id: user.id, name: user.name, email: user.email };
    localStorage.setItem('aquatrack_current_user', JSON.stringify(this.currentUser));
    this.updateUI();

    return { success: true, message: 'Welcome back to AquaTrack!' };
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem('aquatrack_current_user');
    this.updateUI();
    
    // Go to home page
    if (window.navigation) {
      navigation.showSection('home');
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      document.querySelector('a[href="#home"]').classList.add('active');
    }
  }

  updateUI() {
    const navActions = document.querySelector('.nav-actions');
    
    if (this.currentUser) {
      // User is logged in - show profile and logout
      navActions.innerHTML = `
        <div class="user-profile">
          <i class="fas fa-user-circle"></i>
          <span>${this.currentUser.name}</span>
        </div>
        <button class="btn-neon btn-logout" id="logoutBtn">Logout</button>
      `;

      document.getElementById('logoutBtn').addEventListener('click', () => this.logout());
      
      // Hide login and signup sections from main navigation
      const loginSection = document.getElementById('login');
      const signupSection = document.getElementById('signup');
      if (loginSection) loginSection.style.display = 'none';
      if (signupSection) signupSection.style.display = 'none';
      
      // If currently on login or signup page, redirect to home
      if (loginSection && loginSection.classList.contains('active')) {
        navigation.showSection('home');
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        document.querySelector('a[href="#home"]').classList.add('active');
      }
      if (signupSection && signupSection.classList.contains('active')) {
        navigation.showSection('home');
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        document.querySelector('a[href="#home"]').classList.add('active');
      }
    } else {
      // User is logged out - show login/signup buttons
      navActions.innerHTML = `
        <a href="#login" class="btn-neon btn-login">Login</a>
        <a href="#signup" class="btn-neon btn-signup">Sign Up</a>
      `;
      
      // Show login and signup sections again
      const loginSection = document.getElementById('login');
      const signupSection = document.getElementById('signup');
      if (loginSection) loginSection.style.display = '';
      if (signupSection) signupSection.style.display = '';

      // Re-attach event listeners
      navActions.querySelectorAll('a').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const targetId = btn.getAttribute('href').substring(1);
          if (window.navigation) {
            navigation.showSection(targetId);
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      });
    }
  }

  isLoggedIn() {
    return this.currentUser !== null;
  }

  getCurrentUser() {
    return this.currentUser;
  }
}

// ========== FORM HANDLERS ==========
class Forms {
  constructor(auth) {
    this.auth = auth;
    this.contactForm = document.getElementById('contactForm');
    this.loginForm = document.getElementById('loginForm');
    this.signupForm = document.getElementById('signupForm');
    this.init();
  }

  init() {
    // Contact form
    if (this.contactForm) {
      this.contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.showMessage('Thank you! Your message has been sent. We\'ll respond within 24 hours.', 'success');
        this.contactForm.reset();
      });
    }

    // Login form
    if (this.loginForm) {
      this.loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = this.loginForm.querySelector('input[type="email"]').value;
        const password = this.loginForm.querySelector('input[type="password"]').value;
        
        const result = this.auth.login(email, password);
        
        if (result.success) {
          this.showMessage(result.message, 'success');
          this.loginForm.reset();
          
          // Redirect to progress page after 1 second
          setTimeout(() => {
            navigation.showSection('progress');
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            document.querySelector('a[href="#progress"]').classList.add('active');
          }, 1000);
        } else {
          this.showMessage(result.message, 'error');
        }
      });
    }

    // Signup form
    if (this.signupForm) {
      this.signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = this.signupForm.querySelector('input[type="text"]').value;
        const email = this.signupForm.querySelector('input[type="email"]').value;
        const password = this.signupForm.querySelector('input[type="password"]').value;
        
        const result = this.auth.signup(name, email, password);
        
        if (result.success) {
          this.showMessage(result.message, 'success');
          this.signupForm.reset();
          
          // Redirect to progress page after 1 second
          setTimeout(() => {
            navigation.showSection('progress');
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            document.querySelector('a[href="#progress"]').classList.add('active');
          }, 1000);
        } else {
          this.showMessage(result.message, 'error');
        }
      });
    }
  }

  showMessage(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
      <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Show with animation
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Remove after 4 seconds
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 4000);
  }
}

// ========== SCROLL ANIMATIONS ==========
class ScrollAnimations {
  constructor() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }
        });
      },
      { threshold: 0.1 }
    );

    this.init();
  }

  init() {
    const elements = document.querySelectorAll('.feature-card-3d, .training-card-3d, .stat-card-3d, .video-card-3d');
    elements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'all 0.6s ease';
      this.observer.observe(el);
    });
  }
}

// ========== TRAINING LEVELS AND VIDEOS ==========
class TrainingLevels {
  constructor() {
    this.levelButtons = document.querySelectorAll('.level-btn');
    this.trainingCards = document.querySelectorAll('.training-card-3d');
    this.videoCards = document.querySelectorAll('.video-card-3d');
    this.videoModal = document.getElementById('videoModal');
    this.videoFrame = document.getElementById('videoFrame');
    this.closeModal = document.querySelector('.close');
    this.currentStroke = 'all'; // Track current stroke filter
    this.currentLevel = 'all';  // Track current level filter
    this.init();
  }

  init() {
    // Stroke selection tabs (assuming they exist)
    const strokeTabs = document.querySelectorAll('[data-stroke-tab]');
    if (strokeTabs.length > 0) {
      strokeTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
          // Update active tab
          strokeTabs.forEach(t => t.classList.remove('active'));
          e.currentTarget.classList.add('active');

          // Filter by stroke
          const selectedStroke = e.currentTarget.getAttribute('data-stroke-tab');
          this.currentStroke = selectedStroke;
          this.applyFilters();
        });
      });
    }

    // Level selection functionality
    this.levelButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        // Update active button
        this.levelButtons.forEach(btn => btn.classList.remove('active'));
        e.currentTarget.classList.add('active');

        // Filter by level
        const selectedLevel = e.currentTarget.getAttribute('data-level');
        this.currentLevel = selectedLevel;
        this.applyFilters();
      });
    });

    // Video modal functionality
    this.videoCards.forEach(card => {
      card.addEventListener('click', (e) => {
        const stroke = card.getAttribute('data-stroke');
        this.openVideoModal(stroke);
      });
    });

    // Close modal functionality
    this.closeModal?.addEventListener('click', () => {
      this.closeVideoModal();
    });

    // Close modal when clicking outside
    this.videoModal?.addEventListener('click', (e) => {
      if (e.target === this.videoModal) {
        this.closeVideoModal();
      }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.videoModal.style.display === 'block') {
        this.closeVideoModal();
      }
    });

    // Initial filter application
    this.applyFilters();
  }

  filterTrainingPlans(level) {
    const trainingGrid = document.getElementById('trainingGrid');
    
    // Clear existing training plans
    while (trainingGrid.firstChild) {
      if (trainingGrid.firstChild.classList && trainingGrid.firstChild.classList.contains('training-card-3d')) {
        trainingGrid.removeChild(trainingGrid.firstChild);
      } else {
        break; // Stop when we reach non-training-card elements
      }
    }
    
    // Generate 30 training plans for the selected level
    for (let i = 0; i < 30; i++) {
      const plan = this.generateTrainingPlan(level, i + 1);
      trainingGrid.insertAdjacentHTML('beforeend', plan);
    }
  }
  
  // Apply filters to both videos and training plans
  applyFilters() {
    // Filter videos by stroke
    this.videoCards.forEach(video => {
      const videoStroke = video.getAttribute('data-stroke');
      
      // Check if video matches current stroke filter
      const strokeMatch = this.currentStroke === 'all' || videoStroke === this.currentStroke;
      
      // Check if video matches current level filter
      const levelMatch = this.currentLevel === 'all' || video.hasAttribute('data-level') && video.getAttribute('data-level') === this.currentLevel;
      
      if (strokeMatch && levelMatch) {
        video.classList.remove('hide');
        video.classList.add('show');
      } else {
        video.classList.remove('show');
        video.classList.add('hide');
      }
    });
    
    // Filter training plans by level (and potentially stroke if needed)
    this.trainingCards.forEach(plan => {
      const planLevel = plan.getAttribute('data-level') || 'all';
      
      // Check if plan matches current level filter
      const levelMatch = this.currentLevel === 'all' || planLevel === this.currentLevel;
      
      if (levelMatch) {
        plan.classList.remove('hide');
        plan.classList.add('show');
      } else {
        plan.classList.remove('show');
        plan.classList.add('hide');
      }
    });
    
    // If we're filtering by level, regenerate training plans
    if (this.currentLevel !== 'all') {
      this.filterTrainingPlans(this.currentLevel);
    }
  }
  
  generateTrainingPlan(level, planNumber) {
    // Define different training plans based on level
    const warmupSets = {
      beginner: [
        '200m easy Freestyle',
        '4 × 25m Freestyle (breathing drills)',
        '100m easy Backstroke',
        '100m easy Breaststroke'
      ],
      semipro: [
        '400m continuous Freestyle',
        '8 × 25m drills (catch-up, fingertip)',
        '200m technique focus',
        '4 × 50m build speed'
      ],
      professional: [
        '600m continuous Freestyle',
        '12 × 50m technique drills (various strokes)',
        '8 × 50m build to race pace',
        '200m IM order'
      ]
    };
    
    const mainSets = {
      beginner: [
        '8 × 50m Freestyle @ moderate, 45s rest',
        '4 × 25m Backstroke (easy pace)',
        '6 × 50m Mixed strokes, 30s rest',
        '4 × 25m Choice stroke, 40s rest'
      ],
      semipro: [
        '10 × 100m Freestyle @ steady, 25s rest',
        '200m Backstroke (moderate)',
        '4 × 50m Breaststroke, 30s rest',
        '8 × 50m Choice stroke @ 85% effort, 30s rest'
      ],
      professional: [
        '5 × 200m Freestyle @ threshold, 40s rest',
        '10 × 100m IM order, 30s rest',
        '400m Backstroke (negative split)',
        '8 × 50m Butterfly sprint, 45s rest'
      ]
    };
    
    const cooldownSets = {
      beginner: [
        '200m easy Freestyle',
        '100m easy choice stroke',
        '150m easy mixed strokes'
      ],
      semipro: [
        '200m easy mixed strokes',
        '200m easy choice stroke',
        '300m easy mixed strokes'
      ],
      professional: [
        '200m easy Breaststroke',
        '200m easy Freestyle',
        '400m easy mixed strokes'
      ]
    };
    
    // Select random exercises from each category
    const warmup = this.getRandomExercise(warmupSets[level]);
    const mainSet = this.getRandomExercise(mainSets[level]);
    const cooldown = this.getRandomExercise(cooldownSets[level]);
    
    // Determine duration based on level
    let duration = '30 min';
    if (level === 'semipro') duration = '45 min';
    if (level === 'professional') duration = '60 min';
    
    // Generate the training plan HTML
    return `
      <div class="training-card-3d">
        <div class="training-header">
          <h3>${level.charAt(0).toUpperCase() + level.slice(1)} Training Plan #${planNumber}</h3>
          <span class="duration"><i class="fas fa-clock"></i> ${duration}</span>
        </div>
        <div class="training-body">
          <div class="phase">
            <h4><i class="fas fa-fire"></i> Warm-up (${Math.floor(parseInt(duration.split(' ')[0]) * 0.25)} min)</h4>
            <ul>
              <li>${warmup}</li>
            </ul>
          </div>
          <div class="phase">
            <h4><i class="fas fa-bolt"></i> Main Set (${Math.floor(parseInt(duration.split(' ')[0]) * 0.6)} min)</h4>
            <ul>
              <li>${mainSet}</li>
            </ul>
          </div>
          <div class="phase">
            <h4><i class="fas fa-wind"></i> Cool-down (${Math.floor(parseInt(duration.split(' ')[0]) * 0.15)} min)</h4>
            <ul>
              <li>${cooldown}</li>
            </ul>
          </div>
        </div>
        <button class="btn-neon">Start Workout</button>
      </div>
    `;
  }
  
  getRandomExercise(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  openVideoModal(stroke) {
    let videoUrl = '';
    switch(stroke) {
      case 'freestyle':
        videoUrl = 'https://www.youtube.com/embed/AQy_c30lNjI?si=umw3-imKZPaD376_';
        break;
      case 'back':
        videoUrl = 'https://www.youtube.com/embed/MrFt6JHii8w?si=Nv6zeVitYoz0lmAJ';
        break;
      case 'breaststroke':
        videoUrl = 'https://www.youtube.com/embed/EElzlIMjk_c?si=75lbn_vWCb6W-THJ';
        break;
      case 'butterfly':
        videoUrl = 'https://www.youtube.com/embed/x-CB6aD4S2s?si=_YoDDmxw8V8LMPC2';
        break;
      default:
        videoUrl = '';
    }

    if (videoUrl) {
      this.videoFrame.src = videoUrl;
      this.videoModal.style.display = 'block';
      document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
    }
  }

  closeVideoModal() {
    this.videoModal.style.display = 'none';
    this.videoFrame.src = ''; // Stop video when closing
    document.body.style.overflow = 'auto'; // Re-enable scrolling
  }
}

// ========== INITIALIZE APP ==========
let sessionLogger;
let navigation;
let auth;
let trainingLevels;

document.addEventListener('DOMContentLoaded', () => {
  console.log('%c🏊 AquaTrack Pro Initialized', 'color: #00d4ff; font-size: 16px; font-weight: bold;');
  
  // Initialize components
  new ParticleSystem();
  navigation = new Navigation();
  auth = new Authentication();
  new AIChatbot();
  new PerformanceChart();
  new Forms(auth);
  new ScrollAnimations();
  sessionLogger = new SessionLogger();
  trainingLevels = new TrainingLevels();

  // Get started button - go to signup
  const getStartedBtn = document.getElementById('get-started');
  if (getStartedBtn) {
    getStartedBtn.addEventListener('click', () => {
      navigation.showSection('signup');
      document.querySelector('a[href="#signup"]').classList.add('active');
      document.querySelectorAll('.nav-link').forEach(l => {
        if (l.getAttribute('href') !== '#signup') l.classList.remove('active');
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Nav action buttons (Login/Signup)
  document.querySelectorAll('.nav-actions a').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = btn.getAttribute('href').substring(1);
      navigation.showSection(targetId);
      
      // Update nav active state
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      const navLink = document.querySelector(`.nav-link[href="#${targetId}"]`);
      if (navLink) navLink.classList.add('active');
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  // Training workout buttons
  document.querySelectorAll('.training-card-3d button').forEach(btn => {
    btn.addEventListener('click', () => {
      alert('Workout started! Timer and tracking features coming soon in the full version.');
    });
  });

  // Video cards - Remove duplicate event listener since handled in TrainingLevels class
  // The video card click functionality is handled in the TrainingLevels class

  // Quick navigation cards on home page
  document.querySelectorAll('.quick-nav-card').forEach(card => {
    card.addEventListener('click', () => {
      const targetPage = card.getAttribute('data-page');
      if (targetPage) {
        navigation.showSection(targetPage);
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        const navLink = document.querySelector(`a[href="#${targetPage}"]`);
        if (navLink) navLink.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });

  console.log('%c✅ All systems ready!', 'color: #00ff88; font-weight: bold;');
});
