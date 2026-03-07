import { Tabs } from "expo-router";
import {Stack} from "expo-router";

export default function TabLayout() {
  return (
    <Stack screenOptions={{
		headerStyle: {
			backgroundColor: 'white',
		},
		headerTintColor: 'grey',
		headerTitleStyle: {
			fontWeight: 'bold',
			color: "purple"
		},
		headerShown: false,
      }}>
		<Stack.Screen 
		name="login" 
		options={{
			title:"login", 
			contentStyle: {backgroundColor: "white"},
		}}/>
    <Stack.Screen 
		name="register" 
		options={{
			title:"register", 
			contentStyle: {backgroundColor: "white"},
		}}/>
	    </Stack>
      
  );
}