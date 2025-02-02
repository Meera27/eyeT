<template>
  <header class="header">
    <div class="logo">
      <span class="company-name">eye<span class="highlight">T</span></span>
    </div>
    <nav class="nav-links">
      <a href="#" class="nav-link active">Home</a>
    </nav>
  </header>
</template>

<script>
export default {
  name: 'HeaderComponent'
}
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 4rem;
  background: linear-gradient(135deg, #1a1a1a 0%, #2c2c2c 100%);
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.2);
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 1000;
  box-sizing: border-box;
}

.logo {
  display: flex;
  align-items: center;
}

.company-name {
  font-size: 2rem;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 2px;
}

.highlight {
  color: #00ffcc;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-link {
  color: #ffffff;
  text-decoration: none;
  font-size: 1.1rem;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.3s ease;
  position: relative;
}

.nav-link::after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  bottom: 0;
  left: 50%;
  background-color: #00ffcc;
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.nav-link:hover::after {
  width: 100%;
}

.nav-link:hover {
  color: #00ffcc;
  transform: translateY(-2px);
}

.nav-link.active {
  color: #00ffcc;
}

.nav-link.active::after {
  width: 100%;
}

@media (max-width: 768px) {
  .header {
    padding: 1rem 2rem;
  }

  .nav-links {
    gap: 1rem;
  }

  .nav-link {
    font-size: 1rem;
    padding: 0.4rem 0.8rem;
  }
}
</style>
