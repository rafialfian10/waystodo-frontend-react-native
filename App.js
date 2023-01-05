import { extendTheme, NativeBaseProvider } from "native-base";
import Container from "./src/Container";

export default function App() {
  const theme = extendTheme()
  return (
    <NativeBaseProvider theme={theme}>
        <Container/>
    </NativeBaseProvider>
  );
}
