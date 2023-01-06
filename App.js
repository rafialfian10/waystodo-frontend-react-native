import { extendTheme, NativeBaseProvider } from "native-base";
import Container from "./src/Container";
import {QueryClient, QueryClientProvider} from 'react-query';

export default function App() {
  const theme = extendTheme()

  // client
  const client = new QueryClient()
  return (
    // <UserContextProvider>
      <QueryClientProvider client={client}>
        <NativeBaseProvider theme={theme}>
            <Container/>
        </NativeBaseProvider>
      </QueryClientProvider>
  // </UserContextProvider>
  );
}
