import * as React from 'react';
import {
    Container,
    Box,
    VisuallyHidden,
    FormControl,
    Input,
    Stack,
    Button,
    Heading,
    VStack,
    Text,
    useColorModeValue,
    useColorMode,
    HStack
} from '@chakra-ui/react';
import { SunIcon, MoonIcon } from "@chakra-ui/icons"
import { AiOutlineFileAdd, AiOutlineCloudUpload, AiOutlineDelete } from "react-icons/ai"
import { FiFile } from "react-icons/fi"
const App = () => {
    const { colorMode, toggleColorMode } = useColorMode()
    const fileRef = React.useRef(null)
    const [file, setFile] = React.useState(null)
    return (
        <Container maxW="5xl" p={{ base: 5, md: 10 }} alignContent="center" justifyContent="center">
            <HStack m={5} display="flex" justifyContent="end">
                <Button onClick={toggleColorMode}>{colorMode === "dark" ? <SunIcon /> : <MoonIcon />}</Button>
            </HStack>
            <Stack spacing={4} maxW={{ base: '20rem', sm: '25rem' }} margin="0 auto">
                <Stack align="center" spacing={2}>
                    <Heading fontSize={{ base: 'xl', sm: '5xl' }}>DriveHub 📁</Heading>
                    <Text fontSize={{ base: 'sm', sm: 'xl' }}>Connecting your files, everywhere you go.</Text>
                </Stack>
                <Box pos="relative">
                    <Box
                        pos="absolute"
                        top="-7px"
                        right="-7px"
                        bottom="-7px"
                        left="-7px"
                        rounded="lg"
                        bgGradient="linear(to-l, #7928CA,#FF0080)"
                        transform="rotate(-2deg)"
                    ></Box>
                    <VStack
                        as="form"
                        pos="relative"
                        spacing={3}
                        p={6}
                        bg={useColorModeValue('white', 'gray.700')}
                        rounded="lg"
                        boxShadow="lg"
                    >
                        <FormControl id="file">
                            <VisuallyHidden>
                                <Input type="file" placeholder="Your File" rounded="md" ref={fileRef} onChange={(e) => setFile(e.target.files[0])} />
                            </VisuallyHidden>
                        </FormControl>
                        <Button
                            colorScheme='gray'
                            leftIcon={<FiFile />}
                            rounded="md"
                            w="100%"
                            disabled>
                            {file === null ? "No File Selected" : file.name}
                        </Button>
                        {file && <Button
                            colorScheme='red'
                            onClick={() => setFile(null)}
                            leftIcon={<AiOutlineDelete />}
                            rounded="md"
                            w="100%">
                            DeleteFile
                        </Button>}
                        <Button
                            colorScheme='blue'
                            leftIcon={<AiOutlineFileAdd />}
                            onClick={() => fileRef.current.click()}
                            rounded="md"
                            w="100%">
                            {file === null ? "Select File" : "Change File"}
                        </Button>
                        {file && <Button
                            colorScheme='green'
                            leftIcon={<AiOutlineCloudUpload />}
                            rounded="md"
                            w="100%">
                            Upload File
                        </Button>}
                    </VStack>
                </Box>
            </Stack>
        </Container>
    );
};

export default App;