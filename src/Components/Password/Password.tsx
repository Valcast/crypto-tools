import {
    InputGroup,
    Input,
    InputRightElement,
    Tooltip,
    Icon,
    Button,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    IconButton,
    Box,
} from '@chakra-ui/react';
import React from 'react';
import { HiOutlineDuplicate, HiOutlineShieldExclamation } from 'react-icons/hi';
import { PasswordData } from '../../types/passwordType';
import { ChevronDownIcon } from '@chakra-ui/icons';

export default function Password({
    passwords,
    password,
}: {
    passwords: PasswordData[];
    password: PasswordData;
}) {
    const [show, setShow] = React.useState(false);

    return (
        <Box display='flex'>
            <InputGroup>
                <Input
                    value={password.password}
                    readOnly
                    border='none'
                    onClick={() => setShow(!show)}
                    type={show ? 'text' : 'password'}
                    _hover={{
                        cursor: 'pointer',
                    }}
                />

                <InputRightElement>
                    {password.duplicates.length > 0 && (
                        <Tooltip
                            hasArrow
                            whiteSpace='pre-line'
                            label={`${passwords
                                .filter(pass =>
                                    password.duplicates.includes(pass.id)
                                )
                                .map(pass => `${pass.domain} - ${pass.email}`)
                                .join('\n')} \nhave the same password`}>
                            <span>
                                <Icon
                                    as={HiOutlineDuplicate}
                                    fontSize='xl'
                                    color='yellow'
                                />
                            </span>
                        </Tooltip>
                    )}

                    {password.warnings.length > 0 && (
                        <Tooltip
                            hasArrow
                            whiteSpace='pre-line'
                            label={`${password.warnings.join('\n')}`}>
                            <span>
                                <Icon
                                    as={HiOutlineShieldExclamation}
                                    fontSize='xl'
                                    color='red'
                                />
                            </span>
                        </Tooltip>
                    )}
                </InputRightElement>
            </InputGroup>
            <Menu>
                <MenuButton
                    as={IconButton}
                    icon={<ChevronDownIcon />}
                    variant='ghost'
                />
                <MenuList>
                    <MenuItem
                        onClick={async () => {
                            try {
                                await window.electronAPI.deletePassword(
                                    password.id
                                );
                                window.location.reload();
                            } catch (error) {
                                console.log(error);
                            }
                        }}
                        color='red.400'>
                        Delete
                    </MenuItem>
                </MenuList>
            </Menu>
        </Box>
    );
}
