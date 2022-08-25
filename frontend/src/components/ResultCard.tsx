import { Box, Text, Center, Stack, Badge } from "@chakra-ui/react";

interface ResultCardProps {
  caption: string;
  keywords: string[];
}

const ResultCard: React.FC<ResultCardProps> = (props) => {
  return (
    <Center py={6}>
      <Box
        maxW={"820px"}
        w={"full"}
        bg="white"
        boxShadow={"2xl"}
        rounded={"lg"}
        p={6}
        textAlign={"center"}
      >
        <Text textAlign={"center"} px={3}>
          {props.caption}
        </Text>

        <Stack align={"center"} justify={"center"} direction={"row"} mt={6}>
          {props.keywords.map((word, id) => {
            return (
              <Badge key={id} px={2} py={1} bg="white" fontWeight={"400"}>
                {word}
              </Badge>
            );
          })}
        </Stack>
      </Box>
    </Center>
  );
};

export default ResultCard;
