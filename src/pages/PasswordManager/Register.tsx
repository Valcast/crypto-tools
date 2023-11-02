import {
    Heading,
    Stack,
    InputGroup,
    Input,
    InputRightElement,
    Button,
    Box,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import React from 'react';

const Register = () => {
    const formik = useFormik({
        initialValues: {
            email: '',
            username: '',
            password: '',
            password2: '',
        },
        onSubmit: async values => {
            try {
                await window.electronAPI.sendRegisterData(values);
                window.location.href = '/login';
            } catch (err) {
                console.log(err);
            }
        },
    });

    return (
        <Box>
            <Heading textAlign='center' my='8'>
                Register
            </Heading>
            <form onSubmit={formik.handleSubmit}>
                <Stack
                    display='flex'
                    flexDir='column'
                    alignItems='center'
                    justifyContent='center'
                    spacing='4'>
                    <InputGroup w='md'>
                        <Input
                            id='email'
                            name='email'
                            placeholder='email'
                            type='email'
                            value={formik.values.email}
                            onChange={formik.handleChange}
                        />
                    </InputGroup>
                    <InputGroup w='md'>
                        <Input
                            id='username'
                            name='username'
                            placeholder='username'
                            type='text'
                            value={formik.values.username}
                            onChange={formik.handleChange}
                        />
                    </InputGroup>
                    <InputGroup w='md'>
                        <Input
                            id='password'
                            name='password'
                            placeholder='password'
                            type='password'
                            value={formik.values.password}
                            onChange={formik.handleChange}
                        />
                    </InputGroup>
                    <InputGroup w='md'>
                        <Input
                            id='password2'
                            name='password2'
                            placeholder='confirm password'
                            type='password'
                            value={formik.values.password2}
                            onChange={formik.handleChange}
                        />
                    </InputGroup>
                    <Button type='submit' w='2xs'>
                        Register
                    </Button>
                </Stack>
            </form>
        </Box>
    );
};

export default Register;
