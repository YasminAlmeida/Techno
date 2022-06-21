const vw = new Vue({
  el: '#app',
  data: {
    produtos: [],
    produto: false,
    carrinhoapi: [],
    mensagemAlerta: 'Item selecionado',
    alertaAtivo: false,
    ModalCarrinhoAtivo: false,
  },
  filters: {
    numeroPreco(valor) {
      // return `R$ ${valor},00`;
      return valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      });
    },
  },
  computed: {
    carrinhoTotal() {
      let total = 0;
      if (this.carrinhoapi.length) {
        this.carrinhoapi.forEach((item) => {
          total += item.preco;
        });
      }
      return total;
    },
  },
  methods: {
    fetchProdutos() {
      fetch('./api/produtos.json')
        .then((r) => r.json())
        .then((r) => {
          this.produtos = r;
        });
    },

    fetchProduto(id) {
      fetch(`./api/produtos/${id}/dados.json`)
        .then((r) => r.json())
        .then((r) => {
          this.produto = r;
        });
    },

    abrirModal(id) {
      this.fetchProduto(id);
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    },

    fecharModal({ target, currentTarget }) {
      if (target === currentTarget) this.produto = false;
    },

    fecharModalCarrinho({ target, currentTarget }) {
      if (target === currentTarget) this.ModalCarrinhoAtivo = false;
    },
    adicionarCarrinho() {
      this.produto.estoque--;
      const { id, nome, preco } = this.produto;
      this.carrinhoapi.push({ id, nome, preco });
      this.alerta(`${nome} adicionado ao carrinho.`);
    },
    removerCarrinho(index) {
      this.carrinhoapi.splice(index, 1);
    },
    alerta(mensagem) {
      this.mensagemAlerta = mensagem;
      this.alertaAtivo = true;
      setTimeout(() => {
        this.alertaAtivo = false;
      }, 1000);
    },
    checarLocalStorage() {
      if (window.localStorage.carrinhoapi) {
        this.carrinhoapi = JSON.parse(window.localStorage.carrinhoapi);
      }
    },

    router() {
      const hash = document.location.hash;
      console.log(hash);
      if (hash) {
        this.fetchProduto(hash.replace('#', ''));
      }
    },
  },
  watch: {
    produto() {
      document.title = this.produto.nome || 'Techno';
      const hash = this.produto.id || 'index.html';
      carrinhoapi.push(null, null, `${hash}`);
    },
    carrinho() {
      window.localStorage.carrinhoapi = JSON.stringify(this.carrinhoapi);
    },
  },
  created() {
    this.fetchProdutos();
    this.checarLocalStorage();
    this.router();
  },
});
