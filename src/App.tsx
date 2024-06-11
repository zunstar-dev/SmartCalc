import * as React from 'react';
import MenuAppBar from './components/common/MenuAppBar';
import TemporaryDrawer from './components/common/TemporaryDrawer';

const App: React.FC = () => {
  return (
    <>
      <MenuAppBar />
      <TemporaryDrawer />
    </>
  );
};

export default App;
