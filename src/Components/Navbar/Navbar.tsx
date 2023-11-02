import React from 'react';
import {
    Box,
    Flex,
    Avatar,
    Button,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    useColorModeValue,
    Stack,
    useColorMode,
    Center,
    Link as ChakraLink,
    Heading,
    Link,
} from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';

import { Link as ReactRouterLink } from 'react-router-dom';

const Navbar = () => {
    const { colorMode, toggleColorMode } = useColorMode();
    return (
        <>
            <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
                <Flex
                    h={16}
                    alignItems={'center'}
                    justifyContent={'space-between'}>
                    <Flex gap='8' alignItems={'center'}>
                        <Heading fontSize='xl'>Password Manager</Heading>
                        <Link as={ReactRouterLink} to='/file-storage'>
                            File Storage
                        </Link>
                    </Flex>
                    <Flex alignItems={'center'} gap='8'>
                        <Button onClick={toggleColorMode} variant='ghost'>
                            {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                        </Button>
                        <Menu>
                            <MenuButton
                                as={Button}
                                rounded={'full'}
                                variant={'link'}
                                cursor={'pointer'}
                                minW={0}>
                                <Avatar
                                    size={'sm'}
                                    src={
                                        'https://avatars.dicebear.com/api/male/username.svg'
                                    }
                                />
                            </MenuButton>
                            <MenuList alignItems={'center'}>
                                <br />
                                <Center>
                                    <Avatar
                                        size={'2xl'}
                                        src={
                                            'https://avatars.dicebear.com/api/male/username.svg'
                                        }
                                    />
                                </Center>
                                <br />
                                <Center>
                                    <p>username</p>
                                </Center>
                                <br />
                                <MenuDivider />
                                <MenuItem>
                                    <ChakraLink
                                        as={ReactRouterLink}
                                        to='/'
                                        onClick={() => {
                                            window.electronAPI.logout();
                                        }}>
                                        Logout
                                    </ChakraLink>
                                </MenuItem>
                            </MenuList>
                        </Menu>
                    </Flex>
                </Flex>
            </Box>
        </>
    );
};

export default Navbar;
