import ImageView from './components/ImageView.js';
import Breadcrumb from './components/Breadcrumb.js';
import Nodes from './components/Nodes.js';
import { request } from './utils/Api.js';
import Loading from './components/Loading.js';

// nodeId: nodes 형태로 데이터를 불러올 때마다 이곳에 데이터를 쌓는다
const cache = {};

function App($app) {
  this.state = {
    isRoot: true,
    nodes: [],
    depth: [],
    selectedFilePath: null
  };

  const imageView = new ImageView({
    $app,
    initialState: this.state.selectedNodeImage
  });

  const loading = new Loading({ $app, initialState: this.state.isLoading });

  this.setState = nextState => {
    this.state = nextState;
    breadcrumb.setState(this.state.depth);
    nodes.setState({
      isRoot: this.state.isRoot,
      nodes: this.state.nodes
    });
    imageView.setState(this.state.selectedFilePath);

    loading.setState(this.state.isLoading);
  };

  const breadcrumb = new Breadcrumb({
    $app,
    initialState: [],
    onclick: index => {
      if (index === null) {
        this.setState({
          ...this.state,
          depth: [],
          nodes: cache.root
        });
        return;
      }

      // breadcrumb에서 현재 위치를 누른 경우는 무시
      if (index === this.state.depth.length - 1) {
        return;
      }

      const nextState = { ...this.state };
      const nextDepth = this.state.depth.slice(0, index + 1);

      this.setState({
        ...nextState,
        depth: nextDepth,
        nodes: cache[nextDepth[nextDepth.length - 1].id]
      });
    }
  });

  // Directory 클릭 시 데이터 불러와서 렌더링 하도록 처리하기
  const nodes = new Nodes({
    $app,
    initialState: [],
    onClick: async node => {
      try {
        if (node.type === 'DIRECTORY') {
          if (cache[node.id]) {
            this.setState({
              ...this.state,
              depth: [...this.state.depth, node],
              nodes: nextNodes
            });
          } else {
            const nextNodes = await request(node.id);
            this.setState({
              ...this.state,
              depth: [...this.state.depth, node],
              nodes: nextNodes
            });

            cache[node.id] = nextNodes;
          }
        } else if (node.types === 'FILE') {
          this.setState({
            ...this.state,
            selectedFilePath: node.filePath
          });
        }
      } catch (e) {
        // TODO: 에러 처리하기
      }
    },
    onBackClick: async () => {
      try {
        //  이전 state를 복사하여 처리
        const nextState = { ...this.state };
        nextState.depth.pop();

        const prevNodeId =
          nextState.depth.length === 0
            ? null
            : nextState.depth[nextState.depth.length - 1].id;

        // 현재 구현된 코드에서는 불러오는 모든 데이터를 cache에 넣고 있으므로
        // 이전으로 돌아가는 경우 이전 데이터가 cache에 존재해야 정상
        if (prevNodeId === null) {
          const rootNodes = await request();
          this.setState({
            ...nextState,
            isRoot: true,
            nodes: cache.rootNodes
          });
        } else {
          this.setSate({
            ...nextNodes,
            isRoot: false,
            nodes: cache[prevNodes]
          });
        }
      } catch (e) {
        // TODO: 에러처리
      }
    }
  });

  const init = async () => {
    this.setState({
      ...this.state,
      isLoading: true
    });

    try {
      const rootNodes = await request();

      this.setState({
        ...this.state,
        isLoading: false,
        isRoot: true,
        nodes: rootNodes
      });

      cache.root = rootNodes;
    } catch (e) {
      // TODO: 에러처리
    } finally {
      this.setState({
        ...this.state,
        isLoading: false
      });
    }
  };

  init();
}

export default App;
