function breadcrumb({ $app, initialState = [], onClick }) {
  this.state = initialState;

  this.$target = document.createElement('nav');
  this.$target.className = 'Breadcrumb';
  $app.appendChild(this.$target);

  this.setState = nextState => {
    this.state = nextState;
    this.render();
  };

  this.onClick = onClick;

  this.render = () => {
    this.$target.innerHTML = `<div class="nav-item">root</div>${this.state
      .map(
        (node, index) =>
          `<div class="nav-item" data-index="${index}">${node.name}</div>`
      )
      .join('')}`;
  };

  // 여기서도 이벤트 위임을 이용
  this.$target.addEventListener('click', e => {
    const $navItem = e.target.closest('.nav-item');

    if ($navItem) {
      const { index } = $navItem.dataset;
      this.onClick(index ? parseInt(index, 10) : null);
    }
  });

  this.render();
}

export default breadcrumb;
