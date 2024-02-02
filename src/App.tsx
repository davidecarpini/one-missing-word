import { useState } from "react";
import "./App.css";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Container,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { wordlist } from "./wordlist";

function App() {
  const [mnemonic, setMnemonic] = useState<{ [key: string]: string }>({});
  const [validMnemonics, setValidMnemonics] = useState<string[][]>([]);

  // create a function that loop through the mnemonic array, add every word from bip39 wordlist in every position and if the mnemonic is valid add it to an array
  const findValidMnemonics = () => {
    setValidMnemonics([]);
    const validMnemonics: string[][] = [];
    const mnemonicArray = Object.values(mnemonic);
    for (let i = 0; i < mnemonicArray.length + 1; i++) {
      for (let j = 0; j < 5; j++) {
        const bip39Word = wordlist[j];
        const newMnemonic = [...mnemonicArray];
        newMnemonic.splice(i, 0, bip39Word);
        validMnemonics.push(newMnemonic);
      }
    }
    setValidMnemonics(validMnemonics);
  };

  return (
    <Container>
      <VStack gap={30}>
        <Heading fontSize={30}>One Missing Word</Heading>
        <Card>
          <CardHeader>
            <Text>Insert here your known words:</Text>
          </CardHeader>
          <CardBody>
            <Grid
              templateRows="repeat(1, 1fr)"
              templateColumns="repeat(3, 1fr)"
              gap={20}
            >
              {Array.from({ length: 3 }, (_, i) => (
                <GridItem key={i}>
                  <FormControl>
                    <FormLabel>Word {i + 1}</FormLabel>
                    <Input
                      key={i}
                      type="text"
                      value={mnemonic[i] || ""}
                      onChange={(e) => {
                        setMnemonic({ ...mnemonic, [i]: e.target.value });
                      }}
                    />
                  </FormControl>
                </GridItem>
              ))}
            </Grid>
          </CardBody>
        </Card>
        <Button onClick={findValidMnemonics}>Find Mnemonics</Button>
        <Card>
          <CardHeader>
            <Text>Valid Mnemonics:</Text>
          </CardHeader>
          <CardBody>
            {validMnemonics.map((validMnemonic) => (
              <VStack key={validMnemonic.join(" ")}>
                <Text>{validMnemonic.join(" ")}</Text>
              </VStack>
            ))}
          </CardBody>
        </Card>
      </VStack>
    </Container>
  );
}

export default App;
