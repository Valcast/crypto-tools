import React from 'react';
import { Form, Link as ReactRouterLink } from 'react-router-dom';
import { useFormik } from 'formik';
import {
    Box,
    Button,
    Heading,
    Input,
    InputGroup,
    InputRightElement,
    Stack,
    Text,
    Link as ChakraLink,
} from '@chakra-ui/react';

const Login = () => {
    const [show, setShow] = React.useState(false);

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        onSubmit: async values => {
            const isLoginSuccesfull = await window.electronAPI.sendLoginData(
                values
            );
            if (isLoginSuccesfull) {
                window.location.href = '/password-manager';
            }
        },
    });

    return (
        <Stack display='flex' direction='column' align='center'>
            <Heading textAlign='center' my='8'>
                Login
            </Heading>
            <form onSubmit={formik.handleSubmit}>
                <InputGroup w='md'>
                    <Input
                        id='email'
                        name='email'
                        placeholder='email'
                        type='email'
                        onChange={formik.handleChange}
                        value={formik.values.email}
                    />
                </InputGroup>
                <InputGroup w='md'>
                    <Input
                        id='password'
                        name='password'
                        placeholder='password'
                        type={show ? 'text' : 'password'}
                        onChange={formik.handleChange}
                        value={formik.values.password}
                    />
                    <InputRightElement width='4.5rem'>
                        <Button
                            h='1.75rem'
                            size='sm'
                            onClick={() => setShow(!show)}>
                            {show ? 'Hide' : 'Show'}
                        </Button>
                    </InputRightElement>
                </InputGroup>
                <Button type='submit' w='2xs'>
                    Login
                </Button>
            </form>
            <Text>If you don't have account</Text>
            <ChakraLink as={ReactRouterLink} to='/register'>
                <Button>Register</Button>
            </ChakraLink>
        </Stack>
    );
};

export default Login;
