import React, { useEffect } from 'react';

import {
    Button,
    Heading,
    Input,
    InputGroup,
    Box,
    Stack,
    InputLeftElement,
    Icon,
    Table,
    Text,
    useDisclosure,
    TableContainer,
    Tbody,
    Td,
    Tfoot,
    Th,
    Thead,
    Tr,
    Image,
    InputRightElement,
    Tooltip,
    useToast,
    Flex,
} from '@chakra-ui/react';

import { AiOutlineSearch } from 'react-icons/ai';
import { CgPassword } from 'react-icons/cg';
import { HiOutlineShieldExclamation, HiOutlineDuplicate } from 'react-icons/hi';

import Navbar from '../../Components/Navbar/Navbar';
import AddPasswordModal from './AddPasswordModal';
import {
    addPasswordWarnings,
    filterObjectsByInput,
    countObjectsWithWarnings,
    countDuplicatePasswords,
    markDuplicatePasswords,
} from '../../utils/passwordManagerUtils';
import Password from '../../Components/Password/Password';
import Carousel from '../../Components/Carousel/Carousel';
import { PasswordData } from '../../types/passwordType';

function PasswordManager() {
    const [passwords, setPasswords] = React.useState([]);
    const [filteredPasswords, setFilteredPasswords] = React.useState([]);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [show, setShow] = React.useState(false);

    const toast = useToast();

    useEffect(() => {
        const fetchPasswordsData = async () =>
            await window.electronAPI.getPasswordsData();

        fetchPasswordsData().then(passwordsData => {
            addPasswordWarnings(passwordsData);
            markDuplicatePasswords(passwordsData);

            setPasswords(passwordsData);
            setFilteredPasswords(passwordsData);
        });
    }, []);

    return (
        <>
            <Navbar />
            <Stack spacing='4' px='4'>
                <Box
                    display='flex'
                    mt='8'
                    gap='8'
                    alignItems='center'
                    justifyContent='center'>
                    <Button boxShadow='xl' onClick={onOpen}>
                        Add Password
                    </Button>
                    <InputGroup w='md' boxShadow='xl' rounded='md'>
                        <InputLeftElement>
                            <Icon as={AiOutlineSearch} color='gray' />
                        </InputLeftElement>
                        <Input
                            type='search'
                            rounded='md'
                            onChange={e =>
                                setFilteredPasswords(
                                    filterObjectsByInput(
                                        passwords,
                                        e.target.value
                                    )
                                )
                            }
                            placeholder='Search for passwords'></Input>
                    </InputGroup>
                    <Button
                        boxShadow='xl'
                        onClick={async () => {
                            window.electronAPI
                                .exportTo(passwords)
                                .then(result => {
                                    toast({
                                        title: 'Export Status',
                                        description:
                                            'Passwords exported successfully',
                                        status: 'info',
                                        duration: 5000,
                                        isClosable: true,
                                    });
                                })
                                .catch(error => {
                                    toast({
                                        title: 'Error',
                                        description: error.message,
                                        status: 'error',
                                        duration: 5000,
                                        isClosable: true,
                                    });
                                });
                        }}>
                        Export passwords
                    </Button>
                </Box>

                <AddPasswordModal isOpen={isOpen} onClose={onClose} />
                <Flex display='flex' gap='4'>
                    <Box>
                        <Box boxShadow='xl' rounded='md' p='8'>
                            <Icon as={CgPassword} fontSize='3xl'></Icon>
                            <Heading>
                                {passwords ? passwords?.length : '0'}
                            </Heading>
                            <Text>Total saved passwords</Text>
                        </Box>
                        <Box boxShadow='xl' rounded='md' p='8'>
                            <Icon
                                as={HiOutlineShieldExclamation}
                                fontSize='3xl'
                            />
                            <Heading>
                                {passwords &&
                                    countObjectsWithWarnings(passwords)}
                            </Heading>
                            <Text>Total weak passwords</Text>
                        </Box>
                        <Box boxShadow='xl' rounded='md' p='8'>
                            <Icon as={HiOutlineDuplicate} fontSize='3xl' />
                            <Heading>
                                {passwords &&
                                    countDuplicatePasswords(
                                        passwords.map(
                                            password => password.password
                                        )
                                    )}
                            </Heading>
                            <Text>Total duplicate passwords</Text>
                        </Box>
                    </Box>
                    <Box flexGrow='1'>
                        {passwords ? (
                            <TableContainer>
                                <Table variant='simple'>
                                    <Thead>
                                        <Tr>
                                            <Th>Website</Th>
                                            <Th>E-mail \ Username</Th>
                                            <Th>Password</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {filteredPasswords.map(password => (
                                            <Tr key={password.id}>
                                                <Td>
                                                    <Box display='flex' gap='2'>
                                                        <Image
                                                            src={
                                                                password.domain
                                                                    ? `https://www.google.com/s2/favicons?domain=${password.domain}&sz=64`
                                                                    : ''
                                                            }
                                                            alt='favicon'
                                                            boxSize='6'
                                                        />
                                                        {password.domain}
                                                    </Box>
                                                </Td>
                                                <Td>{password.email}</Td>
                                                <Td>
                                                    <Password
                                                        passwords={passwords}
                                                        password={password}
                                                    />
                                                </Td>
                                            </Tr>
                                        ))}
                                    </Tbody>
                                </Table>
                            </TableContainer>
                        ) : (
                            <Text>No passwords saved yet</Text>
                        )}
                    </Box>
                </Flex>
            </Stack>
        </>
    );
}

export default PasswordManager;
