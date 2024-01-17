// components react native
import { NavigationContainer } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "react-query";
import { StatusBar } from "expo-status-bar";

// components native base
import { NativeBaseProvider, extendTheme } from "native-base";
import { SSRProvider } from "@react-aria/ssr";
// SSRProvider to fixed In React 18, SSRProvider is not necessary and is a noop. You can remove it from your app

// components
import Containers from "./src/Containers";
import { UserContextProvider } from "./src/Context/UserContext";
// -------------------------------------------------------

export default function App() {
  // setup react query
  const client = new QueryClient();

  const customeColor = {
    brand: {
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
  };

  // setup native base
  const theme = extendTheme({ colors: customeColor });

  return (
    <QueryClientProvider client={client}>
      <UserContextProvider>
        <StatusBar style="auto" />
        <NavigationContainer>
          <SSRProvider>
            <NativeBaseProvider theme={theme}>
              <Containers />
            </NativeBaseProvider>
          </SSRProvider>
        </NavigationContainer>
      </UserContextProvider>
    </QueryClientProvider>
  );
}
