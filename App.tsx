import React from 'react';
import { View } from 'react-native';
import MainNavigator from './src/navigation/MainNavigator';
import { UserProvider } from './src/context/UserContext';

const App = () => {
  return (
    <View style={{ flex: 1 }}>
      <UserProvider>
          <MainNavigator />
      </UserProvider>
    </View>
    
  );

};

export default App;