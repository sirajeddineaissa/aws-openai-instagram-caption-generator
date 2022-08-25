import {
  Box,
  Button,
  chakra,
  GridItem,
  Heading,
  Input,
  SimpleGrid
} from "@chakra-ui/react";
import { useState } from "react";
import ResultCard from "./ResultCard";

const Form: React.FC = () => {
  const endpoint =
    "https://p53lueoew9.execute-api.eu-west-3.amazonaws.com/prod/generate_caption_and_words";
  const [theme, setTheme] = useState("");
  const [caption, setCaption] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("Generate");

  const fetchOnSubmit = () => {
    setIsLoading(true);
    setStatus("Generating");
    fetch(`${endpoint}?theme=${theme}`)
      .then((res) => res.json())
      .then((data) => {
        setCaption(data.caption);
        setKeywords(data.keywords);
        setIsLoading(false);
        setStatus("Regenerate");
      })
      .catch((error) => {
        setIsLoading(false);
        setStatus("Retry");
        console.log(error);
      });
  };

  const onEnterPress: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") fetchOnSubmit();
  };

  return (
    <Box px={4} py={32} mx="auto">
      <Box
        w={{ base: "full", md: 11 / 12, xl: 8 / 12 }}
        textAlign={{ base: "left", md: "center" }}
        mx="auto"
      >
        <Heading
          mb={3}
          fontSize={{ base: "4xl", md: "5xl" }}
          fontWeight={{ base: "bold", md: "extrabold" }}
          color="gray.900"
          _dark={{ color: "gray.100" }}
          lineHeight="shorter"
        >
          Instagram Caption/Keywords Generator
        </Heading>
        <chakra.p
          mb={6}
          fontSize={{ base: "lg", md: "xl" }}
          color="gray.500"
          lineHeight="base"
        >
          Built using the OpenAI API for content generation and FastAPI as the
          API framework and delivered via an API Gateway using AWS Lambda.
        </chakra.p>
        <SimpleGrid
          w={{ base: "full", md: 7 / 12 }}
          columns={{ base: 1, lg: 6 }}
          spacing={3}
          pt={1}
          mx="auto"
          mb={8}
        >
          <GridItem as="label" colSpan={{ base: "auto", lg: 4 }}>
            <Input
              mt={0}
              size="lg"
              type="text"
              placeholder="Type a caption..."
              value={theme}
              onChange={(e) => setTheme(e.currentTarget.value)}
              onKeyDown={onEnterPress}
              required
            />
          </GridItem>
          <Button
            as={GridItem}
            w="full"
            variant="solid"
            colSpan={{ base: "auto", lg: 2 }}
            size="lg"
            type="submit"
            colorScheme="blue"
            cursor="pointer"
            onClick={fetchOnSubmit}
          >
            {status}
          </Button>
        </SimpleGrid>
      </Box>
      {status === "Regenerate" ? (
        <ResultCard caption={caption} keywords={keywords} />
      ) : (
        ""
      )}
    </Box>
  );
};

export default Form;
