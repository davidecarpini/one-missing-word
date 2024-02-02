/* eslint-disable @typescript-eslint/no-explicit-any */
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
  HStack,
  Heading,
  Input,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { wordlist } from "./wordlist";
import {
  mnemonic as Mnemonic,
  address as Address,
  secp256k1,
} from "thor-devkit";

function App() {
  const [calculate, setCalculate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mnemonic, setMnemonic] = useState<{ [key: string]: string }>({});
  const [address, setAddress] = useState<string>("");
  const [validMnemonic, setValidMnemonic] = useState<string[]>();

  // create a function that loop through the mnemonic array, add every word from bip39 wordlist in every position and if the mnemonic is valid add it to an array
  const findValidMnemonics = () => {
    const mnemonicArray = Object.values(mnemonic).filter((word) => word);
    for (let i = 0; i < mnemonicArray.length + 1; i++) {
      for (let j = 0; j < 2048; j++) {
        const bip39Word = wordlist[j];
        const newMnemonic = [...mnemonicArray];
        newMnemonic.splice(i, 0, bip39Word);
        if (Mnemonic.validate(newMnemonic)) {
          const privkey = Mnemonic.derivePrivateKey(newMnemonic);
          if (
            Address.fromPublicKey(secp256k1.derivePublicKey(privkey)) == address
          ) {
            return newMnemonic;
          }
        }
      }
    }
  };

  return (
    <Container>
      <VStack>
        <Heading fontSize={30}>One Missing Word</Heading>
        <Card>
          <CardHeader>
            <Text>
              Insert here your known 11 words and your wallet address:
            </Text>
          </CardHeader>
          <CardBody>
            <HStack gap={5} justifyContent={"center"} mb={20}>
              <Button
                onClick={() => {
                  navigator.clipboard.readText().then((text) => {
                    const words = text.split(" ");
                    if (words.length) {
                      const mnemonic: { [key: string]: string } = {};
                      words.forEach((word, index) => {
                        if (index < 11) {
                          mnemonic[index] = word;
                        }
                      });
                      setMnemonic(mnemonic);
                    }
                  });
                }}
              >
                Paste 11 words
              </Button>
              <Button onClick={() => setMnemonic({})}>Clear</Button>
            </HStack>
            <Grid
              templateRows="repeat(3, 1fr)"
              templateColumns="repeat(3, 1fr)"
              gap={20}
            >
              {Array.from({ length: 11 }, (_, i) => (
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
        <Card mt={10}>
          <CardBody>
            <FormControl>
              <FormLabel>Wallet Address</FormLabel>
              <Input
                type="text"
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                }}
              />
            </FormControl>
          </CardBody>
        </Card>
        <Button
          my={20}
          onClick={async () => {
            setCalculate(true);
            setLoading(true);
            setTimeout(() => {
              setValidMnemonic(undefined);
              const newValidMnemonic = findValidMnemonics();
              setLoading(false);
              setValidMnemonic(newValidMnemonic);
            }, 1);
          }}
        >
          Find Mnemonic
        </Button>
        {calculate && (
          <Card>
            {loading ? (
              <Spinner h={20} w={20} />
            ) : (
              <>
                {validMnemonic ? (
                  <CardBody>
                    <Text>We found your mnemonic:</Text>
                    <Text color="yellow">{validMnemonic.join(" ")}</Text>
                    <Text color="red">
                      WARNING: for security reasons please move all your funds
                      in a new wallet!!
                    </Text>
                  </CardBody>
                ) : (
                  <CardBody>
                    <Text color="red">No valid mnemonic found!</Text>
                  </CardBody>
                )}
              </>
            )}
          </Card>
        )}
      </VStack>
    </Container>
  );
}

export default App;
