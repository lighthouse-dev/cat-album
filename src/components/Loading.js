function loading({ $app, initialState }) {
  this.state = initialState;
  this.$target = document.createElement('div');
  this.$target.className = 'Loading Modal';

  $app.appendChild(this.$target);

  this.setState = nextState => {
    this.state = nextState;
    this.render();
  };

  this.render = () => {
    this.$target.innerHTML = `<div class="content">...Loading</div>`;
    debugger;
    this.$target.style.display = this.state ? 'block' : 'none';
  };

  this.render();
}

export default loading;
