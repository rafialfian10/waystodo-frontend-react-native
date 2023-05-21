import { extendTheme, NativeBaseProvider } from "native-base";
import { QueryClient, QueryClientProvider } from 'react-query';
import { UserContextProvider } from "./src/Context/UserContext";
import { NavigationContainer } from '@react-navigation/native';
import Container from "./src/Container";
import AppLoading from "expo-app-loading";

export default function App() {

  // client
  const client = new QueryClient();

  // Configuration Native Base Custom Theme
  const theme = extendTheme();

  // Setup Custome Theme
  const customeColor = {
    primary: {
      50: "#E3F2F9",
      100: "#C5E4F3",
      200: "#A2D4EC",
      300: "#7AC1E4",
      400: "#47A9DA",
      500: "#0088CC",
      600: "#007AB8",
      700: "#006BA1",
      800: "#005885",
      900: "#003F5E",
    },
    amber: {
      400: "#d97706",
    },
  };

  // if (!fontsLoaded) {
  //   return <AppLoading />;
  // } else {
  
    return (
      <UserContextProvider>
        <NavigationContainer>
          <QueryClientProvider client={client}>
            <NativeBaseProvider theme={theme}>
                <Container/>
            </NativeBaseProvider>
          </QueryClientProvider>
        </NavigationContainer>
      </UserContextProvider>
    );
  }

