// api end point를 상수처리 해두면 나중에 변경 되었을 경우 처리하기 쉬움
const API_END_POINT = '...';

export const request = async nodeId => {
  // nodeId 유무에 따라 root directory 를 조회할지 특정 directory를 조회할지 처리
  try {
    // const res = await fetch(`${API_END_POINT}/${nodeId ? nodeId : ''}`);
    // if (!res.ok) {
    //   throw new Error('server error');
    // }
    // return res.json();
    return [
      {
        id: '5',
        name: '2021/04',
        type: 'DIRECTORY',
        filePath: null,
        parent: {
          id: '1'
        }
      },
      {
        id: '19',
        name: '물 마시는 사진',
        type: 'FILE',
        filePath: '/images/jslee.png',
        parent: {
          id: '1'
        }
      }
    ];
  } catch (e) {
    throw new Error(e.message);
  }
};
