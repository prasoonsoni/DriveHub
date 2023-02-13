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
    HStack,
    useToast,
    Progress
} from '@chakra-ui/react';
import { SunIcon, MoonIcon } from "@chakra-ui/icons"
import { AiOutlineFileAdd, AiOutlineCloudUpload, AiOutlineDelete } from "react-icons/ai"
import { FiFile } from "react-icons/fi"
import { storage } from '../config/firebase'
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage"
const BASE_URL = process.env.REACT_APP_BASE_URL
const App = () => {
    const { colorMode, toggleColorMode } = useColorMode()
    const fileRef = React.useRef(null)
    const toast = useToast()
    const [file, setFile] = React.useState(null)

    const [progress, setProgress] = React.useState(0)
    const [uploading, setUploading] = React.useState(false)
    const [status, setStatus] = React.useState("")

    const handleSubmit = async () => {

        if (!file) {
            toast({ title: "Please Select a file.", status: "error", duration: 2000 })
            return
        }
        setUploading(true)
        setStatus("Uploading File...")
        const storageRef = ref(storage, `${file.name}`)
        const uploadTask = uploadBytesResumable(storageRef, file)
        uploadTask.on("state_changed", (snapshot) => {
            const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
            setProgress(progress)
        }, (err) => {
            toast({ title: err.message, status: "error", duration: 2000 })
        }, () => {
            getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                console.log(downloadURL)
                setStatus("Shortening URL...")
                const response = await fetch(`${BASE_URL}/short`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        "url": downloadURL,
                        "back_half": ""
                    }),
                });
                const json = await response.json()
                if (!json.success) {
                    toast({ title: json.message, status: "error", duration: 2000 })
                    return
                }
                console.log(json.shortenUrl[0])
                toast({ title: "File Uploaded Successfully", status: "success", duration: 2000 })
                setUploading(false)
                setFile(null)
                setStatus("")
            })
        })
    }

    return (
        <Container maxW="5xl" p={{ base: 5, md: 10 }} alignContent="center" justifyContent="center">
            <HStack m={5} display="flex" justifyContent="end">
                <Button colorScheme='gray' onClick={toggleColorMode}>{colorMode === "dark" ? <SunIcon /> : <MoonIcon />}</Button>
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
                            {file === null ? "No File Selected" : file.name.length < 20 ? file.name : file.name.slice(0, 20) + "..."}
                        </Button>
                        {uploading && <Progress value={progress} colorScheme='blue' w="full" rounded="md" />}
                        {uploading && <Text>{status}</Text>}
                        {file && !uploading && <Button
                            colorScheme='red'
                            onClick={() => setFile(null)}
                            leftIcon={<AiOutlineDelete />}
                            rounded="md"
                            w="100%">
                            DeleteFile
                        </Button>}
                        {!uploading && <Button
                            colorScheme='blue'
                            leftIcon={<AiOutlineFileAdd />}
                            onClick={() => fileRef.current.click()}
                            rounded="md"
                            w="100%">
                            {file === null ? "Select File" : "Change File"}
                        </Button>}
                        {file && !uploading && <Button
                            colorScheme='green'
                            onClick={handleSubmit}
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