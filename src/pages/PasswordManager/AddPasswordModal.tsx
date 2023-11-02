import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    Stack,
    InputGroup,
    InputLeftElement,
    Icon,
    Input,
    InputRightElement,
    Button,
    useToast,
    Text,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import React from "react";
import { AiOutlineMail } from "react-icons/ai";
import { CgWebsite } from "react-icons/cg";
import { MdOutlinePassword } from "react-icons/md";

function generatePassword() {
    let password = "";
    const length = 16;
    const charset =
        "@#$&*0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$&*0123456789abcdefghijklmnopqrstuvwxyz";
    for (let i = 0, n = charset.length; i < length; ++i) {
        password += charset.charAt(Math.floor(Math.random() * n));
    }
    return password;
}

export default function AddPasswordModal({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) {
    const [show, setShow] = React.useState(false);
    const toast = useToast();

    const formik = useFormik({
        initialValues: {
            domain: "",
            email: "",
            password: "",
        },
        onSubmit: async values => {
            const result = await window.electronAPI.addPassword(values);
            console.log(result);
            if (result) {
                window.location.href = "/password-manager";
            }
        },
    });

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />

            <ModalContent pb='8'>
                <ModalHeader>Add New Password</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <form onSubmit={formik.handleSubmit}>
                        <Stack
                            spacing='6'
                            display='flex'
                            flexDir='column'
                            justifyContent='center'
                            alignItems='center'
                            w='sm'>
                            <InputGroup>
                                {" "}
                                <InputLeftElement>
                                    <Icon as={CgWebsite} />
                                </InputLeftElement>
                                <Input
                                    id='domain'
                                    placeholder='Domain'
                                    name='domain'
                                    type='text'
                                    onChange={formik.handleChange}
                                    value={formik.values.domain}
                                />
                            </InputGroup>
                            <InputGroup>
                                {" "}
                                <InputLeftElement>
                                    <Icon as={AiOutlineMail} />
                                </InputLeftElement>
                                <Input
                                    id='email'
                                    placeholder='Email or Username'
                                    name='email'
                                    type='text'
                                    onChange={formik.handleChange}
                                    value={formik.values.email}
                                />
                            </InputGroup>
                            <InputGroup>
                                <InputLeftElement>
                                    <Icon as={MdOutlinePassword} />
                                </InputLeftElement>
                                <Input
                                    id='password'
                                    placeholder='Password'
                                    name='password'
                                    type={show ? "text" : "password"}
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                />
                                <InputRightElement width='4.5rem'>
                                    <Button
                                        h='1.75rem'
                                        size='sm'
                                        onClick={() => setShow(!show)}>
                                        {show ? "Hide" : "Show"}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                            <Text fontSize='xs' whiteSpace='pre-line'>
                                {`A strong password should contain:
                                    - at least 8 characters.
                                    - at least one uppercase letter (A-Z).
                                    - at least one lowercase letter (a-z).
                                    - at least one digit (0-9).
                                    - at least one special character (e.g., !@#$%^&*)."`}
                            </Text>
                            <Button
                                w='xs'
                                onClick={() => {
                                    const password = generatePassword();
                                    formik.setFieldValue("password", password);
                                    navigator.clipboard.writeText(password);
                                    toast({
                                        title: "Copied",
                                        description:
                                            "Generated password copied to clipboard",
                                        status: "info",
                                        duration: 5000,
                                        isClosable: true,
                                    });
                                }}>
                                Generate Strong Password
                            </Button>

                            <Button type='submit' w='xs'>
                                Save Password
                            </Button>
                        </Stack>
                    </form>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}
