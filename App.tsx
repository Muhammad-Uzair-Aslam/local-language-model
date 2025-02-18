import 'react-native-reanimated'
import React from 'react';
import {SafeAreaView} from 'react-native';
import MainNavigator from './src/navigation/MainNavigator';

function App(): React.JSX.Element {
  return (
    <SafeAreaView style={{flex: 1}}>
      <MainNavigator/>
    </SafeAreaView>
  );
}

export default App;