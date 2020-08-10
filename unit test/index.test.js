import React from 'react';
import renderer from 'react-test-renderer';

import mainBoard from "../src/board/mainBoard";

// 確認mainBoard UI顯示正常

it('mainBoard render correctly', () => {
    const showBoard = renderer
      .create(<mainBoard></mainBoard>)
      .toJSON()
    expect(showBoard).toMatchSnapshot()
})
